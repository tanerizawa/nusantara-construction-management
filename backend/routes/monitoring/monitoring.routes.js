const express = require('express');
const monitoringService = require('../../services/systemMonitoringService');
const { verifyToken } = require('../../middleware/auth');

const router = express.Router();

/**
 * Middleware untuk monitoring - bisa diakses oleh semua authenticated users
 * Tidak perlu admin, karena monitoring adalah fitur operational yang berguna untuk semua user
 */

/**
 * @route   GET /api/monitoring/health
 * @desc    Get comprehensive system health
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/health', verifyToken, async (req, res) => {
  try {
    const health = await monitoringService.getSystemHealth();
    
    res.json({
      success: true,
      data: health
    });
  } catch (error) {
    console.error('Get system health error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get system health',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/metrics
 * @desc    Get system metrics history
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/metrics', verifyToken, async (req, res) => {
  try {
    const history = monitoringService.getMetricsHistory();
    
    res.json({
      success: true,
      data: history
    });
  } catch (error) {
    console.error('Get metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get metrics',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/api-performance
 * @desc    Get API performance metrics
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/api-performance', verifyToken, async (req, res) => {
  try {
    const metrics = monitoringService.getAPIMetrics();
    
    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Get API performance error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get API performance',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/alerts
 * @desc    Get system alerts
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/alerts', verifyToken, async (req, res) => {
  try {
    const alerts = await monitoringService.getSystemAlerts();
    
    res.json({
      success: true,
      data: alerts
    });
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get alerts',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/cpu
 * @desc    Get CPU usage
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/cpu', verifyToken, async (req, res) => {
  try {
    const cpu = await monitoringService.getCPUUsage();
    
    res.json({
      success: true,
      data: cpu
    });
  } catch (error) {
    console.error('Get CPU usage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get CPU usage',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/memory
 * @desc    Get memory usage
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/memory', verifyToken, async (req, res) => {
  try {
    const memory = await monitoringService.getMemoryUsage();
    
    res.json({
      success: true,
      data: memory
    });
  } catch (error) {
    console.error('Get memory usage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get memory usage',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/disk
 * @desc    Get disk usage
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/disk', verifyToken, async (req, res) => {
  try {
    const disk = await monitoringService.getDiskUsage();
    
    res.json({
      success: true,
      data: disk
    });
  } catch (error) {
    console.error('Get disk usage error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get disk usage',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/database
 * @desc    Get database metrics
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/database', verifyToken, async (req, res) => {
  try {
    const database = await monitoringService.getDatabaseMetrics();
    
    res.json({
      success: true,
      data: database
    });
  } catch (error) {
    console.error('Get database metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get database metrics',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/monitoring/active-users
 * @desc    Get active users count
 * @access  Authenticated users (tidak perlu admin)
 */
router.get('/active-users', verifyToken, async (req, res) => {
  try {
    const count = await monitoringService.getActiveUsersCount();
    
    res.json({
      success: true,
      data: {
        count,
        timestamp: new Date()
      }
    });
  } catch (error) {
    console.error('Get active users error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get active users',
      details: error.message
    });
  }
});

module.exports = router;
