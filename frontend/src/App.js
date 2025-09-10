import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';

// Import Layout
import MainLayout from './components/Layout/MainLayout';

// Import Auth components
import Login from './components/Auth/Login';

// Import pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Finance from './pages/Finance';
import Projects from './pages/Projects';
import ProjectCreate from './pages/ProjectCreate';
import ProjectDetail from './pages/ProjectDetail';
import ProjectEdit from './pages/ProjectEdit';
import Manpower from './pages/Manpower';
import Users from './pages/Users';
import Analytics from './pages/Analytics';
import Subsidiaries from './pages/Subsidiaries';
import SubsidiaryCreate from './pages/SubsidiaryCreate';
import SubsidiaryDetail from './pages/SubsidiaryDetail';
import SubsidiaryEdit from './pages/SubsidiaryEdit';
import Approvals from './pages/Approvals';
import ApprovalTest from './pages/ApprovalTest';
import ApprovalFixed from './pages/ApprovalFixed';
import Settings from './pages/Settings';
import ApprovalDashboard from './components/ApprovalDashboard';
import AdvancedAnalyticsDashboard from './components/AdvancedAnalyticsDashboard';

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
              
              {/* Protected Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Dashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/finance" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Finance />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Projects />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/approval" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ApprovalDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/approvals" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Approvals />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/approval-test" element={
                <ApprovalTest />
              } />
              <Route path="/approval-fixed" element={
                <ApprovalFixed />
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <MainLayout>
                    <AdvancedAnalyticsDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/projects/create" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectCreate />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/projects/:id" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectDetail />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/projects/:id/edit" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectEdit />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/projects" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Projects />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/projects/create" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectCreate />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/projects/:id" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectDetail />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/admin/projects/:id/edit" element={
                <ProtectedRoute>
                  <MainLayout>
                    <ProjectEdit />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/manpower" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Manpower />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <Users />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Analytics />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/subsidiaries" element={
                <MainLayout>
                  <Subsidiaries />
                </MainLayout>
              } />
              <Route path="/subsidiaries/create" element={
                <MainLayout>
                  <SubsidiaryCreate />
                </MainLayout>
              } />
              <Route path="/subsidiaries/:id" element={
                <MainLayout>
                  <SubsidiaryDetail />
                </MainLayout>
              } />
              <Route path="/subsidiaries/:id/edit" element={
                <MainLayout>
                  <SubsidiaryEdit />
                </MainLayout>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
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
