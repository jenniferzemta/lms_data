export interface PowerBiSaleRow {
  id: number;
  date: string;
  boutique: string;
  ville: 'Douala' | 'Yaoundé' | 'Bafoussam' | 'Garoua';
  produit: string;
  categorie: 'Sodas' | 'Jus Naturels' | 'Eaux Minérales' | 'Malts';
  quantite: number;
  prix_unitaire_fcfa: number;
  chiffre_affaires_fcfa: number;
  cout_revient_fcfa: number;
  marge_brute_fcfa: number;
}

export const POWERBI_SALES_DATASET: PowerBiSaleRow[] = [
  { id: 1, date: '2026-03-01', boutique: 'Boutique Akwa', ville: 'Douala', produit: 'Kamer Cola 33cl', categorie: 'Sodas', quantite: 120, prix_unitaire_fcfa: 500, chiffre_affaires_fcfa: 60000, cout_revient_fcfa: 36000, marge_brute_fcfa: 24000 },
  { id: 2, date: '2026-03-01', boutique: 'Superette Bastos', ville: 'Yaoundé', produit: 'Jus Ananas de Penja', categorie: 'Jus Naturels', quantite: 80, prix_unitaire_fcfa: 800, chiffre_affaires_fcfa: 64000, cout_revient_fcfa: 40000, marge_brute_fcfa: 24000 },
  { id: 3, date: '2026-03-02', boutique: 'Dépôt Marché A', ville: 'Bafoussam', produit: 'Eau Tangui 1.5L', categorie: 'Eaux Minérales', quantite: 200, prix_unitaire_fcfa: 400, chiffre_affaires_fcfa: 80000, cout_revient_fcfa: 50000, marge_brute_fcfa: 30000 },
  { id: 4, date: '2026-03-02', boutique: 'Comptoir Sahel', ville: 'Garoua', produit: 'Kamer Malt 50cl', categorie: 'Malts', quantite: 90, prix_unitaire_fcfa: 650, chiffre_affaires_fcfa: 58500, cout_revient_fcfa: 36000, marge_brute_fcfa: 22500 },
  { id: 5, date: '2026-03-03', boutique: 'Boutique Bonapriso', ville: 'Douala', produit: 'Jus Ananas de Penja', categorie: 'Jus Naturels', quantite: 150, prix_unitaire_fcfa: 800, chiffre_affaires_fcfa: 120000, cout_revient_fcfa: 75000, marge_brute_fcfa: 45000 },
  { id: 6, date: '2026-03-03', boutique: 'Relais Mokolo', ville: 'Yaoundé', produit: 'Kamer Cola 33cl', categorie: 'Sodas', quantite: 180, prix_unitaire_fcfa: 500, chiffre_affaires_fcfa: 90000, cout_revient_fcfa: 54000, marge_brute_fcfa: 36000 },
  { id: 7, date: '2026-03-04', boutique: 'Dépôt Marché B', ville: 'Bafoussam', produit: 'Kamer Malt 50cl', categorie: 'Malts', quantite: 110, prix_unitaire_fcfa: 650, chiffre_affaires_fcfa: 71500, cout_revient_fcfa: 44000, marge_brute_fcfa: 27500 },
  { id: 8, date: '2026-03-04', boutique: 'Comptoir Sahel', ville: 'Garoua', produit: 'Eau Tangui 1.5L', categorie: 'Eaux Minérales', quantite: 250, prix_unitaire_fcfa: 400, chiffre_affaires_fcfa: 100000, cout_revient_fcfa: 62500, marge_brute_fcfa: 37500 },
  { id: 9, date: '2026-03-05', boutique: 'Boutique Deido', ville: 'Douala', produit: 'Kamer Cola 33cl', categorie: 'Sodas', quantite: 220, prix_unitaire_fcfa: 500, chiffre_affaires_fcfa: 110000, cout_revient_fcfa: 66000, marge_brute_fcfa: 44000 },
  { id: 10, date: '2026-03-05', boutique: 'Superette Bastos', ville: 'Yaoundé', produit: 'Kamer Malt 50cl', categorie: 'Malts', quantite: 140, prix_unitaire_fcfa: 650, chiffre_affaires_fcfa: 91000, cout_revient_fcfa: 56000, marge_brute_fcfa: 35000 },
  { id: 11, date: '2026-03-06', boutique: 'Boutique Akwa', ville: 'Douala', produit: 'Eau Tangui 1.5L', categorie: 'Eaux Minérales', quantite: 300, prix_unitaire_fcfa: 400, chiffre_affaires_fcfa: 120000, cout_revient_fcfa: 75000, marge_brute_fcfa: 45000 },
  { id: 12, date: '2026-03-06', boutique: 'Relais Mokolo', ville: 'Yaoundé', produit: 'Jus Ananas de Penja', categorie: 'Jus Naturels', quantite: 100, prix_unitaire_fcfa: 800, chiffre_affaires_fcfa: 80000, cout_revient_fcfa: 50000, marge_brute_fcfa: 30000 },
];

export interface DaxMeasure {
  name: string;
  expression: string;
  formattedValue?: string;
  rawValue?: number | string;
}

