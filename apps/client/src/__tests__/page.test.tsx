import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';
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
  usePathname: () => '/'
}));

const renderHomePage = () => {
  return render(
    <LanguageProvider>
      <ThemeProvider>
        <AuthProvider>
          <Home />
        </AuthProvider>
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
    // Login/Register are now in a dropdown, just verify navbar exists
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('should render hero section', () => {
    renderHomePage();

    // Use getByRole to target the h1 specifically
    expect(
      screen.getByRole('heading', { level: 1, name: /Professional Drone Services/i })
    ).toBeInTheDocument();
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
