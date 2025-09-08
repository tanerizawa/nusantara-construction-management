import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Auth Context
import { AuthProvider } from './context/AuthContext';

// Import Auth components
import Login from './components/Auth/Login';

// Import pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Projects from './pages/Projects';
import Manpower from './pages/Manpower';
import Users from './pages/Users';
import Analytics from './pages/Analytics';

// Import routes
import InventoryRoutes from './routes/InventoryRoutes';

// Import styles
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Main Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/finance" element={<Finance />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/manpower" element={<Manpower />} />
            <Route path="/users" element={<Users />} />
            <Route path="/analytics" element={<Analytics />} />
            
            {/* Inventory Sub-routes */}
            <Route path="/inventory/*" element={<InventoryRoutes />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
