from django.urls import path
from courses.views import (
    CourseDetailView,
    CourseEnrollView,
    CourseListView,
    CourseProgressView,
    LessonAttachmentDownloadView,
    LessonCompleteView,
    LessonDetailView,
    LessonQuizDetailView,
    LessonQuizSubmitView,
    VideoStreamView,
)

app_name = 'courses'

urlpatterns = [
    path('', CourseListView.as_view(), name='course-list'),
    path('attachments/<int:pk>/download/', LessonAttachmentDownloadView.as_view(), name='attachment-download'),
    path('videos/<str:filename>/', VideoStreamView.as_view(), name='video-stream'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course-detail'),
    path('<slug:slug>/progress/', CourseProgressView.as_view(), name='course-progress'),
    path('<slug:slug>/enroll/', CourseEnrollView.as_view(), name='course-enroll'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/', LessonDetailView.as_view(), name='lesson-detail'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/complete/', LessonCompleteView.as_view(), name='lesson-complete'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/quiz/', LessonQuizDetailView.as_view(), name='lesson-quiz-detail'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/quiz/submit/', LessonQuizSubmitView.as_view(), name='lesson-quiz-submit'),
]
