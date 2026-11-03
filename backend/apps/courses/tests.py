from django.test import TestCase
from rest_framework.test import APIClient

from courses.models import Course, Lesson, LessonAttachment, LessonTranslation, Module, Track
from courses.selectors import (
    get_course_by_slug,
    get_lesson_attachment_by_id,
    get_lesson_detail,
    list_published_courses,
)
from courses.services import can_access_attachment, record_attachment_download


class CoursesModelAndSelectorTests(TestCase):
    def setUp(self):
        self.track = Track.objects.create(
            name='Excel Test Track',
            slug='excel-test',
            tool=Track.Tool.EXCEL,
            order=1,
        )
        self.course = Course.objects.create(
            track=self.track,
            title='Test Course',
            slug='test-course',
            level=Course.Level.BEGINNER,
            price_tier=Course.PriceTier.FREE,
            order=1,
        )
        self.module = Module.objects.create(
            course=self.course,
            title='Module 1',
            order=1,
        )
        self.lesson_1 = Lesson.objects.create(
            module=self.module,
            title='Lesson 1',
            slug='lesson-1',
            lesson_type=Lesson.LessonType.TEXT,
            duration_minutes=10,
            order=1,
        )
        self.lesson_2 = Lesson.objects.create(
            module=self.module,
            title='Lesson 2',
            slug='lesson-2',
            lesson_type=Lesson.LessonType.CODE,
            duration_minutes=15,
            order=2,
        )

        LessonTranslation.objects.create(
            lesson=self.lesson_1,
            language=LessonTranslation.Language.FR,
            title='Leçon 1 FR',
            content='Contenu FR',
            status=LessonTranslation.Status.REVIEWED,
        )
        LessonTranslation.objects.create(
            lesson=self.lesson_1,
            language=LessonTranslation.Language.EN,
            title='Lesson 1 EN',
            content='Content EN',
            status=LessonTranslation.Status.REVIEWED,
        )
        LessonTranslation.objects.create(
            lesson=self.lesson_2,
            language=LessonTranslation.Language.FR,
            title='Leçon 2 FR',
            content='Contenu FR uniquement',
            status=LessonTranslation.Status.REVIEWED,
        )

        # F1.6 Attachments
        self.attachment_1 = LessonAttachment.objects.create(
            lesson=self.lesson_1,
            title='Exercice Ventes Douala',
            attachment_type=LessonAttachment.AttachmentType.STARTER,
            file_format='xlsx',
            file_size_bytes=148480,
            external_url='https://example.cm/ventes_douala.xlsx',
            order=1,
            is_free_preview=True,
        )
        self.attachment_2 = LessonAttachment.objects.create(
            lesson=self.lesson_1,
            title='Guide PDF Formats',
            attachment_type=LessonAttachment.AttachmentType.CHEATSHEET,
            file_format='pdf',
            file_size_bytes=1048576,  # 1 Mo
            external_url='https://example.cm/guide.pdf',
            order=2,
            is_free_preview=True,
        )

    def test_course_counts(self):
        self.assertEqual(self.course.total_modules_count, 1)
        self.assertEqual(self.course.total_lessons_count, 2)

    def test_list_published_courses(self):
        courses = list_published_courses()
        self.assertEqual(courses.count(), 1)
        self.assertEqual(courses.first().slug, 'test-course')

    def test_get_course_by_slug(self):
        course = get_course_by_slug('test-course')
        self.assertIsNotNone(course)
        self.assertEqual(course.title, 'Test Course')

    def test_get_lesson_detail_with_preferred_language(self):
        data = get_lesson_detail(
            course_slug='test-course',
            lesson_slug='lesson-1',
            language='en',
        )
        self.assertIsNotNone(data)
        self.assertEqual(data['title'], 'Lesson 1 EN')
        self.assertFalse(data['is_fallback_language'])
        self.assertIsNone(data['previous_lesson'])
        self.assertIsNotNone(data['next_lesson'])
        self.assertEqual(data['next_lesson']['slug'], 'lesson-2')

    def test_get_lesson_detail_bilingual_fallback(self):
        data = get_lesson_detail(
            course_slug='test-course',
            lesson_slug='lesson-2',
            language='en',
        )
        self.assertIsNotNone(data)
        self.assertEqual(data['title'], 'Leçon 2 FR')
        self.assertTrue(data['is_fallback_language'])
        self.assertIsNotNone(data['previous_lesson'])
        self.assertEqual(data['previous_lesson']['slug'], 'lesson-1')
        self.assertIsNone(data['next_lesson'])

    def test_lesson_attachment_size_display(self):
        # 148480 bytes = 145.0 Ko
        self.assertEqual(self.attachment_1.file_size_display, '145.0 Ko')
        # 1048576 bytes = 1.0 Mo
        self.assertEqual(self.attachment_2.file_size_display, '1.0 Mo')
        # Zero size
        empty_attachment = LessonAttachment(file_size_bytes=0)
        self.assertEqual(empty_attachment.file_size_display, '—')

    def test_get_lesson_detail_includes_attachments(self):
        data = get_lesson_detail(
            course_slug='test-course',
            lesson_slug='lesson-1',
            language='fr',
        )
        self.assertIn('attachments', data)
        self.assertEqual(len(data['attachments']), 2)
        self.assertEqual(data['attachments'][0].title, 'Exercice Ventes Douala')
        self.assertEqual(data['attachments'][1].title, 'Guide PDF Formats')

    def test_get_lesson_attachment_by_id(self):
        att = get_lesson_attachment_by_id(self.attachment_1.id)
        self.assertIsNotNone(att)
        self.assertEqual(att.title, 'Exercice Ventes Douala')
        self.assertEqual(att.lesson.slug, 'lesson-1')


class AttachmentServicesAndAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.track = Track.objects.create(name='Excel Track', slug='excel-track', tool=Track.Tool.EXCEL)
        self.free_course = Course.objects.create(
            track=self.track,
            title='Excel Analytics Free',
            slug='excel-analytics-free',
            level=Course.Level.BEGINNER,
            price_tier=Course.PriceTier.FREE,
        )
        self.paid_course = Course.objects.create(
            track=self.track,
            title='Excel Pro Paid',
            slug='excel-pro-paid',
            level=Course.Level.ADVANCED,
            price_tier=Course.PriceTier.PRO,
        )
        self.module_free = Module.objects.create(course=self.free_course, title='Module Free', order=1)
        self.module_paid = Module.objects.create(course=self.paid_course, title='Module Paid', order=1)

        self.lesson_free = Lesson.objects.create(
            module=self.module_free,
            title='Nettoyage Douala',
            slug='nettoyage-douala',
            order=1,
        )
        self.lesson_paid = Lesson.objects.create(
            module=self.module_paid,
            title='Macros Avancées',
            slug='macros-avancees',
            order=1,
            is_free_preview=False,
        )

        LessonTranslation.objects.create(
            lesson=self.lesson_free,
            language=LessonTranslation.Language.FR,
            title='Nettoyage Douala FR',
            content='# Markdown Content',
            status=LessonTranslation.Status.REVIEWED,
        )
        LessonTranslation.objects.create(
            lesson=self.lesson_paid,
            language=LessonTranslation.Language.FR,
            title='Macros Avancées FR',
            content='# Paid Content',
            status=LessonTranslation.Status.REVIEWED,
        )

        self.att_free = LessonAttachment.objects.create(
            lesson=self.lesson_free,
            title='Fichier Starter Libre',
            attachment_type=LessonAttachment.AttachmentType.STARTER,
            file_format='xlsx',
            file_size_bytes=51200,
            external_url='https://example.cm/starter.xlsx',
            is_free_preview=True,
            order=1,
        )
        self.att_paid = LessonAttachment.objects.create(
            lesson=self.lesson_paid,
            title='Fichier Pro Restreint',
            attachment_type=LessonAttachment.AttachmentType.SOLUTION,
            file_format='xlsx',
            file_size_bytes=250000,
            external_url='https://example.cm/pro_solution.xlsx',
            is_free_preview=False,
            order=1,
        )

    def test_course_list_api(self):
        response = self.client.get('/api/v1/courses/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)

    def test_course_detail_api(self):
        response = self.client.get('/api/v1/courses/excel-analytics-free/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['slug'], 'excel-analytics-free')
        self.assertEqual(len(response.data['modules']), 1)

    def test_lesson_detail_api_includes_attachments_payload(self):
        response = self.client.get('/api/v1/courses/excel-analytics-free/lessons/nettoyage-douala/?lang=fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['slug'], 'nettoyage-douala')
        self.assertIn('attachments', response.data)
        self.assertEqual(len(response.data['attachments']), 1)

        att_data = response.data['attachments'][0]
        self.assertEqual(att_data['title'], 'Fichier Starter Libre')
        self.assertEqual(att_data['file_format'], 'xlsx')
        self.assertEqual(att_data['file_size_display'], '50.0 Ko')
        self.assertEqual(att_data['download_url'], 'https://example.cm/starter.xlsx')

    def test_record_attachment_download_service(self):
        initial_count = self.att_free.download_count
        count = record_attachment_download(self.att_free)
        self.assertEqual(count, initial_count + 1)

    def test_download_endpoint_free_attachment_redirect(self):
        url = f'/api/v1/courses/attachments/{self.att_free.id}/download/'
        response = self.client.get(url)
        # Should redirect to external_url with 302
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, 'https://example.cm/starter.xlsx')

        # Download counter should have incremented
        self.att_free.refresh_from_db()
        self.assertEqual(self.att_free.download_count, 1)

    def test_download_endpoint_paid_attachment_anonymous_denied(self):
        url = f'/api/v1/courses/attachments/{self.att_paid.id}/download/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 403)
        self.assertIn('Access denied', response.data['detail'])

    def test_download_endpoint_not_found(self):
        response = self.client.get('/api/v1/courses/attachments/99999/download/')
        self.assertEqual(response.status_code, 404)
