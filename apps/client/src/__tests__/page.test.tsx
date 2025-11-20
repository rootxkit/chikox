import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const renderHomePage = () => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    </LanguageProvider>
  );
};

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  it('should render navbar with logo', () => {
    renderHomePage();

    // Chiko appears in both navbar and footer
    expect(screen.getAllByText('Chiko').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('should render hero section', () => {
    renderHomePage();

    // Use getByRole to target the h1 specifically
    expect(screen.getByRole('heading', { level: 1, name: /Professional Drone Services/i })).toBeInTheDocument();
  });

  it('should render features section', () => {
    renderHomePage();

    expect(screen.getByText(/What We Offer/i)).toBeInTheDocument();
  });

  it('should render testimonials section', () => {
    renderHomePage();

    expect(screen.getByText(/Customer Testimonials/i)).toBeInTheDocument();
  });

  it('should render footer', () => {
    renderHomePage();

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });
});
