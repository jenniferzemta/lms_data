from django.urls import path

from accounts.views import (
    ChangePasswordView,
    GoogleAuthView,
    LoginView,
    LogoutView,
    MeView,
    RegisterLearnerView,
)

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterLearnerView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/', GoogleAuthView.as_view(), name='google'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]

