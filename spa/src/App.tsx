import { useAuth0 } from '@auth0/auth0-react';
import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';
import Profile from './Profile';

function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div className="app-container">
        <div className="loading-state">
          <div className="loading-text">Loading...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app-container">
        <div className="error-state">
          <div className="error-title">Oops!</div>
          <div className="error-message">Something went wrong</div>
          <div className="error-sub-message">{error.message}</div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="app-container">
        <div className="main-card-wrapper">
          <h1 className="main-title">ApplyFlow</h1>
          <p className="main-subtitle">Manage your job applications with ease</p>
          <div className="action-card" style={{ marginTop: '2rem' }}>
            <Profile />
          </div>
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <LogoutButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="main-card-wrapper">
        <h1 className="main-title">ApplyFlow</h1>
        <p className="main-subtitle">Manage your job applications with ease</p>
        <div className="action-card">
          <p className="action-text">Sign in to get started tracking your job applications</p>
          <LoginButton />
        </div>
      </div>
    </div>
  );
}

export default App;