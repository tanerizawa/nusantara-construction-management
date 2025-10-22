const AuditLog = require('../models/AuditLog');
const { Op, Sequelize } = require('sequelize');
const { sequelize } = require('../config/database');

/**
 * Audit Service
 * Provides comprehensive audit logging functionality
 */

/**
 * Calculate changes between before and after states
 */
function calculateChanges(before, after) {
  if (!before || !after) return null;

  const changes = {};
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    // Skip sensitive fields
    if (key === 'password' || key === 'token' || key === 'secret') continue;

    const oldValue = before[key];
    const newValue = after[key];

    // Check if value changed
    if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
      changes[key] = {
        old: oldValue,
        new: newValue
      };
    }
  }

  return Object.keys(changes).length > 0 ? changes : null;
}

/**
 * Sanitize data - remove sensitive fields
 */
function sanitizeData(data) {
  if (!data) return null;
  
  const sanitized = { ...data };
  
  // Remove sensitive fields
  const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'privateKey'];
  sensitiveFields.forEach(field => {
    if (sanitized[field]) {
      sanitized[field] = '***REDACTED***';
    }
  });

  return sanitized;
}

/**
 * Log an audit event
 */
async function logAudit({
  userId,
  username,
  action,
  entityType,
  entityId,
  entityName,
  before = null,
  after = null,
  ipAddress = null,
  userAgent = null,
  method = null,
  endpoint = null,
  statusCode = null,
  errorMessage = null,
  duration = null,
  metadata = null
}) {
  try {
    // Sanitize data
    const sanitizedBefore = sanitizeData(before);
    const sanitizedAfter = sanitizeData(after);

    // Calculate changes for UPDATE actions
    const changes = action === 'UPDATE' 
      ? calculateChanges(sanitizedBefore, sanitizedAfter)
      : null;

    await AuditLog.create({
      userId,
      username,
      action,
      entityType,
      entityId,
      entityName,
      before: sanitizedBefore,
      after: sanitizedAfter,
      changes,
      ipAddress,
      userAgent,
      method,
      endpoint,
      statusCode,
      errorMessage,
      duration,
      metadata,
      createdAt: new Date()
    });

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📝 Audit: ${username || userId} ${action} ${entityType} ${entityId || ''}`);
    }
  } catch (error) {
    console.error('Error logging audit:', error);
    // Don't throw - audit logging failures shouldn't break the application
  }
}

/**
 * Log CREATE action
 */
async function logCreate({
  userId,
  username,
  entityType,
  entityId,
  entityName,
  data,
  req = null
}) {
  await logAudit({
    userId,
    username,
    action: 'CREATE',
    entityType,
    entityId,
    entityName,
    after: data,
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
    method: req?.method,
    endpoint: req?.path
  });
}

/**
 * Log UPDATE action
 */
async function logUpdate({
  userId,
  username,
  entityType,
  entityId,
  entityName,
  before,
  after,
  req = null
}) {
  await logAudit({
    userId,
    username,
    action: 'UPDATE',
    entityType,
    entityId,
    entityName,
    before,
    after,
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
    method: req?.method,
    endpoint: req?.path
  });
}

/**
 * Log DELETE action
 */
async function logDelete({
  userId,
  username,
  entityType,
  entityId,
  entityName,
  data,
  req = null
}) {
  await logAudit({
    userId,
    username,
    action: 'DELETE',
    entityType,
    entityId,
    entityName,
    before: data,
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
    method: req?.method,
    endpoint: req?.path
  });
}

/**
 * Log LOGIN action
 */
async function logLogin({
  userId,
  username,
  success,
  ipAddress,
  userAgent,
  errorMessage = null
}) {
  await logAudit({
    userId,
    username,
    action: 'LOGIN',
    entityType: 'auth',
    entityId: userId,
    entityName: username,
    statusCode: success ? 200 : 401,
    errorMessage,
    ipAddress,
    userAgent,
    method: 'POST',
    endpoint: '/api/auth/login'
  });
}

/**
 * Log LOGOUT action
 */
async function logLogout({
  userId,
  username,
  ipAddress,
  userAgent
}) {
  await logAudit({
    userId,
    username,
    action: 'LOGOUT',
    entityType: 'auth',
    entityId: userId,
    entityName: username,
    ipAddress,
    userAgent,
    method: 'POST',
    endpoint: '/api/auth/logout'
  });
}

/**
 * Log VIEW action (for sensitive data access)
 */
async function logView({
  userId,
  username,
  entityType,
  entityId,
  entityName,
  req = null
}) {
  await logAudit({
    userId,
    username,
    action: 'VIEW',
    entityType,
    entityId,
    entityName,
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
    method: req?.method,
    endpoint: req?.path
  });
}

/**
 * Log EXPORT action
 */
async function logExport({
  userId,
  username,
  entityType,
  format,
  filters = null,
  req = null
}) {
  await logAudit({
    userId,
    username,
    action: 'EXPORT',
    entityType,
    entityName: `${entityType}_export.${format}`,
    metadata: { format, filters },
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
    method: req?.method,
    endpoint: req?.path
  });
}

/**
 * Log IMPORT action
 */
async function logImport({
  userId,
  username,
  entityType,
  recordCount,
  filename,
  req = null
}) {
  await logAudit({
    userId,
    username,
    action: 'IMPORT',
    entityType,
    entityName: filename,
    metadata: { recordCount },
    ipAddress: req?.ip,
    userAgent: req?.headers['user-agent'],
    method: req?.method,
    endpoint: req?.path
  });
}

/**
 * Get audit logs with filtering
 */
async function getAuditLogs({
  userId = null,
  action = null,
  entityType = null,
  entityId = null,
  startDate = null,
  endDate = null,
  limit = 50,
  offset = 0,
  sortBy = 'createdAt',
  sortOrder = 'DESC'
}) {
  try {
    const where = {};

    if (userId) where.userId = userId;
    if (action) where.action = action;
    if (entityType) where.entityType = entityType;
    if (entityId) where.entityId = entityId;

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt[Op.gte] = new Date(startDate);
      if (endDate) where.createdAt[Op.lte] = new Date(endDate);
    }

    const { count, rows } = await AuditLog.findAndCountAll({
      where,
      order: [[sortBy, sortOrder]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      raw: true
    });

    return {
      logs: rows,
      total: count,
      limit: parseInt(limit),
      offset: parseInt(offset),
      pages: Math.ceil(count / limit)
    };
  } catch (error) {
    console.error('Error getting audit logs:', error);
    throw error;
  }
}

/**
 * Get audit log by ID
 */
async function getAuditLogById(id) {
  try {
    const log = await AuditLog.findByPk(id, { raw: true });
    return log;
  } catch (error) {
    console.error('Error getting audit log:', error);
    throw error;
  }
}

/**
 * Get entity history (all changes for a specific entity)
 */
async function getEntityHistory(entityType, entityId, limit = 20) {
  try {
    const logs = await AuditLog.findAll({
      where: {
        entityType,
        entityId
      },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      raw: true
    });

    return logs;
  } catch (error) {
    console.error('Error getting entity history:', error);
    throw error;
  }
}

/**
 * Get user activity summary
 */
async function getUserActivity(userId, days = 30) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const logs = await AuditLog.findAll({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'action',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['action'],
      raw: true
    });

    const total = await AuditLog.count({
      where: {
        userId,
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    return {
      userId,
      period: `${days} days`,
      total,
      byAction: logs.reduce((acc, log) => {
        acc[log.action] = parseInt(log.count);
        return acc;
      }, {})
    };
  } catch (error) {
    console.error('Error getting user activity:', error);
    throw error;
  }
}

/**
 * Get system activity summary
 */
async function getSystemActivity(days = 7) {
  try {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const total = await AuditLog.count({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      }
    });

    const byAction = await AuditLog.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'action',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['action'],
      raw: true
    });

    const byEntityType = await AuditLog.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        }
      },
      attributes: [
        'entityType',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['entityType'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    const mostActiveUsers = await AuditLog.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate
        },
        userId: {
          [Op.not]: null
        }
      },
      attributes: [
        'userId',
        'username',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['userId', 'username'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 10,
      raw: true
    });

    return {
      period: `${days} days`,
      total,
      byAction: byAction.reduce((acc, item) => {
        acc[item.action] = parseInt(item.count);
        return acc;
      }, {}),
      byEntityType: byEntityType.map(item => ({
        entityType: item.entityType,
        count: parseInt(item.count)
      })),
      mostActiveUsers: mostActiveUsers.map(item => ({
        userId: item.userId,
        username: item.username,
        count: parseInt(item.count)
      }))
    };
  } catch (error) {
    console.error('Error getting system activity:', error);
    throw error;
  }
}

/**
 * Clean up old audit logs (retention policy)
 */
async function cleanupOldLogs(retentionDays = 90) {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const result = await AuditLog.destroy({
      where: {
        createdAt: {
          [Op.lt]: cutoffDate
        }
      }
    });

    console.log(`🗑️  Cleaned up ${result} audit logs older than ${retentionDays} days`);
    return result;
  } catch (error) {
    console.error('Error cleaning up old logs:', error);
    throw error;
  }
}

/**
 * Clear ALL audit logs (DANGER: use with caution)
 */
async function clearAllLogs() {
  try {
    const count = await AuditLog.count();
    
    await AuditLog.destroy({
      where: {},
      truncate: true // Faster than delete
    });

    console.log(`🗑️  Cleared ALL ${count} audit logs`);
    return count;
  } catch (error) {
    console.error('Error clearing all logs:', error);
    throw error;
  }
}

module.exports = {
  logAudit,
  logCreate,
  logUpdate,
  logDelete,
  logLogin,
  logLogout,
  logView,
  logExport,
  logImport,
  getAuditLogs,
  getAuditLogById,
  getEntityHistory,
  getUserActivity,
  getSystemActivity,
  cleanupOldLogs,
  clearAllLogs,
  calculateChanges,
  sanitizeData,
  // Backward compatibility
  log: logAudit
};