export const SAMPLE_POWERBI_EXERCISES = [
  {
    id: 'pbi-ex-1',
    slug: 'mesure-dax-total-ventes',
    labType: 'powerbi' as const,
    title: "Atelier 3.1 : Création de la Mesure DAX [Total Ventes FCFA]",
    instruction: "Écrivez la mesure DAX 'Total Ventes' qui calcule la somme de la colonne 'chiffre_affaires_fcfa' de la table Ventes.",
    context: "Pour piloter la performance commerciale de Kamer Boissons SARL, vous devez créer l'indicateur fondamental de Chiffre d'Affaires global.",
    initialCode: "Total Ventes = SUM(Ventes[chiffre_affaires_fcfa])",
    solutionCode: "Total Ventes = SUM(Ventes[chiffre_affaires_fcfa])",
    rules: [
      {
        id: 'r1',
        description: "Contient la fonction DAX SUM",
        type: 'contains' as const,
        expectedPattern: /SUM\s*\(/i,
      },
      {
        id: 'r2',
        description: "Cible la colonne chiffre_affaires_fcfa de la table Ventes",
        type: 'contains' as const,
        expectedPattern: /Ventes\[chiffre_affaires_fcfa\]/i,
      },
    ],
    hints: [
      "La syntaxe d'une mesure DAX commence par : NomMesure = FONCTION(Table[Colonne])",
      "Utilisez SUM(Ventes[chiffre_affaires_fcfa]).",
      "Écrivez exactement : Total Ventes = SUM(Ventes[chiffre_affaires_fcfa])",
    ],
    bloomLevel: 'APPLY' as const,
    maxPoints: 100,
  },
  {
    id: 'pbi-ex-2',
    slug: 'mesure-dax-calculate-filtre-douala',
    labType: 'powerbi' as const,
    title: "Atelier 3.2 : Contexte de Filtre avec CALCULATE (Ventes Douala)",
    instruction: "Créez la mesure DAX 'Ventes Douala' qui calcule le chiffre d'affaires uniquement pour les boutiques situées dans la ville de 'Douala'.",
    context: "La direction commerciale souhaite isoler les performances de la capitale économique (Douala) indépendamment du filtre de page actif.",
    initialCode: "Ventes Douala = CALCULATE(\n    [Total Ventes],\n    Ventes[ville] = \"Douala\"\n)",
    solutionCode: "Ventes Douala = CALCULATE(\n    [Total Ventes],\n    Ventes[ville] = \"Douala\"\n)",
    rules: [
      {
        id: 'r1',
        description: "Utilise la fonction CALCULATE pour modifier le contexte de filtre",
        type: 'contains' as const,
        expectedPattern: /CALCULATE\s*\(/i,
      },
      {
        id: 'r2',
        description: "Filtre sur la ville de Douala",
        type: 'contains' as const,
        expectedPattern: /"Douala"/i,
      },
    ],
    hints: [
      "CALCULATE prend en 1er argument l'expression à évaluer (ex: [Total Ventes] ou SUM(...)) et en second argument le filtre conditionnel.",
      "Le filtre s'écrit : Ventes[ville] = \"Douala\".",
      "Syntaxe : Ventes Douala = CALCULATE([Total Ventes], Ventes[ville] = \"Douala\")",
    ],
    bloomLevel: 'ANALYZE' as const,
    maxPoints: 100,
  },
  {
    id: 'pbi-ex-3',
    slug: 'mesure-dax-divide-marge-pourcent',
    labType: 'powerbi' as const,
    title: "Atelier 3.3 : Calcul Sécurisé du Taux de Marge avec DIVIDE",
    instruction: "Écrivez la mesure 'Taux de Marge' qui divise la somme des marges brutes par la somme du chiffre d'affaires à l'aide de la fonction sécurisée DIVIDE.",
    context: "En DAX, l'opérateur '/' peut générer des erreurs en cas de division par zéro. La fonction DIVIDE(num, den, 0) garantit un calcul robuste.",
    initialCode: "Taux de Marge = DIVIDE(\n    SUM(Ventes[marge_brute_fcfa]),\n    SUM(Ventes[chiffre_affaires_fcfa]),\n    0\n)",
    solutionCode: "Taux de Marge = DIVIDE(\n    SUM(Ventes[marge_brute_fcfa]),\n    SUM(Ventes[chiffre_affaires_fcfa]),\n    0\n)",
    rules: [
      {
        id: 'r1',
        description: "Utilise la fonction DIVIDE",
        type: 'contains' as const,
        expectedPattern: /DIVIDE\s*\(/i,
      },
      {
        id: 'r2',
        description: "Associe marge_brute_fcfa et chiffre_affaires_fcfa",
        type: 'contains' as const,
        expectedPattern: /marge_brute_fcfa/i,
      },
    ],
    hints: [
      "DIVIDE prend 3 arguments : numérateur, dénominateur et valeur de repli facultative (0).",
      "Numérateur : SUM(Ventes[marge_brute_fcfa]).",
      "Dénominateur : SUM(Ventes[chiffre_affaires_fcfa]).",
    ],
    bloomLevel: 'EVALUATE' as const,
    maxPoints: 100,
  },
];
