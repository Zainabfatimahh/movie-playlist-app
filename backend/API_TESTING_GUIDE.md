# API Testing Guide - Login with Zainab Credentials

## Prerequisites
1. **PostgreSQL must be running** on `localhost:5432`
2. Database created: `movies` (or update DATABASE_URL in .env)
3. Backend running on `http://localhost:3001`

## Setup PostgreSQL (Windows)

### Option 1: If PostgreSQL is installed
```powershell
# Check if service is running
Get-Service postgresql-x64-*

# Start PostgreSQL service
Start-Service postgresql-x64-15  # or your version

# Create database (using psql)
psql -U postgres -c "CREATE DATABASE movies;"
```

### Option 2: Using Docker
```powershell
docker run --name postgres-movies -e POSTGRES_PASSWORD=password -e POSTGRES_DB=movies -p 5432:5432 -d postgres:latest
```

## Testing Endpoints

### 1. Signup (Create User)
```powershell
$body = @{
    username = "Zainab"
    password = "Zainab1122"
} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:3001/auth/signup' `
    -Method POST `
    -ContentType 'application/json' `
    -Body $body `
    -SkipHttpErrorCheck | ConvertFrom-Json | Format-Table
```

### 2. Login (Get JWT Token)
```powershell
$body = @{
    username = "Zainab"
    password = "Zainab1122"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri 'http://localhost:3001/auth/login' `
    -Method POST `
    -ContentType 'application/json' `
    -Body $body `
    -SkipHttpErrorCheck

Write-Host "Status: " $response.StatusCode
Write-Host "Response: " ($response.Content | ConvertFrom-Json | Format-Table)

# Extract token from response for subsequent requests
$token = ($response.Content | ConvertFrom-Json).token
Write-Host "Token: " $token
```

### 3. Get Current User Info
```powershell
$token = "YOUR_JWT_TOKEN_HERE"

Invoke-WebRequest -Uri 'http://localhost:3001/me' `
    -Method GET `
    -Headers @{Authorization = "Bearer $token"} `
    -SkipHttpErrorCheck | ConvertFrom-Json | Format-Table
```

### 4. Get Movies List
```powershell
$token = "YOUR_JWT_TOKEN_HERE"

Invoke-WebRequest -Uri 'http://localhost:3001/movies' `
    -Method GET `
    -Headers @{Authorization = "Bearer $token"} `
    -SkipHttpErrorCheck | ConvertFrom-Json | Format-Table
```

### 5. Create a Movie
```powershell
$token = "YOUR_JWT_TOKEN_HERE"

$body = @{
    title = "Test Movie"
    description = "A test movie"
    releaseDate = "2026-02-05"
    posterUrl = "https://example.com/poster.jpg"
} | ConvertTo-Json

Invoke-WebRequest -Uri 'http://localhost:3001/movies' `
    -Method POST `
    -ContentType 'application/json' `
    -Headers @{Authorization = "Bearer $token"} `
    -Body $body `
    -SkipHttpErrorCheck | ConvertFrom-Json | Format-Table
```

## Troubleshooting

### Backend Server Not Responding
1. Check if npm run dev is still running
2. Verify no errors in backend terminal
3. Restart with: `npm run dev` in backend directory

### Database Connection Error
1. Verify PostgreSQL is running: `pg_isready -h localhost -p 5432`
2. Check DATABASE_URL in .env file
3. Run Prisma migrations: `npx prisma migrate dev`

### Authentication Errors
1. Ensure user exists - run signup first
2. Use exact username/password
3. Check JWT_SECRET in .env matches server.ts

## Expected Responses

### Successful Signup (201)
```json
{
  "id": "uuid-here",
  "username": "Zainab",
  "email": "zainab@example.com"
}
```

### Successful Login (200)
```json
{
  "user": {
    "id": "uuid-here",
    "username": "Zainab",
    "email": "zainab@example.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Successful /me (200)
```json
{
  "id": "uuid-here",
  "username": "Zainab",
  "email": "zainab@example.com"
}
```
