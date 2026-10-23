from django.urls import path

from accounts.views import LoginView, LogoutView, MeView, RegisterLearnerView

app_name = 'accounts'

urlpatterns = [
    path('register/', RegisterLearnerView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),
]
