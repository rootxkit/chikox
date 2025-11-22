'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Alert from '@/components/Alert';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ email, password, rememberMe });

      if (result.success) {
        router.push('/');
      } else {
        // Check for specific error codes and translate them
        if (result.errorCode === 'EMAIL_NOT_VERIFIED') {
          setError(t('login.emailNotVerified'));
        } else if (result.errorCode === 'INVALID_CREDENTIALS') {
          setError(t('login.invalidCredentials'));
        } else {
          setError(result.error || t('login.failed'));
        }
      }
    } catch {
      setError(t('login.failed'));
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
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('login.title')}</h1>
              <p className="text-sm sm:text-base text-neutral">{t('login.subtitle')}</p>
            </div>

            {error && <Alert message={error} className="mb-4" />}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-1.5">
                  {t('login.email')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                  placeholder={t('login.emailPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-1.5">
                  {t('login.password')}
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 sm:px-4 sm:py-2.5 bg-background-primary border border-border-primary rounded text-sm sm:text-base text-text-primary placeholder-neutral focus:outline-none focus:border-accent transition-colors"
                  placeholder={t('login.passwordPlaceholder')}
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border-primary bg-background-primary accent-accent"
                  />
                  <span className="text-neutral">{t('login.rememberMe')}</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-accent hover:text-accent-hover transition-colors"
                >
                  {t('login.forgotPassword')}
                </Link>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-accent text-text-alternative py-2.5 sm:py-3 rounded font-semibold text-sm sm:text-base hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? t('login.signingIn') : t('login.signIn')}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-neutral">{t('login.noAccount')} </span>
              <Link
                href="/register"
                className="text-accent hover:text-accent-hover transition-colors font-medium"
              >
                {t('login.signUp')}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
