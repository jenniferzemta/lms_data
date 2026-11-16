/**
 * Types and contracts for Skill Acquisition Open Badges (F2.8, R16)
 */

export type BadgeCategory = 'LAB' | 'COURSE' | 'MISSION' | 'STREAK' | 'SPECIAL';

export interface BadgeItem {
  id: number;
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: BadgeCategory;
  points_reward: number;
  criteria_rule: string;
  order: number;
  is_earned: boolean;
  earned_at: string | null;
  metadata: Record<string, unknown>;
}

export interface UserBadgeEarned {
  id: number;
  badge: BadgeItem;
  earned_at: string;
  metadata: Record<string, unknown>;
}

