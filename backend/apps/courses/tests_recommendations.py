from datetime import timedelta
from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import Course, LearningEvent, PlacementAssessment, Track
from courses.selectors import get_learner_recommendations

User = get_user_model()


class RecommendationsEngineTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='paul.talla@datamboa.cm',
            password='Password123!',
            first_name='Paul',
            last_name='Talla',
        )
        self.track = Track.objects.create(
            name='Track Excel',
            slug='track-excel',
            tool=Track.Tool.EXCEL,
            order=1,
        )
        self.course = Course.objects.create(
            track=self.track,
            title='Excel Niveau 2 : Formules & TCD',
            slug='excel-n2-formules-tcd',
            level=Course.Level.INTERMEDIATE,
            is_published=True,
        )

    def test_unauthenticated_user_recommendations(self):
        url = reverse('courses:learner-recommendations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['recommendations']), 0)

    def test_new_user_gets_placement_recommendation(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('courses:learner-recommendations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec_ids = [r['id'] for r in response.data['recommendations']]
        self.assertIn('rec_placement_test', rec_ids)

    def test_placement_done_recommends_target_course(self):
        PlacementAssessment.objects.create(
            user=self.user,
            score_total=60.0,
            recommended_level=PlacementAssessment.LEVEL_N2,
            recommended_course=self.course,
        )
        self.client.force_authenticate(user=self.user)
        url = reverse('courses:learner-recommendations')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        rec_ids = [r['id'] for r in response.data['recommendations']]
        self.assertIn('rec_target_course', rec_ids)

    def test_inactivity_triggers_anti_dropoff_reminder(self):
        # Create an event 4 days ago
        old_time = timezone.now() - timedelta(days=4)
        LearningEvent.objects.create(
            user=self.user,
            verb='completed',
            object_id='test-lesson',
            timestamp=old_time,
        )
        data = get_learner_recommendations(self.user)
        self.assertGreaterEqual(data['inactivity_days'], 3)
        rem_types = [rem['type'] for rem in data['reminders']]
        self.assertIn('ANTI_DROPOFF', rem_types)

