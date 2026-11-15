from typing import Optional, Dict, Any, List
from django.db.models import Sum, Avg, Count
from courses.models import (
    InteractiveExercise,
    ExerciseAttempt,
    Certificate,
    Course,
    CourseEnrollment,
    CourseFeedback,
    LearningEvent,
    Lesson,
    LessonAnswer,
    LessonAttachment,
    LessonNote,
    LessonProgress,
    LessonQuestion,
    LessonTranslation,
    Module,
    Quiz,
    QuizAttempt,
    Track,
)


def list_published_courses(*, tool: Optional[str] = None, level: Optional[str] = None, price_tier: Optional[str] = None):
    """
    Returns published courses with optional filtering.
    """
    queryset = Course.objects.filter(is_published=True).select_related('track')

    if tool:
        queryset = queryset.filter(track__tool=tool.upper())
    if level:
        queryset = queryset.filter(level=level.upper())
    if price_tier:
        queryset = queryset.filter(price_tier=price_tier.upper())

    return queryset.order_by('order', 'id')


def get_course_by_slug(slug: str) -> Optional[Course]:
    """
    Retrieves a single published course by its slug, prefetching modules and lessons.
    Supports legacy and alternate slugs for robust backwards compatibility.
    """
    course = (
        Course.objects.filter(slug=slug, is_published=True)
        .select_related('track')
        .prefetch_related('modules__lessons__translations')
        .first()
    )
    if not course:
        aliases = {
            'excel-fondamentaux': 'excel-bases-analyse',
            'analyser-ventes-excel': 'excel-bases-analyse',
        }
        target = aliases.get(slug)
        if target:
            course = (
                Course.objects.filter(slug=target, is_published=True)
                .select_related('track')
                .prefetch_related('modules__lessons__translations')
                .first()
            )
    return course


def get_course_curriculum_lessons(course: Course):
    """
    Returns an ordered list of all published lessons in a course.
    """
    return list(
        Lesson.objects.filter(module__course=course, is_published=True, module__is_published=True)
        .select_related('module')
        .order_by('module__order', 'module__id', 'order', 'id')
    )


def get_user_course_enrollment(user, course: Course) -> Optional[CourseEnrollment]:
    """
    Retrieves course enrollment for a given user if authenticated.
    """
    if not user or not user.is_authenticated:
        return None
    return CourseEnrollment.objects.filter(user=user, course=course).first()


def get_course_progress_summary(user, course: Course) -> dict:
    """
    Computes course progression metrics for an learner:
    - completion percentage
    - number of completed lessons
    - list of completed lesson slugs
    - resume target lesson for automatic pickup (F1.8)
    """
    all_lessons = get_course_curriculum_lessons(course)
    total_count = len(all_lessons)

    if not user or not user.is_authenticated:
        return {
            'is_enrolled': False,
            'status': 'NOT_ENROLLED',
            'progress_percentage': 0,
            'completed_lessons_count': 0,
            'total_lessons_count': total_count,
            'completed_lesson_slugs': [],
            'resume_lesson': {
                'slug': all_lessons[0].slug if all_lessons else '',
                'title': all_lessons[0].title if all_lessons else '',
            } if all_lessons else None,
        }

    enrollment = CourseEnrollment.objects.filter(user=user, course=course).first()
    completed_slugs = set(
        LessonProgress.objects.filter(
            user=user,
            lesson__module__course=course,
            is_completed=True,
        ).values_list('lesson__slug', flat=True)
    )

    completed_count = len(completed_slugs)
    percentage = (
        enrollment.progress_percentage
        if enrollment
        else (int((completed_count / total_count) * 100) if total_count > 0 else 0)
    )

    # Determine resume lesson (first uncompleted lesson or last accessed)
    resume_lesson = None
    for item in all_lessons:
        if item.slug not in completed_slugs:
            resume_lesson = {
                'slug': item.slug,
                'title': item.title,
            }
            break

    if not resume_lesson and all_lessons:
        target = (
            enrollment.last_lesson
            if (enrollment and enrollment.last_lesson)
            else all_lessons[-1]
        )
        resume_lesson = {
            'slug': target.slug,
            'title': target.title,
        }

    return {
        'is_enrolled': enrollment is not None,
        'status': enrollment.status if enrollment else 'NOT_ENROLLED',
        'progress_percentage': percentage,
        'completed_lessons_count': completed_count,
        'total_lessons_count': total_count,
        'completed_lesson_slugs': list(completed_slugs),
        'resume_lesson': resume_lesson,
    }


