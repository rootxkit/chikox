import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('should render login form', () => {
    render(<Home />);

    expect(screen.getByText('Chikox Login')).toBeDefined();
    expect(screen.getByLabelText('Email')).toBeDefined();
    expect(screen.getByLabelText('Password')).toBeDefined();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeDefined();
  });

  it('should have email and password inputs', () => {
    render(<Home />);

    const emailInput = screen.getByLabelText('Email') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    expect(emailInput.type).toBe('email');
    expect(passwordInput.type).toBe('password');
  });
});
