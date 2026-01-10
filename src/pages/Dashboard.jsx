import { useStore } from '../store';
import './Dashboard.css';

export default function Dashboard() {
    const { user, setView, recentSubmissions, activityData } = useStore();

    if (!user) return null;

    const { stats } = user;

    // Get last 7 weeks of activity for heatmap
    // Handle case where activityData might be empty or still loading
    const safeActivityData = Array.isArray(activityData) ? activityData : [];
    const last49Days = safeActivityData.slice(-49);

    // Fill with empty days if less than 49 days
    while (last49Days.length < 49) {
        last49Days.unshift({ count: 0, date: '' });
    }

    const weeks = [];
    for (let i = 0; i < 7; i++) {
        weeks.push(last49Days.slice(i * 7, (i + 1) * 7));
    }

    const getActivityColor = (count) => {
        if (count === 0) return 'rgba(255, 255, 255, 0.05)';
        if (count === 1) return 'hsla(265, 85%, 65%, 0.3)';
        if (count === 2) return 'hsla(265, 85%, 65%, 0.5)';
        if (count === 3) return 'hsla(265, 85%, 65%, 0.7)';
        return 'hsla(265, 85%, 65%, 1)';
    };

    const progressData = [
        { difficulty: 'Easy', solved: stats.easySolved, total: 150, color: 'var(--color-easy)' },
        { difficulty: 'Medium', solved: stats.mediumSolved, total: 100, color: 'var(--color-medium)' },
        { difficulty: 'Hard', solved: stats.hardSolved, total: 50, color: 'var(--color-hard)' }
    ];

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">
                {/* Welcome Section */}
                <div className="welcome-section">
                    <div className="welcome-content">
                        <h1>Welcome back, {user.name.split(' ')[0]}! 👋</h1>
                        <p>Keep up the momentum! You're on a {stats.currentStreak} day streak.</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setView('problems')}>
                        <span>💪</span>
                        Start Today's Practice
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card glass-card">
                        <div className="stat-icon">✓</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.totalSolved}</div>
                            <div className="stat-label">Problems Solved</div>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon">🔥</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.currentStreak}</div>
                            <div className="stat-label">Day Streak</div>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon">🏆</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.longestStreak}</div>
                            <div className="stat-label">Longest Streak</div>
                        </div>
                    </div>

                    <div className="stat-card glass-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <div className="stat-number">{stats.totalSubmissions}</div>
                            <div className="stat-label">Total Submissions</div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="content-grid">
                    {/* Activity Heatmap */}
                    <div className="activity-section glass-card">
                        <div className="section-header">
                            <h2>Activity Heatmap</h2>
                            <p>Last 7 weeks of submissions</p>
                        </div>

                        <div className="heatmap-container">
                            <div className="heatmap-labels">
                                <span>Mon</span>
                                <span>Wed</span>
                                <span>Fri</span>
                            </div>
                            <div className="heatmap-grid">
                                {weeks.map((week, weekIndex) => (
                                    <div key={weekIndex} className="heatmap-week">
                                        {week.map((day, dayIndex) => (
                                            <div
                                                key={dayIndex}
                                                className="heatmap-cell"
                                                style={{ backgroundColor: getActivityColor(day.count) }}
                                                title={`${day.date}: ${day.count} submissions`}
                                            />
                                        ))}
                                    </div>
                                ))}
                            </div>
                            <div className="heatmap-legend">
                                <span>Less</span>
                                <div className="legend-cells">
                                    {[0, 1, 2, 3, 4].map(i => (
                                        <div
                                            key={i}
                                            className="legend-cell"
                                            style={{ backgroundColor: getActivityColor(i) }}
                                        />
                                    ))}
                                </div>
                                <span>More</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress by Difficulty */}
                    <div className="progress-section glass-card">
                        <div className="section-header">
                            <h2>Progress by Difficulty</h2>
                            <p>Track your mastery across levels</p>
                        </div>

                        <div className="progress-bars">
                            {progressData.map((item) => (
                                <div key={item.difficulty} className="progress-item">
                                    <div className="progress-header">
                                        <span className="progress-label">{item.difficulty}</span>
                                        <span className="progress-value">
                                            {item.solved}/{item.total}
                                        </span>
                                    </div>
                                    <div className="progress-bar-container">
                                        <div
                                            className="progress-bar-fill"
                                            style={{
                                                width: `${(item.solved / item.total) * 100}%`,
                                                backgroundColor: item.color
                                            }}
                                        />
                                    </div>
                                    <div className="progress-percentage">
                                        {Math.round((item.solved / item.total) * 100)}% Complete
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="recent-activity glass-card">
                    <div className="section-header">
                        <h2>Recent Submissions</h2>
                        <p>Your latest coding activity</p>
                    </div>

                    <div className="submissions-list">
                        {recentSubmissions && recentSubmissions.map((submission, index) => {
                            const problem = useStore.getState().problems.find(p => p.id === submission.problem_id);
                            return (
                                <div key={index} className="submission-item">
                                    <div className="submission-status">
                                        {submission.status === 'accepted' ? (
                                            <span className="status-badge success">✓ Accepted</span>
                                        ) : (
                                            <span className="status-badge error">✗ Wrong Answer</span>
                                        )}
                                    </div>
                                    <div className="submission-problem">
                                        <h4>{problem?.title || submission.problem_title}</h4>
                                        <span className="submission-meta">
                                            {submission.language} • {new Date(submission.submitted_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="submission-runtime">
                                        {submission.runtime > 0 && `${submission.runtime}ms`}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Daily Goal */}
                <div className="daily-goal glass-card glow-effect">
                    <div className="goal-content">
                        <div className="goal-icon">🎯</div>
                        <div className="goal-text">
                            <h3>Daily Goal</h3>
                            <p>Solve at least 1 problem today to maintain your streak!</p>
                        </div>
                    </div>
                    <button className="btn btn-primary" onClick={() => setView('problems')}>
                        Find a Problem →
                    </button>
                </div>
            </div>
        </div>
    );
}
