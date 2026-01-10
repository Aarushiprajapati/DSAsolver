# DSASolver Backend

Backend API for the DSASolver platform.

## Setup Instructions

### 1. Install PostgreSQL

Download and install PostgreSQL from https://www.postgresql.org/download/

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE dsasolver;

# Exit
\q
```

### 3. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` and update:
- `DB_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` - A secure random string

### 4. Install Dependencies

```bash
npm install
```

### 5. Initialize Database

```bash
npm run init-db
```

### 6. Seed Data

```bash
npm run seed
```

### 7. Start Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires auth)

### Problems
- `GET /api/problems` - List all problems (supports filters)
- `GET /api/problems/:id` - Get problem details

### Submissions
- `POST /api/submissions` - Submit code (requires auth)
- `GET /api/submissions/recent` - Get recent submissions (requires auth)
- `GET /api/submissions/problem/:problemId` - Get submissions for problem (requires auth)

### Users
- `GET /api/users/:userId` - Get user profile
- `GET /api/users/activity` - Get activity heatmap (requires auth)

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get Problems
```bash
curl http://localhost:3001/api/problems
```

### Submit Code (with auth token)
```bash
curl -X POST http://localhost:3001/api/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{"problemId":1,"code":"function twoSum(nums, target) { return [0,1]; }","language":"javascript"}'
```

## Database Schema

See `scripts/initDb.js` for complete schema.

## Security Features

- JWT authentication
- Password hashing with bcrypt
- SQL injection protection with parameterized queries
- CORS configuration
- Helmet security headers
- Request validation

## Next Steps

- Implement real code execution engine with Docker
- Add rate limiting
- Add Redis caching
- Add WebSocket support for real-time updates
- Add email verification
- Add password reset functionality
