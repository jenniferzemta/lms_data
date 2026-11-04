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
    help = "Seeds the complete 3-Level Excel curriculum aligned with the YITA Data Analyst Roadmap and real video media."

    def handle(self, *args, **options):
        self.stdout.write("Seeding Excel Data Analyst courses (Levels 1, 2, 3) with real video integration...")

        # -------------------------------------------------------------
        # TRACK
        # -------------------------------------------------------------
        track, _ = Track.objects.update_or_create(
            tool=Track.Tool.EXCEL,
            defaults={
                'name': "Excel pour l'Analyse de Données",
                'description': "Du tableur classique aux modèles de données décisionnels avec Power Query, Power Pivot et DAX.",
                'icon': "FileSpreadsheet",
                'order': 1,
                'is_active': True,
            },
        )

        # =============================================================
        # 1. NIVEAU 1 — INTERMÉDIAIRE : LES BASES SOLIDES (YITA COLONNE 1)
        # =============================================================
        c1, _ = Course.objects.update_or_create(
            slug='excel-bases-analyse',
            defaults={
                'track': track,
                'title': "Excel — Niveau 1 : Fondamentaux & Tableaux de Bord",
                'subtitle': "Les bases solides pour manipuler et consolider des données d'entreprise en FCFA.",
                'description': (
                    "Maîtrisez les formules avancées, le nettoyage rigoureux de données réelles, "
                    "les Tableaux Croisés Dynamiques (TCD) et concevez votre premier tableau de bord commercial."
                ),
                'level': Course.Level.BEGINNER,
                'price_tier': Course.PriceTier.FREE,
                'duration_hours': 14,
                'is_published': True,
                'order': 1,
            },
        )

        # -------------------------------------------------------------
        # C1 — MODULE 1: Formules et fonctions fondamentales
        # -------------------------------------------------------------
        c1_m1, _ = Module.objects.update_or_create(
            course=c1,
            order=1,
            defaults={
                'title': "Module 1 : Formules et fonctions fondamentales",
                'description': "Types de données rigoureux, formatage monétaire FCFA, SOMME, MOYENNE et séparateurs régionaux.",
                'is_published': True,
            },
        )

        # Leçon 1.1
        c1_l1_1, _ = Lesson.objects.update_or_create(
            module=c1_m1,
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
            lesson=c1_l1_1,
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
            lesson=c1_l1_1,
            language=LessonTranslation.Language.EN,
            defaults={
                'title': "Work Environment & Data Types (Text, Numbers, FCFA, Dates)",
                'summary': "Distinguish between text, numbers, FCFA currencies, and dates to ensure formula integrity.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/jenafg.mp4",
                'content': (
                    "# Data Integrity & Working Environment\n\n"
                    "Welcome to your first data analysis lesson on **DataMboa**!\n\n"
                    "## 1. Mini-course: Data Type Strictness\n"
                    "Never append currency labels like `FCFA` manually into numeric cells. "
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

        # Quiz 1.1
        q1_1, _ = Quiz.objects.update_or_create(
            lesson=c1_l1_1,
            defaults={
                'title': "Quiz Formatif : Rigueur des types & FCFA",
                'description': "Testez votre compréhension des formats de données avant de passer aux calculs.",
                'purpose': Quiz.Purpose.FORMATIVE,
                'passing_score_percentage': 70,
                'is_published': True,
            },
        )
        q1_1.questions.all().delete()
        qq1 = QuizQuestion.objects.create(
            quiz=q1_1,
            prompt="Dans un tableau de caisse à Akwa, un collègue tape '2 500 000 FCFA' directement dans la cellule C4. Que se passe-t-il lors du calcul =SOMME(C2:C10) ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            explanation="Écrire du texte dans une cellule numérique la convertit en chaîne de caractères brute. Excel ignore cette cellule lors des additions ou produit une erreur. Pour afficher 'FCFA', tapez 2500000 et appliquez le format personnalisé # ##0 \"FCFA\".",
            order=1,
        )
        QuizAnswerOption.objects.create(question=qq1, text="Excel calcule correctement la somme en ignorant le mot FCFA", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq1, text="Excel ignore la cellule C4 ou bloque les calculs car la valeur est considérée comme du texte", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq1, text="Excel convertit automatiquement la colonne en devise FCFA", is_correct=False, order=3)

        qq2 = QuizQuestion.objects.create(
            quiz=q1_1,
            prompt="Quel format de date standard devez-vous impérativement appliquer en entreprise en zone francophone (Cameroun, CEMAC) ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.REMEMBER,
            explanation="La norme comptable et administrative en zone CEMAC est le format francophone JJ/MM/AAAA. Le format américain MM/JJ/AAAA inverse les jours et mois inférieurs à 12 et fausse les tris temporels.",
            order=2,
        )
        QuizAnswerOption.objects.create(question=qq2, text="MM/JJ/AAAA (format anglophone)", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq2, text="JJ/MM/AAAA (format standard francophone)", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq2, text="Texte libre sans séparateur", is_correct=False, order=3)

        qq3 = QuizQuestion.objects.create(
            quiz=q1_1,
            prompt="Vrai ou Faux : Aligner un nombre à gauche via les boutons d'alignement modifie sa nature et le transforme en texte dans Excel.",
            question_type=QuizQuestion.QuestionType.TRUE_FALSE,
            bloom_level=QuizQuestion.BloomLevel.UNDERSTAND,
            explanation="Faux. L'alignement visuel (gauche, centre, droite) modifie uniquement la présentation visuelle. La valeur reste un nombre et participe normalement à tous les calculs.",
            order=3,
        )
        QuizAnswerOption.objects.create(question=qq3, text="Vrai", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq3, text="Faux", is_correct=True, order=2)

        # Leçon 1.2
        c1_l1_2, _ = Lesson.objects.update_or_create(
            module=c1_m1,
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
            lesson=c1_l1_2,
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
                    "le total consolidé s'élève à 3 460 000 FCFA.\n\n"
                    "## 3. Défi pratique : Consolider les ventes régionales\n"
                    "Calculez le chiffre d'affaires total et la vente moyenne par client à l'aide des formules SOMME et MOYENNE."
                ),
                'code_snippet': "=SOMME(C2:C25)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        q1_2, _ = Quiz.objects.update_or_create(
            lesson=c1_l1_2,
            defaults={
                'title': "Quiz Formatif : SOMME, MOYENNE et séparateurs régionaux",
                'description': "Validez vos formules et le rapprochement multi-boutiques avant le module suivant.",
                'purpose': Quiz.Purpose.FORMATIVE,
                'passing_score_percentage': 70,
                'is_published': True,
            },
        )
        q1_2.questions.all().delete()
        qq2_1 = QuizQuestion.objects.create(
            quiz=q1_2,
            prompt="Sur une version française d'Excel, quel séparateur devez-vous utiliser entre les arguments d'une formule telle que SOMME ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            explanation="En français, la virgule (,) est le séparateur décimal (ex: 12,5). Le séparateur d'arguments de fonctions est obligatoirement le point-virgule (;).",
            order=1,
        )
        QuizAnswerOption.objects.create(question=qq2_1, text="La virgule (,)", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq2_1, text="Le point-virgule (;)", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq2_1, text="Le double point (:)", is_correct=False, order=3)

        QuizQuestion.objects.create(
            quiz=q1_2,
            prompt="Vous consolidez les ventes des 3 boutiques : Akwa (1 450 000 FCFA), Bonabéri (890 000 FCFA) et Bafoussam (1 120 000 FCFA). Quel est le montant total consolidé en FCFA ?",
            question_type=QuizQuestion.QuestionType.NUMERIC,
            bloom_level=QuizQuestion.BloomLevel.APPLY,
            numeric_target=Decimal('3460000.00'),
            explanation="1 450 000 + 890 000 + 1 120 000 = 3 460 000 FCFA.",
            order=2,
        )

        qq2_3 = QuizQuestion.objects.create(
            quiz=q1_2,
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
        # C1 — MODULE 2: Recherche et conversion de données
        # -------------------------------------------------------------
        c1_m2, _ = Module.objects.update_or_create(
            course=c1,
            order=2,
            defaults={
                'title': "Module 2 : Recherche et conversion de données",
                'description': "RECHERCHEX vs RECHERCHEV, INDEX/EQUIV bidirectionnel, fonctions texte et validation.",
                'is_published': True,
            },
        )

        c1_l2_1, _ = Lesson.objects.update_or_create(
            module=c1_m2,
            slug='recherchex-et-normalisation-textuelle',
            defaults={
                'title': "Recherche bidirectionnelle (RECHERCHEX) et normalisation textuelle",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 15,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c1_l2_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Recherche bidirectionnelle (RECHERCHEX) et normalisation textuelle",
                'summary': "Rapprocher les tarifs officiels et nettoyer les espaces parasites avec SUPPRESPACE et RECHERCHEX.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo1.mp4",
                'content': (
                    "# Recherche avancée et normalisation de données\n\n"
                    "## 1. Mini-cours : RECHERCHEX vs RECHERCHEV classique\n"
                    "La fonction `RECHERCHEX` remplace définitivement l'ancien `RECHERCHEV` grâce à 3 atouts décisifs :\n\n"
                    "1. **Recherche bidirectionnelle** : Recherche indifféremment vers la gauche ou vers la droite.\n"
                    "2. **Gestion intégrée des erreurs** : Le 4e argument remplace avantageusement `SIERREUR`.\n"
                    "3. **Précision exacte par défaut** : Finie l'obligation d'ajouter `; FAUX` à la fin.\n\n"
                    "- **Syntaxe RECHERCHEX** : `=RECHERCHEX(ValeurCherchée; TableauRecherche; TableauRenvoyé; [SiNonTrouvé])`\n\n"
                    "> **Piège fréquent** : Si vos données contiennent des espaces invisibles (`' Bonabéri '` au lieu de `'Bonabéri'`), "
                    "la recherche échoue. Appliquez toujours `=SUPPRESPACE(A2)` pour normaliser le texte.\n\n"
                    "## 2. Exemple concret : Grille tarifaire Douala\n"
                    "Retrouver le prix unitaire d'un sac de ciment ou d'un carton de savon à partir de son code article dans le catalogue général.\n\n"
                    "## 3. Défi pratique : À vous de jouer !\n"
                    "Téléchargez le fichier de départ et complétez les 35 lignes de commandes avec le prix catalogue correspondant."
                ),
                'code_snippet': "=RECHERCHEX(A2; Tarifs[Code]; Tarifs[Prix_FCFA]; \"Code Inconnu\")",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        q1_l2, _ = Quiz.objects.update_or_create(
            lesson=c1_l2_1,
            defaults={
                'title': "Quiz Formatif : RECHERCHEX et nettoyage de texte",
                'description': "Évaluez votre maîtrise des recherches de correspondances et des fonctions texte.",
                'purpose': Quiz.Purpose.FORMATIVE,
                'passing_score_percentage': 70,
                'is_published': True,
            },
        )
        q1_l2.questions.all().delete()
        qq_m2_1 = QuizQuestion.objects.create(
            quiz=q1_l2,
            prompt="Quel est l'avantage majeur de RECHERCHEX par rapport à RECHERCHEV ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.UNDERSTAND,
            explanation="RECHERCHEX peut rechercher des valeurs situées à gauche de la colonne de référence sans réordonner les colonnes du tableau.",
            order=1,
        )
        QuizAnswerOption.objects.create(question=qq_m2_1, text="Elle oblige à trier les données par ordre alphabétique croissant", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq_m2_1, text="Elle permet de renvoyer une colonne située à gauche de la colonne de recherche sans réorganiser le tableau", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq_m2_1, text="Elle ne fonctionne qu'avec des nombres entiers", is_correct=False, order=3)

        qq_m2_2 = QuizQuestion.objects.create(
            quiz=q1_l2,
            prompt="Quelle fonction supprime les espaces superflus au début, à la fin et les doubles espaces internes d'un libellé ?",
            question_type=QuizQuestion.QuestionType.SINGLE_CHOICE,
            bloom_level=QuizQuestion.BloomLevel.REMEMBER,
            explanation="La fonction SUPPRESPACE (TRIM en anglais) nettoie les espaces parasites en conservant uniquement les espaces simples entre les mots.",
            order=2,
        )
        QuizAnswerOption.objects.create(question=qq_m2_2, text="EPURAGE", is_correct=False, order=1)
        QuizAnswerOption.objects.create(question=qq_m2_2, text="SUPPRESPACE", is_correct=True, order=2)
        QuizAnswerOption.objects.create(question=qq_m2_2, text="NETTOYAGE", is_correct=False, order=3)

        # -------------------------------------------------------------
        # C1 — MODULE 3: Organisation et mise en forme
        # -------------------------------------------------------------
        c1_m3, _ = Module.objects.update_or_create(
            course=c1,
            order=3,
            defaults={
                'title': "Module 3 : Organisation et mise en forme",
                'description': "Tableaux structurés, mise en forme conditionnelle avancée (MFC), gestion des doublons et règles métier.",
                'is_published': True,
            },
        )

        c1_l3_1, _ = Lesson.objects.update_or_create(
            module=c1_m3,
            slug='tableaux-structures-et-mfc',
            defaults={
                'title': "Tableaux structurés et alertes visuelles conditionnelles",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 14,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c1_l3_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Tableaux structurés et alertes visuelles conditionnelles",
                'summary': "Automatiser l'extension des calculs et colorer dynamiquement les créances à risque.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/CREANCE%202.mp4",
                'content': (
                    "# Tableaux structurés et alertes visuelles\n\n"
                    "## 1. Mini-cours : Le tableau structuré Excel\n"
                    "Convertir une plage en tableau structuré (`Ctrl + L`) transforme votre feuille en véritable petite base de données :\n\n"
                    "- Formules rédigées en langage clair : `=[@Quantité] * [@Prix_Unitaire_FCFA]`\n"
                    "- Extension automatique des formules et des formats à l'ajout de nouvelles lignes.\n"
                    "- Ligne des totaux instantanée sans risque d'oublier des cellules.\n\n"
                    "## 2. Exemple concret : Alerte créance supérieure à 1 000 000 FCFA\n"
                    "Avec la Mise en Forme Conditionnelle, surlignez en rouge clair toute facture impayée critique pour alerter l'équipe de recouvrement à Douala."
                ),
                'code_snippet': "=[@Quantite] * [@Prix_Unitaire_FCFA]",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # C1 — MODULE 4: Gestion des dates et du temps
        # -------------------------------------------------------------
        c1_m4, _ = Module.objects.update_or_create(
            course=c1,
            order=4,
            defaults={
                'title': "Module 4 : Gestion des dates et du temps",
                'description': "Fonctions dates (AUJOURD'HUI, DATE), calculs d'échéances de paiement, retards et délais de livraison.",
                'is_published': True,
            },
        )

        c1_l4_1, _ = Lesson.objects.update_or_create(
            module=c1_m4,
            slug='calcul-echeances-et-retards-paiement',
            defaults={
                'title': "Calculer les délais et retards de créances clients",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 16,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c1_l4_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Calculer les délais et retards de créances clients",
                'summary': "Gérer les échéances à 30/60/90 jours et automatiser le calcul des retards en jours.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/creance%203.mp4",
                'content': (
                    "# Gestion des dates et suivi des créances\n\n"
                    "## 1. Mini-cours : Le temps dans le moteur Excel\n"
                    "Pour Excel, une date est simplement un nombre entier représentant le nombre de jours écoulés depuis le 1er janvier 1900. "
                    "On peut donc directement soustraire deux dates pour obtenir un nombre de jours de retard !\n\n"
                    "- Formule de retard : `=AUJOURD'HUI() - [@Date_Echeance]`\n"
                    "- Classement par tranche : `=SI([@Retard] > 60; \"Critique (>60j)\"; \"Normal\")`\n\n"
                    "## 2. Cas réel : Suivi des règlements de grossistes à Bafoussam\n"
                    "Priorisez les relances téléphoniques selon l'âge de la dette en FCFA."
                ),
                'code_snippet': "=SI(AUJOURD'HUI()>[@Date_Echeance]; AUJOURD'HUI()-[@Date_Echeance]; 0)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # C1 — MODULE 5: Tableaux croisés dynamiques (TCD) – bases
        # -------------------------------------------------------------
        c1_m5, _ = Module.objects.update_or_create(
            course=c1,
            order=5,
            defaults={
                'title': "Module 5 : Tableaux croisés dynamiques (TCD) – bases",
                'description': "Création, mise en forme, pourcentages, filtres, segments interactifs et chronologies.",
                'is_published': True,
            },
        )

        c1_l5_1, _ = Lesson.objects.update_or_create(
            module=c1_m5,
            slug='tcd-bases-analyse-multidimensionnelle',
            defaults={
                'title': "Créer votre premier Tableau Croisé Dynamique de ventes",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 18,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c1_l5_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Créer votre premier Tableau Croisé Dynamique de ventes",
                'summary': "Résumer 5 000 lignes de vente en 3 clics par agence et par catégorie de produits.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo2.mp4",
                'content': (
                    "# Révolutionnez vos rapports avec les TCD\n\n"
                    "## 1. Mini-cours : Les 4 quadrants du TCD\n"
                    "- **Lignes** : Vos axes d'analyse principaux (ex: Régions, Boutiques).\n"
                    "- **Colonnes** : Vos ventilations secondaires (ex: Mois, Familles d'articles).\n"
                    "- **Valeurs** : Les grandeurs quantitatives (ex: Somme du CA en FCFA, Nombre de factures).\n"
                    "- **Filtres / Segments** : Les boutons tactiles pour filtrer en direct.\n\n"
                    "## 2. Défi pratique : Matrice des ventes régionales\n"
                    "Construisez le tableau croisé dynamique consolidant les ventes de Douala, Yaoundé et Bafoussam."
                ),
                'code_snippet': "=SOMME([CA_FCFA])",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # C1 — MODULE 6: Visualisation des données & Dashboard Niveau 1
        # -------------------------------------------------------------
        c1_m6, _ = Module.objects.update_or_create(
            course=c1,
            order=6,
            defaults={
                'title': "Module 6 : Visualisation & Tableau de bord simple",
                'description': "Graphiques croisés dynamiques, KPI cards, mise en page épurée et tableau de bord commercial final.",
                'is_published': True,
            },
        )

        c1_l6_1, _ = Lesson.objects.update_or_create(
            module=c1_m6,
            slug='dashboard-commercial-synthese-douala',
            defaults={
                'title': "Concevoir votre premier Tableau de Bord Commercial interactif",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 22,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c1_l6_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Concevoir votre premier Tableau de Bord Commercial interactif",
                'summary': "Projet de clôture Niveau 1 : un dashboard exécutif complet avec KPI cards et segments connectés.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/KPI2.mp4",
                'content': (
                    "# Projet de fin de niveau : Dashboard Commercial Executif\n\n"
                    "## 1. Mini-cours : Les règles d'or du dashboarding professionnel\n"
                    "Un bon tableau de bord doit être lisible en moins de 10 secondes par la direction générale :\n\n"
                    "1. **3 à 4 KPI cards majeurs en haut** : CA Total (FCFA), Volume vendu, Panier moyen, Taux de recouvrement.\n"
                    "2. **Graphiques croisés connectés** : Évolution mensuelle et répartition par agence.\n"
                    "3. **Segments interactifs partagés** : Un clic sur 'Akwa' met à jour tous les graphiques simultanément.\n\n"
                    "## 2. Cas d'entreprise final : Distribution Kamer SARL\n"
                    "Présentez la synthèse commerciale annuelle consolidée pour le comité de direction."
                ),
                'code_snippet': "=SOMME.SI.ENS(Ventes[CA_FCFA]; Ventes[Ville]; \"Douala\")",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )


        # =============================================================
        # 2. NIVEAU 2 — AVANCÉ : AUTOMATISER, MODÉLISER (YITA COLONNE 2)
        # =============================================================
        c2, _ = Course.objects.update_or_create(
            slug='excel-avance-powerquery',
            defaults={
                'track': track,
                'title': "Excel — Niveau 2 : Automatisation Power Query & Modélisation",
                'subtitle': "Automatiser, modéliser et analyser en profondeur avec Power Query & Power Pivot.",
                'description': (
                    "Passez au niveau supérieur : automatisez les nettoyages récurrents avec Power Query, "
                    "maîtrisez les formules matricielles dynamiques (FILTRE, UNIQUE) et créez des modèles de données relationnels avec Power Pivot."
                ),
                'level': Course.Level.INTERMEDIATE,
                'price_tier': Course.PriceTier.ESSENTIAL,
                'duration_hours': 16,
                'is_published': True,
                'order': 2,
            },
        )

        # C2 — MODULE 1: Power Query
        c2_m1, _ = Module.objects.update_or_create(
            course=c2,
            order=1,
            defaults={
                'title': "Module 1 : Power Query – Nettoyage et transformation",
                'description': "Nettoyage automatique, dépivotage de colonnes, fusion de fichiers mensuels et requêtes dynamiques.",
                'is_published': True,
            },
        )
        c2_l1_1, _ = Lesson.objects.update_or_create(
            module=c2_m1,
            slug='decouverte-power-query-automatisation',
            defaults={
                'title': "Automatiser le traitement des fichiers de vente avec Power Query",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 18,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c2_l1_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Automatiser le traitement des fichiers de vente avec Power Query",
                'summary': "Ne nettoyez plus jamais vos fichiers manuellement chaque mois : programmez le flux ETL une seule fois.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/creance%204.mp4",
                'content': (
                    "# L'automatisation des transformations avec Power Query\n\n"
                    "## 1. Mini-cours : Pourquoi Power Query change tout\n"
                    "Power Query enregistre chacune de vos étapes de nettoyage (suppression de colonnes, filtrage, conversion de types). "
                    "Le mois suivant, vous collez le nouveau fichier et cliquez sur **Actualiser** : tout se recalcule automatiquement !\n\n"
                    "## 2. Exemple d'entreprise : Consolidation de 12 fichiers de caisse\n"
                    "Fusionnez les classeurs mensuels des boutiques de Bonabéri, Yaoundé et Bafoussam sans aucun copier-coller manuel."
                ),
                'code_snippet': "= Table.TransformColumnTypes(Source, {{\"CA_FCFA\", type number}})",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C2 — MODULE 2: Fonctions dynamiques modernes
        c2_m2, _ = Module.objects.update_or_create(
            course=c2,
            order=2,
            defaults={
                'title': "Module 2 : Fonctions dynamiques matricielles",
                'description': "FILTRE, UNIQUE, TRIER, SEQUENCE, LET, LAMBDA et propagation dynamique des résultats.",
                'is_published': True,
            },
        )
        c2_l2_1, _ = Lesson.objects.update_or_create(
            module=c2_m2,
            slug='fonctions-dynamiques-filtre-unique-trier',
            defaults={
                'title': "Formules matricielles modernes : FILTRE, UNIQUE et TRIER",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 15,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c2_l2_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Formules matricielles modernes : FILTRE, UNIQUE et TRIER",
                'summary': "Extraire automatiquement des listes sans doublons et filtrer des tableaux en temps réel.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/creance%205.mp4",
                'content': (
                    "# La puissance des fonctions matricielles dynamiques\n\n"
                    "## 1. Mini-cours : Extraire sans VBA ni macro\n"
                    "- `=UNIQUE(Ventes[Client])` renvoie instantanément la liste des clients distincts.\n"
                    "- `=FILTRE(Ventes; Ventes[Ville]=\"Douala\")` extrait toutes les lignes correspondant au critère.\n"
                    "- `=TRIER(UNIQUE(Ventes[Article]))` produit une liste alphabétique nettoyée prête à l'emploi.\n\n"
                    "## 2. Défi pratique : Générer le palmarès des meilleurs revendeurs\n"
                    "Extrayez les 10 plus gros clients de la région Centre avec une formule dynamique unique."
                ),
                'code_snippet': "=TRIER(FILTRE(t_Ventes; t_Ventes[CA]>1000000); 2; -1)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C2 — MODULE 3: TCD avancés
        c2_m3, _ = Module.objects.update_or_create(
            course=c2,
            order=3,
            defaults={
                'title': "Module 3 : Tableaux Croisés Dynamiques avancés",
                'description': "Champs et éléments calculés, regroupements personnalisés, analyses multidimensionnelles.",
                'is_published': True,
            },
        )
        c2_l3_1, _ = Lesson.objects.update_or_create(
            module=c2_m3,
            slug='tcd-avances-champs-calcules-et-ensembles',
            defaults={
                'title': "Champs calculés et ratios d'analyse financière dans les TCD",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 16,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c2_l3_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Champs calculés et ratios d'analyse financière dans les TCD",
                'summary': "Calculer des marges nettes et des pourcentages de contribution directement dans le TCD.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo3_listed.mp4",
                'content': (
                    "# Ratios et calculs avancés dans les TCD\n\n"
                    "## 1. Mini-cours : Les champs calculés\n"
                    "Créez des formules virtuelles (ex: `=(CA_HT - Cout_Revient) / CA_HT`) qui s'ajustent automatiquement selon le niveau d'agrégation.\n\n"
                    "## 2. Exemple concret : Marge brute commerciale par marque\n"
                    "Identifiez immédiatement les familles de produits générant 80% de la rentabilité."
                ),
                'code_snippet': "='Montant_HT' * (1 - 'Taux_Remise')",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C2 — MODULE 4: Modélisation de données
        c2_m4, _ = Module.objects.update_or_create(
            course=c2,
            order=4,
            defaults={
                'title': "Module 4 : Modélisation de données relationnelles",
                'description': "Relations entre tables (1 à plusieurs), table de faits (ventes) vs tables de dimensions (clients, articles).",
                'is_published': True,
            },
        )
        c2_l4_1, _ = Lesson.objects.update_or_create(
            module=c2_m4,
            slug='relations-tables-faits-et-dimensions',
            defaults={
                'title': "Construire un modèle en étoile (Star Schema) dans Excel",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 17,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c2_l4_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Construire un modèle en étoile (Star Schema) dans Excel",
                'summary': "Relier 4 tables distinctes sans aucune formule RECHERCHEV grâce au modèle de données.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo4.mp4",
                'content': (
                    "# Adieu RECHERCHEV : La modélisation relationnelle\n\n"
                    "## 1. Mini-cours : Pourquoi un modèle de données ?\n"
                    "Au lieu d'alourdir votre fichier avec des milliers de formules `RECHERCHEX`, vous établissez une **relation** "
                    "entre votre table de transactions et vos tables référentielles (Articles, Commerciaux, Villes).\n\n"
                    "## 2. Architecture en étoile\n"
                    "- Table centrale de faits : `f_Ventes`\n"
                    "- Tables de dimensions : `d_Clients`, `d_Produits`, `d_Calendrier`"
                ),
                'code_snippet': "Relation 1-N : d_Clients[ID_Client] -> f_Ventes[ID_Client]",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C2 — MODULE 5: Power Pivot
        c2_m5, _ = Module.objects.update_or_create(
            course=c2,
            order=5,
            defaults={
                'title': "Module 5 : Power Pivot – Modèle de données & Mesures",
                'description': "Gestion de millions de lignes, création de relations complexes et premières mesures DAX.",
                'is_published': True,
            },
        )
        c2_l5_1, _ = Lesson.objects.update_or_create(
            module=c2_m5,
            slug='power-pivot-gestion-gros-volumes',
            defaults={
                'title': "Importer et modéliser 500 000 lignes avec Power Pivot",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 19,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c2_l5_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Importer et modéliser 500 000 lignes avec Power Pivot",
                'summary': "Dépasser la limite du million de lignes d'Excel avec le moteur VertiPaq en mémoire.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/EXO5.mp4",
                'content': (
                    "# Power Pivot : Le moteur BI interne d'Excel\n\n"
                    "## 1. Mini-cours : Le moteur colonnaire VertiPaq\n"
                    "Power Pivot compresse vos données de manière spectaculaire (jusqu'à 10x) et permet d'analyser des millions de lignes avec une fluidité absolue sur votre machine.\n\n"
                    "## 2. Défi pratique : Consolidation nationale annuelle\n"
                    "Importez les données de ventes de 5 régions et créez vos premières mesures de synthèse."
                ),
                'code_snippet': "Total_CA_FCFA := SUM(f_Ventes[Montant_FCFA])",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C2 — MODULE 6: DAX (bases et pratique) & Dashboard
        c2_m6, _ = Module.objects.update_or_create(
            course=c2,
            order=6,
            defaults={
                'title': "Module 6 : DAX (bases et pratique) & Dashboard de Niveau 2",
                'description': "Mesures simples, contextes de filtre, CALCULATE et conception du dashboard analytique.",
                'is_published': True,
            },
        )
        c2_l6_1, _ = Lesson.objects.update_or_create(
            module=c2_m6,
            slug='dax-calculate-et-dashboard-niveau-2',
            defaults={
                'title': "Introduction au DAX (CALCULATE) et Dashboard de Niveau 2",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 24,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c2_l6_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Introduction au DAX (CALCULATE) et Dashboard de Niveau 2",
                'summary': "Construire un tableau de bord analytique haute performance alimenté par des mesures DAX.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo6.mp4",
                'content': (
                    "# Le langage DAX et le dashboard analytique\n\n"
                    "## 1. Mini-cours : La fonction reine CALCULATE\n"
                    "`CALCULATE` permet de modifier le contexte de filtre dynamique :\n"
                    "- `CA_Douala := CALCULATE([Total_CA]; d_Villes[Ville] = \"Douala\")`\n"
                    "- Calculer le % de contribution de chaque région au CA global.\n\n"
                    "## 2. Projet final Niveau 2 : Dashboard Power Pivot & DAX\n"
                    "Concevez le tableau de bord décisionnel automatisé avec filtres croisés et indicateurs de marge brute."
                ),
                'code_snippet': "CA_Akwa := CALCULATE([Total_CA]; d_Boutiques[Secteur] = \"Akwa\")",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )


        # =============================================================
        # 3. NIVEAU 3 — EXPERT : DAX AVANCÉ & POWER BI (YITA COLONNE 3)
        # =============================================================
        c3, _ = Course.objects.update_or_create(
            slug='excel-expert-dax-dashboards',
            defaults={
                'track': track,
                'title': "Excel — Niveau 3 : DAX Avancé, Power Pivot & Dashboards Métier",
                'subtitle': "Construis des analyses métier et des dashboards percutants de niveau consultant.",
                'description': (
                    "Le palier d'expertise : maîtrisez les contextes d'évaluation DAX, les fonctions de Time Intelligence, "
                    "les analyses Pareto/cohortes, l'optimisation des performances et la transition naturelle vers Power BI."
                ),
                'level': Course.Level.ADVANCED,
                'price_tier': Course.PriceTier.PRO,
                'duration_hours': 20,
                'is_published': True,
                'order': 3,
            },
        )

        # C3 — MODULE 1: DAX avancé
        c3_m1, _ = Module.objects.update_or_create(
            course=c3,
            order=1,
            defaults={
                'title': "Module 1 : DAX avancé – Contextes et CALCULATE complexe",
                'description': "Contexte de filtre vs contexte de ligne, transition de contexte, SUMX, CALCULATETABLE et variables (VAR).",
                'is_published': True,
            },
        )
        c3_l1_1, _ = Lesson.objects.update_or_create(
            module=c3_m1,
            slug='dax-avance-contextes-evaluation-et-sumx',
            defaults={
                'title': "Maîtriser les contextes d'évaluation et les fonctions itératives (SUMX)",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 22,
                'is_free_preview': True,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c3_l1_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Maîtriser les contextes d'évaluation et les fonctions itératives (SUMX)",
                'summary': "Comprendre en profondeur comment DAX calcule ligne à ligne et filtre les tables.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo7.mp4",
                'content': (
                    "# Les secrets des contextes d'évaluation en DAX\n\n"
                    "## 1. Mini-cours : Contexte de filtre vs Contexte de ligne\n"
                    "L'incompréhension des contextes est la cause de 95% des erreurs en DAX. "
                    "Nous décortiquons pas à pas la transition de contexte déclenchée par `CALCULATE` et l'usage des itérateurs comme `SUMX` et `AVERAGEX`.\n\n"
                    "## 2. Exemple concret : Valorisation de stock au coût unitaire moyen pondéré (CUMP)\n"
                    "Rapprochement complexe des flux de marchandises en entrepôt à Bassa."
                ),
                'code_snippet': "CA_Total := SUMX(f_Ventes; f_Ventes[Quantite] * RELATED(d_Articles[Prix_FCFA]))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C3 — MODULE 2: Analyse de données avancée
        c3_m2, _ = Module.objects.update_or_create(
            course=c3,
            order=2,
            defaults={
                'title': "Module 2 : Analyse métier avancée – Pareto & Cohortes",
                'description': "Analyse 80/20 (Pareto/ABC), segmentation RFM des clients, analyse d'écarts et scénarios What-If.",
                'is_published': True,
            },
        )
        c3_l2_1, _ = Lesson.objects.update_or_create(
            module=c3_m2,
            slug='analyse-pareto-abc-et-cohortes',
            defaults={
                'title': "Analyse Pareto (ABC) dynamique et segmentation clientèle",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 20,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c3_l2_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Analyse Pareto (ABC) dynamique et segmentation clientèle",
                'summary': "Segmenter automatiquement les clients Classe A (80% du CA), Classe B (15%) et Classe C (5%).",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo8.mp4",
                'content': (
                    "# Analyse Pareto (ABC) et segmentation clientèle\n\n"
                    "## 1. Mini-cours : La loi des 80/20 en entreprise\n"
                    "Apprenez à construire une mesure DAX cumulative pour classer dynamiquement vos clients selon leur contribution réelle au chiffre d'affaires.\n\n"
                    "## 2. Cas d'application : Les grands comptes de Douala et Yaoundé\n"
                    "Identifier les 20 clients stratégiques à choyer en priorité commerciale."
                ),
                'code_snippet': "Cumul_CA := CALCULATE([Total_CA]; FILTER(ALL(d_Clients); [Total_CA] >= EARLIER([Total_CA])))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C3 — MODULE 3: Time Intelligence
        c3_m3, _ = Module.objects.update_or_create(
            course=c3,
            order=3,
            defaults={
                'title': "Module 3 : Time Intelligence – Analyses temporelles DAX",
                'description': "DATESYTD, SAMEPERIODLASTYEAR, DATEADD, comparaison N vs N-1 et moyennes mobiles.",
                'is_published': True,
            },
        )
        c3_l3_1, _ = Lesson.objects.update_or_create(
            module=c3_m3,
            slug='time-intelligence-comparaisons-annuelles',
            defaults={
                'title': "Comparaisons annuelles N vs N-1 et cumuls Year-To-Date (YTD)",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 21,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c3_l3_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Comparaisons annuelles N vs N-1 et cumuls Year-To-Date (YTD)",
                'summary': "Analyser la croissance réelle d'une entreprise mois par mois par rapport à l'exercice précédent.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo9.mp4",
                'content': (
                    "# Time Intelligence en DAX\n\n"
                    "## 1. Mini-cours : La table calendrier impérative\n"
                    "Pour utiliser les fonctions temporelles, une table calendrier continue est obligatoire :\n\n"
                    "- `CA_YTD := TOTALYTD([Total_CA]; d_Calendrier[Date])`\n"
                    "- `CA_N_Moins_1 := CALCULATE([Total_CA]; SAMEPERIODLASTYEAR(d_Calendrier[Date]))`\n"
                    "- `Croissance_% := DIVIDE([Total_CA] - [CA_N_Moins_1]; [CA_N_Moins_1])`"
                ),
                'code_snippet': "CA_N_Moins_1 := CALCULATE([Total_CA]; SAMEPERIODLASTYEAR(d_Calendrier[Date]))",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C3 — MODULE 4: Data Quality & Traitement avancé
        c3_m4, _ = Module.objects.update_or_create(
            course=c3,
            order=4,
            defaults={
                'title': "Module 4 : Qualité des données & Optimisation",
                'description': "Détection et correction des anomalies, imputation des données manquantes, réduction du poids des classeurs.",
                'is_published': True,
            },
        )
        c3_l4_1, _ = Lesson.objects.update_or_create(
            module=c3_m4,
            slug='data-quality-et-optimisation-performances',
            defaults={
                'title': "Audit de qualité des données et optimisation des fichiers lourds",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 18,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c3_l4_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Audit de qualité des données et optimisation des fichiers lourds",
                'summary': "Réduire un classeur de 150 Mo à 12 Mo et éliminer les anomalies de saisie.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo10.mp4",
                'content': (
                    "# Data Quality et performances\n\n"
                    "## 1. Mini-cours : Éliminer la cardinalité excessive\n"
                    "Diviser les colonnes date/heure, supprimer les colonnes d'identifiants inutiles dans la table de faits et optimiser les types numériques.\n\n"
                    "## 2. Détection automatique des valeurs aberrantes\n"
                    "Mettre en place des règles DAX et Power Query pour isoler les prix unitaires négatifs ou anormaux."
                ),
                'code_snippet': "= Table.SelectRows(Source, each [Montant_FCFA] > 0)",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C3 — MODULE 5: Automatisation & Intégration
        c3_m5, _ = Module.objects.update_or_create(
            course=c3,
            order=5,
            defaults={
                'title': "Module 5 : Automatisation & Connexions multiples",
                'description': "Connexion aux bases SQL, fichiers CSV/Web, rafraîchissement planifié et macros d'orchestration.",
                'is_published': True,
            },
        )
        c3_l5_1, _ = Lesson.objects.update_or_create(
            module=c3_m5,
            slug='connexions-multiples-sql-et-automatisation',
            defaults={
                'title': "Connexions multi-sources (PostgreSQL, ERP, Web) et automatisation",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 20,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c3_l5_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Connexions multi-sources (PostgreSQL, ERP, Web) et automatisation",
                'summary': "Relier votre modèle directement aux bases de production et automatiser la chaîne analytique.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo11.mp4",
                'content': (
                    "# Connexions multi-sources en entreprise\n\n"
                    "## 1. Mini-cours : Se connecter sans exporter à la main\n"
                    "Comment connecter Power Query directement aux bases SQL d'un progiciel de gestion (ERP/CRM) pour éviter les exports manuels quotidiens.\n\n"
                    "## 2. Cas d'intégration : Chaîne de magasins nationale\n"
                    "Synchronisation en direct des bilans de caisse de 10 points de vente."
                ),
                'code_snippet': "= PostgreSQL.Database(\"server_db_ip:5432\", \"datamboa_erp\")",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # C3 — MODULE 6: Dashboard décisionnel exécutif final
        c3_m6, _ = Module.objects.update_or_create(
            course=c3,
            order=6,
            defaults={
                'title': "Module 6 : Dashboard décisionnel & Data Storytelling",
                'description': "Design exécutif, storytelling, navigation interactive, publication et préparation à Power BI Service.",
                'is_published': True,
            },
        )
        c3_l6_1, _ = Lesson.objects.update_or_create(
            module=c3_m6,
            slug='grand-dashboard-decisionnel-executif',
            defaults={
                'title': "Projet d'Excellence : Grand Dashboard Décisionnel de Direction",
                'lesson_type': Lesson.LessonType.VIDEO,
                'duration_minutes': 28,
                'is_free_preview': False,
                'order': 1,
                'is_published': True,
            },
        )
        LessonTranslation.objects.update_or_create(
            lesson=c3_l6_1,
            language=LessonTranslation.Language.FR,
            defaults={
                'title': "Projet d'Excellence : Grand Dashboard Décisionnel de Direction",
                'summary': "Le grand projet de certification : un tableau de bord décisionnel de niveau consultant international.",
                'video_url': "http://localhost:8000/api/v1/courses/videos/exo12.mp4",
                'content': (
                    "# Projet d'Excellence : Le Dashboard de Direction Générale\n\n"
                    "## 1. Cahier des charges du projet\n"
                    "Vous êtes recruté comme Data Analyst Senior pour Distribution Kamer SARL. Votre mission :\n\n"
                    "- Modéliser 3 années de transactions multi-produits.\n"
                    "- Concevoir un dashboard interactif à 3 écrans (Synthèse Exécutive, Performance Commerciale, Risque Client & Trésorerie).\n"
                    "- Intégrer les calculs Time Intelligence N vs N-1 en FCFA.\n"
                    "- Préparer l'export et la transition vers Power BI Service.\n\n"
                    "## 2. Évaluation finale\n"
                    "Soumettez votre classeur pour l'obtention de la certification DataMboa Analyst."
                ),
                'code_snippet': "Performance_Index := DIVIDE([Total_CA]; [Objectif_Budget])",
                'status': LessonTranslation.Status.REVIEWED,
            },
        )

        # -------------------------------------------------------------
        # RESSOURCES & DATASETS TÉLÉCHARGEABLES (F1.6)
        # -------------------------------------------------------------
        LessonAttachment.objects.update_or_create(
            lesson=c1_l1_1,
            title="Tableau d'exercice — Découverte des types (Douala)",
            defaults={
                'description': "Fichier Excel vierge à compléter pas à pas pendant la leçon.",
                'attachment_type': LessonAttachment.AttachmentType.STARTER,
                'file_format': 'xlsx',
                'file_size_bytes': 128500,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/datasets/douala_types_starter.xlsx',
                'is_free_preview': True,
                'order': 1,
            },
        )
        LessonAttachment.objects.update_or_create(
            lesson=c1_l1_1,
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
            lesson=c1_l1_2,
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
            lesson=c1_l1_2,
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
            lesson=c1_l2_1,
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
            lesson=c1_l2_1,
            title="Corrigé complet — Ventes boutiques Douala (Solution)",
            defaults={
                'description': "Feuille de calcul finale avec les colonnes calculées SUPPRESPACE et RECHERCHEX.",
                'attachment_type': LessonAttachment.AttachmentType.SOLUTION,
                'file_format': 'xlsx',
                'file_size_bytes': 142000,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/solutions/ventes_douala_solution.xlsx',
                'is_free_preview': True,
                'order': 2,
            },
        )
        LessonAttachment.objects.update_or_create(
            lesson=c1_l6_1,
            title="Template_Dashboard_Commercial_Niveau1.xlsx",
            defaults={
                'description': "Maquette de tableau de bord pré-agencée avec KPI cards et conteneurs graphiques.",
                'attachment_type': LessonAttachment.AttachmentType.STARTER,
                'file_format': 'xlsx',
                'file_size_bytes': 210000,
                'external_url': 'https://raw.githubusercontent.com/datamboa/lms-assets/main/templates/Template_Dashboard_Niveau1.xlsx',
                'is_free_preview': True,
                'order': 1,
            },
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded all 3 Excel courses aligned with the YITA Data Analyst Roadmap!"))
