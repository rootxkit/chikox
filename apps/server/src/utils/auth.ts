import bcrypt from 'bcryptjs';
import type { FastifyRequest, FastifyReply } from 'fastify';
import type { JWTPayload } from '@chikox/types';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate access and refresh tokens
 */
export async function generateTokens(
  request: FastifyRequest,
  payload: JWTPayload
): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken = request.server.jwt.sign(payload);

  const refreshToken = request.server.jwt.sign(
    { userId: payload.userId, sessionId: 'temp' }, // sessionId will be updated after session creation
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
    }
  );

  return { accessToken, refreshToken };
}

/**
 * Set refresh token as HttpOnly cookie
 */
export function setRefreshTokenCookie(reply: FastifyReply, refreshToken: string): void {
  reply.setCookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    path: '/'
  });
}

/**
 * Clear refresh token cookie
 */
export function clearRefreshTokenCookie(reply: FastifyReply): void {
  reply.clearCookie('refreshToken', {
    path: '/'
  });
}

/**
 * Authentication middleware - verifies JWT from Authorization header
 */
export async function authenticate(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({
      success: false,
      error: {
        message: 'Authentication required',
        code: 'UNAUTHORIZED'
      }
    });
  }
}

/**
 * Authorization middleware - checks user role
 */
export function authorize(...allowedRoles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = request.user as JWTPayload;

    if (!allowedRoles.includes(user.role)) {
      reply.status(403).send({
        success: false,
        error: {
          message: 'Insufficient permissions',
          code: 'FORBIDDEN'
        }
      });
    }
  };
}
