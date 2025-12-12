import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@chikox/database';
import type {
  OAuthCallbackQuery,
  OAuthUserProfile,
  AuthResponse,
  UserDTO,
  ApiResponse
} from '@chikox/types';
import { generateTokens, setRefreshTokenCookie } from '../utils/auth.js';

interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
  token_type: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
}

interface FacebookUserInfo {
  id: string;
  email: string;
  name?: string;
  picture?: {
    data: {
      url: string;
    };
  };
}

/**
 * Find or create user from OAuth provider
 */
async function findOrCreateOAuthUser(
  provider: string,
  profile: OAuthUserProfile,
  accessToken: string,
  refreshToken?: string
): Promise<UserDTO> {
  // Check if OAuth account exists
  const existingOAuthAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId: profile.id
      }
    },
    include: { user: true }
  });

  if (existingOAuthAccount) {
    // Update existing OAuth account tokens
    await prisma.oAuthAccount.update({
      where: { id: existingOAuthAccount.id },
      data: {
        accessToken,
        refreshToken,
        updatedAt: new Date()
      }
    });

    // Update user's last login
    const updatedUser = await prisma.user.update({
      where: { id: existingOAuthAccount.userId },
      data: {
        lastLoginAt: new Date(),
        // Update name and avatar if they changed
        name: profile.name || existingOAuthAccount.user.name,
        avatar: profile.avatar || existingOAuthAccount.user.avatar
      }
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt.toISOString()
    };
  }

  // Check if user with this email exists
  const existingUser = await prisma.user.findUnique({
    where: { email: profile.email }
  });

  if (existingUser) {
    // Link OAuth account to existing user
    await prisma.oAuthAccount.create({
      data: {
        userId: existingUser.id,
        provider,
        providerAccountId: profile.id,
        accessToken,
        refreshToken
      }
    });

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        lastLoginAt: new Date(),
        emailVerified: true, // Email verified by OAuth provider
        name: profile.name || existingUser.name,
        avatar: profile.avatar || existingUser.avatar
      }
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      emailVerified: updatedUser.emailVerified,
      avatar: updatedUser.avatar,
      createdAt: updatedUser.createdAt.toISOString()
    };
  }

  // Create new user with OAuth account
  const newUser = await prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name,
      avatar: profile.avatar,
      emailVerified: true, // Email verified by OAuth provider
      oauthAccounts: {
        create: {
          provider,
          providerAccountId: profile.id,
          accessToken,
          refreshToken
        }
      }
    }
  });

  return {
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    emailVerified: newUser.emailVerified,
    avatar: newUser.avatar,
    createdAt: newUser.createdAt.toISOString()
  };
}

