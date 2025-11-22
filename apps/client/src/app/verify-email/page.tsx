'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import api from '@/lib/api';

function VerifyEmailContent() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError(t('verifyEmail.invalidToken'));
        setIsLoading(false);
        return;
      }

      try {
        const result = await api.verifyEmail(token);

        if (result.success) {
          setSuccess(t('verifyEmail.success'));
        } else {
          setError(t('verifyEmail.failed'));
        }
      } catch {
        setError(t('verifyEmail.failed'));
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token, t]);

  return (
    <>
      {isLoading && (
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-neutral">{t('verifyEmail.verifying')}</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="text-center">
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm">
            {error}
          </div>
          <p className="text-neutral text-sm mb-4">{t('verifyEmail.tryAgain')}</p>
        </div>
      )}

      {!isLoading && success && (
        <div className="text-center">
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded text-green-500 text-sm">
            {success}
          </div>
          <p className="text-neutral text-sm mb-4">{t('verifyEmail.canLogin')}</p>
        </div>
      )}

      <div className="mt-6 text-center text-sm">
        <Link
          href="/login"
          className="text-accent hover:text-accent-hover transition-colors font-medium"
        >
          {t('verifyEmail.goToLogin')}
        </Link>
      </div>
    </>
  );
}

export default function VerifyEmailPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-background-primary text-text-primary">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="bg-background-alternative border border-border-primary rounded-lg p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('verifyEmail.title')}</h1>
              <p className="text-sm sm:text-base text-neutral">{t('verifyEmail.subtitle')}</p>
            </div>

            <Suspense fallback={<div className="text-center text-neutral">Loading...</div>}>
              <VerifyEmailContent />
            </Suspense>
          </div>
        </div>
      </main>
    </div>
  );
}
