export interface InstructorSubmissionItem {
  id: number;
  mission_id: number;
  mission_title: string;
  mission_slug: string;
  company_name: string;
  learner_id: number;
  learner_name: string;
  learner_email: string;
  self_evaluation_score: number;
  self_evaluation_details: Record<string, number>;
  learner_notes: string;
  deliverable_link: string;
  instructor_grade?: number | null;
  instructor_feedback?: string;
  graded_by_name?: string | null;
  graded_at?: string | null;
  submitted_at: string;
  is_graded: boolean;
}

export interface BloomLevelMetric {
  level: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE';
  label: string;
  target_rate: number;
  actual_rate: number;
  status: 'ACQUIRED' | 'IN_PROGRESS' | 'NEEDS_WORK';
}

export interface NotionToReview {
  concept: string;
  tool: string;
  bloom_level: string;
  failure_rate: number;
  impact: string;
  recommended_action: string;
}

export interface LearningObjectivesAnalytics {
  total_attempts: number;
  average_score_percentage: number;
  overall_pass_rate: number;
  bloom_levels: BloomLevelMetric[];
  notions_to_review: NotionToReview[];
  total_missions_submitted: number;
  graded_missions_count: number;
  pending_submissions_count: number;
}
