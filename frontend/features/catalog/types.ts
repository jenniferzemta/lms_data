export type CourseTool = 'all' | 'excel' | 'powerbi' | 'sql' | 'python';

export type CourseLevel = 'all' | 'debutant' | 'intermediaire' | 'avance';

export type CourseTier = 'free' | 'essential' | 'pro';

export interface Course {
  id: string;
  slug: string;
  title: string;
  tool: CourseTool;
  level: CourseLevel;
  tier: CourseTier;
  duration: string;
  lessonCount: number;
  casPratiqueCount?: number;
  localContext?: string;
  description: string;
  progressPercentage?: number;
  imageUrl: string;
  imageAlt: string;
}
