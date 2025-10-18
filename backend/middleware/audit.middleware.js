const auditService = require('../services/auditService');
const jwt = require('jsonwebtoken');

/**
 * Audit Middleware
 * Automatically logs API requests for auditing
 */

/**
 * Extract user info from JWT token
 */
function extractUserFromToken(req) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    return {
      userId: decoded.id || decoded.userId,
      username: decoded.username
    };
  } catch (error) {
    return null;
  }
}

/**
 * Determine entity type from endpoint
 */
function getEntityTypeFromEndpoint(path) {
  const parts = path.split('/').filter(p => p);
  
  // Map API endpoints to entity types
  const entityMap = {
    'users': 'user',
    'projects': 'project',
    'subsidiaries': 'subsidiary',
    'coa': 'chart_of_accounts',
    'finance': 'finance',
    'manpower': 'manpower',
    'tax': 'tax',
    'reports': 'report',
    'analytics': 'analytics',
    'notifications': 'notification',
    'purchase-orders': 'purchase_order',
    'work-orders': 'work_order',
    'invoices': 'invoice',
    'milestones': 'milestone',
    'database': 'database'
  };

  // Find the entity type from path
  for (const [key, value] of Object.entries(entityMap)) {
    if (parts.includes(key)) {
      return value;
    }
  }

  return parts[1] || 'unknown'; // Default to second part of path
}

/**
 * Determine action from HTTP method
 */
function getActionFromMethod(method) {
  const actionMap = {
    'POST': 'CREATE',
    'PUT': 'UPDATE',
    'PATCH': 'UPDATE',
    'DELETE': 'DELETE',
    'GET': 'VIEW'
  };

  return actionMap[method] || 'VIEW';
}

/**
 * Extract entity ID from request
 */
function extractEntityId(req) {
  // Try to get from params
  if (req.params.id) return req.params.id;
  if (req.params.userId) return req.params.userId;
  if (req.params.projectId) return req.params.projectId;
  
  // Try to get from body
  if (req.body?.id) return req.body.id;
  
  // Try to get from query
  if (req.query?.id) return req.query.id;
  
  return null;
}

/**
 * Middleware to audit sensitive operations
 * Use this for specific routes that need detailed auditing
 */
function auditOperation(options = {}) {
  return async (req, res, next) => {
    const startTime = Date.now();
    const user = extractUserFromToken(req);
    
    // Store original methods
    const originalJson = res.json;
    const originalSend = res.send;

    // Track if response was sent
    let responseSent = false;
    let responseData = null;

    // Wrap res.json to capture response
    res.json = function(data) {
      if (!responseSent) {
        responseSent = true;
        responseData = data;
        
        // Log audit after response
        const duration = Date.now() - startTime;
        setImmediate(() => logAuditEvent(req, res, user, duration, responseData, options));
      }
      return originalJson.call(this, data);
    };

    // Wrap res.send to capture response
    res.send = function(data) {
      if (!responseSent) {
        responseSent = true;
        try {
          responseData = typeof data === 'string' ? JSON.parse(data) : data;
        } catch (e) {
          responseData = data;
        }
        
        // Log audit after response
        const duration = Date.now() - startTime;
        setImmediate(() => logAuditEvent(req, res, user, duration, responseData, options));
      }
      return originalSend.call(this, data);
    };

    next();
  };
}

/**
 * Log audit event
 */
async function logAuditEvent(req, res, user, duration, responseData, options) {
  try {
    const entityType = options.entityType || getEntityTypeFromEndpoint(req.path);
    const action = options.action || getActionFromMethod(req.method);
    const entityId = options.entityId || extractEntityId(req);
    
    // Determine entity name
    let entityName = null;
    if (responseData?.data?.name) entityName = responseData.data.name;
    else if (responseData?.data?.title) entityName = responseData.data.title;
    else if (responseData?.data?.username) entityName = responseData.data.username;

    // Prepare audit data
    const auditData = {
      userId: user?.userId,
      username: user?.username,
      action,
      entityType,
      entityId,
      entityName,
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
      method: req.method,
      endpoint: req.path,
      statusCode: res.statusCode,
      duration
    };

    // Add before/after data based on action
    if (action === 'CREATE' && responseData?.data) {
      auditData.after = responseData.data;
    } else if (action === 'UPDATE' && req.body) {
      auditData.before = options.before || null;
      auditData.after = responseData?.data || req.body;
    } else if (action === 'DELETE' && options.before) {
      auditData.before = options.before;
    }

    // Add error message if failed
    if (res.statusCode >= 400 && responseData?.error) {
      auditData.errorMessage = responseData.error;
    }

    await auditService.logAudit(auditData);
  } catch (error) {
    console.error('Error in audit middleware:', error);
    // Don't throw - audit failures shouldn't break the app
  }
}

/**
 * Middleware to audit all API requests (lightweight version)
 */
function auditAllRequests(req, res, next) {
  // Skip health checks and monitoring endpoints
  if (req.path === '/health' || 
      req.path.startsWith('/api/monitoring') || 
      req.path.startsWith('/api/audit')) {
    return next();
  }

  // Only audit write operations (POST, PUT, PATCH, DELETE)
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    return next();
  }

  const startTime = Date.now();
  const user = extractUserFromToken(req);

  // Capture response
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    setImmediate(async () => {
      try {
        const action = getActionFromMethod(req.method);
        const entityType = getEntityTypeFromEndpoint(req.path);
        const entityId = extractEntityId(req);

        await auditService.logAudit({
          userId: user?.userId,
          username: user?.username,
          action,
          entityType,
          entityId,
          after: req.method === 'POST' ? data?.data : null,
          ipAddress: req.ip,
          userAgent: req.headers['user-agent'],
          method: req.method,
          endpoint: req.path,
          statusCode: res.statusCode,
          duration,
          errorMessage: data?.error || null
        });
      } catch (error) {
        console.error('Error in audit middleware:', error);
      }
    });

    return originalJson.call(this, data);
  };

  next();
}

module.exports = {
  auditOperation,
  auditAllRequests,
  extractUserFromToken,
  getEntityTypeFromEndpoint,
  getActionFromMethod
};
