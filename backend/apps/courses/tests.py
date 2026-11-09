import os
from django.test import TestCase
from rest_framework.test import APIClient

from courses.models import (
    Certificate,
    Course,
    Lesson,
    LessonAnswer,
    LessonAttachment,
    LessonNote,
    LessonProgress,
    LessonQuestion,
    LessonTranslation,
    Module,
    Quiz,
    QuizAnswerOption,
    QuizAttempt,
    QuizQuestion,
    Track,
)
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


import tempfile
from django.test import override_settings

class VideoStreamViewTests(TestCase):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.client = APIClient()
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.video_filename = 'test_sample.mp4'
        self.video_path = os.path.join(self.temp_dir.name, self.video_filename)
        # Create a dummy 100-byte video file
        with open(self.video_path, 'wb') as f:
            f.write(b'X' * 100)

    def tearDown(self):
        try:
            self.temp_dir.cleanup()
        except Exception:
            pass

    def test_stream_video_full(self):
        with override_settings(LOCAL_VIDEOS_DIR=self.temp_dir.name):
            url = f'/api/v1/courses/videos/{self.video_filename}/'
            response = self.client.get(url)
            self.assertEqual(response.status_code, 200)
            response.close()
            self.assertEqual(response['Content-Length'], '100')
            self.assertEqual(response['Accept-Ranges'], 'bytes')

    def test_stream_video_partial_range(self):
        with override_settings(LOCAL_VIDEOS_DIR=self.temp_dir.name):
            url = f'/api/v1/courses/videos/{self.video_filename}/'
            response = self.client.get(url, HTTP_RANGE='bytes=0-49')
            self.assertEqual(response.status_code, 206)
            self.assertEqual(response['Content-Range'], 'bytes 0-49/100')
            self.assertEqual(response['Content-Length'], '50')
            content = b''.join(response.streaming_content)
            self.assertEqual(len(content), 50)

    def test_stream_video_not_found(self):
        with override_settings(LOCAL_VIDEOS_DIR=self.temp_dir.name):
            url = '/api/v1/courses/videos/non_existent.mp4/'
            response = self.client.get(url)
            self.assertEqual(response.status_code, 404)



class CourseProgressAndEnrollmentTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        from accounts.models import User
        self.user = User.objects.create_user(
            email='learner@example.cm',
            password='Password123!',
            first_name='Mireille',
            last_name='Ngo',
        )
        self.track = Track.objects.create(
            name='Excel Track',
            slug='excel-track',
            tool=Track.Tool.EXCEL,
            order=1,
        )
        self.course = Course.objects.create(
            track=self.track,
            title='Excel Analytics',
            slug='excel-analytics',
            level=Course.Level.BEGINNER,
            price_tier=Course.PriceTier.FREE,
            order=1,
            is_published=True,
        )
        self.module = Module.objects.create(
            course=self.course,
            title='Module 1',
            order=1,
            is_published=True,
        )
        self.l1 = Lesson.objects.create(
            module=self.module,
            title='Lesson 1',
            slug='lesson-1',
            lesson_type=Lesson.LessonType.TEXT,
            order=1,
            is_published=True,
        )
        self.l2 = Lesson.objects.create(
            module=self.module,
            title='Lesson 2',
            slug='lesson-2',
            lesson_type=Lesson.LessonType.TEXT,
            order=2,
            is_published=True,
        )

    def test_anonymous_progress_summary(self):
        url = f'/api/v1/courses/{self.course.slug}/progress/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data['is_enrolled'])
        self.assertEqual(response.data['progress_percentage'], 0)
        self.assertEqual(response.data['total_lessons_count'], 2)
        self.assertEqual(response.data['resume_lesson']['slug'], 'lesson-1')

    def test_authenticated_enrollment(self):
        self.client.force_authenticate(user=self.user)
        url = f'/api/v1/courses/{self.course.slug}/enroll/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_enrolled'])
        self.assertEqual(response.data['status'], 'ACTIVE')

    def test_mark_lesson_complete(self):
        self.client.force_authenticate(user=self.user)
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.l1.slug}/complete/'
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data['is_completed'])
        self.assertEqual(response.data['progress_percentage'], 50)
        self.assertEqual(response.data['status'], 'ACTIVE')

        # Check progress summary after completing lesson 1
        summary_url = f'/api/v1/courses/{self.course.slug}/progress/'
        summary_res = self.client.get(summary_url)
        self.assertEqual(summary_res.status_code, 200)
        self.assertEqual(summary_res.data['completed_lessons_count'], 1)
        self.assertEqual(summary_res.data['progress_percentage'], 50)
        self.assertIn('lesson-1', summary_res.data['completed_lesson_slugs'])
        self.assertEqual(summary_res.data['resume_lesson']['slug'], 'lesson-2')

        # Complete lesson 2 -> 100% and COMPLETED
        url2 = f'/api/v1/courses/{self.course.slug}/lessons/{self.l2.slug}/complete/'
        res2 = self.client.post(url2)
        self.assertEqual(res2.status_code, 200)
        self.assertEqual(res2.data['progress_percentage'], 100)
        self.assertEqual(res2.data['status'], 'COMPLETED')


