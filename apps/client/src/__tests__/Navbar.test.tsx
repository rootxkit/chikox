import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Navbar from '../components/Navbar';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const renderNavbar = () => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <Navbar />
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

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('GE')).toBeInTheDocument();
  });

  it('renders theme toggle', () => {
    renderNavbar();

    const buttons = screen.getAllByRole('button');
    // Should have language buttons (EN, GE) and theme toggle
    expect(buttons.length).toBeGreaterThanOrEqual(3);
  });
});
