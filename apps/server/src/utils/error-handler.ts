import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify';

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
): void {
  request.log.error(error);

  // Validation errors
  if (error.validation) {
    reply.status(400).send({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.validation
      }
    });
    return;
  }

  // JWT errors
  if (error.message.includes('jwt')) {
    reply.status(401).send({
      success: false,
      error: {
        message: 'Invalid or expired token',
        code: 'INVALID_TOKEN'
      }
    });
    return;
  }

  // Default error
  const statusCode = error.statusCode || 500;
  reply.status(statusCode).send({
    success: false,
    error: {
      message: error.message || 'Internal server error',
      code: error.code || 'INTERNAL_ERROR'
    }
  });
}
