import os
from django.http import FileResponse, HttpResponseRedirect
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from courses.selectors import (
    get_course_by_slug,
    get_lesson_attachment_by_id,
    get_lesson_detail,
    list_published_courses,
)
from courses.serializers import (
    CourseDetailSerializer,
    CourseListSerializer,
    LessonDetailSerializer,
)
from courses.services import can_access_attachment, record_attachment_download


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


class LessonDetailView(APIView):
    """
    GET /api/v1/courses/{course_slug}/lessons/{lesson_slug}/
    Retrieves full lesson content, localized translation, attachments, and previous/next navigation.
    """

    permission_classes = [AllowAny]

    def get(self, request: Request, course_slug: str, lesson_slug: str) -> Response:
        language = request.query_params.get('lang') or request.headers.get('Accept-Language', 'fr')[:2]
        lesson_data = get_lesson_detail(
            course_slug=course_slug,
            lesson_slug=lesson_slug,
            language=language,
        )
        if not lesson_data:
            return Response(
                {'detail': 'Lesson not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = LessonDetailSerializer(lesson_data)
        return Response(serializer.data, status=status.HTTP_200_OK)


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


import mimetypes
import re
from django.conf import settings
from django.http import Http404, StreamingHttpResponse

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
