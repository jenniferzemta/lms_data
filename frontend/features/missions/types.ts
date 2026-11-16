/**
 * Types and contracts for Real-World African Enterprise Missions (F2.7, Critère R11, R24)
 */

export type MissionDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface RubricCriterion {
  id: string;
  label: string;
  description: string;
  points: number;
}

export interface MissionSummary {
  id: number;
  title: string;
  slug: string;
  company_name: string;
  sector: string;
  location: string;
  difficulty: MissionDifficulty;
  estimated_duration_minutes: number;
  currency: string;
  business_problem: string;
  order: number;
}

export interface MissionSubmission {
  id: number;
  self_evaluation: Record<string, number>;
  final_score: number;
  learner_notes: string;
  deliverable_link: string;
  is_completed: boolean;
  submitted_at: string | null;
}

export interface MissionDetail extends MissionSummary {
  context_brief: string;
  tasks: string[];
  deliverables: string[];
  dataset_description: string;
  dataset_sample: Record<string, unknown>[];
  dataset_download_url: string;
  evaluation_rubric: RubricCriterion[];
  model_solution_summary: string;
  user_submission: MissionSubmission | null;
}

export interface MissionSubmitPayload {
  self_evaluation: Record<string, number>;
  learner_notes?: string;
  deliverable_link?: string;
}

export interface MissionSubmitResponse {
  success: boolean;
  message: string;
  submission: MissionSubmission;
  model_solution_summary: string;
}

