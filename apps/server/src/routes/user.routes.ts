import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '@chikox/database';
import type { JWTPayload, UserDTO, ApiResponse } from '@chikox/types';
import { authenticate, authorize } from '../utils/auth';

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
        createdAt: user.createdAt.toISOString()
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

      const usersDTO: UserDTO[] = users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt.toISOString()
      }));

      return reply.send({
        success: true,
        data: usersDTO
      });
    }
  );
}
