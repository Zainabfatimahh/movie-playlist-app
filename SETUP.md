# Full-Stack Movies Application - Setup Guide

## Project Overview

This is a full-stack movies management application with:
- **Frontend**: Next.js 16 React application
- **Backend**: Fastify REST API with PostgreSQL
- **Database**: PostgreSQL with Prisma ORM

## Architecture

```
┌─────────────────┐
│   Next.js App   │  (Frontend on port 3000)
│  (React 19.2)   │
└────────┬────────┘
         │
    HTTP/REST API
         │
┌────────▼────────┐
│ Fastify Server  │  (Backend on port 3001)
│  (Node.js)      │
└────────┬────────┘
         │
┌────────▼────────┐
│  PostgreSQL     │  (Database on port 5432)
│  (Prisma ORM)   │
└─────────────────┘
```

## Folder Structure

```
web-app/
├── app/                          # Next.js frontend (existing)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── signin/page.tsx           # Login page
│   ├── signup/page.tsx           # Signup page
│   ├── playlist/page.tsx          # Movies list/dashboard
│   ├── add/page.tsx              # Add movie form
│   ├── edit/page.tsx             # Edit movie form
│   └── main/page.tsx
├── public/                       # Static assets
├── backend/                      # NEW - Backend API (NEW)
│   ├── src/
│   │   ├── routes/              # API endpoints
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Auth, CORS, etc
│   │   ├── types/               # TypeScript types
│   │   ├── prisma/              # DB utilities
│   │   ├── config.ts
│   │   ├── logger.ts
│   │   ├── prisma.ts
│   │   └── server.ts
│   ├── prisma/
│   │   └── schema.prisma        # Data models
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── README.md
│   ├── openapi.yml
│   └── postman-collection.json
├── package.json                 # Frontend deps
├── tsconfig.json
├── next.config.ts
├── README.md
└── SETUP.md                     # This file
```

## Quick Start (5 minutes)

### Prerequisites

- Node.js 18+ and npm/pnpm
- Docker and Docker Compose
- Git

### 1. Clone/Setup Project

```bash
cd web-app
```

### 2. Setup Database (Docker)

```bash
cd backend
docker-compose up -d postgres
# Wait ~5 seconds for database to start
```

### 3. Install Backend

```bash
cd backend
npm install
cp .env.example .env
npm run db:migrate
npm run db:seed  # Optional: adds test data
```

### 4. Start Backend

```bash
# In backend/ directory
npm run dev
```

Server will start at `http://localhost:3001`

### 5. Install Frontend

```bash
# In root (web-app/) directory
npm install
```

### 6. Start Frontend

```bash
npm run dev
```

Frontend will start at `http://localhost:3000`

### 7. Test the Flow

1. Open http://localhost:3000 in browser
2. Click "Sign In"
3. Use test credentials:
   - **Email**: `test@example.com`
   - **Password**: `password123`
4. Dashboard shows 3 sample movies

## API Testing

### Using Postman

1. Import `backend/postman-collection.json` into Postman
2. Set `baseUrl` variable to `http://localhost:3001`
3. Get access token from login request
4. Use token in subsequent requests

### Using cURL

```bash
# Signup
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"pass123"}'

# Get movies (replace TOKEN with actual token)
curl http://localhost:3001/movies \
  -H "Authorization: Bearer TOKEN"
```

## Frontend Integration

The frontend pages need to be updated to call the backend API:

### Example: Update signin page

```typescript
// app/signin/page.tsx
async function handleLogin(email: string, password: string) {
  const res = await fetch('http://localhost:3001/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Send cookies
    body: JSON.stringify({ email, password }),
  });
  
  if (res.ok) {
    const { user, accessToken } = await res.json();
    localStorage.setItem('accessToken', accessToken);
    router.push('/playlist');
  }
}
```

### Example: Fetch movies

```typescript
// app/playlist/page.tsx
async function fetchMovies() {
  const token = localStorage.getItem('accessToken');
  const res = await fetch('http://localhost:3001/movies?page=1&limit=20', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  return res.json();
}
```

