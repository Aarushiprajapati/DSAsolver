import db from '../config/database.js';

const createTables = () => {
  try {
    console.log('Creating database tables...');

    // Users table
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password_hash TEXT,
        firebase_uid TEXT UNIQUE,
        avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_login DATETIME
      );
    `);
    console.log('✓ Users table created');

    // Problems table
    db.exec(`
      CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
        category TEXT,
        description TEXT NOT NULL,
        constraints TEXT,
        examples TEXT,
        starter_code TEXT,
        test_cases TEXT,
        acceptance_rate REAL DEFAULT 0,
        total_submissions INTEGER DEFAULT 0,
        tags TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ Problems table created');

    // Submissions table
    db.exec(`
      CREATE TABLE IF NOT EXISTS submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        problem_id INTEGER NOT NULL,
        language TEXT NOT NULL,
        code TEXT NOT NULL,
        status TEXT NOT NULL,
        runtime INTEGER,
        memory REAL,
        test_results TEXT,
        submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_submissions ON submissions(user_id, submitted_at DESC);
      CREATE INDEX IF NOT EXISTS idx_problem_submissions ON submissions(problem_id);
    `);
    console.log('✓ Submissions table created');

    // User stats table
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_stats (
        user_id INTEGER PRIMARY KEY,
        total_solved INTEGER DEFAULT 0,
        easy_solved INTEGER DEFAULT 0,
        medium_solved INTEGER DEFAULT 0,
        hard_solved INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_submission_date DATE,
        total_submissions INTEGER DEFAULT 0,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ User stats table created');

    // Activity table
    db.exec(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_date DATE NOT NULL,
        submission_count INTEGER DEFAULT 0,
        UNIQUE(user_id, activity_date),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_activity ON user_activity(user_id, activity_date DESC);
    `);
    console.log('✓ User activity table created');

    // Solved problems tracking
    db.exec(`
      CREATE TABLE IF NOT EXISTS solved_problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        problem_id INTEGER NOT NULL,
        solved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, problem_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
      );
    `);
    console.log('✓ Solved problems table created');

    console.log('\n✅ All tables created successfully!');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Run the script
try {
  createTables();
  console.log('\n🎉 Database initialization complete!');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Database initialization failed:', error);
  process.exit(1);
}