class QuizAPITests(TestCase):
    def setUp(self):
        from accounts.models import User
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='quizlearner@datamboa.cm',
            password='TestPassword123!',
            first_name='Quiz',
            last_name='Learner',
        )
        self.track = Track.objects.create(name='Excel Track', slug='excel-quiz-track', tool=Track.Tool.EXCEL, order=1)
        self.course = Course.objects.create(
            track=self.track,
            title='Excel Analytics',
            slug='excel-analytics',
            level=Course.Level.BEGINNER,
            price_tier=Course.PriceTier.FREE,
        )
        self.module = Module.objects.create(course=self.course, title='Module 1', order=1)
        self.lesson = Lesson.objects.create(
            module=self.module,
            title='Environnement et Types',
            slug='environnement-et-types',
            duration_minutes=15,
            order=1,
        )
        self.quiz = Quiz.objects.create(
            lesson=self.lesson,
            title='Quiz d’évaluation formative',
            passing_score_percentage=70,
        )
        # Question 1: Single choice
        self.q1 = QuizQuestion.objects.create(
            quiz=self.quiz,
            prompt='Dans un tableau Excel au Cameroun, que se passe-t-il si vous écrivez "15000 FCFA" ?',
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            explanation='Excel considère la cellule comme du texte brut et empêche toute opération arithmétique.',
            order=1,
        )
        self.q1_opt1 = QuizAnswerOption.objects.create(
            question=self.q1,
            text='Excel le convertit automatiquement en devise',
            is_correct=False,
            order=1,
        )
        self.q1_opt2 = QuizAnswerOption.objects.create(
            question=self.q1,
            text='Excel le traite comme du texte, bloquant les calculs',
            is_correct=True,
            order=2,
        )

        # Question 2: Numeric
        self.q2 = QuizQuestion.objects.create(
            quiz=self.quiz,
            prompt='Si la créance d’Akwa est de 250000 et celle de Bonabéri de 150000, quel est le total ?',
            question_type=QuizQuestion.QuestionType.NUMERIC,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            numeric_target=400000,
            explanation='250000 + 150000 = 400000 FCFA.',
            order=2,
        )

    def test_public_quiz_endpoint_does_not_leak_answers(self):
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/quiz/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.data
        self.assertEqual(data['title'], 'Quiz d’évaluation formative')
        self.assertEqual(len(data['questions']), 2)

        # Ensure correct answer and explanation are NOT leaked in public GET
        for q in data['questions']:
            self.assertNotIn('explanation', q)
            self.assertNotIn('numeric_target', q)
            for opt in q['options']:
                self.assertNotIn('is_correct', opt)

    def test_quiz_submission_unauthenticated_fails(self):
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/quiz/submit/'
        response = self.client.post(url, {'answers': {str(self.q1.id): self.q1_opt2.id}}, format='json')
        self.assertIn(response.status_code, [401, 403])

    def test_quiz_submission_passing_completes_lesson(self):
        self.client.force_authenticate(user=self.user)
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/quiz/submit/'

        # Submit 100% correct answers
        payload = {
            'answers': {
                str(self.q1.id): self.q1_opt2.id,
                str(self.q2.id): '400 000',  # Test spaces in numeric input
            }
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data['score_percentage'], 100)
        self.assertTrue(data['is_passed'])
        self.assertEqual(len(data['feedback_summary']), 2)

        # Check formative feedback includes explanation
        fb1 = data['feedback_summary'][0]
        self.assertTrue(fb1['is_correct'])
        self.assertIn('Excel considère la cellule comme du texte brut', fb1['explanation'])

        # Check lesson is auto-marked as completed
        from courses.models import LessonProgress
        progress = LessonProgress.objects.get(user=self.user, lesson=self.lesson)
        self.assertTrue(progress.is_completed)

    def test_quiz_submission_failing_does_not_complete_lesson(self):
        self.client.force_authenticate(user=self.user)
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/quiz/submit/'

        # Submit incorrect answers -> 0%
        payload = {
            'answers': {
                str(self.q1.id): self.q1_opt1.id,
                str(self.q2.id): '1000',
            }
        }
        response = self.client.post(url, payload, format='json')
        self.assertEqual(response.status_code, 200)
        data = response.data

        self.assertEqual(data['score_percentage'], 0)
        self.assertFalse(data['is_passed'])

        from courses.models import LessonProgress
        progress = LessonProgress.objects.filter(user=self.user, lesson=self.lesson).first()
        self.assertTrue(progress is None or not progress.is_completed)


