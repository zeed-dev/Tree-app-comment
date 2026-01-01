import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginForm } from './components/Auth/LoginForm';
import { RegisterForm } from './components/Auth/RegisterForm';
import { CalculationTree } from './components/CalculationTree/CalculationTree';
import './App.css';

function AppContent() {
  const [authMode, setAuthMode] = useState<'login' | 'register' | null>(null);
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Calculation Tree</h1>
        <div className="user-info">
          {isAuthenticated ? (
            <>
              <span>Welcome, {user?.username}</span>
              <button onClick={logout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <div className="auth-buttons">
              <button 
                onClick={() => setAuthMode('login')}
                className="auth-button"
              >
                Login
              </button>
              <button 
                onClick={() => setAuthMode('register')}
                className="auth-button register-button"
              >
                Register
              </button>
            </div>
          )}
      </div>
      </header>
      <main>
        {authMode !== null && (
          <div className="auth-modal" onClick={() => setAuthMode(null)}>
            <div className="auth-modal-content" onClick={(e) => e.stopPropagation()}>
              <button 
                className="close-button"
                onClick={() => setAuthMode(null)}
              >
                ×
        </button>
              {authMode === 'login' ? (
                <LoginForm 
                  onSwitchToRegister={() => setAuthMode('register')}
                  onSuccess={() => setAuthMode(null)}
                />
              ) : (
                <RegisterForm 
                  onSwitchToLogin={() => setAuthMode('login')}
                  onSuccess={() => setAuthMode(null)}
                />
              )}
            </div>
          </div>
        )}
        <CalculationTree />
      </main>
      </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Error boundary untuk debug
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
  });
  window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
  });
}

export default App;
