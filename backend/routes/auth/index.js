const express = require('express');
const router = express.Router();

/**
 * ============================================================================
 * AUTH MODULE - Route Aggregator (PRIVATE INTERNAL SYSTEM)
 * ============================================================================
 * 
 * This module consolidates authentication and user management endpoints
 * previously scattered across auth.js, users.js, and users_db.js
 * 
 * IMPORTANT: This is a PRIVATE internal system!
 * - NO public user registration
 * - Only admins can create new users
 * - All user management requires admin authentication
 * 
 * CHANGES FROM ORIGINAL:
 * - Eliminated duplication between users.js and users_db.js (100% identical)
 * - Unified login endpoint (was in both auth.js and users.js)
 * - Consolidated user management under /api/auth/users
 * - Added logout and refresh-token endpoints
 * - Added username/email availability checks (admin-only)
 * - Protected registration endpoints with admin authentication
 * 
 * ENDPOINTS: 12 total
 * - Authentication: 4 endpoints (login [public], me, logout, refresh-token)
 * - User Management: 5 endpoints (ADMIN ONLY - list, get, create, update, delete)
 * - Registration: 3 endpoints (ADMIN ONLY - register, check-username, check-email)
 * 
 * ACCESS CONTROL:
 * - Public: login
 * - Authenticated: me, logout, refresh-token
 * - Admin Only: all user management and registration endpoints
 * 
 * FILES REPLACED:
 * - backend/routes/auth.js (194 lines, 3 endpoints)
 * - backend/routes/users.js (349 lines, 6 endpoints)
 * - backend/routes/users_db.js (349 lines, 6 endpoints - duplicate)
 * 
 * NEW STRUCTURE:
 * - backend/routes/auth/index.js (this file)
 * - backend/routes/auth/authentication.routes.js (~290 lines, 4 endpoints)
 * - backend/routes/auth/user-management.routes.js (~270 lines, 5 endpoints - admin only)
 * - backend/routes/auth/registration.routes.js (~140 lines, 3 endpoints - admin only)
 * 
 * RESULT:
 * - 892 lines → 750 lines (eliminate 350 lines of duplication)
 * - 15 endpoints → 12 unique endpoints (eliminate duplicate login)
 * - Clear separation of concerns
 * - Proper access control (admin-only for user management)
 * - Consistent with Phase 1 modularization pattern
 * ============================================================================
 */

// Import modular route files
const authenticationRoutes = require('./authentication.routes');
const userManagementRoutes = require('./user-management.routes');
const registrationRoutes = require('./registration.routes');

// ============================================================================
// MOUNT ROUTES
// ============================================================================

// IMPORTANT: Health check MUST come before registration routes
// because registration has router.post('/') that catches everything

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth module is healthy',
    modules: {
      authentication: 'loaded',
      userManagement: 'loaded',
      registration: 'loaded'
    },
    endpoints: {
      authentication: 4,
      userManagement: 5,
      registration: 3,
      total: 12
    }
  });
});

// User management endpoints: CRUD operations
// Routes: /api/auth/users, /api/auth/users/:id
router.use('/users', userManagementRoutes);

// Authentication endpoints: login, me, logout, refresh-token
// Routes: /api/auth/login, /api/auth/me, /api/auth/logout, /api/auth/refresh-token
router.use('/', authenticationRoutes);

// Registration endpoints: register, check availability (ADMIN ONLY - Internal use)
// Routes: /api/auth/register, /api/auth/check-username, /api/auth/check-email
// Note: These require admin authentication, use POST /api/auth/users for user creation
router.use('/', registrationRoutes); // Mount at root AFTER authentication routes

// ============================================================================
// EXPORT
// ============================================================================

module.exports = router;
