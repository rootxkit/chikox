import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../app/login/page';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthProvider } from '../context/AuthContext';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn()
  })
}));

const renderLoginPage = () => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  it('renders login form', () => {
    renderLoginPage();

    expect(screen.getByText('Welcome back')).toBeInTheDocument();
  });

  it('renders email input', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders password input', () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders sign in button', () => {
    renderLoginPage();

    const signInButton = screen.getByRole('button', { name: /sign in/i });
    expect(signInButton).toBeInTheDocument();
  });

  it('renders remember me checkbox', () => {
    renderLoginPage();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders forgot password link', () => {
    renderLoginPage();

    const forgotLink = screen.getByText(/forgot password/i);
    expect(forgotLink).toBeInTheDocument();
  });

  it('renders sign up link', () => {
    renderLoginPage();

    const signUpLink = screen.getByRole('link', { name: /sign up/i });
    expect(signUpLink).toBeInTheDocument();
    expect(signUpLink).toHaveAttribute('href', '/register');
  });

  it('updates email input on change', () => {
    renderLoginPage();

    const emailInput = screen.getByLabelText(/email/i) as HTMLInputElement;
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('updates password input on change', () => {
    renderLoginPage();

    const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(passwordInput.value).toBe('password123');
  });
});
