import { apiClient, ApiError } from '@/lib/api-client';
import {
  CourseSummary,
  CourseDetail,
  LessonDetail,
  CourseProgress,
  LessonCompleteResponse,
  QuizDetail,
  QuizAttemptResponse,
  LessonNote,
  LessonQuestion,
  LessonAnswer,
  Certificate,
  InteractiveExercise,
  ExerciseVerificationResult,
  LearnerDashboardData,
  CourseFeedback,
  CourseFeedbackPayload,
  CourseFeedbackSummary,
  QualityCheckData,
  TogglePublicationResponse,
} from '../types';

export const coursesService = {
  /**
   * Fetch all published courses
   */
  async getCourses(lang: string = 'fr'): Promise<CourseSummary[]> {
    try {
      const response = await apiClient<CourseSummary[] | { count: number; results: CourseSummary[] }>(
        `/courses/?lang=${encodeURIComponent(lang)}`
      );
      if (Array.isArray(response)) {
        return response;
      }
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
   * Fetch learner course progression metrics and resume target (F1.8)
   */
  async getCourseProgress(courseSlug: string): Promise<CourseProgress> {
    try {
      return await apiClient<CourseProgress>(
        `/courses/${encodeURIComponent(courseSlug)}/progress/`
      );
    } catch {
      return {
        is_enrolled: false,
        status: 'NOT_ENROLLED',
        progress_percentage: 0,
        completed_lessons_count: 0,
        total_lessons_count: 0,
        completed_lesson_slugs: [],
        resume_lesson: null,
      };
    }
  },

  /**
   * Enrolls the current authenticated learner in the course (F1.8)
   */
  async enrollInCourse(courseSlug: string): Promise<CourseProgress> {
    return await apiClient<CourseProgress>(
      `/courses/${encodeURIComponent(courseSlug)}/enroll/`,
      { method: 'POST' }
    );
  },

  /**
   * Marks a lesson as completed for the current learner (F1.8)
   */
  async completeLesson(courseSlug: string, lessonSlug: string): Promise<LessonCompleteResponse> {
    return await apiClient<LessonCompleteResponse>(
      `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/complete/`,
      { method: 'POST' }
    );
  },

  /**
   * Fetches the formative quiz structure for a lesson (F1.7)
   */
  async getLessonQuiz(courseSlug: string, lessonSlug: string): Promise<QuizDetail | null> {
    try {
      return await apiClient<QuizDetail>(
        `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/quiz/`
      );
    } catch {
      return null;
    }
  },

  /**
   * Submits learner answers for evaluation and instant formative feedback (F1.7)
   */
  async submitLessonQuiz(
    courseSlug: string,
    lessonSlug: string,
    answers: Record<string, unknown>
  ): Promise<QuizAttemptResponse> {
    return await apiClient<QuizAttemptResponse>(
      `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/quiz/submit/`,
      {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }
    );
  },

  /**
   * Helper to construct the tracked download URL for a lesson attachment
   */
  getAttachmentDownloadUrl(attachmentId: number): string {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    return `${apiBase}/courses/attachments/${attachmentId}/download/`;
  },

  /**
   * Fetches learner personal notes for a lesson (F1.9)
   */
  async getLessonNotes(courseSlug: string, lessonSlug: string): Promise<LessonNote[]> {
    try {
      return await apiClient<LessonNote[]>(
        `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/notes/`
      );
    } catch {
      return [];
    }
  },

  /**
   * Creates a personal note anchored to a video timecode (F1.9)
   */
  async createLessonNote(
    courseSlug: string,
    lessonSlug: string,
    content: string,
    videoTimestampSeconds: number = 0
  ): Promise<LessonNote> {
    return await apiClient<LessonNote>(
      `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/notes/`,
      {
        method: 'POST',
        body: JSON.stringify({
          content,
          video_timestamp_seconds: videoTimestampSeconds,
        }),
      }
    );
  },

  /**
   * Deletes a learner personal note (F1.9)
   */
  async deleteLessonNote(noteId: number): Promise<boolean> {
    try {
      await apiClient<{ success?: boolean }>(`/courses/notes/${noteId}/`, {
        method: 'DELETE',
      });
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Lists community questions and replies for a lesson (F1.10)
   */
  async getLessonQuestions(courseSlug: string, lessonSlug: string): Promise<LessonQuestion[]> {
    try {
      return await apiClient<LessonQuestion[]>(
        `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/questions/`
      );
    } catch {
      return [];
    }
  },

  /**
   * Posts a new question to the lesson community thread (F1.10)
   */
  async createLessonQuestion(
    courseSlug: string,
    lessonSlug: string,
    title: string,
    content: string
  ): Promise<LessonQuestion> {
    return await apiClient<LessonQuestion>(
      `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/questions/`,
      {
        method: 'POST',
        body: JSON.stringify({ title, content }),
      }
    );
  },

  /**
   * Posts an answer to a question thread (F1.10)
   */
  async createLessonAnswer(questionId: number, content: string): Promise<LessonAnswer> {
    return await apiClient<LessonAnswer>(
      `/courses/questions/${questionId}/answers/`,
      {
        method: 'POST',
        body: JSON.stringify({ content }),
      }
    );
  },

  /**
   * Fetches official completion certificate for a course (F1.11)
   */
  async getCourseCertificate(courseSlug: string): Promise<Certificate> {
    return await apiClient<Certificate>(
      `/courses/${encodeURIComponent(courseSlug)}/certificate/`
    );
  },

  /**
   * Verifies an issued certificate by unique code (Public AllowAny, F1.11 & V4.5)
   */
  async verifyCertificate(code: string): Promise<Certificate> {
    return await apiClient<Certificate>(
      `/courses/certificates/${encodeURIComponent(code)}/verify/`
    );
  },

  /**
   * Lists all certificates earned by the authenticated learner
   */
  async getMyCertificates(): Promise<Certificate[]> {
    try {
      return await apiClient<Certificate[]>('/courses/my-certificates/');
    } catch {
      return [];
    }
  },

  /**
   * Fetches interactive hands-on exercises for a lesson (F1.18, R10)
   */
  async getLessonExercises(courseSlug: string, lessonSlug: string): Promise<InteractiveExercise[]> {
    try {
      return await apiClient<InteractiveExercise[]>(
        `/courses/${encodeURIComponent(courseSlug)}/lessons/${encodeURIComponent(lessonSlug)}/exercises/`
      );
    } catch {
      return [];
    }
  },

  /**
   * Verifies submitted answers for an interactive exercise (F1.18, R24)
   */
  async verifyExercise(
    exerciseId: number,
    answers: Record<string, string>
  ): Promise<ExerciseVerificationResult> {
    return await apiClient<ExerciseVerificationResult>(
      `/courses/exercises/${exerciseId}/verify/`,
      {
        method: 'POST',
        body: JSON.stringify({ answers }),
      }
    );
  },

  /**
   * Fetches the full learner dashboard summary (F1.13, R16)
   */
  async getDashboardSummary(): Promise<LearnerDashboardData> {
    return await apiClient<LearnerDashboardData>('/courses/dashboard/');
  },

  /**
   * Submits or updates course evaluation feedback (F1.20, R17 - ADDIE Evaluation)
   */
  async submitCourseFeedback(
    courseSlug: string,
    payload: CourseFeedbackPayload
  ): Promise<CourseFeedback> {
    return await apiClient<CourseFeedback>(
      `/courses/${encodeURIComponent(courseSlug)}/feedback/`,
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
  },

  /**
   * Retrieves the current user's course feedback (F1.20)
   */
  async getMyCourseFeedback(
    courseSlug: string
  ): Promise<{ has_feedback: boolean; feedback: CourseFeedback | null }> {
    try {
      return await apiClient<{ has_feedback: boolean; feedback: CourseFeedback | null }>(
        `/courses/${encodeURIComponent(courseSlug)}/feedback/my/`
      );
    } catch {
      return { has_feedback: false, feedback: null };
    }
  },

  /**
   * Retrieves the aggregated course evaluation summary and public testimonials (F1.20, R17)
   */
  async getCourseFeedbackSummary(courseSlug: string): Promise<CourseFeedbackSummary | null> {
    try {
      return await apiClient<CourseFeedbackSummary>(
        `/courses/${encodeURIComponent(courseSlug)}/feedback/summary/`
      );
    } catch {
      return null;
    }
  },

  /**
   * Checks course against the 5 pedagogical pillars & publication quality checklist (F1.12, F1.17, R9, R14)
   */
  async getCourseQualityCheck(courseSlug: string): Promise<QualityCheckData> {
    return await apiClient<QualityCheckData>(
      `/courses/${encodeURIComponent(courseSlug)}/quality-check/`
    );
  },

  /**
   * Toggles publication status of a course, enforcing the quality checklist check (F1.17, R14)
   */
  async toggleCoursePublication(
    courseSlug: string,
    publish: boolean
  ): Promise<TogglePublicationResponse> {
    return await apiClient<TogglePublicationResponse>(
      `/courses/${encodeURIComponent(courseSlug)}/publish/`,
      {
        method: 'POST',
        body: JSON.stringify({ publish }),
      }
    );
  },
};
