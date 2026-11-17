from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import (
    Mission,
    MissionSubmission,
    LearningEvent,
)

User = get_user_model()


class InstructorGradingAndAnalyticsTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.instructor = User.objects.create_user(
            email='alain.fotso@datamboa.cm',
            password='securepassword123',
            first_name='Alain',
            last_name='Fotso',
            is_staff=True,
        )
        self.student = User.objects.create_user(
            email='etudiant.douala@datamboa.cm',
            password='securepassword123',
            first_name='Etudiant',
            last_name='Douala',
        )
        self.client.force_authenticate(user=self.instructor)

        self.mission = Mission.objects.create(
            title="Audit du Risque de Crédit — Microfinance Bafoussam",
            slug="audit-risque-bafoussam",
            company_name="COOPEC de l'Ouest",
            sector="Microfinance",
            location="Bafoussam, Cameroun",
            estimated_duration_minutes=60,
            context_brief="Brief microfinance",
            business_problem="Calculer le portefeuille à risque",
            dataset_description="Dataset credits",
            dataset_sample=[{"id": 1}],
            deliverables=["Rapport de diagnostic"],
            evaluation_rubric=[{"id": "r1", "label": "Qualité de calcul", "points": 100}],
            is_published=True,
        )

        self.submission = MissionSubmission.objects.create(
            mission=self.mission,
            user=self.student,
            self_evaluation={"r1": 80},
            final_score=80,
            learner_notes="Voici mon analyse des dossiers de crédit à Bafoussam.",
            deliverable_link="https://datamboa.cm/chunked_uploads/rapport.xlsx",
            is_completed=True,
        )

    def test_list_submissions_unauthenticated(self):
        anon_client = APIClient()
        res = anon_client.get('/api/v1/courses/instructor/submissions/')
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_list_submissions_success(self):
        res = self.client.get('/api/v1/courses/instructor/submissions/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(res.data), 1)
        sub = res.data[0]
        self.assertEqual(sub['mission_title'], self.mission.title)
        self.assertEqual(sub['learner_email'], self.student.email)
        self.assertFalse(sub['is_graded'])

    def test_grade_submission_success(self):
        res = self.client.post(f'/api/v1/courses/instructor/submissions/{self.submission.id}/grade/', {
            'grade': 88,
            'feedback': "Excellente analyse du PAR 30. La segmentation par quartier de Bafoussam est très pertinente.",
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertTrue(res.data['success'])
        self.assertEqual(res.data['instructor_grade'], 88)

        # Verify DB update
        self.submission.refresh_from_db()
        self.assertEqual(self.submission.instructor_grade, 88)
        self.assertEqual(self.submission.graded_by, self.instructor)
        self.assertIsNotNone(self.submission.graded_at)

        # Verify xAPI event emission (R15)
        event = LearningEvent.objects.filter(user=self.student, verb='evaluated').first()
        self.assertIsNotNone(event)
        self.assertEqual(event.result_score_raw, 88.0)
        self.assertTrue(event.result_success)

    def test_grade_submission_invalid_grade(self):
        res = self.client.post(f'/api/v1/courses/instructor/submissions/{self.submission.id}/grade/', {
            'grade': 120,
            'feedback': "Note invalide",
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_learning_objectives_analytics(self):
        res = self.client.get('/api/v1/courses/instructor/learning-objectives-analytics/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn('bloom_levels', res.data)
        self.assertIn('notions_to_review', res.data)
        self.assertGreaterEqual(len(res.data['bloom_levels']), 4)
        self.assertGreaterEqual(len(res.data['notions_to_review']), 1)
        # Check Bloom level labels
        bloom_names = [b['level'] for b in res.data['bloom_levels']]
        self.assertIn('REMEMBER', bloom_names)
        self.assertIn('UNDERSTAND', bloom_names)
        self.assertIn('APPLY', bloom_names)
        self.assertIn('ANALYZE', bloom_names)

