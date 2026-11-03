import { apiClient, ApiError } from '@/lib/api-client';
import { CourseSummary, CourseDetail, LessonDetail } from '../types';

export const coursesService = {
  /**
   * Fetch all published courses
   */
  async getCourses(lang: string = 'fr'): Promise<CourseSummary[]> {
    try {
      const response = await apiClient<{ count: number; results: CourseSummary[] }>(
        `/courses/?lang=${encodeURIComponent(lang)}`
      );
      return response.results || [];
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error('Impossible de charger la liste des cours.');
    }
  },

  /**
   * Fetch a single course with its modules and lessons curriculum
   */
  async getCourseBySlug(slug: string, lang: string = 'fr'): Promise<CourseDetail> {
    try {
      return await apiClient<CourseDetail>(
        `/courses/${encodeURIComponent(slug)}/?lang=${encodeURIComponent(lang)}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(`Impossible de charger le cours ${slug}.`);
    }
  },

  /**
   * Fetch full lesson detail with translated content, media URLs, code snippets and navigation
   */
  async getLessonDetail(
    courseSlug: string,
    lessonSlug: string,
    lang: string = 'fr'
  ): Promise<LessonDetail> {
    try {
      return await apiClient<LessonDetail>(
        `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/?lang=${encodeURIComponent(lang)}`
      );
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new Error(`Impossible de charger la leçon ${lessonSlug}.`);
    }
  },

  /**
   * Helper to construct the tracked download URL for a lesson attachment
   */
  getAttachmentDownloadUrl(attachmentId: number): string {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return `${apiBase}/courses/attachments/${attachmentId}/download/`;
  },
};
