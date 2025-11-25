import axios from 'axios';
import type { LoginRequest, AuthResponse, UserDTO, ApiResponse } from '@chikox/types';

const API_URL = import.meta.env.VITE_API_URL || '';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/v1/auth/login', data);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/v1/auth/logout');
  },

  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await api.get<ApiResponse<UserDTO>>('/api/v1/users/me');
    return response.data.data!;
  }
};

// Users API
export const usersApi = {
  getAll: async (): Promise<UserDTO[]> => {
    const response = await api.get<ApiResponse<UserDTO[]>>('/api/v1/users');
    return response.data.data!;
  },

  getById: async (id: string): Promise<UserDTO> => {
    const response = await api.get<ApiResponse<UserDTO>>(`/api/v1/users/${id}`);
    return response.data.data!;
  },

  create: async (data: {
    email: string;
    password: string;
    name?: string;
    role?: string;
  }): Promise<UserDTO> => {
    const response = await api.post<ApiResponse<UserDTO>>('/api/v1/users', data);
    return response.data.data!;
  },

  update: async (
    id: string,
    data: { email?: string; name?: string; role?: string }
  ): Promise<UserDTO> => {
    const response = await api.patch<ApiResponse<UserDTO>>(`/api/v1/users/${id}`, data);
    return response.data.data!;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/v1/users/${id}`);
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<{ message: string }> => {
    const response = await api.patch<ApiResponse<{ message: string }>>(
      '/api/v1/users/me/password',
      data
    );
    return response.data.data!;
  },

  toggleActivation: async (id: string): Promise<UserDTO> => {
    const response = await api.patch<ApiResponse<UserDTO>>(
      `/api/v1/users/${id}/toggle-activation`
    );
    return response.data.data!;
  }
};
