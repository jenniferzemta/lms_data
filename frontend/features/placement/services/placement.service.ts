import { PlacementQuestion, PlacementResult } from '../types';
import { getCsrfToken } from '@/lib/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FALLBACK_QUESTIONS: PlacementQuestion[] = [
  {
    id: 'q_excel_1',
    tool: 'excel',
    bloom: 'UNDERSTAND',
    level: 'N1',
    weight: 10,
    question: 'Dans Excel, pour calculer la TVA camerounaise (19,25%) située en cellule $C$1 sur une liste de 200 lignes de vente, pourquoi utilise-t-on les symboles dollar ($) ?',
    options: [
      { id: 'a', text: 'Pour formater automatiquement le résultat en FCFA' },
      { id: 'b', text: 'Pour figer la référence absolue afin qu\'elle ne se décale pas lors du glisser-déposer vers le bas' },
      { id: 'c', text: 'Pour masquer la formule aux autres utilisateurs de l\'entreprise' },
      { id: 'd', text: 'Pour accélérer le calcul multi-thread dans Excel' }
    ]
  },
  {
    id: 'q_excel_2',
    tool: 'excel',
    bloom: 'APPLY',
    level: 'N2',
    weight: 15,
    question: 'Quelle fonction Excel moderne est la plus robuste pour croiser une table de ventes avec une table clients de 50 000 lignes sans exiger que la clé soit dans la première colonne ?',
    options: [
      { id: 'a', text: 'RECHERCHEV' },
      { id: 'b', text: 'RECHERCHEX (ou le couple INDEX / EQUIV)' },
      { id: 'c', text: 'CONCATENER' },
      { id: 'd', text: 'SI.CONDITIONS' }
    ]
  },
  {
    id: 'q_excel_3',
    tool: 'excel',
    bloom: 'ANALYZE',
    level: 'N3',
    weight: 15,
    question: 'Quelle est la différence fondamentale entre une transformation dans Power Query et une mesure DAX dans Power BI / Excel ?',
    options: [
      { id: 'a', text: 'Power Query s\'exécute lors du chargement des données (ETL), tandis qu\'une mesure DAX est recalculée dynamiquement selon le contexte de filtre visuel' },
      { id: 'b', text: 'Power Query sert uniquement aux fichiers texte, DAX aux bases SQL' },
      { id: 'c', text: 'Il n\'y a aucune différence, ce sont deux syntaxes pour les mêmes calculs' },
      { id: 'd', text: 'DAX modifie la structure des tables physiques alors que Power Query ne fait que de l\'affichage' }
    ]
  },
  {
    id: 'q_sql_1',
    tool: 'sql',
    bloom: 'UNDERSTAND',
    level: 'N1',
    weight: 10,
    question: 'En SQL, quelle clause permet de filtrer les transactions pour ne conserver que les montants supérieurs à 500 000 FCFA ?',
    options: [
      { id: 'a', text: 'ORDER BY montant > 500000' },
      { id: 'b', text: 'WHERE montant > 500000' },
      { id: 'c', text: 'GROUP BY montant > 500000' },
      { id: 'd', text: 'LIMIT 500000' }
    ]
  },
  {
    id: 'q_sql_2',
    tool: 'sql',
    bloom: 'APPLY',
    level: 'N2',
    weight: 15,
    question: 'Pour obtenir le chiffre d\'affaires total par agence (Douala, Yaoundé, Bafoussam), quelle clause SQL est indispensable avec SUM(montant) ?',
    options: [
      { id: 'a', text: 'GROUP BY agence' },
      { id: 'b', text: 'JOIN agence' },
      { id: 'c', text: 'HAVING agence' },
      { id: 'd', text: 'PARTITION agence' }
    ]
  },
  {
    id: 'q_sql_3',
    tool: 'sql',
    bloom: 'ANALYZE',
    level: 'N3',
    weight: 15,
    question: 'Vous voulez lister tous les 1 000 clients de votre fichier, y compris ceux qui n\'ont effectué aucun achat ce mois-ci. Quel type de jointure devez-vous utiliser ?',
    options: [
      { id: 'a', text: 'INNER JOIN' },
      { id: 'b', text: 'LEFT OUTER JOIN (ou LEFT JOIN) depuis la table clients' },
      { id: 'c', text: 'CROSS JOIN' },
      { id: 'd', text: 'NATURAL JOIN' }
    ]
  },
  {
    id: 'q_python_1',
    tool: 'python',
    bloom: 'UNDERSTAND',
    level: 'N1',
    weight: 10,
    question: 'En Python avec Pandas, quelle instruction charge un fichier de données tabulaires d\'export bancaire "operations.csv" ?',
    options: [
      { id: 'a', text: 'pd.load("operations.csv")' },
      { id: 'b', text: 'pd.read_csv("operations.csv")' },
      { id: 'c', text: 'pd.import_csv("operations.csv")' },
      { id: 'd', text: 'pd.DataFrame.open("operations.csv")' }
    ]
  },
  {
    id: 'q_powerbi_1',
    tool: 'powerbi',
    bloom: 'ANALYZE',
    level: 'N3',
    weight: 10,
    question: 'En DAX, que permet d\'accomplir la formule : Part_Marche = DIVIDE([CA_Total], CALCULATE([CA_Total], ALL(Ventes[Ville]))) ?',
    options: [
      { id: 'a', text: 'Elle filtre uniquement les ventes de la ville de Douala' },
      { id: 'b', text: 'Elle calcule la part de marché en retirant le filtre de ville au dénominateur pour obtenir le total global' },
      { id: 'c', text: 'Elle supprime la colonne Ville de la base de données' },
      { id: 'd', text: 'Elle génère un message d\'erreur de syntaxe' }
    ]
  }
];

