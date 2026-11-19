from django.core.management.base import BaseCommand
from accounts.models import User


class Command(BaseCommand):
    help = 'Seeds or updates default admin, instructor and demo learner accounts'

    def handle(self, *args, **options):
        # 1. Superuser / Administrator
        admin_email = 'admin@datamboa.com'
        admin, created = User.objects.get_or_create(
            email=admin_email,
            defaults={
                'first_name': 'Admin',
                'last_name': 'DataMboa',
                'role': User.Role.ADMIN,
                'is_staff': True,
                'is_superuser': True,
                'phone_number': '+237657546259',
            }
        )
        admin.set_password('AdminPassword123!')
        admin.role = User.Role.ADMIN
        admin.is_staff = True
        admin.is_superuser = True
        admin.save()
        status_admin = 'created' if created else 'updated'
        self.stdout.write(self.style.SUCCESS(f"Admin: {admin_email} / AdminPassword123! ({status_admin})"))

        # 2. Instructor
        instructor_email = 'instructor@datamboa.com'
        instructor, created_inst = User.objects.get_or_create(
            email=instructor_email,
            defaults={
                'first_name': 'Samuel',
                'last_name': 'Eto\'o (Formateur)',
                'role': User.Role.INSTRUCTOR,
                'is_staff': False,
                'is_superuser': False,
                'phone_number': '+237699112233',
            }
        )
        instructor.set_password('InstructorPass123!')
        instructor.role = User.Role.INSTRUCTOR
        instructor.save()
        status_inst = 'created' if created_inst else 'updated'
        self.stdout.write(self.style.SUCCESS(f"Instructor: {instructor_email} / InstructorPass123! ({status_inst})"))

        # 3. Demo Learner
        learner_email = 'learner@datamboa.com'
        learner, created_lrn = User.objects.get_or_create(
            email=learner_email,
            defaults={
                'first_name': 'Laure',
                'last_name': 'Apprenante',
                'role': User.Role.LEARNER,
                'is_staff': False,
                'is_superuser': False,
                'phone_number': '+237677889900',
            }
        )
        learner.set_password('Password123!')
        learner.role = User.Role.LEARNER
        learner.save()
        status_lrn = 'created' if created_lrn else 'updated'
        self.stdout.write(self.style.SUCCESS(f"Learner: {learner_email} / Password123! ({status_lrn})"))
