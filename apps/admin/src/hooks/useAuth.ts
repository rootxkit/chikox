import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { UserDTO, LoginRequest } from '@chikox/types';
import { authApi } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('accessToken');

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  const login = async (credentials: LoginRequest) => {
    try {
      const response = await authApi.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Login failed'
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      setUser(null);
      router.push('/login');
    }
  };

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  };

  return {
    user,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!user
  };
}
