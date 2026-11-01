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

export interface CourseDetail {
  id: number;
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  level: 'debutant' | 'intermediaire' | 'avance';
  duration_hours: number;
  price_tier: 'free' | 'essential' | 'pro';
  image_url: string;
  tool: string;
  track: Track | null;
  modules_count: number;
  lessons_count: number;
  modules: ModuleCurriculum[];
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
  translation: LessonTranslation;
  is_fallback_language: boolean;
  previous_lesson: NavigationLesson | null;
  next_lesson: NavigationLesson | null;
}
