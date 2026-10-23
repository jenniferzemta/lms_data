'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { AuthContextType, LoginPayload, RegisterLearnerPayload, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (payload: LoginPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.login(payload);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterLearnerPayload): Promise<User> => {
    setIsLoading(true);
    try {
      const registeredUser = await authService.register(payload);
      setUser(registeredUser);
      return registeredUser;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<User> => {
    setIsLoading(true);
    try {
      const loggedUser = await authService.loginWithGoogle(credential);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithGoogle,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
