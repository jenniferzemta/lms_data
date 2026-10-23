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


def verify_google_id_token(id_token: str) -> dict:
    """
    Verifies a Google OAuth ID token using Google's public tokeninfo endpoint.
    Returns token payload containing email and user identity.
    Raises ValidationError if invalid.
    """
    import json
    import os
    import urllib.request
    from urllib.error import URLError

    url = f"https://oauth2.googleapis.com/tokeninfo?id_token={id_token}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'DataMboa-LMS'})
        with urllib.request.urlopen(req, timeout=5) as response:
            payload = json.loads(response.read().decode('utf-8'))
    except (URLError, TimeoutError, ValueError):
        raise ValidationError({'credential': _('Invalid or expired Google authentication token.')})

    google_client_id = os.environ.get('GOOGLE_CLIENT_ID')
    if google_client_id and payload.get('aud') != google_client_id:
        raise ValidationError({'credential': _('Google token audience mismatch.')})

    email = payload.get('email')
    if not email:
        raise ValidationError({'credential': _('No email returned by Google account.')})

    return payload


@transaction.atomic
def authenticate_or_register_google_user(*, id_token: str) -> User:
    """
    Verifies a Google ID token and retrieves or provisions a learner User.
    Executed in a transaction to guarantee atomic user + profile creation.
    """
    payload = verify_google_id_token(id_token)

    email = payload['email'].strip().lower()
    first_name = payload.get('given_name', '').strip() or 'Apprenant'
    last_name = payload.get('family_name', '').strip() or 'Google'

    user = User.objects.filter(email=email).first()

    if not user:
        # Create learner with an unusable random password
        user = User(
            email=email,
            first_name=first_name,
            last_name=last_name,
            role=User.Role.LEARNER,
        )
        user.set_unusable_password()
        user.save()

        LearnerProfile.objects.create(
            user=user,
            study_level='',
            learning_goal='',
            whatsapp_consent=False,
        )
    elif not hasattr(user, 'learner_profile') and user.is_learner:
        LearnerProfile.objects.create(user=user)

    return user