## Production Deployment

### Backend Deployment

#### Option 1: Vercel (Recommended for Next.js + Fastify)

```bash
cd backend
vercel deploy
```

#### Option 2: AWS EC2/ECS

```bash
# Build Docker image
docker build -t movies-backend:latest .

# Push to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <YOUR_ECR_URL>
docker tag movies-backend:latest <YOUR_ECR_URL>/movies-backend:latest
docker push <YOUR_ECR_URL>/movies-backend:latest
```

#### Option 3: Railway/Render (Simple alternatives)

Railway setup:
1. Connect GitHub repo
2. Select `backend` directory as root
3. Set environment variables from `.env`
4. Deploy

### Frontend Deployment

Already set up for Vercel. Just connect your GitHub repo to Vercel and select `web-app` as root.

## Environment Configuration

### Backend .env (production)

```env
DATABASE_URL=postgresql://user:pass@host:5432/movies_db
NODE_ENV=production
PORT=3001
CORS_ORIGIN=https://yourdomain.com
JWT_SECRET=generate-strong-random-key
JWT_REFRESH_SECRET=generate-strong-random-key
```

### Frontend .env.local

```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Monitoring & Logs

### Backend Logs

```bash
# In backend directory
npm run dev  # Shows live logs
```

### Database Logs

```bash
docker-compose logs postgres
```

### Health Check

```bash
curl http://localhost:3001/health
# Response: {"status":"ok"}
```

## Common Issues

### 1. Database Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Fix:**
```bash
docker-compose up -d postgres
docker-compose ps  # Verify postgres is running
```

### 2. Port Already in Use

```bash
# Find and kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change port in backend/.env
PORT=3002
```

### 3. TypeScript Errors

```bash
cd backend
npm run build  # Check for errors
```

### 4. Database Migration Failed

```bash
cd backend
npx prisma migrate reset  # ⚠️ Deletes all data
npm run db:seed
```

## Useful Commands

### Backend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code quality
npm run db:migrate   # Create/run migrations
npm run db:seed      # Add test data
```

### Frontend

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code quality
```

### Docker

```bash
docker-compose up -d        # Start all services
docker-compose down         # Stop all services
docker-compose logs -f      # View logs
docker-compose ps           # Show status
```

## Next Steps

### Immediate (to go live)

1. Update frontend pages to call backend API
2. Integrate authentication state management (Redux/Zustand)
3. Add error handling and loading states
4. Deploy backend and frontend
5. Test end-to-end in staging

### Short Term (1-2 weeks)

1. Add S3 image uploads
2. Implement proper JWT with @fastify/jwt
3. Add rate limiting
4. Add comprehensive tests
5. Set up monitoring (Sentry)

### Medium Term (1 month)

1. Add advanced filtering/search
2. Add image thumbnails
3. Add user preferences
4. Add social features (sharing, ratings)

### Long Term (3+ months)

1. Add GraphQL API
2. Add mobile app (React Native)
3. Add real-time features (WebSockets)
4. Scale to microservices

## Support & Documentation

- **API Docs**: `backend/README.md`
- **OpenAPI Spec**: `backend/openapi.yml` (import to Postman)
- **Implementation Guide**: `backend/IMPLEMENTATION_GUIDE.md`
- **Postman Collection**: `backend/postman-collection.json`

## Architecture Decision Records

### Why Fastify?
- High performance (2x faster than Express)
- Built-in schema validation
- Great TypeScript support
- Excellent plugin ecosystem

### Why Prisma?
- Type-safe database access
- Auto-generated migrations
- Excellent DX
- Multi-database support

### Why PostgreSQL?
- ACID compliant
- JSON support
- Excellent performance
- Great for relational data

### Why JWT + Cookies?
- Stateless authentication
- Works with SPAs and mobile
- HttpOnly cookies protect from XSS
- Refresh tokens enable long sessions

---

**Last Updated**: February 2026  
**Status**: Ready for Frontend Integration  
**Next Review**: After first deployment
