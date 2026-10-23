from django.contrib.auth import login, logout
from django.utils.translation import gettext_lazy as _
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.serializers import (
    GoogleAuthSerializer,
    LoginSerializer,
    RegisterLearnerSerializer,
    UpdateLearnerProfileSerializer,
    UserSerializer,
)
from accounts.services import (
    authenticate_or_register_google_user,
    register_learner,
    update_learner_profile,
)


class RegisterLearnerView(APIView):
    """
    POST /api/v1/auth/register/
    Registers a new learner and establishes an authenticated session.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = RegisterLearnerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        data = serializer.validated_data
        user = register_learner(
            email=data['email'],
            password=data['password'],
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone_number=data.get('phone_number', ''),
            study_level=data.get('study_level', ''),
            learning_goal=data.get('learning_goal', ''),
            whatsapp_consent=data.get('whatsapp_consent', False),
        )

        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """
    POST /api/v1/auth/login/
    Authenticates a user and starts an HTTP-only secure session.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = LoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)

        user = serializer.validated_data['user']
        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


class LogoutView(APIView):
    """
    POST /api/v1/auth/logout/
    Terminates the user's active session.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        logout(request)
        return Response({'message': _('Successfully logged out.')}, status=status.HTTP_200_OK)


class MeView(APIView):
    """
    GET /api/v1/auth/me/
    PATCH /api/v1/auth/me/
    Retrieves or updates the authenticated user's profile.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        return Response(UserSerializer(request.user).data, status=status.HTTP_200_OK)

    def patch(self, request: Request) -> Response:
        serializer = UpdateLearnerProfileSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        user = request.user
        validated = serializer.validated_data

        if 'first_name' in validated:
            user.first_name = validated['first_name'].strip()
        if 'last_name' in validated:
            user.last_name = validated['last_name'].strip()
        if 'phone_number' in validated:
            user.phone_number = validated['phone_number'].strip()

        user.save()

        if user.is_learner:
            update_learner_profile(
                user=user,
                study_level=validated.get('study_level'),
                learning_goal=validated.get('learning_goal'),
                whatsapp_consent=validated.get('whatsapp_consent'),
            )

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)


class GoogleAuthView(APIView):
    """
    POST /api/v1/auth/google/
    Authenticates or registers a learner using a verified Google OAuth credential token.
    """

    permission_classes = [AllowAny]

    def post(self, request: Request) -> Response:
        serializer = GoogleAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        credential = serializer.validated_data['credential']
        try:
            user = authenticate_or_register_google_user(id_token=credential)
        except Exception as err:
            return Response(
                {'credential': getattr(err, 'message', str(err))},
                status=status.HTTP_400_BAD_REQUEST,
            )

        login(request, user)
        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)

