# Quick Reference Guide

## 🚀 Start Development in 3 Steps

```bash
# Step 1: Start Database
cd backend && docker-compose up -d postgres

# Step 2: Start Backend (in another terminal)
cd backend && npm install && npm run db:migrate && npm run dev

# Step 3: Start Frontend (in another terminal)
cd web-app && npm install && npm run dev
```

Visit `http://localhost:3000` → Test with `test@example.com` / `password123`

---

## 📡 API Quick Reference

### Base URL
```
http://localhost:3001
```

### Auth Endpoints

**Signup**
```bash
POST /auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Login**
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "remember": false
}
# Returns: { user: {...}, accessToken: "..." }
```

**Get Current User**
```bash
GET /me
Authorization: Bearer <ACCESS_TOKEN>
```

**Logout**
```bash
POST /auth/logout
Authorization: Bearer <ACCESS_TOKEN>
```

### Movie Endpoints

**List Movies** (paginated)
```bash
GET /movies?page=1&limit=20
Authorization: Bearer <ACCESS_TOKEN>
# Returns: { items: [{...}], meta: {page, limit, total, totalPages} }
```

**Get Movie**
```bash
GET /movies/:id
Authorization: Bearer <ACCESS_TOKEN>
# Returns: Movie object
```

**Create Movie**
```bash
POST /movies
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "title": "The Matrix",
  "year": "1999",
  "imageUrl": "https://..."
}
# Returns: Created movie object
```

**Update Movie**
```bash
PUT /movies/:id
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json

{
  "title": "Updated Title",
  "year": "2000"
}
# Returns: Updated movie object
```

**Delete Movie**
```bash
DELETE /movies/:id
Authorization: Bearer <ACCESS_TOKEN>
# Returns: 204 No Content
```

**Health Check**
```bash
GET /health
# Returns: { "status": "ok" }
```

---

## 🛠️ Common Commands

### Backend Commands
```bash
cd backend

npm run dev              # Start dev server (hot reload)
npm run build          # Build for production
npm start              # Run production build
npm run db:migrate     # Run database migrations
npm run db:seed        # Add test data
npm run lint           # Check code quality
npm run format         # Format code
npm test               # Run tests
```

### Frontend Commands
```bash
cd web-app

npm run dev            # Start dev server
npm run build          # Build for production
npm run start          # Run production build
npm run lint           # Check code quality
```

### Docker Commands
```bash
cd backend

docker-compose up -d postgres      # Start database
docker-compose down                # Stop all services
docker-compose logs postgres       # View database logs
docker-compose ps                  # Show service status
```

---

## 🗄️ Database

### Connection String
```
postgresql://movies_user:movies_password@localhost:5432/movies_db
```

### Reset Database (⚠️ deletes all data)
```bash
cd backend
npx prisma migrate reset
npm run db:seed
```

### View Database (using psql)
```bash
docker-compose exec postgres psql -U movies_user -d movies_db

# Common queries:
\dt                    # List tables
SELECT * FROM "User";  # View users
SELECT * FROM "Movie"; # View movies
\q                     # Quit
```

---

## 🔐 Authentication

### Token Management
```javascript
// Get token from login response
const { accessToken } = loginResponse;

// Store token
localStorage.setItem('accessToken', accessToken);

// Use token in requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
};

// Refresh token is in HttpOnly cookie (automatic in browser)
```

### Test Credentials
```
Email: test@example.com
Password: password123
```

---

## 📋 File Locations

### Backend Structure
```
backend/
├── src/
│   ├── routes/auth.ts         👈 Login/signup endpoints
│   ├── routes/movies.ts       👈 Movie CRUD endpoints
│   ├── services/auth.service.ts
│   ├── services/movie.service.ts
│   ├── middleware/auth.ts     👈 JWT verification
│   ├── types/schemas.ts       👈 Validation schemas
│   └── server.ts              👈 Main app
├── prisma/schema.prisma       👈 Database models
├── .env.example               👈 Config template
├── README.md                  👈 Full API docs
├── openapi.yml                👈 OpenAPI spec
└── postman-collection.json    👈 Postman tests
```

### Frontend Pages
```
app/
├── signin/page.tsx            👈 Login → call POST /auth/login
├── signup/page.tsx            👈 Signup → call POST /auth/signup
├── playlist/page.tsx          👈 Movies list → call GET /movies
├── add/page.tsx               👈 Add movie → call POST /movies
└── edit/page.tsx              👈 Edit movie → call PUT /movies/:id
```

---

## 🧪 Testing with Postman/Curl

### Login (get token)
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# Response includes: "accessToken": "eyJ..."
```

### Get Movies (using token)
```bash
TOKEN="<your-access-token>"

curl http://localhost:3001/movies \
  -H "Authorization: Bearer $TOKEN"
```

### Create Movie
```bash
TOKEN="<your-access-token>"

curl -X POST http://localhost:3001/movies \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "My Movie",
    "year": "2024",
    "imageUrl": "https://via.placeholder.com/150"
  }'
```

---

## 🐛 Troubleshooting

### Database Won't Connect
```bash
# Check if postgres is running
docker-compose ps

# Start postgres
docker-compose up -d postgres

# Wait ~5 seconds and try again
```

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or change PORT in backend/.env to 3002
```

### Forgot Test Password
```bash
cd backend
npm run db:seed  # Resets to password123
```

### TypeScript Errors
```bash
cd backend
npm run build  # See actual errors
```

---

## 📚 Documentation Links

| File | Purpose |
|------|---------|
| `SETUP.md` | Full-stack setup guide |
| `BACKEND_SUMMARY.md` | Implementation overview |
| `backend/README.md` | API documentation |
| `backend/IMPLEMENTATION_GUIDE.md` | Architecture details |
| `backend/openapi.yml` | OpenAPI specification |
| `backend/postman-collection.json` | Postman test collection |

---

## 🚀 Deployment Checklist

- [ ] Update `.env` with production values
- [ ] Change `JWT_SECRET` and `JWT_REFRESH_SECRET`
- [ ] Update `DATABASE_URL` for production database
- [ ] Set `NODE_ENV=production`
- [ ] Set `CORS_ORIGIN` to frontend domain
- [ ] Run `npm run build`
- [ ] Test with `npm start`
- [ ] Set up CI/CD pipeline
- [ ] Configure backups
- [ ] Enable monitoring

---

## ⚡ Performance Tips

- Database queries are optimized with indexes (ownerId, createdAt)
- Pagination limits (max 100 items per page)
- Fastify is highly optimized (~3x faster than Express)
- Structured logging has minimal overhead
- TypeScript compiles to optimized JS

---

## 🔒 Security Checklist

- ✅ Passwords hashed with Argon2
- ✅ JWT tokens with expiration
- ✅ HttpOnly secure cookies
- ✅ CORS configured
- ✅ Helmet security headers
- ✅ Input validation (Zod)
- ✅ SQL injection prevention (Prisma)
- ✅ Owner-based authorization
- ⏳ Rate limiting (TODO)
- ⏳ HTTPS/TLS (configure in production)

---

## 📞 Quick Help

**API not responding?**
```bash
curl http://localhost:3001/health
```

**Check backend logs?**
```bash
# Terminal where backend is running shows live logs
# Or: docker-compose logs -f postgres
```

**Clear browser cache?**
```
Ctrl+Shift+Delete → Clear all → Reload page
```

**Reset everything?**
```bash
# Stop all
docker-compose down
pkill -f "npm run dev"

# Start fresh
docker-compose up -d postgres
npm run db:migrate
npm run dev
```

---

**Last Updated**: February 5, 2026  
**Status**: Ready to Use ✅
