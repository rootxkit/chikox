import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from '@/pages/Dashboard';
import * as authHook from '@/hooks/useAuth';
import * as usersHook from '@/hooks/useUsers';

vi.mock('@/hooks/useAuth');
vi.mock('@/hooks/useUsers');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/dashboard' })
  };
});

describe('DashboardPage', () => {
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin',
    role: 'ADMIN' as const,
    createdAt: '2024-01-01'
  };

  const mockUsers = [
    { ...mockUser, id: '1' },
    { ...mockUser, id: '2', role: 'USER' as const },
    { ...mockUser, id: '3', role: 'USER' as const }
  ];

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
    vi.mocked(usersHook.useUsers).mockReturnValue({
      users: mockUsers,
      isLoading: false,
      error: undefined,
      mutate: vi.fn()
    });
  });

  it('renders dashboard page', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('dashboard-page')).toBeInTheDocument();
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0);
  });

  it('displays statistics cards', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('total-users-card')).toBeInTheDocument();
    expect(screen.getByTestId('active-users-card')).toBeInTheDocument();
    expect(screen.getByTestId('admin-users-card')).toBeInTheDocument();
    expect(screen.getByTestId('growth-rate-card')).toBeInTheDocument();
  });

  it('displays correct user counts', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getAllByText('3').length).toBeGreaterThan(0); // total users
    expect(screen.getAllByText('1').length).toBeGreaterThan(0); // admin users
  });

  it('displays recent activity card', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('recent-activity-card')).toBeInTheDocument();
    expect(screen.getByText('No recent activity to display.')).toBeInTheDocument();
  });

  it('displays quick actions card', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('quick-actions-card')).toBeInTheDocument();
    expect(screen.getByTestId('manage-users-button')).toBeInTheDocument();
    expect(screen.getByTestId('settings-button')).toBeInTheDocument();
    expect(screen.getByTestId('reports-button')).toBeInTheDocument();
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
        <DashboardPage />
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
        <DashboardPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  it('logs out when not admin', () => {
    const mockLogout = vi.fn();
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: { ...mockUser, role: 'USER' },
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
      isAdmin: () => false,
      isAuthenticated: true
    });

    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(mockLogout).toHaveBeenCalled();
  });
});
