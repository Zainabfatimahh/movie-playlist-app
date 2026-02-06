import { prisma } from '../prisma.js';
import { logger } from '../logger.js';
import type { CreateMovieInput, UpdateMovieInput, PaginationInput } from '../types/schemas.js';
import type { MovieResponse, PaginatedResponse } from '../types/index.js';

export class MovieService {
  static async createMovie(userId: string, data: CreateMovieInput & { imageUrl: string }): Promise<MovieResponse> {
    const movie = await prisma.movie.create({
      data: {
        title: data.title,
        year: data.year,
        imageUrl: data.imageUrl,
        ownerId: userId,
      },
    });

    logger.info(`Movie created: ${movie.id} by user ${userId}`);
    return this.toMovieResponse(movie);
  }

  static async getMovies(
    userId: string,
    pagination: PaginationInput
  ): Promise<PaginatedResponse<MovieResponse>> {
    const skip = (pagination.page - 1) * pagination.limit;

    const [movies, total] = await Promise.all([
      prisma.movie.findMany({
        where: { ownerId: userId },
        skip,
        take: pagination.limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.movie.count({
        where: { ownerId: userId },
      }),
    ]);

    return {
      items: movies.map(this.toMovieResponse),
      meta: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  }

  static async getMovieById(movieId: number, userId: string): Promise<MovieResponse> {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    if (movie.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    return this.toMovieResponse(movie);
  }

  static async updateMovie(
    movieId: number,
    userId: string,
    data: UpdateMovieInput & { imageUrl?: string }
  ): Promise<MovieResponse> {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    if (movie.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    const updated = await prisma.movie.update({
      where: { id: movieId },
      data: {
        title: data.title ?? movie.title,
        year: data.year ?? movie.year,
        imageUrl: data.imageUrl ?? movie.imageUrl,
      },
    });

    logger.info(`Movie updated: ${movieId}`);
    return this.toMovieResponse(updated);
  }

  static async deleteMovie(movieId: number, userId: string): Promise<void> {
    const movie = await prisma.movie.findUnique({
      where: { id: movieId },
    });

    if (!movie) {
      throw new Error('Movie not found');
    }

    if (movie.ownerId !== userId) {
      throw new Error('Unauthorized');
    }

    await prisma.movie.delete({
      where: { id: movieId },
    });

    logger.info(`Movie deleted: ${movieId}`);
  }

  private static toMovieResponse(movie: {
    id: number;
    title: string;
    year: string | null;
    imageUrl: string;
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
  }): MovieResponse {
    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      imageUrl: movie.imageUrl,
      ownerId: movie.ownerId,
      createdAt: movie.createdAt.toISOString(),
      updatedAt: movie.updatedAt.toISOString(),
    };
  }
}