class LessonNotesAndQATests(TestCase):
    def setUp(self):
        from accounts.models import User
        self.client = APIClient()
        self.learner = User.objects.create_user(
            email='paul.biya@example.cm',
            password='TestPassword123!',
            first_name='Paul',
            last_name='Biya',
        )
        self.instructor = User.objects.create_user(
            email='alain.fotso@datamboa.cm',
            password='TestPassword123!',
            first_name='Alain',
            last_name='Fotso',
            is_staff=True,
        )
        self.track = Track.objects.create(name='Excel Track', slug='excel-notes-track', tool=Track.Tool.EXCEL, order=1)
        self.course = Course.objects.create(
            track=self.track,
            title='Excel Formation',
            slug='excel-formation',
            level=Course.Level.BEGINNER,
            price_tier=Course.PriceTier.FREE,
        )
        self.module = Module.objects.create(course=self.course, title='Module 1', order=1)
        self.lesson = Lesson.objects.create(
            module=self.module,
            title='Leçon Formules',
            slug='lecon-formules',
            duration_minutes=20,
            order=1,
        )

    def test_unauthenticated_cannot_create_or_view_notes(self):
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/notes/'
        response = self.client.get(url)
        self.assertIn(response.status_code, [401, 403])

        post_res = self.client.post(url, {'content': 'Ma note', 'video_timestamp_seconds': 45}, format='json')
        self.assertIn(post_res.status_code, [401, 403])

    def test_authenticated_can_create_list_and_delete_notes(self):
        self.client.force_authenticate(user=self.learner)
        url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/notes/'

        # Create note
        res = self.client.post(url, {'content': 'Attention au point-virgule', 'video_timestamp_seconds': 125}, format='json')
        self.assertEqual(res.status_code, 201)
        note_id = res.data['id']
        self.assertEqual(res.data['video_timestamp_seconds'], 125)
        self.assertEqual(res.data['content'], 'Attention au point-virgule')

        # List notes
        list_res = self.client.get(url)
        self.assertEqual(list_res.status_code, 200)
        self.assertEqual(len(list_res.data), 1)
        self.assertEqual(list_res.data[0]['id'], note_id)

        # Delete note
        del_url = f'/api/v1/courses/notes/{note_id}/'
        del_res = self.client.delete(del_url)
        self.assertEqual(del_res.status_code, 204)

        # Ensure deleted
        list_res2 = self.client.get(url)
        self.assertEqual(len(list_res2.data), 0)

    def test_community_qa_workflow(self):
        # Anonymous can view Q&A
        qa_url = f'/api/v1/courses/{self.course.slug}/lessons/{self.lesson.slug}/questions/'
        get_res = self.client.get(qa_url)
        self.assertEqual(get_res.status_code, 200)
        self.assertEqual(len(get_res.data), 0)

        # Learner asks a question
        self.client.force_authenticate(user=self.learner)
        post_q_res = self.client.post(
            qa_url,
            {'title': 'Erreur #NOM?', 'content': 'Pourquoi mon Excel affiche #NOM? quand j’écris =SUM() ?'},
            format='json',
        )
        self.assertEqual(post_q_res.status_code, 201)
        q_id = post_q_res.data['id']
        self.assertEqual(post_q_res.data['title'], 'Erreur #NOM?')

        # Instructor replies with endorsement
        self.client.force_authenticate(user=self.instructor)
        ans_url = f'/api/v1/courses/questions/{q_id}/answers/'
        ans_res = self.client.post(
            ans_url,
            {'content': 'Sur la version française, utilisez la fonction =SOMME() et non =SUM().'},
            format='json',
        )
        self.assertEqual(ans_res.status_code, 201)
        self.assertTrue(ans_res.data['is_endorsed_by_instructor'])
        self.assertTrue(ans_res.data['is_instructor'])

        # Check full question thread includes reply
        thread_res = self.client.get(qa_url)
        self.assertEqual(thread_res.status_code, 200)
        self.assertEqual(len(thread_res.data), 1)
        self.assertEqual(thread_res.data[0]['answers_count'], 1)
        self.assertEqual(thread_res.data[0]['answers'][0]['content'], 'Sur la version française, utilisez la fonction =SOMME() et non =SUM().')




