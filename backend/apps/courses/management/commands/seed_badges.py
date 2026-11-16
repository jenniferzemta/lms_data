from django.core.management.base import BaseCommand
from courses.models import BadgeDefinition

class Command(BaseCommand):
    help = 'Seeds skill acquisition badge definitions (F2.8, Open Badges, R16)'

    def handle(self, *args, **options):
        badges_data = [
            {
                'slug': 'first-lab-solved',
                'name': 'Premier Laboratoire Validé',
                'description': 'Avoir résolu avec succès son tout premier atelier pratique dans le navigateur.',
                'icon': 'sparkles',
                'category': BadgeDefinition.Category.LAB,
                'points_reward': 50,
                'criteria_rule': 'first_lab',
                'order': 1,
                'is_active': True
            },
            {
                'slug': 'sql-pioneer',
                'name': 'Pionnier SQL Cameroun',
                'description': 'Avoir formulé et exécuté des requêtes d\'extraction sur la base de données Microfinance.',
                'icon': 'terminal',
                'category': BadgeDefinition.Category.LAB,
                'points_reward': 100,
                'criteria_rule': 'sql_completed',
                'order': 2,
                'is_active': True
            },
            {
                'slug': 'excel-master',
                'name': 'Maître Tableur Excel',
                'description': 'Avoir automatisé les calculs de vente avec les fonctions SOMME, SI, SOMME.SI et RECHERCHEV.',
                'icon': 'table',
                'category': BadgeDefinition.Category.LAB,
                'points_reward': 100,
                'criteria_rule': 'excel_completed',
                'order': 3,
                'is_active': True
            },
            {
                'slug': 'python-data-wrangler',
                'name': 'Data Wrangler Python',
                'description': 'Avoir nettoyé et agrégé des transactions de vente en FCFA avec la bibliothèque Pandas.',
                'icon': 'file-code',
                'category': BadgeDefinition.Category.LAB,
                'points_reward': 100,
                'criteria_rule': 'python_completed',
                'order': 4,
                'is_active': True
            },
            {
                'slug': 'mission-first-strike',
                'name': 'Premier Consultant Junior',
                'description': 'Avoir mené à terme une mission scénario d\'entreprise africaine avec auto-évaluation guidée.',
                'icon': 'briefcase',
                'category': BadgeDefinition.Category.MISSION,
                'points_reward': 200,
                'criteria_rule': 'mission_completed',
                'order': 5,
                'is_active': True
            },
            {
                'slug': 'first-quiz-passed',
                'name': 'Premier Quiz Validé',
                'description': 'Avoir atteint le seuil de réussite de 70% sur une évaluation formative.',
                'icon': 'check-circle',
                'category': BadgeDefinition.Category.COURSE,
                'points_reward': 50,
                'criteria_rule': 'quiz_passed',
                'order': 6,
                'is_active': True
            },
            {
                'slug': 'quiz-perfectionist',
                'name': 'Perfectionniste 100%',
                'description': 'Avoir réussi un quiz avec un score sans faute de 100% du premier coup.',
                'icon': 'award',
                'category': BadgeDefinition.Category.COURSE,
                'points_reward': 100,
                'criteria_rule': 'quiz_perfect',
                'order': 7,
                'is_active': True
            },
            {
                'slug': 'streak-7-days',
                'name': 'Assiduité d\'Acier (7 jours)',
                'description': 'Avoir étudié et pratiqué 7 jours consécutifs sur DataMboa.',
                'icon': 'flame',
                'category': BadgeDefinition.Category.STREAK,
                'points_reward': 150,
                'criteria_rule': 'streak_7',
                'order': 8,
                'is_active': True
            }
        ]

        for b_data in badges_data:
            badge, created = BadgeDefinition.objects.update_or_create(
                slug=b_data['slug'],
                defaults=b_data
            )
            status_str = 'Créé' if created else 'Mis à jour'
            self.stdout.write(self.style.SUCCESS(f"Badge [{badge.slug}] : {status_str}"))
