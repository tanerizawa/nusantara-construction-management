const os = require('os');
const si = require('systeminformation');
const { sequelize } = require('../config/database');
const ActiveSession = require('../models/ActiveSession');

/**
 * System Monitoring Service
 * Provides real-time system health metrics
 */

// Store metrics history in memory (last 60 data points = 1 hour with 1-minute intervals)
const metricsHistory = {
  cpu: [],
  memory: [],
  disk: [],
  database: [],
  api: [],
  maxLength: 60
};

/**
 * Get current CPU usage
 */
async function getCPUUsage() {
  try {
    const cpuLoad = await si.currentLoad();
    return {
      usage: parseFloat(cpuLoad.currentLoad.toFixed(2)),
      cores: cpuLoad.cpus.length,
      temperature: cpuLoad.cpus[0]?.temperature || null,
      speed: os.cpus()[0]?.speed || 0
    };
  } catch (error) {
    console.error('Error getting CPU usage:', error);
    return {
      usage: 0,
      cores: os.cpus().length,
      temperature: null,
      speed: 0
    };
  }
}

/**
 * Get current memory usage (accurate - excludes cache/buffers)
 */
async function getMemoryUsage() {
  try {
    const mem = await si.mem();
    const totalMem = mem.total;
    const activeMem = mem.active;  // TRUE used memory (excludes cache)
    const availableMem = mem.available;  // TRUE available memory
    const cacheMem = (mem.buffcache || 0);  // Cache + buffers
    const usagePercent = ((activeMem / totalMem) * 100).toFixed(2);
    const availablePercent = ((availableMem / totalMem) * 100).toFixed(2);

    return {
      total: formatBytes(totalMem),
      used: formatBytes(activeMem),  // Changed: use active instead of used
      free: formatBytes(mem.free),
      available: formatBytes(availableMem),  // NEW: available memory
      cache: formatBytes(cacheMem),  // NEW: cache/buffers
      usagePercent: parseFloat(usagePercent),  // TRUE usage (excludes cache)
      availablePercent: parseFloat(availablePercent),  // NEW: available percent
      totalBytes: totalMem,
      usedBytes: activeMem,  // Changed: use active
      availableBytes: availableMem,  // NEW
      cacheBytes: cacheMem  // NEW
    };
  } catch (error) {
    console.error('Error getting memory usage:', error);
    // Fallback to os module (less accurate)
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usagePercent = ((usedMem / totalMem) * 100).toFixed(2);
    const availablePercent = ((freeMem / totalMem) * 100).toFixed(2);

    return {
      total: formatBytes(totalMem),
      used: formatBytes(usedMem),
      free: formatBytes(freeMem),
      available: formatBytes(freeMem),  // Approximation
      cache: '0 B',  // Unknown in fallback
      usagePercent: parseFloat(usagePercent),
      availablePercent: parseFloat(availablePercent),
      totalBytes: totalMem,
      usedBytes: usedMem,
      availableBytes: freeMem,
      cacheBytes: 0
    };
  }
}

/**
 * Get disk usage
 */
async function getDiskUsage() {
  try {
    const fsSize = await si.fsSize();
    if (fsSize && fsSize.length > 0) {
      // Get root filesystem
      const rootFs = fsSize[0];
      return {
        total: formatBytes(rootFs.size),
        used: formatBytes(rootFs.used),
        free: formatBytes(rootFs.available),
        usagePercent: parseFloat(rootFs.use.toFixed(2)),
        totalBytes: rootFs.size,
        usedBytes: rootFs.used,
        freeBytes: rootFs.available,
        filesystem: rootFs.fs,
        mount: rootFs.mount
      };
    }
    return null;
  } catch (error) {
    console.error('Error getting disk usage:', error);
    return null;
  }
}

/**
 * Get database performance metrics
 */
