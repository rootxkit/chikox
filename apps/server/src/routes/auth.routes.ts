import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '@chikox/database';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserDTO,
  ApiResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '@chikox/types';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} from '../utils/auth.js';
import { sendPasswordResetEmail, sendVerificationEmail } from '../utils/email.js';
import crypto from 'crypto';

const verifyEmailSchema = z.object({
  token: z.string()
});

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  rememberMe: z.boolean().optional()
});

const forgotPasswordSchema = z.object({
  email: z.string().email()
});

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(8)
});

export async function authRoutes(server: FastifyInstance): Promise<void> {
  /**
   * Register a new user
   */
  server.post<{
    Body: RegisterRequest;
    Reply: ApiResponse<AuthResponse>;
  }>(
    '/register',
    {
      schema: {
        description: 'Register a new user account',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string', nullable: true },
                      role: { type: 'string' },
                      createdAt: { type: 'string' }
                    }
                  },
                  accessToken: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: RegisterRequest }>, reply: FastifyReply) => {
      try {
        // Validate request body
        const data = registerSchema.parse(request.body);

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { email: data.email }
        });

        if (existingUser) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'User with this email already exists',
              code: 'USER_EXISTS'
            }
          });
        }

        // Hash password
        const passwordHash = await hashPassword(data.password);

        // Create user
        const user = await prisma.user.create({
          data: {
            email: data.email,
            passwordHash,
            name: data.name,
            emailVerified: false
          }
        });

        // Generate email verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create verification token
        await prisma.emailVerificationToken.create({
          data: {
            userId: user.id,
            token: verificationToken,
            expiresAt: tokenExpiry
          }
        });

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        // Generate tokens
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

        const userDTO: UserDTO = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt.toISOString()
        };

        return reply.status(201).send({
          success: true,
          data: {
            user: userDTO,
            accessToken
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors
            }
          });
        }
        throw error;
      }
    }
  );

  /**
   * Login user
   */
  server.post<{
    Body: LoginRequest;
    Reply: ApiResponse<AuthResponse>;
  }>(
    '/login',
    {
      schema: {
        description: 'Login with email and password',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            rememberMe: { type: 'boolean' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string', nullable: true },
                      role: { type: 'string' },
                      createdAt: { type: 'string' }
                    }
                  },
                  accessToken: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: LoginRequest }>, reply: FastifyReply) => {
      try {
        const data = loginSchema.parse(request.body);

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: data.email }
        });

        if (!user) {
          return reply.status(401).send({
            success: false,
            error: {
              message: 'Invalid credentials',
              code: 'INVALID_CREDENTIALS'
            }
          });
        }

        // Verify password
        const isValidPassword = await verifyPassword(data.password, user.passwordHash);

        if (!isValidPassword) {
          return reply.status(401).send({
            success: false,
            error: {
              message: 'Invalid credentials',
              code: 'INVALID_CREDENTIALS'
            }
          });
        }

        // Generate tokens
        const { accessToken, refreshToken } = await generateTokens(request, {
          userId: user.id,
          email: user.email,
          role: user.role
        });

        // Session duration: 30 days if rememberMe, otherwise 7 days
        const sessionDuration = data.rememberMe
          ? 30 * 24 * 60 * 60 * 1000 // 30 days
          : 7 * 24 * 60 * 60 * 1000; // 7 days

        // Create session
        await prisma.session.create({
          data: {
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + sessionDuration),
            userAgent: request.headers['user-agent'],
            ipAddress: request.ip
          }
        });

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        });

        // Set refresh token cookie
        setRefreshTokenCookie(reply, refreshToken);

        const userDTO: UserDTO = {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt.toISOString()
        };

        return reply.send({
          success: true,
          data: {
            user: userDTO,
            accessToken
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors
            }
          });
        }
        throw error;
      }
    }
  );

  /**
   * Logout user
   */
  server.post(
    '/logout',
    {
      schema: {
        description: 'Logout and invalidate refresh token',
        tags: ['Authentication'],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const refreshToken = request.cookies.refreshToken;

      if (refreshToken) {
        // Delete session
        await prisma.session.deleteMany({
          where: { refreshToken }
        });
      }

      // Clear cookie
      clearRefreshTokenCookie(reply);

      return reply.send({ success: true });
    }
  );

  /**
   * Request password reset
   */
  server.post<{
    Body: ForgotPasswordRequest;
    Reply: ApiResponse<{ message: string }>;
  }>(
    '/forgot-password',
    {
      schema: {
        description: 'Request a password reset email',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: ForgotPasswordRequest }>, reply: FastifyReply) => {
      try {
        const data = forgotPasswordSchema.parse(request.body);

        // Find user
        const user = await prisma.user.findUnique({
          where: { email: data.email }
        });

        // Always return success to prevent email enumeration
        if (!user) {
          return reply.send({
            success: true,
            data: {
              message: 'If an account exists with this email, a reset link has been sent'
            }
          });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Invalidate any existing tokens
        await prisma.passwordResetToken.updateMany({
          where: { userId: user.id, used: false },
          data: { used: true }
        });

        // Create new reset token
        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: resetToken,
            expiresAt: tokenExpiry
          }
        });

        // Send password reset email
        await sendPasswordResetEmail(user.email, resetToken);

        return reply.send({
          success: true,
          data: {
            message: 'If an account exists with this email, a reset link has been sent'
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors
            }
          });
        }
        throw error;
      }
    }
  );

  /**
   * Reset password with token
   */
  server.post<{
    Body: ResetPasswordRequest;
    Reply: ApiResponse<{ message: string }>;
  }>(
    '/reset-password',
    {
      schema: {
        description: 'Reset password using token',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['token', 'password'],
          properties: {
            token: { type: 'string' },
            password: { type: 'string', minLength: 8 }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: ResetPasswordRequest }>, reply: FastifyReply) => {
      try {
        const data = resetPasswordSchema.parse(request.body);

        // Find valid token
        const resetToken = await prisma.passwordResetToken.findUnique({
          where: { token: data.token },
          include: { user: true }
        });

        if (!resetToken || resetToken.used || resetToken.expiresAt < new Date()) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Invalid or expired reset token',
              code: 'INVALID_TOKEN'
            }
          });
        }

        // Hash new password
        const passwordHash = await hashPassword(data.password);

        // Update user password and mark token as used
        await prisma.$transaction([
          prisma.user.update({
            where: { id: resetToken.userId },
            data: {
              passwordHash,
              passwordChangedAt: new Date()
            }
          }),
          prisma.passwordResetToken.update({
            where: { id: resetToken.id },
            data: { used: true }
          }),
          // Invalidate all sessions for security
          prisma.session.deleteMany({
            where: { userId: resetToken.userId }
          })
        ]);

        return reply.send({
          success: true,
          data: {
            message: 'Password has been reset successfully'
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors
            }
          });
        }
        throw error;
      }
    }
  );

  /**
   * Verify email address
   */
  server.post<{
    Body: { token: string };
    Reply: ApiResponse<{ message: string }>;
  }>(
    '/verify-email',
    {
      schema: {
        description: 'Verify email address with token',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['token'],
          properties: {
            token: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: { token: string } }>, reply: FastifyReply) => {
      try {
        const data = verifyEmailSchema.parse(request.body);

        // Find valid token
        const verificationToken = await prisma.emailVerificationToken.findUnique({
          where: { token: data.token },
          include: { user: true }
        });

        if (
          !verificationToken ||
          verificationToken.used ||
          verificationToken.expiresAt < new Date()
        ) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Invalid or expired verification token',
              code: 'INVALID_TOKEN'
            }
          });
        }

        // Check if already verified
        if (verificationToken.user.emailVerified) {
          return reply.send({
            success: true,
            data: {
              message: 'Email is already verified'
            }
          });
        }

        // Update user and mark token as used
        await prisma.$transaction([
          prisma.user.update({
            where: { id: verificationToken.userId },
            data: { emailVerified: true }
          }),
          prisma.emailVerificationToken.update({
            where: { id: verificationToken.id },
            data: { used: true }
          })
        ]);

        return reply.send({
          success: true,
          data: {
            message: 'Email verified successfully'
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors
            }
          });
        }
        throw error;
      }
    }
  );

  /**
   * Resend verification email
   */
  server.post<{
    Body: { email: string };
    Reply: ApiResponse<{ message: string }>;
  }>(
    '/resend-verification',
    {
      schema: {
        description: 'Resend verification email',
        tags: ['Authentication'],
        body: {
          type: 'object',
          required: ['email'],
          properties: {
            email: { type: 'string', format: 'email' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  message: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
      try {
        const { email } = request.body;

        // Find user
        const user = await prisma.user.findUnique({
          where: { email }
        });

        // Always return success to prevent email enumeration
        if (!user || user.emailVerified) {
          return reply.send({
            success: true,
            data: {
              message:
                'If an unverified account exists with this email, a verification link has been sent'
            }
          });
        }

        // Invalidate any existing tokens
        await prisma.emailVerificationToken.updateMany({
          where: { userId: user.id, used: false },
          data: { used: true }
        });

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // Create new token
        await prisma.emailVerificationToken.create({
          data: {
            userId: user.id,
            token: verificationToken,
            expiresAt: tokenExpiry
          }
        });

        // Send verification email
        await sendVerificationEmail(user.email, verificationToken);

        return reply.send({
          success: true,
          data: {
            message:
              'If an unverified account exists with this email, a verification link has been sent'
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Validation failed',
              code: 'VALIDATION_ERROR',
              details: error.errors
            }
          });
        }
        throw error;
      }
    }
  );
}
