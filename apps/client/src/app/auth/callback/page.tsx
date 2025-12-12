'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setTokenAndFetchUser } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const token = searchParams?.get('token');
      const error = searchParams?.get('error');

      if (error) {
        router.push(`/login?error=${error}`);
        return;
      }

      if (token) {
        const success = await setTokenAndFetchUser(token);
        if (success) {
          router.push('/');
        } else {
          router.push('/login?error=oauth_failed');
        }
      } else {
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, searchParams, setTokenAndFetchUser]);

  return (
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
      <p className="text-neutral">Completing sign in...</p>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background-primary">
      <Suspense
        fallback={
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-neutral">Loading...</p>
          </div>
        }
      >
        <OAuthCallbackContent />
      </Suspense>
    </div>
  );
}
