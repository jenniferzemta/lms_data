import { apiClient } from '@/lib/api-client';
import { BadgeItem, UserBadgeEarned } from '../types';

export const FALLBACK_BADGES: BadgeItem[] = [
  {
    id: 1,
    slug: 'first-lab-solved',
    name: 'Premier Laboratoire Validé',
    description: 'Avoir résolu avec succès son tout premier atelier pratique dans le navigateur.',
    icon: 'sparkles',
    category: 'LAB',
    points_reward: 50,
    criteria_rule: 'first_lab',
    order: 1,
    is_earned: true,
    earned_at: '2026-11-16T15:00:00Z',
    metadata: {}
  },
  {
    id: 2,
    slug: 'sql-pioneer',
    name: 'Pionnier SQL Cameroun',
    description: 'Avoir formulé et exécuté des requêtes d\'extraction sur la base de données Microfinance.',
    icon: 'terminal',
    category: 'LAB',
    points_reward: 100,
    criteria_rule: 'sql_completed',
    order: 2,
    is_earned: true,
    earned_at: '2026-11-16T15:30:00Z',
    metadata: {}
  },
  {
    id: 3,
    slug: 'excel-master',
    name: 'Maître Tableur Excel',
    description: 'Avoir automatisé les calculs de vente avec les fonctions SOMME, SI, SOMME.SI et RECHERCHEV.',
    icon: 'table',
    category: 'LAB',
    points_reward: 100,
    criteria_rule: 'excel_completed',
    order: 3,
    is_earned: true,
    earned_at: '2026-11-16T16:00:00Z',
    metadata: {}
  },
  {
    id: 4,
    slug: 'python-data-wrangler',
    name: 'Data Wrangler Python',
    description: 'Avoir nettoyé et agrégé des transactions de vente en FCFA avec la bibliothèque Pandas.',
    icon: 'file-code',
    category: 'LAB',
    points_reward: 100,
    criteria_rule: 'python_completed',
    order: 4,
    is_earned: true,
    earned_at: '2026-11-16T16:20:00Z',
    metadata: {}
  },
  {
    id: 5,
    slug: 'mission-first-strike',
    name: 'Premier Consultant Junior',
    description: 'Avoir mené à terme une mission scénario d\'entreprise africaine avec auto-évaluation guidée.',
    icon: 'briefcase',
    category: 'MISSION',
    points_reward: 200,
    criteria_rule: 'mission_completed',
    order: 5,
    is_earned: true,
    earned_at: '2026-11-16T16:45:00Z',
    metadata: {}
  },
  {
    id: 6,
    slug: 'first-quiz-passed',
    name: 'Premier Quiz Validé',
    description: 'Avoir atteint le seuil de réussite de 70% sur une évaluation formative.',
    icon: 'check-circle',
    category: 'COURSE',
    points_reward: 50,
    criteria_rule: 'quiz_passed',
    order: 6,
    is_earned: true,
    earned_at: '2026-11-04T10:00:00Z',
    metadata: {}
  },
  {
    id: 7,
    slug: 'quiz-perfectionist',
    name: 'Perfectionniste 100%',
    description: 'Avoir réussi un quiz avec un score sans faute de 100% du premier coup.',
    icon: 'award',
    category: 'COURSE',
    points_reward: 100,
    criteria_rule: 'quiz_perfect',
    order: 7,
    is_earned: false,
    earned_at: null,
    metadata: {}
  },
  {
    id: 8,
    slug: 'streak-7-days',
    name: 'Assiduité d\'Acier (7 jours)',
    description: 'Avoir étudié et pratiqué 7 jours consécutifs sur DataMboa.',
    icon: 'flame',
    category: 'STREAK',
    points_reward: 150,
    criteria_rule: 'streak_7',
    order: 8,
    is_earned: false,
    earned_at: null,
    metadata: {}
  }
];

export const badgesService = {
  /**
   * Retrieves all platform badges with user earned status (F2.8, R16)
   */
  async getBadges(): Promise<BadgeItem[]> {
    try {
      const badges = await apiClient<BadgeItem[]>('/courses/badges/');
      return badges.length > 0 ? badges : FALLBACK_BADGES;
    } catch {
      return FALLBACK_BADGES;
    }
  },

  /**
   * Retrieves only earned badges for the current learner
   */
  async getMyBadges(): Promise<UserBadgeEarned[]> {
    try {
      return await apiClient<UserBadgeEarned[]>('/courses/badges/my/');
    } catch {
      return [];
    }
  }
};
