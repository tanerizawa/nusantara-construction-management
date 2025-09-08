import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Layout
import MainLayout from './components/Layout/MainLayout';

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
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Auth Routes - No Layout */}
              <Route path="/login" element={<Login />} />
              
              {/* Landing Page - No Layout */}
              <Route path="/" element={<Landing />} />
              
              {/* Main Routes - With Layout */}
              <Route path="/dashboard" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/admin" element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              } />
              <Route path="/finance" element={
                <MainLayout>
                  <Finance />
                </MainLayout>
              } />
              <Route path="/projects" element={
                <MainLayout>
                  <Projects />
                </MainLayout>
              } />
              <Route path="/manpower" element={
                <MainLayout>
                  <Manpower />
                </MainLayout>
              } />
              <Route path="/users" element={
                <MainLayout>
                  <Users />
                </MainLayout>
              } />
              <Route path="/analytics" element={
                <MainLayout>
                  <Analytics />
                </MainLayout>
              } />
              
              {/* Inventory Sub-routes - With Layout */}
              <Route path="/inventory/*" element={
                <MainLayout>
                  <InventoryRoutes />
                </MainLayout>
              } />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
