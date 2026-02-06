# Movies Backend API

A REST API backend for the Movies application built with Fastify, Prisma, and PostgreSQL.

## Features

- User authentication (signup/login/logout)
- Movie CRUD operations
- JWT-based authorization
- Input validation with Zod
- PostgreSQL database with Prisma ORM
- Structured logging with Pino
- CORS and security headers with Helmet
- Type-safe TypeScript implementation

## Tech Stack

- **Framework**: Fastify 5.x
- **ORM**: Prisma 5.x
- **Database**: PostgreSQL
- **Authentication**: JWT + HttpOnly cookies
- **Validation**: Zod
- **Password Hashing**: Argon2
- **Logging**: Pino
- **Language**: TypeScript

## Prerequisites

- Node.js >= 18.x
- PostgreSQL >= 12.x
- npm or pnpm

## Setup

### 1. Install dependencies

```bash
cd backend
npm install
# or
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL connection string and JWT secrets:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/movies_db
JWT_SECRET=your_super_secret_key
JWT_REFRESH_SECRET=your_super_secret_refresh_key
PORT=3001
CORS_ORIGIN=http://localhost:3000
```

### 3. Setup database

```bash
# Run migrations
npm run db:migrate

# Seed with test data
npm run db:seed
```

### 4. Start development server

```bash
npm run dev
```

The server will start at `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `GET /me` - Get current user info

### Movies

- `GET /movies` - List user's movies (paginated)
- `GET /movies/:id` - Get single movie
- `POST /movies` - Create movie
- `PUT /movies/:id` - Update movie
- `DELETE /movies/:id` - Delete movie

### Health

- `GET /health` - Health check

## Example Requests

### Signup

```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Get Movies

```bash
curl http://localhost:3001/movies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Create Movie

```bash
curl -X POST http://localhost:3001/movies \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "The Matrix",
    "year": "1999",
    "imageUrl": "https://example.com/matrix.jpg"
  }'
```

## Database Schema

### User

```
id: String (UUID)
name: String
email: String (unique)
password: String (hashed)
role: String (default: "user")
createdAt: DateTime
updatedAt: DateTime
movies: Movie[] (1-to-many)
sessions: Session[] (1-to-many)
```

### Movie

```
id: Int
title: String
year: String (optional)
imageUrl: String
ownerId: String (FK to User)
createdAt: DateTime
updatedAt: DateTime
```

### Session

```
id: String (UUID)
userId: String (FK to User)
refreshToken: String
expiresAt: DateTime
createdAt: DateTime
updatedAt: DateTime
```

## Project Structure

```
backend/
├── src/
│   ├── config.ts           # Configuration
│   ├── logger.ts           # Logging setup
│   ├── prisma.ts           # Prisma client
│   ├── server.ts           # Server entry point
│   ├── middleware/
│   │   └── auth.ts         # Auth middleware
│   ├── routes/
│   │   ├── auth.ts         # Auth endpoints
│   │   └── movies.ts       # Movie endpoints
│   ├── services/
│   │   ├── auth.service.ts # Auth business logic
│   │   └── movie.service.ts # Movie business logic
│   ├── types/
│   │   ├── index.ts        # Type definitions
│   │   └── schemas.ts      # Zod validation schemas
│   └── prisma/
│       └── seed.ts         # Database seeding
├── prisma/
│   └── schema.prisma       # Prisma data model
├── .env.example            # Environment template
├── package.json
└── tsconfig.json
```

## Development

### Build

```bash
npm run build
```

### Lint

```bash
npm run lint
```

### Format

```bash
npm run format
```

### Test

```bash
npm run test
```

## Deployment

### Build for production

```bash
npm run build
npm run start
```

### Environment variables for production

Set these environment variables in your deployment platform:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (generate a strong random key)
- `JWT_REFRESH_SECRET` - JWT refresh secret
- `NODE_ENV=production`
- `CORS_ORIGIN` - Frontend origin (e.g., https://yourdomain.com)
- `PORT` - Server port (default: 3001)

### With Docker

```bash
docker build -t movies-backend .
docker run -p 3001:3001 --env-file .env movies-backend
```

## Security Considerations

1. **Password Hashing**: Uses Argon2, a secure password hashing algorithm
2. **JWT Tokens**: Short-lived access tokens + long-lived refresh tokens in HttpOnly cookies
3. **CORS**: Configured to frontend origin only
4. **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
5. **Input Validation**: All inputs validated with Zod
6. **Rate Limiting**: Can be added via @fastify/rate-limit
7. **SQL Injection**: Protected by Prisma ORM

## Roadmap (Future Enhancements)

- [ ] S3 image uploads with signed URLs
- [ ] Rate limiting per endpoint
- [ ] Image thumbnail generation
- [ ] Advanced filtering and search
- [ ] User roles and permissions
- [ ] API documentation with Swagger/OpenAPI
- [ ] Comprehensive test suite
- [ ] GraphQL alternative API
- [ ] Caching with Redis
- [ ] Background job processing

## License

MIT
