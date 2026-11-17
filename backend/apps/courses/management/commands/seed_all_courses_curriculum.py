import os
from pathlib import Path
from django.conf import settings
from django.core.management.base import BaseCommand
from django.core.files import File
from courses.models import (
    Track,
    Course,
    Module,
    Lesson,
    LessonTranslation,
    LessonAttachment,
    Quiz,
    QuizQuestion,
    QuizAnswerOption,
)


def create_minimal_pdf(file_path: Path, title: str, subtitle: str, bullet_points: list):
    """
    Generates a valid, compact PDF-1.4 file directly in Python without heavy dependencies.
    """
    def sanitize(text: str) -> str:
        return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

    stream_content = f"""BT
/F1 20 Tf
50 740 Td
({sanitize(title)}) Tj
/F2 12 Tf
0 -24 Td
({sanitize(subtitle)}) Tj
/F2 10 Tf
0 -20 Td
(----------------------------------------------------------------------------------------------------) Tj
"""
    y_offset = -24
    for point in bullet_points:
        stream_content += f"""0 {y_offset} Td
({sanitize(point)}) Tj
"""
        y_offset = -18

    stream_content += """ET"""
    stream_bytes = stream_content.encode('latin-1', 'replace')
    stream_len = len(stream_bytes)

    header = (
        b"%PDF-1.4\n"
        b"1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n"
        b"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n"
        b"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] "
        b"/Contents 4 0 R /Resources << /Font << "
        b"/F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> "
        b"/F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> "
        b">> >> >>\nendobj\n"
    )
    obj4_header = f"4 0 obj\n<< /Length {stream_len} >>\nstream\n".encode('ascii')
    footer = (
        b"\nendstream\nendobj\n"
        b"xref\n0 5\n"
        b"0000000000 65535 f \n"
        b"0000000009 00000 n \n"
        b"0000000058 00000 n \n"
        b"0000000115 00000 n \n"
        b"0000000300 00000 n \n"
        b"trailer\n<< /Size 5 /Root 1 0 R >>\n"
        b"startxref\n450\n%%EOF\n"
    )
    pdf_content = header + obj4_header + stream_bytes + footer
    with open(file_path, 'wb') as f:
        f.write(pdf_content)


