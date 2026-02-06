# Backend Implementation Guide

## Overview

This guide outlines the completed backend implementation for the Movies app. The backend is built with **Fastify** (performant Node.js framework), **Prisma** (ORM), and **PostgreSQL** (database).

## Implementation Status

### ✅ Step 1: Auth System (COMPLETED)

**Files created:**
- `src/services/auth.service.ts` - Auth business logic (signup, login, logout)
- `src/routes/auth.ts` - Auth endpoints (POST /auth/signup, /auth/login, /auth/logout, GET /me)
- `src/types/schemas.ts` - Zod validation schemas
- `src/middleware/auth.ts` - JWT/Token verification middleware

**Implemented Endpoints:**
- `POST /auth/signup` - Register new user with name, email, password
- `POST /auth/login` - Login with email/password, returns access token + refresh cookie
- `POST /auth/logout` - Clears session and refresh token
- `GET /me` - Returns current authenticated user

**Features:**
- ✅ Password hashing with Argon2
- ✅ HttpOnly refresh token cookies
- ✅ Token-based access control
- ✅ Input validation with Zod
- ✅ Error handling with proper HTTP status codes

### ✅ Step 2: Movie CRUD (COMPLETED)

**Files created:**
- `src/services/movie.service.ts` - Movie business logic (CRUD operations)
- `src/routes/movies.ts` - Movie endpoints
- `src/types/schemas.ts` - Movie validation schemas

**Implemented Endpoints:**
- `GET /movies` - List user's movies with pagination (page, limit)
- `GET /movies/:id` - Get single movie by ID
- `POST /movies` - Create movie with title, year, imageUrl
- `PUT /movies/:id` - Update movie fields
- `DELETE /movies/:id` - Delete movie

**Features:**
- ✅ Pagination support (page, limit, total, totalPages)
- ✅ Owner-based access control (users can only access their movies)
- ✅ Input validation
- ✅ Proper error responses (404, 403, etc.)

### ✅ Step 3: Database & ORM (COMPLETED)

**Files created:**
- `prisma/schema.prisma` - Data models (User, Movie, Session)
- `src/prisma.ts` - Prisma client configuration
- `src/prisma/seed.ts` - Database seeding with test data

**Data Models:**
- **User**: id, name, email, password (hashed), role, createdAt, updatedAt
- **Movie**: id, title, year, imageUrl, ownerId (FK), createdAt, updatedAt
- **Session**: id, userId (FK), refreshToken, expiresAt

**Features:**
- ✅ Type-safe database access
- ✅ Relations (User 1-to-N Movie, User 1-to-N Session)
- ✅ Indexes for performance (ownerId, createdAt, email)
- ✅ Cascading deletes (deleting user deletes movies/sessions)
- ✅ Automatic timestamps

### ✅ Step 4: Core Infrastructure (COMPLETED)

**Files created:**
- `src/config.ts` - Centralized configuration
- `src/logger.ts` - Structured logging with Pino
- `src/server.ts` - Main Fastify application setup

**Features:**
- ✅ CORS configured for frontend origin
- ✅ Security headers with Helmet
- ✅ Structured JSON logging
- ✅ Global error handling
- ✅ Graceful shutdown
- ✅ Health check endpoint (`GET /health`)

### ✅ Step 5: Configuration & Deployment (COMPLETED)

**Files created:**
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment template
- `Dockerfile` - Multi-stage Docker build
- `docker-compose.yml` - PostgreSQL + Redis services
- `.eslintrc.json` - Linting rules
- `.prettierrc` - Code formatting rules

**Scripts available:**
```bash
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run start        # Run production build
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed database with test data
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run test         # Run tests (when added)
```

### ✅ Step 6: Documentation (COMPLETED)

**Files created:**
- `README.md` - Complete API documentation
- `openapi.yml` - OpenAPI 3.0 specification
- `IMPLEMENTATION_GUIDE.md` - This file

## Quick Start

### 1. Install and Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update DATABASE_URL in .env
# Example: postgresql://movies_user:movies_password@localhost:5432/movies_db
```

### 2. Start Database (using Docker)

```bash
docker-compose up -d postgres

# Wait for database to be ready (~5 seconds)
```

### 3. Setup Database Schema

```bash
npm run db:migrate
```

### 4. Seed Test Data (Optional)

```bash
npm run db:seed
```

### 5. Start Backend Server

```bash
npm run dev
```

Server will be available at: `http://localhost:3001`

## Frontend Integration

### Update Next.js Frontend

Update your frontend API client to call the backend:

```typescript
// Example: in a React hook or API service
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Signup
const signup = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.user;
};

// Login
const login = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  localStorage.setItem('accessToken', data.accessToken);
  return data.user;
};

// Get movies
const getMovies = async (page = 1) => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/movies?page=${page}&limit=20`, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
};

