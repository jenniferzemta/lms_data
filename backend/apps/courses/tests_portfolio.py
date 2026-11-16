from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import (
    LearnerPortfolio,
    PortfolioProject,
    Mission,
    LearningEvent,
)

User = get_user_model()


class PortfolioTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='laure.analyste@datamboa.cm',
            password='securepassword123',
            first_name='Laure',
            last_name='Analyste',
        )
        self.client.force_authenticate(user=self.user)

        # Create a sample business mission
        self.mission = Mission.objects.create(
            title="Audit du Risque de Crédit — Microfinance Bafoussam",
            slug="audit-risque-credit-bafoussam",
            company_name="COOPEC de l'Ouest",
            sector="Microfinance",
            location="Bafoussam, Cameroun",
            estimated_duration_minutes=60,
            context_brief="La COOPEC de l'Ouest fait face à une augmentation des impayés sur ses crédits tontiniers.",
            business_problem="Analyser les retards de remboursement à 30 jours et identifier les facteurs de risque.",
            dataset_description="Jeu de données de 1500 dossiers de crédit en FCFA",
            dataset_sample=[{"id": 1, "montant_fcfa": 2500000}],
            deliverables=["Rapport de diagnostic", "Recommandations"],
            evaluation_rubric=[{"id": "r1", "label": "Qualité d'analyse", "points": 100}],
            is_published=True,
        )

    def test_my_portfolio_unauthenticated_forbidden(self):
        anon_client = APIClient()
        res = anon_client.get('/api/v1/courses/portfolio/my/')
        self.assertIn(res.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_my_portfolio_authenticated_creates_default(self):
        res = self.client.get('/api/v1/courses/portfolio/my/')
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['user']['email'], 'laure.analyste@datamboa.cm')
        self.assertEqual(res.data['city'], 'Douala')
        self.assertEqual(res.data['country'], 'Cameroun')

    def test_patch_my_portfolio(self):
        res = self.client.patch('/api/v1/courses/portfolio/my/', {
            'headline': 'Lead Data Analyst | Python, SQL & FCFA Financial Modeling',
            'city': 'Yaoundé',
            'bio': 'Spécialiste de la valorisation de données pour banques et PME africaines.',
            'linkedin_url': 'https://linkedin.com/in/laure-analyste',
        })
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertEqual(res.data['headline'], 'Lead Data Analyst | Python, SQL & FCFA Financial Modeling')
        self.assertEqual(res.data['city'], 'Yaoundé')
        self.assertEqual(res.data['linkedin_url'], 'https://linkedin.com/in/laure-analyste')

    def test_add_mission_to_portfolio_1_click_success(self):
        res = self.client.post('/api/v1/courses/portfolio/add-mission/', {
            'mission_slug': 'audit-risque-credit-bafoussam',
            'impact_metrics': '-18% de créances douteuses identifiées, 14.5M FCFA provisionnés',
            'featured': True,
        })
        self.assertEqual(res.status_code, status.HTTP_201_CREATED)
        self.assertTrue(res.data['success'])
        self.assertEqual(res.data['project']['title'], self.mission.title)
        self.assertEqual(res.data['project']['impact_metrics'], '-18% de créances douteuses identifiées, 14.5M FCFA provisionnés')

        # Check public portfolio showcases this project
        anon_client = APIClient()
        public_res = anon_client.get('/api/v1/courses/portfolio/laure.analyste/')
        self.assertEqual(public_res.status_code, status.HTTP_200_OK)
        self.assertEqual(len(public_res.data['projects']), 1)
        self.assertEqual(public_res.data['projects'][0]['title'], self.mission.title)
        self.assertEqual(public_res.data['stats']['projects_count'], 1)

        # Verify xAPI statement emitted (R15)
        event = LearningEvent.objects.filter(user=self.user, verb='shared').first()
        self.assertIsNotNone(event)
        self.assertEqual(event.object_type, 'portfolio_project')

    def test_add_mission_invalid_slug(self):
        res = self.client.post('/api/v1/courses/portfolio/add-mission/', {
            'mission_slug': 'non-existent-mission',
        })
        self.assertEqual(res.status_code, status.HTTP_400_BAD_REQUEST)

    def test_duplicate_add_mission_updates_project(self):
        # First add
        self.client.post('/api/v1/courses/portfolio/add-mission/', {
            'mission_slug': 'audit-risque-credit-bafoussam',
            'impact_metrics': 'Impact initial',
        })
        # Second add with updated metrics
        res2 = self.client.post('/api/v1/courses/portfolio/add-mission/', {
            'mission_slug': 'audit-risque-credit-bafoussam',
            'impact_metrics': 'Impact révisé',
        })
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)
        # Should still have only 1 project in DB
        projects_count = PortfolioProject.objects.filter(portfolio__user=self.user).count()
        self.assertEqual(projects_count, 1)
        self.assertEqual(res2.data['project']['impact_metrics'], 'Impact révisé')
