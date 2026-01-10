import express from 'express';
import db from '../config/database.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get all problems with filters
router.get('/', optionalAuth, async (req, res) => {
    try {
        const { difficulty, category, search } = req.query;

        let query = 'SELECT * FROM problems WHERE 1=1';
        const params = [];

        if (difficulty && difficulty !== 'all') {
            query += ' AND difficulty = ?';
            params.push(difficulty);
        }

        if (category && category !== 'all') {
            query += ' AND category = ?';
            params.push(category);
        }

        if (search) {
            query += ' AND (title LIKE ? OR tags LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY id';

        const problems = db.prepare(query).all(...params);

        // If user is authenticated, mark solved problems
        let solvedIds = [];
        if (req.user) {
            const solved = db.prepare('SELECT problem_id FROM solved_problems WHERE user_id = ?').all(req.user.id);
            solvedIds = solved.map(row => row.problem_id);
        }

        const formattedProblems = problems.map(problem => ({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            description: problem.description,
            tags: JSON.parse(problem.tags || '[]'),
            acceptanceRate: problem.acceptance_rate,
            submissions: problem.total_submissions,
            solved: solvedIds.includes(problem.id)
        }));

        res.json({ problems: formattedProblems, total: formattedProblems.length });
    } catch (error) {
        console.error('Get problems error:', error);
        res.status(500).json({ error: 'Failed to fetch problems' });
    }
});

// Get single problem
router.get('/:id', optionalAuth, async (req, res) => {
    try {
        const { id } = req.params;

        const problem = db.prepare('SELECT * FROM problems WHERE id = ?').get(id);

        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }

        // Check if user has solved this
        let solved = false;
        if (req.user) {
            const solvedResult = db.prepare(
                'SELECT id FROM solved_problems WHERE user_id = ? AND problem_id = ?'
            ).get(req.user.id, id);
            solved = !!solvedResult;
        }

        res.json({
            id: problem.id,
            title: problem.title,
            difficulty: problem.difficulty,
            category: problem.category,
            description: problem.description,
            examples: JSON.parse(problem.examples || '[]'),
            constraints: JSON.parse(problem.constraints || '[]'),
            starterCode: JSON.parse(problem.starter_code || '{}'),
            testCases: JSON.parse(problem.test_cases || '[]'),
            tags: JSON.parse(problem.tags || '[]'),
            acceptanceRate: problem.acceptance_rate,
            submissions: problem.total_submissions,
            solved
        });
    } catch (error) {
        console.error('Get problem error:', error);
        res.status(500).json({ error: 'Failed to fetch problem' });
    }
});

export default router;
