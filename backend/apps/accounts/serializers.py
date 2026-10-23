from django.contrib.auth import authenticate
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from accounts.models import InstructorProfile, LearnerProfile, User


class LearnerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = LearnerProfile
        fields = ['study_level', 'learning_goal', 'whatsapp_consent', 'created_at']
        read_only_fields = ['created_at']


class InstructorProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InstructorProfile
        fields = ['headline', 'bio', 'is_verified', 'created_at']
        read_only_fields = ['is_verified', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    """
    Detailed read serializer for User data, returning associated profiles.
    """

    learner_profile = LearnerProfileSerializer(read_only=True)
    instructor_profile = InstructorProfileSerializer(read_only=True)
    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = [
            'id',
            'email',
            'first_name',
            'last_name',
            'full_name',
            'phone_number',
            'role',
            'is_learner',
            'is_instructor',
            'is_admin_role',
            'learner_profile',
            'instructor_profile',
            'created_at',
        ]
        read_only_fields = ['id', 'role', 'created_at']


class RegisterLearnerSerializer(serializers.Serializer):
    """
    Validates learner registration input payload.
    """

    email = serializers.EmailField(max_length=255)
    password = serializers.CharField(write_only=True, min_length=8)
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    phone_number = serializers.CharField(max_length=30, required=False, allow_blank=True)
    study_level = serializers.CharField(max_length=100, required=False, allow_blank=True)
    learning_goal = serializers.CharField(max_length=255, required=False, allow_blank=True)
    whatsapp_consent = serializers.BooleanField(required=False, default=False)

    def validate_email(self, value: str) -> str:
        normalized = value.strip().lower()
        if User.objects.filter(email=normalized).exists():
            raise serializers.ValidationError(_('A user with this email address already exists.'))
        return normalized


class LoginSerializer(serializers.Serializer):
    """
    Validates user credentials for session login.
    """

    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs: dict) -> dict:
        email = attrs.get('email', '').strip().lower()
        password = attrs.get('password')

        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if not user:
            # Fallback check if ModelBackend expected email kwarg
            user = authenticate(request=self.context.get('request'), email=email, password=password)

        if not user:
            raise serializers.ValidationError(_('Invalid email or password.'))

        if not user.is_active:
            raise serializers.ValidationError(_('This user account is inactive.'))

        attrs['user'] = user
        return attrs


class UpdateLearnerProfileSerializer(serializers.Serializer):
    """
    Validates profile updates for the current learner.
    """

    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    phone_number = serializers.CharField(max_length=30, required=False, allow_blank=True)
    study_level = serializers.CharField(max_length=100, required=False, allow_blank=True)
    learning_goal = serializers.CharField(max_length=255, required=False, allow_blank=True)
    whatsapp_consent = serializers.BooleanField(required=False)


class GoogleAuthSerializer(serializers.Serializer):
    """
    Validates Google OAuth ID token credentials sent by the frontend.
    """

    credential = serializers.CharField(required=True)

