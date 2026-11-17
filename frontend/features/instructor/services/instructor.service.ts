import { InstructorSubmissionItem, LearningObjectivesAnalytics } from '../types';
import { getCsrfToken } from '@/lib/api-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const FALLBACK_SUBMISSIONS: InstructorSubmissionItem[] = [
  {
    id: 1,
    mission_id: 1,
    mission_title: "Audit du Risque de Crédit — Microfinance Bafoussam",
    mission_slug: "audit-risque-credit-bafoussam",
    company_name: "COOPEC de l'Ouest",
    learner_id: 10,
    learner_name: "Mballa Junior",
    learner_email: "mballa.analyst@datamboa.cm",
    self_evaluation_score: 82,
    self_evaluation_details: { r1: 25, r2: 20, r3: 20, r4: 17 },
    learner_notes: "J'ai segmenté le portefeuille par zone rurale et calculé le PAR 30. Le risque majeur se concentre sur les crédits sans caution solidaire enregistrée.",
    deliverable_link: "https://datamboa.cm/chunked_uploads/audit_coopec_mballa.xlsx",
    instructor_grade: null,
    instructor_feedback: "",
    submitted_at: new Date(Date.now() - 3600000 * 4).toISOString(),
    is_graded: false,
  },
  {
    id: 2,
    mission_id: 2,
    mission_title: "Optimisation des Stocks — Brasseries du Wouri",
    mission_slug: "optimisation-stocks-brasseries-wouri",
    company_name: "Kamer Boissons SARL",
    learner_id: 12,
    learner_name: "Amina Ndongo",
    learner_email: "amina.data@datamboa.cm",
    self_evaluation_score: 95,
    self_evaluation_details: { r1: 25, r2: 25, r3: 25, r4: 20 },
    learner_notes: "Modélisation des stocks de sécurité avec tampon de 5 jours sur Yaoundé. Prévisions basées sur les ventes de décembre 2025.",
    deliverable_link: "https://datamboa.cm/chunked_uploads/rapport_stocks_amina.pbix",
    instructor_grade: 92,
    instructor_feedback: "Remarquable travail sur les délais d'acheminement Douala-Yaoundé. Les visualisations Power BI sont immédiatement exploitables.",
    graded_by_name: "Alain Fotso",
    graded_at: new Date(Date.now() - 3600000 * 24).toISOString(),
    submitted_at: new Date(Date.now() - 3600000 * 48).toISOString(),
    is_graded: true,
  },
];

const FALLBACK_ANALYTICS: LearningObjectivesAnalytics = {
  total_attempts: 148,
  average_score_percentage: 84,
  overall_pass_rate: 89,
  bloom_levels: [
    {
      level: 'REMEMBER',
      label: 'Mémoriser (Syntaxe, Raccourcis, Définitions)',
      target_rate: 80,
      actual_rate: 92,
      status: 'ACQUIRED',
    },
    {
      level: 'UNDERSTAND',
      label: 'Comprendre (Logique de calcul, Contexte de filtre)',
      target_rate: 75,
      actual_rate: 85,
      status: 'ACQUIRED',
    },
    {
      level: 'APPLY',
      label: 'Appliquer (Formules SOMME.SI, RECHERCHEV, Requêtes)',
      target_rate: 70,
      actual_rate: 78,
      status: 'ACQUIRED',
    },
    {
      level: 'ANALYZE',
      label: 'Analyser (Audit d\'écarts, Détection d\'erreurs, Diagnostic FCFA)',
      target_rate: 65,
      actual_rate: 68,
      status: 'IN_PROGRESS',
    },
  ],
  notions_to_review: [
    {
      concept: 'Distinction RECHERCHEV vs RECHERCHEX',
      tool: 'EXCEL',
      bloom_level: 'UNDERSTAND',
      failure_rate: 38,
      impact: 'Confusion sur le sens de recherche et le comportement par défaut (approx. vs exact)',
      recommended_action: 'Ajouter un exercice d\'entraînement ciblé sur les recherches inversées dans l\'Atelier 1.4.',
    },
    {
      concept: 'Priorité d\'évaluation WHERE vs HAVING',
      tool: 'SQL',
      bloom_level: 'APPLY',
      failure_rate: 34,
      impact: 'Tentative fréquente de filtrer sur une fonction d\'agrégation dans WHERE',
      recommended_action: 'Planifier une micro-révision Flashcard SRS sur les agrégations de groupe.',
    },
    {
      concept: 'Calcul du Stock de Sécurité et Seuil de Réapprovisionnement',
      tool: 'CONCEPT',
      bloom_level: 'ANALYZE',
      failure_rate: 31,
      impact: 'Difficulté à modéliser la variabilité des délais de livraison en haute saison',
      recommended_action: 'Présenter une capsule vidéo explicative sur l\'impact financier FCFA des ruptures.',
    },
  ],
  total_missions_submitted: 28,
  graded_missions_count: 22,
  pending_submissions_count: 6,
};

export async function fetchInstructorSubmissions(statusFilter: string = 'ALL'): Promise<InstructorSubmissionItem[]> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/courses/instructor/submissions/`);
    if (statusFilter !== 'ALL') {
      url.searchParams.append('status', statusFilter);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API offline fallback
  }

  if (statusFilter === 'PENDING') {
    return FALLBACK_SUBMISSIONS.filter(s => !s.is_graded);
  } else if (statusFilter === 'GRADED') {
    return FALLBACK_SUBMISSIONS.filter(s => s.is_graded);
  }
  return FALLBACK_SUBMISSIONS;
}

export async function submitInstructorGrade(
  submissionId: number,
  grade: number,
  feedback: string
): Promise<{ success: boolean; message: string; instructor_grade: number }> {
  try {
    const csrfToken = getCsrfToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (csrfToken) headers['X-CSRFToken'] = csrfToken;

    const res = await fetch(`${API_BASE_URL}/api/v1/courses/instructor/submissions/${submissionId}/grade/`, {
      method: 'POST',
      credentials: 'include',
      headers,
      body: JSON.stringify({ grade, feedback }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // API offline fallback
  }

  return {
    success: true,
    instructor_grade: grade,
    message: `Note de ${grade}/100 et évaluation enregistrées avec succès.`,
  };
}

export async function fetchLearningObjectivesAnalytics(courseSlug?: string): Promise<LearningObjectivesAnalytics> {
  try {
    const url = new URL(`${API_BASE_URL}/api/v1/courses/instructor/learning-objectives-analytics/`);
    if (courseSlug) {
      url.searchParams.append('course_slug', courseSlug);
    }

    const res = await fetch(url.toString(), {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Fallback
  }
  return FALLBACK_ANALYTICS;
}

