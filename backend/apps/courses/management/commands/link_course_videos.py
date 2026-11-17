import os
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.files import File
from courses.models import Lesson, LessonTranslation, LessonAttachment


class Command(BaseCommand):
    help = "Links the 16 real training videos to their corresponding lessons in Excel, SQL, Power BI, and Git."

    def handle(self, *args, **options):
        self.stdout.write("Linking 16 training videos to curriculum lessons...")

        media_videos_dir = Path(settings.MEDIA_ROOT) / 'courses' / 'videos'
        frontend_videos_dir = Path(settings.BASE_DIR).parent / 'frontend' / 'public' / 'videos' / 'courses'

        media_videos_dir.mkdir(parents=True, exist_ok=True)
        frontend_videos_dir.mkdir(parents=True, exist_ok=True)

        video_mappings = [
            # Excel
            {
                'lesson_slug': 'environnement-et-types-de-donnees',
                'video_file': 'XL1_recherchex.mp4',
                'duration': 15,
                'title_fr': "Vidéo formative : RECHERCHEX & Fonctions dynamiques",
            },
            {
                'lesson_slug': 'formater-montants-fcfa',
                'video_file': 'XL2_fonctions-dynamiques.mp4',
                'duration': 12,
                'title_fr': "Vidéo formative : Formules dynamiques & Formats FCFA",
            },
            {
                'lesson_slug': 'decouverte-power-query-automatisation',
                'video_file': 'XL3_power-query-dossier.mp4',
                'duration': 18,
                'title_fr': "Vidéo formative : Automatisation Power Query & Consolidation",
            },
            {
                'lesson_slug': 'dax-avance-contextes-evaluation-et-sumx',
                'video_file': 'XL4_dax-calculate.mp4',
                'duration': 22,
                'title_fr': "Vidéo formative : DAX CALCULATE & Contextes d'évaluation",
            },

            # SQL
            {
                'lesson_slug': 'sql-select-fondamentaux',
                'video_file': 'SQL1_interroger-une-table.mp4',
                'duration': 14,
                'title_fr': "Vidéo formative : Interroger une table avec SELECT et WHERE",
            },
            {
                'lesson_slug': 'select-from-where-microfinance',
                'video_file': 'SQL1_interroger-une-table.mp4',
                'duration': 14,
                'title_fr': "Vidéo formative : Requêtes SELECT appliquées à la Microfinance",
            },
            {
                'lesson_slug': 'sql-jointures-inner-left',
                'video_file': 'SQL2_relier-des-tables-join.mp4',
                'duration': 18,
                'title_fr': "Vidéo formative : Relier des tables avec INNER & LEFT JOIN",
            },
            {
                'lesson_slug': 'sql-fonctions-agregation-group-by',
                'video_file': 'SQL3_agreger-group-by-having.mp4',
                'duration': 16,
                'title_fr': "Vidéo formative : Agréger des transactions avec GROUP BY et HAVING",
            },
            {
                'lesson_slug': 'sql-window-functions-avancees',
                'video_file': 'SQL4_fonctions-de-fenetre.mp4',
                'duration': 25,
                'title_fr': "Vidéo formative : Fonctions de fenêtrage (OVER, PARTITION BY, LAG)",
            },

            # Power BI
            {
                'lesson_slug': 'premier-rapport-powerbi-direction',
                'video_file': 'PBI1_importer-et-transformer.mp4',
                'duration': 15,
                'title_fr': "Vidéo formative : Importer des données et transformer dans Power Query",
            },
            {
                'lesson_slug': 'powerbi-schema-etoile-fondamentaux',
                'video_file': 'PBI2_modele-en-etoile.mp4',
                'duration': 18,
                'title_fr': "Vidéo formative : Modélisation relationnelle & Schéma en étoile",
            },
            {
                'lesson_slug': 'powerbi-dax-calculate-divide',
                'video_file': 'PBI3_mesures-dax.mp4',
                'duration': 20,
                'title_fr': "Vidéo formative : Mesures explicites DAX (CALCULATE, DIVIDE)",
            },
            {
                'lesson_slug': 'powerbi-time-intelligence-rls',
                'video_file': 'PBI4_rapport-et-publication.mp4',
                'duration': 22,
                'title_fr': "Vidéo formative : Tableaux de bord exécutifs, RLS et publication",
            },

            # Git & GitHub
            {
                'lesson_slug': 'git-init-status-add-commit',
                'video_file': 'GIT1_premier-depot.mp4',
                'duration': 12,
                'title_fr': "Vidéo formative : Initialiser un dépôt et premier commit",
            },
            {
                'lesson_slug': 'git-branches-merge-conflits',
                'video_file': 'GIT2_branches-et-pull-request.mp4',
                'duration': 16,
                'title_fr': "Vidéo formative : Branches de travail et Pull Requests",
            },
            {
                'lesson_slug': 'github-portfolio-readme-impact',
                'video_file': 'GIT4_portfolio-data-github.mp4',
                'duration': 20,
                'title_fr': "Vidéo formative : Showcase de portfolio Data Analyst sur GitHub",
            },
        ]

        linked_count = 0

        for item in video_mappings:
            slug = item['lesson_slug']
            video_name = item['video_file']

            lessons = Lesson.objects.filter(slug=slug)
            if not lessons.exists():
                self.stdout.write(self.style.WARNING(f"Lesson not found for slug: {slug}"))
                continue

            for lesson in lessons:
                lesson.lesson_type = Lesson.LessonType.VIDEO
                lesson.duration_minutes = item['duration']
                lesson.save(update_fields=['lesson_type', 'duration_minutes'])

                # Update translation video_url (Accessible via Next.js public or Django media)
                video_web_url = f"/videos/courses/{video_name}"
                for trans in lesson.translations.all():
                    trans.video_url = video_web_url
                    trans.save(update_fields=['video_url'])

                # Create LessonAttachment for offline video download
                phys_media_path = media_videos_dir / video_name
                file_size = phys_media_path.stat().st_size if phys_media_path.exists() else 1000000

                att, _ = LessonAttachment.objects.update_or_create(
                    lesson=lesson,
                    title=f"Vidéo hors-ligne : {item['title_fr']} (Basse consommation)",
                    defaults={
                        'description': f"Fichier vidéo MP4 optimisé pour connexion lente ({round(file_size / (1024*1024), 2)} Mo).",
                        'attachment_type': LessonAttachment.AttachmentType.OTHER,
                        'file_format': 'mp4',
                        'file_size_bytes': file_size,
                        'external_url': video_web_url,
                        'is_free_preview': lesson.is_free_preview,
                    },
                )

                if phys_media_path.exists() and not att.file:
                    with open(phys_media_path, 'rb') as fp:
                        att.file.save(video_name, File(fp), save=False)
                    att.save()

                linked_count += 1
                self.stdout.write(self.style.SUCCESS(f" -> Linked {video_name} to lesson '{lesson.title}' ({slug})"))

        self.stdout.write(self.style.SUCCESS(f"\nSuccessfully linked {linked_count} lesson videos with offline attachments!"))
