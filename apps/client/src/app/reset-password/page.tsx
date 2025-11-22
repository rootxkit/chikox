'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Alert from '@/components/Alert';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();
  const { resetPassword } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError(t('resetPassword.invalidToken'));
    }
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError(t('resetPassword.passwordMismatch'));
      return;
    }

    if (password.length < 8) {
      setError(t('resetPassword.passwordTooShort'));
      return;
    }

    if (!token) {
      setError(t('resetPassword.invalidToken'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await resetPassword(token, password);

      if (result.success) {
        setSuccess(result.message || t('resetPassword.success'));
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.error || t('resetPassword.failed'));
      }
    } catch {
      setError(t('resetPassword.failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {error && <Alert message={error} className="mb-4" />}
      {success && (
        <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-sm">
          {success}
        </div>
      )}

      {token && !success && (
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5">
              {t('resetPassword.newPassword')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
              placeholder={t('resetPassword.newPasswordPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1.5">
              {t('resetPassword.confirmPassword')}
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
              placeholder={t('resetPassword.confirmPasswordPlaceholder')}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-text-alternative py-2.5 sm:py-3 rounded font-semibold text-sm sm:text-base hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('resetPassword.resetting') : t('resetPassword.resetButton')}
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-accent hover:text-accent-hover transition-colors font-medium"
        >
          {t('resetPassword.backToLogin')}
        </Link>
      </div>
    </>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-background-alternative border border-border-primary rounded-lg p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('resetPassword.title')}</h1>
              <p className="text-sm sm:text-base text-neutral">{t('resetPassword.subtitle')}</p>
            </div>

            <Suspense fallback={<div className="text-center text-neutral">Loading...</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
