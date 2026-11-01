from django.urls import path
from courses.views import CourseDetailView, CourseListView, LessonDetailView

app_name = 'courses'

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/', LessonDetailView.as_view(), name='lesson-detail'),
]
