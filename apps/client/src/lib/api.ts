import type {
  ApiResponse,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@chikox/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      credentials: 'include' // Include cookies for refresh token
    };

    // Add auth token if available
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      };
    }

    const response = await fetch(url, config);
    const data = await response.json();

    return data;
  }

  // Auth endpoints
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    return this.request<void>('/api/v1/auth/logout', {
      method: 'POST'
    });
  }

  async refreshToken(): Promise<ApiResponse<{ accessToken: string }>> {
    return this.request<{ accessToken: string }>('/api/v1/auth/refresh', {
      method: 'POST'
    });
  }

  async getProfile(): Promise<ApiResponse<AuthResponse['user']>> {
    return this.request<AuthResponse['user']>('/api/v1/users/me', {
      method: 'GET'
    });
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/v1/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/v1/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/v1/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  }

  async resendVerification(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/v1/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  }

  async sendContactMessage(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/v1/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async updateProfile(data: {
    name?: string;
    email?: string;
  }): Promise<ApiResponse<AuthResponse['user']>> {
    return this.request<AuthResponse['user']>('/api/v1/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }

  async changePassword(data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<{ message: string }>> {
    return this.request<{ message: string }>('/api/v1/users/me/password', {
      method: 'PATCH',
      body: JSON.stringify(data)
    });
  }
}

export const api = new ApiClient(API_URL);
export default api;
