import { useStore } from '../store';
import './Landing.css';

export default function Landing() {
    const { loginWithGoogle, authError } = useStore();

    const handleLogin = async () => {
        try {
            await loginWithGoogle();
        } catch (error) {
            // Error is handled in store and displayed below
        }
    };

    return (
        <div className="landing-page">
            <div className="hero-section">
                <div className="hero-background">
                    <div className="gradient-orb orb-1"></div>
                    <div className="gradient-orb orb-2"></div>
                    <div className="gradient-orb orb-3"></div>
                </div>

                <div className="hero-content">
                    <div className="hero-badge">
                        <span className="badge-icon">✨</span>
                        <span>Master DSA with Daily Practice</span>
                    </div>

                    <h1 className="hero-title">
                        Master Data Structures
                        <br />
                        <span className="gradient-text">& Algorithms</span>
                    </h1>

                    <p className="hero-subtitle">
                        Solve curated problems, track your progress with detailed analytics,
                        <br />
                        and build a daily coding habit that sticks.
                    </p>

                    <div className="hero-cta">
                        <button onClick={handleLogin} className="btn btn-primary btn-lg glow-effect">
                            <span>🚀</span>
                            Start Practicing Free
                        </button>
                        <button className="btn btn-secondary btn-lg" onClick={() => useStore.getState().setView('problems')}>
                            <span>📖</span>
                            View Problems
                        </button>
                    </div>

                    {authError && (
                        <div className="auth-error-message">
                            ⚠️ {authError}
                            <p className="auth-error-hint">Please check your Firebase configuration in .env and make sure you have a valid API Key.</p>
                        </div>
                    )}

                    <div className="hero-stats">
                        <div className="stat-item">
                            <div className="stat-number">500+</div>
                            <div className="stat-label">Curated Problems</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">50K+</div>
                            <div className="stat-label">Active Users</div>
                        </div>
                        <div className="stat-divider"></div>
                        <div className="stat-item">
                            <div className="stat-number">1M+</div>
                            <div className="stat-label">Solutions Submitted</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="features-section">
                <h2 className="section-title">Everything You Need to Excel</h2>
                <p className="section-subtitle">Powerful features designed to accelerate your learning</p>

                <div className="features-grid">
                    <div className="feature-card glass-card">
                        <div className="feature-icon">🎯</div>
                        <h3>Topic-wise Practice</h3>
                        <p>Master concepts with problems organized by data structures and algorithms</p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">💻</div>
                        <h3>Premium Code Editor</h3>
                        <p>Write code with syntax highlighting, autocomplete, and multiple language support</p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">⚡</div>
                        <h3>Instant Feedback</h3>
                        <p>Run your code against test cases and get immediate results with detailed metrics</p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">📊</div>
                        <h3>Performance Analytics</h3>
                        <p>Track your progress with detailed charts, heatmaps, and performance insights</p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">🔥</div>
                        <h3>Daily Streaks</h3>
                        <p>Build consistency with streak tracking and daily challenge reminders</p>
                    </div>

                    <div className="feature-card glass-card">
                        <div className="feature-icon">🏆</div>
                        <h3>Achievement System</h3>
                        <p>Unlock badges and milestones as you progress through your coding journey</p>
                    </div>
                </div>
            </div>

            <div className="cta-section">
                <div className="cta-card glass-card glow-effect">
                    <h2>Ready to Level Up Your Skills?</h2>
                    <p>Join thousands of developers mastering DSA every day</p>
                    <button onClick={handleLogin} className="btn btn-primary btn-lg">
                        Get Started Now →
                    </button>
                </div>
            </div>
        </div>
    );
}