export async function oauthRoutes(server: FastifyInstance): Promise<void> {
  /**
   * Google OAuth Login - Redirect to Google
   */
  server.get(
    '/google',
    {
      schema: {
        description: 'Initiate Google OAuth login',
        tags: ['OAuth']
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: 'code',
        scope: 'openid email profile',
        access_type: 'offline',
        prompt: 'consent'
      })}`;

      return reply.redirect(googleAuthUrl);
    }
  );

  /**
   * Google OAuth Callback
   */
  server.get<{
    Querystring: OAuthCallbackQuery;
    Reply: ApiResponse<AuthResponse>;
  }>(
    '/google/callback',
    {
      schema: {
        description: 'Handle Google OAuth callback',
        tags: ['OAuth'],
        querystring: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            state: { type: 'string' }
          },
          required: ['code']
        }
      }
    },
    async (request: FastifyRequest<{ Querystring: OAuthCallbackQuery }>, reply: FastifyReply) => {
      try {
        const { code } = request.query;

        // Exchange code for tokens
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            code,
            client_id: process.env.GOOGLE_CLIENT_ID!,
            client_secret: process.env.GOOGLE_CLIENT_SECRET!,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
            grant_type: 'authorization_code'
          })
        });

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for tokens');
        }

        const tokens: GoogleTokenResponse = await tokenResponse.json();

        // Get user info
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: { Authorization: `Bearer ${tokens.access_token}` }
        });

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const googleUser: GoogleUserInfo = await userInfoResponse.json();

        // Find or create user
        const user = await findOrCreateOAuthUser(
          'google',
          {
            id: googleUser.sub,
            email: googleUser.email,
            name: googleUser.name,
            avatar: googleUser.picture
          },
          tokens.access_token,
          tokens.refresh_token
        );

        // Generate JWT tokens
        const { accessToken, refreshToken } = await generateTokens(request, {
          userId: user.id,
          email: user.email,
          role: user.role
        });

        // Create session
        await prisma.session.create({
          data: {
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userAgent: request.headers['user-agent'],
            ipAddress: request.ip
          }
        });

        // Set refresh token cookie
        setRefreshTokenCookie(reply, refreshToken);

        // Redirect to client with access token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return reply.redirect(`${clientUrl}/auth/callback?token=${accessToken}`);
      } catch (error) {
        server.log.error(error);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return reply.redirect(`${clientUrl}/login?error=oauth_failed`);
      }
    }
  );

  /**
   * Facebook OAuth Login - Redirect to Facebook
   */
  server.get(
    '/facebook',
    {
      schema: {
        description: 'Initiate Facebook OAuth login',
        tags: ['OAuth']
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const facebookAuthUrl = `https://www.facebook.com/v18.0/dialog/oauth?${new URLSearchParams({
        client_id: process.env.FACEBOOK_APP_ID!,
        redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
        scope: 'email,public_profile',
        response_type: 'code'
      })}`;

      return reply.redirect(facebookAuthUrl);
    }
  );

  /**
   * Facebook OAuth Callback
   */
  server.get<{
    Querystring: OAuthCallbackQuery;
    Reply: ApiResponse<AuthResponse>;
  }>(
    '/facebook/callback',
    {
      schema: {
        description: 'Handle Facebook OAuth callback',
        tags: ['OAuth'],
        querystring: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            state: { type: 'string' }
          },
          required: ['code']
        }
      }
    },
    async (request: FastifyRequest<{ Querystring: OAuthCallbackQuery }>, reply: FastifyReply) => {
      try {
        const { code } = request.query;

        // Exchange code for access token
        const tokenResponse = await fetch(
          `https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams({
            client_id: process.env.FACEBOOK_APP_ID!,
            client_secret: process.env.FACEBOOK_APP_SECRET!,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI!,
            code
          })}`
        );

        if (!tokenResponse.ok) {
          throw new Error('Failed to exchange code for token');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        // Get user info
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?fields=id,email,name,picture&access_token=${accessToken}`
        );

        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info');
        }

        const facebookUser: FacebookUserInfo = await userInfoResponse.json();

        if (!facebookUser.email) {
          throw new Error('Email not provided by Facebook');
        }

        // Find or create user
        const user = await findOrCreateOAuthUser(
          'facebook',
          {
            id: facebookUser.id,
            email: facebookUser.email,
            name: facebookUser.name,
            avatar: facebookUser.picture?.data?.url
          },
          accessToken
        );

        // Generate JWT tokens
        const { accessToken: jwtAccessToken, refreshToken } = await generateTokens(request, {
          userId: user.id,
          email: user.email,
          role: user.role
        });

        // Create session
        await prisma.session.create({
          data: {
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            userAgent: request.headers['user-agent'],
            ipAddress: request.ip
          }
        });

        // Set refresh token cookie
        setRefreshTokenCookie(reply, refreshToken);

        // Redirect to client with access token
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return reply.redirect(`${clientUrl}/auth/callback?token=${jwtAccessToken}`);
      } catch (error) {
        server.log.error(error);
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3001';
        return reply.redirect(`${clientUrl}/login?error=oauth_failed`);
      }
    }
  );
}
