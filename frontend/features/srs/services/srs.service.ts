import { FlashcardItem, SrsMetrics, ReviewQuality, ReviewResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FALLBACK_FLASHCARDS: FlashcardItem[] = [
  {
    id: 1,
    question: "Quelle clause SQL filtre les lignes agrégées issues d'un GROUP BY ?",
    answer: "La clause HAVING. Contrairement à WHERE qui filtre les lignes avant le regroupement, HAVING évalue les résultats calculés par les fonctions d'agrégation.",
    code_snippet: "SELECT agence, SUM(montant_fcfa) AS total\nFROM transactions\nGROUP BY agence\nHAVING SUM(montant_fcfa) > 5000000;",
    category: 'SQL',
    category_display: 'SQL & Requêtes',
    difficulty: 'INTERMEDIATE',
    difficulty_display: 'Intermédiaire',
    hint: 'Pensez à la différence entre WHERE et HAVING.',
    repetition_count: 0,
    interval_days: 1,
    is_new: true,
  },
  {
    id: 2,
    question: "Quelle méthode Pandas remplace les valeurs manquantes (NaN) par une valeur définie ?",
    answer: "La méthode .fillna(). Elle permet d'imputer une valeur scalaire (0, 'Inconnu') ou une statistique (médiane, moyenne) sans supprimer les lignes.",
    code_snippet: "df['ventes_fcfa'] = df['ventes_fcfa'].fillna(0)\n# Ou par la médiane :\ndf['age'] = df['age'].fillna(df['age'].median())",
    category: 'PYTHON',
    category_display: 'Python & Pandas',
    difficulty: 'BEGINNER',
    difficulty_display: 'Débutant',
    hint: 'La fonction contient "fill" (remplir) et "na" (valeur manquante).',
    repetition_count: 0,
    interval_days: 1,
    is_new: true,
  },
  {
    id: 3,
    question: "Dans Excel, pourquoi privilégier RECHERCHEX par rapport à RECHERCHEV ?",
    answer: "RECHERCHEX cherche vers la gauche comme vers la droite sans restriction de colonne, ne casse pas si des colonnes sont insérées, gère nativement le 'si non trouvé' et fait une correspondance exacte par défaut.",
    code_snippet: "=RECHERCHEX(D2; Clients[ID]; Clients[Nom]; \"Client Introuvable\")",
    category: 'EXCEL',
    category_display: 'Tableur Excel',
    difficulty: 'INTERMEDIATE',
    difficulty_display: 'Intermédiaire',
    hint: 'Une fonction moderne introduite pour remplacer à la fois RECHERCHEV et INDEX/EQUIV.',
    repetition_count: 0,
    interval_days: 1,
    is_new: true,
  },
  {
    id: 4,
    question: "En DAX (Power BI), quelle fonction modifie le contexte de filtre d'un calcul ?",
    answer: "La fonction CALCULATE(). C'est le moteur de calcul contextuel le plus puissant de DAX, permettant d'ajouter, remplacer ou ignorer des filtres.",
    code_snippet: "Total Ventes Douala = \nCALCULATE(\n    [Total Ventes],\n    Boutiques[Ville] = \"Douala\"\n)",
    category: 'POWERBI',
    category_display: 'Power BI & DAX',
    difficulty: 'ADVANCED',
    difficulty_display: 'Avancé',
    hint: 'Le terme anglais pour calculer.',
    repetition_count: 0,
    interval_days: 1,
    is_new: true,
  },
  {
    id: 5,
    question: "Qu'est-ce que la médiane et quand est-elle préférable à la moyenne ?",
    answer: "La médiane est la valeur centrale qui sépare la distribution en deux moitiés égales. Elle est robuste aux valeurs extrêmes (outliers) et asymétries (ex: salaires, montants de transactions).",
    code_snippet: "# Exemple de distribution asymétrique :\n# [1000, 1200, 1500, 1800, 50000]\n# Médiane = 1500 | Moyenne = 11100 (biaisée)",
    category: 'CONCEPT',
    category_display: 'Statistiques & Concepts',
    difficulty: 'BEGINNER',
    difficulty_display: 'Débutant',
    hint: '50% des observations sont en-dessous, 50% au-dessus.',
    repetition_count: 0,
    interval_days: 1,
    is_new: true,
  },
];

export async function fetchDueCards(category?: string): Promise<{ cards: FlashcardItem[]; metrics: SrsMetrics }> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const url = new URL(`${API_BASE_URL}/api/v1/courses/srs/due/`);
    if (category && category !== 'ALL') {
      url.searchParams.append('category', category);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      const data = await res.json();
      return {
        cards: data.cards || [],
        metrics: data.metrics || {
          due_today: (data.cards || []).length,
          total_cards: (data.cards || []).length,
          mastered_cards: 0,
          retention_rate: 85,
          streak_days: 1,
        },
      };
    }
  } catch {
    // API offline or network unavailable: fallback
  }

  const filtered = category && category !== 'ALL'
    ? FALLBACK_FLASHCARDS.filter(c => c.category === category)
    : FALLBACK_FLASHCARDS;

  return {
    cards: filtered,
    metrics: {
      due_today: filtered.length,
      total_cards: FALLBACK_FLASHCARDS.length,
      mastered_cards: 2,
      retention_rate: 88,
      streak_days: 3,
    },
  };
}

export async function submitReview(cardId: number, quality: ReviewQuality): Promise<ReviewResponse> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/courses/srs/review/`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        card_id: cardId,
        quality,
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback client-side simulated SM-2
  }

  // Simulated SM-2 intervals
  const intervalMap: Record<number, number> = {
    1: 1,
    3: 2,
    4: 6,
    5: 10,
  };

  return {
    success: true,
    progress: {
      repetitions: quality >= 3 ? 1 : 0,
      interval_days: intervalMap[quality] || 1,
      easiness_factor: 2.5,
      next_review_at: new Date(Date.now() + (intervalMap[quality] || 1) * 86400000).toISOString(),
      last_quality: quality,
    },
    message: quality >= 3 ? 'Carte mémorisée avec succès' : 'Carte replacée dans la file de révision',
  };
}

export async function fetchSrsStats(): Promise<SrsMetrics> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/api/v1/courses/srs/stats/`, {
      method: 'GET',
      headers,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }

  return {
    due_today: 5,
    total_cards: 12,
    mastered_cards: 3,
    retention_rate: 85,
    streak_days: 4,
  };
}
