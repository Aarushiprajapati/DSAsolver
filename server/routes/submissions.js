import express from 'express';
import { body, validationResult } from 'express-validator';
import db from '../config/database.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Simulate code execution
const executeCode = async (code, language, testCases) => {
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const passed = Math.random() > 0.3;
    const totalTests = testCases.length;
    const passedTests = passed ? totalTests : Math.floor(Math.random() * totalTests);

    return {
        passed,
        totalTests,
        passedTests,
        runtime: Math.floor(Math.random() * 100) + 50,
        memory: (Math.random() * 20 + 40).toFixed(1),
        output: passed
            ? 'All test cases passed! ✓'
            : `Test case ${passedTests + 1} failed: Expected output doesn't match`
    };
};

// Update user stats and streak
const updateUserStats = (userId, problemId, difficulty, passed) => {
    const today = new Date().toISOString().split('T')[0];

    // Update activity
    db.prepare(`
    INSERT INTO user_activity (user_id, activity_date, submission_count)
    VALUES (?, ?, 1)
    ON CONFLICT(user_id, activity_date)
    DO UPDATE SET submission_count = submission_count + 1
  `).run(userId, today);

    // Get current stats
    const stats = db.prepare('SELECT * FROM user_stats WHERE user_id = ?').get(userId);

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Calculate streak
    let currentStreak = stats?.current_streak || 0;
    const lastDate = stats?.last_submission_date;

    if (lastDate === yesterday) {
        currentStreak += 1;
    } else if (lastDate !== today) {
        currentStreak = 1;
    }

    const longestStreak = Math.max(stats?.longest_streak || 0, currentStreak);

    // Update total submissions
    db.prepare(`
    UPDATE user_stats 
    SET total_submissions = total_submissions + 1,
        current_streak = ?,
        longest_streak = ?,
        last_submission_date = ?
    WHERE user_id = ?
  `).run(currentStreak, longestStreak, today, userId);

    // If passed, update solved count
    if (passed) {
        const alreadySolved = db.prepare(
            'SELECT id FROM solved_problems WHERE user_id = ? AND problem_id = ?'
        ).get(userId, problemId);

        if (!alreadySolved) {
            db.prepare('INSERT INTO solved_problems (user_id, problem_id) VALUES (?, ?)').run(userId, problemId);

            const difficultyField = `${difficulty}_solved`;
            db.prepare(`
        UPDATE user_stats 
        SET total_solved = total_solved + 1,
            ${difficultyField} = ${difficultyField} + 1
        WHERE user_id = ?
      `).run(userId);
        }
    }
};

// Submit code
router.post('/',
    authenticate,
    [
        body('problemId').isInt(),
        body('code').trim().notEmpty(),
        body('language').isIn(['javascript', 'python', 'java'])
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { problemId, code, language } = req.body;

            // Get problem test cases
            const problem = db.prepare('SELECT test_cases, difficulty FROM problems WHERE id = ?').get(problemId);

            if (!problem) {
                return res.status(404).json({ error: 'Problem not found' });
            }

            const testCases = JSON.parse(problem.test_cases);
            const { difficulty } = problem;

            // Execute code
            const results = await executeCode(code, language, testCases);

            // Save submission
            const submission = db.prepare(`
        INSERT INTO submissions 
        (user_id, problem_id, language, code, status, runtime, memory, test_results)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
                req.user.id,
                problemId,
                language,
                code,
                results.passed ? 'accepted' : 'wrong_answer',
                results.runtime,
                results.memory,
                JSON.stringify(results)
            );

            // Update problem stats
            db.prepare('UPDATE problems SET total_submissions = total_submissions + 1 WHERE id = ?').run(problemId);

            // Update user stats
            updateUserStats(req.user.id, problemId, difficulty, results.passed);

            const submittedAt = db.prepare('SELECT submitted_at FROM submissions WHERE id = ?').get(submission.lastInsertRowid);

            res.json({
                submissionId: submission.lastInsertRowid,
                ...results,
                submittedAt: submittedAt.submitted_at
            });

        } catch (error) {
            console.error('Submission error:', error);
            res.status(500).json({ error: 'Submission failed' });
        }
    }
);

// Get user's submissions for a problem
router.get('/problem/:problemId', authenticate, async (req, res) => {
    try {
        const { problemId } = req.params;

        const submissions = db.prepare(`
      SELECT id, language, status, runtime, memory, submitted_at
      FROM submissions
      WHERE user_id = ? AND problem_id = ?
      ORDER BY submitted_at DESC
      LIMIT 20
    `).all(req.user.id, problemId);

        res.json({ submissions });
    } catch (error) {
        console.error('Get submissions error:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

// Get recent submissions
router.get('/recent', authenticate, async (req, res) => {
    try {
        const submissions = db.prepare(`
      SELECT 
        s.id,
        s.problem_id,
        p.title as problem_title,
        s.language,
        s.status,
        s.runtime,
        s.submitted_at
      FROM submissions s
      JOIN problems p ON s.problem_id = p.id
      WHERE s.user_id = ?
      ORDER BY s.submitted_at DESC
      LIMIT 10
    `).all(req.user.id);

        res.json({ submissions });
    } catch (error) {
        console.error('Get recent submissions error:', error);
        res.status(500).json({ error: 'Failed to fetch submissions' });
    }
});

export default router;
