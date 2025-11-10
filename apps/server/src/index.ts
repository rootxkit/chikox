import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import dotenv from 'dotenv';
import { authRoutes } from './routes/auth.routes.js';
import { userRoutes } from './routes/user.routes.js';
import { errorHandler } from './utils/error-handler.js';

dotenv.config();

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const server = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname'
            }
          }
        : undefined
  }
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(fastifyCors, {
    origin: process.env.CORS_ORIGIN?.split(',') || 'http://localhost:3000',
    credentials: true
  });

  // Cookie support
  await server.register(fastifyCookie, {
    secret: process.env.COOKIE_SECRET || 'change-this-secret',
    parseOptions: {}
  });

  // JWT
  await server.register(fastifyJwt, {
    secret: process.env.JWT_ACCESS_SECRET || 'change-this-secret',
    sign: {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
    },
    cookie: {
      cookieName: 'refreshToken',
      signed: false
    }
  });

  // Swagger Documentation
  await server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Chikox API',
        description: 'Full-stack TypeScript API with authentication',
        version: '1.0.0'
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: 'Development server'
        }
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      }
    }
  });

  await server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });
}

// Register routes
async function registerRoutes() {
  await server.register(authRoutes, { prefix: '/api/v1/auth' });
  await server.register(userRoutes, { prefix: '/api/v1/users' });
}

// Health check
server.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// Error handler
server.setErrorHandler(errorHandler);

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    await server.listen({ port: PORT, host: HOST });

    console.log(`
🚀 Server ready at: http://${HOST}:${PORT}
📚 API Documentation: http://${HOST}:${PORT}/docs
    `);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    console.log(`\n${signal} received, closing server gracefully...`);
    await server.close();
    process.exit(0);
  });
});
