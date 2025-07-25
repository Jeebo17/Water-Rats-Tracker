import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
import Instructors from './components/Instructors';
import Destinations from './components/Destinations';
import Finances from './components/Finances';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="instructors" element={<Instructors />} />
          <Route path="destinations" element={<Destinations />} />
          <Route path="finances" element={<Finances />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;