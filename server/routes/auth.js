import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register',
    [
        body('email').isEmail().normalizeEmail(),
        body('name').trim().isLength({ min: 2, max: 100 }),
        body('password').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, name, password } = req.body;

            // Check if user exists
            const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            // Hash password
            const passwordHash = await bcrypt.hash(password, 10);

            // Create user
            const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
            const result = db.prepare(
                'INSERT INTO users (email, name, password_hash, avatar_url) VALUES (?, ?, ?, ?)'
            ).run(email, name, passwordHash, avatarUrl);

            const userId = result.lastInsertRowid;

            // Create user stats entry
            db.prepare('INSERT INTO user_stats (user_id) VALUES (?)').run(userId);

            // Get created user
            const user = db.prepare('SELECT id, email, name, avatar_url FROM users WHERE id = ?').get(userId);

            // Generate JWT
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.status(201).json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar_url
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            res.status(500).json({ error: 'Registration failed' });
        }
    }
);

// Login
router.post('/login',
    [
        body('email').isEmail().normalizeEmail(),
        body('password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { email, password } = req.body;

            // Get user
            const user = db.prepare(
                'SELECT id, email, name, password_hash, avatar_url FROM users WHERE email = ?'
            ).get(email);

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Verify password
            const isValid = await bcrypt.compare(password, user.password_hash);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            // Update last login
            db.prepare('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?').run(user.id);

            // Generate JWT
            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    avatar: user.avatar_url
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            res.status(500).json({ error: 'Login failed' });
        }
    }
);

// Get current user
router.get('/me', authenticate, async (req, res) => {
    try {
        // Get user stats
        const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(req.user.id) || {
            total_solved: 0,
            easy_solved: 0,
            medium_solved: 0,
            hard_solved: 0,
            current_streak: 0,
            longest_streak: 0,
            total_submissions: 0
        };

        res.json({
            id: req.user.id,
            email: req.user.email,
            name: req.user.name,
            avatar: req.user.avatar_url,
            stats: {
                totalSolved: stats.total_solved,
                easySolved: stats.easy_solved,
                mediumSolved: stats.medium_solved,
                hardSolved: stats.hard_solved,
                currentStreak: stats.current_streak,
                longestStreak: stats.longest_streak,
                totalSubmissions: stats.total_submissions
            }
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user data' });
    }
});

export default router;
