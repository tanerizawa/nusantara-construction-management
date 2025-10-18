/**
 * Operational Systems API Service
 * Handles API calls for Security, Monitoring, Audit, and Backup systems
 */

import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ============================================================================
// SECURITY ENDPOINTS
// ============================================================================

export const securityApi = {
  /**
   * Get login history
   * @param {Object} params - Query parameters (limit, offset, userId, etc.)
   */
  getLoginHistory: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/login-history`, {
        headers: createAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get active sessions (using auth sessions endpoint)
   */
  getActiveSessions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/auth/sessions`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Terminate a session
   * @param {string} token - Session token to terminate
   */
  terminateSession: async (token) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/security/session/${token}`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ============================================================================
// MONITORING ENDPOINTS
// ============================================================================

export const monitoringApi = {
  /**
   * Get system health status
   */
  getHealth: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/health`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get comprehensive system metrics
   */
  getMetrics: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/metrics`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get CPU metrics
   */
  getCpu: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/cpu`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get memory metrics
   */
  getMemory: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/memory`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get disk metrics
   */
  getDisk: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/disk`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get database metrics
   */
  getDatabase: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/database`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get API performance metrics
   */
  getApiPerformance: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/api-performance`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get system alerts
   */
  getAlerts: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/alerts`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get process information
   */
  getProcess: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/monitoring/process`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ============================================================================
// AUDIT ENDPOINTS
// ============================================================================

export const auditApi = {
  /**
   * Get audit logs with filters
   * @param {Object} params - Query parameters
   */
  getLogs: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/logs`, {
        headers: createAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get entity history
   * @param {string} entityType - Type of entity
   * @param {string} entityId - ID of entity
   */
  getEntityHistory: async (entityType, entityId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/entity-history/${entityType}/${entityId}`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get user activity
   * @param {string} userId - User ID
   * @param {Object} params - Query parameters
   */
  getUserActivity: async (userId, params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/user-activity/${userId}`, {
        headers: createAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get system activity
   * @param {Object} params - Query parameters
   */
  getSystemActivity: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/system-activity`, {
        headers: createAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Export audit logs to CSV
   * @param {Object} params - Export parameters
   */
  exportLogs: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/export`, {
        headers: createAuthHeader(),
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get available actions
   */
  getActions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/actions`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get available entity types
   */
  getEntityTypes: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/audit/entity-types`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cleanup old logs
   * @param {number} days - Days to keep
   */
  cleanup: async (days = 90) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/audit/cleanup`, {
        headers: createAuthHeader(),
        params: { days }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

// ============================================================================
// BACKUP ENDPOINTS
// ============================================================================

export const backupApi = {
  /**
   * Get backup statistics
   */
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/backup/stats`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Create manual backup
   * @param {string} description - Backup description
   */
  createBackup: async (description = '') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/backup/create`, 
        { description },
        { headers: createAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * List backups
   * @param {Object} params - Query parameters
   */
  listBackups: async (params = {}) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/backup/list`, {
        headers: createAuthHeader(),
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Get backup details
   * @param {string} id - Backup ID
   */
  getBackupDetails: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/backup/${id}`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Verify backup integrity
   * @param {string} id - Backup ID
   */
  verifyBackup: async (id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/backup/${id}/verify`, 
        {},
        { headers: createAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Restore backup
   * @param {string} id - Backup ID
   * @param {boolean} confirm - Confirmation flag
   */
  restoreBackup: async (id, confirm = false) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/backup/${id}/restore`, 
        { confirm },
        { headers: createAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Delete backup
   * @param {string} id - Backup ID
   */
  deleteBackup: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/backup/${id}`, {
        headers: createAuthHeader()
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Cleanup old backups
   */
  cleanup: async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/backup/cleanup`, 
        {},
        { headers: createAuthHeader() }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  /**
   * Download backup file
   * @param {string} id - Backup ID
   */
  downloadBackup: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/backup/download/${id}`, {
        headers: createAuthHeader(),
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default {
  security: securityApi,
  monitoring: monitoringApi,
  audit: auditApi,
  backup: backupApi
};
