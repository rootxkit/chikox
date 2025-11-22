import { FastifyInstance } from 'fastify';
import { sendContactEmail } from '../utils/email.js';

interface ContactBody {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default async function contactRoutes(server: FastifyInstance) {
  // POST /api/v1/contact - Send contact form message
  server.post<{ Body: ContactBody }>(
    '/',
    {
      schema: {
        description: 'Send a contact form message',
        tags: ['Contact'],
        body: {
          type: 'object',
          required: ['name', 'email', 'subject', 'message'],
          properties: {
            name: { type: 'string', minLength: 1 },
            email: { type: 'string', format: 'email' },
            subject: { type: 'string', minLength: 1 },
            message: { type: 'string', minLength: 1 }
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
    async (request, reply) => {
      const { name, email, subject, message } = request.body;

      // Validate inputs
      if (!name || !email || !subject || !message) {
        return reply.status(400).send({
          success: false,
          error: {
            message: 'All fields are required',
            code: 'VALIDATION_ERROR'
          }
        });
      }

      try {
        await sendContactEmail({ name, email, subject, message });

        return reply.send({
          success: true,
          data: {
            message: 'Message sent successfully'
          }
        });
      } catch (error) {
        server.log.error(error);
        return reply.status(500).send({
          success: false,
          error: {
            message: 'Failed to send message',
            code: 'INTERNAL_ERROR'
          }
        });
      }
    }
  );
}
