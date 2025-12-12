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

            <div className="mt-6 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border-primary"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-background-alternative text-neutral">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/google`}
                  className="flex items-center justify-center gap-2 w-full bg-white text-gray-900 py-2.5 px-4 rounded font-medium text-sm hover:bg-gray-50 transition-colors border border-gray-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </a>

                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/oauth/facebook`}
                  className="flex items-center justify-center gap-2 w-full bg-[#1877F2] text-white py-2.5 px-4 rounded font-medium text-sm hover:bg-[#166FE5] transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </a>
              </div>
            </div>

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
