import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import Fastify, { FastifyInstance } from 'fastify';
import { authRoutes } from '../auth.routes';
import fastifyJwt from '@fastify/jwt';
import fastifyCookie from '@fastify/cookie';

describe('Auth Routes', () => {
  let server: FastifyInstance;

  beforeAll(async () => {
    server = Fastify();

    await server.register(fastifyCookie);
    await server.register(fastifyJwt, {
      secret: 'test-secret'
    });
    await server.register(authRoutes, { prefix: '/auth' });

    await server.ready();
  });

  afterAll(async () => {
    await server.close();
  });

  describe('POST /auth/register', () => {
    it('should validate email format', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'invalid-email',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
      expect(body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should validate password minimum length', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          email: 'test@example.com',
          password: 'short'
        }
      });

      expect(response.statusCode).toBe(400);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(false);
    });

    // Note: Actual registration test would require database setup
    // This is a structure example for unit testing route handlers
  });

  describe('POST /auth/login', () => {
    it('should require email and password', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {}
      });

      expect(response.statusCode).toBe(400);
    });

    it('should validate email format in login', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/auth/login',
        payload: {
          email: 'not-an-email',
          password: 'password123'
        }
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /auth/logout', () => {
    it('should accept logout request', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/auth/logout'
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.body);
      expect(body.success).toBe(true);
    });
  });
});