def get_lesson_detail(*, course_slug: str, lesson_slug: str, language: str = 'fr', user=None) -> Optional[dict]:
    """
    Retrieves full lesson content, localized translation with bilingual fallback,
    downloadable attachments, previous/next navigation metadata, and learner completion state.
    """
    course = get_course_by_slug(course_slug)
    if not course:
        return None

    lesson = (
        Lesson.objects.filter(module__course=course, slug=lesson_slug, is_published=True)
        .select_related('module', 'module__course')
        .prefetch_related('translations', 'attachments')
        .first()
    )
    if not lesson:
        return None

    # Track user access if authenticated
    is_completed = False
    if user and user.is_authenticated:
        progress, _ = LessonProgress.objects.get_or_create(user=user, lesson=lesson)
        is_completed = progress.is_completed

        # Update last_lesson on enrollment if enrolled
        enrollment = CourseEnrollment.objects.filter(user=user, course=course).first()
        if enrollment and enrollment.last_lesson_id != lesson.id:
            enrollment.last_lesson = lesson
            enrollment.save(update_fields=['last_lesson', 'updated_at'])

    # Find translation for requested language
    preferred_lang = language.lower() if language else 'fr'
    translation = lesson.translations.filter(
        language=preferred_lang,
        status__in=[LessonTranslation.Status.REVIEWED, LessonTranslation.Status.DRAFT],
    ).first()

    is_fallback = False
    if not translation:
        alt_lang = 'en' if preferred_lang == 'fr' else 'fr'
        translation = lesson.translations.filter(
            language=alt_lang,
            status__in=[LessonTranslation.Status.REVIEWED, LessonTranslation.Status.DRAFT],
        ).first()
        if translation:
            is_fallback = True

    if not translation:
        translation = LessonTranslation(
            lesson=lesson,
            language=preferred_lang,
            title=lesson.title,
            summary='',
            content='',
            status=LessonTranslation.Status.ABSENT,
        )

    attachments = list(lesson.attachments.all().order_by('order', 'id'))

    all_lessons = get_course_curriculum_lessons(course)
    current_index = -1
    for idx, item in enumerate(all_lessons):
        if item.id == lesson.id:
            current_index = idx
            break

    prev_lesson = None
    next_lesson = None

    if current_index > 0:
        p = all_lessons[current_index - 1]
        prev_lesson = {
            'slug': p.slug,
            'title': p.title,
            'duration_minutes': p.duration_minutes,
            'lesson_type': p.lesson_type,
        }

    if 0 <= current_index < len(all_lessons) - 1:
        n = all_lessons[current_index + 1]
        next_lesson = {
            'slug': n.slug,
            'title': n.title,
            'duration_minutes': n.duration_minutes,
            'lesson_type': n.lesson_type,
        }

    return {
        'id': lesson.id,
        'course_slug': course.slug,
        'course_title': course.title,
        'module_id': lesson.module.id,
        'module_title': lesson.module.title,
        'title': translation.title or lesson.title,
        'slug': lesson.slug,
        'lesson_type': lesson.lesson_type,
        'duration_minutes': lesson.duration_minutes,
        'is_free_preview': lesson.is_free_preview,
        'is_completed': is_completed,
        'translation': translation,
        'is_fallback_language': is_fallback,
        'attachments': attachments,
        'previous_lesson': prev_lesson,
        'next_lesson': next_lesson,
    }


