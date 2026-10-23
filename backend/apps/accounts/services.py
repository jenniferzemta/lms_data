from django.core.exceptions import ValidationError
from django.db import transaction
from django.utils.translation import gettext_lazy as _

from accounts.models import InstructorProfile, LearnerProfile, User


def create_user(
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    phone_number: str = '',
    role: str = User.Role.LEARNER,
) -> User:
    """
    Creates and returns a User with normalized email and validated role.
    Raises ValidationError if email already exists or password is too weak.
    """
    normalized_email = email.strip().lower()
    if User.objects.filter(email=normalized_email).exists():
        raise ValidationError({'email': _('A user with this email address already exists.')})

    if not password or len(password) < 8:
        raise ValidationError({'password': _('Password must be at least 8 characters long.')})

    user = User(
        email=normalized_email,
        first_name=first_name.strip(),
        last_name=last_name.strip(),
        phone_number=phone_number.strip(),
        role=role,
    )
    user.set_password(password)
    user.save()
    return user


@transaction.atomic
def register_learner(
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    phone_number: str = '',
    study_level: str = '',
    learning_goal: str = '',
    whatsapp_consent: bool = False,
) -> User:
    """
    Registers a new learner account with an associated LearnerProfile.
    Executed in a transaction to guarantee atomic creation.
    """
    user = create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role=User.Role.LEARNER,
    )

    LearnerProfile.objects.create(
        user=user,
        study_level=study_level.strip(),
        learning_goal=learning_goal.strip(),
        whatsapp_consent=whatsapp_consent,
    )
    return user


@transaction.atomic
def register_instructor(
    *,
    email: str,
    password: str,
    first_name: str,
    last_name: str,
    phone_number: str = '',
    headline: str = '',
    bio: str = '',
) -> User:
    """
    Registers an instructor account with an associated InstructorProfile.
    """
    user = create_user(
        email=email,
        password=password,
        first_name=first_name,
        last_name=last_name,
        phone_number=phone_number,
        role=User.Role.INSTRUCTOR,
    )

    InstructorProfile.objects.create(
        user=user,
        headline=headline.strip(),
        bio=bio.strip(),
        is_verified=False,
    )
    return user


def update_learner_profile(
    *,
    user: User,
    study_level: str | None = None,
    learning_goal: str | None = None,
    whatsapp_consent: bool | None = None,
) -> LearnerProfile:
    """
    Updates editable fields on a learner profile.
    """
    profile, _ = LearnerProfile.objects.get_or_create(user=user)

    if study_level is not None:
        profile.study_level = study_level.strip()
    if learning_goal is not None:
        profile.learning_goal = learning_goal.strip()
    if whatsapp_consent is not None:
        profile.whatsapp_consent = whatsapp_consent

    profile.save()
    return profile
