import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';

/**
 * PROTECTED ROUTE COMPONENT
 * Implements authentication-based route protection
 */
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('🔐 ProtectedRoute: No user, redirecting to /login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // DEBUG: Log role check
  console.log('🔐 ProtectedRoute Debug:', {
    path: location.pathname,
    userRole: user?.role,
    requiredRoles: roles,
    hasAccess: roles.length === 0 || roles.includes(user?.role),
    willRedirect: roles.length > 0 && !roles.includes(user?.role)
  });

  // Check role-based access if roles are specified
  if (roles.length > 0 && !roles.includes(user.role)) {
    console.warn('❌ ProtectedRoute: Access denied. User role:', user.role, 'Required:', roles);
    // Redirect to dashboard instead of landing page for authenticated users
    return <Navigate to="/dashboard" replace />;
  }

  console.log('✅ ProtectedRoute: Access granted for', location.pathname);

  return children;
};

export default ProtectedRoute;
