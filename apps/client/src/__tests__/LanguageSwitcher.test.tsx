import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { LanguageProvider } from '../context/LanguageContext';

describe('LanguageSwitcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.getItem = vi.fn().mockReturnValue(null);
  });

  it('renders EN and GE buttons', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    expect(screen.getByText('EN')).toBeInTheDocument();
    expect(screen.getByText('GE')).toBeInTheDocument();
  });

  it('switches to Georgian when GE is clicked', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const geButton = screen.getByText('GE');
    fireEvent.click(geButton);

    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'ge');
  });

  it('switches to English when EN is clicked', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const enButton = screen.getByText('EN');
    fireEvent.click(enButton);

    expect(localStorage.setItem).toHaveBeenCalledWith('language', 'en');
  });

  it('highlights active language button', () => {
    render(
      <LanguageProvider>
        <LanguageSwitcher />
      </LanguageProvider>
    );

    const enButton = screen.getByText('EN');
    // Default language is EN, so it should have accent background
    expect(enButton.className).toContain('bg-accent');
  });
});
