from decimal import Decimal
from django.core.management.base import BaseCommand
from courses.models import (
    Course,
    Lesson,
    LessonAttachment,
    LessonTranslation,
    Module,
    Quiz,
    QuizAnswerOption,
    QuizQuestion,
    Track,
)


class Command(BaseCommand):
    help = "Seeds the Excel curriculum aligned with the YITA Data Analyst Roadmap and real video media."

    def handle(self, *args, **options):
        self.stdout.write("Seeding Excel Data Analyst course with real video integration...")

        # -------------------------------------------------------------
        # TRACK
        # -------------------------------------------------------------
        track, _ = Track.objects.update_or_create(
            tool=Track.Tool.EXCEL,
            defaults={
                'name': "Excel pour l'Analyse de Données",
                'description': "Du tableur classique aux modèles de données avancés Power Query & DAX.",
                'icon': "FileSpreadsheet",
                'order': 1,
                'is_active': True,
            },
        )

        # -------------------------------------------------------------
        # COURSE: NIVEAU 1 — INTERMÉDIAIRE
        # -------------------------------------------------------------
        course, _ = Course.objects.update_or_create(
            slug='excel-bases-analyse',
            defaults={
                'track': track,
                'title': "Excel — Niveau 1 : Fondamentaux & Tableaux de Bord",
                'description': (
                    "Maîtrisez les formules avancées, le nettoyage de données réelles en FCFA, "
                    "les Tableaux Croisés Dynamiques (TCD) et construisez votre premier tableau de bord décisionnel."
                ),
                'level': Course.Level.BEGINNER,
                'price_tier': Course.PriceTier.FREE,
                'price_fcfa': Decimal('0.00'),
                'duration_hours': 12,
                'is_published': True,
                'order': 1,
            },
        )

        # -------------------------------------------------------------
        # MODULE 1: Formules et fonctions fondamentales
        # -------------------------------------------------------------
        m1, _ = Module.objects.update_or_create(
            course=course,
            order=1,
            defaults={
                'title': "Module 1 : Formules et fonctions fondamentales",
                'description': "Types de données rigoureux, formatage FCFA, SOMME, MOYENNE et formules conditionnelles.",
                'is_published': True,
            },
        )

        # Lesson 1.1: Environnement et types de données
        l1, _ = Lesson.objects.update_or_create(
            module=m1,
            slug='environnement-et-types-de-donnees',
            defaults={
                'title': "Environnement et types de données (Texte, Nombres, FCFA, Dates)",
                'lesson_type': Lesson.LessonType.VIDEO,
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
                'title': "Environnement et types de données (Texte, Nombres, FCFA, Dates)",
                'summary': "Distinguer le texte, les nombres, les devises FCFA et les dates pour fiabiliser les calculs.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/jenafg.mp4",
                'content': (
                    "# Rigueur des données et environnement de travail\n\n"
                    "Bienvenue dans votre premier cours d'analyse de données sur **DataMboa** !\n\n"
                    "## 1. Mini-cours : La propreté des types de données\n"
                    "Un bon analyste ne commence pas par des formules complexes, mais par **la rigueur des types de données**. "
                    "Dans un tableau professionnel, chaque colonne possède une nature stricte :\n\n"
                    "- **Le Texte** : Noms de clients, points de vente à Douala (Akwa, Bonanjo, Deido), codes articles.\n"
                    "- **Les Nombres entiers ou décimaux** : Volumes de stock, quantités vendues en caisses ou palettes.\n"
                    "- **Les Devises (FCFA)** : Chiffre d'affaires hors taxes, prix de vente unitaire, marge commerciale.\n"
                    "- **Les Dates** : Format standard francophone `JJ/MM/AAAA` impératif pour les analyses temporelles.\n\n"
                    "> **Règle d'or** : Ne tapez jamais `FCFA` à la main dans une cellule contenant un montant ! "
                    "Cela transforme votre nombre en texte et rend toute somme ou moyenne impossible.\n\n"
                    "## 2. Exemple concret : Boutique de distribution à Akwa\n"
                    "Pour afficher proprement `2 500 000 FCFA` tout en conservant la capacité de calcul :\n\n"
                    "1. Saisissez la valeur brute `2500000` sans espace ni devise.\n"
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
                'video_url': "http://localhost:8000/api/v1/courses/videos/jenafg.mp4",
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
                    "## 2. Practical Business Scenario: Distribution Store in Akwa\n"
                    "To display `2 500 000 FCFA` cleanly while preserving calculations:\n\n"
                    "1. Type the raw integer `2500000` without spaces or currency tags.\n"
                    "2. Open Format Cells (`Ctrl + 1`).\n"
                    "3. Select Custom and apply `# ##0 \"FCFA\"`."
                ),
                'code_snippet': '# ##0 "FCFA"',
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # Quiz 1: Attached to Lesson 1.1 (F1.7)
        q1_obj, _ = Quiz.objects.update_or_create(
            lesson=l1,
            defaults={
                'title': "Quiz Formatif : Rigueur des types & FCFA",
                'description': "Testez votre compréhension des formats de données avant de passer aux calculs.",
                'purpose': Quiz.Purpose.FORMATIVE,
                'passing_score_percentage': 70,
                'is_published': True,
            },
        )
        q1_obj.questions.all().delete()

        # Question 1.1 (Single Choice, Apply)
        qq1 = QuizQuestion.objects.create(
            quiz=q1_obj,
            prompt="Dans un tableau de caisse à Akwa, un collègue tape '2 500 000 FCFA' directement dans la cellule C4. Que se passe-t-il lors du calcul =SOMME(C2:C10) ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            explanation="Écrire du texte dans une cellule numérique la convertit en chaîne de caractères brute. Excel ignore cette cellule lors des additions ou produit une erreur. Pour afficher 'FCFA', tapez 2500000 et appliquez le format personnalisé # ##0 \"FCFA\".",
            order=1,
        )
        QuizAnswerOption.objects.create(question=qq1, text="Excel calcule correctement la somme en ignorant le mot FCFA", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq1, text="Excel ignore la cellule C4 ou bloque les calculs car la valeur est considérée comme du texte", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq1, text="Excel convertit automatiquement la colonne en devise FCFA", is_correct=False, order=3)

        # Question 1.2 (Single Choice, Remember)
        qq2 = QuizQuestion.objects.create(
            quiz=q1_obj,
            prompt="Quel format de date standard devez-vous impérativement appliquer en entreprise en zone francophone (Cameroun, CEMAC) ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.REMEMBER,
            explanation="La norme comptable et administrative en zone CEMAC est le format francophone JJ/MM/AAAA. Le format américain MM/JJ/AAAA inverse les jours et mois inférieurs à 12 et fausse les tris temporels.",
            order=2,
        )
        QuizAnswerOption.objects.create(question=qq2, text="MM/JJ/AAAA (format anglophone)", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq2, text="JJ/MM/AAAA (format standard francophone)", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq2, text="Texte libre sans séparateur", is_correct=False, order=3)

        # Question 1.3 (True/False, Understand)
        qq3 = QuizQuestion.objects.create(
            quiz=q1_obj,
            prompt="Vrai ou Faux : Aligner un nombre à gauche via les boutons d'alignement modifie sa nature et le transforme en texte dans Excel.",
            question_type=QuizQuestion.QuestionType.TRUE_FALSE,
            bloom_level=QuizQuestion.BloomLevel.UNDERSTAND,
            explanation="Faux. L'alignement visuel (gauche, centre, droite) modifie uniquement la présentation visuelle. La valeur reste un nombre et participe normalement à tous les calculs.",
            order=3,
        )
        QuizAnswerOption.objects.create(question=qq3, text="Vrai", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq3, text="Faux", is_correct=True, order=2)

        # Lesson 1.2: Formules fondamentales SOMME et MOYENNE
        l1_2, _ = Lesson.objects.update_or_create(
            module=m1,
            slug='formules-fondamentales-somme-et-moyenne',
            defaults={
                'title': "Les formules fondamentales : SOMME et MOYENNE",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 12,
                'is_free_preview': True,
                'order': 2,
                'is_published': True,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l1_2,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Les formules fondamentales : SOMME et MOYENNE",
                'summary': "Calculer le chiffre d'affaires et le panier moyen sur des transactions commerciales en FCFA.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/CREANCE%201.mp4",
                'content': (
                    "# Calcul du chiffre d'affaires et du panier moyen\n\n"
                    "## 1. Mini-cours : Agréger les ventes sans erreur\n"
                    "Dans les entreprises camerounaises et d'Afrique Centrale, l'analyse des bilans quotidiens de caisse "
                    "nécessite d'agréger rapidement les volumes vendus sans erreurs manuelles de calculatrice.\n\n"
                    "- **Syntaxe SOMME** : `=SOMME(C2:C25)` additionne les montants monétaires de la colonne C.\n"
                    "- **Syntaxe MOYENNE** : `=MOYENNE(D2:D25)` calcule la valeur moyenne par panier.\n\n"
                    "> **Attention au séparateur régional !** : Sur Excel paramétré en français (Cameroun/France), "
                    "utilisez toujours le point-virgule (`;`) pour séparer les arguments disjoints, et non la virgule anglo-saxonne.\n\n"
                    "## 2. Exemple concret : Rapprochement Douala\n"
                    "Boutique Akwa (1 450 000 FCFA), Dépôt Bonabéri (890 000 FCFA), Agence Bafoussam (1 120 000 FCFA) : "
                    "le total consolidé s'élève à 3 460 000 FCFA."
                ),
                'code_snippet': "=SOMME(C2:C25)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l1_2,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Fundamental Formulas: SUM and AVERAGE",
                'summary': "Aggregate revenue and average transaction values for Central African retail stores.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/CREANCE%201.mp4",
                'content': (
                    "# Revenue and Average Basket Aggregation\n\n"
                    "## 1. Mini-course: Reliable Sales Aggregation\n"
                    "In retail operations across Douala and Yaoundé, daily cash settlement requires instant aggregation.\n\n"
                    "- **SUM syntax**: `=SUM(C2:C25)` computes total revenue.\n"
                    "- **AVERAGE syntax**: `=AVERAGE(D2:D25)` computes the basket benchmark.\n\n"
                    "> **Regional Separator Note**: For French Excel configurations, use semicolons (`;`) to separate arguments."
                ),
                'code_snippet': "=SUM(C2:C25)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # Quiz 2: Attached to Lesson 1.2 (F1.7)
        q2_obj, _ = Quiz.objects.update_or_create(
            lesson=l1_2,
            defaults={
                'title': "Quiz Formatif : SOMME, MOYENNE et séparateurs régionaux",
                'description': "Validez vos formules et le rapprochement multi-boutiques avant le module suivant.",
                'purpose': Quiz.Purpose.FORMATIVE,
                'passing_score_percentage': 70,
                'is_published': True,
            },
        )
        q2_obj.questions.all().delete()

        # Question 2.1 (Single Choice, Apply)
        qq2_1 = QuizQuestion.objects.create(
            quiz=q2_obj,
            prompt="Sur une version française d'Excel, quel séparateur devez-vous utiliser entre les arguments d'une formule telle que SOMME ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            explanation="En français, la virgule (,) est le séparateur décimal (ex: 12,5). Le séparateur d'arguments de fonctions est obligatoirement le point-virgule (;).",
            order=1,
        )
        QuizAnswerOption.objects.create(question=qq2_1, text="La virgule (,)", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq2_1, text="Le point-virgule (;)", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq2_1, text="Le double point (:)", is_correct=False, order=3)

        # Question 2.2 (Numeric, Apply)
        QuizQuestion.objects.create(
            quiz=q2_obj,
            prompt="Vous consolidez les ventes des 3 boutiques : Akwa (1 450 000 FCFA), Bonabéri (890 000 FCFA) et Bafoussam (1 120 000 FCFA). Quel est le montant total consolidé en FCFA ?",
            question_type=QuizQuestion.QuestionType.NUMERIC,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            numeric_target=Decimal('3460000.00'),
            explanation="1 450 000 + 890 000 + 1 120 000 = 3 460 000 FCFA.",
            order=2,
        )

        # Question 2.3 (Single Choice, Analyze)
        qq2_3 = QuizQuestion.objects.create(
            quiz=q2_obj,
            prompt="Comment la fonction =MOYENNE(A1:A10) réagit-elle si une cellule de la plage contient du texte ou est vide ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.ANALYZE,
            explanation="La fonction MOYENNE ignore automatiquement les cellules textuelles et vides dans le calcul du diviseur. Si la cellule contient 0, elle est en revanche comptabilisée.",
            order=3,
        )
        QuizAnswerOption.objects.create(question=qq2_3, text="Elle renvoie l'erreur #DIV/0!", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq2_3, text="Elle ignore la cellule texte et divise uniquement par le nombre de cellules contenant des chiffres", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq2_3, text="Elle attribue la valeur 0 à la cellule texte", is_correct=False, order=3)

        # -------------------------------------------------------------
        # MODULE 2: Recherche et conversion de données
        # -------------------------------------------------------------
        m2, _ = Module.objects.update_or_create(
            course=course,
            order=2,
            defaults={
                'title': "Module 2 : Recherche et conversion de données",
                'description': "RECHERCHEX vs RECHERCHEV, INDEX/EQUIV et normalisation textuelle avec SUPPRESPACE.",
                'is_published': True,
            },
        )

        l2, _ = Lesson.objects.update_or_create(
            module=m2,
            slug='nettoyer-donnees-ventes-douala',
            defaults={
                'title': "Nettoyer et normaliser des données de ventes (Douala)",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 14,
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
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo1.mp4",
                'content': (
                    "# Normalisation des données commerciales à Douala\n\n"
                    "## 1. Mini-cours : La fonction SUPPRESPACE\n"
                    "Lors de l'exportation des données de caisses des points de vente à Bonabéri, Bonanjo et Bassa, "
                    "des espaces involontaires s'insèrent souvent en début ou fin de texte. Ces espaces invisibles "
                    "faussent les recherches avec `RECHERCHEX` et doublent artificiellement les lignes de synthèse.\n\n"
                    "> **Point de vigilance** : Pour Excel, `'Akwa'` et `' Akwa '` sont deux entités totalement différentes ! "
                    "Le nettoyage préalable est obligatoire avant tout croisement de données.\n\n"
                    "## 2. Exemple concret : La formule combinée\n"
                    "Pour assainir une colonne contenant des noms de magasins disparates :\n\n"
                    "1. Utilisez `SUPPRESPACE(A2)` pour éliminer tous les espaces superflus.\n"
                    "2. Enveloppez la formule dans `MAJUSCULE` pour uniformiser la casse.\n\n"
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
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo1.mp4",
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
                'title': "Module 3 : Tableaux structurés et alertes visuelles",
                'description': "Convertir en tableau structuré, filtres dynamiques, gestion des doublons et règles MFC.",
                'is_published': True,
            },
        )

        l3, _ = Lesson.objects.update_or_create(
            module=m3,
            slug='tableaux-structures-et-mfc',
            defaults={
                'title': "Tableaux structurés et mise en forme conditionnelle",
                'lesson_type': Lesson.LessonType.VIDEO,
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
                'video_url': "http://localhost:8000/api/v1/courses/videos/CREANCE%202.mp4",
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
                    "## 2. Exemple concret : Alertes de créances et stock critique\n"
                    "Grâce à la **Mise en Forme Conditionnelle (MFC)**, vous pouvez colorer automatiquement en rouge "
                    "les factures impayées dont l'échéance dépasse 30 jours."
                ),
                'code_snippet': "=[@Quantité]*[@Prix_Unitaire_FCFA]",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l3,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Structured Tables and Conditional Formatting",
                'summary': "Automate formula propagation and highlight critical thresholds visually.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/CREANCE%202.mp4",
                'content': (
                    "# Structured Tables and Visual Alerts\n\n"
                    "## 1. Mini-course: The Power of Excel Tables\n"
                    "Transforming raw ranges into structured tables (`Ctrl + T`) unlocks instant calculated columns "
                    "and intuitive formula syntax.\n\n"
                    "## 2. Real Business Scenario: Overdue Invoices Alert\n"
                    "Highlight invoices exceeding 30 days overdue in bold red using conditional rules."
                ),
                'code_snippet': "=[@Quantity]*[@Unit_Price_FCFA]",
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

        l4, _ = Lesson.objects.update_or_create(
            module=m4,
            slug='dates-et-temps-calcul-echeances',
            defaults={
                'title': "Calculer les délais et retards de créances clients",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 14,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l4,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Calculer les délais et retards de créances clients",
                'summary': "Maîtriser les fonctions de dates pour identifier les créances échues et planifier les relances.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/creance%203.mp4",
                'content': (
                    "# Suivi des délais de paiement et créances clients\n\n"
                    "## 1. Mini-cours : La fonction AUJOURD'HUI et les écarts de dates\n"
                    "Pour calculer automatiquement le nombre de jours de retard d'une facture client :\n"
                    "On soustrait la date d'échéance à la date du jour : `=AUJOURD'HUI() - [@Date_Echéance]`.\n\n"
                    "## 2. Exemple concret : Relance des débiteurs à Douala\n"
                    "Classer les retards par tranche (0-30 jours, 31-60 jours, >60 jours) pour prioriser les appels de recouvrement."
                ),
                'code_snippet': "=SI(AUJOURD'HUI()>[@Echeance]; AUJOURD'HUI()-[@Echeance]; 0)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # MODULE 5: Tableaux Croisés Dynamiques (TCD) – Les bases
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

        l5, _ = Lesson.objects.update_or_create(
            module=m5,
            slug='tcd-fondamentaux-synthese-douala',
            defaults={
                'title': "Créer votre premier Tableau Croisé Dynamique de ventes",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 16,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l5,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Créer votre premier Tableau Croisé Dynamique de ventes",
                'summary': "Générer un rapport de synthèse multidimensionnel en quelques clics sans écrire de formule.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo2.mp4",
                'content': (
                    "# Synthèse commerciale avec les Tableaux Croisés Dynamiques\n\n"
                    "## 1. Mini-cours : Les 4 zones du TCD\n"
                    "Filtres, Colonnes, Lignes, Valeurs : découvrez comment faire pivoter vos données instantanément.\n\n"
                    "## 2. Exemple concret : CA par point de vente et famille de produits\n"
                    "Croisez les ventes d'Akwa, Bonanjo et Bassa avec les gammes Alimentation, Cosmétiques et Électronique."
                ),
                'code_snippet': "=SOMME([Montant_Vente_FCFA])",
                'status': LessonTranslation.Status.REVIEWED,
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

        l6, _ = Lesson.objects.update_or_create(
            module=m6,
            slug='dashboard-synthese-intermediaire',
            defaults={
                'title': "Assemblage du Tableau de Bord Commercial Final",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 20,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )

        LessonTranslation.objects.update_or_create(
            lesson=l6,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Assemblage du Tableau de Bord Commercial Final",
                'summary': "Projet final : concevoir un dashboard exécutif interactif avec segments et KPI en FCFA.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/KPI2.mp4",
                'content': (
                    "# Dashboard de Synthèse Commerciale (Douala & Régions)\n\n"
                    "## 1. Mini-cours : Principes du dashboarding épuré\n"
                    "Agencer les KPI clés (CA Global, Panier Moyen, Taux d'atteinte) en haut de page, suivis des tendances graphiques.\n\n"
                    "## 2. Défi d'intégration finale\n"
                    "Assemblez les segments interactifs pour filtrer en direct par ville, commercial et période."
                ),
                'code_snippet': "=SOMME.SI.ENS(Ventes; Mois; \"Janvier\"; Région; \"Littoral\")",
                'status': LessonTranslation.Status.REVIEWED,
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
            lesson=l1_2,
            title="Cas_Pratique_Ventes_Douala.xlsx",
            defaults={
                'description': "Excel • 48 Ko • Données brutes de caisse Akwa, Bonabéri, Bafoussam.",
                'attachment_type': LessonAttachment.AttachmentType.STARTER,
                'file_format': 'xlsx',
                'file_size_bytes': 49152,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/datasets/Cas_Pratique_Ventes_Douala.xlsx',
                'is_free_preview': True,
                'order': 1,
            },
        )

        LessonAttachment.objects.update_or_create(
            lesson=l1_2,
            title="Fiche_Synthese_Formules.pdf",
            defaults={
                'description': "PDF • 180 Ko • Mémento imprimable des syntaxes SOMME & MOYENNE.",
                'attachment_type': LessonAttachment.AttachmentType.CHEATSHEET,
                'file_format': 'pdf',
                'file_size_bytes': 184320,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/guides/Fiche_Synthese_Formules.pdf',
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
