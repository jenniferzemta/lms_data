import mimetypes
import os
import re
from django.conf import settings
from django.http import FileResponse, Http404, HttpResponseRedirect, StreamingHttpResponse
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.models import Course, Lesson
from courses.selectors import (
    get_course_feedback_summary,
    get_user_course_feedback,
    get_learner_dashboard_summary,
    list_user_learning_events,
    get_user_xapi_feed,
    get_exercise_by_id,
    list_lesson_exercises,
    get_certificate_by_code,
    get_user_certificates,
    get_user_course_certificate,
    get_course_by_slug,
    get_course_progress_summary,
    get_lesson_attachment_by_id,
    get_lesson_detail,
    get_lesson_question_by_id,
    get_quiz_for_lesson,
    get_user_lesson_notes,
    list_lesson_questions,
    list_published_courses,
)
from courses.serializers import (
    CourseFeedbackSerializer,
    CourseFeedbackSubmitSerializer,
    LearnerDashboardSerializer,
    LearningEventSerializer,
    ClientLearningEventCreateSerializer,
    InteractiveExercisePublicSerializer,
    ExerciseSubmissionSerializer,
    ExerciseVerificationResponseSerializer,
    CertificateDetailSerializer,
    CertificatePublicSerializer,
    CourseDetailSerializer,
    CourseListSerializer,
    CourseProgressSerializer,
    LessonAnswerSerializer,
    LessonCreateAnswerSerializer,
    LessonCreateNoteSerializer,
    LessonCreateQuestionSerializer,
    LessonDetailSerializer,
    LessonNoteSerializer,
    LessonQuestionSerializer,
    QuizAttemptResponseSerializer,
    QuizPublicSerializer,
    QuizSubmitSerializer,
)
from courses.services import (
    submit_course_feedback,
    record_learning_event,
    verify_interactive_exercise,
    issue_course_certificate,
    can_access_attachment,
    create_lesson_answer,
    create_lesson_note,
    create_lesson_question,
    delete_lesson_note,
    enroll_user_in_course,
    evaluate_quiz_submission,
    mark_lesson_completed,
    record_attachment_download,
)


