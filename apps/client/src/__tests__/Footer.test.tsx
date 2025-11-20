import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';
import { LanguageProvider } from '../context/LanguageContext';

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

const renderFooter = () => {
  return render(
    <LanguageProvider>
      <Footer />
    </LanguageProvider>
  );
};

describe('Footer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  it('renders logo', () => {
    renderFooter();

    // Chiko appears twice (logo and copyright)
    expect(screen.getAllByText('Chiko').length).toBe(2);
  });

  it('renders quick links section', () => {
    renderFooter();

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
  });

  it('renders services link', () => {
    renderFooter();

    const servicesLink = screen.getByRole('link', { name: /services/i });
    expect(servicesLink).toBeInTheDocument();
    expect(servicesLink).toHaveAttribute('href', '/services');
  });

  it('renders about us link', () => {
    renderFooter();

    const aboutLink = screen.getByRole('link', { name: /about us/i });
    expect(aboutLink).toBeInTheDocument();
    expect(aboutLink).toHaveAttribute('href', '/about');
  });

  it('renders contact section', () => {
    renderFooter();

    // Contact appears twice (as link in Quick Links and as section title)
    expect(screen.getAllByText('Contact').length).toBe(2);
    expect(screen.getByText('info@chikox.net')).toBeInTheDocument();
  });

  it('renders copyright with current year', () => {
    renderFooter();

    const currentYear = new Date().getFullYear().toString();
    expect(screen.getByText(new RegExp(currentYear))).toBeInTheDocument();
  });
});
