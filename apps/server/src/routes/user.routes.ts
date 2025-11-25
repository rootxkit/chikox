import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@chikox/database';
import type { JWTPayload, UserDTO, ApiResponse } from '@chikox/types';
import { authenticate, authorize, hashPassword, verifyPassword } from '../utils/auth.js';

export async function userRoutes(server: FastifyInstance): Promise<void> {
  /**
   * Get current user profile
   */
  server.get<{
    Reply: ApiResponse<UserDTO>;
  }>(
    '/me',
    {
      onRequest: [authenticate],
      schema: {
        description: 'Get current authenticated user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string', nullable: true },
                  role: { type: 'string' },
                  createdAt: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.user as JWTPayload;

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      const userDTO: UserDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString()
      };

      return reply.send({
        success: true,
        data: userDTO
      });
    }
  );

  /**
   * Update current user profile
   */
  server.patch<{
    Body: { name?: string; email?: string };
    Reply: ApiResponse<UserDTO>;
  }>(
    '/me',
    {
      onRequest: [authenticate],
      schema: {
        description: 'Update current authenticated user profile',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          properties: {
            name: { type: 'string' },
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
                  id: { type: 'string' },
                  email: { type: 'string' },
                  name: { type: 'string', nullable: true },
                  role: { type: 'string' },
                  createdAt: { type: 'string' }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { userId } = request.user as JWTPayload;
      const { name, email } = request.body as any;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      // If email is being changed, check if new email is available
      if (email && email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email }
        });

        if (emailTaken) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Email already in use',
              code: 'EMAIL_TAKEN'
            }
          });
        }
      }

      // Update user
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...(name !== undefined && { name }),
          ...(email !== undefined && { email })
        }
      });

      const userDTO: UserDTO = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt.toISOString()
      };

      return reply.send({
        success: true,
        data: userDTO
      });
    }
  );

  /**
   * Get all users (Admin only)
   */
  server.get<{
    Reply: ApiResponse<UserDTO[]>;
  }>(
    '/',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Get all users (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: 'object',
            properties: {
              success: { type: 'boolean' },
              data: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    email: { type: 'string' },
                    name: { type: 'string', nullable: true },
                    role: { type: 'string' },
                    createdAt: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' }
      });

      const usersDTO: UserDTO[] = users.map((user: any) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString()
      }));

      return reply.send({
        success: true,
        data: usersDTO
      });
    }
  );

  /**
   * Create new user (Admin only)
   */
  server.post<{
    Body: { email: string; password: string; name?: string; role?: string };
    Reply: ApiResponse<UserDTO>;
  }>(
    '/',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Create new user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password, name, role } = request.body as any;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
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
      const passwordHash = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name: name || null,
          role: role || 'USER'
        }
      });

      const userDTO: UserDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString()
      };

      return reply.status(201).send({
        success: true,
        data: userDTO
      });
    }
  );

  /**
   * Update user (Admin only)
   */
  server.patch<{
    Params: { id: string };
    Body: { email?: string; name?: string; role?: string };
    Reply: ApiResponse<UserDTO>;
  }>(
    '/:id',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Update user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        },
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'ADMIN', 'SUPER_ADMIN'] }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as any;
      const { email, name, role } = request.body as any;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      // If email is being changed, check if new email is available
      if (email && email !== existingUser.email) {
        const emailTaken = await prisma.user.findUnique({
          where: { email }
        });

        if (emailTaken) {
          return reply.status(400).send({
            success: false,
            error: {
              message: 'Email already in use',
              code: 'EMAIL_IN_USE'
            }
          });
        }
      }

      // Update user
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(email && { email }),
          ...(name !== undefined && { name }),
          ...(role && { role })
        }
      });

      const userDTO: UserDTO = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt.toISOString()
      };

      return reply.send({
        success: true,
        data: userDTO
      });
    }
  );

  /**
   * Delete user (Admin only)
   */
  server.delete<{
    Params: { id: string };
    Reply: ApiResponse<{ id: string }>;
  }>(
    '/:id',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Delete user (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as any;
      const currentUser = request.user as JWTPayload;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id }
      });

      if (!existingUser) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      // Prevent self-deletion
      if (id === currentUser.userId) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Cannot delete your own account',
            code: 'CANNOT_DELETE_SELF'
          }
        });
      }

      // Delete user (cascades to sessions)
      await prisma.user.delete({
        where: { id }
      });

      return reply.send({
        success: true,
        data: { id }
      });
    }
  );

  /**
   * Change password (Authenticated users)
   */
  server.patch<{
    Body: { currentPassword: string; newPassword: string };
    Reply: ApiResponse<{ message: string }>;
  }>(
    '/me/password',
    {
      onRequest: [authenticate],
      schema: {
        description: 'Change password for current user',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        body: {
          type: 'object',
          required: ['currentPassword', 'newPassword'],
          properties: {
            currentPassword: { type: 'string' },
            newPassword: { type: 'string', minLength: 8 }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { currentPassword, newPassword } = request.body as any;
      const currentUser = request.user as JWTPayload;

      // Get user from database
      const user = await prisma.user.findUnique({
        where: { id: currentUser.userId }
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user.passwordHash);

      if (!isValidPassword) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'Current password is incorrect',
            code: 'INVALID_PASSWORD'
          }
        });
      }

      // Hash new password
      const newPasswordHash = await hashPassword(newPassword);

      // Update password
      await prisma.user.update({
        where: { id: currentUser.userId },
        data: {
          passwordHash: newPasswordHash
        }
      });

      return reply.send({
        success: true,
        data: { message: 'Password changed successfully' }
      });
    }
  );

  /**
   * Toggle user activation status (Admin only)
   */
  server.patch<{
    Params: { id: string };
    Reply: ApiResponse<UserDTO>;
  }>(
    '/:id/toggle-activation',
    {
      onRequest: [authenticate, authorize('ADMIN', 'SUPER_ADMIN')],
      schema: {
        description: 'Toggle user email verification status (Admin only)',
        tags: ['Users'],
        security: [{ bearerAuth: [] }],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' }
          },
          required: ['id']
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as any;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id }
      });

      if (!user) {
        return reply.status(404).send({
          success: false,
          error: {
            message: 'User not found',
            code: 'USER_NOT_FOUND'
          }
        });
      }

      // Toggle emailVerified status
      const updatedUser = await prisma.user.update({
        where: { id },
        data: {
          emailVerified: !user.emailVerified
        }
      });

      const userDTO: UserDTO = {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt.toISOString()
      };

      return reply.send({
        success: true,
        data: userDTO
      });
    }
  );
}
