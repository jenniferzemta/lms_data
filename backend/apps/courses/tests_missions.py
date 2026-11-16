from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import Mission, MissionSubmission, LearningEvent
from courses.services import submit_mission_self_evaluation

User = get_user_model()


class MissionModelAndServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='learner@datamboa.cm',
            password='testpassword123',
            first_name='Test',
            last_name='Learner'
        )
        self.mission = Mission.objects.create(
            title='Audit Risque Bafoussam',
            slug='audit-risque-bafoussam',
            company_name='Express Microfinance',
            sector='Microfinance',
            location='Bafoussam, Cameroun',
            difficulty=Mission.Difficulty.INTERMEDIATE,
            estimated_duration_minutes=90,
            currency='FCFA',
            context_brief='Brief de mise en situation...',
            business_problem='Problème des impayés...',
            tasks=['Tâche 1', 'Tâche 2'],
            deliverables=['Livrable 1'],
            evaluation_rubric=[
                {'id': 'r1', 'label': 'Critère 1', 'points': 50},
                {'id': 'r2', 'label': 'Critère 2', 'points': 50}
            ],
            model_solution_summary='Corrigé type de référence...',
            is_published=True,
            order=1
        )

    def test_mission_str_representation(self):
        self.assertEqual(str(self.mission), 'Audit Risque Bafoussam (Express Microfinance)')

    def test_submit_mission_self_evaluation_service(self):
        self_eval = {'r1': 50, 'r2': 35}
        submission = submit_mission_self_evaluation(
            mission=self.mission,
            user=self.user,
            self_evaluation=self_eval,
            learner_notes='Analyse complétée avec extraction SQL.',
            deliverable_link='https://github.com/learner/audit-microfinance'
        )

        self.assertIsNotNone(submission)
        self.assertEqual(submission.final_score, 85)
        self.assertTrue(submission.is_completed)
        self.assertIn('r1', submission.self_evaluation)

        # Check xAPI statement emission
        event = LearningEvent.objects.filter(
            user=self.user,
            object_id=f"mission:{self.mission.slug}"
        ).first()
        self.assertIsNotNone(event)
        self.assertEqual(event.verb, LearningEvent.Verb.COMPLETED)
        self.assertEqual(event.result_score_raw, 85.0)
        self.assertTrue(event.result_success)


class MissionApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='api_learner@datamboa.cm',
            password='securepassword123',
            first_name='Api',
            last_name='Learner'
        )
        self.mission = Mission.objects.create(
            title='Optimisation Stocks Douala',
            slug='stocks-douala',
            company_name='Kamer Boissons',
            sector='Distribution FMCG',
            location='Douala, Cameroun',
            difficulty=Mission.Difficulty.ADVANCED,
            estimated_duration_minutes=120,
            currency='FCFA',
            context_brief='Brief logistique...',
            business_problem='Ruptures de stock...',
            tasks=['Tâche 1'],
            deliverables=['Rapport Excel'],
            evaluation_rubric=[{'id': 'r1', 'label': 'Critère 1', 'points': 100}],
            model_solution_summary='Corrigé logistique exclusif',
            is_published=True,
            order=1
        )

    def test_list_missions_public(self):
        response = self.client.get(reverse('courses:mission-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertGreaterEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['slug'], 'stocks-douala')

    def test_get_mission_detail_public(self):
        response = self.client.get(reverse('courses:mission-detail', kwargs={'slug': 'stocks-douala'}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Optimisation Stocks Douala')
        # Model solution summary is hidden before user submission (R24)
        self.assertEqual(response.data['model_solution_summary'], '')

    def test_submit_mission_evaluation_requires_auth(self):
        response = self.client.post(
            reverse('courses:mission-submit', kwargs={'slug': 'stocks-douala'}),
            data={'self_evaluation': {'r1': 80}},
            format='json'
        )
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_submit_mission_evaluation_success_unlocks_solution(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('courses:mission-submit', kwargs={'slug': 'stocks-douala'}),
            data={
                'self_evaluation': {'r1': 90},
                'learner_notes': 'Mes calculs de point de commande.',
                'deliverable_link': 'https://drive.google.com/file/d/sample'
            },
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['submission']['final_score'], 90)
        self.assertEqual(response.data['model_solution_summary'], 'Corrigé logistique exclusif')

        # Now GET mission-detail should reveal model solution for this authenticated user
        detail_res = self.client.get(reverse('courses:mission-detail', kwargs={'slug': 'stocks-douala'}))
        self.assertEqual(detail_res.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_res.data['model_solution_summary'], 'Corrigé logistique exclusif')
        self.assertIsNotNone(detail_res.data['user_submission'])
