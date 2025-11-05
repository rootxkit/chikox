import axios from 'axios';
import type { LoginRequest, AuthResponse, UserDTO, ApiResponse } from '@chikox/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Handle token refresh on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/api/auth/login', data);
    return response.data.data!;
  },

  logout: async (): Promise<void> => {
    await api.post('/api/auth/logout');
  },

  getCurrentUser: async (): Promise<UserDTO> => {
    const response = await api.get<ApiResponse<UserDTO>>('/api/users/me');
    return response.data.data!;
  }
};

// Users API
export const usersApi = {
  getAll: async (): Promise<UserDTO[]> => {
    const response = await api.get<ApiResponse<UserDTO[]>>('/api/users');
    return response.data.data!;
  },

  getById: async (id: string): Promise<UserDTO> => {
    const response = await api.get<ApiResponse<UserDTO>>(`/api/users/${id}`);
    return response.data.data!;
  }
};
