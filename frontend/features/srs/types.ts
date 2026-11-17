export type FlashcardCategory = 'EXCEL' | 'SQL' | 'PYTHON' | 'POWERBI' | 'CONCEPT';
export type FlashcardDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

export interface FlashcardItem {
  id: number;
  question: string;
  answer: string;
  code_snippet?: string;
  category: FlashcardCategory;
  category_display?: string;
  difficulty: FlashcardDifficulty;
  difficulty_display?: string;
  hint?: string;
  repetition_count: number;
  interval_days: number;
  is_new: boolean;
}

export interface FlashcardProgress {
  repetitions: number;
  interval_days: number;
  easiness_factor: number;
  next_review_at: string;
  last_quality?: number;
}

export interface SrsMetrics {
  due_today: number;
  total_cards: number;
  mastered_cards: number;
  retention_rate: number;
  streak_days: number;
}

export type ReviewQuality = 1 | 3 | 4 | 5;

export interface ReviewResponse {
  success: boolean;
  progress: FlashcardProgress;
  message: string;
}

