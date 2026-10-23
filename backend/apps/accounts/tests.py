from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework.test import APIRequestFactory

from accounts.models import InstructorProfile, LearnerProfile
from accounts.permissions import IsAdminUserRole, IsInstructor, IsLearner
from accounts.selectors import (
    get_instructor_profile,
    get_learner_profile,
    get_user_by_email,
    get_user_by_id,
    list_active_instructors,
)
from accounts.services import (
    create_user,
    register_instructor,
    register_learner,
    update_learner_profile,
)

User = get_user_model()


class UserModelTests(TestCase):
    def test_create_user_with_email_successful(self):
        email = 'apprenant@datamboa.com'
        user = User.objects.create_user(
            email=email,
            password='Password123!',
            first_name='Jean',
            last_name='Kamga',
            phone_number='+237690000001',
        )
        self.assertEqual(user.email, email)
        self.assertEqual(user.full_name, 'Jean Kamga')
        self.assertTrue(user.check_password('Password123!'))
        self.assertTrue(user.is_learner)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email='admin@datamboa.com',
            password='AdminPassword123!',
            first_name='Admin',
            last_name='DataMboa',
        )
        self.assertTrue(admin.is_staff)
        self.assertTrue(admin.is_superuser)
        self.assertTrue(admin.is_admin_role)

    def test_email_is_normalized_to_lowercase(self):
        email = 'TEST.USER@DATAMBOA.COM'
        user = User.objects.create_user(
            email=email,
            password='Password123!',
            first_name='Test',
            last_name='User',
        )
        self.assertEqual(user.email, 'test.user@datamboa.com')


class AccountServicesTests(TestCase):
    def test_register_learner_creates_user_and_profile(self):
        user = register_learner(
            email='learner@datamboa.com',
            password='SecurePassword123',
            first_name='Amina',
            last_name='Bello',
            phone_number='+237655000111',
            study_level='Licence 3',
            learning_goal='Data Analyst Power BI',
            whatsapp_consent=True,
        )
        self.assertEqual(user.role, User.Role.LEARNER)
        self.assertTrue(hasattr(user, 'learner_profile'))
        self.assertEqual(user.learner_profile.study_level, 'Licence 3')
        self.assertEqual(user.learner_profile.learning_goal, 'Data Analyst Power BI')
        self.assertTrue(user.learner_profile.whatsapp_consent)

    def test_register_instructor_creates_user_and_profile(self):
        instructor = register_instructor(
            email='instructor@datamboa.com',
            password='InstructorPass123',
            first_name='Samuel',
            last_name='Eto',
            headline='Expert Excel & Python',
            bio='Formateur certifié avec 8 ans d expérience.',
        )
        self.assertEqual(instructor.role, User.Role.INSTRUCTOR)
        self.assertTrue(instructor.is_instructor)
        self.assertFalse(instructor.instructor_profile.is_verified)
        self.assertEqual(instructor.instructor_profile.headline, 'Expert Excel & Python')

    def test_duplicate_email_raises_validation_error(self):
        create_user(
            email='unique@datamboa.com',
            password='Password123',
            first_name='First',
            last_name='User',
        )
        with self.assertRaises(ValidationError):
            create_user(
                email='unique@datamboa.com',
                password='AnotherPassword123',
                first_name='Second',
                last_name='User',
            )

    def test_short_password_raises_validation_error(self):
        with self.assertRaises(ValidationError):
            create_user(
                email='short@datamboa.com',
                password='123',
                first_name='Short',
                last_name='Pass',
            )

    def test_update_learner_profile(self):
        user = register_learner(
            email='update.me@datamboa.com',
            password='ValidPassword123',
            first_name='Paul',
            last_name='Biya',
            study_level='Bac',
        )
        updated_profile = update_learner_profile(
            user=user,
            study_level='Master 1',
            learning_goal='Devenir Data Scientist',
        )
        self.assertEqual(updated_profile.study_level, 'Master 1')
        self.assertEqual(updated_profile.learning_goal, 'Devenir Data Scientist')


class AccountSelectorsTests(TestCase):
    def setUp(self):
        self.learner = register_learner(
            email='selector.learner@datamboa.com',
            password='Password123',
            first_name='Mireille',
            last_name='Fosso',
        )
        self.instructor = register_instructor(
            email='selector.instructor@datamboa.com',
            password='Password123',
            first_name='Christian',
            last_name='Tchoupo',
        )

    def test_get_user_by_email(self):
        user = get_user_by_email(email='SELECTOR.LEARNER@datamboa.com')
        self.assertIsNotNone(user)
        self.assertEqual(user.pk, self.learner.pk)

    def test_get_user_by_id(self):
        user = get_user_by_id(user_id=self.learner.pk)
        self.assertEqual(user, self.learner)

        non_existing = get_user_by_id(user_id=999999)
        self.assertIsNone(non_existing)

    def test_get_learner_profile(self):
        profile = get_learner_profile(user=self.learner)
        self.assertEqual(profile, self.learner.learner_profile)

    def test_list_active_instructors_only_verified(self):
        # By default not verified -> empty
        self.assertEqual(list_active_instructors().count(), 0)

        # Mark verified
        self.instructor.instructor_profile.is_verified = True
        self.instructor.instructor_profile.save()

        instructors = list_active_instructors()
        self.assertEqual(instructors.count(), 1)
        self.assertEqual(instructors.first(), self.instructor)


