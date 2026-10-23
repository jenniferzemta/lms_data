from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    Custom manager for User model where email is the unique identifier
    for authentication instead of usernames.
    """

    def create_user(self, email: str, password: str | None = None, **extra_fields) -> 'User':
        if not email:
            raise ValueError(_('An email address is required.'))
        email = self.normalize_email(email).lower()
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email: str, password: str | None = None, **extra_fields) -> 'User':
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', User.Role.ADMIN)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """
    Central User model for DataMboa LMS.
    Enforces email-based login, role separation and user contact details.
    """

    class Role(models.TextChoices):
        LEARNER = 'LEARNER', _('Learner')
        INSTRUCTOR = 'INSTRUCTOR', _('Instructor')
        ADMIN = 'ADMIN', _('Administrator')

    email = models.EmailField(
        _('Email address'),
        unique=True,
        db_index=True,
        max_length=255,
    )
    first_name = models.CharField(_('First name'), max_length=150)
    last_name = models.CharField(_('Last name'), max_length=150)
    phone_number = models.CharField(
        _('Phone / WhatsApp number'),
        max_length=30,
        blank=True,
        help_text=_('Format with country code, e.g. +237657546259'),
    )
    role = models.CharField(
        _('Role'),
        max_length=20,
        choices=Role.choices,
        default=Role.LEARNER,
        db_index=True,
    )
    is_active = models.BooleanField(
        _('Active status'),
        default=True,
        help_text=_('Designates whether this user account should be treated as active.'),
    )
    is_staff = models.BooleanField(
        _('Staff status'),
        default=False,
        help_text=_('Designates whether the user can log into the Django admin site.'),
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        verbose_name = _('User')
        verbose_name_plural = _('Users')
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f"{self.email} ({self.get_role_display()})"

    @property
    def full_name(self) -> str:
        return f"{self.first_name} {self.last_name}".strip()

    @property
    def is_learner(self) -> bool:
        return self.role == self.Role.LEARNER

    @property
    def is_instructor(self) -> bool:
        return self.role == self.Role.INSTRUCTOR

    @property
    def is_admin_role(self) -> bool:
        return self.role == self.Role.ADMIN or self.is_superuser


class LearnerProfile(models.Model):
    """
    Profile extension specific to learners.
    Tracks academic level, primary career/learning goal, and WhatsApp communication consent.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='learner_profile',
    )
    study_level = models.CharField(
        _('Study level'),
        max_length=100,
        blank=True,
        help_text=_('e.g. High school, Bachelor, Master, Professional'),
    )
    learning_goal = models.CharField(
        _('Learning goal'),
        max_length=255,
        blank=True,
        help_text=_('e.g. Career switch, Professional upskilling, University curriculum'),
    )
    whatsapp_consent = models.BooleanField(
        _('WhatsApp consent'),
        default=False,
        help_text=_('Learner consented to receive exercise reminders and WhatsApp support.'),
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Learner Profile')
        verbose_name_plural = _('Learner Profiles')

    def __str__(self) -> str:
        return f"LearnerProfile<{self.user.email}>"


class InstructorProfile(models.Model):
    """
    Profile extension specific to instructors and course authors.
    """

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='instructor_profile',
    )
    headline = models.CharField(
        _('Professional headline'),
        max_length=255,
        blank=True,
        help_text=_('e.g. Senior Data Analyst & Power BI Certified Instructor'),
    )
    bio = models.TextField(
        _('Biography'),
        blank=True,
    )
    is_verified = models.BooleanField(
        _('Verified instructor'),
        default=False,
        help_text=_('Whether this instructor profile has been reviewed and approved by an admin.'),
    )
    created_at = models.DateTimeField(_('Created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('Updated at'), auto_now=True)

    class Meta:
        verbose_name = _('Instructor Profile')
        verbose_name_plural = _('Instructor Profiles')

    def __str__(self) -> str:
        return f"InstructorProfile<{self.user.email}>"
