from django.core.management.base import BaseCommand
from courses.models import Course, Lesson, LessonAttachment, LessonTranslation, Module, Track


class Command(BaseCommand):
    help = "Seeds the complete Excel Data Analyst roadmap (Beginner to TCD & Dashboards) based on the YITA Data Analyst Roadmap."

    def handle(self, *args, **options):
        self.stdout.write("Seeding Excel Track and Roadmap Courses...")

        # 1. Create Track
        track, _ = Track.objects.get_or_create(
            slug='excel',
            defaults={
                'name': "Excel & Analyse de Données",
                'description': "Maîtriser Excel pour la gestion, la finance, les TCD et les tableaux de bord décisionnels en entreprise.",
                'tool': Track.Tool.EXCEL,
                'icon': 'table',
                'order': 1,
                'is_published': True,
            },
        )

        # 2. Level 1 Course: Intermédiaire / Les bases solides
        course, _ = Course.objects.update_or_create(
            slug='excel-bases-analyse',
            defaults={
                'track': track,
                'title': "Excel : Les bases solides pour manipuler vos données",
                'subtitle': "Maîtrisez les formules avancées, le nettoyage, les TCD et construisez un tableau de bord complet.",
                'description': (
                    "Ce parcours pratique vous forme sur des cas concrets de distribution et de commerce à Douala et Yaoundé. "
                    "Vous apprendrez à structurer vos données, appliquer les formules de calcul et de recherche (RECHERCHEX, SI), "
                    "construire des Tableaux Croisés Dynamiques (TCD) et concevoir un tableau de bord prêt pour la direction."
                ),
                'level': Course.Level.BEGINNER,
                'duration_hours': 10,
                'price_tier': Course.PriceTier.FREE,
                'order': 1,
                'is_published': True,
            },
        )

        # -------------------------------------------------------------
        # MODULE 1: Formules et fonctions avancées
        # -------------------------------------------------------------
        m1, _ = Module.objects.update_or_create(
            course=course,
            order=1,
            defaults={
                'title': "Module 1 : Formules et fonctions essentielles",
                'description': "SI, SI.CONDITIONS, ET, OU, gestion des erreurs et fonctions de calcul.",
                'is_published': True,
            },
        )

        l1, _ = Lesson.objects.update_or_create(
            module=m1,
            slug='environnement-et-types-de-donnees',
            defaults={
                'title': "Typage rigoureux et saisie des montants en FCFA",
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
                'title': "Typage rigoureux et saisie des montants en FCFA",
                'summary': "Distinguer le texte, les nombres, les devises FCFA et les dates pour fiabiliser vos calculs.",
                'content': (
                    "# Typage des données et format monétaire FCFA\n\n"
                    "Bienvenue dans votre premier cours d'analyse de données sur **DataMboa** !\n\n"
                    "## 1. Mini-cours : La rigueur des types\n"
                    "Un bon analyste ne commence pas par des formules complexes, mais par **la propreté des types de données**. "
                    "Dans un tableur professionnel, chaque colonne possède une nature stricte :\n\n"
                    "- **Le Texte** : Noms de clients, points de vente à Douala (Akwa, Bonanjo, Deido), codes articles.\n"
                    "- **Les Nombres entiers ou décimaux** : Volumes de stock, quantités vendues en caisses ou palettes.\n"
                    "- **Les Devises (FCFA)** : Chiffre d'affaires hors taxes, prix de vente unitaire, marge brute.\n"
                    "- **Les Dates** : Format standard francophone `JJ/MM/AAAA` impératif pour les analyses temporelles.\n\n"
                    "> **Règle d'or** : Ne tapez jamais `FCFA` manuellement dans une cellule numérique ! "
                    "Le tableur convertit immédiatement le nombre en texte, ce qui bloque toutes les formules d'addition et de moyenne.\n\n"
                    "## 2. Exemple concret : Boutique de distribution à Akwa\n"
                    "Pour afficher correctement `2 500 000 FCFA` sans corrompre vos calculs :\n\n"
                    "1. Saisissez la valeur brute `2500000` sans espace ni lettre.\n"
                    "2. Ouvrez le format de cellule (`Ctrl + 1` ou clic droit > Format de cellule).\n"
                    "3. Choisissez Personnalisé et appliquez le masque : `# ##0 \"FCFA\"`.\n\n"
                    "## 3. Défi pratique : À vous de jouer !\n"
                    "Téléchargez le fichier de départ ci-dessous. Votre mission consiste à harmoniser "
                    "les 50 transactions du magasin central en configurant les colonnes prix et dates."
                ),
                'code_snippet': '# ##0 "FCFA"',
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l1,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Data Types and Currency Formatting in FCFA",
                'summary': "Distinguish text, numbers, FCFA currency, and dates to ensure formula integrity.",
                'content': (
                    "# Data Types and FCFA Currency Formatting\n\n"
                    "Welcome to your data analysis journey on **DataMboa**!\n\n"
                    "## 1. Mini-course: Data Type Rigor\n"
                    "A great analyst begins with strict data types rather than complex formulas. "
                    "Each column in a professional dataset must hold a specific data format:\n\n"
                    "- **Text**: Client names, Douala store locations (Akwa, Bonanjo, Deido), product IDs.\n"
                    "- **Numbers**: Inventory volumes, sales quantities in cases or units.\n"
                    "- **Currency (FCFA)**: Gross revenue, unit prices, operational margins.\n"
                    "- **Dates**: Standard date format `DD/MM/YYYY` essential for time intelligence.\n\n"
                    "> **Golden Rule**: Never type `FCFA` manually into a numeric cell! "
                    "Excel immediately treats it as text, which breaks all arithmetic calculations.\n\n"
                    "## 2. Real Business Scenario: Distribution Store in Akwa\n"
                    "To display `2 500 000 FCFA` cleanly while preserving calculations:\n\n"
                    "1. Type the raw integer `2500000` without spaces or currency tags.\n"
                    "2. Open Format Cells (`Ctrl + 1`).\n"
                    "3. Select Custom and apply `# ##0 \"FCFA\"`."
                ),
                'code_snippet': '# ##0 "FCFA"',
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # MODULE 2: Recherche et conversion de données
        # -------------------------------------------------------------
        m2, _ = Module.objects.update_or_create(
            course=course,
            order=2,
            defaults={
                'title': "Module 2 : Recherche et conversion de données",
                'description': "RECHERCHEX vs RECHERCHEV, INDEX/EQUIV et nettoyage des anomalies textuelles.",
                'is_published': True,
            },
        )

        l2, _ = Lesson.objects.update_or_create(
            module=m2,
            slug='nettoyer-donnees-ventes-douala',
            defaults={
                'title': "Nettoyer et normaliser des données de ventes (Douala)",
                'lesson_type': Lesson.LessonType.CODE,
                'duration_minutes': 12,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l2,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Nettoyer et normaliser des données de ventes (Douala)",
                'summary': "Cas pratique d'entreprise : supprimer les espaces parasites avec SUPPRESPACE et MAJUSCULE.",
                'content': (
                    "# Normalisation des données commerciales à Douala\n\n"
                    "## 1. Mini-cours : La fonction SUPPRESPACE\n"
                    "Lors de l'exportation des données de caisses des points de vente à Bonabéri, Bonanjo et Bassa, "
                    "des espaces involontaires s'insèrent souvent en début ou fin de texte. Ces espaces invisibles "
                    "faussent les recherches avec `RECHERCHEX` et doublent artificiellement les lignes de synthèse.\n\n"
                    "> **Point de vigilance** : Pour Excel, `'Akwa'` et `' Akwa '` sont deux villes totalement différentes ! "
                    "Le nettoyage préalable est obligatoire avant tout croisement de données.\n\n"
                    "## 2. Exemple concret : La combinaison gagnante\n"
                    "Pour assainir une colonne contenant des noms de magasins disparates :\n\n"
                    "1. Utilisez `SUPPRESPACE(A2)` (en anglais `TRIM`) pour éliminer tous les espaces superflus.\n"
                    "2. Enveloppez la formule dans `MAJUSCULE` (en anglais `UPPER`) pour uniformiser la casse.\n\n"
                    "## 3. Défi pratique : À vous de jouer !\n"
                    "Ouvrez le dataset brut fourni ci-dessous. Vous devez nettoyer les 50 enregistrements "
                    "de livraison avant de calculer le chiffre d'affaires consolidé par secteur géographique."
                ),
                'code_snippet': "=MAJUSCULE(SUPPRESPACE(A2))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l2,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Cleaning and Standardizing Sales Records (Douala)",
                'summary': "Business case study: trim accidental whitespaces using TRIM and UPPER.",
                'content': (
                    "# Data Standardization for Douala Retail Stores\n\n"
                    "## 1. Mini-course: The TRIM function\n"
                    "Exports from regional POS terminals in Bonanjo, Bonaberi, and Bassa often carry accidental spaces. "
                    "These invisible spaces disrupt `XLOOKUP` formulas and create duplicate groups in pivot tables.\n\n"
                    "> **Important Note**: In Excel, `'Akwa'` and `' Akwa '` are two completely different keys! "
                    "Always sanitize your text columns prior to data modeling.\n\n"
                    "## 2. Practical Business Scenario: The Winning Formula\n"
                    "To clean store names:\n\n"
                    "1. Apply `=TRIM(A2)` to remove leading, trailing, and repeated whitespaces.\n"
                    "2. Wrap inside `=UPPER(...)` to ensure unified uppercase spelling.\n\n"
                    "## 3. Hands-on Challenge: Your Turn!\n"
                    "Download the raw dataset attached below and standardize all 50 sales lines."
                ),
                'code_snippet': "=UPPER(TRIM(A2))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # MODULE 3: Organisation et mise en forme
        # -------------------------------------------------------------
        m3, _ = Module.objects.update_or_create(
            course=course,
            order=3,
            defaults={
                'title': "Module 3 : Tableaux structurés et mise en forme conditionnelle",
                'description': "Convertir en tableau structuré, filtres dynamiques, gestion des doublons et règles visuelles.",
                'is_published': True,
            },
        )

        l3, _ = Lesson.objects.update_or_create(
            module=m3,
            slug='tableaux-structures-et-mfc',
            defaults={
                'title': "Tableaux structurés et mise en forme conditionnelle",
                'lesson_type': Lesson.LessonType.TEXT,
                'duration_minutes': 15,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l3,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Tableaux structurés et mise en forme conditionnelle",
                'summary': "Automatiser l'extension des formules et surligner instantanément les valeurs critiques.",
                'content': (
                    "# Tableaux structurés et alertes visuelles\n\n"
                    "## 1. Mini-cours : Le pouvoir du tableau structuré\n"
                    "Plutôt que de travailler sur une simple plage de cellules (`A1:F50`), transformer vos données "
                    "en **Tableau Structuré** (`Ctrl + L` ou `Ctrl + T`) offre des avantages majeurs :\n\n"
                    "- **Recopie automatique** : Toute nouvelle ligne hérite immédiatement des formules et des formats.\n"
                    "- **Formules lisibles** : Finies les références obscures comme `D2*E2`, vous écrivez `=[@Quantité]*[@PrixUnitaire]`.\n"
                    "- **Bandes de couleurs** : Lisibilité immédiate sur grand écran comme sur smartphone.\n\n"
                    "> **Conseil pratique** : Donnez toujours un nom clair à votre tableau (ex: `t_Ventes2026`) "
                    "dans l'onglet *Création de tableau*. Cela facilitera grandement vos futurs TCD et requêtes Power Query.\n\n"
                    "## 2. Exemple concret : Alertes de stock critique\n"
                    "Grâce à la **Mise en Forme Conditionnelle (MFC)**, vous pouvez colorer automatiquement en rouge "
                    "les articles dont le stock en entrepôt passe sous le seuil d'alerte de 50 unités."
                ),
                'code_snippet': "=[@Quantité]*[@Prix_Unitaire_FCFA]",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # MODULE 4: Gestion des dates et du temps
        # -------------------------------------------------------------
        m4, _ = Module.objects.update_or_create(
            course=course,
            order=4,
            defaults={
                'title': "Module 4 : Gestion des dates et des échéances",
                'description': "Calculs de durées, retards de paiement, délais de livraison et fonctions AUJOURD'HUI.",
                'is_published': True,
            },
        )

        # -------------------------------------------------------------
        # MODULE 5: Tableaux Croisés Dynamiques (TCD) - bases
        # -------------------------------------------------------------
        m5, _ = Module.objects.update_or_create(
            course=course,
            order=5,
            defaults={
                'title': "Module 5 : Tableaux Croisés Dynamiques (TCD) – Les bases",
                'description': "Création, synthèses croisées, pourcentages, segments et chronologies interactives.",
                'is_published': True,
            },
        )

        # -------------------------------------------------------------
        # MODULE 6: Visualisation des données & Dashboard final
        # -------------------------------------------------------------
        m6, _ = Module.objects.update_or_create(
            course=course,
            order=6,
            defaults={
                'title': "Module 6 : Visualisation & Tableau de Bord Commercial",
                'description': "Graphiques croisés dynamiques, indicateurs KPI et assemblage du dashboard final.",
                'is_published': True,
            },
        )

        # -------------------------------------------------------------
        # ATTACHMENTS (F1.6)
        # -------------------------------------------------------------
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

        LessonAttachment.objects.update_or_create(
            lesson=l2,
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
            lesson=l2,
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

        self.stdout.write(self.style.SUCCESS("Successfully seeded Excel course aligned with the YITA Data Analyst Roadmap!"))
