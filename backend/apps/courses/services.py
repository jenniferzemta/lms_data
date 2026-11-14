import secrets
from decimal import Decimal
from django.db.models import F
from django.utils import timezone
from courses.models import (
    InteractiveExercise,
    ExerciseAttempt,
    Certificate,
    Course,
    CourseEnrollment,
    Lesson,
    LessonAnswer,
    LessonAttachment,
    LessonNote,
    LessonProgress,
    LessonQuestion,
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

    if percentage >= 100:
        if enrollment.status != CourseEnrollment.Status.COMPLETED:
            enrollment.status = CourseEnrollment.Status.COMPLETED
            enrollment.completed_at = timezone.now()
        enrollment.save(update_fields=['progress_percentage', 'status', 'completed_at', 'updated_at'])
        issue_course_certificate(enrollment)
        return percentage
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


def create_lesson_note(user, lesson: Lesson, content: str, video_timestamp_seconds: int = 0) -> LessonNote:
    """
    Creates a new learner personal note anchored to a video timecode (F1.9).
    """
    return LessonNote.objects.create(
        user=user,
        lesson=lesson,
        content=content.strip(),
        video_timestamp_seconds=max(0, video_timestamp_seconds),
    )


def delete_lesson_note(user, note_id: int) -> bool:
    """
    Deletes a personal note belonging to the requesting learner.
    """
    deleted, _ = LessonNote.objects.filter(id=note_id, user=user).delete()
    return deleted > 0


def create_lesson_question(user, lesson: Lesson, title: str, content: str) -> LessonQuestion:
    """
    Creates a community question thread for a lesson (F1.10).
    """
    return LessonQuestion.objects.create(
        user=user,
        lesson=lesson,
        title=title.strip(),
        content=content.strip(),
    )


def create_lesson_answer(user, question: LessonQuestion, content: str) -> LessonAnswer:
    """
    Posts a reply to a lesson question (F1.10).
    Automatically flags answer as endorsed if user is staff or admin.
    """
    is_staff_or_admin = getattr(user, 'is_staff', False) or getattr(user, 'role', '') in ('ADMIN', 'INSTRUCTOR')
    return LessonAnswer.objects.create(
        question=question,
        user=user,
        content=content.strip(),
        is_endorsed_by_instructor=is_staff_or_admin,
    )



def generate_certificate_code(course: Course) -> str:
    """
    Generates a human-readable, unforgeable certificate code (F1.11 and V4.5).
    Format example: DMB-EXC-2026-7K82
    """
    prefix = "DMB"
    tool = getattr(course.track, "tool", "EXC") if course.track else "EXC"
    tool_code = str(tool)[:3].upper()
    year = timezone.now().strftime("%Y")
    chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"
    while True:
        suffix = "".join(secrets.choice(chars) for _ in range(5))
        code = f"{prefix}-{tool_code}-{year}-{suffix}"
        if not Certificate.objects.filter(certificate_code=code).exists():
            return code


def calculate_course_final_score(user, course: Course) -> int:
    """
    Calculates average score across all passed quiz attempts for this course.
    """
    attempts = QuizAttempt.objects.filter(
        user=user,
        quiz__lesson__module__course=course,
        is_passed=True,
    )
    if not attempts.exists():
        return 100
    scores = [a.score_percentage for a in attempts]
    return int(sum(scores) / len(scores))


def issue_course_certificate(enrollment: CourseEnrollment) -> Certificate:
    """
    Issues or retrieves an official verifiable completion certificate for an enrolled learner (F1.11).
    """
    cert = Certificate.objects.filter(enrollment=enrollment).first()
    if cert:
        return cert

    course = enrollment.course
    final_score = calculate_course_final_score(enrollment.user, course)
    code = generate_certificate_code(course)

    module_titles = list(course.modules.filter(is_published=True).order_by("order").values_list("title", flat=True)[:4])
    skills_summary = " · ".join(module_titles) if module_titles else course.title

    return Certificate.objects.create(
        user=enrollment.user,
        course=course,
        enrollment=enrollment,
        certificate_code=code,
        final_score=final_score,
        instructor_name="Alain FOTSO / DataMboa",
        skills_summary=skills_summary,
    )


def normalize_answer(val: str) -> str:
    """
    Normalizes a formula or token for fair pedagogical comparison:
    removes extra spaces, normalizes quotes and case.
    """
    if not isinstance(val, str):
        val = str(val or '')
    cleaned = val.strip()
    cleaned = cleaned.replace('"', '').replace("'", '')
    return cleaned.upper()


def verify_interactive_exercise(user, exercise: InteractiveExercise, submitted_answers: dict) -> tuple[bool, str, dict]:
    """
    Verifies user answers for an interactive exercise (F1.18, R10, R24).
    Returns (is_correct, feedback_message, per_item_details).
    """
    solution = exercise.solution or {}
    details = {}
    is_correct = True

    if exercise.exercise_type == InteractiveExercise.ExerciseType.FILL_BLANKS:
        for key, expected in solution.items():
            user_val = submitted_answers.get(key, '')
            norm_user = normalize_answer(user_val)
            norm_expected = normalize_answer(expected)
            item_match = (norm_user == norm_expected)
            details[key] = {
                'submitted': user_val,
                'is_correct': item_match,
            }
            if not item_match:
                is_correct = False

    elif exercise.exercise_type == InteractiveExercise.ExerciseType.ERROR_SPOTTING:
        for key, expected in solution.items():
            user_val = submitted_answers.get(key, '')
            item_match = (normalize_answer(user_val) == normalize_answer(expected))
            details[key] = {
                'submitted': user_val,
                'is_correct': item_match,
            }
            if not item_match:
                is_correct = False

    elif exercise.exercise_type == InteractiveExercise.ExerciseType.REORDER:
        expected_order = solution.get('order', [])
        user_order = submitted_answers.get('order', [])
        is_correct = (user_order == expected_order)
        details['order'] = {
            'is_correct': is_correct,
            'expected_count': len(expected_order),
        }
    else:
        is_correct = False

    feedback = exercise.explanation if is_correct else "Certains éléments de votre formule ou analyse comportent encore une erreur. Consultez l'indice ou vérifiez la syntaxe."

    if user and user.is_authenticated:
        ExerciseAttempt.objects.create(
            user=user,
            exercise=exercise,
            submitted_answers=submitted_answers,
            is_correct=is_correct,
            feedback=feedback,
        )

    return is_correct, feedback, details
