# 🚀 DSASolver - Complete Setup Guide

This guide will help you set up both the frontend and backend of the DSASolver platform.

## Prerequisites

Before you begin, ensure you have the following installed:

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **PostgreSQL 15+** - [Download](https://www.postgresql.org/download/)
- ✅ **npm** (comes with Node.js)

## Quick Start (5 Minutes)

### Step 1: Install PostgreSQL

1. Download and install PostgreSQL from the link above
2. During installation, remember your password for the `postgres` user
3. PostgreSQL should start automatically on port 5432

### Step 2: Create Database

Open a terminal and run:

```bash
# Windows (Command Prompt or PowerShell)
psql -U postgres

# Once in psql, run:
CREATE DATABASE dsasolver;

# Verify it was created:
\l

# Exit psql:
\q
```

### Step 3: Configure Backend

```bash
# Navigate to server directory
cd server

# The .env file is already created with default settings
# If your PostgreSQL password is different from 'postgres', edit server/.env:
# DB_PASSWORD=your_actual_password
```

### Step 4: Initialize Database

```bash
# Still in server directory
npm run init-db
```

You should see:
```
✓ Users table created
✓ Problems table created
✓ Submissions table created
✓ User stats table created
✓ User activity table created
✓ Solved problems table created

✅ All tables created successfully!
```

### Step 5: Seed Sample Data

```bash
npm run seed
```

You should see:
```
✓ Seeded 6 problems
✅ Database seeding complete!
```

### Step 6: Start Backend Server

```bash
# Development mode (auto-reload on changes)
npm run dev
```

You should see:
```
╔═══════════════════════════════════════╗
║   DSASolver API Server                ║
║   Environment: development            ║
║   Port: 3001                          ║
║   URL: http://localhost:3001          ║
╚═══════════════════════════════════════╝

✓ Server is running
✓ Database connected successfully
```

### Step 7: Start Frontend (New Terminal)

Open a **new terminal window** and run:

```bash
# Navigate to project root (not server folder)
cd ..

# Start frontend (should already be running, but if not:)
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## 🎉 You're Done!

The application is now fully functional with:
- ✅ Real database (PostgreSQL)
- ✅ User authentication (JWT)
- ✅ Problem submission tracking
- ✅ Streak calculation
- ✅ Activity heatmap
- ✅ Progress analytics

## Testing the Backend

### Test 1: Health Check

```bash
curl http://localhost:3001/health
```

Expected: `{"status":"ok","timestamp":"..."}`

### Test 2: Get Problems

```bash
curl http://localhost:3001/api/problems
```

Expected: JSON array of 6 problems

### Test 3: Register a User

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"name\":\"Test User\",\"password\":\"password123\"}"
```

Expected: `{"token":"...","user":{...}}`

### Test 4: Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"password123\"}"
```

Expected: `{"token":"...","user":{...}}`

## Using the Application

### 1. Register/Login
- Open http://localhost:5173
- Click "Start Practicing Free"
- The app will use the backend for real authentication

### 2. Browse Problems
- Click "Problems" in navigation
- Filter by difficulty or category
- Search for specific problems

### 3. Solve a Problem
- Click on any problem
- Write your code in the Monaco editor
- Click "Run Code" to test
- Click "Submit" to save your solution

### 4. Track Progress
- View your Dashboard for activity heatmap
- Check your Profile for stats and achievements
- Your streak updates automatically!

## Troubleshooting

### Backend won't start

**Error: "Database connection failed"**
- Make sure PostgreSQL is running
- Check your password in `server/.env`
- Verify database exists: `psql -U postgres -l`

**Error: "Port 3001 already in use"**
- Change PORT in `server/.env` to 3002
- Update `VITE_API_URL` in `.env` (root folder)

### Frontend can't connect to backend

**Error: "Network request failed"**
- Make sure backend is running on port 3001
- Check browser console for CORS errors
- Verify `.env` has correct API URL

### Database errors

**Error: "relation does not exist"**
- Run `npm run init-db` again
- Make sure you're in the `server` directory

**Error: "no data"**
- Run `npm run seed` to add sample problems

## Project Structure

```
dsasolver/
├── src/                    # Frontend React app
│   ├── components/
│   ├── pages/
│   ├── services/
│   │   └── api.js         # Backend API calls
│   └── store.js
├── server/                 # Backend Node.js API
│   ├── config/
│   │   └── database.js    # PostgreSQL connection
│   ├── middleware/
│   │   └── auth.js        # JWT authentication
│   ├── routes/
│   │   ├── auth.js        # Register/Login
│   │   ├── problems.js    # Get problems
│   │   ├── submissions.js # Submit code
│   │   └── users.js       # User profile
│   ├── scripts/
│   │   ├── initDb.js      # Create tables
│   │   └── seedData.js    # Add sample data
│   ├── .env               # Configuration
│   ├── server.js          # Express app
│   └── package.json
└── .env                    # Frontend config
```

## Database Schema

### Tables Created

1. **users** - User accounts
2. **problems** - Coding problems
3. **submissions** - Code submissions
4. **user_stats** - Aggregated statistics
5. **user_activity** - Daily activity for heatmap
6. **solved_problems** - Track which problems user solved

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Problems
- `GET /api/problems` - List problems
- `GET /api/problems/:id` - Get problem details

### Submissions
- `POST /api/submissions` - Submit code
- `GET /api/submissions/recent` - Recent submissions
- `GET /api/submissions/problem/:id` - Submissions for problem

### Users
- `GET /api/users/:id` - User profile
- `GET /api/users/activity` - Activity heatmap

## Next Steps

### Add Real Code Execution

Currently, code execution is simulated. To add real execution:

1. **Option A: Use Judge0 API** (Easier)
   - Sign up at https://rapidapi.com/judge0-official/api/judge0-ce
   - Add API key to `server/.env`
   - Update `executeCode()` in `server/routes/submissions.js`

2. **Option B: Build Custom Runner** (More Control)
   - Install Docker
   - Create execution containers
   - Implement queue system with BullMQ
   - See `BACKEND_GUIDE.md` for details

### Add More Features

- Email verification
- Password reset
- Social authentication (Google, GitHub)
- Discussion forums
- Solution explanations
- Video tutorials
- Leaderboards
- Contests

## Support

If you encounter issues:

1. Check this guide's Troubleshooting section
2. Review `server/README.md` for backend details
3. Check browser console for frontend errors
4. Check terminal for backend errors

## Success! 🎉

You now have a fully functional DSA practice platform with:
- Real authentication
- Database persistence
- Progress tracking
- Activity analytics
- Streak gamification

Happy coding! 💻
