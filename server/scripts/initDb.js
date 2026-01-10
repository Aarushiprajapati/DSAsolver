import pool from '../config/database.js';

const createTables = async () => {
    const client = await pool.connect();

    try {
        console.log('Creating database tables...');

        // Users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        avatar_url TEXT DEFAULT 'https://api.dicebear.com/7.x/avataaars/svg?seed=default',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );
    `);
        console.log('✓ Users table created');

        // Problems table
        await client.query(`
      CREATE TABLE IF NOT EXISTS problems (
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
        acceptance_rate DECIMAL(5,2) DEFAULT 0,
        total_submissions INTEGER DEFAULT 0,
        tags TEXT[],
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✓ Problems table created');

        // Submissions table
        await client.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
        language VARCHAR(50) NOT NULL,
        code TEXT NOT NULL,
        status VARCHAR(50) NOT NULL,
        runtime INTEGER,
        memory DECIMAL(10,2),
        test_results JSONB,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_submissions ON submissions(user_id, submitted_at DESC);
      CREATE INDEX IF NOT EXISTS idx_problem_submissions ON submissions(problem_id);
    `);
        console.log('✓ Submissions table created');

        // User stats table
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_stats (
        user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        total_solved INTEGER DEFAULT 0,
        easy_solved INTEGER DEFAULT 0,
        medium_solved INTEGER DEFAULT 0,
        hard_solved INTEGER DEFAULT 0,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_submission_date DATE,
        total_submissions INTEGER DEFAULT 0,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✓ User stats table created');

        // Activity table for heatmap
        await client.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        activity_date DATE NOT NULL,
        submission_count INTEGER DEFAULT 0,
        UNIQUE(user_id, activity_date)
      );
      
      CREATE INDEX IF NOT EXISTS idx_user_activity ON user_activity(user_id, activity_date DESC);
    `);
        console.log('✓ User activity table created');

        // Solved problems tracking
        await client.query(`
      CREATE TABLE IF NOT EXISTS solved_problems (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        problem_id INTEGER REFERENCES problems(id) ON DELETE CASCADE,
        solved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, problem_id)
      );
    `);
        console.log('✓ Solved problems table created');

        console.log('\n✅ All tables created successfully!');
    } catch (error) {
        console.error('Error creating tables:', error);
        throw error;
    } finally {
        client.release();
    }
};

// Run the script
createTables()
    .then(() => {
        console.log('\n🎉 Database initialization complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n❌ Database initialization failed:', error);
        process.exit(1);
    });
