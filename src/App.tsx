import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
import Leaders from './components/Leaders';
import Finances from './components/Finances';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { login } from './firebase/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogin = async (password: string) => {
    setLoginLoading(true);
    setLoginError('');

    try {
      await login(password);
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

  if (!isAuthenticated) {
    return (
      <Login 
        onLogin={handleLogin}
        error={loginError}
        loading={loginLoading}
      />
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="leaders" element={<Leaders />} />
          {/* <Route path="destinations" element={<Destinations />} /> */}
          <Route path="finances" element={<Finances />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;