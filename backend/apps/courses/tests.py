from django.test import TestCase
from rest_framework.test import APIClient

from courses.models import Course, Lesson, LessonTranslation, Module, Track
from courses.selectors import get_course_by_slug, get_lesson_detail, list_published_courses


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
        # Lesson 2 has only FR translation (to test bilingual fallback)
        LessonTranslation.objects.create(
            lesson=self.lesson_2,
            language=LessonTranslation.Language.FR,
            title='Leçon 2 FR',
            content='Contenu FR uniquement',
            status=LessonTranslation.Status.REVIEWED,
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
        # Lesson 2 has only FR translation; when EN is requested, fallback is used
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


class CoursesAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.track = Track.objects.create(name='Excel Track', slug='excel-track', tool=Track.Tool.EXCEL)
        self.course = Course.objects.create(
            track=self.track,
            title='Excel Analytics',
            slug='excel-analytics',
            level=Course.Level.BEGINNER,
        )
        self.module = Module.objects.create(course=self.course, title='Module Alpha', order=1)
        self.lesson = Lesson.objects.create(
            module=self.module,
            title='Nettoyage Douala',
            slug='nettoyage-douala',
            order=1,
        )
        LessonTranslation.objects.create(
            lesson=self.lesson,
            language=LessonTranslation.Language.FR,
            title='Nettoyage Douala FR',
            content='# Markdown Content',
            status=LessonTranslation.Status.REVIEWED,
        )

    def test_course_list_api(self):
        response = self.client.get('/api/v1/courses/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'excel-analytics')

    def test_course_detail_api(self):
        response = self.client.get('/api/v1/courses/excel-analytics/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['slug'], 'excel-analytics')
        self.assertEqual(len(response.data['modules']), 1)
        self.assertEqual(len(response.data['modules'][0]['lessons']), 1)

    def test_lesson_detail_api(self):
        response = self.client.get('/api/v1/courses/excel-analytics/lessons/nettoyage-douala/?lang=fr')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['slug'], 'nettoyage-douala')
        self.assertEqual(response.data['translation']['title'], 'Nettoyage Douala FR')

    def test_lesson_detail_404(self):
        response = self.client.get('/api/v1/courses/excel-analytics/lessons/non-existent/')
        self.assertEqual(response.status_code, 404)
