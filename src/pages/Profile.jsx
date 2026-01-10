import { useStore } from '../store';
import './Profile.css';

export default function Profile() {
    const { user } = useStore();

    if (!user) return null;

    const { stats } = user;
    const joinDate = new Date(user.joinedDate).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    const achievements = [
        { id: 1, icon: '🎯', title: 'First Steps', description: 'Solved your first problem', unlocked: true },
        { id: 2, icon: '🔥', title: 'Week Warrior', description: '7 day streak', unlocked: stats.currentStreak >= 7 },
        { id: 3, icon: '💯', title: 'Century', description: 'Solved 100 problems', unlocked: stats.totalSolved >= 100 },
        { id: 4, icon: '⚡', title: 'Speed Demon', description: 'Solved 10 problems in one day', unlocked: false },
        { id: 5, icon: '🏆', title: 'Master', description: 'Solved 50 hard problems', unlocked: false },
        { id: 6, icon: '🌟', title: 'Consistent', description: '30 day streak', unlocked: stats.longestStreak >= 30 }
    ];

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header */}
                <div className="profile-header glass-card">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-large">
                            <img src={user.avatar} alt={user.name} />
                        </div>
                        <div className="profile-info">
                            <h1>{user.name}</h1>
                            <p className="profile-email">{user.email}</p>
                            <p className="profile-joined">Member since {joinDate}</p>
                        </div>
                    </div>

                    <div className="profile-stats-summary">
                        <div className="summary-stat">
                            <div className="summary-number">{stats.totalSolved}</div>
                            <div className="summary-label">Solved</div>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-stat">
                            <div className="summary-number">{stats.currentStreak}</div>
                            <div className="summary-label">Streak</div>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-stat">
                            <div className="summary-number">{stats.totalSubmissions}</div>
                            <div className="summary-label">Submissions</div>
                        </div>
                    </div>
                </div>

                {/* Detailed Stats */}
                <div className="stats-section">
                    <h2>Problem Solving Stats</h2>
                    <div className="detailed-stats-grid">
                        <div className="detailed-stat-card glass-card">
                            <div className="stat-circle easy">
                                <span className="circle-number">{stats.easySolved}</span>
                            </div>
                            <h3>Easy Problems</h3>
                            <p>Great foundation building!</p>
                        </div>

                        <div className="detailed-stat-card glass-card">
                            <div className="stat-circle medium">
                                <span className="circle-number">{stats.mediumSolved}</span>
                            </div>
                            <h3>Medium Problems</h3>
                            <p>Solid progress!</p>
                        </div>

                        <div className="detailed-stat-card glass-card">
                            <div className="stat-circle hard">
                                <span className="circle-number">{stats.hardSolved}</span>
                            </div>
                            <h3>Hard Problems</h3>
                            <p>Impressive work!</p>
                        </div>

                        <div className="detailed-stat-card glass-card">
                            <div className="stat-circle streak">
                                <span className="circle-number">{stats.longestStreak}</span>
                            </div>
                            <h3>Longest Streak</h3>
                            <p>Keep it going!</p>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                <div className="achievements-section">
                    <h2>Achievements</h2>
                    <div className="achievements-grid">
                        {achievements.map(achievement => (
                            <div
                                key={achievement.id}
                                className={`achievement-card glass-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                            >
                                <div className="achievement-icon">{achievement.icon}</div>
                                <h3>{achievement.title}</h3>
                                <p>{achievement.description}</p>
                                {achievement.unlocked && (
                                    <div className="achievement-badge">Unlocked ✓</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Summary */}
                <div className="activity-summary glass-card">
                    <h2>Activity Summary</h2>
                    <div className="activity-stats">
                        <div className="activity-item">
                            <span className="activity-label">Total Problems Attempted</span>
                            <span className="activity-value">{stats.totalSubmissions}</span>
                        </div>
                        <div className="activity-item">
                            <span className="activity-label">Success Rate</span>
                            <span className="activity-value">
                                {stats.totalSubmissions > 0
                                    ? Math.round((stats.totalSolved / stats.totalSubmissions) * 100)
                                    : 0}%
                            </span>
                        </div>
                        <div className="activity-item">
                            <span className="activity-label">Average Daily Problems</span>
                            <span className="activity-value">
                                {(stats.totalSolved / 30).toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
