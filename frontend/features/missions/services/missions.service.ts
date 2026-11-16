import { apiClient } from '@/lib/api-client';
import {
  MissionSummary,
  MissionDetail,
  MissionSubmitPayload,
  MissionSubmitResponse
} from '../types';

export const missionsService = {
  /**
   * Retrieves all published real-world African enterprise missions (F2.7, R11)
   */
  async getMissions(difficulty?: string): Promise<MissionSummary[]> {
    try {
      const url = difficulty
        ? `/courses/missions/?difficulty=${encodeURIComponent(difficulty)}`
        : '/courses/missions/';
      return await apiClient<MissionSummary[]>(url);
    } catch {
      return [];
    }
  },

  /**
   * Retrieves detailed mission context, deliverables, sample dataset, and rubric
   */
  async getMissionDetail(slug: string): Promise<MissionDetail | null> {
    try {
      return await apiClient<MissionDetail>(`/courses/missions/${encodeURIComponent(slug)}/`);
    } catch {
      return null;
    }
  },

  /**
   * Submits learner self-evaluation and unlocks the model solution debriefing (F2.7, R24)
   */
  async submitMissionEvaluation(
    slug: string,
    payload: MissionSubmitPayload
  ): Promise<MissionSubmitResponse> {
    return await apiClient<MissionSubmitResponse>(
      `/courses/missions/${encodeURIComponent(slug)}/submit/`,
      {
        method: 'POST',
        body: JSON.stringify(payload)
      }
    );
  }
};
