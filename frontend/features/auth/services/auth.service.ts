import { apiClient } from '@/lib/api-client';
import { LoginPayload, RegisterLearnerPayload, User } from '../types';

export const authService = {
  async register(payload: RegisterLearnerPayload): Promise<User> {
    return apiClient<User>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async login(payload: LoginPayload): Promise<User> {
    return apiClient<User>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async logout(): Promise<void> {
    await apiClient<{ message: string }>('/auth/logout/', {
      method: 'POST',
    });
  },

  async getMe(): Promise<User> {
    return apiClient<User>('/auth/me/', {
      method: 'GET',
    });
  },

  async loginWithGoogle(credential: string): Promise<User> {
    return apiClient<User>('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },
};

