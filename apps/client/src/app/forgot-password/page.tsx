'use client';

import Link from 'next/link';
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Alert from '@/components/Alert';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await forgotPassword(email);

      if (result.success) {
        setSuccess(t('forgotPassword.success'));
        setEmail('');
      } else {
        setError(result.error || t('forgotPassword.failed'));
      }
    } catch {
      setError(t('forgotPassword.failed'));
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('forgotPassword.title')}</h1>
              <p className="text-sm sm:text-base text-neutral">{t('forgotPassword.subtitle')}</p>
            </div>

            {error && <Alert message={error} className="mb-4" />}
            {success && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-sm">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  {t('forgotPassword.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-text-alternative py-2.5 sm:py-3 rounded font-semibold text-sm sm:text-base hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('forgotPassword.sending') : t('forgotPassword.sendReset')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link
                href="/login"
                className="text-accent hover:text-accent-hover transition-colors font-medium"
              >
                {t('forgotPassword.backToLogin')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
