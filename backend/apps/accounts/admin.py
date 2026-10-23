from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from accounts.models import InstructorProfile, LearnerProfile, User


class LearnerProfileInline(admin.StackedInline):
    model = LearnerProfile
    can_delete = False
    verbose_name_plural = _('Learner Profile')
    fk_name = 'user'


class InstructorProfileInline(admin.StackedInline):
    model = InstructorProfile
    can_delete = False
    verbose_name_plural = _('Instructor Profile')
    fk_name = 'user'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Admin configuration for Custom User model.
    """

    list_display = ('email', 'first_name', 'last_name', 'role', 'is_staff', 'is_active', 'created_at')
    list_filter = ('role', 'is_staff', 'is_active', 'created_at')
    search_fields = ('email', 'first_name', 'last_name', 'phone_number')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone_number')}),
        (_('Role & Permissions'), {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        (_('Important dates'), {'fields': ('last_login', 'created_at', 'updated_at')}),
    )
    readonly_fields = ('created_at', 'updated_at', 'last_login')

    add_fieldsets = (
        (
            None,
            {
                'classes': ('wide',),
                'fields': ('email', 'first_name', 'last_name', 'role', 'password1', 'password2'),
            },
        ),
    )

    inlines = [LearnerProfileInline, InstructorProfileInline]


@admin.register(LearnerProfile)
class LearnerProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'study_level', 'learning_goal', 'whatsapp_consent', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'study_level', 'learning_goal')
    list_filter = ('whatsapp_consent', 'study_level', 'created_at')


@admin.register(InstructorProfile)
class InstructorProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'headline', 'is_verified', 'created_at')
    search_fields = ('user__email', 'user__first_name', 'user__last_name', 'headline')
    list_filter = ('is_verified', 'created_at')
