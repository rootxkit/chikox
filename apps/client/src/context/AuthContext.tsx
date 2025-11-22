'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UserDTO, LoginRequest, RegisterRequest } from '@chikox/types';
import api from '@/lib/api';

interface AuthContextType {
  user: UserDTO | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  resetPassword: (token: string, password: string) => Promise<{ success: boolean; error?: string; message?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          const response = await api.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            // Token invalid or expired, try to refresh
            try {
              const refreshResponse = await api.refreshToken();
              if (refreshResponse.success && refreshResponse.data) {
                localStorage.setItem('accessToken', refreshResponse.data.accessToken);
                // Retry getting profile
                const retryResponse = await api.getProfile();
                if (retryResponse.success && retryResponse.data) {
                  setUser(retryResponse.data);
                } else {
                  localStorage.removeItem('accessToken');
                }
              } else {
                localStorage.removeItem('accessToken');
              }
            } catch {
              localStorage.removeItem('accessToken');
            }
          }
        } catch {
          localStorage.removeItem('accessToken');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (data: LoginRequest) => {
    try {
      const response = await api.login(data);

      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error?.message || 'Login failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      };
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      const response = await api.register(data);

      if (response.success && response.data) {
        localStorage.setItem('accessToken', response.data.accessToken);
        setUser(response.data.user);
        return { success: true };
      } else {
        return {
          success: false,
          error: response.error?.message || 'Registration failed'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.logout();
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  const forgotPassword = useCallback(async (email: string) => {
    try {
      const response = await api.forgotPassword({ email });

      if (response.success && response.data) {
        return { success: true, message: response.data.message };
      } else {
        return {
          success: false,
          error: response.error?.message || 'Failed to send reset email'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send reset email'
      };
    }
  }, []);

  const resetPassword = useCallback(async (token: string, password: string) => {
    try {
      const response = await api.resetPassword({ token, password });

      if (response.success && response.data) {
        return { success: true, message: response.data.message };
      } else {
        return {
          success: false,
          error: response.error?.message || 'Failed to reset password'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to reset password'
      };
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
