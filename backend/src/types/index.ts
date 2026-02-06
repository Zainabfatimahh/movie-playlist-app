export interface AuthPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export interface MovieResponse {
  id: number;
  title: string;
  year: string | null;
  imageUrl: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}