class PlacementService {
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  /**
   * Fetches the diagnostic question bank (F3.7)
   */
  async getQuestions(): Promise<PlacementQuestion[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/courses/placement-test/questions/`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && Array.isArray(data.questions)) {
          return data.questions;
        }
      }
    } catch {
      // Offline fallback
    }
    return FALLBACK_QUESTIONS;
  }

  /**
   * Submits learner answers and returns diagnostic recommendation
   */
  async submitAnswers(answers: Record<string, string>): Promise<PlacementResult> {
    try {
      const csrfToken = getCsrfToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRFToken'] = csrfToken;
      }

      const res = await fetch(`${API_BASE_URL}/api/v1/courses/placement-test/submit/`, {
        method: 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify({ answers }),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback computation
    }

    // Local evaluation fallback
    let correctCount = 0;
    const correctMap: Record<string, string> = {
      q_excel_1: 'b',
      q_excel_2: 'b',
      q_excel_3: 'a',
      q_sql_1: 'b',
      q_sql_2: 'a',
      q_sql_3: 'b',
      q_python_1: 'b',
      q_powerbi_1: 'b',
    };

    Object.entries(answers).forEach(([qid, choice]) => {
      if (correctMap[qid] === choice) correctCount++;
    });

    const scoreTotal = Math.round((correctCount / Object.keys(correctMap).length) * 100);
    const recommendedLevel: 'N1' | 'N2' | 'N3' = scoreTotal >= 75 ? 'N3' : (scoreTotal >= 45 ? 'N2' : 'N1');

    return {
      id: Date.now(),
      score_total: scoreTotal,
      score_excel: scoreTotal,
      score_sql: scoreTotal,
      score_python: scoreTotal,
      score_powerbi: scoreTotal,
      recommended_level: recommendedLevel,
      recommended_level_display: recommendedLevel === 'N3' ? 'Niveau 3 : Modélisation, DAX & Tableaux de Bord' : (recommendedLevel === 'N2' ? 'Niveau 2 : Pratique Avancée & Automatisation' : 'Niveau 1 : Les Fondamentaux'),
      recommended_course: {
        id: 1,
        title: recommendedLevel === 'N3' ? 'Power BI & DAX Niveau 3' : (recommendedLevel === 'N2' ? 'Excel Niveau 2 : Formules & TCD' : 'Excel Niveau 1 : Les Fondamentaux'),
        slug: recommendedLevel === 'N3' ? 'powerbi-n3' : (recommendedLevel === 'N2' ? 'excel-n2' : 'excel-n1-les-fondamentaux'),
        level: recommendedLevel === 'N3' ? 'Niveau 3 (Avancé)' : (recommendedLevel === 'N2' ? 'Niveau 2 (Intermédiaire)' : 'Niveau 1 (Débutant)'),
        description: 'Parcours recommandé suite à votre test de positionnement initial.',
      },
      answers_summary: {},
      completed_at: new Date().toISOString(),
    };
  }

  /**
   * Fetches latest placement result
   */
  async getResult(): Promise<{ has_taken_test: boolean; result: PlacementResult | null }> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/courses/placement-test/result/`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Ignore
    }
    return { has_taken_test: false, result: null };
  }
}

export const placementService = new PlacementService();

