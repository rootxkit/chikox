'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const { t } = useLanguage();

  return (
    <nav className="border-b border-border-primary bg-background-alternative sticky top-0 z-50">
      <div className="container py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-bold text-text-primary hover:text-accent transition-colors">
            <span className="text-accent">Chiko</span>x
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm sm:text-base text-text-primary hover:text-accent transition-colors"
            >
              {t('nav.login')}
            </Link>
            <Link
              href="/register"
              className="text-sm sm:text-base text-text-primary hover:text-accent transition-colors"
            >
              {t('nav.register')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
