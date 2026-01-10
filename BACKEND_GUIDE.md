# Backend Implementation Guide

This document outlines the step-by-step approach to building the backend for DSASolver.

## Phase 2: Backend Development Roadmap

### Step 1: Database Schema Design

#### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  password_hash VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);
```

#### Problems Table
```sql
CREATE TABLE problems (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  difficulty VARCHAR(20) CHECK (difficulty IN ('easy', 'medium', 'hard')),
  category VARCHAR(100),
  description TEXT NOT NULL,
  constraints TEXT[],
  examples JSONB,
  starter_code JSONB,
  test_cases JSONB,
  acceptance_rate DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Submissions Table
```sql
CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  problem_id INTEGER REFERENCES problems(id),
  language VARCHAR(50),
  code TEXT NOT NULL,
  status VARCHAR(50), -- 'accepted', 'wrong_answer', 'time_limit_exceeded', etc.
  runtime INTEGER, -- in milliseconds
  memory INTEGER, -- in MB
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_submissions (user_id, submitted_at),
  INDEX idx_problem_submissions (problem_id)
);
```

#### User Stats Table
```sql
CREATE TABLE user_stats (
  user_id INTEGER PRIMARY KEY REFERENCES users(id),
  total_solved INTEGER DEFAULT 0,
  easy_solved INTEGER DEFAULT 0,
  medium_solved INTEGER DEFAULT 0,
  hard_solved INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_submission_date DATE,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Step 2: API Endpoints

#### Authentication
```
POST   /api/auth/register       - Create new user
POST   /api/auth/login          - Login and get JWT token
POST   /api/auth/logout         - Invalidate token
GET    /api/auth/me             - Get current user info
```

#### Problems
```
GET    /api/problems            - List all problems (with filters)
GET    /api/problems/:id        - Get single problem details
GET    /api/problems/:id/submissions - Get user's submissions for problem
```

#### Submissions
```
POST   /api/submissions         - Submit code for evaluation
GET    /api/submissions/:id     - Get submission details
GET    /api/submissions/recent  - Get user's recent submissions
```

#### User Profile
```
GET    /api/users/:id           - Get user profile
GET    /api/users/:id/stats     - Get user statistics
GET    /api/users/:id/activity  - Get activity heatmap data
PATCH  /api/users/:id           - Update user profile
```

### Step 3: Code Execution Engine

#### Architecture
```
Client → API Server → Job Queue (Redis/BullMQ) → Worker Pool → Docker Containers
```

#### Docker Container Setup
```dockerfile
FROM node:18-alpine

# Install security tools
RUN apk add --no-cache nsjail

# Set resource limits
ENV MAX_MEMORY=128m
ENV MAX_TIME=2s

# Copy execution script
COPY execute.js /app/
WORKDIR /app

CMD ["node", "execute.js"]
```

#### Execution Flow
1. **Receive submission** - API validates and queues job
2. **Worker picks job** - From Redis queue
3. **Spin up container** - With code and test cases
4. **Run tests** - Capture stdout, stderr, exit code
5. **Collect metrics** - Runtime, memory usage
6. **Store results** - Update database
7. **Notify client** - Via WebSocket or polling

#### Security Measures
```javascript
// Docker run command with security flags
const dockerCmd = `
  docker run 
    --rm 
    --network none 
    --memory=128m 
    --cpus=0.5 
    --pids-limit=50 
    --read-only 
    --tmpfs /tmp:rw,noexec,nosuid,size=10m 
    -v ${codeFile}:/code:ro 
    code-runner:latest 
    timeout 2s node /code
`;
```

### Step 4: Real-time Updates with WebSockets

```javascript
// Server-side (Socket.io)
io.on('connection', (socket) => {
  socket.on('submit-code', async (data) => {
    const jobId = await queueSubmission(data);
    
    // Listen for job completion
    jobQueue.on(`job-${jobId}-complete`, (result) => {
      socket.emit('submission-result', result);
    });
  });
});
```

### Step 5: Caching Strategy

#### Redis Cache Keys
```
problems:all              - List of all problems (TTL: 1 hour)
problem:{id}              - Individual problem (TTL: 1 hour)
user:{id}:stats           - User statistics (TTL: 5 minutes)
leaderboard:daily         - Daily leaderboard (TTL: 10 minutes)
```

### Step 6: Streak Calculation Logic

```javascript
async function updateUserStreak(userId) {
  const lastSubmission = await getLastSubmissionDate(userId);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();
  
  if (lastSubmission === yesterday) {
    // Continue streak
    await incrementStreak(userId);
  } else if (lastSubmission !== today) {
    // Reset streak
    await resetStreak(userId);
  }
  
  // Update last submission date
  await updateLastSubmissionDate(userId, today);
}
```

### Step 7: Testing Strategy

#### Unit Tests
- Authentication middleware
- Problem validation
- Submission scoring logic

#### Integration Tests
- API endpoint responses
- Database transactions
- Redis caching

#### Load Tests
- 1000 concurrent submissions
- Database query performance
- Cache hit rates

### Step 8: Deployment

#### Infrastructure
```yaml
# docker-compose.yml
version: '3.8'
services:
  api:
    build: ./api
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - REDIS_URL=redis://...
    depends_on:
      - db
      - redis
  
  worker:
    build: ./worker
    environment:
      - REDIS_URL=redis://...
    depends_on:
      - redis
  
  db:
    image: postgres:15
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    
volumes:
  postgres_data:
```

#### Environment Variables
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:pass@localhost:5432/dsasolver
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key-here
DOCKER_HOST=unix:///var/run/docker.sock
MAX_WORKERS=10
```

### Step 9: Monitoring & Logging

#### Metrics to Track
- Submission queue length
- Average execution time
- Error rates by language
- Cache hit/miss ratio
- Active users
- Daily submissions

#### Logging
```javascript
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Alternative: Using Judge0 API (Faster MVP)

Instead of building a custom execution engine, you can use Judge0:

```javascript
const axios = require('axios');

async function executeCode(code, language, testCases) {
  const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
    source_code: code,
    language_id: getLanguageId(language),
    stdin: testCases.input,
    expected_output: testCases.output
  }, {
    headers: {
      'X-RapidAPI-Key': process.env.JUDGE0_API_KEY
    }
  });
  
  return response.data;
}
```

**Pros:**
- No infrastructure management
- Battle-tested security
- Multiple languages supported

**Cons:**
- API costs
- Rate limits
- Less control

## Recommended Tech Stack

- **API Framework**: Express.js or NestJS
- **ORM**: Prisma or TypeORM
- **Validation**: Zod or Joi
- **Authentication**: Passport.js with JWT
- **Queue**: BullMQ
- **Testing**: Jest + Supertest
- **Documentation**: Swagger/OpenAPI

## Timeline Estimate

- **Week 1-2**: Database setup + Auth
- **Week 3-4**: Problem CRUD + Submissions API
- **Week 5-6**: Code execution engine
- **Week 7**: Testing + Bug fixes
- **Week 8**: Deployment + Monitoring

## Next Steps

1. Set up PostgreSQL database
2. Create Express.js API skeleton
3. Implement authentication
4. Build problem management endpoints
5. Develop code execution worker
6. Integrate with frontend
7. Deploy to production

---

**Note**: This is a comprehensive guide. Start with the MVP (Judge0 integration) and iterate based on user feedback.
