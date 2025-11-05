import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import UsersPage from '@/pages/Users';
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
    useLocation: () => ({ pathname: '/dashboard/users' })
  };
});

describe('UsersPage', () => {
  const mockUser = {
    id: '1',
    email: 'admin@example.com',
    name: 'Admin',
    role: 'ADMIN' as const,
    createdAt: '2024-01-01'
  };

  const mockUsers = [
    { id: '1', email: 'john@example.com', name: 'John Doe', role: 'USER' as const, createdAt: '2024-01-01' },
    { id: '2', email: 'jane@example.com', name: 'Jane Smith', role: 'ADMIN' as const, createdAt: '2024-01-02' },
    { id: '3', email: 'bob@example.com', name: 'Bob Johnson', role: 'SUPER_ADMIN' as const, createdAt: '2024-01-03' }
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

  it('renders users page', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('users-page')).toBeInTheDocument();
    expect(screen.getByText('Users Management')).toBeInTheDocument();
  });

  it('displays users table with data', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('users-table')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
    expect(screen.getByText('bob@example.com')).toBeInTheDocument();
  });

  it('displays add user button', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('add-user-button')).toBeInTheDocument();
  });

  it('displays search input', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('filters users based on search text', async () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'john' } });

    await waitFor(() => {
      const table = screen.getByTestId('users-table');
      const rows = table.querySelectorAll('tbody tr');
      // Should only show 1 user (john)
      expect(rows.length).toBe(1);
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('displays role tags with correct colors', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    const roleTags = screen.getAllByTestId('role-tag');
    expect(roleTags).toHaveLength(3);
    expect(roleTags[0]).toHaveTextContent('USER');
    expect(roleTags[1]).toHaveTextContent('ADMIN');
    expect(roleTags[2]).toHaveTextContent('SUPER_ADMIN');
  });

  it('displays edit and delete buttons for each user', () => {
    render(
      <BrowserRouter>
        <UsersPage />
      </BrowserRouter>
    );

    const editButtons = screen.getAllByTestId('edit-button');
    const deleteButtons = screen.getAllByTestId('delete-button');

    expect(editButtons).toHaveLength(3);
    expect(deleteButtons).toHaveLength(3);
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
        <UsersPage />
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
        <UsersPage />
      </BrowserRouter>
    );

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
