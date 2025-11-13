import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { prisma } from '@chikox/database';
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserDTO,
  ApiResponse
} from '@chikox/types';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  setRefreshTokenCookie,
  clearRefreshTokenCookie
} from '../utils/auth.js';

// Validation schemas
const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
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
            name: data.name
          }
        });

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
            password: { type: 'string' }
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

        // Create session
        await prisma.session.create({
          data: {
            userId: user.id,
            refreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
}
