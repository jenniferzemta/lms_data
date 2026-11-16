from django.core.management.base import BaseCommand
from courses.models import Mission

class Command(BaseCommand):
    help = 'Seeds realistic African enterprise case study missions (F2.7, Critère R11)'

    def handle(self, *args, **options):
        missions_data = [
            {
                'title': 'Mission 1 : Audit du Risque de Crédit & Analyse des Impayés',
                'slug': 'audit-risque-credit-bafoussam',
                'company_name': 'Express Microfinance du Cameroun',
                'sector': 'Microfinance & Inclusion Financière',
                'location': 'Bafoussam, Région de l\'Ouest, Cameroun',
                'difficulty': Mission.Difficulty.INTERMEDIATE,
                'estimated_duration_minutes': 90,
                'currency': 'FCFA',
                'context_brief': (
                    'Fondée en 2014 à Bafoussam, Express Microfinance accompagne plus de 8 500 commerçants, '
                    'agriculteurs et artisans des marchés des Hauts-Plateaux de l\'Ouest. '
                    'Depuis six mois, le Comité de Direction s\'alarme d\'une dégradation anormale du taux de remboursement '
                    'sur les lignes de crédit de court terme (crédits de campagne et crédits de trésorerie flash). '
                    'Le Directeur Général vous mandate comme consultant Data Analyst pour auditer le portefeuille de crédits, '
                    'calculer l\'indicateur PAR 30 (Portfolio at Risk à 30 jours), et identifier précisément les poches de risque.'
                ),
                'business_problem': (
                    'Le taux d\'impayés global dépasse le seuil prudentiel COBAC de 5%. La direction ne sait pas si la '
                    'défaillance provient d\'une agence spécifique (Bafoussam Marché A vs Dschang), d\'un secteur d\'activité '
                    '(vivres frais, quincaillerie, textile) ou de la taille du prêt accordé sans garantie matérielle.'
                ),
                'tasks': [
                    'Nettoyer et valider l\'intégrité du fichier de 500 crédits accordés en 2025/2026.',
                    'Calculer le montant total des encours sains, en retard (1-30j), et en souffrance (>30j).',
                    'Calculer le ratio prudentiel PAR 30 : (Encours des crédits en retard > 30 jours) / (Encours Total).',
                    'Croiser le taux d\'impayé par agence, par secteur d\'activité et par tranche de montant.',
                    'Rédiger une note exécutive de 1 page avec 3 mesures correctives immédiates.'
                ],
                'deliverables': [
                    '1. Requête SQL ou script Pandas documenté réalisant l\'extraction et l\'agrégation.',
                    '2. Fiche de synthèse chiffrée avec graphiques de répartition du risque par agence.',
                    '3. Note de recommandations stratégiques (arbitrage des plafonds, révision du scoring).'
                ],
                'dataset_description': 'Fichier CSV de 500 dossiers de crédits (ID, Client, Agence, Montant accordé en FCFA, Taux, Date octroi, Jours de retard, Secteur, Garantie).',
                'dataset_sample': [
                    {'id_credit': 'CR-2026-001', 'client': 'FOTSO & FILS', 'agence': 'Bafoussam Marché A', 'montant_fcfa': 2500000, 'retard_jours': 42, 'secteur': 'Vivres Frais', 'statut': 'PAR 30'},
                    {'id_credit': 'CR-2026-002', 'client': 'MAMPOUO Jeanne', 'agence': 'Dschang Centre', 'montant_fcfa': 800000, 'retard_jours': 0, 'secteur': 'Textile', 'statut': 'Sain'},
                    {'id_credit': 'CR-2026-003', 'client': 'TALLA Quincaillerie', 'agence': 'Bafoussam Ville', 'montant_fcfa': 5000000, 'retard_jours': 15, 'secteur': 'Quincaillerie', 'statut': 'Retard 1-30j'},
                    {'id_credit': 'CR-2026-004', 'client': 'KAMGA Maraîcher', 'agence': 'Bafoussam Marché A', 'montant_fcfa': 1200000, 'retard_jours': 65, 'secteur': 'Vivres Frais', 'statut': 'PAR 30'},
                    {'id_credit': 'CR-2026-005', 'client': 'NDI Coiffure Pro', 'agence': 'Dschang Centre', 'montant_fcfa': 450000, 'retard_jours': 0, 'secteur': 'Services', 'statut': 'Sain'}
                ],
                'dataset_download_url': '/data/missions/express_microfinance_credits_2026.csv',
                'evaluation_rubric': [
                    {
                        'id': 'r1',
                        'label': 'Calcul exact du ratio prudentiel PAR 30',
                        'description': 'L\'encours total PAR 30 a été identifié (74 250 000 FCFA sur 500 000 000 FCFA d\'encours, soit un ratio PAR 30 de 14,85%).',
                        'points': 25
                    },
                    {
                        'id': 'r2',
                        'label': 'Identification précise des poches de risque',
                        'description': 'L\'analyse met en évidence que l\'agence de Bafoussam Marché A concentre 62% des retards, principalement sur le secteur Vivres Frais.',
                        'points': 25
                    },
                    {
                        'id': 'r3',
                        'label': 'Mesure de l\'impact financier sur les provisions',
                        'description': 'Calcul du montant des provisions obligatoires à passer au compte de résultat selon la réglementation COBAC.',
                        'points': 25
                    },
                    {
                        'id': 'r4',
                        'label': 'Recommandations managériales réalistes et actionnables',
                        'description': 'Propositions pragmatiques adaptées au terrain africain : rééchelonnement avec caution solidaire de groupe, plafonnement à 1 500 000 FCFA pour le secteur vivres frais pendant la saison pluvieuse.',
                        'points': 25
                    }
                ],
                'model_solution_summary': (
                    '### Diagnostic & Corrigé de Référence (Mission 1)\n\n'
                    '**1. Chiffres clés du portefeuille :**\n'
                    '- Encours total sain : 405 750 000 FCFA (81,15%)\n'
                    '- Encours en vigilance (retard 1 à 30 jours) : 20 000 000 FCFA (4,00%)\n'
                    '- Encours en souffrance (PAR 30) : 74 250 000 FCFA (14,85%)\n'
                    '- *Alerte réglementaire :* Le seuil COBAC de 5% est largement dépassé (presque le triple).\n\n'
                    '**2. Décomposition de la vulnérabilité :**\n'
                    '- L\'agence **Bafoussam Marché A** présente un PAR 30 de 22,4%, contre seulement 3,8% à **Dschang Centre**.\n'
                    '- Le secteur **Vivres Frais** représente 68% des défauts, en raison des pertes post-récolte et de l\'absence de chambre froide chez les revendeuses.\n\n'
                    '**3. Plan d\'action recommandé au Directeur Général :**\n'
                    '1. Suspendre immédiatement les déblocages non sécurisés > 1 000 000 FCFA sur l\'agence Bafoussam Marché A.\n'
                    '2. Mettre en place un recouvrement amiable avec étalement hebdomadaire collecté via Mobile Money (Orange/MTN) plutôt qu\'en fin de mois.\n'
                    '3. Exiger pour tout crédit maraîcher une caution solidaire d\'une tontine reconnue du marché.'
                ),
                'is_published': True,
                'order': 1
            },
            {
                'title': 'Mission 2 : Optimisation des Ruptures de Stock & Logistique Boissons',
                'slug': 'optimisation-stock-distributeur-douala',
                'company_name': 'Kamer Boissons & Logistique SARL',
                'sector': 'Distribution FMCG & Logistique',
                'location': 'Douala (Dépôts Bonabéri & Bassa), Cameroun',
                'difficulty': Mission.Difficulty.ADVANCED,
                'estimated_duration_minutes': 120,
                'currency': 'FCFA',
                'context_brief': (
                    'Kamer Boissons approvisionne plus de 1 200 débits de boisson, snacks et supermarchés du Grand Douala. '
                    'Durant les week-ends et les périodes de canicule, le dépôt de Bonabéri subit des ruptures chroniques '
                    'sur les bières blondes 65cl et les casiers de jus gazeux, alors que le dépôt de Bassa reste surstocké. '
                    'Ces déséquilibres occasionnent un manque à gagner estimé à 14 500 000 FCFA par mois et des surcoûts d\'urgence.'
                ),
                'business_problem': (
                    'Le responsable logistique utilise des commandes intuitives sans calcul du stock de sécurité ni prise en compte '
                    'des délais de réassort des brasseries (4 jours ouvrés). La direction souhaite automatiser le réassort '
                    'et mettre en place un modèle prédictif des besoins hebdomadaires.'
                ),
                'tasks': [
                    'Analyser l\'historique des sorties journalières et des ruptures sur les 6 derniers mois.',
                    'Calculer la demande moyenne journalière et l\'écart-type des ventes pour chaque format.',
                    'Déterminer le stock de sécurité avec un niveau de service cible de 95%.',
                    'Calculer le point de commande optimal : (Vente moyenne journalière * Délai) + Stock de sécurité.',
                    'Concevoir une alerte visuelle automatique (Tableau de bord) des références en zone critique.'
                ],
                'deliverables': [
                    '1. Modèle de calcul des stocks de sécurité et points de commande sous Excel ou Pandas.',
                    '2. Tableau de bord interactif avec alertes visuelles (Vert: Confortable, Jaune: Réappro, Rouge: Rupture imminente).',
                    '3. Note de cadrage logistique sur la mutualisation des stocks entre les dépôts de Bonabéri et Bassa.'
                ],
                'dataset_description': 'Fichier de 1 800 mouvements d\'entrepôt (Date, Dépôt, Référence article, Stock début, Entrées, Ventes jour, Stock fin, Rupture O/N).',
                'dataset_sample': [
                    {'date': '2026-03-01', 'depot': 'Bonabéri', 'article': 'Bière Blonde 65cl (Casier 12)', 'stock_debut': 450, 'ventes': 380, 'stock_fin': 70, 'rupture': 'NON'},
                    {'date': '2026-03-02', 'depot': 'Bonabéri', 'article': 'Bière Blonde 65cl (Casier 12)', 'stock_debut': 70, 'ventes': 120, 'stock_fin': 0, 'rupture': 'OUI'},
                    {'date': '2026-03-01', 'depot': 'Bassa', 'article': 'Bière Blonde 65cl (Casier 12)', 'stock_debut': 1850, 'ventes': 410, 'stock_fin': 1440, 'rupture': 'NON'},
                    {'date': '2026-03-01', 'depot': 'Bonabéri', 'article': 'Jus Gazeux Orange 33cl (Casier 24)', 'stock_debut': 220, 'ventes': 180, 'stock_fin': 40, 'rupture': 'NON'}
                ],
                'dataset_download_url': '/data/missions/kamer_boissons_stocks_2026.csv',
                'evaluation_rubric': [
                    {
                        'id': 'r1',
                        'label': 'Calcul rigoureux du stock de sécurité (Service 95%)',
                        'description': 'Application correcte de la formule probabiliste prenant en compte la variabilité de la demande et le délai d\'approvisionnement de 4 jours.',
                        'points': 25
                    },
                    {
                        'id': 'r2',
                        'label': 'Établissement des points de commande par référence',
                        'description': 'Seuils de déclenchement calculés et justifiés pour chaque dépôt (Bonabéri vs Bassa).',
                        'points': 25
                    },
                    {
                        'id': 'r3',
                        'label': 'Chiffrage des économies potentielles en FCFA',
                        'description': 'Évaluation des gains financiers liés à la diminution des ruptures et à la baisse du surstock de Bassa.',
                        'points': 25
                    },
                    {
                        'id': 'r4',
                        'label': 'Stratégie de navette inter-dépôts',
                        'description': 'Proposition d\'une navette de rééquilibrage hebdomadaire Bassa -> Bonabéri via la voie rapide pour éviter les coûts brasserie urgents.',
                        'points': 25
                    }
                ],
                'model_solution_summary': (
                    '### Diagnostic & Corrigé de Référence (Mission 2)\n\n'
                    '**1. Diagnostic logistique :**\n'
                    '- Bonabéri perd en moyenne 14,5 millions FCFA de CA mensuel faute de stock le samedi soir.\n'
                    '- Pendant ce temps, Bassa immobilise 32 millions FCFA de trésorerie en surstock dormant.\n\n'
                    '**2. Paramètres de gestion optimisés (Bière Blonde 65cl) :**\n'
                    '- Vente moyenne journalière Bonabéri : 240 casiers/jour (écart-type 65).\n'
                    '- Stock de sécurité calculé (k=1.65, délai 4j) : **215 casiers**.\n'
                    '- Point de commande : (240 * 4) + 215 = **1 175 casiers**.\n\n'
                    '**3. Recommandation logistique immédiate :**\n'
                    'Mettre en place une rotation nocturne de camions 10 tonnes reliant Bassa à Bonabéri le vendredi à 14h, '
                    'permettant d\'amortir le pic du week-end sans passer de commande d\'urgence surfacturée.'
                ),
                'is_published': True,
                'order': 2
            }
        ]

        for m_data in missions_data:
            mission, created = Mission.objects.update_or_create(
                slug=m_data['slug'],
                defaults=m_data
            )
            status_str = 'Créée' if created else 'Mise à jour'
            self.stdout.write(self.style.SUCCESS(f"Mission [{mission.slug}] : {status_str}"))

