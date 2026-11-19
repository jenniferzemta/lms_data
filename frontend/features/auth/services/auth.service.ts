import { apiClient } from '@/lib/api-client';
import {
  ChangePasswordPayload,
  LoginPayload,
  RegisterLearnerPayload,
  UpdateProfilePayload,
  User,
} from '../types';

const DEMO_STORAGE_KEY = 'datamboa_demo_user';

export const DEMO_ACCOUNTS: Record<string, { password: string; user: User }> = {
  'admin@datamboa.com': {
    password: 'AdminPassword123!',
    user: {
      id: 1,
      email: 'admin@datamboa.com',
      first_name: 'Admin',
      last_name: 'DataMboa',
      full_name: 'Admin DataMboa',
      phone_number: '+237657546259',
      role: 'ADMIN',
      is_staff: true,
      is_learner: false,
      is_instructor: false,
      is_admin_role: true,
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  'admin@datamboa.cm': {
    password: 'AdminPassword123!',
    user: {
      id: 1,
      email: 'admin@datamboa.cm',
      first_name: 'Admin',
      last_name: 'DataMboa',
      full_name: 'Admin DataMboa',
      phone_number: '+237657546259',
      role: 'ADMIN',
      is_staff: true,
      is_learner: false,
      is_instructor: false,
      is_admin_role: true,
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  'instructor@datamboa.com': {
    password: 'InstructorPass123!',
    user: {
      id: 2,
      email: 'instructor@datamboa.com',
      first_name: 'Samuel',
      last_name: 'Formateur',
      full_name: 'Samuel Formateur',
      phone_number: '+237699112233',
      role: 'INSTRUCTOR',
      is_staff: false,
      is_learner: false,
      is_instructor: true,
      is_admin_role: false,
      created_at: '2026-01-01T00:00:00Z',
    },
  },
  'learner@datamboa.com': {
    password: 'Password123!',
    user: {
      id: 3,
      email: 'learner@datamboa.com',
      first_name: 'Laure',
      last_name: 'Apprenante',
      full_name: 'Laure Apprenante',
      phone_number: '+237677889900',
      role: 'LEARNER',
      is_staff: false,
      is_learner: true,
      is_instructor: false,
      is_admin_role: false,
      created_at: '2026-01-01T00:00:00Z',
    },
  },
};

export const authService = {
  async register(payload: RegisterLearnerPayload): Promise<User> {
    try {
      return await apiClient<User>('/auth/register/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      // Offline fallback: create learner session
      const newUser: User = {
        id: Date.now(),
        email: payload.email,
        first_name: payload.first_name,
        last_name: payload.last_name,
        full_name: `${payload.first_name} ${payload.last_name}`.trim(),
        phone_number: payload.phone_number || '',
        role: 'LEARNER',
        is_staff: false,
        is_learner: true,
        is_instructor: false,
        is_admin_role: false,
        created_at: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(newUser));
      }
      return newUser;
    }
  },

  async login(payload: LoginPayload): Promise<User> {
    const emailLower = payload.email.trim().toLowerCase();
    try {
      const user = await apiClient<User>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (typeof window !== 'undefined') {
        localStorage.removeItem(DEMO_STORAGE_KEY);
      }
      return user;
    } catch (err) {
      // Demo / Offline fallback if API is unreachable or demo credentials match
      const demo = DEMO_ACCOUNTS[emailLower];
      if (demo && demo.password === payload.password) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(demo.user));
        }
        return demo.user;
      }
      throw err;
    }
  },

  async logout(): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEMO_STORAGE_KEY);
    }
    try {
      await apiClient<{ message: string }>('/auth/logout/', {
        method: 'POST',
      });
    } catch {
      // Offline safe
    }
  },

  async getMe(): Promise<User> {
    try {
      return await apiClient<User>('/auth/me/', {
        method: 'GET',
      });
    } catch (err) {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(DEMO_STORAGE_KEY);
        if (cached) {
          try {
            return JSON.parse(cached) as User;
          } catch {
            localStorage.removeItem(DEMO_STORAGE_KEY);
          }
        }
      }
      throw err;
    }
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    try {
      return await apiClient<User>('/auth/me/', {
        method: 'PATCH',
        body: JSON.stringify(payload),
      });
    } catch (err) {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(DEMO_STORAGE_KEY);
        if (cached) {
          const current = JSON.parse(cached) as User;
          const updated: User = {
            ...current,
            first_name: payload.first_name ?? current.first_name,
            last_name: payload.last_name ?? current.last_name,
            phone_number: payload.phone_number ?? current.phone_number,
          };
          localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        }
      }
      throw err;
    }
  },

  async changePassword(payload: ChangePasswordPayload): Promise<{ message: string }> {
    return apiClient<{ message: string }>('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async loginWithGoogle(credential: string): Promise<User> {
    try {
      return await apiClient<User>('/auth/google/', {
        method: 'POST',
        body: JSON.stringify({ credential }),
      });
    } catch (err) {
      // Demo fallback
      const googleUser: User = {
        id: 999,
        email: 'apprenant.google@datamboa.cm',
        first_name: 'Apprenant',
        last_name: 'Google',
        full_name: 'Apprenant Google',
        phone_number: '+237600000000',
        role: 'LEARNER',
        is_staff: false,
        is_learner: true,
        is_instructor: false,
        is_admin_role: false,
        created_at: new Date().toISOString(),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(googleUser));
      }
      return googleUser;
    }
  },
};
