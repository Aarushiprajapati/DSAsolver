import express from 'express';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Get user activity for heatmap
router.get('/activity', authenticate, async (req, res) => {
    try {
        const { days = 365 } = req.query;

        const activity = db.prepare(`
      SELECT activity_date, submission_count
      FROM user_activity
      WHERE user_id = ?
        AND activity_date >= date('now', '-${days} days')
      ORDER BY activity_date ASC
    `).all(req.user.id);

        // Fill in missing dates with 0 submissions
        const activityMap = {};
        activity.forEach(row => {
            activityMap[row.activity_date] = row.submission_count;
        });

        const activityData = [];
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            const dateStr = d.toISOString().split('T')[0];
            activityData.push({
                date: dateStr,
                count: activityMap[dateStr] || 0
            });
        }

        res.json({ activity: activityData });
    } catch (error) {
        console.error('Get activity error:', error);
        res.status(500).json({ error: 'Failed to fetch activity' });
    }
});

// Get user profile
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = db.prepare(
            'SELECT id, name, email, avatar_url, created_at FROM users WHERE id = ?'
        ).get(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId) || {
            total_solved: 0,
            easy_solved: 0,
            medium_solved: 0,
            hard_solved: 0,
            current_streak: 0,
            longest_streak: 0,
            total_submissions: 0
        };

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar_url,
            joinedDate: user.created_at,
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
        console.error('Get user profile error:', error);
        res.status(500).json({ error: 'Failed to fetch user profile' });
    }
});

export default router;
