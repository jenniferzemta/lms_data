from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from courses.models import Flashcard, UserFlashcardProgress, LearningEvent
from courses.selectors import get_due_flashcards, get_user_srs_metrics
from courses.services import review_flashcard_sm2

User = get_user_model()


class SrsModelAndServiceTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email='srs_learner@datamboa.cm',
            password='testpassword123',
            first_name='Momo',
            last_name='Dev'
        )
        self.card = Flashcard.objects.create(
            front='Quelle formule Excel calcule la somme sous condition ?',
            back='La fonction SOMME.SI (ou SUMIF).',
            code_snippet='=SOMME.SI(C2:C10; "Gros Œuvre"; F2:F10)',
            category=Flashcard.Category.EXCEL,
            difficulty=Flashcard.Difficulty.MEDIUM,
            is_active=True
        )

    def test_card_str_representation(self):
        self.assertIn('[EXCEL]', str(self.card))

    def test_sm2_first_successful_review(self):
        prog = review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=5)
        self.assertEqual(prog.repetitions, 1)
        self.assertEqual(prog.interval_days, 1)
        self.assertGreaterEqual(prog.easiness_factor, 2.5)
        self.assertEqual(prog.last_quality, 5)

        # Check xAPI event emission
        event = LearningEvent.objects.filter(
            user=self.user,
            object_id=f"flashcard:{self.card.id}"
        ).first()
        self.assertIsNotNone(event)
        self.assertEqual(event.verb, 'reviewed')
        self.assertTrue(event.result_success)

    def test_sm2_second_successful_review(self):
        review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=5)
        prog2 = review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=4)
        self.assertEqual(prog2.repetitions, 2)
        self.assertEqual(prog2.interval_days, 6)

    def test_sm2_failed_review_resets_interval(self):
        # Two successful reviews
        review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=5)
        review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=4)

        # Failed review (quality 1)
        prog_failed = review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=1)
        self.assertEqual(prog_failed.repetitions, 0)
        self.assertEqual(prog_failed.interval_days, 1)

    def test_invalid_quality_raises_error(self):
        with self.assertRaises(ValueError):
            review_flashcard_sm2(user=self.user, card_id=self.card.id, quality=6)


class SrsApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            email='srs_api@datamboa.cm',
            password='testpassword123',
            first_name='Api',
            last_name='Srs'
        )
        self.card = Flashcard.objects.create(
            front='Comment grouper et sommer un DataFrame Pandas ?',
            back='Avec df.groupby("colonne")["valeur"].sum()',
            code_snippet='df.groupby("ville")["montant"].sum()',
            category=Flashcard.Category.PYTHON,
            is_active=True
        )

    def test_get_due_cards_public(self):
        response = self.client.get(reverse('courses:srs-due'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('cards', response.data)
        self.assertIn('metrics', response.data)
        self.assertGreaterEqual(len(response.data['cards']), 1)

    def test_review_submit_requires_auth(self):
        response = self.client.post(
            reverse('courses:srs-review-submit'),
            data={'card_id': self.card.id, 'quality': 4},
            format='json'
        )
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_review_submit_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(
            reverse('courses:srs-review-submit'),
            data={'card_id': self.card.id, 'quality': 5},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['success'])
        self.assertEqual(response.data['progress']['interval_days'], 1)

    def test_get_srs_stats_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('courses:srs-stats'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('due_today_count', response.data)
        self.assertIn('retention_percentage', response.data)

