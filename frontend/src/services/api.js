import axios from 'axios';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor untuk authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Generic API methods
const apiService = {
  // GET request
  get: async (endpoint, params = {}) => {
    try {
      const response = await apiClient.get(endpoint, { params });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch data');
    }
  },

  // POST request
  post: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create data');
    }
  },

  // PUT request
  put: async (endpoint, data = {}) => {
    try {
      const response = await apiClient.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update data');
    }
  },

  // DELETE request
  delete: async (endpoint) => {
    try {
      const response = await apiClient.delete(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete data');
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
  getAll: (params) => apiService.get('/employees', params),
  getById: (id) => apiService.get(`/employees/${id}`),
  create: (data) => apiService.post('/employees', data),
  update: (id, data) => apiService.put(`/employees/${id}`, data),
  delete: (id) => apiService.delete(`/employees/${id}`),
  getAttendance: (id, params) => apiService.get(`/employees/${id}/attendance`, params),
  getPerformance: (id, params) => apiService.get(`/employees/${id}/performance`, params),
};

export const projectAPI = {
  getAll: (params) => apiService.get('/projects', params),
  getById: (id) => apiService.get(`/projects/${id}`),
  create: (data) => apiService.post('/projects', data),
  update: (id, data) => apiService.put(`/projects/${id}`, data),
  delete: (id) => apiService.delete(`/projects/${id}`),
  getBudget: (id) => apiService.get(`/projects/${id}/budget`),
  updateBudget: (id, data) => apiService.put(`/projects/${id}/budget`, data),
};

export const financeAPI = {
  getOverview: (params) => apiService.get('/finance/overview', params),
  getTransactions: (params) => apiService.get('/finance/transactions', params),
  createTransaction: (data) => apiService.post('/finance/transactions', data),
  updateTransaction: (id, data) => apiService.put(`/finance/transactions/${id}`, data),
  deleteTransaction: (id) => apiService.delete(`/finance/transactions/${id}`),
  getBudgets: (params) => apiService.get('/finance/budgets', params),
  createBudget: (data) => apiService.post('/finance/budgets', data),
  updateBudget: (id, data) => apiService.put(`/finance/budgets/${id}`, data),
};

export const taxAPI = {
  getOverview: (params) => apiService.get('/tax/overview', params),
  getReports: (params) => apiService.get('/tax/reports', params),
  createReport: (data) => apiService.post('/tax/reports', data),
  updateReport: (id, data) => apiService.put(`/tax/reports/${id}`, data),
  getCalculations: (params) => apiService.get('/tax/calculations', params),
  calculateTax: (data) => apiService.post('/tax/calculate', data),
};

export const inventoryAPI = {
  getItems: (params) => apiService.get('/inventory/items', params),
  createItem: (data) => apiService.post('/inventory/items', data),
  updateItem: (id, data) => apiService.put(`/inventory/items/${id}`, data),
  deleteItem: (id) => apiService.delete(`/inventory/items/${id}`),
  getWarehouses: (params) => apiService.get('/inventory/warehouses', params),
  getCategories: (params) => apiService.get('/inventory/categories', params),
  getSuppliers: (params) => apiService.get('/inventory/suppliers', params),
};

export const authAPI = {
  login: (credentials) => apiService.post('/auth/login', credentials),
  logout: () => apiService.post('/auth/logout'),
  refresh: () => apiService.post('/auth/refresh'),
  getProfile: () => apiService.get('/auth/profile'),
  updateProfile: (data) => apiService.put('/auth/profile', data),
};

// Export default
export default apiService;
