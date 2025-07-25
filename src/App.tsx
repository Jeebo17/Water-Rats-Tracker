import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Sessions from './components/Sessions';
// import Leaders from './components/Leaders';
import Destinations from './components/Destinations';
import Finances from './components/Finances';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="sessions" element={<Sessions />} />
          {/* <Route path="leaders" element={<Leaders />} /> */}
          <Route path="destinations" element={<Destinations />} />
          <Route path="finances" element={<Finances />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;