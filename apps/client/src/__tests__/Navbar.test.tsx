import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
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

const renderNavbar = () => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
};

describe('Navbar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  it('renders logo with Chikox text', () => {
    renderNavbar();

    expect(screen.getByText('Chiko')).toBeInTheDocument();
    expect(screen.getByText('x')).toBeInTheDocument();
  });

  it('renders login link', () => {
    renderNavbar();

    const loginLink = screen.getByRole('link', { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('renders register link', () => {
    renderNavbar();

    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('renders language switcher', () => {
    renderNavbar();

    // Both desktop and mobile have language switchers
    const enButtons = screen.getAllByText('EN');
    const geButtons = screen.getAllByText('GE');
    expect(enButtons.length).toBeGreaterThanOrEqual(1);
    expect(geButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('renders theme toggle', () => {
    renderNavbar();

    const buttons = screen.getAllByRole('button');
    // Should have language buttons (EN, GE) and theme toggle
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});
