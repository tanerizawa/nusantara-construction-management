/**
 * Berita Acara RBAC Middleware
 * Role-Based Access Control for BA operations
 */

const BeritaAcara = require('../models/BeritaAcara');

// Permission matrix per role
const BA_PERMISSIONS = {
  'admin': {
    create: true,
    read: true,
    update: true,
    delete: true,
    submit: true,
    approve: true,
    reject: true,
    clientSign: false
  },
  'project_manager': {
    create: true,
    read: true,
    update: true,
    delete: true,     // Only own draft/rejected BA
    submit: true,
    approve: false,
    reject: false,
    clientSign: false
  },
  'site_manager': {
    create: true,
    read: true,
    update: true,     // Only own BA
    delete: false,
    submit: true,
    approve: false,
    reject: false,
    clientSign: false
  },
  'client': {
    create: false,
    read: true,
    update: false,
    delete: false,
    submit: false,
    approve: true,
    reject: true,
    clientSign: true
  },
  'finance_manager': {
    create: false,
    read: true,
    update: false,
    delete: false,
    submit: false,
    approve: false,
    reject: false,
    clientSign: false
  },
  'viewer': {
    create: false,
    read: true,
    update: false,
    delete: false,
    submit: false,
    approve: false,
    reject: false,
    clientSign: false
  }
};

/**
 * Check if user has permission for specific BA action
 */
const checkBAPermission = (action) => {
  return async (req, res, next) => {
    try {
      // Get user from request (populated by auth middleware)
      const user = req.user;
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      // Get user role (default to viewer if not set)
      const userRole = user.role || 'viewer';
      const permissions = BA_PERMISSIONS[userRole];

      if (!permissions) {
        return res.status(403).json({
          success: false,
          error: 'Invalid user role'
        });
      }

      // Check basic permission
      if (!permissions[action]) {
        return res.status(403).json({
          success: false,
          error: `Insufficient permissions: ${userRole} cannot ${action} BA`
        });
      }

      // Additional checks for specific actions
      if (action === 'update' || action === 'delete') {
        const { baId } = req.params;
        
        if (baId) {
          const ba = await BeritaAcara.findByPk(baId);
          
          if (!ba) {
            return res.status(404).json({
              success: false,
              error: 'Berita Acara not found'
            });
          }

          // Check ownership for non-admin users
          if (userRole !== 'admin' && userRole !== 'client') {
            if (action === 'update' && ba.createdBy !== user.email) {
              return res.status(403).json({
                success: false,
                error: 'Can only update own Berita Acara'
              });
            }

            if (action === 'delete') {
              // Only allow delete of draft or rejected BA
              if (ba.status === 'approved') {
                return res.status(403).json({
                  success: false,
                  error: 'Cannot delete approved Berita Acara'
                });
              }

              // Check ownership
              if (ba.createdBy !== user.email) {
                return res.status(403).json({
                  success: false,
                  error: 'Can only delete own Berita Acara'
                });
              }
            }
          }
        }
      }

      // Store permission info in request for use in route handler
      req.baPermission = {
        role: userRole,
        action: action,
        allowed: true
      };

      next();
    } catch (error) {
      console.error('BA Permission Check Error:', error);
      return res.status(500).json({
        success: false,
        error: 'Permission check failed',
        details: error.message
      });
    }
  };
};

/**
 * Check if user can access specific project's BA
 */
const checkProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const user = req.user;

    // Admin can access all projects
    if (user.role === 'admin') {
      return next();
    }

    // Check if user is part of project team
    const Project = require('../models/Project');
    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    // Check project membership (simplified - enhance based on your Project model)
    const hasAccess = project.projectManagerId === user.id || 
                      project.clientId === user.id ||
                      (project.teamMembers && project.teamMembers.includes(user.id));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'No access to this project'
      });
    }

    next();
  } catch (error) {
    console.error('Project Access Check Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Access check failed',
      details: error.message
    });
  }
};

module.exports = {
  checkBAPermission,
  checkProjectAccess,
  BA_PERMISSIONS
};