class AccountPermissionsTests(TestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.learner = register_learner(
            email='perm.learner@datamboa.com',
            password='Password123',
            first_name='Learner',
            last_name='One',
        )
        self.instructor = register_instructor(
            email='perm.instructor@datamboa.com',
            password='Password123',
            first_name='Instructor',
            last_name='One',
        )
        self.admin = User.objects.create_superuser(
            email='perm.admin@datamboa.com',
            password='AdminPassword123',
            first_name='Admin',
            last_name='One',
        )

    def test_is_learner_permission(self):
        perm = IsLearner()
        request = self.factory.get('/')

        request.user = self.learner
        self.assertTrue(perm.has_permission(request, None))

        request.user = self.instructor
        self.assertFalse(perm.has_permission(request, None))

    def test_is_instructor_permission(self):
        perm = IsInstructor()
        request = self.factory.get('/')

        request.user = self.instructor
        self.assertTrue(perm.has_permission(request, None))

        request.user = self.learner
        self.assertFalse(perm.has_permission(request, None))

        # Admin also has instructor-level permission access
        request.user = self.admin
        self.assertTrue(perm.has_permission(request, None))

    def test_is_admin_permission(self):
        perm = IsAdminUserRole()
        request = self.factory.get('/')

        request.user = self.admin
        self.assertTrue(perm.has_permission(request, None))

        request.user = self.learner
        self.assertFalse(perm.has_permission(request, None))


class AccountsAPITests(TestCase):
    def setUp(self):
        self.register_url = '/api/v1/auth/register/'
        self.login_url = '/api/v1/auth/login/'
        self.logout_url = '/api/v1/auth/logout/'
        self.me_url = '/api/v1/auth/me/'

    def test_register_learner_api_success(self):
        payload = {
            'email': 'api.learner@datamboa.com',
            'password': 'SecurePassword123',
            'first_name': 'Suzanne',
            'last_name': 'Mballa',
            'phone_number': '+237699112233',
            'study_level': 'Master 2',
            'learning_goal': 'Reconversion Data Analyst',
            'whatsapp_consent': True,
        }
        response = self.client.post(self.register_url, payload, content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['email'], 'api.learner@datamboa.com')
        self.assertEqual(response.data['first_name'], 'Suzanne')
        self.assertEqual(response.data['role'], 'LEARNER')
        self.assertEqual(response.data['learner_profile']['study_level'], 'Master 2')

    def test_register_learner_api_duplicate_email_fails(self):
        register_learner(
            email='already.exists@datamboa.com',
            password='Password123',
            first_name='Existing',
            last_name='User',
        )
        payload = {
            'email': 'already.exists@datamboa.com',
            'password': 'Password123',
            'first_name': 'Duplicate',
            'last_name': 'User',
        }
        response = self.client.post(self.register_url, payload, content_type='application/json')
        self.assertEqual(response.status_code, 400)
        self.assertIn('email', response.data)

    def test_login_api_success(self):
        register_learner(
            email='login.test@datamboa.com',
            password='CorrectPassword123',
            first_name='Eric',
            last_name='Njoya',
        )
        response = self.client.post(
            self.login_url,
            {'email': 'login.test@datamboa.com', 'password': 'CorrectPassword123'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'login.test@datamboa.com')

    def test_login_api_wrong_password_fails(self):
        register_learner(
            email='wrong.pass@datamboa.com',
            password='CorrectPassword123',
            first_name='Eric',
            last_name='Njoya',
        )
        response = self.client.post(
            self.login_url,
            {'email': 'wrong.pass@datamboa.com', 'password': 'WrongPassword123'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

    def test_me_api_authenticated(self):
        user = register_learner(
            email='me.user@datamboa.com',
            password='Password123',
            first_name='Marthe',
            last_name='Ewandje',
        )
        self.client.force_login(user)

        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['email'], 'me.user@datamboa.com')
        self.assertEqual(response.data['full_name'], 'Marthe Ewandje')

    def test_me_api_unauthenticated_fails(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, 403)

    def test_me_api_patch_profile(self):
        user = register_learner(
            email='patch.me@datamboa.com',
            password='Password123',
            first_name='Original',
            last_name='Name',
        )
        self.client.force_login(user)

        response = self.client.patch(
            self.me_url,
            {'first_name': 'UpdatedFirst', 'study_level': 'Doctorat'},
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['first_name'], 'UpdatedFirst')
        self.assertEqual(response.data['learner_profile']['study_level'], 'Doctorat')

    def test_logout_api_success(self):
        user = register_learner(
            email='logout.user@datamboa.com',
            password='Password123',
            first_name='Logout',
            last_name='User',
        )
        self.client.force_login(user)

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, 200)

