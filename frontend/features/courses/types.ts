export interface Track {
  id: number;
  name: string;
  slug: string;
  description: string;
  tool: string;
  icon: string;
  order: number;
}

export type LessonType = 'text' | 'video' | 'exercise' | 'quiz' | 'project';

export type AttachmentType = 'STARTER' | 'SOLUTION' | 'DATASET' | 'CHEATSHEET' | 'OTHER';

export interface LessonAttachment {
  id: number;
  title: string;
  description: string;
  attachment_type: AttachmentType;
  file_format: string;
  file_size_bytes: number;
  file_size_display: string;
  download_url: string;
  is_free_preview: boolean;
  download_count: number;
  order: number;
}

export interface LessonTranslation {
  language: string;
  title: string;
  summary: string;
  content: string;
  video_url: string;
  audio_url: string;
  pdf_url: string;
  code_snippet: string;
  status: string;
}

export interface LessonSummary {
  id: number;
  title: string;
  slug: string;
  lesson_type: LessonType;
  duration_minutes: number;
  is_free_preview: boolean;
  order: number;
  is_completed?: boolean;
}

export interface ModuleCurriculum {
  id: number;
  title: string;
  description: string;
  order: number;
  lessons: LessonSummary[];
}

export interface CourseSummary {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  duration_hours: number;
  price_tier: 'free' | 'essential' | 'pro';
  image_url: string;
  tool: string;
  modules_count: number;
  lessons_count: number;
  order: number;
}

export interface LearningOutcome {
  statement: string;
  bloom_level: string;
}

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  level: 'debutant' | 'intermediaire' | 'avance' | 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | string;
  duration_hours: number;
  price_tier: 'free' | 'essential' | 'pro' | 'FREE' | 'ESSENTIAL' | 'PRO' | string;
  image_url: string;
  tool: string;
  track: Track | null;
  modules_count: number;
  lessons_count: number;
  modules: ModuleCurriculum[];
  target_audience?: string;
  prerequisites?: string;
  learning_outcomes?: LearningOutcome[];
  pedagogical_modalities?: string;
  instructor_name?: string;
  instructor_role?: string;
  instructor_bio?: string;
  created_at: string;
}

export interface NavigationLesson {
  slug: string;
  title: string;
  duration_minutes: number;
  lesson_type: LessonType;
}

export interface LessonDetail {
  id: number;
  course_slug: string;
  course_title: string;
  module_id: number;
  module_title: string;
  title: string;
  slug: string;
  lesson_type: LessonType;
  duration_minutes: number;
  is_free_preview: boolean;
  is_completed?: boolean;
  translation: LessonTranslation;
  is_fallback_language: boolean;
  attachments: LessonAttachment[];
  previous_lesson: NavigationLesson | null;
  next_lesson: NavigationLesson | null;
}

export interface CourseProgress {
  is_enrolled: boolean;
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED' | 'NOT_ENROLLED';
  progress_percentage: number;
  completed_lessons_count: number;
  total_lessons_count: number;
  completed_lesson_slugs: string[];
  resume_lesson: {
    slug: string;
    title: string;
  } | null;
}

export interface LessonCompleteResponse {
  success: boolean;
  is_completed: boolean;
  progress_percentage: number;
  status: string;
  summary: CourseProgress;
}

export type QuizQuestionType = 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'NUMERIC';
export type QuizBloomLevel = 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE';

export interface QuizAnswerOption {
  id: number;
  text: string;
  order: number;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  question_type: QuizQuestionType;
  bloom_level: QuizBloomLevel;
  order: number;
  options: QuizAnswerOption[];
}

export interface QuizDetail {
  id: number;
  title: string;
  description: string;
  purpose: 'FORMATIVE' | 'DIAGNOSTIC' | 'SUMMATIVE';
  passing_score_percentage: number;
  max_attempts: number | null;
  total_questions: number;
  questions: QuizQuestion[];
}

export interface QuizQuestionFeedback {
  question_id: number;
  prompt: string;
  question_type: QuizQuestionType;
  bloom_level: QuizBloomLevel;
  is_correct: boolean;
  user_answer: unknown;
  correct_answer: string;
  explanation: string;
}

export interface QuizAttemptResponse {
  attempt_id: number;
  score_percentage: number;
  is_passed: boolean;
  created_at: string;
  feedback_summary: QuizQuestionFeedback[];
}

export interface LessonNote {
  id: number;
  content: string;
  video_timestamp_seconds: number;
  created_at: string;
  updated_at: string;
}

