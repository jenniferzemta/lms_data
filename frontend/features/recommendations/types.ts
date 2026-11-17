export interface LearnerRecommendation {
  id: string;
  type: 'ASSESSMENT' | 'COURSE' | 'MISSION' | 'LAB' | string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  reason: string;
  action_label: string;
  action_url: string;
  icon?: string;
}

export interface LearnerReminder {
  id: string;
  type: 'SRS_DUE' | 'ANTI_DROPOFF' | 'GENERAL';
  title: string;
  message: string;
  action_label: string;
  action_url: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface RecommendationsData {
  recommendations: LearnerRecommendation[];
  reminders: LearnerReminder[];
  inactivity_days: number;
  summary: string;
}

