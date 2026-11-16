import { RecommendationsData } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class RecommendationsService {
  private getAuthHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token') || localStorage.getItem('auth_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  /**
   * Fetches intelligent recommendations and reminders for current learner (F3.8, F3.9)
   */
  async getRecommendations(): Promise<RecommendationsData> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/courses/recommendations/`, {
        headers: this.getAuthHeaders(),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Offline fallback
    }

    return {
      recommendations: [
        {
          id: 'rec_placement_test',
          type: 'ASSESSMENT',
          priority: 'HIGH',
          title: 'Test de Positionnement Adaptatif',
          reason: 'Évaluez vos compétences en analyse de données (Excel, SQL, Python, Power BI) en 5 min.',
          action_label: 'Passer le test',
          action_url: '/placement-test',
          icon: 'target',
        },
      ],
      reminders: [],
      inactivity_days: 0,
      summary: '1 recommandation disponible.',
    };
  }
}

export const recommendationsService = new RecommendationsService();
