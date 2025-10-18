const monitoringService = require('../services/systemMonitoringService');

/**
 * Middleware to track API response times
 * Tracks every API call and stores metrics
 */
function trackResponseTime(req, res, next) {
  const startTime = Date.now();

  // Override res.send to capture response
  const originalSend = res.send;
  res.send = function (data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;
    
    // Track the API call
    monitoringService.trackAPIResponseTime(
      `${req.method} ${req.path}`,
      responseTime,
      res.statusCode
    );

    // Log slow requests (>1000ms)
    if (responseTime > 1000) {
      console.warn(`⚠️  Slow API: ${req.method} ${req.path} - ${responseTime}ms`);
    }

    // Call original send
    return originalSend.call(this, data);
  };

  next();
}

/**
 * Middleware to check system health before processing requests
 * Returns 503 if system is in critical state
 */
async function healthCheck(req, res, next) {
  try {
    // Skip health check for monitoring endpoints
    if (req.path.startsWith('/api/monitoring') || req.path === '/health') {
      return next();
    }

    const health = await monitoringService.getSystemHealth();
    
    // If system is critical, reject requests
    if (health.status === 'critical') {
      return res.status(503).json({
        success: false,
        error: 'Service temporarily unavailable due to high system load',
        status: health.status
      });
    }

    next();
  } catch (error) {
    // If health check fails, allow request to proceed
    console.error('Health check middleware error:', error);
    next();
  }
}

module.exports = {
  trackResponseTime,
  healthCheck
};
