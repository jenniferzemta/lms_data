from typing import Optional
from courses.models import Course, Lesson, LessonAttachment, LessonTranslation, Module, Track


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


def get_lesson_detail(*, course_slug: str, lesson_slug: str, language: str = 'fr') -> Optional[dict]:
    """
    Retrieves full lesson content, localized translation with bilingual fallback,
    downloadable attachments, and previous/next navigation metadata.
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

    # Find translation for requested language
    preferred_lang = language.lower() if language else 'fr'
    translation = lesson.translations.filter(
        language=preferred_lang,
        status__in=[LessonTranslation.Status.REVIEWED, LessonTranslation.Status.DRAFT],
    ).first()

    is_fallback = False
    if not translation:
        # Fallback to the other language (EN if requested FR, or FR if requested EN)
        alt_lang = 'en' if preferred_lang == 'fr' else 'fr'
        translation = lesson.translations.filter(
            language=alt_lang,
            status__in=[LessonTranslation.Status.REVIEWED, LessonTranslation.Status.DRAFT],
        ).first()
        if translation:
            is_fallback = True

    # If no translation exists at all, generate a minimal fallback translation object
    if not translation:
        translation = LessonTranslation(
            lesson=lesson,
            language=preferred_lang,
            title=lesson.title,
            summary='',
            content='',
            status=LessonTranslation.Status.ABSENT,
        )

    # Attachments ordered by order, then id
    attachments = list(lesson.attachments.all().order_by('order', 'id'))

    # Compute previous and next lessons for thumb-friendly mobile navigation
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
        'translation': translation,
        'is_fallback_language': is_fallback,
        'attachments': attachments,
        'previous_lesson': prev_lesson,
        'next_lesson': next_lesson,
    }


def get_lesson_attachment_by_id(attachment_id: int) -> Optional[LessonAttachment]:
    """
    Retrieves a single attachment by ID with its related lesson, module, and course.
    """
    return (
        LessonAttachment.objects.filter(pk=attachment_id)
        .select_related('lesson', 'lesson__module', 'lesson__module__course')
        .first()
    )
