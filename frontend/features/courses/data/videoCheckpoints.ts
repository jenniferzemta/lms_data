import { VideoCheckpointQuestion, VideoChapter } from '../types';

export interface LessonVideoEnhancements {
  checkpoints: VideoCheckpointQuestion[];
  chapters: VideoChapter[];
}

export const LESSON_VIDEO_ENHANCEMENTS: Record<string, LessonVideoEnhancements> = {
  // Default Excel Lesson 1
  'environnement-et-types-de-donnees': {
    chapters: [
      { id: 'c1', title: 'Présentation de l\'interface Excel', timecodeSeconds: 0 },
      { id: 'c2', title: 'Ruban, barre de formule et cellules', timecodeSeconds: 45 },
      { id: 'c3', title: 'Types de données : texte vs nombres en FCFA', timecodeSeconds: 105 },
      { id: 'c4', title: 'Mise en situation Kamer SARL', timecodeSeconds: 180 }
    ],
    checkpoints: [
      {
        id: 'cp-excel-1',
        timecodeSeconds: 65,
        title: 'Vérification Ruban & Formules',
        question: 'Où s\'affiche le contenu exact ou la formule de la cellule active dans Excel ?',
        options: [
          { id: 'o1', text: 'Dans la barre de titre en haut à droite', isCorrect: false },
          { id: 'o2', text: 'Dans la barre de formule (fx) située au-dessus de la grille', isCorrect: true },
          { id: 'o3', text: 'Uniquement dans la barre d\'état en bas', isCorrect: false }
        ],
        explanation: 'La barre de formule (fx) permet de visualiser et d\'éditer la formule sous-jacente sans altérer la mise en forme affichée dans la cellule.'
      },
      {
        id: 'cp-excel-2',
        timecodeSeconds: 125,
        title: 'Types de Données & Alignement',
        question: 'Par défaut dans Excel, comment sont alignés les nombres et montants en FCFA dans une cellule non formatée ?',
        options: [
          { id: 'o1', text: 'Alignés à droite', isCorrect: true },
          { id: 'o2', text: 'Alignés à gauche comme le texte', isCorrect: false },
          { id: 'o3', text: 'Centrés automatiquement', isCorrect: false }
        ],
        explanation: 'Dans Excel, les valeurs numériques sont alignées à droite par défaut. Un alignement à gauche indique généralement qu\'un chiffre est stocké au format texte (piège fréquent dans les imports de factures).'
      }
    ]
  },

  // Excel Lesson 2
  'formules-fondamentales-somme-si': {
    chapters: [
      { id: 'c1', title: 'Introduction à la fonction SOMME', timecodeSeconds: 0 },
      { id: 'c2', title: 'Séparateurs d\'arguments en français', timecodeSeconds: 50 },
      { id: 'c3', title: 'Calcul conditionnel avec SOMME.SI', timecodeSeconds: 120 }
    ],
    checkpoints: [
      {
        id: 'cp-excel-somme-1',
        timecodeSeconds: 60,
        title: 'Séparateur d\'arguments',
        question: 'Sous les versions françaises d\'Excel (système métrique camerounais), quel symbole sépare les arguments d\'une fonction ?',
        options: [
          { id: 'o1', text: 'La virgule (,)', isCorrect: false },
          { id: 'o2', text: 'Le point-virgule (;)', isCorrect: true },
          { id: 'o3', text: 'Le deux-points (:)', isCorrect: false }
        ],
        explanation: 'En français, la virgule servant de séparateur décimal (ex: 12,50 FCFA), Excel utilise le point-virgule (;) pour séparer les arguments des formules.'
      }
    ]
  },

  // SQL Lesson 1
  'select-from-where-microfinance': {
    chapters: [
      { id: 'c1', title: 'Introduction aux bases relationnelles', timecodeSeconds: 0 },
      { id: 'c2', title: 'Structure de la requête SELECT ... FROM', timecodeSeconds: 40 },
      { id: 'c3', title: 'Filtrer les crédits avec WHERE', timecodeSeconds: 95 }
    ],
    checkpoints: [
      {
        id: 'cp-sql-1',
        timecodeSeconds: 55,
        title: 'Ordre des clauses SQL',
        question: 'Quelle clause spécifie la table de la base de données à interroger ?',
        options: [
          { id: 'o1', text: 'SELECT', isCorrect: false },
          { id: 'o2', text: 'FROM', isCorrect: true },
          { id: 'o3', text: 'WHERE', isCorrect: false }
        ],
        explanation: 'La clause FROM indique la table source (ex: FROM clients), tandis que SELECT détermine les colonnes à afficher.'
      }
    ]
  }
};

export function getLessonVideoEnhancements(lessonSlug: string): LessonVideoEnhancements {
  return LESSON_VIDEO_ENHANCEMENTS[lessonSlug] || {
    chapters: [
      { id: 'c1', title: 'Introduction au cas pratique', timecodeSeconds: 0 },
      { id: 'c2', title: 'Démonstration des concepts clés', timecodeSeconds: 60 },
      { id: 'c3', title: 'Application sur les données FCFA', timecodeSeconds: 180 }
    ],
    checkpoints: [
      {
        id: `cp-${lessonSlug}-1`,
        timecodeSeconds: 70,
        title: 'Contrôle de compréhension',
        question: 'Dans une démarche d\'analyse de données rigoureuse, quelle est la première étape avant tout calcul ?',
        options: [
          { id: 'o1', text: 'Vérifier et nettoyer la structure des données brutes', isCorrect: true },
          { id: 'o2', text: 'Créer directement des graphiques 3D', isCorrect: false },
          { id: 'o3', text: 'Supprimer toutes les colonnes contenant du texte', isCorrect: false }
        ],
        explanation: 'La fiabilisation et le contrôle des données brutes (nettoyage, détection des doublons, typage) sont indispensables avant toute analyse chiffrée.'
      }
    ]
  };
}

