import db from '../config/database.js';

try {
    console.log('Migrating database for Firebase...');

    // Check if firebase_uid already exists
    const info = db.prepare("PRAGMA table_info(users)").all();
    const hasFirebaseUid = info.some(column => column.name === 'firebase_uid');

    if (!hasFirebaseUid) {
        // SQLite doesn't support easy ALTER COLUMN for making it nullable
        // So we create a new table and copy data
        db.transaction(() => {
            db.exec(`
                CREATE TABLE users_new (
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

            db.exec(`
                INSERT INTO users_new (id, email, name, password_hash, avatar_url, created_at, last_login)
                SELECT id, email, name, password_hash, avatar_url, created_at, last_login FROM users;
            `);

            db.exec("DROP TABLE users;");
            db.exec("ALTER TABLE users_new RENAME TO users;");
        })();
        console.log('✓ Database migrated successfully');
    } else {
        console.log('✓ Migration already applied');
    }
} catch (error) {
    console.error('Migration failed:', error);
}
