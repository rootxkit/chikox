import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '@/pages/Login';
import * as authHook from '@/hooks/useAuth';

// Mock the useAuth hook
vi.mock('@/hooks/useAuth');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('LoginPage', () => {
  const mockLogin = vi.fn();
  const mockUseAuth = {
    isAuthenticated: false,
    login: mockLogin,
    loading: false,
    user: null,
    logout: vi.fn(),
    isAdmin: () => false
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHook.useAuth).mockReturnValue(mockUseAuth);
  });

  it('renders login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.getByText('Chikox Admin')).toBeInTheDocument();
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('email-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email')).toBeInTheDocument();
    });
  });

  it('requires email and password', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const loginButton = screen.getByTestId('login-button');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter your email')).toBeInTheDocument();
    });
  });

  it('redirects to dashboard when authenticated as admin', () => {
    vi.mocked(authHook.useAuth).mockReturnValue({
      ...mockUseAuth,
      isAuthenticated: true,
      isAdmin: () => true,
      loading: false
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
  });

  it('calls login function with email and password', async () => {
    mockLogin.mockResolvedValue({ success: true });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@example.com', 'password123');
    });
  });

  it('shows loading state during login', () => {
    vi.mocked(authHook.useAuth).mockReturnValue({
      ...mockUseAuth,
      loading: true
    });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const loginButton = screen.getByTestId('login-button');
    expect(loginButton).toHaveClass('ant-btn-loading');
  });
});
