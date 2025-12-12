# OAuth Setup Guide - Google & Facebook Authentication

This guide explains the OAuth implementation for Google and Facebook authentication in Chikox.

## Changes Made

### 1. Database Schema Updates (`packages/database/prisma/schema.prisma`)
- Made `passwordHash` optional for OAuth users
- Added `avatar` field to User model
- Made `passwordChangedAt` optional
- Created new `OAuthAccount` model to store OAuth provider data

### 2. Type Definitions (`packages/types/src/index.ts`)
- Added `avatar` field to `UserDTO`
- Created `OAuthCallbackQuery` interface
- Created `OAuthUserProfile` interface

### 3. Server Changes

#### Dependencies
- Installed `@fastify/oauth2` package

#### New Files
- `apps/server/src/routes/oauth.routes.ts` - OAuth route handlers for Google and Facebook

#### Updated Files
- `apps/server/src/index.ts` - Registered OAuth routes at `/api/v1/auth/oauth`
- `apps/server/.env.example` - Added OAuth environment variables

### 4. OAuth Routes Available

**Google OAuth:**
- `GET /api/v1/auth/oauth/google` - Redirects to Google login
- `GET /api/v1/auth/oauth/google/callback` - Handles Google callback

**Facebook OAuth:**
- `GET /api/v1/auth/oauth/facebook` - Redirects to Facebook login
- `GET /api/v1/auth/oauth/facebook/callback` - Handles Facebook callback

## Required Steps to Complete Setup

### Step 1: Run Database Migration

```bash
# Generate Prisma client
npm run db:generate

# Create and run migration
npm run db:migrate

# Or for development, push schema directly
npm run db:push
```

### Step 2: Build Shared Packages

```bash
npm run build:packages
```

### Step 3: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure OAuth consent screen
6. Set authorized redirect URIs:
   - Development: `http://localhost:3000/api/v1/auth/oauth/google/callback`
   - Production: `https://your-domain.com/api/v1/auth/oauth/google/callback`
7. Copy Client ID and Client Secret

### Step 4: Setup Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Configure OAuth redirect URIs:
   - Development: `http://localhost:3000/api/v1/auth/oauth/facebook/callback`
   - Production: `https://your-domain.com/api/v1/auth/oauth/facebook/callback`
5. Copy App ID and App Secret

### Step 5: Update Environment Variables

Add to `apps/server/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-actual-google-client-id
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/v1/auth/oauth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=your-actual-facebook-app-id
FACEBOOK_APP_SECRET=your-actual-facebook-app-secret
FACEBOOK_REDIRECT_URI=http://localhost:3000/api/v1/auth/oauth/facebook/callback

# Client URL (for redirects after OAuth)
CLIENT_URL=http://localhost:3001
```

### Step 6: Add Client-Side OAuth Buttons

Update `apps/client/src/app/login/page.tsx` to add OAuth login buttons:

```tsx
// Add this after the regular login form, before the "No account?" text

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
          fill="currentColor"
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
```

### Step 7: Create OAuth Callback Page

Create `apps/client/src/app/auth/callback/page.tsx`:

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAccessToken } = useAuth();

  useEffect(() => {
    const token = searchParams?.get('token');
    const error = searchParams?.get('error');

    if (error) {
      router.push(`/login?error=${error}`);
      return;
    }

    if (token) {
      // Store the access token
      localStorage.setItem('accessToken', token);

      // Update auth context if you have a method for it
      // or trigger a re-fetch of user data

      // Redirect to home
      router.push('/');
    } else {
      router.push('/login');
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
        <p className="text-neutral">Completing sign in...</p>
      </div>
    </div>
  );
}
```

### Step 8: Update AuthContext (if needed)

Make sure your `AuthContext` can handle OAuth-authenticated users. The OAuth flow stores the access token in localStorage and sets the refresh token as an HttpOnly cookie automatically.

## How It Works

1. User clicks "Continue with Google" or "Continue with Facebook"
2. User is redirected to OAuth provider's login page
3. After successful authentication, provider redirects back to `/api/v1/auth/oauth/{provider}/callback`
4. Server exchanges authorization code for access token
5. Server fetches user profile from OAuth provider
6. Server finds or creates user in database
7. Server links OAuth account to user
8. Server generates JWT tokens
9. Server redirects to client callback page with access token in URL
10. Client stores token and redirects to home page

## Security Features

- OAuth accounts are linked to users by email
- Email is automatically verified for OAuth users
- Refresh tokens stored as HttpOnly cookies
- Access tokens have 15-minute expiration
- Session tracking with user agent and IP address
- Provider tokens stored securely in database

## Testing

1. Start the server: `npm run dev:server`
2. Start the client: `npm run dev:client`
3. Navigate to http://localhost:3001/login
4. Click "Continue with Google" or "Continue with Facebook"
5. Complete OAuth flow
6. Verify you're logged in and redirected to home page

## Production Considerations

1. Use HTTPS for all OAuth redirects
2. Set production redirect URIs in Google/Facebook consoles
3. Use strong secrets for JWT and cookies
4. Enable secure cookies in production
5. Configure CORS properly
6. Monitor OAuth token usage and refresh as needed
7. Implement rate limiting on OAuth endpoints
8. Add error logging for OAuth failures

## Troubleshooting

**"Email not provided by Facebook"**
- Ensure you've requested `email` scope
- User must have a verified email on Facebook

**"Failed to exchange code for tokens"**
- Check client ID and secret are correct
- Verify redirect URI matches exactly
- Check OAuth app is not in development mode (for production)

**Redirect loop**
- Verify CLIENT_URL is set correctly
- Check that callback page exists at `/auth/callback`

**User created but not logged in**
- Check JWT secrets are configured
- Verify tokens are being generated correctly
- Check browser console for localStorage issues
