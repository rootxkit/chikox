'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Disable body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/products', label: t('nav.products') },
    { href: '/about', label: t('nav.about') }
  ];

  const authLinks = isAuthenticated
    ? []
    : [
        { href: '/login', label: t('nav.login') },
        { href: '/register', label: t('nav.register') }
      ];

  return (
    <nav className="border-b border-border-primary bg-background-alternative sticky top-0 z-50">
      <div className="container py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl sm:text-2xl font-bold text-text-primary hover:text-accent transition-colors"
          >
            <span className="text-accent">Chiko</span>x
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm lg:text-base text-text-primary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm lg:text-base text-text-primary hover:text-accent transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && user && (
              <>
                <span className="text-sm lg:text-base text-text-primary">
                  {user.name || user.email}
                </span>
                <button
                  onClick={logout}
                  className="text-sm lg:text-base text-text-primary hover:text-accent transition-colors"
                >
                  {t('nav.logout')}
                </button>
              </>
            )}
            <div className="flex items-center gap-3 ml-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <button
              onClick={toggleMenu}
              className="p-2 text-text-primary hover:text-accent transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Full Screen Overlay */}
        {isMenuOpen && (
          <div className="md:hidden fixed inset-0 top-[57px] bg-background-alternative z-40">
            <div className="container h-full flex flex-col pt-4">
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-sm text-text-primary hover:text-accent transition-colors py-2.5 border-b border-border-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                {authLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="text-sm text-text-primary hover:text-accent transition-colors py-2.5 border-b border-border-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated && user && (
                  <>
                    <span className="text-sm text-text-primary py-2.5 border-b border-border-primary">
                      {user.name || user.email}
                    </span>
                    <button
                      onClick={() => {
                        closeMenu();
                        logout();
                      }}
                      className="text-sm text-text-primary hover:text-accent transition-colors py-2.5 border-b border-border-primary text-left"
                    >
                      {t('nav.logout')}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
