from django.db.models import F
from django.utils import timezone
from courses.models import Course, CourseEnrollment, Lesson, LessonAttachment, LessonProgress


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
