import { LabExercise, ExcelLabState } from '../types';

export const SAMPLE_EXCEL_EXERCISES: LabExercise[] = [
  {
    id: 'excel-1-somme-moyenne',
    slug: 'somme-et-moyenne',
    labType: 'excel',
    title: 'Atelier 1 : Chiffre d\'Affaires Total & Panier Moyen (SOMME, MOYENNE)',
    context:
      'La direction de la quincaillerie ETS MBALLA & FRÈRES à Douala clôture sa journée commerciale. Le responsable des ventes vous demande de calculer automatiquement le Chiffre d\'Affaires brut total de la journée ainsi que le panier moyen par article vendu.',
    instruction:
      '1. Cliquez sur la cellule F13 (Total Ventes) et saisissez la formule =SOMME(F2:F11)\n2. Cliquez sur la cellule F14 (Panier Moyen) et saisissez la formule =MOYENNE(F2:F11)\n3. Appuyez sur Entrée et vérifiez que les totaux s\'affichent en FCFA.',
    initialCode: 'F13',
    solutionCode: '=SOMME(F2:F11)\n=MOYENNE(F2:F11)',
    hints: [
      'Pour le total, sélectionnez la cellule F13, puis entrez =SOMME(F2:F11) dans la barre de formule au-dessus de la grille.',
      'Pour la moyenne, cliquez sur F14 et tapez =MOYENNE(F2:F11). Vous pouvez aussi utiliser les boutons d\'insertion rapide (fx).',
      'Les versions anglaises =SUM(F2:F11) et =AVERAGE(F2:F11) sont également acceptées.'
    ],
    bloomLevel: 'APPLY',
    maxPoints: 25,
    courseSlug: 'excel-fondamentaux',
    lessonSlug: 'somme-moyenne-automatique',
    rules: [
      {
        id: 'r1-somme-formule',
        description: 'La cellule F13 doit contenir la formule =SOMME(F2:F11) ou =SUM(F2:F11)',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          const raw = (state.cells['F13']?.raw || '').toUpperCase().replace(/\s+/g, '');
          return raw.includes('SOMME(F2:F11)') || raw.includes('SUM(F2:F11)');
        }
      },
      {
        id: 'r2-somme-valeur',
        description: 'Le montant total en F13 doit être exactement de 2 740 000 FCFA',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          return Number(state.cells['F13']?.value) === 2740000;
        }
      },
      {
        id: 'r3-moyenne-formule',
        description: 'La cellule F14 doit contenir la formule =MOYENNE(F2:F11) ou =AVERAGE(F2:F11)',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          const raw = (state.cells['F14']?.raw || '').toUpperCase().replace(/\s+/g, '');
          return raw.includes('MOYENNE(F2:F11)') || raw.includes('AVERAGE(F2:F11)');
        }
      },
      {
        id: 'r4-moyenne-valeur',
        description: 'Le panier moyen en F14 doit être exactement de 274 000 FCFA',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          return Number(state.cells['F14']?.value) === 274000;
        }
      }
    ]
  },
  {
    id: 'excel-2-fonction-si',
    slug: 'remise-conditionnelle-si',
    labType: 'excel',
    title: 'Atelier 2 : Remise Client Conditionnelle (Fonction SI)',
    context:
      'Pour récompenser les grossistes qui commandent des volumes importants, la quincaillerie applique une remise commerciale de 5% (0,05) si le Montant Brut de la ligne est supérieur ou égal à 200 000 FCFA. Dans le cas contraire, aucune remise n\'est accordée (0%).',
    instruction:
      'Dans la colonne Taux Remise (cellule G6 pour l\'article Cadenas Vachette d\'un montant de 112 500 FCFA), saisissez la formule conditionnelle :\n=SI(F6>=200000; 0,05; 0)\nConstatez que le taux obtenu est de 0%.',
    initialCode: 'G6',
    solutionCode: '=SI(F6>=200000; 0.05; 0)',
    hints: [
      'Cliquez sur la cellule G6 (ligne de l\'article ART-005).',
      'Tapez =SI(F6>=200000; 0.05; 0) ou utilisez le séparateur point-virgule (;).',
      'La fonction IF(F6>=200000; 0.05; 0) en anglais est également reconnue.'
    ],
    bloomLevel: 'APPLY',
    maxPoints: 25,
    courseSlug: 'excel-fondamentaux',
    lessonSlug: 'fonctions-logiques-si',
    rules: [
      {
        id: 'r1-si-formule',
        description: 'La cellule G6 doit utiliser la fonction SI (ou IF) testant le seuil de 200 000 FCFA',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          const raw = (state.cells['G6']?.raw || '').toUpperCase().replace(/\s+/g, '');
          return (raw.includes('SI(') || raw.includes('IF(')) && raw.includes('200000');
        }
      },
      {
        id: 'r2-si-valeur',
        description: 'Le taux calculé en G6 pour 112 500 FCFA doit être de 0% (0)',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          return Number(state.cells['G6']?.value) === 0;
        }
      }
    ]
  },
  {
    id: 'excel-3-somme-si',
    slug: 'ventes-par-categorie-somme-si',
    labType: 'excel',
    title: 'Atelier 3 : Total par Catégorie Métier (Fonction SOMME.SI)',
    context:
      'Le responsable financier souhaite isoler les revenus générés uniquement par les matériaux de "Gros Œuvre" (ciment, fer à béton, tôles), afin de renégocier les marges avec les cimenteries et aciéries locales.',
    instruction:
      'Dans la cellule F15 (en face de VENTES GROS ŒUVRE), saisissez la formule d\'agrégation conditionnelle :\n=SOMME.SI(C2:C11; "Gros Œuvre"; F2:F11)',
    initialCode: 'F15',
    solutionCode: '=SOMME.SI(C2:C11; "Gros Œuvre"; F2:F11)',
    hints: [
      'La fonction SOMME.SI prend 3 arguments : la plage à tester (C2:C11), le critère recherché entre guillemets ("Gros Œuvre"), et la plage des valeurs à additionner (F2:F11).',
      'N\'oubliez pas les guillemets autour de "Gros Œuvre".',
      'La formule équivalente anglaise est =SUMIF(C2:C11; "Gros Œuvre"; F2:F11).'
    ],
    bloomLevel: 'ANALYZE',
    maxPoints: 25,
    courseSlug: 'excel-intermediaire',
    lessonSlug: 'somme-si-nb-si',
    rules: [
      {
        id: 'r1-somme-si-formule',
        description: 'La cellule F15 doit contenir la fonction SOMME.SI (ou SUMIF) avec la plage C2:C11 et le critère Gros Œuvre',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          const raw = (state.cells['F15']?.raw || '').toUpperCase().replace(/\s+/g, '');
          return (raw.includes('SOMME.SI(') || raw.includes('SUMIF(')) &&
            raw.includes('C2:C11') &&
            raw.includes('F2:F11');
        }
      },
      {
        id: 'r2-somme-si-valeur',
        description: 'Le total calculé pour le Gros Œuvre en F15 doit être de 1 276 000 FCFA',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          return Number(state.cells['F15']?.value) === 1276000;
        }
      }
    ]
  },
  {
    id: 'excel-4-recherche-v',
    slug: 'recherche-article-recherchev',
    labType: 'excel',
    title: 'Atelier 4 : Fiche Recherche d\'Article (RECHERCHEV / RECHERCHEX)',
    context:
      'Au comptoir de la boutique, le caissier scanne ou saisit le code de l\'article dans la cellule K2 (actuellement "ART-003"). Vous devez faire remonter automatiquement son prix unitaire dans la cellule K3 pour accélérer l\'encaissement sans erreur de saisie.',
    instruction:
      'Dans la cellule K3, utilisez la formule de recherche verticale :\n=RECHERCHEV(K2; A2:D11; 4; FAUX)\n(Alternative moderne admise : =RECHERCHEX(K2; A2:A11; D2:D11))',
    initialCode: 'K3',
    solutionCode: '=RECHERCHEV(K2; A2:D11; 4; FAUX)',
    hints: [
      'RECHERCHEV prend 4 arguments : la clé cherchée (K2), la matrice de la table (A2:D11), le numéro de colonne du prix (4), et FAUX pour une correspondance exacte.',
      'Si vous préférez RECHERCHEX : =RECHERCHEX(K2; A2:A11; D2:D11).',
      'Le résultat pour ART-003 (Peinture Blanche 20L) doit être 28 000 FCFA.'
    ],
    bloomLevel: 'EVALUATE',
    maxPoints: 25,
    courseSlug: 'excel-avance',
    lessonSlug: 'recherchev-recherchex-pro',
    rules: [
      {
        id: 'r1-recherche-formule',
        description: 'La cellule K3 doit utiliser la fonction RECHERCHEV ou RECHERCHEX pour trouver le prix de K2',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          const raw = (state.cells['K3']?.raw || '').toUpperCase().replace(/\s+/g, '');
          const isVlookup = (raw.includes('RECHERCHEV(') || raw.includes('VLOOKUP(')) && raw.includes('K2');
          const isXlookup = (raw.includes('RECHERCHEX(') || raw.includes('XLOOKUP(')) && raw.includes('K2');
          return isVlookup || isXlookup;
        }
      },
      {
        id: 'r2-recherche-valeur',
        description: 'Le prix unitaire retourné en K3 doit être exactement de 28 000 FCFA',
        type: 'custom',
        validator: (data: unknown) => {
          const state = data as ExcelLabState;
          return Number(state.cells['K3']?.value) === 28000;
        }
      }
    ]
  }
];

