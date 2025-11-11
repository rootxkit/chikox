import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../app/page';

describe('Home Page', () => {
  it('should render navbar with logo', () => {
    render(<Home />);

    expect(screen.getByText('Chikox')).toBeDefined();
    expect(screen.getByText('Login')).toBeDefined();
    expect(screen.getByText('Register')).toBeDefined();
  });

  it('should render hero section', () => {
    render(<Home />);

    expect(screen.getByText(/Medium length hero heading goes here/i)).toBeDefined();
  });
});
