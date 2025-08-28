import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppStateProvider } from './context/AppStateContext';
import { ThemeProvider } from './context/ThemeContext';

// Components
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Breadcrumbs from './components/Layout/Breadcrumbs';
import Login from './components/Auth/Login';

// Performance utilities
import { LoadingSpinner, ErrorBoundary } from './utils/performance';

// Pages - Core (Eager loading for critical pages)
import Dashboard from './components/Dashboard';
import Landing from './pages/Landing';

// Import pages directly to avoid lazy loading issues  
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Inventory from './pages/Inventory';
import Manpower from './pages/Manpower';
import Finance from './pages/Finance';
import Tax from './pages/Tax';
import Users from './pages/Users';
import Analytics from './pages/Analytics';

// Phase 3 Components - Lazy loaded
const WarehouseManagement = React.lazy(() => import('./components/WarehouseManagement'));
const CategoryManagement = React.lazy(() => import('./components/CategoryManagement'));
const PurchaseOrderManagement = React.lazy(() => import('./components/PurchaseOrderManagement'));
const SupplierPerformance = React.lazy(() => import('./components/SupplierPerformance'));
const ReorderAlerts = React.lazy(() => import('./components/ReorderAlerts'));
const StockOpname = React.lazy(() => import('./components/StockOpname'));
const CostAllocation = React.lazy(() => import('./components/CostAllocation'));

// Phase 4-6 Components - Lazy loaded
const AttendancePayroll = React.lazy(() => import('./components/AttendancePayroll'));
const PerformanceAnalytics = React.lazy(() => import('./components/PerformanceAnalytics'));

// Layout Component
const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-slate-900 transition-colors duration-200">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        {/* Content area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
          <div className="p-6 min-h-screen">
            <Breadcrumbs />
            <main className="mt-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin" element={user ? <Navigate to="/admin/dashboard" /> : <Navigate to="/login" />} />
      <Route path="/admin/*" element={
        user ? (
          <Layout>
            <Routes>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:id" element={<ProjectDetail />} />
              <Route path="inventory" element={<Inventory />} />
              <Route path="inventory/suppliers" element={<Inventory />} />
              <Route path="inventory/orders" element={<Inventory />} />
              
              {/* Phase 3 Week 5 - Core Inventory Features */}
              <Route path="inventory/warehouses" element={<WarehouseManagement />} />
              <Route path="inventory/categories" element={<CategoryManagement />} />
              <Route path="inventory/purchase-orders" element={<PurchaseOrderManagement />} />
              
              {/* Phase 3 Week 6 - Advanced Inventory Features */}
              <Route path="inventory/supplier-performance" element={<SupplierPerformance />} />
              <Route path="inventory/reorder-alerts" element={<ReorderAlerts />} />
              <Route path="inventory/stock-opname" element={<StockOpname />} />
              <Route path="inventory/cost-allocation" element={<CostAllocation />} />
              
              {/* Phase 4 Week 7-8 - Manpower Management Module */}
              <Route path="manpower" element={<Manpower />} />
              <Route path="manpower/attendance" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <AttendancePayroll />
                </Suspense>
              } />
              <Route path="manpower/performance-analytics" element={
                <Suspense fallback={<LoadingSpinner />}>
                  <PerformanceAnalytics />
                </Suspense>
              } />
              
              {/* Phase 5 - Finance Management Module */}
              <Route path="finance" element={<Finance />} />
              
              {/* Phase 6 - Tax Management Module */}
              <Route path="tax" element={<Tax />} />
              
              {/* Analytics Page */}
              <Route path="analytics" element={<Analytics />} />
              
              <Route path="users" element={<Users />} />
              <Route path="*" element={<Navigate to="/admin/dashboard" />} />
            </Routes>
          </Layout>
        ) : (
          <Navigate to="/login" />
        )
      } />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AppStateProvider>
          <AuthProvider>
            <Router 
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true
              }}
            >
              <div className="App">
                <AppContent />
                <Toaster position="top-right" />
              </div>
            </Router>
          </AuthProvider>
        </AppStateProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
