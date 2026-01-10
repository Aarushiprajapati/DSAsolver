import { useStore } from '../store';
import './Header.css';

export default function Header() {
    const { user, isAuthenticated, logout, setView, currentView } = useStore();

    return (
        <header className="app-header">
            <div className="header-container">
                <div className="logo" onClick={() => setView(isAuthenticated ? 'dashboard' : 'landing')}>
                    <div className="logo-icon">{'<>'}</div>
                    <div className="logo-text">
                        <h1>DSASolver</h1>
                        <span className="tagline">Practice. Track. Master.</span>
                    </div>
                </div>

                <nav className="nav-links">
                    {isAuthenticated && (
                        <>
                            <button
                                className={`nav-link ${currentView === 'dashboard' ? 'active' : ''}`}
                                onClick={() => setView('dashboard')}
                            >
                                <span className="nav-icon">📊</span>
                                Dashboard
                            </button>
                            <button
                                className={`nav-link ${currentView === 'problems' ? 'active' : ''}`}
                                onClick={() => setView('problems')}
                            >
                                <span className="nav-icon">💻</span>
                                Problems
                            </button>
                            <button
                                className={`nav-link ${currentView === 'profile' ? 'active' : ''}`}
                                onClick={() => setView('profile')}
                            >
                                <span className="nav-icon">👤</span>
                                Profile
                            </button>
                        </>
                    )}
                </nav>

                <div className="header-actions">
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <div className="user-avatar">
                                <img src={user.avatar} alt={user.name} />
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user.name}</span>
                                <span className="user-streak">🔥 {user.stats.currentStreak} day streak</span>
                            </div>
                            <button onClick={logout} className="btn btn-ghost btn-sm logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button className="btn btn-primary" onClick={() => setView('landing')}>
                            Get Started
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