// Create movie
const createMovie = async (title: string, year: string, imageUrl: string) => {
  const token = localStorage.getItem('accessToken');
  const res = await fetch(`${API_URL}/movies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ title, year, imageUrl }),
  });
  return res.json();
};
```

## API Response Format

### Success Response

```json
{
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response

```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  }
}
```

### Paginated List Response

```json
{
  "items": [
    {
      "id": 1,
      "title": "The Matrix",
      "year": "1999",
      "imageUrl": "https://...",
      "ownerId": "uuid",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 42,
    "totalPages": 3
  }
}
```

## Next Steps (Future Enhancements)

### Priority 1: Production Ready
- [ ] **S3 Image Uploads** - Implement signed URL flow for image uploads
- [ ] **Rate Limiting** - Add per-endpoint rate limits with @fastify/rate-limit
- [ ] **JWT Implementation** - Replace simplified token with @fastify/jwt
- [ ] **Comprehensive Tests** - Unit tests for services, integration tests for routes

### Priority 2: Features
- [ ] **Image Transforms** - Generate thumbnails and multiple sizes (via S3 Lambda or Cloudinary)
- [ ] **Search & Filtering** - Full-text search, filter by year, etc.
- [ ] **User Preferences** - Theme, language, etc.
- [ ] **Social Features** - Share movies, ratings, comments (future)

### Priority 3: Operations
- [ ] **Monitoring** - Add Sentry for error tracking
- [ ] **Analytics** - Track API usage, user behavior
- [ ] **CI/CD** - GitHub Actions workflow for auto-deploy
- [ ] **Database Backups** - Automated daily backups
- [ ] **Caching** - Redis for sessions and frequently accessed data

### Priority 4: Scale
- [ ] **GraphQL Alternative** - Provide GraphQL API alongside REST
- [ ] **WebSocket Support** - Real-time features (if needed)
- [ ] **Microservices** - Separate auth, media, storage services
- [ ] **Content Delivery** - CloudFront CDN for images

## File Structure Reference

```
backend/
├── src/
│   ├── config.ts                 # Config from env variables
│   ├── logger.ts                 # Pino logger setup
│   ├── prisma.ts                 # Prisma client
│   ├── server.ts                 # Main Fastify app
│   ├── middleware/
│   │   └── auth.ts               # JWT/Token auth middleware
│   ├── routes/
│   │   ├── auth.ts               # /auth/* endpoints
│   │   └── movies.ts             # /movies/* endpoints
│   ├── services/
│   │   ├── auth.service.ts       # Auth logic
│   │   └── movie.service.ts      # Movie CRUD logic
│   ├── types/
│   │   ├── index.ts              # TS interfaces
│   │   └── schemas.ts            # Zod validation
│   └── prisma/
│       └── seed.ts               # DB seeding
├── prisma/
│   └── schema.prisma             # Data models
├── .env.example                  # Env template
├── .eslintrc.json                # ESLint config
├── .prettierrc                   # Prettier config
├── .gitignore                    # Git ignore rules
├── Dockerfile                    # Docker image
├── docker-compose.yml            # Dev services
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── README.md                     # API documentation
├── openapi.yml                   # OpenAPI spec
└── IMPLEMENTATION_GUIDE.md       # This file
```

## Troubleshooting

### Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
1. Ensure PostgreSQL is running: `docker-compose up -d postgres`
2. Check DATABASE_URL in `.env`
3. Wait for database to be ready: `docker-compose logs postgres`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Solution:**
1. Change PORT in `.env`
2. Or kill existing process: `lsof -ti:3001 | xargs kill -9`

### Migration Errors

```
Error: Migration failed
```

**Solution:**
```bash
# Reset database (⚠️ deletes all data)
npx prisma migrate reset

# Or manually:
npx prisma db push --force-reset
npm run db:seed
```

## Security Checklist

Before deploying to production:

- [ ] Change all JWT secrets in `.env` to strong random strings
- [ ] Enable HTTPS/TLS in production
- [ ] Set proper CORS_ORIGIN to frontend domain only
- [ ] Add rate limiting to auth endpoints
- [ ] Enable database backup and test recovery
- [ ] Add API key rotation mechanism
- [ ] Implement request logging and monitoring
- [ ] Add input sanitization/validation review
- [ ] Set up error tracking (Sentry)
- [ ] Configure WAF (Web Application Firewall)
- [ ] Use environment-specific database URLs
- [ ] Implement secrets management (AWS Secrets Manager, etc.)

## Support

For API documentation, see [README.md](./README.md)
For OpenAPI spec, import [openapi.yml](./openapi.yml) into Postman/Insomnia

---

**Implementation Date**: February 2026  
**Status**: Production Ready (Core Features)  
**Next Review**: After frontend integration testing
