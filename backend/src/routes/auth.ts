import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../services/auth.service.js';
import { SignupSchema, LoginSchema } from '../types/schemas.js';
import { logger } from '../logger.js';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/signup', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = SignupSchema.parse(request.body);
      const result = await AuthService.signup(body);

      // Set refresh token as HttpOnly cookie
      reply.cookie('refreshToken', result.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return reply.code(201).send({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { name?: string; message?: string; errors?: unknown };
      if (err.name === 'ZodError') {
        return reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: err.errors,
          },
        });
      }

      if (err.message === 'User already exists') {
        return reply.code(409).send({
          error: {
            code: 'USER_EXISTS',
            message: 'User already exists',
          },
        });
      }

      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  });

  app.post('/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const body = LoginSchema.parse(request.body);
      const result = await AuthService.login(body);

      // Set refresh token as HttpOnly cookie
      reply.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: body.remember ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000, // 30 days if remember, else 7
      });

      return reply.code(200).send({
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { name?: string; message?: string; errors?: unknown };

      if (err.name === 'ZodError') {
        return reply.code(400).send({
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid input',
            details: err.errors,
          },
        });
      }

      if ((err.message ?? '').includes('Invalid email or password')) {
        return reply.code(401).send({
          error: {
            code: 'INVALID_CREDENTIALS',
            message: 'Invalid email or password',
          },
        });
      }

      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  });

  app.post('/auth/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as FastifyRequest & { userId?: string }).userId;
      if (!userId) {
        return reply.code(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Unauthorized',
          },
        });
      }

      await AuthService.logout(userId);

      // Clear refresh token cookie
      reply.clearCookie('refreshToken');

      return reply.code(204).send();
    } catch (error: unknown) {
      logger.error(error);
      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  });

  app.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const userId = (request as FastifyRequest & { userId?: string }).userId;
      if (!userId) {
        return reply.code(401).send({
          error: {
            code: 'UNAUTHORIZED',
            message: 'Unauthorized',
          },
        });
      }

      // Simplified version - in production use proper JWT validation
      return reply.code(200).send({
        message: 'User authenticated',
        userId,
      });
    } catch (error: unknown) {
      logger.error(error);
      return reply.code(500).send({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Internal server error',
        },
      });
    }
  });
}
