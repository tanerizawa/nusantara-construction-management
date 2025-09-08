// API utilities for backend communication
// API Configuration - Consistent with other API files
const getApiUrl = () => {
  // If accessed from production domain, use relative path for Apache proxy
  if (window.location.hostname === 'nusantaragroup.co' || window.location.hostname.includes('nusantaragroup')) {
    return '/api';
  }
  
  // For localhost development
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend health check failed:', error);
    return false;
  }
};

export const isBackendAvailable = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    return false;
  }
};

const apiUtils = {
  checkBackendHealth,
  isBackendAvailable,
  API_URL
};

export default apiUtils;
