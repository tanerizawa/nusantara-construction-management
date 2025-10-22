const express = require('express');
const jwt = require('jsonwebtoken');
const auditService = require('../../services/auditService');
const { Parser } = require('json2csv');

const router = express.Router();

/**
 * Middleware to check admin role
 */
function requireAdmin(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    
    // Check if user is admin
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        error: 'Access denied. Admin role required.'
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid token'
    });
  }
}

/**
 * @route   GET /api/audit/logs
 * @desc    Get audit logs with filtering and pagination
 * @access  Admin
 */
router.get('/logs', requireAdmin, async (req, res) => {
  try {
    const {
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      limit = 50,
      offset = 0,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = req.query;

    const result = await auditService.getAuditLogs({
      userId,
      action,
      entityType,
      entityId,
      startDate,
      endDate,
      limit,
      offset,
      sortBy,
      sortOrder
    });

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit logs',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/logs/:id
 * @desc    Get specific audit log by ID
 * @access  Admin
 */
router.get('/logs/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const log = await auditService.getAuditLogById(id);

    if (!log) {
      return res.status(404).json({
        success: false,
        error: 'Audit log not found'
      });
    }

    res.json({
      success: true,
      data: log
    });
  } catch (error) {
    console.error('Get audit log error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get audit log',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/entity-history/:entityType/:entityId
 * @desc    Get complete history of changes for a specific entity
 * @access  Admin
 */
router.get('/entity-history/:entityType/:entityId', requireAdmin, async (req, res) => {
  try {
    const { entityType, entityId } = req.params;
    const { limit = 20 } = req.query;

    const history = await auditService.getEntityHistory(entityType, entityId, limit);

    res.json({
      success: true,
      data: {
        entityType,
        entityId,
        history,
        count: history.length
      }
    });
  } catch (error) {
    console.error('Get entity history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get entity history',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/user-activity/:userId
 * @desc    Get activity summary for a specific user
 * @access  Admin
 */
router.get('/user-activity/:userId', requireAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { days = 30 } = req.query;

    const activity = await auditService.getUserActivity(userId, parseInt(days));

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Get user activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get user activity',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/system-activity
 * @desc    Get overall system activity summary
 * @access  Admin
 */
router.get('/system-activity', requireAdmin, async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const activity = await auditService.getSystemActivity(parseInt(days));

    res.json({
      success: true,
      data: activity
    });
  } catch (error) {
    console.error('Get system activity error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system activity',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/export
 * @desc    Export audit logs to CSV
 * @access  Admin
 */
router.get('/export', requireAdmin, async (req, res) => {
  try {
    const {
      userId,
      action,
      entityType,
      startDate,
      endDate,
      format = 'csv'
    } = req.query;

    // Get all matching logs (no limit for export)
    const result = await auditService.getAuditLogs({
      userId,
      action,
      entityType,
      startDate,
      endDate,
      limit: 10000,
      offset: 0
    });

    // Log the export action
    await auditService.logExport({
      userId: req.user.id,
      username: req.user.username,
      entityType: 'audit_logs',
      format,
      filters: { userId, action, entityType, startDate, endDate },
      req
    });

    if (format === 'csv') {
      // Convert to CSV
      const fields = [
        'id',
        'userId',
        'username',
        'action',
        'entityType',
        'entityId',
        'entityName',
        'ipAddress',
        'method',
        'endpoint',
        'statusCode',
        'duration',
        'createdAt'
      ];

      const parser = new Parser({ fields });
      const csv = parser.parse(result.logs);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${Date.now()}.csv`);
      res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        data: result
      });
    }
  } catch (error) {
    console.error('Export audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to export audit logs',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/actions
 * @desc    Get list of available actions for filtering
 * @access  Admin
 */
router.get('/actions', requireAdmin, async (req, res) => {
  try {
    const actions = ['CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'VIEW', 'EXPORT', 'IMPORT'];
    
    res.json({
      success: true,
      data: actions
    });
  } catch (error) {
    console.error('Get actions error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get actions',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/audit/entity-types
 * @desc    Get list of available entity types for filtering
 * @access  Admin
 */
router.get('/entity-types', requireAdmin, async (req, res) => {
  try {
    // You can make this dynamic by querying distinct entityType from database
    const entityTypes = [
      'user',
      'project',
      'subsidiary',
      'chart_of_accounts',
      'finance',
      'manpower',
      'tax',
      'report',
      'analytics',
      'notification',
      'purchase_order',
      'work_order',
      'invoice',
      'milestone',
      'database',
      'auth'
    ];
    
    res.json({
      success: true,
      data: entityTypes
    });
  } catch (error) {
    console.error('Get entity types error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get entity types',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/audit/cleanup
 * @desc    Clean up old audit logs (retention policy)
 * @access  Admin
 */
router.post('/cleanup', requireAdmin, async (req, res) => {
  try {
    const { retentionDays = 90 } = req.body;

    const deletedCount = await auditService.cleanupOldLogs(retentionDays);

    res.json({
      success: true,
      data: {
        deletedCount,
        retentionDays,
        message: `Cleaned up ${deletedCount} audit logs older than ${retentionDays} days`
      }
    });
  } catch (error) {
    console.error('Cleanup audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup audit logs',
      details: error.message
    });
  }
});

/**
 * @route   DELETE /api/audit/logs/clear-all
 * @desc    Clear ALL audit logs (DANGER: irreversible)
 * @access  Admin (SuperAdmin only recommended)
 */
router.delete('/logs/clear-all', requireAdmin, async (req, res) => {
  try {
    const { confirmationCode } = req.body;
    
    // Require confirmation code for safety
    if (confirmationCode !== 'CLEAR_ALL_LOGS') {
      return res.status(400).json({
        success: false,
        error: 'Invalid confirmation code. Please provide confirmationCode: "CLEAR_ALL_LOGS"'
      });
    }

    // Log this dangerous action BEFORE deleting
    await auditService.log({
      userId: req.user.id,
      username: req.user.username || req.user.email,
      action: 'DELETE',
      entityType: 'audit_logs',
      entityId: 'ALL',
      entityName: 'All Audit Logs',
      description: `Admin ${req.user.username} cleared ALL audit logs`,
      ipAddress: req.ip || req.connection.remoteAddress,
      method: req.method,
      endpoint: req.originalUrl,
      statusCode: 200
    });

    // Clear all logs
    const deletedCount = await auditService.clearAllLogs();

    res.json({
      success: true,
      data: {
        deletedCount,
        message: `Successfully cleared ${deletedCount} audit logs`,
        warning: 'This action is irreversible'
      }
    });
  } catch (error) {
    console.error('Clear all audit logs error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear audit logs',
      details: error.message
    });
  }
});

module.exports = router;
