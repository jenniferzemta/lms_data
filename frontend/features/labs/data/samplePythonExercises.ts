import { LabExercise } from '../types';

export const PYTHON_PANDAS_EXERCISES: LabExercise[] = [
  {
    id: 'py-ex-1',
    slug: 'pandas-chargement-inspection',
    labType: 'python',
    title: 'Atelier 1 : Charger et inspecter un fichier de ventes avec Pandas',
    instruction: 'Vous venez de recevoir le fichier "ventes_cameroun.csv" de la direction commerciale. Importez la bibliothèque Pandas, chargez le fichier CSV dans un DataFrame nommé "df", puis affichez les 5 premières lignes avec la méthode .head() ainsi que les dimensions (.shape) du jeu de données.',
    context: 'Contexte : Direction Commerciale — Consolidation des ventes trimestrielles',
    initialCode: `# Atelier 1 : Découverte de Pandas
import pandas as pd

# Chargez le fichier ventes_cameroun.csv
df = pd.read_csv('ventes_cameroun.csv')

# Affichez les 5 premières lignes
print(df.head())

# Affichez le nombre de lignes et colonnes
print("Dimensions :", df.shape)`,
    solutionCode: `import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')
print(df.head())
print("Dimensions :", df.shape)`,
    bloomLevel: 'UNDERSTAND',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'Import de la bibliothèque pandas (import pandas as pd)',
        type: 'contains',
        expectedPattern: /import\s+pandas\s+as\s+pd/i
      },
      {
        id: 'r2',
        description: 'Chargement du fichier avec pd.read_csv(\'ventes_cameroun.csv\')',
        type: 'contains',
        expectedPattern: /pd\.read_csv/i
      },
      {
        id: 'r3',
        description: 'Utilisation de .head() pour visualiser les premières lignes',
        type: 'contains',
        expectedPattern: /df\.head/i
      }
    ],
    hints: [
      "Indice 1 : Utilisez l'alias conventionnel : import pandas as pd.",
      "Indice 2 : La fonction pd.read_csv('ventes_cameroun.csv') crée automatiquement un objet DataFrame.",
      "Indice 3 : La méthode df.head() affiche par défaut les 5 premiers enregistrements."
    ]
  },
  {
    id: 'py-ex-2',
    slug: 'pandas-filtrage-commandes-importantes',
    labType: 'python',
    title: 'Atelier 2 : Filtrer les commandes de Douala supérieures à 200 000 FCFA',
    instruction: 'Pour le reporting logistique du Port de Douala, isolez les commandes passées à "Douala" dont le montant total est supérieur ou égal à 200 000 FCFA. Stockez le résultat dans un DataFrame "df_douala" et affichez-le.',
    context: 'Contexte : Hub Logistique Littoral & Grands Comptes',
    initialCode: `# Atelier 2 : Filtrage conditionnel
import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')

# Filtrez les ventes de Douala >= 200 000 FCFA
# Utilisez l'opérateur & entre parenthèses
df_douala = df[(df['ville'] == 'Douala') & (df['montant_total_fcfa'] >= 200000)]

print(df_douala[['client', 'produit', 'montant_total_fcfa']])`,
    solutionCode: `import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')
df_douala = df[(df['ville'] == 'Douala') & (df['montant_total_fcfa'] >= 200000)]
print(df_douala[['client', 'produit', 'montant_total_fcfa']])`,
    bloomLevel: 'APPLY',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'Filtrage sur la colonne ville égale à "Douala"',
        type: 'contains',
        expectedPattern: /ville['"]\s*==\s*['"]Douala['"]/i
      },
      {
        id: 'r2',
        description: 'Condition de montant total >= 200 000 FCFA',
        type: 'contains',
        expectedPattern: /montant_total_fcfa['"]\s*>=\s*200000/i
      },
      {
        id: 'r3',
        description: 'Le DataFrame filtré contient exactement 3 transactions majeures',
        type: 'row_count',
        expectedRowCount: 3
      }
    ],
    hints: [
      "Indice 1 : En Pandas, combinez les conditions booléennes avec le symbole & et entourez chaque condition de parenthèses.",
      "Indice 2 : La syntaxe est : df[(condition_1) & (condition_2)].",
      "Indice 3 : Ne mettez aucun séparateur de milliers dans le nombre 200000."
    ]
  },
  {
    id: 'py-ex-3',
    slug: 'pandas-groupby-chiffre-affaires-villes',
    labType: 'python',
    title: 'Atelier 3 : Agréger le chiffre d\'affaires total par ville avec .groupby()',
    instruction: 'La Direction Générale veut comparer la performance des différentes villes camerounaises. Utilisez la méthode .groupby(\'ville\') pour calculer la somme totale du chiffre d\'affaires (montant_total_fcfa) par ville, et ordonnez le résultat par ordre décroissant.',
    context: 'Contexte : Tableau de bord commercial de direction',
    initialCode: `# Atelier 3 : Agrégation GroupBy
import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')

# Calculez la somme du montant par ville
ca_par_ville = df.groupby('ville')['montant_total_fcfa'].sum().sort_values(ascending=False)

print("Chiffre d'affaires total par ville (FCFA) :")
print(ca_par_ville)`,
    solutionCode: `import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')
ca_par_ville = df.groupby('ville')['montant_total_fcfa'].sum().sort_values(ascending=False)
print(ca_par_ville)`,
    bloomLevel: 'ANALYZE',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'Utilisation de .groupby(\'ville\')',
        type: 'contains',
        expectedPattern: /\.groupby\(\s*['"]ville['"]\s*\)/i
      },
      {
        id: 'r2',
        description: 'Sélection et agrégation .sum() sur montant_total_fcfa',
        type: 'contains',
        expectedPattern: /montant_total_fcfa['"]\s*\]\s*\.sum\(\)/i
      },
      {
        id: 'r3',
        description: 'Agrégation sur les 4 villes (Douala en tête avec > 2.8M FCFA)',
        type: 'contains',
        expectedPattern: /Douala/i
      }
    ],
    hints: [
      "Indice 1 : La méthode groupby prend en paramètre le nom de la colonne de regroupement : df.groupby('ville').",
      "Indice 2 : Ajoutez ['montant_total_fcfa'].sum() pour additionner les montants.",
      "Indice 3 : Pour trier du plus grand au plus petit, terminez par .sort_values(ascending=False)."
    ]
  },
  {
    id: 'py-ex-4',
    slug: 'pandas-colonne-calculee-marge',
    labType: 'python',
    title: 'Atelier 4 : Créer une colonne calculée de marge commerciale brute (20%)',
    instruction: 'Le contrôleur de gestion vous demande d\'évaluer la marge brute réalisée sur chaque vente, estimée à 20% du montant total. Créez une nouvelle colonne nommée "marge_fcfa" dans le DataFrame égale à montant_total_fcfa * 0.20, puis affichez la somme totale des marges générées.',
    context: 'Contexte : Contrôle de gestion & Rentabilité financière',
    initialCode: `# Atelier 4 : Colonne calculée
import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')

# Créez la colonne marge_fcfa (20% du montant total)
df['marge_fcfa'] = df['montant_total_fcfa'] * 0.20

# Affichez la marge totale générée en FCFA
marge_totale = df['marge_fcfa'].sum()
print("Marge brute totale réalisée :", int(marge_totale), "FCFA")
print(df[['produit', 'montant_total_fcfa', 'marge_fcfa']].head(3))`,
    solutionCode: `import pandas as pd
df = pd.read_csv('ventes_cameroun.csv')
df['marge_fcfa'] = df['montant_total_fcfa'] * 0.20
print(df[['produit', 'montant_total_fcfa', 'marge_fcfa']].head(3))`,
    bloomLevel: 'ANALYZE',
    maxPoints: 100,
    rules: [
      {
        id: 'r1',
        description: 'Création de la colonne df[\'marge_fcfa\']',
        type: 'contains',
        expectedPattern: /df\[['"]marge_fcfa['"]\]/i
      },
      {
        id: 'r2',
        description: 'Multiplication du montant par 0.20 ou division par 5',
        type: 'contains',
        expectedPattern: /montant_total_fcfa['"]\]\s*\*\s*0\.2/i
      },
      {
        id: 'r3',
        description: 'Calcul correct de la marge totale (> 1 000 000 FCFA)',
        type: 'contains',
        expectedPattern: /1051680/i
      }
    ],
    hints: [
      "Indice 1 : En Pandas, on crée une nouvelle colonne par simple affectation : df['nom_colonne'] = ...",
      "Indice 2 : La formule vectorisée est : df['montant_total_fcfa'] * 0.20.",
      "Indice 3 : Vous pouvez sommer la colonne créée avec df['marge_fcfa'].sum()."
    ]
  }
];
