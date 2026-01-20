import axios from 'axios';
import { API_URL, IS_PRODUCTION } from '../utils/config';

// Use centralized API configuration
const API_BASE_URL = API_URL;

// Helper for conditional logging (only in local development)
const isDev = process.env.NODE_ENV === 'development' && !IS_PRODUCTION;
const devLog = (...args) => isDev && console.log(...args);
const devError = (...args) => isDev && console.error(...args);

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased from 10s to 30s for slow endpoints
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    // Only log in local development mode
    if (isDev) {
      let dataLog = 'N/A';
      const method = config.method?.toLowerCase();
      if (['post', 'put', 'patch'].includes(method)) {
        dataLog = config.data;
      }
      
      devLog('🔐 AXIOS REQUEST DEBUG:', {
        url: config.url,
        method: config.method,
        hasToken: !!token,
        tokenPreview: token ? token.substring(0, 20) + '...' : 'No token',
        data: dataLog
      });
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      devLog('✅ Token added to request headers');
    } else {
      devLog('❌ No token found in localStorage');
    }
    
    // For FormData, remove Content-Type to let axios set it automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
      
      if (isDev) {
        devLog('=== AXIOS INTERCEPTOR DEBUG ===');
        devLog('FormData detected in interceptor');
        devLog('URL:', config.url);
        devLog('Method:', config.method);
        devLog('Headers after Content-Type removal:', config.headers);
        devLog('FormData entries:');
        for (let pair of config.data.entries()) {
          devLog(pair[0] + ': ', pair[1]);
        }
        devLog('==============================');
      }
    }
    
    return config;
  },
  (error) => {
    devError('❌ AXIOS REQUEST ERROR:', error);
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => {
    devLog('✅ AXIOS RESPONSE SUCCESS:', {
      url: response.config.url,
      status: response.status,
      dataPreview: JSON.stringify(response.data).substring(0, 100) + '...'
    });
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log errors only in development
    devError('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      responseData: error.response?.data
    });
    
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    // Retry logic for network errors and timeouts (max 2 retries)
    if (!originalRequest._retry && 
        (error.code === 'ECONNABORTED' || 
         error.code === 'ERR_NETWORK' || 
         error.code === 'ERR_NETWORK_CHANGED' ||
         error.message.includes('timeout'))) {
      
      originalRequest._retry = (originalRequest._retry || 0) + 1;
      
      if (originalRequest._retry <= 2) {
        devLog(`🔄 Retrying request (attempt ${originalRequest._retry}/2):`, error.config?.url);
        
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, originalRequest._retry * 1000));
        
        return apiClient(originalRequest);
      }
    }
    
    return Promise.reject(error);
  }
);

// Generic API methods
const apiService = {
  // GET request with retry logic
  get: async (endpoint, params = {}, retries = 2) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      // Better error messages
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error(`Request timeout - Server took too long to respond. Please try again.`);
      }
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_NETWORK_CHANGED') {
        throw new Error(`Network error - Please check your internet connection.`);
      }
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to fetch data');
    }
  },

  // POST request
  post: async (endpoint, data = {}) => {
    try {
      console.log('📤 POST REQUEST DATA:', data);
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.log('🚫 POST ERROR DETAILS:', {
        status: error.response?.status,
        data: error.response?.data,
        details: error.response?.data?.details
      });
      
      // Enhanced error handling for validation errors
      if (error.response?.data?.details && Array.isArray(error.response.data.details)) {
        const errorDetails = error.response.data.details.map(err => 
          typeof err === 'object' ? `${err.path?.join('.')}: ${err.message}` : err
        ).join(', ');
        throw new Error(`Validation Error: ${errorDetails}`);
      }
      
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to create data');
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      console.log('🔄 PUT REQUEST:', endpoint, data);
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('❌ PUT ERROR:', error.response?.data);
      
      // Enhanced error handling for validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorDetails = error.response.data.errors.map(err => 
          typeof err === 'object' ? `${err.field}: ${err.message}` : err
        ).join(', ');
        throw new Error(`Validation Error: ${errorDetails}`);
      }
      
      throw new Error(error.response?.data?.message || 'Failed to update data');
    }
  },

  // PATCH request
  patch: async (endpoint, data = {}) => {
    try {
      console.log('🔄 PATCH REQUEST:', endpoint, data);
      const response = await apiClient.patch(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('❌ PATCH ERROR:', error.response?.data);
      
      // Enhanced error handling for validation errors
      if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
        const errorDetails = error.response.data.errors.map(err => 
          typeof err === 'object' ? `${err.field}: ${err.message}` : err
        ).join(', ');
        throw new Error(`Validation Error: ${errorDetails}`);
      }
      
      throw new Error(error.response?.data?.error || error.response?.data?.message || 'Failed to update data');
    }
  },

  // DELETE request with better error handling
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      // Better error messages
      if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
        throw new Error(`Request timeout - Server took too long to respond. Please try again.`);
      }
      if (error.code === 'ERR_NETWORK' || error.code === 'ERR_NETWORK_CHANGED') {
        throw new Error(`Network error - Please check your internet connection and try again.`);
      }
      throw new Error(error.response?.data?.message || error.response?.data?.error || 'Failed to delete data');
    }
  },

  // File upload
  upload: async (endpoint, file, onProgress = null) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            onProgress(progress);
          }
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to upload file');
    }
  }
};

