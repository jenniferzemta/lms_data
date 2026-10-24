export type UserRole = 'LEARNER' | 'INSTRUCTOR' | 'ADMIN';

export interface LearnerProfile {
  study_level?: string;
  learning_goal?: string;
  whatsapp_consent?: boolean;
  created_at?: string;
}

export interface InstructorProfile {
  headline?: string;
  bio?: string;
  is_verified: boolean;
  created_at?: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  role: UserRole;
  is_learner: boolean;
  is_instructor: boolean;
  is_admin_role: boolean;
  learner_profile?: LearnerProfile | null;
  instructor_profile?: InstructorProfile | null;
  created_at: string;
}

export interface RegisterLearnerPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number?: string;
  study_level?: string;
  learning_goal?: string;
  whatsapp_consent?: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  study_level?: string;
  learning_goal?: string;
  whatsapp_consent?: boolean;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterLearnerPayload) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  changePassword: (payload: ChangePasswordPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}
