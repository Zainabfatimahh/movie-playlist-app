import Fastify from 'fastify';
import fastifyHelmet from '@fastify/helmet';
import fastifyCors from '@fastify/cors';
import fastifyCookie from '@fastify/cookie';
import { FastifyRequest, FastifyReply } from 'fastify';
import { config } from './config.js';
import { logger } from './logger.js';
import { prisma } from './prisma.js';
import { authMiddleware } from './middleware/auth.js';
import { authRoutes } from './routes/auth.js';
import { movieRoutes } from './routes/movies.js';

async function start() {
  const app = Fastify();

  // Register plugins
  await app.register(fastifyHelmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  });

  await app.register(fastifyCors, {
    origin: config.corsOrigin,
    credentials: true,
  });

  await app.register(fastifyCookie);

  // Health check
  app.get('/health', async () => {
    return { status: 'ok' };
  });

  // Register auth routes (no auth required)
  void authRoutes(app);

  // Register movies routes with auth middleware
  app.addHook('onRequest', async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.url.startsWith('/movies')) {
      await authMiddleware(request, reply);
    }
  });

  void movieRoutes(app);

  // Global error handler
  app.setErrorHandler((error: Error, _request, reply) => {
    logger.error(error);
    reply.code(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error',
      },
    });
  });

  // Start server
  try {
    await app.listen({ port: config.port, host: '0.0.0.0' });
    logger.info(`Server listening on port ${config.port}`);
  } catch (error) {
    logger.error(error);
    process.exit(1);
  }

  // Graceful shutdown
  const gracefulShutdown = async () => {
    logger.info('Shutting down gracefully...');
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', gracefulShutdown);
  process.on('SIGINT', gracefulShutdown);
}

start().catch((error) => {
  logger.error(error);
  process.exit(1);
});