export interface LessonAnswer {
  id: number;
  user_name: string;
  is_instructor: boolean;
  content: string;
  is_endorsed_by_instructor: boolean;
  created_at: string;
}

export interface LessonQuestion {
  id: number;
  title: string;
  content: string;
  user_name: string;
  is_resolved: boolean;
  created_at: string;
  answers_count: number;
  answers: LessonAnswer[];
}


export interface Certificate {
  certificate_code: string;
  recipient_name: string;
  course_title: string;
  course_slug: string;
  track_name: string;
  final_score: number;
  issued_at: string;
  instructor_name: string;
  skills_summary: string;
  verification_url: string;
  share_whatsapp_url?: string;
  share_linkedin_url?: string;
  is_valid?: boolean;
}



export interface InteractiveExercise {
  id: number;
  title: string;
  exercise_type: 'FILL_BLANKS' | 'ERROR_SPOTTING' | 'REORDER' | string;
  bloom_level: string;
  instruction: string;
  prompt_template: string;
  options_or_tokens: string[];
  hints: string[];
  order: number;
  is_completed?: boolean;
}

export interface ExerciseVerificationResult {
  is_correct: boolean;
  feedback: string;
  explanation: string;
  details: Record<string, { submitted: string; is_correct: boolean }>;
}


export interface DashboardStats {
  enrolled_courses_count: number;
  completed_courses_count: number;
  completed_lessons_count: number;
  total_learning_time_minutes: number;
  certificates_count: number;
  xp_points: number;
}

export interface DashboardResumeLesson {
  course_title: string;
  course_slug: string;
  tool: string;
  level: string;
  lesson_title: string;
  lesson_slug: string;
  module_title: string;
  duration_minutes: number;
  progress_percentage: number;
}

export interface DashboardEnrolledCourse {
  enrollment_id: number;
  course_id: number;
  course_title: string;
  course_slug: string;
  tool: string;
  level: string;
  progress_percentage: number;
  status: string;
  total_lessons_count: number;
  completed_lessons_count: number;
  updated_at: string | null;
  certificate_code?: string | null;
  next_lesson_slug?: string | null;
  next_lesson_title?: string | null;
}

export interface DashboardCertificateItem {
  id: number;
  certificate_code: string;
  course_title: string;
  course_slug: string;
  tool: string;
  issued_at: string | null;
  final_grade: number | null;
  instructor_name: string;
  verification_path: string;
}

export interface DashboardRecommendation {
  id: number;
  title: string;
  slug: string;
  tool: string;
  level: string;
  price_tier: string;
  duration_hours: number;
}

export interface LearnerDashboardData {
  user: {
    id: number | null;
    name: string;
    email: string;
  };
  stats: DashboardStats;
  resume_lesson: DashboardResumeLesson | null;
  enrolled_courses: DashboardEnrolledCourse[];
  certificates: DashboardCertificateItem[];
  recommendations: DashboardRecommendation[];
}

export type DifficultyLevel = 'TOO_EASY' | 'BALANCED' | 'TOO_HARD';
export type PaceRating = 'TOO_SLOW' | 'BALANCED' | 'TOO_FAST';

export interface CourseFeedback {
  id: number;
  rating: number;
  clarity_rating: number;
  usefulness_rating: number;
  difficulty_level: DifficultyLevel;
  pace_rating: PaceRating;
  recommend_score: number;
  strengths: string;
  improvements: string;
  comment: string;
  is_public_testimonial: boolean;
  author_name: string;
  created_at: string;
  updated_at: string;
}

export interface CourseFeedbackPayload {
  rating: number;
  clarity_rating?: number;
  usefulness_rating?: number;
  difficulty_level?: DifficultyLevel;
  pace_rating?: PaceRating;
  recommend_score?: number;
  strengths?: string;
  improvements?: string;
  comment?: string;
  is_public_testimonial?: boolean;
}

export interface CourseFeedbackSummary {
  course_slug: string;
  course_title: string;
  total_reviews: number;
  average_rating: number;
  average_clarity: number;
  average_usefulness: number;
  recommendation_percentage: number;
  ratings_breakdown: Record<number, number>;
  difficulty_breakdown: Record<DifficultyLevel, number>;
  pace_breakdown: Record<PaceRating, number>;
  recent_testimonials: Array<{
    id: number;
    author_name: string;
    rating: number;
    comment: string;
    strengths: string;
    created_at: string;
  }>;
}

