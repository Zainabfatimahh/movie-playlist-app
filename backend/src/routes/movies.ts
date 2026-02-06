import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { MovieService } from '../services/movie.service.js';
import { UpdateMovieSchema, PaginationSchema } from '../types/schemas.js';
import { logger } from '../logger.js';

type RequestWithUserId = FastifyRequest & { userId?: string };

export async function movieRoutes(app: FastifyInstance) {
  // List movies with pagination
  app.get('/movies', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId || 'guest-' + Date.now();

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
      const userId = request.userId || 'guest-' + Date.now();

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
      // Get userId from token, but don't require it for easy testing
      const userId = request.userId || 'guest-' + Date.now();

      const body = request.body as { title: string; year: string; imageUrl?: string };
      
      // Accept either imageUrl from body or use a default
      const imageUrl = body.imageUrl || 'https://csspicker.dev/api/image/?q=movie+clapperboard&image_type=photo';

      const movie = await MovieService.createMovie(userId, {
        title: body.title,
        year: body.year,
        imageUrl: imageUrl,
      });

      return reply.code(201).send(movie);
    } catch (error: unknown) {
      logger.error(error);
      const err = error as { name?: string; message?: string };
      if (err.name === 'ZodError') {
        return reply.code(400).send({
          error: { code: 'VALIDATION_ERROR', message: 'Invalid input' },
        });
      }
      return reply.code(500).send({
        error: { code: 'INTERNAL_ERROR', message: 'Internal server error', details: err.message },
      });
    }
  });

  // Update movie
  app.put('/movies/:id', async (request: RequestWithUserId, reply: FastifyReply) => {
    try {
      const userId = request.userId || 'guest-' + Date.now();

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
      const userId = request.userId || 'guest-' + Date.now();

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