def get_lesson_attachment_by_id(pk: int) -> Optional[LessonAttachment]:
    return LessonAttachment.objects.filter(pk=pk).select_related('lesson', 'lesson__module__course').first()


def get_quiz_for_lesson(course_slug: str, lesson_slug: str) -> Optional[Quiz]:
    """
    Retrieves the published quiz attached to a lesson with questions and choices.
    """
    return (
        Quiz.objects.filter(
            lesson__module__course__slug=course_slug,
            lesson__slug=lesson_slug,
            is_published=True,
        )
        .select_related('lesson', 'lesson__module__course')
        .prefetch_related('questions__options')
        .first()
    )


def get_user_quiz_attempts(user, quiz: Quiz):
    """
    Returns recent quiz attempts for a user.
    """
    if not user or not user.is_authenticated:
        return []
    return list(QuizAttempt.objects.filter(user=user, quiz=quiz).order_by('-created_at')[:5])


def get_user_lesson_notes(*, user, course_slug: str, lesson_slug: str):
    """
    Returns personal notes for an authenticated user on a specific lesson (F1.9).
    """
    if not user or not user.is_authenticated:
        return []
    return list(
        LessonNote.objects.filter(
            user=user,
            lesson__module__course__slug=course_slug,
            lesson__slug=lesson_slug,
        ).order_by('video_timestamp_seconds', '-created_at')
    )


def list_lesson_questions(*, course_slug: str, lesson_slug: str):
    """
    Returns community questions and their answers for a lesson (F1.10).
    """
    return (
        LessonQuestion.objects.filter(
            lesson__module__course__slug=course_slug,
            lesson__slug=lesson_slug,
        )
        .select_related('user')
        .prefetch_related('answers__user')
        .order_by('-created_at')
    )


def get_lesson_question_by_id(question_id: int) -> Optional[LessonQuestion]:
    return LessonQuestion.objects.filter(pk=question_id).select_related('lesson', 'user').first()



def get_certificate_by_code(code: str) -> Optional[Certificate]:
    """
    Retrieves an active certificate by unique code for public verification (F1.11 & V4.5).
    Returns None if certificate is revoked or does not exist.
    """
    return (
        Certificate.objects.filter(certificate_code__iexact=code.strip(), is_revoked=False)
        .select_related('user', 'course', 'course__track')
        .first()
    )


def get_user_course_certificate(user, course_slug: str) -> Optional[Certificate]:
    """
    Retrieves the authenticated user's certificate for a given course.
    """
    if not user or not user.is_authenticated:
        return None
    return (
        Certificate.objects.filter(
            user=user,
            course__slug=course_slug,
            is_revoked=False,
        )
        .select_related('user', 'course', 'course__track')
        .first()
    )


def get_user_certificates(user):
    """
    Returns all valid certificates earned by a learner.
    """
    if not user or not user.is_authenticated:
        return Certificate.objects.none()
    return (
        Certificate.objects.filter(user=user, is_revoked=False)
        .select_related('course', 'course__track')
        .order_by('-issued_at')
    )


def list_lesson_exercises(*, course_slug: str, lesson_slug: str):
    """
    Returns all published interactive exercises for a given lesson (F1.18, R10).
    """
    return (
        InteractiveExercise.objects.filter(
            lesson__module__course__slug=course_slug,
            lesson__slug=lesson_slug,
            is_published=True,
        )
        .select_related('lesson', 'lesson__module', 'lesson__module__course')
        .order_by('order', 'id')
    )


def get_exercise_by_id(exercise_id: int) -> Optional[InteractiveExercise]:
    """
    Retrieves an interactive exercise by primary key.
    """
    return (
        InteractiveExercise.objects.filter(pk=exercise_id, is_published=True)
        .select_related('lesson', 'lesson__module', 'lesson__module__course')
        .first()
    )


