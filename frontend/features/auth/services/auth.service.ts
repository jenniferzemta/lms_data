import { apiClient } from '@/lib/api-client';
import {
  ChangePasswordPayload,
  LoginPayload,
  RegisterLearnerPayload,
  UpdateProfilePayload,
  User,
} from '../types';

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

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    return apiClient<User>('/auth/me/', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async loginWithGoogle(credential: string): Promise<User> {
    return apiClient<User>('/auth/google/', {
      method: 'POST',
      body: JSON.stringify({ credential }),
    });
  },
};

