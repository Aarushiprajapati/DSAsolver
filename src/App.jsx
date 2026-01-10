import { useEffect } from 'react';
import { useStore } from './store';
import Header from './components/Header';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Problems from './pages/Problems';
import Workspace from './pages/Workspace';
import Profile from './pages/Profile';
import './App.css';

function App() {
  const { currentView, isAuthenticated, initializeAuth, authLoading } = useStore();

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  if (authLoading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {currentView === 'landing' && <Landing />}
        {currentView === 'dashboard' && isAuthenticated && <Dashboard />}
        {currentView === 'problems' && <Problems />}
        {currentView === 'workspace' && <Workspace />}
        {currentView === 'profile' && isAuthenticated && <Profile />}
      </main>
    </div>
  );
}

export default App;
