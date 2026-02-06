import { z } from 'zod';

export const SignupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
  remember: z.boolean().optional(),
});

export const CreateMovieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  year: z.string().regex(/^\d{4}$/, 'Year must be a 4-digit number').optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
});

export const UpdateMovieSchema = CreateMovieSchema.partial();

export const PaginationSchema = z.object({
  page: z.string().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().default('20').transform(Number).pipe(z.number().min(1).max(100)),
  search: z.string().optional(),
  sort: z.string().optional(),
});

export type SignupInput = z.infer<typeof SignupSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type CreateMovieInput = z.infer<typeof CreateMovieSchema>;
export type UpdateMovieInput = z.infer<typeof UpdateMovieSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
