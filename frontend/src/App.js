import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Contexts
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Import Components
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import NotificationPrompt from './components/NotificationPrompt';
import NotificationToast from './components/Notifications/NotificationToast';
import DeepLinkRouter from './components/DeepLinkRouter';

// Import Utilities
import notificationManager from './utils/notificationManager';

// Import Layout
import MainLayout from './components/Layout/MainLayout';

// Import Auth components (eager load - needed immediately)
import Login from './components/Auth/Login';
import Landing from './pages/Landing';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Finance = lazy(() => import('./pages/finance'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectCreate = lazy(() => import('./pages/ProjectCreate'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ProjectEdit = lazy(() => import('./pages/ProjectEdit'));
const Manpower = lazy(() => import('./pages/Manpower'));
const Users = lazy(() => import('./pages/Users'));
const Analytics = lazy(() => import('./pages/Analytics'));
const NotificationsPage = lazy(() => import('./pages/Notifications'));
const Subsidiaries = lazy(() => import('./pages/Subsidiaries'));
const SubsidiaryCreate = lazy(() => import('./pages/SubsidiaryCreate'));
const SubsidiaryDetail = lazy(() => import('./pages/SubsidiaryDetail'));
const SubsidiaryEdit = lazy(() => import('./pages/SubsidiaryEdit'));
const Approvals = lazy(() => import('./pages/Approvals'));
const Settings = lazy(() => import('./pages/Settings'));
const AdvancedAnalyticsDashboard = lazy(() => import('./components/AdvancedAnalyticsDashboard'));
const OperationalDashboard = lazy(() => import('./pages/OperationalDashboard'));
const CameraGPSTest = lazy(() => import('./pages/CameraGPSTest'));

// Attendance pages
const AttendanceDashboard = lazy(() => import('./pages/AttendanceDashboard'));
const ClockInPage = lazy(() => import('./pages/ClockInPage'));
const ClockOutPage = lazy(() => import('./pages/ClockOutPage'));
const AttendanceSuccess = lazy(() => import('./pages/AttendanceSuccess'));
const AttendanceHistory = lazy(() => import('./pages/AttendanceHistory'));
const MonthlySummary = lazy(() => import('./pages/MonthlySummary'));
const LeaveRequestPage = lazy(() => import('./pages/LeaveRequestPage'));
const AttendanceSettings = lazy(() => import('./pages/AttendanceSettings'));


// Lazy load routes
const AssetRoutes = lazy(() => import('./routes/AssetRoutes'));

// Loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  }}>
    <div style={{
      textAlign: 'center',
      color: 'white'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        border: '4px solid rgba(255, 255, 255, 0.3)',
        borderTop: '4px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }}></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Import styles
import './index.css';

function App() {
  // Initialize notification system when app loads
  useEffect(() => {
    const initializeNotifications = async () => {
      const token = localStorage.getItem('token');
      
      // Only initialize if user is logged in
      if (token) {
        try {
          await notificationManager.initialize();
        } catch (error) {
          console.error('Failed to initialize notifications:', error);
        }
      }
    };

    initializeNotifications();

    // Cleanup on unmount
    return () => {
      // Notification manager cleanup happens on logout
    };
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <div className="App">
                {/* Notification Prompt - Shows after login */}
                <NotificationPrompt />
                
                {/* Notification Toast - In-app notifications */}
                <NotificationToast />
                
                {/* Deep Link Router - Handles app:// URLs */}
                <DeepLinkRouter />
                
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
                    <Approvals />
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
              <Route path="/settings/*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <Settings />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Notifications Page */}
              <Route path="/notifications" element={
                <ProtectedRoute>
                  <MainLayout>
                    <NotificationsPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Operational Dashboard - Admin Only */}
              <Route path="/operations" element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <OperationalDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Asset Management Sub-routes - With Layout */}
              <Route path="/assets/*" element={
                <ProtectedRoute>
                  <MainLayout>
                    <AssetRoutes />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
              {/* Attendance Routes */}
              <Route path="/attendance" element={
                <ProtectedRoute>
                  <MainLayout>
                    <AttendanceDashboard />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/attendance/clock-in" element={
                <ProtectedRoute>
                  <ClockInPage />
                </ProtectedRoute>
              } />
              <Route path="/attendance/clock-out" element={
                <ProtectedRoute>
                  <ClockOutPage />
                </ProtectedRoute>
              } />
              <Route path="/attendance/success" element={
                <ProtectedRoute>
                  <AttendanceSuccess />
                </ProtectedRoute>
              } />
              <Route path="/attendance/history" element={
                <ProtectedRoute>
                  <MainLayout>
                    <AttendanceHistory />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/attendance/summary" element={
                <ProtectedRoute>
                  <MainLayout>
                    <MonthlySummary />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/attendance/leave-request" element={
                <ProtectedRoute>
                  <MainLayout>
                    <LeaveRequestPage />
                  </MainLayout>
                </ProtectedRoute>
              } />
              <Route path="/attendance/settings" element={
                <ProtectedRoute roles={['admin']}>
                  <MainLayout>
                    <AttendanceSettings />
                  </MainLayout>
                </ProtectedRoute>
              } />
              
                {/* Test Route - Camera & GPS Testing */}
                <Route path="/test/camera-gps" element={<CameraGPSTest />} />
                
              </Routes>
            </div>
          </Suspense>
        </Router>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;