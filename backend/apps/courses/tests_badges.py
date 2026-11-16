from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import BadgeDefinition, UserBadgeEarned, LearningEvent
from courses.selectors import get_all_badges_with_user_status
from courses.services import award_badge_to_user

User = get_user_model()


class BadgeModelAndServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='badge_learner@datamboa.cm',
            password='testpassword123',
            first_name='Jean',
            last_name='Data'
        )
        self.badge_sql = BadgeDefinition.objects.create(
            slug='sql-pioneer',
            name='Pionnier SQL Cameroun',
            description='Avoir validé son premier atelier de requêtes SQL.',
            icon='terminal',
            category=BadgeDefinition.Category.LAB,
            points_reward=100,
            criteria_rule='sql_completed',
            order=1,
            is_active=True
        )
        self.badge_mission = BadgeDefinition.objects.create(
            slug='mission-first-strike',
            name='Premier Consultant Junior',
            description='Avoir mené à bien une étude de cas d\'entreprise africaine.',
            icon='briefcase',
            category=BadgeDefinition.Category.MISSION,
            points_reward=200,
            criteria_rule='mission_completed',
            order=2,
            is_active=True
        )

    def test_badge_str_representation(self):
        self.assertEqual(str(self.badge_sql), 'Pionnier SQL Cameroun (LAB)')

    def test_award_badge_to_user_creates_and_emits_xapi(self):
        earned, created = award_badge_to_user(
            user=self.user,
            badge_slug='sql-pioneer',
            metadata={'lab': 'microfinance', 'score': 100}
        )
        self.assertTrue(created)
        self.assertIsNotNone(earned)
        self.assertEqual(earned.badge, self.badge_sql)

        # Check xAPI emission
        event = LearningEvent.objects.filter(
            user=self.user,
            object_id=f"badge:{self.badge_sql.slug}"
        ).first()
        self.assertIsNotNone(event)
        self.assertEqual(event.verb, 'earned')
        self.assertEqual(event.result_score_raw, 100.0)

    def test_award_badge_deduplication(self):
        # First call
        earned1, created1 = award_badge_to_user(self.user, 'sql-pioneer')
        self.assertTrue(created1)

        # Second call should not duplicate
        earned2, created2 = award_badge_to_user(self.user, 'sql-pioneer')
        self.assertFalse(created2)
        self.assertEqual(earned1.id, earned2.id)
        self.assertEqual(UserBadgeEarned.objects.filter(user=self.user, badge=self.badge_sql).count(), 1)

    def test_get_all_badges_with_user_status(self):
        award_badge_to_user(self.user, 'sql-pioneer')
        annotated = get_all_badges_with_user_status(self.user)

        self.assertEqual(len(annotated), 2)
        sql_item = next(b for b in annotated if b['slug'] == 'sql-pioneer')
        mission_item = next(b for b in annotated if b['slug'] == 'mission-first-strike')

        self.assertTrue(sql_item['is_earned'])
        self.assertIsNotNone(sql_item['earned_at'])
        self.assertFalse(mission_item['is_earned'])
        self.assertIsNone(mission_item['earned_at'])


class BadgeApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='badge_api@datamboa.cm',
            password='testpassword123',
            first_name='Api',
            last_name='User'
        )
        self.badge = BadgeDefinition.objects.create(
            slug='excel-master',
            name='Maître Tableur Excel',
            description='Avoir complété les formules avancées SOMME.SI et RECHERCHEV.',
            icon='table',
            category=BadgeDefinition.Category.LAB,
            points_reward=150,
            order=1,
            is_active=True
        )

    def test_badge_list_public_anonymous(self):
        response = self.client.get(reverse('courses:badge-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)
        self.assertEqual(len(response.data), 1)
        self.assertFalse(response.data[0]['is_earned'])

    def test_badge_list_authenticated_with_earned(self):
        award_badge_to_user(self.user, 'excel-master')
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse('courses:badge-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data[0]['is_earned'])

    def test_my_badges_requires_auth(self):
        response = self.client.get(reverse('courses:my-badges'))
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_my_badges_returns_earned_only(self):
        award_badge_to_user(self.user, 'excel-master')
        self.client.force_authenticate(user=self.user)

        response = self.client.get(reverse('courses:my-badges'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['badge']['slug'], 'excel-master')
