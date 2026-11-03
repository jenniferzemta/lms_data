from django.core.management.base import BaseCommand
from courses.models import Course, Lesson, LessonAttachment, LessonTranslation, Module, Track


class Command(BaseCommand):
    help = 'Seeds initial Excel beginner course with African datasets and bilingual lessons'

    def handle(self, *args, **options):
        # 1. Create or get Excel Track
        track, _ = Track.objects.get_or_create(
            slug='excel',
            defaults={
                'name': 'Excel & Analyse de Données',
                'description': 'Maîtriser Excel pour la gestion, la finance et le reporting en entreprise.',
                'tool': Track.Tool.EXCEL,
                'icon': 'table',
                'order': 1,
                'is_published': True,
            },
        )

        # 2. Create or get Course
        course, _ = Course.objects.get_or_create(
            slug='excel-bases-analyse',
            defaults={
                'track': track,
                'title': "Excel — Les bases de l'analyse",
                'subtitle': "Prenez en main les données réelles d'entreprises locales en FCFA.",
                'description': (
                    "Ce cours pratique vous apprend à manipuler des données concrètes : "
                    "gestion de stocks, suivi des ventes commerciales à Douala et Yaoundé, "
                    "calculs statistiques et nettoyage de tableaux."
                ),
                'level': Course.Level.BEGINNER,
                'duration_hours': 8,
                'price_tier': Course.PriceTier.FREE,
                'order': 1,
                'is_published': True,
            },
        )

        # 3. Module 1: Prise en main et types de données
        m1, _ = Module.objects.get_or_create(
            course=course,
            title="Module 1 : Prise en main et typage des données",
            defaults={
                'description': "Découverte des tableaux, des colonnes et des formats monétaires FCFA.",
                'order': 1,
                'is_published': True,
            },
        )

        # Lesson 1
        l1, _ = Lesson.objects.get_or_create(
            module=m1,
            slug='environnement-et-types-de-donnees',
            defaults={
                'title': "Comprendre l'environnement Excel et les types de données",
                'lesson_type': Lesson.LessonType.TEXT,
                'duration_minutes': 10,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=l1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Comprendre l'environnement Excel et les types de données",
                'summary': "Distinction entre texte, nombres, devises et dates dans un tableur.",
                'content': (
                    "# 1. L'environnement de travail Excel\n\n"
                    "Bienvenue dans votre premier cours d'analyse de données sur **DataMboa** !\n\n"
                    "Un bon analyste ne commence pas par des formules complexes, mais par **la rigueur des types de données**. "
                    "Dans un tableau professionnel, chaque colonne doit posséder un format précis :\n\n"
                    "- **Le Texte** : Noms de clients, villes (ex: *Douala*, *Bafoussam*, *Garoua*), identifiants.\n"
                    "- **Les Nombres entiers ou décimaux** : Quantités vendues, stocks restants.\n"
                    "- **Les Devises (FCFA)** : Prix unitaire, chiffre d'affaires, marge commerciale.\n"
                    "- **Les Dates** : Format standard francophone `JJ/MM/AAAA`.\n\n"
                    "> **Règle d'or** : Ne tapez jamais `FCFA` à la main dans une cellule contenant un montant ! "
                    "Cela transforme votre nombre en texte et rend toute somme ou moyenne impossible."
                ),
                'code_snippet': "=SOMME(C2:C20)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=l1,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Understanding the Excel Environment and Data Types",
                'summary': "Differentiate between text, numbers, currency, and dates in a spreadsheet.",
                'content': (
                    "# 1. The Excel Workspace\n\n"
                    "Welcome to your first data analysis course on **DataMboa**!\n\n"
                    "A great analyst starts with clean data types rather than complex formulas. "
                    "In a professional dataset, each column must have a defined type:\n\n"
                    "- **Text**: Customer names, cities (e.g. *Douala*, *Buea*, *Bamenda*), product codes.\n"
                    "- **Numbers**: Quantities, stock levels.\n"
                    "- **Currency (FCFA)**: Unit price, revenue, profit margins.\n"
                    "- **Dates**: Format `DD/MM/YYYY`.\n\n"
                    "> **Golden Rule**: Never type `FCFA` manually inside a numeric cell! "
                    "It converts numbers to text, preventing formulas from calculating correctly."
                ),
                'code_snippet': "=SUM(C2:C20)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # Lesson 2
        l2, _ = Lesson.objects.get_or_create(
            module=m1,
            slug='formater-montants-fcfa',
            defaults={
                'title': "Saisir et formater des montants en FCFA",
                'lesson_type': Lesson.LessonType.TEXT,
                'duration_minutes': 12,
                'is_free_preview': True,
                'order': 2,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=l2,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Saisir et formater des montants en FCFA",
                'summary': "Apprenez à appliquer le format monétaire personnalisé avec séparateur de milliers.",
                'content': (
                    "# Formater des montants en FCFA dans Excel\n\n"
                    "Pour qu'un tableau financier soit lisible d'un coup d'œil par un responsable à Douala ou Yaoundé, "
                    "les montants doivent avoir un séparateur de milliers :\n\n"
                    "```text\n"
                    "Format personnalisé : # ##0 \"FCFA\"\n"
                    "```\n\n"
                    "### Exemple pratique :\n"
                    "1. Saisissez le nombre brut `2500000`.\n"
                    "2. Appliquez le format personnalisé.\n"
                    "3. Excel affiche automatiquement `2 500 000 FCFA` tout en conservant la valeur numérique pure pour vos calculs !"
                ),
                'code_snippet': '# ##0 "FCFA"',
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # 4. Module 2: Nettoyage et calculs
        m2, _ = Module.objects.get_or_create(
            course=course,
            title="Module 2 : Nettoyage et calculs de ventes",
            defaults={
                'description': "Résoudre des cas concrets de commerce et de distribution.",
                'order': 2,
                'is_published': True,
            },
        )

        # Lesson 3: The exact lesson from user's dashboard!
        l3, _ = Lesson.objects.get_or_create(
            module=m2,
            slug='nettoyer-donnees-ventes-douala',
            defaults={
                'title': "Leçon 3 : Nettoyer des données de ventes (Douala)",
                'lesson_type': Lesson.LessonType.CODE,
                'duration_minutes': 12,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=l3,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Nettoyer des données de ventes (Douala)",
                'summary': "Cas pratique : harmoniser les noms de boutiques et supprimer les espaces superflus.",
                'content': (
                    "# Cas d'entreprise : Distributeur de boissons à Douala\n\n"
                    "Vous recevez un fichier de ventes issu de plusieurs points de vente à Akwa, Bonanjo et Bonabéri. "
                    "Certaines cellules contiennent des espaces invisibles avant ou après les noms de boutiques, "
                    "ce qui fausse les regroupements et les rapports de ventes.\n\n"
                    "### 1. La fonction SUPPRESPACE\n"
                    "La fonction `SUPPRESPACE` (en anglais `TRIM`) supprime automatiquement tous les espaces "
                    "en début et en fin de texte, ainsi que les doubles espaces.\n\n"
                    "```excel\n"
                    "=SUPPRESPACE(A2)\n"
                    "```\n\n"
                    "### 2. Mettre en majuscules avec MAJUSCULE\n"
                    "Pour normaliser les noms de villes :\n\n"
                    "```excel\n"
                    "=MAJUSCULE(SUPPRESPACE(B2))\n"
                    "```\n\n"
                    "### Exercice à réaliser :\n"
                    "- Téléchargez le fichier exemple.\n"
                    "- Créez une colonne propre pour le nom du point de vente.\n"
                    "- Vérifiez que les 50 lignes sont normalisées sans espace résiduel."
                ),
                'code_snippet': "=MAJUSCULE(SUPPRESPACE(A2))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=l3,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Cleaning Sales Data (Douala Case Study)",
                'summary': "Practical exercise: standardize store names and remove extra spaces.",
                'content': (
                    "# Business Scenario: Beverage Distribution in Douala\n\n"
                    "You receive a daily sales export from retail stores in Akwa, Bonanjo, and Bonaberi. "
                    "Several cells contain accidental leading or trailing spaces that break sales aggregations.\n\n"
                    "### 1. The TRIM function\n"
                    "The `TRIM` function removes all extra spaces from text except for single spaces between words:\n\n"
                    "```excel\n"
                    "=TRIM(A2)\n"
                    "```\n\n"
                    "### 2. Convert to uppercase with UPPER\n"
                    "To standardize city names:\n\n"
                    "```excel\n"
                    "=UPPER(TRIM(B2))\n"
                    "```"
                ),
                'code_snippet': "=UPPER(TRIM(A2))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # 4. Attachments for Lesson 1
        LessonAttachment.objects.update_or_create(
            lesson=l1,
            title="Tableau d'exercice — Découverte des types (Douala)",
            defaults={
                'description': "Fichier de travail vierge à compléter pas à pas pendant la leçon.",
                'attachment_type': LessonAttachment.AttachmentType.STARTER,
                'file_format': 'xlsx',
                'file_size_bytes': 128500,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/datasets/douala_types_starter.xlsx',
                'is_free_preview': True,
                'order': 1,
            },
        )
        LessonAttachment.objects.update_or_create(
            lesson=l1,
            title="Guide mémo — Raccourcis et formats FCFA",
            defaults={
                'description': "Fiche PDF synthétique imprimable ou consultable sur smartphone.",
                'attachment_type': LessonAttachment.AttachmentType.CHEATSHEET,
                'file_format': 'pdf',
                'file_size_bytes': 452000,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/guides/memo_formats_fcfa.pdf',
                'is_free_preview': True,
                'order': 2,
            },
        )

        # Attachments for Lesson 3
        LessonAttachment.objects.update_or_create(
            lesson=l3,
            title="Dataset brut — Ventes boutiques Douala (Non nettoyé)",
            defaults={
                'description': "Jeu de données réel de 50 transactions commerciales avec espaces à nettoyer.",
                'attachment_type': LessonAttachment.AttachmentType.DATASET,
                'file_format': 'csv',
                'file_size_bytes': 48200,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/datasets/ventes_douala_raw.csv',
                'is_free_preview': True,
                'order': 1,
            },
        )
        LessonAttachment.objects.update_or_create(
            lesson=l3,
            title="Corrigé complet — Ventes boutiques Douala (Solution)",
            defaults={
                'description': "Feuille de calcul finale avec les colonnes calculées SUPPRESPACE et MAJUSCULE.",
                'attachment_type': LessonAttachment.AttachmentType.SOLUTION,
                'file_format': 'xlsx',
                'file_size_bytes': 142000,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/solutions/ventes_douala_solution.xlsx',
                'is_free_preview': True,
                'order': 2,
            },
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded Excel beginner course with 3 real lessons, translations and attachments!"))