async function getDatabaseMetrics() {
  try {
    const startTime = Date.now();
    
    // Test database connection
    await sequelize.authenticate();
    const connectionTime = Date.now() - startTime;

    // Get pool status
    const pool = sequelize.connectionManager.pool;
    const poolStatus = {
      size: pool?.size || 0,
      available: pool?.available || 0,
      using: pool?.using || 0,
      waiting: pool?.waiting || 0
    };

    // Get database size (PostgreSQL specific)
    let dbSize = 0;
    try {
      const [results] = await sequelize.query(
        "SELECT pg_database_size(current_database()) as size"
      );
      dbSize = results[0]?.size || 0;
    } catch (err) {
      console.error('Error getting database size:', err);
    }

    // Get active connections count
    let activeConnections = 0;
    try {
      const [results] = await sequelize.query(
        "SELECT count(*) as count FROM pg_stat_activity WHERE datname = current_database()"
      );
      activeConnections = parseInt(results[0]?.count || 0);
    } catch (err) {
      console.error('Error getting active connections:', err);
    }

    return {
      status: 'connected',
      connectionTime: connectionTime,
      size: formatBytes(dbSize),
      sizeBytes: dbSize,
      activeConnections: activeConnections,
      pool: poolStatus
    };
  } catch (error) {
    console.error('Error getting database metrics:', error);
    return {
      status: 'error',
      error: error.message,
      connectionTime: null,
      size: 'N/A',
      sizeBytes: 0,
      activeConnections: 0,
      pool: null
    };
  }
}

/**
 * Get active users count
 */
async function getActiveUsersCount() {
  try {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const count = await ActiveSession.count({
      where: {
        lastActive: {
          [require('sequelize').Op.gte]: fiveMinutesAgo
        }
      }
    });
    return count;
  } catch (error) {
    console.error('Error getting active users:', error);
    return 0;
  }
}

/**
 * Get system uptime
 */
function getSystemUptime() {
  const uptime = os.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return {
    uptime: uptime,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    days,
    hours,
    minutes,
    seconds
  };
}

/**
 * Get application uptime (process uptime)
 */
function getAppUptime() {
  const uptime = process.uptime();
  const days = Math.floor(uptime / 86400);
  const hours = Math.floor((uptime % 86400) / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);

  return {
    uptime: uptime,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    days,
    hours,
    minutes,
    seconds
  };
}

/**
 * Get comprehensive system health
 */
