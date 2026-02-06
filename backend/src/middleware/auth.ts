import { FastifyRequest, FastifyReply } from 'fastify';

// Simple JWT verification middleware (in production, use @fastify/jwt properly)
export async function authMiddleware(request: FastifyRequest, reply: FastifyReply) {
  try {
    const token = request.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return reply.code(401).send({
        error: {
          code: 'MISSING_TOKEN',
          message: 'Missing authorization token',
        },
      });
    }

    // Decode token (simplified - in production use proper JWT)
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    (request as any).userId = decoded.userId;
  } catch (error) {
    return reply.code(401).send({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid authorization token',
      },
    });
  }
}
