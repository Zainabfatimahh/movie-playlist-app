import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MovieService } from '../services/movie.service.js';
import { CreateMovieSchema, UpdateMovieSchema, PaginationSchema } from '../types/schemas.js';
import { logger } from '../logger.js';

type RequestWithUserId = FastifyRequest & { userId?: string };

export async function movieRoutes(app: FastifyInstance) {
  // List movies with pagination
  app.get('/movies', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId;
      if (!userId) {
        return reply.code(401).send({
          error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
        });
      }

      const query = PaginationSchema.parse(request.query);
      const result = await MovieService.getMovies(userId, query);

      return reply.code(200).send(result);
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { name?: string };
      if (err.name === 'ZodError') {
        return reply.code(400).send({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      return reply.code(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      });
    }
  });

  // Get single movie
  app.get('/movies/:id', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId;
      if (!userId) {
        return reply.code(401).send({
          error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
        });
      }

      const { id } = request.params as { id: string };
      const movieId = parseInt(id, 10);

      if (isNaN(movieId)) {
        return reply.code(400).send({
          error: { code: 'INVALID_ID', message: 'Invalid movie ID' },
        });
      }

      const movie = await MovieService.getMovieById(movieId, userId);
      return reply.code(200).send(movie);
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { message?: string };
      if (err.message === 'Movie not found') {
        return reply.code(404).send({
          error: { code: 'NOT_FOUND', message: 'Movie not found' },
        });
      }
      if (err.message === 'Unauthorized') {
        return reply.code(403).send({
          error: { code: 'FORBIDDEN', message: 'Forbidden' },
        });
      }
      return reply.code(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      });
    }
  });

  // Create movie
  app.post('/movies', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId;
      if (!userId) {
        return reply.code(401).send({
          error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
        });
      }

      const body = CreateMovieSchema.parse(request.body);

      // For now, require imageUrl in body
      // In production, handle multipart uploads with @fastify/multipart
      if (!body.imageUrl) {
        return reply.code(400).send({
          error: { code: 'MISSING_IMAGE', message: 'imageUrl is required' },
        });
      }

      const movie = await MovieService.createMovie(userId, {
        title: body.title,
        year: body.year,
        imageUrl: body.imageUrl,
      });

      return reply.code(201).send(movie);
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { name?: string };
      if (err.name === 'ZodError') {
        return reply.code(400).send({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      return reply.code(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      });
    }
  });

  // Update movie
  app.put('/movies/:id', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId;
      if (!userId) {
        return reply.code(401).send({
          error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
        });
      }

      const { id } = request.params as { id: string };
      const movieId = parseInt(id, 10);

      if (isNaN(movieId)) {
        return reply.code(400).send({
          error: { code: 'INVALID_ID', message: 'Invalid movie ID' },
        });
      }

      const body = UpdateMovieSchema.parse(request.body);
      const movie = await MovieService.updateMovie(movieId, userId, body);

      return reply.code(200).send(movie);
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { name?: string; message?: string };
      if (err.name === 'ZodError') {
        return reply.code(400).send({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      if (err.message === 'Movie not found') {
        return reply.code(404).send({
          error: { code: 'NOT_FOUND', message: 'Movie not found' },
        });
      }
      if (err.message === 'Unauthorized') {
        return reply.code(403).send({
          error: { code: 'FORBIDDEN', message: 'Forbidden' },
        });
      }
      return reply.code(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      });
    }
  });

  // Delete movie
  app.delete('/movies/:id', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId;
      if (!userId) {
        return reply.code(401).send({
          error: { code: 'UNAUTHORIZED', message: 'Unauthorized' },
        });
      }

      const { id } = request.params as { id: string };
      const movieId = parseInt(id, 10);

      if (isNaN(movieId)) {
        return reply.code(400).send({
          error: { code: 'INVALID_ID', message: 'Invalid movie ID' },
        });
      }

      await MovieService.deleteMovie(movieId, userId);
      return reply.code(204).send();
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { message?: string };
      if (err.message === 'Movie not found') {
        return reply.code(404).send({
          error: { code: 'NOT_FOUND', message: 'Movie not found' },
        });
      }
      if (err.message === 'Unauthorized') {
        return reply.code(403).send({
          error: { code: 'FORBIDDEN', message: 'Forbidden' },
        });
      }
      return reply.code(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
      });
    }
  });
}
