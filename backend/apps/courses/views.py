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


