export interface PlacementQuestionOption {
  id: string;
  text: string;
}

export interface PlacementQuestion {
  id: string;
  tool: 'excel' | 'sql' | 'python' | 'powerbi';
  bloom: 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';
  level: string;
  weight: number;
  question: string;
  options: PlacementQuestionOption[];
}

export interface RecommendedCourse {
  id: number;
  title: string;
  slug: string;
  level: string;
  description: string;
}

export interface PlacementResult {
  id: number;
  score_total: number;
  score_excel: number;
  score_sql: number;
  score_python: number;
  score_powerbi: number;
  recommended_level: 'N1' | 'N2' | 'N3';
  recommended_level_display: string;
  recommended_course: RecommendedCourse | null;
  answers_summary: Record<string, {
    tool: string;
    bloom: string;
    level: string;
    user_choice: string;
    is_correct: boolean;
    explanation: string;
  }>;
  completed_at: string;
}

