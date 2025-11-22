'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Alert from '@/components/Alert';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('register.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('register.passwordTooShort'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await register({ email, password, name: name || undefined });

      if (result.success) {
        setSuccess(result.message || t('register.verificationSent'));
      } else {
        setError(result.error || t('register.failed'));
      }
    } catch {
      setError(t('register.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-background-alternative border border-border-primary rounded-lg p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('register.title')}</h1>
              <p className="text-sm sm:text-base text-neutral">{t('register.subtitle')}</p>
            </div>

            {error && <Alert message={error} className="mb-4" />}

            {success ? (
              <div className="text-center">
                <div className="mb-4 p-4 bg-green-500/10 border border-green-500/20 rounded text-green-500">
                  {success}
                </div>
                <Link
                  href="/login"
                  className="text-accent hover:text-accent-hover transition-colors font-medium"
                >
                  {t('register.signIn')}
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1.5">
                    {t('register.name')}
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                    placeholder={t('register.namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                    {t('register.email')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                    placeholder={t('register.emailPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                    {t('register.password')}
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                    placeholder={t('register.passwordPlaceholder')}
                  />
                  <p className="mt-1 text-xs text-neutral">{t('register.passwordHint')}</p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
                    {t('register.confirmPassword')}
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                    placeholder={t('register.confirmPasswordPlaceholder')}
                  />
                </div>

                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    required
                    className="w-4 h-4 mt-0.5 rounded border-border-primary bg-background-primary accent-accent"
                  />
                  <label htmlFor="terms" className="text-sm text-neutral cursor-pointer">
                    {t('register.terms')}{' '}
                    <Link
                      href="/terms"
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      {t('register.termsOfService')}
                    </Link>{' '}
                    {t('register.and')}{' '}
                    <Link
                      href="/privacy"
                      className="text-accent hover:text-accent-hover transition-colors"
                    >
                      {t('register.privacyPolicy')}
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-accent text-text-alternative py-2.5 sm:py-3 rounded font-semibold text-sm sm:text-base hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? t('register.creatingAccount') : t('register.createAccount')}
                </button>
              </form>
            )}

            {!success && (
              <div className="mt-6 text-center text-sm">
                <span className="text-neutral">{t('register.hasAccount')} </span>
                <Link
                  href="/login"
                  className="text-accent hover:text-accent-hover transition-colors font-medium"
                >
                  {t('register.signIn')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
