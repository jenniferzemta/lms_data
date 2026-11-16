from decimal import Decimal
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from courses.models import Course, LearningEvent, PlacementAssessment, Track
from courses.selectors import PLACEMENT_QUESTIONS, get_placement_test_questions

User = get_user_model()


class PlacementTestAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='apprenant@datamboa.cm',
            password='TestPassword123!',
            first_name='Mireille',
            last_name='Ngo'
        )
        self.track = Track.objects.create(
            name='Data Analyst Track',
            slug='data-analyst-track',
            tool=Track.Tool.EXCEL,
            order=1
        )
        self.course_n1 = Course.objects.create(
            track=self.track,
            title='Excel Niveau 1 : Fondamentaux',
            slug='excel-n1-fondamentaux',
            level=Course.Level.BEGINNER,
            is_published=True
        )
        self.course_n2 = Course.objects.create(
            track=self.track,
            title='Excel Niveau 2 : Formules & TCD',
            slug='excel-n2-formules-tcd',
            level=Course.Level.INTERMEDIATE,
            is_published=True
        )
        self.course_n3 = Course.objects.create(
            track=self.track,
            title='Power BI & DAX Niveau 3 : Modélisation',
            slug='powerbi-n3-modelisation',
            level=Course.Level.ADVANCED,
            is_published=True
        )

    def test_get_questions_public_no_leaked_answers(self):
        url = reverse('courses:placement-test-questions')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        questions = response.data.get('questions', [])
        self.assertGreaterEqual(len(questions), 8)

        # Ensure correct key is never leaked
        for q in questions:
            for opt in q['options']:
                self.assertNotIn('correct', opt)

    def test_submit_all_correct_recommends_n3(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('courses:placement-test-submit')

        # Build all correct answers
        answers = {}
        for q in PLACEMENT_QUESTIONS:
            correct_opt = next(opt for opt in q['options'] if opt.get('correct'))
            answers[q['id']] = correct_opt['id']

        response = self.client.post(url, {'answers': answers}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score_total'], 100.0)
        self.assertEqual(response.data['recommended_level'], PlacementAssessment.LEVEL_N3)
        self.assertIsNotNone(response.data['recommended_course'])

        # Verify xAPI statement
        xapi_event = LearningEvent.objects.filter(
            user=self.user,
            verb='completed',
            object_type='assessment'
        ).first()
        self.assertIsNotNone(xapi_event)
        self.assertEqual(xapi_event.result_score_scaled, 1.0)

    def test_submit_partial_answers_recommends_n2(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('courses:placement-test-submit')

        # Answer only first 4 correctly (50 points out of 100)
        answers = {}
        for i, q in enumerate(PLACEMENT_QUESTIONS):
            if i < 4:
                correct_opt = next(opt for opt in q['options'] if opt.get('correct'))
                answers[q['id']] = correct_opt['id']
            else:
                answers[q['id']] = 'wrong_choice'

        response = self.client.post(url, {'answers': answers}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['recommended_level'], PlacementAssessment.LEVEL_N2)

    def test_submit_wrong_answers_recommends_n1(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('courses:placement-test-submit')

        answers = {q['id']: 'wrong' for q in PLACEMENT_QUESTIONS}
        response = self.client.post(url, {'answers': answers}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['score_total'], 0.0)
        self.assertEqual(response.data['recommended_level'], PlacementAssessment.LEVEL_N1)

    def test_get_user_placement_result_endpoint(self):
        self.client.force_authenticate(user=self.user)
        result_url = reverse('courses:placement-test-result')

        # Before taking test
        r_before = self.client.get(result_url)
        self.assertEqual(r_before.status_code, status.HTTP_200_OK)
        self.assertFalse(r_before.data['has_taken_test'])

        # Submit test
        submit_url = reverse('courses:placement-test-submit')
        self.client.post(submit_url, {'answers': {}}, format='json')

        # After taking test
        r_after = self.client.get(result_url)
        self.assertEqual(r_after.status_code, status.HTTP_200_OK)
        self.assertTrue(r_after.data['has_taken_test'])
        self.assertIn('score_excel', r_after.data['result'])