async function getSystemHealth() {
  try {
    const [cpu, memory, disk, database] = await Promise.all([
      getCPUUsage(),
      getMemoryUsage(),
      getDiskUsage(),
      getDatabaseMetrics()
    ]);

    const activeUsers = await getActiveUsersCount();
    const systemUptime = getSystemUptime();
    const appUptime = getAppUptime();

    // Determine overall health status
    const status = determineHealthStatus(cpu, memory, disk, database);

    const health = {
      status: status,
      timestamp: new Date(),
      cpu: cpu,
      memory: memory,
      disk: disk,
      database: database,
      activeUsers: activeUsers,
      systemUptime: systemUptime,
      appUptime: appUptime,
      nodejs: {
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };

    // Store in history
    storeMetricsHistory(health);

    return health;
  } catch (error) {
    console.error('Error getting system health:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date()
    };
  }
}

/**
 * Determine overall health status based on metrics
 */
function determineHealthStatus(cpu, memory, disk, database) {
  const alerts = [];

  // CPU check
  if (cpu.usage > 90) {
    alerts.push('critical');
  } else if (cpu.usage > 75) {
    alerts.push('warning');
  }

  // Memory check
  if (memory.usagePercent > 90) {
    alerts.push('critical');
  } else if (memory.usagePercent > 80) {
    alerts.push('warning');
  }

  // Disk check
  if (disk && disk.usagePercent > 90) {
    alerts.push('critical');
  } else if (disk && disk.usagePercent > 80) {
    alerts.push('warning');
  }

  // Database check
  if (database.status !== 'connected') {
    alerts.push('critical');
  } else if (database.connectionTime > 1000) {
    alerts.push('warning');
  }

  if (alerts.includes('critical')) return 'critical';
  if (alerts.includes('warning')) return 'warning';
  return 'healthy';
}

/**
 * Store metrics in history
 */
function storeMetricsHistory(health) {
  const timestamp = health.timestamp;

  // Store CPU
  metricsHistory.cpu.push({
    timestamp,
    value: health.cpu.usage
  });
  if (metricsHistory.cpu.length > metricsHistory.maxLength) {
    metricsHistory.cpu.shift();
  }

  // Store Memory
  metricsHistory.memory.push({
    timestamp,
    value: health.memory.usagePercent
  });
  if (metricsHistory.memory.length > metricsHistory.maxLength) {
    metricsHistory.memory.shift();
  }

  // Store Disk
  if (health.disk) {
    metricsHistory.disk.push({
      timestamp,
      value: health.disk.usagePercent
    });
    if (metricsHistory.disk.length > metricsHistory.maxLength) {
      metricsHistory.disk.shift();
    }
  }

  // Store Database
  metricsHistory.database.push({
    timestamp,
    value: health.database.connectionTime || 0
  });
  if (metricsHistory.database.length > metricsHistory.maxLength) {
    metricsHistory.database.shift();
  }
}

/**
 * Get metrics history
 */
function getMetricsHistory() {
  return metricsHistory;
}

/**
 * Track API response time
 */
function trackAPIResponseTime(endpoint, responseTime, statusCode) {
  metricsHistory.api.push({
    timestamp: new Date(),
    endpoint,
    responseTime,
    statusCode
  });

  // Keep only last 100 API calls
  if (metricsHistory.api.length > 100) {
    metricsHistory.api.shift();
  }
}

/**
 * Get API performance metrics
 */
function getAPIMetrics() {
  if (metricsHistory.api.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowestEndpoint: null,
      fastestEndpoint: null,
      errorRate: 0
    };
  }

  const total = metricsHistory.api.length;
  const avgResponseTime = metricsHistory.api.reduce((sum, item) => sum + item.responseTime, 0) / total;
  const errors = metricsHistory.api.filter(item => item.statusCode >= 400).length;
  const errorRate = (errors / total) * 100;

  // Find slowest and fastest
  const sorted = [...metricsHistory.api].sort((a, b) => b.responseTime - a.responseTime);
  const slowest = sorted[0];
  const fastest = sorted[sorted.length - 1];

  return {
    totalRequests: total,
    averageResponseTime: parseFloat(avgResponseTime.toFixed(2)),
    slowestEndpoint: slowest ? {
      endpoint: slowest.endpoint,
      responseTime: slowest.responseTime,
      timestamp: slowest.timestamp
    } : null,
    fastestEndpoint: fastest ? {
      endpoint: fastest.endpoint,
      responseTime: fastest.responseTime,
      timestamp: fastest.timestamp
    } : null,
    errorRate: parseFloat(errorRate.toFixed(2)),
    errors: errors
  };
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return 'N/A';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Get system alerts based on thresholds
 */
async function getSystemAlerts() {
  const health = await getSystemHealth();
  const alerts = [];

  // CPU alerts
  if (health.cpu.usage > 90) {
    alerts.push({
      type: 'critical',
      category: 'cpu',
      message: `CPU usage is critically high: ${health.cpu.usage}%`,
      value: health.cpu.usage,
      threshold: 90
    });
  } else if (health.cpu.usage > 75) {
    alerts.push({
      type: 'warning',
      category: 'cpu',
      message: `CPU usage is high: ${health.cpu.usage}%`,
      value: health.cpu.usage,
      threshold: 75
    });
  }

  // Memory alerts
  if (health.memory.usagePercent > 90) {
    alerts.push({
      type: 'critical',
      category: 'memory',
      message: `Memory usage is critically high: ${health.memory.usagePercent}%`,
      value: health.memory.usagePercent,
      threshold: 90
    });
  } else if (health.memory.usagePercent > 80) {
    alerts.push({
      type: 'warning',
      category: 'memory',
      message: `Memory usage is high: ${health.memory.usagePercent}%`,
      value: health.memory.usagePercent,
      threshold: 80
    });
  }

  // Disk alerts
  if (health.disk && health.disk.usagePercent > 90) {
    alerts.push({
      type: 'critical',
      category: 'disk',
      message: `Disk usage is critically high: ${health.disk.usagePercent}%`,
      value: health.disk.usagePercent,
      threshold: 90
    });
  } else if (health.disk && health.disk.usagePercent > 80) {
    alerts.push({
      type: 'warning',
      category: 'disk',
      message: `Disk usage is high: ${health.disk.usagePercent}%`,
      value: health.disk.usagePercent,
      threshold: 80
    });
  }

  // Database alerts
  if (health.database.status !== 'connected') {
    alerts.push({
      type: 'critical',
      category: 'database',
      message: 'Database connection failed',
      value: health.database.status,
      threshold: null
    });
  } else if (health.database.connectionTime > 1000) {
    alerts.push({
      type: 'warning',
      category: 'database',
      message: `Database response time is slow: ${health.database.connectionTime}ms`,
      value: health.database.connectionTime,
      threshold: 1000
    });
  }

  return {
    alerts,
    count: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length
  };
}

module.exports = {
  getSystemHealth,
  getCPUUsage,
  getMemoryUsage,
  getDiskUsage,
  getDatabaseMetrics,
  getActiveUsersCount,
  getSystemUptime,
  getAppUptime,
  getMetricsHistory,
  getAPIMetrics,
  trackAPIResponseTime,
  getSystemAlerts,
  formatBytes
};
