import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'dsasolver.db'), {
    verbose: console.log
});

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Auto-migration: Ensure firebase_uid column exists
try {
    db.prepare('ALTER TABLE users ADD COLUMN firebase_uid TEXT').run();
    console.log('✓ Added firebase_uid column (Migration)');
    db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_users_firebase_uid ON users(firebase_uid)').run();
} catch (e) {
    if (!e.message.includes('duplicate column name')) {
        console.error('Migration Error:', e.message);
    }
}

console.log('✓ Database connected successfully');

export default db;
