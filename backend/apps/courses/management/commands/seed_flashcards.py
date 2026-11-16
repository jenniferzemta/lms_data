from django.core.management.base import BaseCommand
from courses.models import Flashcard

class Command(BaseCommand):
    help = 'Seeds technical memory flashcards for spaced repetition (F2.9, SM-2, R16)'

    def handle(self, *args, **options):
        cards_data = [
            # Excel
            {
                'front': 'Comment additionner des montants selon un critère précis sous Excel ?',
                'back': 'Utilisez la fonction SOMME.SI (ou SUMIF). Elle prend la plage de critères, le critère, et la plage des valeurs à additionner.',
                'code_snippet': '=SOMME.SI(C2:C100; "Gros Œuvre"; F2:F100)',
                'category': Flashcard.Category.EXCEL,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            {
                'front': 'Quelle est la syntaxe exacte de la fonction RECHERCHEV ?',
                'back': 'RECHERCHEV(valeur_cherchée; table_matrice; no_index_col; [valeur_proche]). Utilisez FAUX pour une correspondance exacte.',
                'code_snippet': '=RECHERCHEV(A2; D2:G50; 3; FAUX)',
                'category': Flashcard.Category.EXCEL,
                'difficulty': Flashcard.Difficulty.MEDIUM,
            },
            {
                'front': 'Pourquoi RECHERCHEX est-elle supérieure à RECHERCHEV ?',
                'back': 'RECHERCHEX cherche vers la gauche et vers la droite, ne casse pas si des colonnes sont insérées, et gère nativement les erreurs sans SI.NON.DISP.',
                'code_snippet': '=RECHERCHEX(A2; Table[Code]; Table[Prix]; "Non trouvé")',
                'category': Flashcard.Category.EXCEL,
                'difficulty': Flashcard.Difficulty.MEDIUM,
            },
            {
                'front': 'Quelle formule conditionnelle renvoie une remise de 5% si le montant est >= 200 000 FCFA ?',
                'back': 'La fonction SI (IF).',
                'code_snippet': '=SI(F2>=200000; 0.05; 0)',
                'category': Flashcard.Category.EXCEL,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            # SQL
            {
                'front': 'Quelle est la différence fondamentale entre WHERE et HAVING en SQL ?',
                'back': 'WHERE filtre les lignes individuelles AVANT l\'agrégation. HAVING filtre les groupes agrégés APRÈS le GROUP BY.',
                'code_snippet': 'SELECT agence, SUM(montant) FROM credits GROUP BY agence HAVING SUM(montant) > 10000000;',
                'category': Flashcard.Category.SQL,
                'difficulty': Flashcard.Difficulty.MEDIUM,
            },
            {
                'front': 'Quelle jointure conserve tous les enregistrements de la table de gauche, même sans correspondance ?',
                'back': 'Le LEFT JOIN (ou LEFT OUTER JOIN). Les colonnes de droite manquantes sont remplies de NULL.',
                'code_snippet': 'SELECT c.nom, cr.montant FROM clients c LEFT JOIN credits cr ON c.id = cr.client_id;',
                'category': Flashcard.Category.SQL,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            {
                'front': 'Comment compter le nombre unique de clients ayant contracté un crédit ?',
                'back': 'En combinant la fonction COUNT avec le mot-clé DISTINCT.',
                'code_snippet': 'SELECT COUNT(DISTINCT client_id) AS nb_emprunteurs_uniques FROM credits;',
                'category': Flashcard.Category.SQL,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            {
                'front': 'Comment trier les résultats par chiffre d\'affaires décroissant et limiter aux 5 premiers ?',
                'back': 'En utilisant ORDER BY montant DESC suivi de LIMIT 5.',
                'code_snippet': 'SELECT client, SUM(total) FROM ventes GROUP BY client ORDER BY SUM(total) DESC LIMIT 5;',
                'category': Flashcard.Category.SQL,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            # Python / Pandas
            {
                'front': 'Comment charger un fichier CSV en spécifiant le séparateur point-virgule avec Pandas ?',
                'back': 'Utilisez pd.read_csv() avec le paramètre sep=";".',
                'code_snippet': 'import pandas as pd\ndf = pd.read_csv("ventes.csv", sep=";")',
                'category': Flashcard.Category.PYTHON,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            {
                'front': 'Comment filtrer les lignes d\'un DataFrame où le montant est supérieur à 100 000 FCFA ?',
                'back': 'Par indexation booléenne vectorisée.',
                'code_snippet': 'df_filtre = df[df["montant_fcfa"] > 100000]',
                'category': Flashcard.Category.PYTHON,
                'difficulty': Flashcard.Difficulty.EASY,
            },
            {
                'front': 'Comment agréger la somme et la moyenne du chiffre d\'affaires par ville ?',
                'back': 'Avec .groupby() chaîné avec la méthode .agg().',
                'code_snippet': 'df.groupby("ville")["montant_fcfa"].agg(["sum", "mean"]).reset_index()',
                'category': Flashcard.Category.PYTHON,
                'difficulty': Flashcard.Difficulty.MEDIUM,
            },
            # Power BI & Concepts
            {
                'front': 'Quelle est la fonction DAX reine pour modifier le contexte de filtre d\'un calcul ?',
                'back': 'La fonction CALCULATE(). Elle évalue une expression dans un contexte modifié par des filtres.',
                'code_snippet': 'Ventes_Douala = CALCULATE(SUM(Ventes[Montant]), Ventes[Ville] = "Douala")',
                'category': Flashcard.Category.POWERBI,
                'difficulty': Flashcard.Difficulty.HARD,
            }
        ]

        created_count = 0
        for c_data in cards_data:
            card, created = Flashcard.objects.update_or_create(
                front=c_data['front'],
                defaults=c_data
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(f"{len(cards_data)} flashcards seedées avec succès ({created_count} créées)."))
