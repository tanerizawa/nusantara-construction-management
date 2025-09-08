// API utilities for backend communication
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
