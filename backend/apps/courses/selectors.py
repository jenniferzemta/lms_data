from typing import Optional
from courses.models import (
    Course,
    CourseEnrollment,
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
    """
    return (
        Course.objects.filter(slug=slug, is_published=True)
        .select_related('track')
        .prefetch_related('modules__lessons__translations')
        .first()
    )


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
    course = Course.objects.filter(slug=course_slug, is_published=True).first()
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