class CourseListView(APIView):
    """
    GET /api/v1/courses/
    Lists published courses with optional filtering by tool, level, or price_tier.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request) -> Response:
        tool = request.query_params.get('tool')
        level = request.query_params.get('level')
        price_tier = request.query_params.get('price_tier')

        courses = list_published_courses(tool=tool, level=level, price_tier=price_tier)
        serializer = CourseListSerializer(courses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseDetailView(APIView):
    """
    GET /api/v1/courses/{slug}/
    Retrieves course presentation details and full curriculum (modules and lessons).
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, slug: str) -> Response:
        course = get_course_by_slug(slug)
        if not course:
            return Response(
                {'detail': 'Course not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        language = request.query_params.get('lang') or request.headers.get('Accept-Language', 'fr')[:2]
        serializer = CourseDetailSerializer(course, context={'language': language})
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseProgressView(APIView):
    """
    GET /api/v1/courses/{slug}/progress/
    Retrieves current user course completion metrics, finished lesson slugs,
    and automatic pickup resume target (F1.8).
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, slug: str) -> Response:
        course = get_course_by_slug(slug)
        if not course:
            return Response(
                {'detail': 'Course not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        summary = get_course_progress_summary(request.user, course)
        serializer = CourseProgressSerializer(summary)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CourseEnrollView(APIView):
    """
    POST /api/v1/courses/{slug}/enroll/
    Enrolls the current authenticated learner in the course (F1.8).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, slug: str) -> Response:
        course = get_course_by_slug(slug)
        if not course:
            return Response(
                {'detail': 'Course not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        enrollment = enroll_user_in_course(request.user, course)
        summary = get_course_progress_summary(request.user, course)
        serializer = CourseProgressSerializer(summary)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonDetailView(APIView):
    """
    GET /api/v1/courses/{course_slug}/lessons/{lesson_slug}/
    Retrieves full lesson content, localized translation, attachments, learner progress,
    and previous/next navigation.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        language = request.query_params.get('lang') or request.headers.get('Accept-Language', 'fr')[:2]
        lesson_data = get_lesson_detail(
            course_slug=course_slug,
            lesson_slug=lesson_slug,
            language=language,
            user=request.user,
        )
        if not lesson_data:
            return Response(
                {'detail': 'Lesson not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LessonDetailSerializer(lesson_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonCompleteView(APIView):
    """
    POST /api/v1/courses/{course_slug}/lessons/{lesson_slug}/complete/
    Marks a lesson as completed by the learner, updates progress percentage,
    and returns updated metrics (F1.8).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        lesson = (
            Lesson.objects.filter(
                module__course__slug=course_slug,
                slug=lesson_slug,
                is_published=True,
            )
            .select_related('module__course')
            .first()
        )
        if not lesson:
            return Response(
                {'detail': 'Lesson not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        progress, enrollment = mark_lesson_completed(request.user, lesson)
        summary = get_course_progress_summary(request.user, lesson.module.course)

        return Response(
            {
                'success': True,
                'is_completed': progress.is_completed,
                'progress_percentage': enrollment.progress_percentage,
                'status': enrollment.status,
                'summary': CourseProgressSerializer(summary).data,
            },
            status=status.HTTP_200_OK,
        )


class LessonAttachmentDownloadView(APIView):
    """
    GET /api/v1/courses/attachments/{pk}/download/
    Tracks download metrics and streams the file or redirects to URL
    while enforcing server-side access rights (F1.6).
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, pk: int) -> Response:
        attachment = get_lesson_attachment_by_id(pk)
        if not attachment:
            return Response(
                {'detail': 'Attachment not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if not can_access_attachment(request.user, attachment):
            return Response(
                {'detail': 'Access denied. An active subscription is required to download this resource.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        record_attachment_download(attachment, request.user)

        if attachment.file:
            filename = os.path.basename(attachment.file.name)
            return FileResponse(attachment.file.open('rb'), as_attachment=True, filename=filename)
        elif attachment.external_url:
            return HttpResponseRedirect(attachment.external_url)

        return Response(
            {'detail': 'No downloadable resource configured.'},
            status=status.HTTP_404_NOT_FOUND,
        )


class VideoStreamView(APIView):
    """
    GET /api/v1/courses/videos/<filename>/
    Streams local video files with HTTP 206 Partial Content support for mobile-first scrubbing.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, filename: str):
        clean_name = os.path.basename(filename)
        video_dir = getattr(settings, 'LOCAL_VIDEOS_DIR', r'D:\videoschariow')
        file_path = os.path.join(video_dir, clean_name)

        if not os.path.isfile(file_path):
            raise Http404('Video file not found.')

        file_size = os.path.getsize(file_path)
        content_type, _ = mimetypes.guess_type(file_path)
        content_type = content_type or 'video/mp4'

        range_header = request.META.get('HTTP_RANGE', '').strip()
        range_match = re.match(r'bytes=(\d+)-(\d*)', range_header) if range_header else None

        if range_match:
            first_byte = int(range_match.group(1))
            last_byte = int(range_match.group(2)) if range_match.group(2) else file_size - 1
            if last_byte >= file_size:
                last_byte = file_size - 1
            length = last_byte - first_byte + 1

            def file_iterator(path, offset, length, chunk_size=65536):
                with open(path, 'rb') as f:
                    f.seek(offset)
                    remaining = length
                    while remaining > 0:
                        chunk = f.read(min(chunk_size, remaining))
                        if not chunk:
                            break
                        remaining -= len(chunk)
                        yield chunk

            response = StreamingHttpResponse(
                file_iterator(file_path, first_byte, length),
                status=206,
                content_type=content_type,
            )
            response['Content-Range'] = f'bytes {first_byte}-{last_byte}/{file_size}'
            response['Content-Length'] = str(length)
            response['Accept-Ranges'] = 'bytes'
            return response
        else:
            response = FileResponse(open(file_path, 'rb'), content_type=content_type)
            response['Content-Length'] = str(file_size)
            response['Accept-Ranges'] = 'bytes'
            return response


class LessonQuizDetailView(APIView):
    """
    GET /api/v1/courses/<course_slug>/lessons/<lesson_slug>/quiz/
    Retrieves the public quiz structure for a lesson.
    Omits correct answers and explanations until submitted (F1.7).
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        quiz = get_quiz_for_lesson(course_slug=course_slug, lesson_slug=lesson_slug)
        if not quiz:
            return Response(
                {'detail': 'No quiz configured for this lesson.'},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = QuizPublicSerializer(quiz)
        return Response(serializer.data, status=status.HTTP_200_OK)


class LessonQuizSubmitView(APIView):
    """
    POST /api/v1/courses/<course_slug>/lessons/<lesson_slug>/quiz/submit/
    Evaluates learner quiz responses against passing score threshold (F1.7).
    Returns formative feedback per question (explanation, correctness).
    Automatically marks the lesson as completed if the passing score is achieved.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        quiz = get_quiz_for_lesson(course_slug=course_slug, lesson_slug=lesson_slug)
        if not quiz:
            return Response(
                {'detail': 'No quiz configured for this lesson.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = QuizSubmitSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        raw_answers = serializer.validated_data['answers']
        attempt, feedback = evaluate_quiz_submission(
            user=request.user,
            quiz=quiz,
            answers=raw_answers,
        )

        response_serializer = QuizAttemptResponseSerializer(attempt)
        return Response(response_serializer.data, status=status.HTTP_200_OK)


class LessonNotesView(APIView):
    """
    GET /api/v1/courses/<course_slug>/lessons/<lesson_slug>/notes/
    POST /api/v1/courses/<course_slug>/lessons/<lesson_slug>/notes/
    Manages learner's personal notes anchored to video timecodes (F1.9).
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        notes = get_user_lesson_notes(
            user=request.user,
            course_slug=course_slug,
            lesson_slug=lesson_slug,
        )
        serializer = LessonNoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        lesson = Lesson.objects.filter(
            module__course__slug=course_slug,
            slug=lesson_slug,
        ).first()
        if not lesson:
            return Response({'detail': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LessonCreateNoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        note = create_lesson_note(
            user=request.user,
            lesson=lesson,
            content=serializer.validated_data['content'],
            video_timestamp_seconds=serializer.validated_data.get('video_timestamp_seconds', 0),
        )
        return Response(LessonNoteSerializer(note).data, status=status.HTTP_201_CREATED)


class LessonNoteDetailView(APIView):
    """
    DELETE /api/v1/courses/notes/<int:pk>/
    Deletes a user personal note (F1.9).
    """

    permission_classes = [IsAuthenticated]

    def delete(self, request: Request, pk: int) -> Response:
        success = delete_lesson_note(user=request.user, note_id=pk)
        if not success:
            return Response({'detail': 'Note not found or unauthorized.'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'success': True}, status=status.HTTP_204_NO_CONTENT)


class LessonQuestionsView(APIView):
    """
    GET /api/v1/courses/<course_slug>/lessons/<lesson_slug>/questions/
    POST /api/v1/courses/<course_slug>/lessons/<lesson_slug>/questions/
    Community Q&A for a lesson (F1.10).
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        questions = list_lesson_questions(
            course_slug=course_slug,
            lesson_slug=lesson_slug,
        )
        serializer = LessonQuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        lesson = Lesson.objects.filter(
            module__course__slug=course_slug,
            slug=lesson_slug,
        ).first()
        if not lesson:
            return Response({'detail': 'Lesson not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LessonCreateQuestionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        question = create_lesson_question(
            user=request.user,
            lesson=lesson,
            title=serializer.validated_data['title'],
            content=serializer.validated_data['content'],
        )
        return Response(LessonQuestionSerializer(question).data, status=status.HTTP_201_CREATED)


class LessonQuestionAnswerView(APIView):
    """
    POST /api/v1/courses/questions/<int:pk>/answers/
    Replies to a community question thread (F1.10).
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, pk: int) -> Response:
        question = get_lesson_question_by_id(pk)
        if not question:
            return Response({'detail': 'Question not found.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = LessonCreateAnswerSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        answer = create_lesson_answer(
            user=request.user,
            question=question,
            content=serializer.validated_data['content'],
        )
        return Response(LessonAnswerSerializer(answer).data, status=status.HTTP_201_CREATED)





# =====================================================================
# CERTIFICATE VIEWS (F1.11 & V4.5)
# =====================================================================

class CertificateVerificationView(APIView):
    """
    GET /api/v1/courses/certificates/<str:code>/verify/
    Public verification endpoint for certificate authenticity check (F1.11 & V4.5).
    Open to employers, recruiters, and social network crawlers (AllowAny).
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, code: str) -> Response:
        cert = get_certificate_by_code(code)
        if not cert:
            return Response(
                {
                    'detail': 'Certificat introuvable ou révoqué.',
                    'is_valid': False,
                },
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = CertificatePublicSerializer(cert)
        return Response({**serializer.data, 'is_valid': True}, status=status.HTTP_200_OK)


class CourseCertificateView(APIView):
    """
    GET /api/v1/courses/<slug:slug>/certificate/
    Retrieves or generates on-the-fly the authenticated learner's certificate for a completed course.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, slug: str) -> Response:
        cert = get_user_course_certificate(request.user, slug)
        if not cert:
            # Check if enrollment progress is 100% and issue certificate
            from courses.models import CourseEnrollment
            enrollment = CourseEnrollment.objects.filter(
                user=request.user,
                course__slug=slug,
            ).first()
            if enrollment and enrollment.progress_percentage >= 100:
                cert = issue_course_certificate(enrollment)

        if not cert:
            return Response(
                {
                    'detail': 'Certificat non disponible. Le cours doit être terminé à 100%.',
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = CertificateDetailSerializer(cert)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UserCertificatesListView(APIView):
    """
    GET /api/v1/courses/my-certificates/
    Lists all official certificates earned by the authenticated learner.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        certs = get_user_certificates(request.user)
        serializer = CertificateDetailSerializer(certs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)



# =====================================================================
# INTERACTIVE EXERCISE VIEWS (F1.18, R10, R24)
# =====================================================================

class LessonExercisesView(APIView):
    """
    GET /api/v1/courses/<slug:course_slug>/lessons/<slug:lesson_slug>/exercises/
    Lists all hands-on exercises attached to a lesson.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        exercises = list_lesson_exercises(course_slug=course_slug, lesson_slug=lesson_slug)
        serializer = InteractiveExercisePublicSerializer(exercises, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)


class ExerciseVerifyView(APIView):
    """
    POST /api/v1/courses/exercises/<int:pk>/verify/
    Verifies user answers for an interactive exercise without page refresh (R24).
    """

    permission_classes = [AllowAny]

    def post(self, request: Request, pk: int) -> Response:
        exercise = get_exercise_by_id(pk)
        if not exercise:
            return Response({'detail': 'Exercice introuvable.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ExerciseSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user if request.user.is_authenticated else None
        is_correct, feedback, details = verify_interactive_exercise(
            user=user,
            exercise=exercise,
            submitted_answers=serializer.validated_data['answers'],
        )

        return Response(
            {
                'is_correct': is_correct,
                'feedback': feedback,
                'explanation': exercise.explanation if is_correct else '',
                'details': details,
            },
            status=status.HTTP_200_OK,
        )


# =====================================================================
# LEARNER DASHBOARD VIEW (F1.13, R16)
# =====================================================================

class LearnerDashboardView(APIView):
    """
    GET /api/v1/courses/dashboard/
    Centralized learner dashboard aggregate endpoint (F1.13, R16).
    Returns metrics, active courses, 1-click resume lesson, certificates, and recommendations.
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        summary = get_learner_dashboard_summary(request.user)
        serializer = LearnerDashboardSerializer(summary)
        return Response(serializer.data, status=status.HTTP_200_OK)


# =====================================================================
# LEARNING EVENTS & xAPI VIEWS (F1.19, R15)
# =====================================================================

class LearningEventListView(APIView):
    """
    GET /api/v1/courses/learning-events/
    Returns the user's chronological learning events log (F1.19, R15).
    Filterable by ?course=<course_slug> and ?verb=<verb>.

    POST /api/v1/courses/learning-events/
    Allows client-side event tracking (video interactions, time spent, custom actions).
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        course_slug = request.query_params.get('course')
        verb = request.query_params.get('verb')
        events = list_user_learning_events(
            user=request.user,
            course_slug=course_slug,
            verb=verb,
        )
        serializer = LearningEventSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request: Request) -> Response:
        serializer = ClientLearningEventCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        event = record_learning_event(
            user=request.user,
            verb=data['verb'],
            object_id=data['object_id'],
            object_type=data['object_type'],
            object_name=data['object_name'],
            result_success=data.get('result_success'),
            result_completion=data.get('result_completion'),
            result_score_raw=data.get('result_score_raw'),
            result_duration_seconds=data.get('result_duration_seconds'),
            context_course_slug=data.get('context_course_slug', ''),
        )
        if not event:
            return Response({'error': 'Event could not be recorded.'}, status=status.HTTP_400_BAD_REQUEST)

        return Response(LearningEventSerializer(event).data, status=status.HTTP_201_CREATED)


class XApiStatementFeedView(APIView):
    """
    GET /api/v1/courses/learning-events/xapi/
    Returns standard RFC/ADL xAPI 1.0.3 statements array ready for LRS sync / export (F1.19, R15).
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        course_slug = request.query_params.get('course')
        statements = get_user_xapi_feed(
            user=request.user,
            course_slug=course_slug,
        )
        return Response(
            {
                'version': '1.0.3',
                'statements': statements,
                'count': len(statements),
            },
            status=status.HTTP_200_OK,
        )


# =====================================================================
# COURSE EVALUATION & FEEDBACK VIEWS (F1.20, R17 - ADDIE Evaluation)
# =====================================================================

class CourseFeedbackSubmitView(APIView):
    """
    POST /api/v1/courses/<slug>/feedback/
    Submits or updates the learner's course evaluation questionnaire (F1.20, R17).
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def post(self, request: Request, slug: str) -> Response:
        course = get_course_by_slug(slug)
        if not course:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = CourseFeedbackSubmitSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        feedback = submit_course_feedback(
            user=request.user,
            course=course,
            rating=data['rating'],
            clarity_rating=data.get('clarity_rating', 5),
            usefulness_rating=data.get('usefulness_rating', 5),
            difficulty_level=data.get('difficulty_level', 'BALANCED'),
            pace_rating=data.get('pace_rating', 'BALANCED'),
            recommend_score=data.get('recommend_score', 10),
            strengths=data.get('strengths', ''),
            improvements=data.get('improvements', ''),
            comment=data.get('comment', ''),
            is_public_testimonial=data.get('is_public_testimonial', True),
        )

        return Response(CourseFeedbackSerializer(feedback).data, status=status.HTTP_200_OK)


class UserCourseFeedbackView(APIView):
    """
    GET /api/v1/courses/<slug>/feedback/my/
    Returns the authenticated user's submitted feedback for the course, if any.
    Requires authentication.
    """

    permission_classes = [IsAuthenticated]

    def get(self, request: Request, slug: str) -> Response:
        course = get_course_by_slug(slug)
        if not course:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        feedback = get_user_course_feedback(request.user, course)
        if not feedback:
            return Response({'has_feedback': False, 'feedback': None}, status=status.HTTP_200_OK)

        return Response(
            {
                'has_feedback': True,
                'feedback': CourseFeedbackSerializer(feedback).data,
            },
            status=status.HTTP_200_OK,
        )


class CourseFeedbackSummaryView(APIView):
    """
    GET /api/v1/courses/<slug>/feedback/summary/
    Returns aggregate ratings, score distribution, and public reviews for the course.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, slug: str) -> Response:
        course = get_course_by_slug(slug)
        if not course:
            return Response({'error': 'Course not found'}, status=status.HTTP_404_NOT_FOUND)

        summary = get_course_feedback_summary(course)
        return Response(summary, status=status.HTTP_200_OK)


