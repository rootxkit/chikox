// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface AuthResponse {
  user: UserDTO;
  accessToken: string;
}

export interface UserDTO {
  id: string;
  email: string;
  name: string | null;
  role: string; // Using string to avoid type conflicts with Prisma generated types
  emailVerified: boolean;
  avatar?: string | null;
  createdAt: string;
}

// JWT Payload types
export interface JWTPayload {
  userId: string;
  email: string;
  role: string; // Using string instead of UserRole to avoid type conflicts
  iat?: number;
  exp?: number;
}

export interface RefreshTokenPayload {
  userId: string;
  sessionId: string;
  iat?: number;
  exp?: number;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, unknown>;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// OAuth types
export interface OAuthCallbackQuery {
  code: string;
  state?: string;
}

export interface OAuthUserProfile {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}
