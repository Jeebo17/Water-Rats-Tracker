import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Login from './pages/LoginPage';
import Dashboard from './components/Dashboard';
import Sessions from './pages/SessionsPage';
import Leaders from './pages/LeaderPage';
import PublicPage from './pages/PublicPage';
import ChangeLogPage from './pages/ChangeLogPage';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { getStoredDisplayName, login } from './util/auth';
import DynamicForm from './components/DynamicForm';
import formsData  from './data/forms.json';
const forms = formsData as any[];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const storedDisplayName = getStoredDisplayName().trim();

      if (user && !storedDisplayName) {
        signOut(auth).catch((error) => {
          console.error('Error signing out session without display name:', error);
        });
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      setIsAuthenticated(!!user && !!storedDisplayName);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const hasStoredDisplayName = !!getStoredDisplayName().trim();
  const canAccessApp = isAuthenticated && hasStoredDisplayName;

  const handleLogin = async (password: string, displayName: string) => {
    setLoginLoading(true);
    setLoginError('');

    try {
      await login(password, displayName);
    } catch (error: any) {
      console.error('LOGIN ERROR:', error);
      setLoginError(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route
          path="/register-interest"
          element={
            <PublicPage>
              <DynamicForm
                form={forms.find(f => f.id === '2026-volunteer-register-interest')!}
              />
            </PublicPage>
          }
        />

        {/* Login route */}
        <Route
          path="/login"
          element={canAccessApp ? <Navigate to="/" /> : <Login onLogin={handleLogin} error={loginError} loading={loginLoading} />}
        />

        {/* Authenticated routes */}
        {canAccessApp && (
          <Route path="/" element={<Header />}>
            <Route index element={<Dashboard />} />
            <Route path="sessions" element={<Sessions />} />
            <Route path="leaders" element={<Leaders />} />
            <Route path="changelog" element={<ChangeLogPage />} />
          </Route>
        )}

        {/* Catch-all: redirect non-authenticated users to login */}
        {!canAccessApp && <Route path="*" element={<Navigate to="/login" />} />}
      </Routes>
    </Router>
  );
}

export default App;