// Specific API endpoints
export const employeeAPI = {
  getAll: (params) => apiService.get('/manpower', params),
  getById: (id) => apiService.get(`/manpower/${id}`),
  create: (data) => apiService.post('/manpower', data),
  update: (id, data) => apiService.put(`/manpower/${id}`, data),
  delete: (id) => apiService.delete(`/manpower/${id}`),
  getByProject: (projectId) => apiService.get(`/manpower?projectId=${projectId}`),
  getByDepartment: (department) => apiService.get(`/manpower?department=${department}`),
  getBySubsidiary: (subsidiaryId) => apiService.get(`/manpower?subsidiaryId=${subsidiaryId}`),
  getStatistics: () => apiService.get('/manpower/statistics'),
  getStatisticsBySubsidiary: () => apiService.get('/manpower/statistics/by-subsidiary'),
};

export const projectAPI = {
  getAll: (params) => apiService.get('/projects', params),
  getById: (id) => apiService.get(`/projects/${id}`),
  create: (data) => apiService.post('/projects', data),
  update: (id, data) => apiService.put(`/projects/${id}`, data),
  updateStatus: (id, data) => apiService.patch(`/projects/${id}/status`, data), // New: Quick status update
  delete: (id) => apiService.delete(`/projects/${id}`),
  getStatistics: () => apiService.get('/projects/statistics'),
  getByStatus: (status) => apiService.get(`/projects?status=${status}`),
  
  // RAB-specific endpoints
  getRAB: (projectId) => apiService.get(`/projects/${projectId}/rab`),
  createRABItem: (projectId, data) => apiService.post(`/projects/${projectId}/rab`, data),
  updateRABItem: (projectId, itemId, data) => apiService.put(`/projects/${projectId}/rab/${itemId}`, data),
  deleteRABItem: (projectId, itemId) => apiService.delete(`/projects/${projectId}/rab/${itemId}`),
  exportRAB: async (projectId, params) => {
    const response = await apiClient.get(`/projects/${projectId}/rab/export`, {
      params,
      responseType: 'blob' // Important for file downloads
    });
    return response;
  },
  importRAB: (formData) => apiService.post(`/projects/rab/import`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  approveRAB: (projectId, data) => apiService.post(`/projects/${projectId}/rab/approve`, data),
  
  // Milestone endpoints
  getMilestones: (projectId) => apiService.get(`/projects/${projectId}/milestones`),
  createMilestone: (projectId, data) => apiService.post(`/projects/${projectId}/milestones`, data),
  updateMilestone: (projectId, milestoneId, data) => apiService.put(`/projects/${projectId}/milestones/${milestoneId}`, data),
  deleteMilestone: (projectId, milestoneId) => apiService.delete(`/projects/${projectId}/milestones/${milestoneId}`),
  approveMilestone: (projectId, milestoneId) => apiService.put(`/projects/${projectId}/milestones/${milestoneId}/approve`, {}),
  
  // Team management endpoints
  getTeamMembers: (projectId) => apiService.get(`/projects/${projectId}/team`),
  addTeamMember: (projectId, data) => apiService.post(`/projects/${projectId}/team`, data),
  updateTeamMember: (projectId, memberId, data) => apiService.put(`/projects/${projectId}/team/${memberId}`, data),
  removeTeamMember: (projectId, memberId) => apiService.delete(`/projects/${projectId}/team/${memberId}`),
  
  // Document endpoints
  getDocuments: (projectId) => apiService.get(`/projects/${projectId}/documents`),
  uploadDocument: async (projectId, formData) => {
    try {
      // Use direct apiClient call for file upload
      const response = await apiClient.post(`/projects/${projectId}/documents`, formData);
      return response.data;
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload document');
    }
  },
  updateDocument: (projectId, docId, data) => apiService.put(`/projects/${projectId}/documents/${docId}`, data),
  deleteDocument: (projectId, docId) => apiService.delete(`/projects/${projectId}/documents/${docId}`),
  downloadDocument: async (projectId, docId) => {
    const response = await apiClient.get(`/projects/${projectId}/documents/${docId}/download`, {
      responseType: 'blob'
    });
    return response;
  },
  
  // Berita Acara endpoints
  getBeritaAcara: (projectId) => apiService.get(`/projects/${projectId}/berita-acara`),
  getBeritaAcaraById: (projectId, baId) => apiService.get(`/projects/${projectId}/berita-acara/${baId}`),
  createBeritaAcara: (projectId, data) => apiService.post(`/projects/${projectId}/berita-acara`, data),
  updateBeritaAcara: (projectId, baId, data) => apiService.patch(`/projects/${projectId}/berita-acara/${baId}`, data),
  deleteBeritaAcara: (projectId, baId) => apiService.delete(`/projects/${projectId}/berita-acara/${baId}`),
  submitBeritaAcara: (projectId, baId, data) => apiService.post(`/projects/${projectId}/berita-acara/${baId}/submit`, data),
  approveBeritaAcara: (projectId, baId, data = {}) => apiService.patch(`/projects/${projectId}/berita-acara/${baId}/approve`, data),
  rejectBeritaAcara: (projectId, baId, data) => apiService.patch(`/projects/${projectId}/berita-acara/${baId}/reject`, data),
};

export const subsidiaryAPI = {
  getAll: (params) => apiService.get('/subsidiaries', params),
  getById: (id) => apiService.get(`/subsidiaries/${id}`),
  create: (data) => apiService.post('/subsidiaries', data),
  update: (id, data) => apiService.put(`/subsidiaries/${id}`, data),
  delete: (id) => apiService.delete(`/subsidiaries/${id}`),
  getStats: () => apiService.get('/subsidiaries/statistics'),
  getBySpecialization: (specialization) => apiService.get(`/subsidiaries?specialization=${specialization}`),
};

export const financeAPI = {
  getAll: (params) => apiService.get('/finance', params),
  getTransactions: (page = 1, limit = 10, params = {}) => {
    // Combine page/limit with other params
    const allParams = { 
      page, 
      limit, 
      ...params 
    };
    return apiService.get('/finance', allParams);
  },
  getById: (id) => apiService.get(`/finance/${id}`),
  create: (data) => apiService.post('/finance', data),
  update: (id, data) => apiService.put(`/finance/${id}`, data),
  delete: (id) => apiService.delete(`/finance/${id}`),
  deleteTransaction: (id) => apiService.delete(`/finance/${id}`),
  getByProject: (projectId) => apiService.get(`/finance?projectId=${projectId}`),
  getStatistics: () => apiService.get('/finance/statistics'),
  getFinancialReports: (params) => apiService.get('/finance/reports', params),
  getIncomeStatement: (params) => apiService.get('/finance/reports/income-statement', params),
};

export const taxAPI = {
  getAll: (params) => apiService.get('/tax', params),
  getById: (id) => apiService.get(`/tax/${id}`),
  create: (data) => apiService.post('/tax', data),
  update: (id, data) => apiService.put(`/tax/${id}`, data),
  delete: (id) => apiService.delete(`/tax/${id}`),
  getByPeriod: (period) => apiService.get(`/tax?period=${period}`),
  getByType: (type) => apiService.get(`/tax?type=${type}`),
};

export const purchaseOrderAPI = {
  getAll: (params) => apiService.get('/purchase-orders', params),
  getById: (id) => apiService.get(`/purchase-orders/${id}`),
  create: (data) => apiService.post('/purchase-orders', data),
  update: (id, data) => apiService.put(`/purchase-orders/${id}`, data),
  delete: (id) => apiService.delete(`/purchase-orders/${id}`),
  approve: (id, data) => apiService.put(`/purchase-orders/${id}/approve`, data),
  getByStatus: (status) => apiService.get(`/purchase-orders?status=${status}`),
};

export const userAPI = {
  getAll: (params) => apiService.get('/users', params),
  getById: (id) => apiService.get(`/users/${id}`),
  create: (data) => apiService.post('/users', data),
  update: (id, data) => apiService.put(`/users/${id}`, data),
  delete: (id) => apiService.delete(`/users/${id}`),
  getProfile: () => apiService.get('/users/profile'),
  updateProfile: (data) => apiService.put('/users/profile', data),
};

export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout'),
  refresh: () => apiService.post('/auth/refresh'),
  getProfile: () => apiService.get('/auth/profile'),
  updateProfile: (data) => apiService.put('/auth/profile', data),
};

export const subsidiariesAPI = {
  getAll: (params) => apiService.get('/subsidiaries', params),
  getById: (id) => apiService.get(`/subsidiaries/${id}`),
  create: (data) => apiService.post('/subsidiaries', data),
  update: (id, data) => apiService.put(`/subsidiaries/${id}`, data),
  delete: (id) => apiService.delete(`/subsidiaries/${id}`),
};

export const projectsAPI = {
  getAll: (params) => apiService.get('/projects', params),
  getById: (id) => apiService.get(`/projects/${id}`),
  create: (data) => apiService.post('/projects', data),
  update: (id, data) => apiService.put(`/projects/${id}`, data),
  delete: (id) => apiService.delete(`/projects/${id}`),
};

export const dashboardAPI = {
  getOverview: () => apiService.get('/dashboard/overview'),
  getStats: () => apiService.get('/dashboard/stats'),
  getMonthlyStats: (year) => apiService.get(`/dashboard/monthly-stats/${year}`),
  getRecentActivities: () => apiService.get('/dashboard/recent-activities'),
};

// Export default
export default apiService;

// Export apiClient for direct usage
export { apiClient };
