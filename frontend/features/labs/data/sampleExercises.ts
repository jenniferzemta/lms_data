import { LabExercise } from '../types';

export const SQL_MICROFINANCE_EXERCISES: LabExercise[] = [
  {
    id: 'sql-ex-1',
    slug: 'clients-douala-filtre',
    labType: 'sql',
    title: 'Atelier 1 : Identifier les clients de la zone commerciale de Douala',
    instruction: 'La direction commerciale de la microfinance souhaite envoyer une campagne SMS aux adhérents basés à Douala. Écrivez une requête SQL pour extraire le nom, la ville et le numéro de téléphone de tous les clients résidant à Douala.',
    context: 'Contexte : Microfinance Cameroun — Base Clients Douala & Yaoundé',
    initialCode: `-- Atelier 1 : Extraction des clients de Douala
-- Écrivez votre requête SELECT ci-dessous :
SELECT nom, ville, telephone
FROM clients
WHERE ville = 'Douala';`,
    solutionCode: `SELECT nom, ville, telephone FROM clients WHERE ville = 'Douala';`,
    bloomLevel: 'APPLY',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'La requête doit interroger la table "clients"',
        type: 'contains',
        expectedPattern: /from\s+clients/i
      },
      {
        id: 'r2',
        description: 'Les colonnes "nom", "ville" et "telephone" doivent être sélectionnées',
        type: 'columns',
        expectedColumns: ['nom', 'ville', 'telephone']
      },
      {
        id: 'r3',
        description: 'Seuls les clients domiciliés à "Douala" doivent être retournés',
        type: 'row_count',
        expectedRowCount: 3
      }
    ],
    hints: [
      "Indice 1 : Utilisez la clause FROM clients pour désigner la table source.",
      "Indice 2 : Filtrez la ville avec la clause WHERE : WHERE ville = 'Douala'. Attention aux majuscules.",
      "Indice 3 : Sélectionnez uniquement les trois colonnes demandées : SELECT nom, ville, telephone."
    ]
  },
  {
    id: 'sql-ex-2',
    slug: 'credits-importants-en-cours',
    labType: 'sql',
    title: 'Atelier 2 : Filtrer les crédits actifs supérieurs à 1 500 000 FCFA',
    instruction: 'Pour le comité des risques mensuel, extrayez tous les crédits actuellement "EN_COURS" dont le montant emprunté est supérieur ou égal à 1 500 000 FCFA. Affichez l\'identifiant du crédit, l\'agence, le montant emprunté et le taux d\'intérêt.',
    context: 'Contexte : Direction des Risques & Portefeuille de Crédits',
    initialCode: `-- Atelier 2 : Crédits importants en cours
-- Complétez la requête :
SELECT id, agence, montant_emprunte_fcfa, taux_interet_pct
FROM credits
WHERE statut_remboursement = 'EN_COURS'
  AND montant_emprunte_fcfa >= 1500000;`,
    solutionCode: `SELECT id, agence, montant_emprunte_fcfa, taux_interet_pct FROM credits WHERE statut_remboursement = 'EN_COURS' AND montant_emprunte_fcfa >= 1500000;`,
    bloomLevel: 'APPLY',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'La requête doit cibler la table "credits"',
        type: 'contains',
        expectedPattern: /from\s+credits/i
      },
      {
        id: 'r2',
        description: 'Colonnes attendues : id, agence, montant_emprunte_fcfa, taux_interet_pct',
        type: 'columns',
        expectedColumns: ['id', 'agence', 'montant_emprunte_fcfa', 'taux_interet_pct']
      },
      {
        id: 'r3',
        description: 'Doit combiner statut_remboursement = \'EN_COURS\' et montant_emprunte_fcfa >= 1500000 (4 crédits attendus)',
        type: 'row_count',
        expectedRowCount: 4
      }
    ],
    hints: [
      "Indice 1 : Utilisez l'opérateur AND pour combiner les deux conditions dans la clause WHERE.",
      "Indice 2 : La condition de montant s'écrit montant_emprunte_fcfa >= 1500000 sans espace ni virgule dans le chiffre.",
      "Indice 3 : La condition de statut s'écrit statut_remboursement = 'EN_COURS'."
    ]
  },
  {
    id: 'sql-ex-3',
    slug: 'volume-financement-par-agence',
    labType: 'sql',
    title: 'Atelier 3 : Calculer le volume total de crédits accordés par agence',
    instruction: 'La Direction Générale veut connaître l\'exposition financière de chaque agence. Écrivez une requête qui regroupe les crédits par agence et calcule le nombre de crédits accordés ainsi que la somme totale des montants empruntés en FCFA.',
    context: 'Contexte : Tableau de bord décisionnel & consolidation agences',
    initialCode: `-- Atelier 3 : Agrégation par agence
-- Utilisez GROUP BY et les fonctions d'agrégation COUNT et SUM :
SELECT agence, 
       COUNT(*) AS nombre_credits, 
       SUM(montant_emprunte_fcfa) AS total_emprunte_fcfa
FROM credits
GROUP BY agence
ORDER BY total_emprunte_fcfa DESC;`,
    solutionCode: `SELECT agence, COUNT(*) AS nombre_credits, SUM(montant_emprunte_fcfa) AS total_emprunte_fcfa FROM credits GROUP BY agence ORDER BY total_emprunte_fcfa DESC;`,
    bloomLevel: 'ANALYZE',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'Utilisation obligatoire de GROUP BY agence',
        type: 'contains',
        expectedPattern: /group\s+by\s+agence/i
      },
      {
        id: 'r2',
        description: 'Présence des colonnes agence, nombre_credits (ou COUNT) et total_emprunte_fcfa (ou SUM)',
        type: 'columns',
        expectedColumns: ['agence']
      },
      {
        id: 'r3',
        description: 'Retourne exactement 4 agences consolidées (Douala-Akwa, Bafoussam-Centre, Douala-Bonanjo, etc.)',
        type: 'row_count',
        expectedRowCount: 5
      }
    ],
    hints: [
      "Indice 1 : Pensez à regrouper les résultats avec GROUP BY agence.",
      "Indice 2 : Utilisez COUNT(*) pour le nombre de dossiers et SUM(montant_emprunte_fcfa) pour l'encours total.",
      "Indice 3 : Vous pouvez ordonner du plus grand au plus petit avec ORDER BY total_emprunte_fcfa DESC."
    ]
  },
  {
    id: 'sql-ex-4',
    slug: 'recouvrement-clients-en-retard',
    labType: 'sql',
    title: 'Atelier 4 : Jointure pour identifier les clients en retard de paiement',
    instruction: 'Le service contentieux a besoin de relancer les clients qui ont un dossier en statut "EN_RETARD". Effectuez une jointure entre la table "clients" et la table "credits" pour afficher le nom du client, son téléphone, son agence, et le montant emprunté impayé.',
    context: 'Contexte : Recouvrement des créances & Relances téléphoniques',
    initialCode: `-- Atelier 4 : Jointure Clients et Crédits en retard
-- Réalisez une jointure INNER JOIN sur client_id :
SELECT c.nom, c.telephone, cr.agence, cr.montant_emprunte_fcfa
FROM clients c
JOIN credits cr ON c.id = cr.client_id
WHERE cr.statut_remboursement = 'EN_RETARD';`,
    solutionCode: `SELECT c.nom, c.telephone, cr.agence, cr.montant_emprunte_fcfa FROM clients c JOIN credits cr ON c.id = cr.client_id WHERE cr.statut_remboursement = 'EN_RETARD';`,
    bloomLevel: 'ANALYZE',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'Jointure explicite entre les tables clients et credits',
        type: 'contains',
        expectedPattern: /join\s+credits/i
      },
      {
        id: 'r2',
        description: 'Colonnes sélectionnées : nom, telephone, agence, montant_emprunte_fcfa',
        type: 'columns',
        expectedColumns: ['nom', 'telephone', 'agence', 'montant_emprunte_fcfa']
      },
      {
        id: 'r3',
        description: 'Retourne exactement les 2 dossiers en retard (Bello Ibrahim et Mballa Suzanne)',
        type: 'row_count',
        expectedRowCount: 2
      }
    ],
    hints: [
      "Indice 1 : Reliez les tables avec la condition ON clients.id = credits.client_id.",
      "Indice 2 : Utilisez des alias de table (FROM clients c JOIN credits cr ON c.id = cr.client_id) pour rendre votre code plus lisible.",
      "Indice 3 : Filtrez sur le statut avec WHERE cr.statut_remboursement = 'EN_RETARD'."
    ]
  }
];

