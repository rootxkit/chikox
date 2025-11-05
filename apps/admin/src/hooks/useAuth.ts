import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { UserDTO } from '@chikox/types';
import { authApi } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<UserDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
      setLoading(false);
      return { success: true };
    } catch (error: any) {
      setLoading(false);
      throw error;
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
      navigate('/login');
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
