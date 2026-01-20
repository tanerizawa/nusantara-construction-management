/**
 * SINGLE SOURCE OF TRUTH untuk konfigurasi API
 * PRODUCTION FIX: Hostname detection FIRST
 * Updated: 2025-12-21 - Removed console.log in production
 */

// Helper to check if we're in production
const isProduction = () => {
  const hostname = window.location.hostname;
  return hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup');
};

const getApiUrl = () => {
  // PRIORITAS 1: Production hostname detection (FIRST!)
  if (isProduction()) {
    return 'https://nusantaragroup.co/api';
  }

  // PRIORITAS 2: Environment Variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // PRIORITAS 3: Development fallback
  return '/api';
};

export const API_URL = getApiUrl();
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const BASE_URL = (() => {
  const hostname = window.location.hostname;
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    return 'https://nusantaragroup.co';
  }
  return 'http://localhost:5000';
})();

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // For production, use relative URL to leverage Apache proxy
  if (isProduction()) {
    // Return path as-is, browser will use current protocol + domain
    return path;
  }
  
  // Development: prepend full BASE_URL
  return `${BASE_URL}${path}`;
};

// Only log in development mode (local development, not production)
if (process.env.NODE_ENV === 'development' && !isProduction()) {
  console.log('📊 Config:', {
    API_URL,
    BASE_URL,
    hostname: window.location.hostname
  });
}
