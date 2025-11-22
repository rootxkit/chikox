import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
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
  }),
  usePathname: () => '/'
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

  it('renders user dropdown button', () => {
    renderNavbar();

    // User icon button should be present
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(1);
  });

  it('shows login and register in dropdown when clicked', async () => {
    renderNavbar();

    // Find the user dropdown button (the one with no text, just icon)
    const userButton = screen.getAllByRole('button')[0];
    fireEvent.click(userButton);

    // After clicking, login and register links should appear
    const loginLink = screen.getByRole('link', { name: /login/i });
    const registerLink = screen.getByRole('link', { name: /register/i });
    expect(loginLink).toBeInTheDocument();
    expect(registerLink).toBeInTheDocument();
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