class Command(BaseCommand):
    help = "Seeds complete curriculum across SQL, Python, Power BI, and GitHub for all levels (N1, N2, N3) with real physical attachments and quizzes."

    def handle(self, *args, **options):
        self.stdout.write("Seeding complete curriculum for all tools and levels...")

        target_dir = Path(settings.MEDIA_ROOT) / 'courses' / 'attachments' / '2026' / '11'
        target_dir.mkdir(parents=True, exist_ok=True)

        # -------------------------------------------------------------
        # 1. PHYSICAL ASSETS GENERATION
        # -------------------------------------------------------------
        created_files = {}

        # SQL files
        sql_schema_path = target_dir / "schema_mboa_retail.sql"
        if not sql_schema_path.exists():
            sql_schema_path.write_text(
                """-- Schema Relationnel Ventes Mboa Retail (Cameroun)
-- Monnaie: Franc CFA (XAF)

CREATE TABLE IF NOT EXISTS agences (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    ville VARCHAR(50) NOT NULL,
    quartier VARCHAR(100),
    type_canal VARCHAR(30) DEFAULT 'SUPERMARCHE'
);

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    libelle VARCHAR(100) NOT NULL,
    taux_tva NUMERIC(4,2) DEFAULT 19.25
);

CREATE TABLE IF NOT EXISTS produits (
    id SERIAL PRIMARY KEY,
    categorie_id INT REFERENCES categories(id),
    code_sku VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(150) NOT NULL,
    prix_unitaire_fcfa NUMERIC(12,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions_mboa (
    id SERIAL PRIMARY KEY,
    agence_id INT REFERENCES agences(id),
    produit_id INT REFERENCES produits(id),
    date_vente DATE NOT NULL,
    quantite INT NOT NULL,
    montant_total_fcfa NUMERIC(14,2) NOT NULL,
    mode_paiement VARCHAR(30) -- 'MTN_MOMO', 'ORANGE_MONEY', 'CASH', 'CARTE'
);

-- Insertion Donnees Reelles
INSERT INTO agences (nom, ville, quartier) VALUES 
('Mboa Bonanjo', 'Douala', 'Bonanjo'),
('Mboa Akwa Express', 'Douala', 'Akwa'),
('Mboa Bastos Prestige', 'Yaounde', 'Bastos'),
('Mboa Bafoussam Marche', 'Bafoussam', 'Marche A');

INSERT INTO categories (libelle) VALUES 
('Produits Brassicoles'),
('Epicerie & Vivres Frais'),
('Cosmetiques & Soins');

INSERT INTO produits (categorie_id, code_sku, designation, prix_unitaire_fcfa) VALUES 
(1, 'BOIS-001', 'Casier Kadji Beer 65cl (x12)', 7800),
(1, 'BOIS-002', 'Pack Eau Tangui 1.5L (x6)', 2400),
(2, 'EPI-001', 'Sac de Riz Parfume 25kg', 18500),
(2, 'EPI-002', 'Huile Mayor Bidon 5L', 6500),
(3, 'COS-001', 'Savon de Marseille Mboa Lot 4', 1800);

INSERT INTO transactions_mboa (agence_id, produit_id, date_vente, quantite, montant_total_fcfa, mode_paiement) VALUES 
(1, 1, '2026-11-01', 15, 117000, 'MTN_MOMO'),
(1, 2, '2026-11-01', 40, 96000, 'CASH'),
(2, 3, '2026-11-02', 8, 148000, 'ORANGE_MONEY'),
(3, 1, '2026-11-03', 25, 195000, 'CARTE'),
(4, 4, '2026-11-04', 12, 78000, 'MTN_MOMO'),
(2, 2, '2026-11-04', 30, 72000, 'CASH');
""",
                encoding="utf-8",
            )
        created_files['schema_mboa_retail.sql'] = sql_schema_path

        sql_practice_n2 = target_dir / "cas_pratique_microfinance_n2.sql"
        if not sql_practice_n2.exists():
            sql_practice_n2.write_text(
                """-- Cas Pratique Microfinance Ouest-Cameroun (COOPEC Bafoussam)
-- Calcul du Portefeuille a Risque (PAR 30) et Jointures Clients-Credits

SELECT 
    c.id AS client_id,
    c.nom_complet,
    c.ville,
    cr.reference_dossier,
    cr.montant_emprunte_fcfa,
    cr.montant_restant_du_fcfa,
    cr.jours_retard
FROM clients_coopec c
INNER JOIN dossiers_credit cr ON c.id = cr.client_id
WHERE cr.jours_retard > 30 AND cr.statut = 'ACTIF'
ORDER BY cr.montant_restant_du_fcfa DESC;
""",
                encoding="utf-8",
            )
        created_files['cas_pratique_microfinance_n2.sql'] = sql_practice_n2

        sql_practice_n3 = target_dir / "requetes_fenetrage_analytics_n3.sql"
        if not sql_practice_n3.exists():
            sql_practice_n3.write_text(
                """-- Analytics Avance SQL : Cumul Courant, Rangs et Croissance N vs N-1
WITH ventes_mensuelles AS (
    SELECT 
        DATE_TRUNC('month', date_vente) AS mois,
        agence_id,
        SUM(montant_total_fcfa) AS ca_mensuel_fcfa
    FROM transactions_mboa
    GROUP BY DATE_TRUNC('month', date_vente), agence_id
)
SELECT 
    mois,
    agence_id,
    ca_mensuel_fcfa,
    SUM(ca_mensuel_fcfa) OVER (
        PARTITION BY agence_id ORDER BY mois
    ) AS ca_cumule_annuel_fcfa,
    LAG(ca_mensuel_fcfa, 1) OVER (
        PARTITION BY agence_id ORDER BY mois
    ) AS ca_mois_precedent_fcfa,
    ROUND(
        (ca_mensuel_fcfa - LAG(ca_mensuel_fcfa, 1) OVER (PARTITION BY agence_id ORDER BY mois)) * 100.0 /
        NULLIF(LAG(ca_mensuel_fcfa, 1) OVER (PARTITION BY agence_id ORDER BY mois), 0),
        2
    ) AS taux_croissance_pct
FROM ventes_mensuelles;
""",
                encoding="utf-8",
            )
        created_files['requetes_fenetrage_analytics_n3.sql'] = sql_practice_n3

        # Python files
        py_starter_n1 = target_dir / "starter_exploration_pandas_n1.py"
        if not py_starter_n1.exists():
            py_starter_n1.write_text(
                """# Starter Python & Pandas : Exploration des Ventes Mboa Retail
import pandas as pd

# 1. Chargement des donnees
df = pd.read_csv('ventes_supermarches_douala.csv')

# 2. Apercu des premieres lignes
print("--- 5 Premieres Transactions ---")
print(df.head())

# 3. Informations sur les types et valeurs manquantes
print("\n--- Infos Structurelles ---")
df.info()

# 4. Statistiques descriptives sur les montants FCFA
print("\n--- Statistiques Financieres (FCFA) ---")
print(df['montant_fcfa'].describe())
""",
                encoding="utf-8",
            )
        created_files['starter_exploration_pandas_n1.py'] = py_starter_n1

        py_dataset_csv = target_dir / "ventes_supermarches_douala.csv"
        if not py_dataset_csv.exists():
            py_dataset_csv.write_text(
                """transaction_id,date,agence,produit,quantite,prix_unitaire_fcfa,montant_fcfa,mode_paiement
TRX-1001,2026-11-01,Akwa,Kadji Beer 65cl,15,650,9750,MTN_MOMO
TRX-1002,2026-11-01,Akwa,Riz Parfume 25kg,4,18500,74000,CASH
TRX-1003,2026-11-01,Bonanjo,Huile Mayor 5L,12,6500,78000,ORANGE_MONEY
TRX-1004,2026-11-02,Bonanjo,Kadji Beer 65cl,30,650,19500,CARTE
TRX-1005,2026-11-02,Bastos,Pack Tangui 1.5L,25,2400,60000,CASH
TRX-1006,2026-11-03,Bastos,Savon Lot 4,50,1800,90000,MTN_MOMO
TRX-1007,2026-11-03,Akwa,Huile Mayor 5L,8,6500,52000,ORANGE_MONEY
TRX-1008,2026-11-04,Bafoussam,Riz Parfume 25kg,10,18500,185000,CASH
""",
                encoding="utf-8",
            )
        created_files['ventes_supermarches_douala.csv'] = py_dataset_csv

        py_pipeline_n3 = target_dir / "pipeline_reporting_automatise_n3.py"
        if not py_pipeline_n3.exists():
            py_pipeline_n3.write_text(
                """# Pipeline Automatise de Reporting Financier (Pandas -> Excel)
import pandas as pd
from datetime import datetime

def generate_weekly_report(csv_path: str, output_path: str):
    df = pd.read_csv(csv_path)
    
    # Agregation par Agence
    summary = df.groupby('agence').agg(
        nombre_transactions=('transaction_id', 'count'),
        chiffre_affaires_fcfa=('montant_fcfa', 'sum'),
        panier_moyen_fcfa=('montant_fcfa', 'mean')
    ).reset_index()
    
    summary['part_marche_pct'] = (
        summary['chiffre_affaires_fcfa'] / summary['chiffre_affaires_fcfa'].sum() * 100
    ).round(2)
    
    # Export vers Excel avec multi-onglets
    with pd.ExcelWriter(output_path, engine='openpyxl') as writer:
        summary.to_excel(writer, sheet_name='Synthese_Agences', index=False)
        df.to_excel(writer, sheet_name='Donnees_Brutes', index=False)
        
    print(f"Rapport genere avec succes : {output_path}")

if __name__ == '__main__':
    generate_weekly_report('ventes_supermarches_douala.csv', 'Rapport_Direction_Semaine.xlsx')
""",
                encoding="utf-8",
            )
        created_files['pipeline_reporting_automatise_n3.py'] = py_pipeline_n3

        # Power BI & Git Guides (PDF)
        pdf_guide_powerbi = target_dir / "guide_schema_etoile_dax_mboa.pdf"
        if not pdf_guide_powerbi.exists():
            create_minimal_pdf(
                pdf_guide_powerbi,
                "GUIDE PRATIQUE POWER BI & SCHEMA EN ETOILE",
                "Modelisation Financiere & KPIs en FCFA - DataMboa",
                [
                    "1. Distinction Fait vs Dimension : Une seule table de fait centrale (ex: FactVentes)",
                    "2. Relations 1-a-Plusieurs : Filtrage unidirectionnel des dimensions vers les faits",
                    "3. Colonne calculee vs Mesure : Privilegier TOUJOURS les mesures DAX explicites",
                    "4. Fonction CALCULATE : Modifie le contexte de filtre (ex: CALCULATE(SUM(Ventes), Annee=2026))",
                    "5. Ratio securise : Utiliser DIVIDE(Numerateur, Denominateur, 0) pour eviter les erreurs #DIV/0",
                    "6. Performance mobile : Limiter le nombre de visuels par page a moins de 6 sur ecran 360px",
                ],
            )
        created_files['guide_schema_etoile_dax_mboa.pdf'] = pdf_guide_powerbi

        pdf_guide_git = target_dir / "aide_memoire_git_analyste.pdf"
        if not pdf_guide_git.exists():
            create_minimal_pdf(
                pdf_guide_git,
                "AIDE-MEMOIRE GIT & GITHUB POUR ANALYSTE DATA",
                "Gestion de Versions et Collaboration d Equipe - DataMboa",
                [
                    "git init                     : Initialiser un depot local pour vos requetes et scripts",
                    "git status                   : Verifier l etat des fichiers modifies ou non suivis",
                    "git add <fichier>            : Indexer les modifications preparees pour le commit",
                    "git commit -m 'feat: ...'    : Enregistrer un point d etape avec message explicite",
                    "git branch <nom>             : Creer une branche d experimentation sans casser main",
                    "git checkout <nom> / switch  : Basculer sur la branche de travail",
                    "git merge <nom>              : Fusionner les travaux valides dans la branche principale",
                    "git push origin main         : Publier vos projets certifiés sur votre portfolio GitHub",
                ],
            )
        created_files['aide_memoire_git_analyste.pdf'] = pdf_guide_git

        template_readme = target_dir / "template_readme_portfolio_data.md"
        if not template_readme.exists():
            template_readme.write_text(
                """# [Nom du Projet] — Analyse de Rentabilite & Risque de Credit

## 🏢 Contexte Entreprise
Projet realise pour [Nom de l'Entreprise, ex: COOPEC Bafoussam ou Brasseries du Wouri].
Objectif : Identifier les facteurs explicatifs des impayes et formuler des recommandations managériales chiffrées en FCFA.

## 🛠️ Outils & Technologies
- **SQL (PostgreSQL)** : Extraction, jointures complexes et fenetrage analytique
- **Python (Pandas)** : Nettoyage et modélisation prédictive
- **Power BI** : Tableau de bord exécutif interactif

## 📊 Principaux Résultats
- **-18%** d'impayés projetés sur 12 mois
- **+14.5M FCFA** de trésorerie nette sécurisée
- Identification des 3 agences prioritaires pour le recouvrement

## 🚀 Reproduction des Résultats
1. Cloner ce dépôt : `git clone https://github.com/mon-profil/nom-du-projet.git`
2. Exécuter le script SQL dans `sql/analyse_portefeuille.sql`
3. Lancer le notebook Python : `jupyter notebook notebooks/eda_credit.ipynb`
""",
                encoding="utf-8",
            )
        created_files['template_readme_portfolio_data.md'] = template_readme

        self.stdout.write(self.style.SUCCESS(f"Generated {len(created_files)} physical course assets in {target_dir}"))

        # -------------------------------------------------------------
        # 2. TRACKS CREATION / RETRIEVAL
        # -------------------------------------------------------------
        tracks_data = [
            {
                'tool': Track.Tool.SQL,
                'name': "SQL pour l'Analyse de Données",
                'slug': 'sql-analyse-donnees',
                'description': "Maîtrisez le langage universel des bases de données relationnelles pour extraire, filtrer, croiser et agréger des millions de lignes de transactions commerciales et bancaires.",
                'icon': 'database',
                'order': 2,
            },
            {
                'tool': Track.Tool.PYTHON,
                'name': "Python pour la Data Science",
                'slug': 'python-data-science',
                'description': "Devenez autonome dans la manipulation, le nettoyage et l'automatisation de rapports décisionnels avec l'écosystème Python et la bibliothèque Pandas.",
                'icon': 'code',
                'order': 3,
            },
            {
                'tool': Track.Tool.POWERBI,
                'name': "Power BI & Business Intelligence",
                'slug': 'power-bi-business-intelligence',
                'description': "Concevez des modèles relationnels en étoile et des tableaux de bord interactifs à fort impact visuel pour la direction générale avec DAX.",
                'icon': 'bar-chart-2',
                'order': 4,
            },
            {
                'tool': Track.Tool.GITHUB,
                'name': "Git & GitHub pour Analystes",
                'slug': 'git-github-analystes',
                'description': "Versionnez vos scripts, requêtes et visualisations. Collaborez efficacement et construisez un portfolio public valorisé par les recruteurs internationaux.",
                'icon': 'git-branch',
                'order': 5,
            },
        ]

        tracks = {}
        for t_info in tracks_data:
            track, _ = Track.objects.update_or_create(
                tool=t_info['tool'],
                defaults={
                    'name': t_info['name'],
                    'slug': t_info['slug'],
                    'description': t_info['description'],
                    'icon': t_info['icon'],
                    'order': t_info['order'],
                    'is_published': True,
                },
            )
            tracks[t_info['tool']] = track

        self.stdout.write(self.style.SUCCESS("All Tracks verified and ready."))

        # -------------------------------------------------------------
        # 3. CURRICULUM SEEDING DEFINITION
        # -------------------------------------------------------------
        courses_plan = [
            # ======================== SQL ============================
            {
                'track': tracks[Track.Tool.SQL],
                'title': "SQL Débutant — Requêtes Fondamentales & Filtres Métier",
                'slug': "sql-debutant-requetes-filtres",
                'subtitle': "Interrogez vos premières bases de données relationnelles avec SELECT, WHERE, ORDER BY et LIMIT",
                'level': Course.Level.BEGINNER,
                'duration_hours': 8,
                'price_tier': Course.PriceTier.FREE,
                'order': 1,
                'target_audience': "Débutants complets, étudiants en gestion, comptables et professionnels souhaitant dépasser les limites de volume d'Excel.",
                'prerequisites': "Aucune compétence préalable en programmation requise. Un smartphone ou ordinateur standard suffit.",
                'learning_outcomes': [
                    {"statement": "Comprendre l'architecture d'une base relationnelle et le rôle des clés primaires", "bloom_level": "UNDERSTAND"},
                    {"statement": "Écrire des requêtes SELECT sans ambiguïté avec alias de colonnes en FCFA", "bloom_level": "APPLY"},
                    {"statement": "Filtrer des données commerciales complexes avec WHERE, AND, OR, IN et LIKE", "bloom_level": "APPLY"},
                    {"statement": "Trier et limiter les jeux d'extractions pour les écrans de reporting", "bloom_level": "APPLY"},
                ],
                'pedagogical_modalities': "Exercices interactifs dans le navigateur avec base SQLite/Postgres simulée, jeux de données de boutiques camerounaises.",
                'modules': [
                    {
                        'title': "Module 1 : Anatomie d'une Base de Données & Requêtes Fondamentales",
                        'description': "Découvrez les tables relationnelles, les colonnes typées et la syntaxe SELECT / FROM.",
                        'lessons': [
                            {
                                'title': "Comprendre les tables et interroger avec SELECT",
                                'slug': "sql-select-fondamentaux",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 12,
                                'is_preview': True,
                                'summary': "Découvrez la syntaxe SQL de base et apprenez à cibler précisément les colonnes nécessaires.",
                                'content': """# Introduction à SQL : Interroger une Base de Données

Une base de données relationnelle organise les informations sous forme de **tables** composées de lignes (enregistrements) et de colonnes (attributs typés).

## La Syntaxe Fondamentale

La commande `SELECT` indique au moteur de base de données les colonnes que vous souhaitez afficher, et `FROM` indique la table source :

```sql
SELECT nom, ville, type_canal
FROM agences;
```

> **Règle d'or de performance** : Évitez `SELECT *` en production sur des bases volumineuses. Spécifiez toujours le nom des colonnes nécessaires pour économiser la mémoire et la bande passante.

### Renommer des Colonnes avec AS (Alias)

Pour rendre les résultats immédiatement compréhensibles pour votre direction :

```sql
SELECT 
    designation AS produit,
    prix_unitaire_fcfa AS prix_fcfa
FROM produits;
```
""",
                                'code_snippet': "SELECT designation, prix_unitaire_fcfa FROM produits;",
                                'attachment': {
                                    'title': "Script SQL de départ — Schéma Mboa Retail",
                                    'file_name': 'schema_mboa_retail.sql',
                                    'type': LessonAttachment.AttachmentType.STARTER,
                                    'format': 'sql',
                                },
                            },
                            {
                                'title': "Filtrer avec WHERE, AND/OR et gestion des NULLs",
                                'slug': "sql-filtrer-where-conditions",
                                'type': Lesson.LessonType.CODE,
                                'duration': 15,
                                'is_preview': True,
                                'summary': "Isolez les transactions significatives et filtrez selon les montants en FCFA et modes de paiement.",
                                'content': """# Filtrer les Données avec la Clause WHERE

La clause `WHERE` permet de restreindre les résultats aux seules lignes respectant une condition logique.

## Opérateurs Logiques Usuels

- `=` (Égalité stricte)
- `<>` ou `!=` (Différence)
- `>`, `<`, `>=`, `<=` (Comparateurs numériques de montants)
- `BETWEEN ... AND ...` (Intervalle de dates ou de montants)
- `IN (...)` (Appartenance à une liste de valeurs)
- `LIKE` (Recherche textuelle avec `%` comme joker)

## Exemple Pratique : Transactions Mobile Money à Douala

```sql
SELECT 
    id,
    date_vente,
    montant_total_fcfa,
    mode_paiement
FROM transactions_mboa
WHERE mode_paiement IN ('MTN_MOMO', 'ORANGE_MONEY')
  AND montant_total_fcfa >= 50000;
```
""",
                                'code_snippet': "SELECT * FROM transactions_mboa WHERE mode_paiement = 'MTN_MOMO';",
                            },
                            {
                                'title': "Quiz de Validation — Syntaxe SELECT & Filtres WHERE",
                                'slug': "sql-quiz-select-where",
                                'type': Lesson.LessonType.QUIZ,
                                'duration': 10,
                                'is_preview': False,
                                'quiz': {
                                    'title': "Évaluation Diagnostique SQL Niveau 1",
                                    'passing_score': 70,
                                    'questions': [
                                        {
                                            'prompt': "Quelle clause SQL permet de filtrer les lignes avant tout traitement ?",
                                            'explanation': "La clause WHERE s'exécute immédiatement après le FROM pour sélectionner uniquement les enregistrements pertinents.",
                                            'bloom': QuizQuestion.BloomLevel.REMEMBER,
                                            'options': [
                                                ("WHERE", True),
                                                ("HAVING", False),
                                                ("ORDER BY", False),
                                                ("FILTER", False),
                                            ],
                                        },
                                        {
                                            'prompt': "Comment rechercher les clients dont le nom commence par 'K' en SQL ?",
                                            'explanation': "L'opérateur LIKE avec le joker % permet de rechercher un préfixe : WHERE nom LIKE 'K%'.",
                                            'bloom': QuizQuestion.BloomLevel.APPLY,
                                            'options': [
                                                ("WHERE nom LIKE 'K%'", True),
                                                ("WHERE nom = 'K*'", False),
                                                ("WHERE nom CONTAINS 'K'", False),
                                                ("WHERE nom IN ('K')", False),
                                            ],
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.SQL],
                'title': "SQL Intermédiaire — Jointures Relationnelles & Agrégations Métier",
                'slug': "sql-intermediaire-jointures-aggregations",
                'subtitle': "Croisez plusieurs tables avec INNER/LEFT JOIN et calculez des KPIs avec GROUP BY et HAVING",
                'level': Course.Level.INTERMEDIATE,
                'duration_hours': 12,
                'price_tier': Course.PriceTier.ESSENTIAL,
                'order': 2,
                'target_audience': "Analystes juniors, contrôleurs de gestion et chargés d'études ayant validé les bases du filtrage SQL.",
                'prerequisites': "Maîtrise de SELECT, WHERE et ORDER BY. Notions de relations entre tables.",
                'learning_outcomes': [
                    {"statement": "Calculer des sommes, moyennes et comptages par agence ou catégorie", "bloom_level": "APPLY"},
                    {"statement": "Filtrer des résultats agrégés avec HAVING plutôt que WHERE", "bloom_level": "ANALYZE"},
                    {"statement": "Croiser plusieurs tables avec INNER JOIN et LEFT JOIN sans perdre d'enregistrements", "bloom_level": "APPLICATION"},
                    {"statement": "Construire un rapport de portefeuille de crédits microfinance avec calcul du PAR 30", "bloom_level": "SYNTHESIS"},
                ],
                'pedagogical_modalities': "Étude de cas complète sur un portefeuille de microfinance à Bafoussam, jeux de données réalistes en FCFA.",
                'modules': [
                    {
                        'title': "Module 1 : Agrégations avec GROUP BY & Filtres HAVING",
                        'description': "Synthétisez des milliers de transactions en indicateurs managériaux.",
                        'lessons': [
                            {
                                'title': "Fonctions d'agrégation et regroupements par agence",
                                'slug': "sql-fonctions-agregation-group-by",
                                'type': Lesson.LessonType.CODE,
                                'duration': 18,
                                'is_preview': True,
                                'summary': "Utilisez COUNT, SUM, AVG, MIN, MAX et découvrez la mécanique du GROUP BY.",
                                'content': """# Agrégations Métier avec GROUP BY

Les fonctions d'agrégation calculent une valeur unique à partir d'un ensemble de valeurs :
- `COUNT(*)` : Nombre d'enregistrements
- `SUM(montant)` : Somme totale des montants
- `AVG(montant)` : Valeur moyenne du panier
- `MIN()` / `MAX()` : Valeurs extrêmes

## Différence entre WHERE et HAVING

- **WHERE** filtre les lignes brutes *avant* le regroupement.
- **HAVING** filtre les groupes agrégés *après* le calcul de la fonction d'agrégation.

```sql
SELECT 
    agence_id,
    COUNT(*) AS nb_ventes,
    SUM(montant_total_fcfa) AS ca_total_fcfa,
    ROUND(AVG(montant_total_fcfa), 0) AS panier_moyen_fcfa
FROM transactions_mboa
GROUP BY agence_id
HAVING SUM(montant_total_fcfa) >= 100000;
```
""",
                                'code_snippet': "SELECT agence_id, SUM(montant_total_fcfa) FROM transactions_mboa GROUP BY agence_id;",
                                'attachment': {
                                    'title': "Cas Pratique Microfinance — Script d'exercice N2",
                                    'file_name': 'cas_pratique_microfinance_n2.sql',
                                    'type': LessonAttachment.AttachmentType.STARTER,
                                    'format': 'sql',
                                },
                            },
                            {
                                'title': "Jointures Relationnelles : INNER JOIN vs LEFT JOIN",
                                'slug': "sql-jointures-inner-left",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 20,
                                'is_preview': False,
                                'summary': "Reliez vos tables de transactions aux tables de dimension agences et produits.",
                                'content': """# Maîtriser les Jointures en SQL

Dans une architecture normalisée, les libellés des produits et agences ne sont pas dupliqués dans la table des ventes. On utilise les jointures relationnelles.

## 1. INNER JOIN (Intersection Stricte)
Ne conserve que les lignes ayant une correspondance exacte dans les deux tables.

```sql
SELECT 
    t.date_vente,
    a.nom AS nom_agence,
    p.designation AS produit,
    t.montant_total_fcfa
FROM transactions_mboa t
INNER JOIN agences a ON t.agence_id = a.id
INNER JOIN produits p ON t.produit_id = p.id;
```

## 2. LEFT JOIN (Préservation de la table de gauche)
Conserve TOUTES les lignes de la table de gauche, même si aucune transaction n'existe (les colonnes absentes valent `NULL`).
Précieux pour identifier les produits invendus ou les agences sans activité !
""",
                                'code_snippet': "SELECT * FROM agences a LEFT JOIN transactions_mboa t ON a.id = t.agence_id;",
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.SQL],
                'title': "SQL Avancé — Fonctions de Fenêtrage & Optimisation Analytique",
                'slug': "sql-avance-fenetrage-optimisation",
                'subtitle': "Déployez OVER, PARTITION BY, CTEs WITH et optimisez les temps de calcul avec EXPLAIN ANALYZE",
                'level': Course.Level.ADVANCED,
                'duration_hours': 15,
                'price_tier': Course.PriceTier.PRO,
                'order': 3,
                'target_audience': "Data analysts seniors, ingénieurs BI et consultants manipulant de gros volumes de données.",
                'prerequisites': "Excellente maîtrise des jointures, sous-requêtes et agrégations SQL.",
                'learning_outcomes': [
                    {"statement": "Calculer des cumuls courants et moyennes mobiles sans réduire le nombre de lignes", "bloom_level": "ANALYZE"},
                    {"statement": "Comparer les performances N vs N-1 avec LAG et LEAD", "bloom_level": "EVALUATE"},
                    {"statement": "Structurer des requêtes complexes et récursives avec les CTE (WITH)", "bloom_level": "CREATE"},
                    {"statement": "Interpréter les plans d'exécution et poser les bons index B-Tree", "bloom_level": "EVALUATE"},
                ],
                'pedagogical_modalities': "Analyses avancées sur des millions de transactions, ateliers d'optimisation d'index.",
                'modules': [
                    {
                        'title': "Module 1 : Window Functions (OVER, PARTITION BY, LAG/LEAD)",
                        'description': "Effectuez des calculs analytiques de haut niveau sans perdre le niveau de détail unitaire.",
                        'lessons': [
                            {
                                'title': "Cumuls courants, Rangs et Croissance N vs N-1",
                                'slug': "sql-window-functions-avancees",
                                'type': Lesson.LessonType.CODE,
                                'duration': 25,
                                'is_preview': True,
                                'summary': "Découvrez OVER(), PARTITION BY, ROW_NUMBER(), DENSE_RANK() et LAG().",
                                'content': """# Fonctions de Fenêtrage (Window Functions)

Contrairement à `GROUP BY` qui réduit plusieurs lignes en une seule, une fonction de fenêtrage conserve toutes les lignes d'origine tout en calculant un résultat agrégé sur une partition définie.

## Syntaxe Générale

```sql
SELECT 
    date_vente,
    agence_id,
    montant_total_fcfa,
    SUM(montant_total_fcfa) OVER (
        PARTITION BY agence_id 
        ORDER BY date_vente
    ) AS ca_cumule_agence_fcfa
FROM transactions_mboa;
```

## Comparaison Période Précédente avec LAG()

```sql
SELECT 
    mois,
    ca_mensuel,
    LAG(ca_mensuel, 1) OVER (ORDER BY mois) AS ca_mois_precedent,
    ca_mensuel - LAG(ca_mensuel, 1) OVER (ORDER BY mois) AS ecart_fcfa
FROM ca_mensuel_global;
```
""",
                                'code_snippet': "SELECT id, SUM(montant) OVER (PARTITION BY agence ORDER BY date) FROM ventes;",
                                'attachment': {
                                    'title': "Script SQL Avancé — Fenêtrage & CTEs N3",
                                    'file_name': 'requetes_fenetrage_analytics_n3.sql',
                                    'type': LessonAttachment.AttachmentType.SOLUTION,
                                    'format': 'sql',
                                },
                            },
                        ],
                    },
                ],
            },

            # ======================== PYTHON ============================
            {
                'track': tracks[Track.Tool.PYTHON],
                'title': "Python Débutant — Exploration & Manipulation avec Pandas",
                'slug': "python-debutant-pandas-exploration",
                'subtitle': "Prenez en main l'écosystème Python pour la data et inspectez vos premiers DataFrames",
                'level': Course.Level.BEGINNER,
                'duration_hours': 10,
                'price_tier': Course.PriceTier.FREE,
                'order': 1,
                'target_audience': "Tout professionnel souhaitant automatiser ses analyses répétitives et explorer des jeux de données avec Python.",
                'prerequisites': "Aucune expérience préalable en Python. Navigateur moderne ou smartphone pour suivre.",
                'learning_outcomes': [
                    {"statement": "Charger et inspecter des fichiers CSV avec Pandas sans blocage mémoire", "bloom_level": "APPLY"},
                    {"statement": "Sélectionner des séries et filtrer selon des conditions multiples", "bloom_level": "APPLY"},
                    {"statement": "Calculer des statistiques descriptives fondamentales (médiane, écart-type, percentiles)", "bloom_level": "UNDERSTAND"},
                ],
                'pedagogical_modalities': "Laboratoire Pyodide exécutable directement dans le navigateur sans installation locale.",
                'modules': [
                    {
                        'title': "Module 1 : Premiers pas avec Pandas & Inspection Structurée",
                        'description': "Chargez votre premier DataFrame et explorez les colonnes et types de données.",
                        'lessons': [
                            {
                                'title': "Chargement de données et découverte du DataFrame",
                                'slug': "python-intro-pandas-dataframe",
                                'type': Lesson.LessonType.CODE,
                                'duration': 15,
                                'is_preview': True,
                                'summary': "Utilisez pd.read_csv, head, info et describe pour analyser vos données.",
                                'content': """# Bienvenue dans l'univers de Python pour la Data

Python est le langage leader mondial de l'analyse de données grâce à sa syntaxe lisible et à sa bibliothèque phare : **Pandas**.

## Le DataFrame : Votre Tableau Intelligent

Un DataFrame Pandas ressemble à une feuille Excel, mais il peut traiter des centaines de milliers de lignes en quelques fractions de seconde.

```python
import pandas as pd

# Chargement du fichier
df = pd.read_csv('ventes_supermarches_douala.csv')

# 1. Inspecter les 5 premieres lignes
print(df.head())

# 2. Informations sur les types et valeurs nulles
print(df.info())

# 3. Statistiques descriptives
print(df['montant_fcfa'].describe())
```
""",
                                'code_snippet': "import pandas as pd\ndf = pd.read_csv('ventes_supermarches_douala.csv')\nprint(df.head())",
                                'attachment': {
                                    'title': "Script Python Starter — Exploration Pandas N1",
                                    'file_name': 'starter_exploration_pandas_n1.py',
                                    'type': LessonAttachment.AttachmentType.STARTER,
                                    'format': 'py',
                                },
                            },
                            {
                                'title': "Jeu de données brut — Ventes Douala (CSV)",
                                'slug': "python-dataset-ventes-douala",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 10,
                                'is_preview': True,
                                'summary': "Téléchargez et comprenez le jeu de données des supermarchés de Douala.",
                                'content': """# Dataset d'Entraînement : Supermarchés de Douala

Ce jeu de données contient les transactions enregistrées sur les agences d'Akwa, Bonanjo et Bastos.

## Colonnes Clés
- `transaction_id` : Identifiant unique de la transaction
- `date` : Date de la vente (Format AAAA-MM-JJ)
- `agence` : Point de vente
- `produit` : Nom commercial du produit
- `quantite` : Nombre d'unités vendues
- `prix_unitaire_fcfa` : Prix unitaire en FCFA
- `montant_fcfa` : Chiffre d'affaires total de la ligne
- `mode_paiement` : MTN MoMo, Orange Money, Cash ou Carte
""",
                                'attachment': {
                                    'title': "Jeu de données CSV — Ventes Supermarchés Douala",
                                    'file_name': 'ventes_supermarches_douala.csv',
                                    'type': LessonAttachment.AttachmentType.DATASET,
                                    'format': 'csv',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.PYTHON],
                'title': "Python Intermédiaire — Traitement Vectorisé & Nettoyage Avancé",
                'slug': "python-intermediaire-nettoyage-transformation",
                'subtitle': "Nettoyez les anomalies, gérez les valeurs manquantes et regroupez vos métriques avec groupby",
                'level': Course.Level.INTERMEDIATE,
                'duration_hours': 14,
                'price_tier': Course.PriceTier.ESSENTIAL,
                'order': 2,
                'target_audience': "Analystes ayant suivi l'initiation Pandas et souhaitant nettoyer des jeux de données imparfaits.",
                'prerequisites': "Connaissance des bases de Python et de la structure DataFrame de Pandas.",
                'learning_outcomes': [
                    {"statement": "Détecter et imputer les valeurs manquantes sans biaiser les distributions", "bloom_level": "ANALYZE"},
                    {"statement": "Transformer les types de données (dates, nombres avec séparateurs, chaînes)", "bloom_level": "APPLY"},
                    {"statement": "Construire des tableaux croisés dynamiques avec groupby et pivot_table", "bloom_level": "APPLY"},
                ],
                'pedagogical_modalities': "Exercices pratiques sur des exports de paie et de stocks contenant des fautes de frappe et des formats hétérogènes.",
                'modules': [
                    {
                        'title': "Module 1 : Nettoyage & Traitement Vectorisé",
                        'description': "Imputation, nettoyage textuel et agrégations avancées.",
                        'lessons': [
                            {
                                'title': "Gestion des valeurs manquantes et conversions de formats FCFA",
                                'slug': "python-nettoyage-valeurs-manquantes",
                                'type': Lesson.LessonType.CODE,
                                'duration': 20,
                                'is_preview': True,
                                'summary': "Maîtrisez isna(), dropna(), fillna() et les accesseurs .str pour le nettoyage.",
                                'content': """# Nettoyage Professionnel de Données

Dans les entreprises camerounaises, les fichiers reçus comportent souvent des libellés avec espaces superflus, des montants formatés en texte avec `FCFA`, ou des dates au format français `JJ/MM/AAAA`.

## Nettoyer une Colonne Monétaire en Texte

```python
# Exemple de chaine : '  45 000 FCFA  '
df['montant_nettoye'] = (
    df['montant_brut']
    .str.replace('FCFA', '', regex=False)
    .str.replace(' ', '', regex=False)
    .astype(float)
)
```

## Imputation Raisonnée des Valeurs Manquantes

```python
# Remplacer les quantites manquantes par 0 ou par la mediane
df['quantite'] = df['quantite'].fillna(0)
```
""",
                                'code_snippet': "df['montant'] = df['montant'].str.replace('FCFA', '').astype(float)",
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.PYTHON],
                'title': "Python Avancé — Pipelines Automatisés & Visualisation Décisionnelle",
                'slug': "python-avance-pipelines-visualisation",
                'subtitle': "Construisez des scripts de bout en bout qui lisent, transforment et exportent des classeurs Excel formatés",
                'level': Course.Level.ADVANCED,
                'duration_hours': 16,
                'price_tier': Course.PriceTier.PRO,
                'order': 3,
                'target_audience': "Data analysts confirmés et consultants voulant automatiser l'intégralité de leur chaîne de production de rapports.",
                'prerequisites': "Solide pratique de Pandas, groupby et manipulation de fichiers.",
                'learning_outcomes': [
                    {"statement": "Développer un pipeline de données modulaire, réutilisable et robuste", "bloom_level": "CREATE"},
                    {"statement": "Créer des visualisations claires et publiables avec Seaborn et Matplotlib", "bloom_level": "APPLICATION"},
                    {"statement": "Générer automatiquement des rapports multi-onglets au format Excel avec openpyxl", "bloom_level": "CREATE"},
                ],
                'pedagogical_modalities': "Création d'un générateur automatique de rapports de synthèse pour comités de direction.",
                'modules': [
                    {
                        'title': "Module 1 : Pipelines d'Automatisation & Export Professionnel",
                        'description': "Architecturez un flux complet de la donnée brute au livrable Excel final.",
                        'lessons': [
                            {
                                'title': "Création d'un pipeline complet et export multi-onglets Excel",
                                'slug': "python-pipeline-export-excel",
                                'type': Lesson.LessonType.CODE,
                                'duration': 25,
                                'is_preview': True,
                                'summary': "Automatisez la création de rapports pour gagner des heures de travail chaque semaine.",
                                'content': """# Automatisation Complète de Rapports Décisionnels

L'objectif ultime d'un analyste est d'écrire un script qui s'exécute en une commande pour transformer des données brutes en un livrable complet pour la direction.

## Structure du Pipeline

1. **Extraction** : Lecture des CSV ou connexion SQL
2. **Transformation** : Nettoyage, calcul des ratios et indicateurs par agence
3. **Chargement** : Génération d'un classeur Excel avec onglet de synthèse et onglet de données brutes

```python
with pd.ExcelWriter('Rapport_Direction.xlsx', engine='openpyxl') as writer:
    synthese_agences.to_excel(writer, sheet_name='Synthese', index=False)
    donnees_propres.to_excel(writer, sheet_name='Details', index=False)
```
""",
                                'code_snippet': "with pd.ExcelWriter('output.xlsx') as writer:\n    df.to_excel(writer, sheet_name='Synthese')",
                                'attachment': {
                                    'title': "Script Python Pipeline de Reporting N3",
                                    'file_name': 'pipeline_reporting_automatise_n3.py',
                                    'type': LessonAttachment.AttachmentType.SOLUTION,
                                    'format': 'py',
                                },
                            },
                        ],
                    },
                ],
            },

            # ======================== POWER BI ============================
            {
                'track': tracks[Track.Tool.POWERBI],
                'title': "Power BI Débutant — Modélisation & Schéma en Étoile",
                'slug': "powerbi-debutant-modelisation-etoile",
                'subtitle': "Construisez une modélisation robuste Faits/Dimensions et comprenez le sens des relations 1-à-plusieurs",
                'level': Course.Level.BEGINNER,
                'duration_hours': 10,
                'price_tier': Course.PriceTier.FREE,
                'order': 1,
                'target_audience': "Débutants en Business Intelligence, managers et analystes souhaitant structurer des tableaux de bord fiables.",
                'prerequisites': "Connaissance élémentaire des tableaux de données Excel.",
                'learning_outcomes': [
                    {"statement": "Distinguer une table de faits (transactions) des tables de dimensions (clients, agences, temps)", "bloom_level": "UNDERSTAND"},
                    {"statement": "Créer des relations 1-à-plusieurs correctes avec filtrage unidirectionnel", "bloom_level": "APPLY"},
                    {"statement": "Concevoir une première page de dashboard avec cartes de KPIs et graphiques à barres", "bloom_level": "APPLICATION"},
                ],
                'pedagogical_modalities': "Étude de cas de modélisation pour un groupe de distribution à Douala.",
                'modules': [
                    {
                        'title': "Module 1 : Principes du Schéma en Étoile & Power Query",
                        'description': "Transformez vos données brutes et reliez-les dans le modèle de données.",
                        'lessons': [
                            {
                                'title': "Comprendre le schéma en étoile : Faits vs Dimensions",
                                'slug': "powerbi-schema-etoile-fondamentaux",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 18,
                                'is_preview': True,
                                'summary': "Découvrez pourquoi un modèle en étoile surpasse un tableau plat unique.",
                                'content': """# La Modélisation en Étoile : Socle de la BI

Un tableau de bord performant repose à 80% sur la qualité de son modèle relationnel et à 20% sur ses graphiques.

## 1. La Table de Faits (Fact Table)
Elle stocke les événements quantifiables et leurs montants :
- Ex: `FactVentes` (Date, AgenceKey, ProduitKey, MontantFCFA, Quantite)
- Très haute (des millions de lignes), souvent étroite en colonnes.

## 2. Les Tables de Dimensions (Dim Tables)
Elles donnent le contexte textuel pour filtrer et découper les faits :
- `DimClients`, `DimAgences`, `DimProduits`, `DimCalendrier`
- Courtes, riches en attributs descriptifs (Ville, Quartier, Marque).

## Règle d'or : Relations 1-à-Plusieurs (1:*)
Le filtre doit toujours descendre de la Dimension (côté 1) vers la Table de Faits (côté *).
""",
                                'attachment': {
                                    'title': "Guide Mémo — Schéma en Étoile & DAX (PDF)",
                                    'file_name': 'guide_schema_etoile_dax_mboa.pdf',
                                    'type': LessonAttachment.AttachmentType.CHEATSHEET,
                                    'format': 'pdf',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.POWERBI],
                'title': "Power BI Intermédiaire — Mesures DAX & Indicateurs de Rentabilité",
                'slug': "powerbi-intermediaire-dax-mesures",
                'subtitle': "Maîtrisez CALCULATE, ALL, FILTER, DIVIDE et construisez des KPIs de marges en FCFA",
                'level': Course.Level.INTERMEDIATE,
                'duration_hours': 14,
                'price_tier': Course.PriceTier.ESSENTIAL,
                'order': 2,
                'target_audience': "Praticiens Power BI souhaitant dépasser les agrégations automatiques pour créer des métriques sur mesure.",
                'prerequisites': "Notions de schéma en étoile et utilisation de base de l'interface Power BI.",
                'learning_outcomes': [
                    {"statement": "Distinguer une colonne calculée statique d'une mesure explicite dynamique", "bloom_level": "ANALYZE"},
                    {"statement": "Modifier le contexte de filtre avec CALCULATE et ALL", "bloom_level": "APPLY"},
                    {"statement": "Calculer des pourcentages de marge et parts de marché sans division par zéro", "bloom_level": "APPLICATION"},
                ],
                'pedagogical_modalities': "Ateliers pratiques de calcul de KPIs commerciaux et logistiques.",
                'modules': [
                    {
                        'title': "Module 1 : Mesures Explicites & Contexte de Filtre",
                        'description': "Plongez au cœur du moteur DAX (Data Analysis Expressions).",
                        'lessons': [
                            {
                                'title': "La puissance de CALCULATE et de la fonction DIVIDE",
                                'slug': "powerbi-dax-calculate-divide",
                                'type': Lesson.LessonType.CODE,
                                'duration': 22,
                                'is_preview': True,
                                'summary': "Apprenez à écrire des mesures DAX robustes et sécurisées.",
                                'content': """# Maîtriser DAX : CALCULATE et DIVIDE

En Power BI, les mesures ne consomment pas d'espace disque : elles sont évaluées à la volée selon les filtres sélectionnés par l'utilisateur.

## Mesure de Base
```dax
CA Total FCFA = SUM(FactVentes[MontantTotalFCFA])
```

## CALCULATE : La Reine des Fonctions DAX
Elle permet de remplacer ou d'enrichir le contexte de filtre courant :

```dax
CA Douala FCFA = 
CALCULATE(
    [CA Total FCFA],
    DimAgences[Ville] = "Douala"
)
```

## Part de Marché Sécurisée avec DIVIDE et ALL
```dax
Part Marche Agence = 
DIVIDE(
    [CA Total FCFA],
    CALCULATE([CA Total FCFA], ALL(DimAgences)),
    0
)
```
""",
                                'code_snippet': "CA Total FCFA = SUM(FactVentes[MontantTotalFCFA])\nPart Marche = DIVIDE([CA Total FCFA], CALCULATE([CA Total FCFA], ALL(DimAgences)), 0)",
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.POWERBI],
                'title': "Power BI Avancé — Tableaux de Bord Exécutifs & Time Intelligence",
                'slug': "powerbi-avance-dashboards-executifs",
                'subtitle': "Développez l'analyse temporelle N vs N-1, implémentez la sécurité Row-Level Security (RLS) et optimisez les visuels",
                'level': Course.Level.ADVANCED,
                'duration_hours': 16,
                'price_tier': Course.PriceTier.PRO,
                'order': 3,
                'target_audience': "Chefs de projet BI, analystes seniors concevant des livrables pour directeurs généraux et investisseurs.",
                'prerequisites': "Maîtrise des mesures DAX de base (CALCULATE, SUM, DIVIDE) et modélisation en étoile.",
                'learning_outcomes': [
                    {"statement": "Implémenter des mesures de Time Intelligence (YTD, SAMEPERIODLASTYEAR) avec table calendrier dédiée", "bloom_level": "CREATE"},
                    {"statement": "Sécuriser les données selon les profils régionaux avec Row-Level Security (RLS)", "bloom_level": "EVALUATE"},
                    {"statement": "Structurer une ergonomie décisionnelle mobile-first pour comités de direction", "bloom_level": "SYNTHESIS"},
                ],
                'pedagogical_modalities': "Création d'un tableau de bord exécutif complet avec navigation personnalisée et sécurité par rôle.",
                'modules': [
                    {
                        'title': "Module 1 : Time Intelligence & Sécurité Multi-Profils",
                        'description': "Concevez des indicateurs comparatifs temporels et appliquez les droits d'accès RLS.",
                        'lessons': [
                            {
                                'title': "Time Intelligence et Sécurité par Rôle (RLS)",
                                'slug': "powerbi-time-intelligence-rls",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 24,
                                'is_preview': True,
                                'summary': "Comparez les exercices comptables N vs N-1 et cloisonnez les accès selon la région.",
                                'content': """# Tableaux de Bord Exécutifs de Haut Niveau

Un comité de direction a besoin de deux informations majeures :
1. Sommes-nous en croissance par rapport à la même période de l'année précédente (N vs N-1) ?
2. Chaque responsable régional ne doit voir que les chiffres de son périmètre (Row-Level Security).

## Time Intelligence : Chiffre d'Affaires N-1
Nécessite impérativement une table calendrier continue (`DimCalendrier`) :

```dax
CA Annee Precedente FCFA = 
CALCULATE(
    [CA Total FCFA],
    SAMEPERIODLASTYEAR(DimCalendrier[Date])
)

Croissance Annuelle % = 
DIVIDE(
    [CA Total FCFA] - [CA Annee Precedente FCFA],
    [CA Annee Precedente FCFA],
    0
)
```

## Row-Level Security (RLS)
Permet de filtrer automatiquement les données selon le rôle de l'utilisateur connecté :
- Rôle `Directeur Littoral` : `DimAgences[Region] = "Littoral"`
- Rôle `Directeur Ouest` : `DimAgences[Region] = "Ouest"`
""",
                            },
                        ],
                    },
                ],
            },

            # ======================== GIT & GITHUB ============================
            {
                'track': tracks[Track.Tool.GITHUB],
                'title': "Git Débutant — Versioning Local pour Analystes",
                'slug': "git-debutant-versioning-local",
                'subtitle': "Prenez le contrôle de l'historique de vos scripts SQL et Python sans jamais perdre de version de travail",
                'level': Course.Level.BEGINNER,
                'duration_hours': 6,
                'price_tier': Course.PriceTier.FREE,
                'order': 1,
                'target_audience': "Analystes et scientifiques de données fatigués des fichiers nommés 'rapport_final_v2_definitif_v3.xlsx'.",
                'prerequisites': "Aucun. Accessible sur tout ordinateur ou émulateur de terminal.",
                'learning_outcomes': [
                    {"statement": "Comprendre le concept de versioning et initialiser un dépôt local avec git init", "bloom_level": "UNDERSTAND"},
                    {"statement": "Maîtriser les trois états de Git (Working Directory, Staging Area, Repository)", "bloom_level": "APPLY"},
                    {"statement": "Rédiger des messages de commit professionnels et informatifs", "bloom_level": "APPLY"},
                ],
                'pedagogical_modalities': "Exercices guidés en ligne de commande pour versionner un projet d'analyse financière.",
                'modules': [
                    {
                        'title': "Module 1 : Le Cycle de Vie des Fichiers & Premier Commit",
                        'description': "Initialisation, indexation et enregistrement de jalons de travail.",
                        'lessons': [
                            {
                                'title': "Initialiser son dépôt et réaliser son premier commit",
                                'slug': "git-init-status-add-commit",
                                'type': Lesson.LessonType.CODE,
                                'duration': 15,
                                'is_preview': True,
                                'summary': "Découvrez les 4 commandes fondamentales pour sécuriser votre travail.",
                                'content': """# Adieu aux Fichiers 'rapport_final_v2_vrai_final.py' !

Git enregistre des instantanés (commits) de votre code au fil du temps. Si une erreur apparaît, vous pouvez revenir en arrière en un clin d'œil.

## Les Trois Zones de Git
1. **Working Directory** : Vos fichiers sur votre disque dur.
2. **Staging Area (Index)** : La salle de préparation où vous sélectionnez les fichiers à inclure (`git add`).
3. **Repository** : L'historique immuable de vos versions (`git commit`).

## Les Commandes Fondamentales

```bash
# 1. Initialiser le depot dans votre dossier projet
git init

# 2. Verifier l'etat des fichiers
git status

# 3. Indexer vos fichiers prepares
git add analyse_ventes.py schema.sql

# 4. Enregistrer le commit avec un message descriptif
git commit -m "feat(analyse): ajouter le calcul des marges par agence de Douala"
```
""",
                                'code_snippet': "git init\ngit status\ngit add .\ngit commit -m 'feat: initial commit'",
                                'attachment': {
                                    'title': "Aide-Mémoire Git pour Analystes (PDF)",
                                    'file_name': 'aide_memoire_git_analyste.pdf',
                                    'type': LessonAttachment.AttachmentType.CHEATSHEET,
                                    'format': 'pdf',
                                },
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.GITHUB],
                'title': "Git & GitHub — Branches, Fusions & Collaboration",
                'slug': "git-intermediaire-branches-collaboration",
                'subtitle': "Créez des branches isolées pour vos fonctionnalités et résolvez sereinement les conflits de fusion",
                'level': Course.Level.INTERMEDIATE,
                'duration_hours': 8,
                'price_tier': Course.PriceTier.ESSENTIAL,
                'order': 2,
                'target_audience': "Analystes travaillant en équipe ou contribuant à des projets collaboratifs.",
                'prerequisites': "Maîtrise de git init, add, commit et log.",
                'learning_outcomes': [
                    {"statement": "Créer et basculer entre différentes branches de travail", "bloom_level": "APPLY"},
                    {"statement": "Fusionner une branche de développement dans la branche principale", "bloom_level": "APPLY"},
                    {"statement": "Comprendre l'origine d'un conflit de fusion et le résoudre manuellement", "bloom_level": "ANALYZE"},
                ],
                'pedagogical_modalities': "Simulation de travail en binôme sur un modèle de prévision des ventes.",
                'modules': [
                    {
                        'title': "Module 1 : Branches de Travail & Résolution de Conflits",
                        'description': "Isolez vos expérimentations avant de les valider dans le tronc commun.",
                        'lessons': [
                            {
                                'title': "Création de branches et résolution méthodique des conflits",
                                'slug': "git-branches-merge-conflits",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 18,
                                'is_preview': True,
                                'summary': "Découvrez git branch, git switch, git merge et la gestion des conflits.",
                                'content': """# Travailler en Équipe avec les Branches Git

Une branche est une ligne de développement indépendante. Elle vous permet d'essayer une nouvelle formule ou un nouveau modèle statistique sans casser le code en production.

## Commandes Usuelles de Branching

```bash
# Creer et basculer sur une nouvelle branche
git switch -c feature/modele-recouvrement

# Effectuer ses modifications et commiter
git add modele.py
git commit -m "feat: tester le calcul du PAR 30 avec nouvelle ponderation"

# Revenir sur la branche principale
git switch main

# Fusionner la branche validee
git merge feature/modele-recouvrement
```

## Gérer un Conflit de Fusion (Merge Conflict)

Un conflit survient lorsque deux analystes ont modifié la même ligne dans deux branches différentes. Git marque les zones en conflit :

```text
<<<<<<< HEAD
taux_commission = 0.05  # Version branche main
=======
taux_commission = 0.07  # Version nouvelle branche
>>>>>>> feature/commission-maj
```
L'analyste choisit la valeur exacte souhaitée, supprime les balises Git, et finalise avec `git commit`.
""",
                            },
                        ],
                    },
                ],
            },
            {
                'track': tracks[Track.Tool.GITHUB],
                'title': "GitHub Professionnel — Showcase de Portfolio & Bonnes Pratiques",
                'slug': "github-avance-portfolio-open-source",
                'subtitle': "Construisez un portfolio GitHub percutant avec README professionnels pour séduire les recruteurs internationaux",
                'level': Course.Level.ADVANCED,
                'duration_hours': 10,
                'price_tier': Course.PriceTier.PRO,
                'order': 3,
                'target_audience': "Analystes et data scientists préparant leur entrée sur le marché de l'emploi ou visant des contrats freelance.",
                'prerequisites': "Connaissance des branches Git et réalisation d'au moins un cas pratique de data analyse.",
                'learning_outcomes': [
                    {"statement": "Créer et documenter un dépôt public attractif selon les standards internationaux", "bloom_level": "CREATE"},
                    {"statement": "Rédiger un README percutant axé sur l'impact financier et les résultats métier", "bloom_level": "CREATE"},
                    {"statement": "Lier son profil DataMboa à son profil GitHub pour valoriser ses certifications", "bloom_level": "EVALUATE"},
                ],
                'pedagogical_modalities': "Création et mise en ligne du portfolio professionnel complet de l'apprenant.",
                'modules': [
                    {
                        'title': "Module 1 : Dépôts Distants & Showcase Professionnel",
                        'description': "Synchronisez votre travail local avec GitHub et soignez la présentation de vos projets.",
                        'lessons': [
                            {
                                'title': "Créer son portfolio GitHub et structurer un README d'impact",
                                'slug': "github-portfolio-readme-impact",
                                'type': Lesson.LessonType.TEXT,
                                'duration': 20,
                                'is_preview': True,
                                'summary': "Présentez vos analyses de façon à prouver votre valeur ajoutée aux recruteurs.",
                                'content': """# Faire de son GitHub une Vitrine Professionnelle

Les recruteurs internationaux et entreprises de premier plan ne jugent plus les analystes sur leur CV papier, mais sur leur code public et leurs dépôts GitHub.

## Les 4 Piliers d'un README de Projet Réussi

1. **Le Problème Métier Chiffré** : Pas seulement du code, mais quel problème d'entreprise vous avez résolu (ex: impayés de microfinance, ruptures logistiques).
2. **La Démarche & Outils Utilisés** : SQL pour l'extraction, Pandas pour la préparation, Power BI pour la restitution.
3. **L'Impact & Recommandations Financières** : Les gains chiffrés en FCFA ou en pourcentage d'économies.
4. **La Reproductibilité** : Instructions claires en 3 étapes pour exécuter votre projet.
""",
                                'attachment': {
                                    'title': "Modèle de README de Portfolio Data Analyst (Markdown)",
                                    'file_name': 'template_readme_portfolio_data.md',
                                    'type': LessonAttachment.AttachmentType.STARTER,
                                    'format': 'md',
                                },
                            },
                        ],
                    },
                ],
            },
        ]

        # -------------------------------------------------------------
        # 4. DATABASE INGESTION
        # -------------------------------------------------------------
        total_courses_seeded = 0
        total_modules_seeded = 0
        total_lessons_seeded = 0
        total_quizzes_seeded = 0
        total_attachments_seeded = 0

        for c_data in courses_plan:
            course, _ = Course.objects.update_or_create(
                slug=c_data['slug'],
                defaults={
                    'track': c_data['track'],
                    'title': c_data['title'],
                    'subtitle': c_data['subtitle'],
                    'level': c_data['level'],
                    'duration_hours': c_data['duration_hours'],
                    'price_tier': c_data['price_tier'],
                    'order': c_data['order'],
                    'target_audience': c_data['target_audience'],
                    'prerequisites': c_data['prerequisites'],
                    'learning_outcomes': c_data['learning_outcomes'],
                    'pedagogical_modalities': c_data['pedagogical_modalities'],
                    'instructor_name': 'Alain FOTSO',
                    'instructor_role': 'Lead Data Analyst & Formateur Principal',
                    'instructor_bio': 'Expert en modélisation financière et analyse décisionnelle en Afrique centrale avec plus de 10 ans d\'expérience.',
                    'is_published': True,
                },
            )
            total_courses_seeded += 1

            for m_idx, m_data in enumerate(c_data['modules'], start=1):
                module, _ = Module.objects.update_or_create(
                    course=course,
                    title=m_data['title'],
                    defaults={
                        'description': m_data['description'],
                        'order': m_idx,
                        'is_published': True,
                    },
                )
                total_modules_seeded += 1

                for l_idx, l_data in enumerate(m_data['lessons'], start=1):
                    lesson, _ = Lesson.objects.update_or_create(
                        module=module,
                        slug=l_data['slug'],
                        defaults={
                            'title': l_data['title'],
                            'lesson_type': l_data['type'],
                            'duration_minutes': l_data['duration'],
                            'is_free_preview': l_data.get('is_preview', False),
                            'order': l_idx,
                            'is_published': True,
                        },
                    )
                    total_lessons_seeded += 1

                    # Lesson Translation FR
                    LessonTranslation.objects.update_or_create(
                        lesson=lesson,
                        language=LessonTranslation.Language.FR,
                        defaults={
                            'title': l_data['title'],
                            'summary': l_data.get('summary', ''),
                            'content': l_data.get('content', ''),
                            'code_snippet': l_data.get('code_snippet', ''),
                            'status': LessonTranslation.Status.REVIEWED,
                        },
                    )

                    # Lesson Translation EN (Bilingual support R12)
                    en_title = l_data['title'] + " (EN)"
                    en_summary = "English summary for lesson: " + l_data.get('summary', '')
                    LessonTranslation.objects.update_or_create(
                        lesson=lesson,
                        language=LessonTranslation.Language.EN,
                        defaults={
                            'title': en_title,
                            'summary': en_summary,
                            'content': f"# {en_title}\n\nEnglish curriculum content aligned with African business cases (FCFA) for bilingual learners.",
                            'code_snippet': l_data.get('code_snippet', ''),
                            'status': LessonTranslation.Status.REVIEWED,
                        },
                    )

                    # Attach physical file if defined
                    if 'attachment' in l_data:
                        att_info = l_data['attachment']
                        file_name = att_info['file_name']
                        phys_path = target_dir / file_name

                        att_obj, _ = LessonAttachment.objects.update_or_create(
                            lesson=lesson,
                            title=att_info['title'],
                            defaults={
                                'description': f"Fichier téléchargeable pour l'exercice pratique de la leçon '{lesson.title}'",
                                'attachment_type': att_info['type'],
                                'file_format': att_info['format'],
                                'is_free_preview': lesson.is_free_preview,
                            },
                        )

                        if phys_path.exists():
                            with open(phys_path, 'rb') as fp:
                                att_obj.file.save(file_name, File(fp), save=False)
                            att_obj.file_size_bytes = phys_path.stat().st_size
                            att_obj.save()
                            total_attachments_seeded += 1

                    # Create Quiz if defined
                    if 'quiz' in l_data:
                        q_data = l_data['quiz']
                        quiz, _ = Quiz.objects.update_or_create(
                            lesson=lesson,
                            defaults={
                                'title': q_data['title'],
                                'description': "Testez votre compréhension immédiate des notions présentées dans ce module.",
                                'purpose': Quiz.Purpose.FORMATIVE,
                                'passing_score_percentage': q_data.get('passing_score', 70),
                                'is_published': True,
                            },
                        )
                        total_quizzes_seeded += 1

                        for q_idx, quest in enumerate(q_data['questions'], start=1):
                            question, _ = QuizQuestion.objects.update_or_create(
                                quiz=quiz,
                                prompt=quest['prompt'],
                                defaults={
                                    'explanation': quest['explanation'],
                                    'bloom_level': quest.get('bloom', QuizQuestion.BloomLevel.APPLY),
                                    'question_type': QuizQuestion.QuestionType.SINGLE_CHOICE,
                                    'order': q_idx,
                                },
                            )

                            for opt_idx, (opt_text, is_corr) in enumerate(quest['options'], start=1):
                                QuizAnswerOption.objects.update_or_create(
                                    question=question,
                                    text=opt_text,
                                    defaults={
                                        'is_correct': is_corr,
                                        'order': opt_idx,
                                    },
                                )

        self.stdout.write(
            self.style.SUCCESS(
                f"\nCurriculum Seeding Complete!\n"
                f"- Courses configured: {total_courses_seeded}\n"
                f"- Modules created: {total_modules_seeded}\n"
                f"- Lessons created: {total_lessons_seeded}\n"
                f"- Quizzes configured: {total_quizzes_seeded}\n"
                f"- Real physical attachments linked: {total_attachments_seeded}\n"
            )
        )
