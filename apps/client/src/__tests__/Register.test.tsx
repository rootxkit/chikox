import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from '../app/register/page';
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
  }),
  usePathname: () => '/register'
}));

const renderRegisterPage = () => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <RegisterPage />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  it('renders registration form', () => {
    renderRegisterPage();

    // Use heading role to get the title specifically
    expect(screen.getByRole('heading', { name: /Create account/i })).toBeInTheDocument();
  });

  it('renders name input', () => {
    renderRegisterPage();

    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveAttribute('type', 'text');
  });

  it('renders email input', () => {
    renderRegisterPage();

    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveAttribute('type', 'email');
  });

  it('renders password input', () => {
    renderRegisterPage();

    const passwordInput = screen.getByLabelText(/^password$/i);
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('renders confirm password input', () => {
    renderRegisterPage();

    const confirmInput = screen.getByLabelText(/confirm password/i);
    expect(confirmInput).toBeInTheDocument();
    expect(confirmInput).toHaveAttribute('type', 'password');
  });

  it('renders create account button', () => {
    renderRegisterPage();

    const createButton = screen.getByRole('button', { name: /create account/i });
    expect(createButton).toBeInTheDocument();
  });

  it('renders terms checkbox', () => {
    renderRegisterPage();

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeRequired();
  });

  it('renders sign in link', () => {
    renderRegisterPage();

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', '/login');
  });

  it('shows error when passwords do not match', async () => {
    renderRegisterPage();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.change(confirmInput, { target: { value: 'different123' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitButton);

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('shows error when password is too short', async () => {
    renderRegisterPage();

    const passwordInput = screen.getByLabelText(/^password$/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);
    const checkbox = screen.getByRole('checkbox');
    const submitButton = screen.getByRole('button', { name: /create account/i });

    fireEvent.change(screen.getByLabelText(/full name/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'short' } });
    fireEvent.change(confirmInput, { target: { value: 'short' } });
    fireEvent.click(checkbox);
    fireEvent.click(submitButton);

    // Error message includes "Password" at the beginning, unlike the hint text
    expect(
      await screen.findByText(/^Password must be at least 8 characters$/i)
    ).toBeInTheDocument();
  });
});
