import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SettingsPage from '@/pages/Settings';
import * as authHook from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard/settings' })
  };
});

describe('SettingsPage', () => {
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin',
    role: 'ADMIN' as const,
    createdAt: '2024-01-01'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: () => true,
      isAuthenticated: true
    });
  });

  it('renders settings page', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('settings-page')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('displays general settings card', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('general-settings-card')).toBeInTheDocument();
    expect(screen.getByTestId('settings-form')).toBeInTheDocument();
  });

  it('displays site name and description inputs', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('site-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('site-description-input')).toBeInTheDocument();
  });

  it('displays notification switches', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('email-notifications-switch')).toBeInTheDocument();
    expect(screen.getByTestId('push-notifications-switch')).toBeInTheDocument();
  });

  it('displays save button', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('save-button')).toBeInTheDocument();
  });

  it('displays security card', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('security-card')).toBeInTheDocument();
    expect(screen.getByTestId('change-password-button')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    const siteNameInput = screen.getByTestId('site-name-input');
    const saveButton = screen.getByTestId('save-button');

    fireEvent.change(siteNameInput, { target: { value: '' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Please enter site name')).toBeInTheDocument();
    });
  });

  it('has default values for inputs', () => {
    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    const siteNameInput = screen.getByTestId('site-name-input') as HTMLInputElement;
    const siteDescInput = screen.getByTestId('site-description-input') as HTMLTextAreaElement;

    expect(siteNameInput.value).toBe('Chikox');
    expect(siteDescInput.value).toBe('Full-stack TypeScript application');
  });

  it('shows loading spinner when auth is loading', () => {
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: null,
      loading: true,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: () => false,
      isAuthenticated: false
    });

    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('redirects to login when not authenticated', () => {
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: null,
      loading: false,
      login: vi.fn(),
      logout: vi.fn(),
      isAdmin: () => false,
      isAuthenticated: false
    });

    render(
      <BrowserRouter>
        <SettingsPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
