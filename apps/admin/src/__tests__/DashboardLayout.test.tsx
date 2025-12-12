import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import * as authHook from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/' })
  };
});

describe('DashboardLayout', () => {
  const mockLogout = vi.fn();
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'ADMIN' as const,
    createdAt: '2024-01-01'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHook.useAuth).mockReturnValue({
      user: mockUser,
      loading: false,
      login: vi.fn(),
      logout: mockLogout,
      isAdmin: () => true,
      isAuthenticated: true
    });
  });

  it('renders dashboard layout with sidebar and header', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test Content</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    expect(screen.getByTestId('dashboard-layout')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('displays app logo', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    expect(screen.getByTestId('app-logo')).toHaveTextContent('Chikox');
  });

  it('displays user information', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin User')).toBeInTheDocument();
    expect(screen.getByText('ADMIN')).toBeInTheDocument();
  });

  it('renders navigation menu items', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('toggles sidebar collapse state', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    const foldIcon = screen.getByTestId('menu-fold');
    fireEvent.click(foldIcon);

    expect(screen.getByTestId('app-logo')).toHaveTextContent('C');

    const unfoldIcon = screen.getByTestId('menu-unfold');
    fireEvent.click(unfoldIcon);

    expect(screen.getByTestId('app-logo')).toHaveTextContent('Chikox');
  });

  it('navigates when menu item is clicked', () => {
    render(
      <BrowserRouter>
        <DashboardLayout>
          <div>Test</div>
        </DashboardLayout>
      </BrowserRouter>
    );

    const usersMenuItem = screen.getByText('Users');
    fireEvent.click(usersMenuItem);

    expect(mockNavigate).toHaveBeenCalledWith('/users');
  });
});