def get_user_exercise_status(user, exercise: InteractiveExercise) -> dict:
    """
    Checks if an authenticated user has already successfully solved an exercise.
    """
    if not user or not user.is_authenticated:
        return {'is_completed': False, 'attempts_count': 0}

    attempts = ExerciseAttempt.objects.filter(user=user, exercise=exercise)
    has_passed = attempts.filter(is_correct=True).exists()
    return {
        'is_completed': has_passed,
        'attempts_count': attempts.count(),
    }


def get_learner_dashboard_summary(user) -> Dict[str, Any]:
    """
    Aggregates full learner overview for the centralized dashboard (F1.13, R16).
    Answers:
    1. Where I am: enrolled courses, progress per course/tool, certificates.
    2. What I'm doing: 1-click resume lesson card.
    3. Next step: recommended upcoming modules and courses, XP and streak.
    """
    if not user or not user.is_authenticated:
        return {
            'user': {'id': None, 'name': 'Invité', 'email': ''},
            'stats': {
                'enrolled_courses_count': 0,
                'completed_courses_count': 0,
                'completed_lessons_count': 0,
                'total_learning_time_minutes': 0,
                'certificates_count': 0,
                'xp_points': 0,
            },
            'resume_lesson': None,
            'enrolled_courses': [],
            'certificates': [],
            'recommendations': [],
        }

    user_name = f"{user.first_name} {user.last_name}".strip() or user.username

    # 1. Enrollments
    enrollments = (
        CourseEnrollment.objects.filter(user=user)
        .select_related('course', 'course__track', 'last_lesson', 'last_lesson__module')
        .order_by('-updated_at')
    )

    enrolled_course_ids = [e.course_id for e in enrollments]

    # 2. Certificates map
    certs = Certificate.objects.filter(user=user, is_revoked=False).select_related('course')
    certs_by_course_id = {c.course_id: c for c in certs}

    # 3. Lesson Progress stats
    completed_progresses = (
        LessonProgress.objects.filter(user=user, is_completed=True)
        .select_related('lesson')
    )
    completed_lessons_count = completed_progresses.count()
    total_minutes = (
        completed_progresses.aggregate(total=Sum('lesson__duration_minutes'))['total'] or 0
    )

    # 4. Interactive exercises and quizzes completed count for XP calculation
    correct_exercises_count = (
        ExerciseAttempt.objects.filter(user=user, is_correct=True)
        .values('exercise_id')
        .distinct()
        .count()
    )
    passed_quizzes_count = (
        QuizAttempt.objects.filter(user=user, is_passed=True)
        .values('quiz_id')
        .distinct()
        .count()
    )

    xp_points = (
        (completed_lessons_count * 25)
        + (correct_exercises_count * 30)
        + (passed_quizzes_count * 50)
        + (certs.count() * 200)
    )

    # 5. Build Enrolled Courses list
    enrolled_courses_data: List[Dict[str, Any]] = []
    resume_target = None

    for enr in enrollments:
        course = enr.course
        total_lessons = course.total_lessons_count
        completed_in_course = completed_progresses.filter(lesson__module__course=course).count()
        cert = certs_by_course_id.get(course.id)

        # Determine last or next lesson for this course
        target_lesson = None
        if enr.last_lesson and not completed_progresses.filter(lesson=enr.last_lesson).exists():
            target_lesson = enr.last_lesson
        else:
            # Pick first uncompleted lesson
            all_course_lessons = get_course_curriculum_lessons(course)
            completed_lesson_ids = set(
                completed_progresses.filter(lesson__module__course=course).values_list('lesson_id', flat=True)
            )
            for l in all_course_lessons:
                if l.id not in completed_lesson_ids:
                    target_lesson = l
                    break
            # If all completed, fallback to first lesson
            if not target_lesson and all_course_lessons:
                target_lesson = all_course_lessons[0]

        course_item = {
            'enrollment_id': enr.id,
            'course_id': course.id,
            'course_title': course.title,
            'course_slug': course.slug,
            'tool': course.track.tool if course.track else 'EXCEL',
            'level': course.level,
            'progress_percentage': enr.progress_percentage,
            'status': enr.status,
            'total_lessons_count': total_lessons,
            'completed_lessons_count': completed_in_course,
            'updated_at': enr.updated_at.isoformat() if enr.updated_at else None,
            'certificate_code': cert.certificate_code if cert else None,
            'next_lesson_slug': target_lesson.slug if target_lesson else None,
            'next_lesson_title': target_lesson.title if target_lesson else None,
        }
        enrolled_courses_data.append(course_item)

        # For the global 1-click resume card: pick the most recent course that is NOT yet 100% completed
        if not resume_target and target_lesson and enr.progress_percentage < 100:
            resume_target = {
                'course_title': course.title,
                'course_slug': course.slug,
                'tool': course.track.tool if course.track else 'EXCEL',
                'level': course.level,
                'lesson_title': target_lesson.title,
                'lesson_slug': target_lesson.slug,
                'module_title': target_lesson.module.title,
                'duration_minutes': target_lesson.duration_minutes,
                'progress_percentage': enr.progress_percentage,
            }

    # Fallback resume_target if all courses are 100% or only 1 course enrolled
    if not resume_target and enrolled_courses_data and enrolled_courses_data[0].get('next_lesson_slug'):
        first_c = enrollments.first()
        if first_c and first_c.last_lesson:
            resume_target = {
                'course_title': first_c.course.title,
                'course_slug': first_c.course.slug,
                'tool': first_c.course.track.tool if first_c.course.track else 'EXCEL',
                'level': first_c.course.level,
                'lesson_title': first_c.last_lesson.title,
                'lesson_slug': first_c.last_lesson.slug,
                'module_title': first_c.last_lesson.module.title,
                'duration_minutes': first_c.last_lesson.duration_minutes,
                'progress_percentage': first_c.progress_percentage,
            }

    # 6. Certificates data
    certificates_data = [
        {
            'id': c.id,
            'certificate_code': c.certificate_code,
            'course_title': c.course.title,
            'course_slug': c.course.slug,
            'tool': c.course.track.tool if c.course.track else 'EXCEL',
            'issued_at': c.issued_at.isoformat() if c.issued_at else None,
            'final_grade': c.final_grade,
            'instructor_name': c.instructor_name,
            'verification_path': f"/verify/{c.certificate_code}",
        }
        for c in certs
    ]

    # 7. Recommendations: published courses not yet enrolled
    recommended_qs = (
        Course.objects.filter(is_published=True)
        .exclude(id__in=enrolled_course_ids)
        .select_related('track')
        .order_by('order', 'id')[:2]
    )
    recommendations_data = [
        {
            'id': rc.id,
            'title': rc.title,
            'slug': rc.slug,
            'tool': rc.track.tool if rc.track else 'EXCEL',
            'level': rc.level,
            'price_tier': rc.price_tier,
            'duration_hours': rc.duration_hours,
        }
        for rc in recommended_qs
    ]

    completed_courses_count = sum(1 for e in enrolled_courses_data if e['progress_percentage'] >= 100)

    return {
        'user': {
            'id': user.id,
            'name': user_name,
            'email': user.email,
        },
        'stats': {
            'enrolled_courses_count': len(enrolled_courses_data),
            'completed_courses_count': completed_courses_count,
            'completed_lessons_count': completed_lessons_count,
            'total_learning_time_minutes': total_minutes,
            'certificates_count': len(certificates_data),
            'xp_points': xp_points,
        },
        'resume_lesson': resume_target,
        'enrolled_courses': enrolled_courses_data,
        'certificates': certificates_data,
        'recommendations': recommendations_data,
    }


