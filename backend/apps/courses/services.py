from decimal import Decimal
from django.db.models import F
from django.utils import timezone
from courses.models import (
    Course,
    CourseEnrollment,
    Lesson,
    LessonAttachment,
    LessonProgress,
    Quiz,
    QuizAttempt,
    QuizQuestion,
)


def record_attachment_download(attachment: LessonAttachment, user=None) -> int:
    """
    Increments download count atomically for an attachment.
    """
    LessonAttachment.objects.filter(pk=attachment.pk).update(download_count=F('download_count') + 1)
    attachment.refresh_from_db(fields=['download_count'])
    return attachment.download_count


def can_access_attachment(user, attachment: LessonAttachment) -> bool:
    """
    Server-side access control for downloading lesson attachments (MASTER_PROMPT §3 & §14).
    Rules:
    - Free preview attachment or free preview lesson: accessible to all (including visitors).
    - Free tier course: accessible to all.
    - Paid course: requires authenticated user (staff, instructor, or active learner).
    """
    if attachment.is_free_preview:
        return True

    lesson = attachment.lesson
    if lesson.is_free_preview:
        return True

    course = lesson.module.course
    if course.price_tier == Course.PriceTier.FREE:
        return True

    # For paid courses, anonymous users cannot download paid attachments
    if not user or not user.is_authenticated:
        return False

    # Staff and instructors always have access
    if user.is_staff or getattr(user, 'role', '') in ['ADMIN', 'INSTRUCTOR']:
        return True

    # In V1, authenticated users have access unless restricted by billing (F1.9)
    return True


def enroll_user_in_course(user, course: Course) -> CourseEnrollment:
    """
    Idempotently enrolls a learner into a course.
    """
    enrollment, created = CourseEnrollment.objects.get_or_create(
        user=user,
        course=course,
        defaults={'status': CourseEnrollment.Status.ACTIVE},
    )
    if not created and enrollment.status == CourseEnrollment.Status.PAUSED:
        enrollment.status = CourseEnrollment.Status.ACTIVE
        enrollment.save(update_fields=['status', 'updated_at'])
    return enrollment


def update_course_enrollment_progress(enrollment: CourseEnrollment) -> int:
    """
    Recalculates completion percentage based on published lessons in the course.
    """
    course = enrollment.course
    total_lessons = Lesson.objects.filter(
        module__course=course,
        is_published=True,
        module__is_published=True,
    ).count()

    if total_lessons == 0:
        return 0

    completed_lessons = LessonProgress.objects.filter(
        user=enrollment.user,
        lesson__module__course=course,
        lesson__is_published=True,
        is_completed=True,
    ).count()

    percentage = min(100, int((completed_lessons / total_lessons) * 100))
    enrollment.progress_percentage = percentage

    if percentage >= 100 and enrollment.status != CourseEnrollment.Status.COMPLETED:
        enrollment.status = CourseEnrollment.Status.COMPLETED
        enrollment.completed_at = timezone.now()
    elif percentage < 100 and enrollment.status == CourseEnrollment.Status.COMPLETED:
        enrollment.status = CourseEnrollment.Status.ACTIVE
        enrollment.completed_at = None

    enrollment.save(update_fields=['progress_percentage', 'status', 'completed_at', 'updated_at'])
    return percentage


def mark_lesson_completed(user, lesson: Lesson) -> tuple[LessonProgress, CourseEnrollment]:
    """
    Marks a lesson as completed for an authenticated learner, updates lesson progress,
    and updates the course enrollment progression percentage.
    """
    course = lesson.module.course
    enrollment = enroll_user_in_course(user, course)

    progress, _ = LessonProgress.objects.get_or_create(
        user=user,
        lesson=lesson,
    )
    if not progress.is_completed:
        progress.is_completed = True
        progress.completed_at = timezone.now()
        progress.save(update_fields=['is_completed', 'completed_at', 'last_accessed_at'])

    enrollment.last_lesson = lesson
    enrollment.save(update_fields=['last_lesson', 'updated_at'])

    update_course_enrollment_progress(enrollment)
    return progress, enrollment


def evaluate_quiz_submission(user, quiz: Quiz, answers: dict) -> tuple[QuizAttempt, list[dict]]:
    """
    Evaluates a learner submission for a quiz (F1.7):
    - Computes score and pass/fail against passing_score_percentage
    - Generates formative feedback explanations per question
    - Records QuizAttempt
    - If passed, automatically completes the associated lesson
    """
    questions = list(quiz.questions.prefetch_related('options').order_by('order', 'id'))
    total_questions = len(questions)

    if total_questions == 0:
        score_pct = 100
        is_passed = True
        attempt = QuizAttempt.objects.create(
            user=user,
            quiz=quiz,
            score_percentage=score_pct,
            is_passed=is_passed,
            submitted_answers=answers,
            feedback_summary=[],
        )
        return attempt, []

    earned_points = 0
    feedback_list = []

    for q in questions:
        q_id_str = str(q.id)
        user_raw = answers.get(q_id_str)
        is_correct = False
        correct_display = ""

        if q.question_type == QuizQuestion.QuestionType.NUMERIC:
            try:
                cleaned = str(user_raw).strip().replace(' ', '').replace('\xa0', '').replace(',', '.')
                user_val = Decimal(cleaned)
                is_correct = (q.numeric_target is not None and abs(user_val - q.numeric_target) < Decimal('0.01'))
                correct_display = str(q.numeric_target)
            except Exception:
                is_correct = False
                correct_display = str(q.numeric_target or '')

        elif q.question_type == QuizQuestion.QuestionType.MULTIPLE_CHOICE:
            correct_opts = set(q.options.filter(is_correct=True).values_list('id', flat=True))
            user_opts = set()
            if isinstance(user_raw, list):
                user_opts = set(int(x) for x in user_raw if str(x).isdigit())
            elif user_raw and str(user_raw).isdigit():
                user_opts = {int(user_raw)}
            is_correct = (user_opts == correct_opts)
            correct_display = ", ".join(q.options.filter(is_correct=True).values_list('text', flat=True))

        else:  # SINGLE_CHOICE or TRUE_FALSE
            correct_opt = q.options.filter(is_correct=True).first()
            if correct_opt and user_raw is not None and str(user_raw).isdigit():
                is_correct = (int(user_raw) == correct_opt.id)
            correct_display = correct_opt.text if correct_opt else ""

        if is_correct:
            earned_points += 1

        feedback_list.append({
            'question_id': q.id,
            'prompt': q.prompt,
            'question_type': q.question_type,
            'bloom_level': q.bloom_level,
            'is_correct': is_correct,
            'user_answer': user_raw,
            'correct_answer': correct_display,
            'explanation': q.explanation,
        })

    score_pct = int((earned_points / total_questions) * 100)
    is_passed = score_pct >= quiz.passing_score_percentage

    attempt = QuizAttempt.objects.create(
        user=user,
        quiz=quiz,
        score_percentage=score_pct,
        is_passed=is_passed,
        submitted_answers=answers,
        feedback_summary=feedback_list,
    )

    if is_passed and user and user.is_authenticated:
        mark_lesson_completed(user, quiz.lesson)

    return attempt, feedback_list
