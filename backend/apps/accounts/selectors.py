from django.db.models import QuerySet

from accounts.models import InstructorProfile, LearnerProfile, User


def get_user_by_id(*, user_id: int) -> User | None:
    """
    Fetches a user by their primary key.
    Returns None if the user does not exist.
    """
    try:
        return User.objects.get(pk=user_id)
    except User.DoesNotExist:
        return None


def get_user_by_email(*, email: str) -> User | None:
    """
    Fetches a user by case-insensitive email address.
    """
    try:
        return User.objects.get(email__iexact=email.strip())
    except User.DoesNotExist:
        return None


def list_active_instructors() -> QuerySet[User]:
    """
    Returns active instructors with their verified profile.
    """
    return (
        User.objects.filter(role=User.Role.INSTRUCTOR, is_active=True, instructor_profile__is_verified=True)
        .select_related('instructor_profile')
        .order_by('last_name', 'first_name')
    )


def get_learner_profile(*, user: User) -> LearnerProfile | None:
    """
    Retrieves the learner profile for a given user.
    """
    try:
        return user.learner_profile
    except (LearnerProfile.DoesNotExist, AttributeError):
        return None


def get_instructor_profile(*, user: User) -> InstructorProfile | None:
    """
    Retrieves the instructor profile for a given user.
    """
    try:
        return user.instructor_profile
    except (InstructorProfile.DoesNotExist, AttributeError):
        return None