class CertificateTests(TestCase):
    def setUp(self):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        self.learner = User.objects.create_user(
            email='laure_cert@datamboa.cm',
            password='Password123!',
            first_name='Laure',
            last_name='Ngue',
        )
        self.track = Track.objects.create(
            name='Excel Track',
            slug='excel-track',
            tool=Track.Tool.EXCEL,
            order=1,
        )
        self.course = Course.objects.create(
            track=self.track,
            title='Excel Bases & Formules',
            slug='excel-bases-cert',
            level=Course.Level.BEGINNER,
            price_tier=Course.PriceTier.FREE,
            order=1,
            is_published=True,
        )
        self.module = Module.objects.create(
            course=self.course,
            title='Module 1',
            order=1,
            is_published=True,
        )
        self.lesson = Lesson.objects.create(
            module=self.module,
            title='Leçon Unique',
            slug='lecon-unique-cert',
            duration_minutes=15,
            order=1,
            is_published=True,
        )
        self.client = APIClient()

    def test_automatic_certificate_issuance_at_100_percent(self):
        from courses.services import mark_lesson_completed, issue_course_certificate
        from courses.models import CourseEnrollment

        # Before completion: 0 certificates
        self.assertEqual(Certificate.objects.filter(user=self.learner, course=self.course).count(), 0)

        # Mark lesson completed -> triggers 100% progress and auto-issuance
        progress, enrollment = mark_lesson_completed(self.learner, self.lesson)
        self.assertEqual(enrollment.progress_percentage, 100)
        self.assertEqual(enrollment.status, CourseEnrollment.Status.COMPLETED)

        # Certificate must now exist
        cert = Certificate.objects.filter(user=self.learner, course=self.course).first()
        self.assertIsNotNone(cert)
        self.assertTrue(cert.certificate_code.startswith('DMB-EXC-'))
        self.assertEqual(cert.recipient_name, 'Laure Ngue')
        self.assertEqual(cert.final_score, 100)

    def test_certificate_public_verification_api(self):
        from courses.services import mark_lesson_completed
        mark_lesson_completed(self.learner, self.lesson)
        cert = Certificate.objects.get(user=self.learner, course=self.course)

        # Public verification (no auth needed)
        verify_url = f'/api/v1/courses/certificates/{cert.certificate_code}/verify/'
        res = self.client.get(verify_url)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data['is_valid'])
        self.assertEqual(res.data['recipient_name'], 'Laure Ngue')
        self.assertEqual(res.data['course_title'], 'Excel Bases & Formules')
        self.assertEqual(res.data['track_name'], 'Excel Track')
        self.assertEqual(res.data['certificate_code'], cert.certificate_code)

        # Invalid code verification
        bad_res = self.client.get('/api/v1/courses/certificates/NON-EXISTENT-CODE/verify/')
        self.assertEqual(bad_res.status_code, 404)
        self.assertFalse(bad_res.data['is_valid'])

        # Revoked certificate verification
        cert.is_revoked = True
        cert.save()
        revoked_res = self.client.get(verify_url)
        self.assertEqual(revoked_res.status_code, 404)

    def test_learner_course_and_my_certificates_api(self):
        from courses.services import mark_lesson_completed
        cert_url = f'/api/v1/courses/{self.course.slug}/certificate/'
        my_certs_url = '/api/v1/courses/my-certificates/'

        # Anonymous cannot access learner certificate endpoints
        self.assertIn(self.client.get(cert_url).status_code, [401, 403])
        self.assertIn(self.client.get(my_certs_url).status_code, [401, 403])

        # Authenticated but incomplete course -> 404
        self.client.force_authenticate(user=self.learner)
        self.assertEqual(self.client.get(cert_url).status_code, 404)

        # Complete course -> certificate available with social share URLs
        mark_lesson_completed(self.learner, self.lesson)
        res = self.client.get(cert_url)
        self.assertEqual(res.status_code, 200)
        self.assertIn('share_whatsapp_url', res.data)
        self.assertIn('share_linkedin_url', res.data)
        self.assertIn('api.whatsapp.com', res.data['share_whatsapp_url'])
        self.assertIn('linkedin.com', res.data['share_linkedin_url'])

        # List all learner certificates
        my_res = self.client.get(my_certs_url)
        self.assertEqual(my_res.status_code, 200)
        self.assertEqual(len(my_res.data), 1)
        self.assertEqual(my_res.data[0]['course_slug'], self.course.slug)