def list_user_learning_events(
    user,
    course_slug: Optional[str] = None,
    verb: Optional[str] = None,
    limit: int = 50,
):
    """
    Returns the user's chronological learning events log (F1.19, R15).
    """
    qs = LearningEvent.objects.filter(user=user)
    if course_slug:
        qs = qs.filter(context_course_slug=course_slug)
    if verb:
        qs = qs.filter(verb=verb)
    return qs.order_by('-timestamp')[:limit]


def get_user_xapi_feed(
    user,
    course_slug: Optional[str] = None,
    limit: int = 50,
) -> List[Dict[str, Any]]:
    """
    Generates standard RFC/ADL xAPI statements list for LRS integration.
    """
    events = list_user_learning_events(user, course_slug=course_slug, limit=limit)
    return [ev.to_xapi_statement() for ev in events]


def get_user_course_feedback(user, course: Course) -> Optional[CourseFeedback]:
    """
    Returns the user's feedback for a course if existing (F1.20).
    """
    if not user or not user.is_authenticated:
        return None
    return CourseFeedback.objects.filter(user=user, course=course).first()


def get_course_feedback_summary(course: Course) -> Dict[str, Any]:
    """
    Aggregates course ratings and qualitative statistics for instructor & public views (F1.20, R17).
    """
    feedbacks = CourseFeedback.objects.filter(course=course)
    total_count = feedbacks.count()

    if total_count == 0:
        return {
            'course_slug': course.slug,
            'course_title': course.title,
            'total_reviews': 0,
            'average_rating': 0.0,
            'average_clarity': 0.0,
            'average_usefulness': 0.0,
            'recommendation_percentage': 100,
            'ratings_breakdown': {5: 0, 4: 0, 3: 0, 2: 0, 1: 0},
            'difficulty_breakdown': {'TOO_EASY': 0, 'BALANCED': 0, 'TOO_HARD': 0},
            'pace_breakdown': {'TOO_SLOW': 0, 'BALANCED': 0, 'TOO_FAST': 0},
            'recent_testimonials': [],
        }

    aggregates = feedbacks.aggregate(
        avg_rating=Avg('rating'),
        avg_clarity=Avg('clarity_rating'),
        avg_usefulness=Avg('usefulness_rating'),
        avg_recommend=Avg('recommend_score'),
    )

    ratings_counts = {i: 0 for i in range(1, 6)}
    for row in feedbacks.values('rating').annotate(c=Count('id')):
        ratings_counts[row['rating']] = row['c']

    diff_counts = {'TOO_EASY': 0, 'BALANCED': 0, 'TOO_HARD': 0}
    for row in feedbacks.values('difficulty_level').annotate(c=Count('id')):
        diff_counts[row['difficulty_level']] = row['c']

    pace_counts = {'TOO_SLOW': 0, 'BALANCED': 0, 'TOO_FAST': 0}
    for row in feedbacks.values('pace_rating').annotate(c=Count('id')):
        pace_counts[row['pace_rating']] = row['c']

    promoters_count = feedbacks.filter(recommend_score__gte=8).count()
    recommend_pct = int((promoters_count / total_count) * 100)

    recent_feedbacks = (
        feedbacks.filter(is_public_testimonial=True)
        .select_related('user')
        .order_by('-created_at')[:5]
    )

    testimonials = [
        {
            'id': f.id,
            'author_name': f.user.first_name or f.user.get_full_name() or 'Apprenant',
            'rating': f.rating,
            'comment': f.comment,
            'strengths': f.strengths,
            'created_at': f.created_at.strftime('%d/%m/%Y'),
        }
        for f in recent_feedbacks
        if f.comment or f.strengths
    ]

    return {
        'course_slug': course.slug,
        'course_title': course.title,
        'total_reviews': total_count,
        'average_rating': round(aggregates['avg_rating'] or 0.0, 1),
        'average_clarity': round(aggregates['avg_clarity'] or 0.0, 1),
        'average_usefulness': round(aggregates['avg_usefulness'] or 0.0, 1),
        'recommendation_percentage': recommend_pct,
        'ratings_breakdown': ratings_counts,
        'difficulty_breakdown': diff_counts,
        'pace_breakdown': pace_counts,
        'recent_testimonials': testimonials,
    }


