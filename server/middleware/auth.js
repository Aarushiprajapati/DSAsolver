import { auth } from '../config/firebase.js';
import db from '../config/database.js';

export const authenticate = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        console.log('Auth: No token provided');
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (!auth) {
        console.error('Auth: Firebase not configured on server');
        return res.status(500).json({ error: 'Firebase authentication not configured on server' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;
        console.log(`Auth: Verified token for ${email} (${uid})`);

        // Get user from database using email or firebase_uid
        let user = db.prepare('SELECT id, email, name, avatar_url FROM users WHERE firebase_uid = ? OR email = ?').get(uid, email);

        if (!user) {
            console.log(`Auth: Auto-registering user ${email}`);
            const displayName = name || email.split('@')[0];
            const avatarUrl = picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

            const result = db.prepare(
                'INSERT INTO users (email, name, avatar_url, firebase_uid, password_hash) VALUES (?, ?, ?, ?, ?)'
            ).run(email, displayName, avatarUrl, uid, 'firebase-' + Math.random().toString(36).substring(7));

            const userId = result.lastInsertRowid;
            db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(userId);

            user = { id: userId, email, name: displayName, avatar_url: avatarUrl };
        } else if (!user.firebase_uid) {
            db.prepare('UPDATE users SET firebase_uid = ? WHERE id = ?').run(uid, user.id);
        }

        req.user = user;
        next();
    } catch (verifyError) {
        console.error('Auth: Token verification failed:', verifyError.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (token && auth) {
            const decodedToken = await auth.verifyIdToken(token);
            const user = db.prepare('SELECT id, email, name, avatar_url FROM users WHERE firebase_uid = ? OR email = ?').get(decodedToken.uid, decodedToken.email);

            if (user) {
                req.user = user;
            }
        }

        next();
    } catch (error) {
        // Continue without authentication
        next();
    }
};
