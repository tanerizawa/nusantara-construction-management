/**
 * SINGLE SOURCE OF TRUTH untuk konfigurasi API
 * PRODUCTION FIX: Hostname detection FIRST
 */

const getApiUrl = () => {
  // PRIORITAS 1: Production hostname detection (FIRST!)
  const hostname = window.location.hostname;
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    console.log('🌐 Production mode - using https://nusantaragroup.co/api');
    return 'https://nusantaragroup.co/api';
  }

  // PRIORITAS 2: Environment Variable
  if (process.env.REACT_APP_API_URL) {
    console.log('🔧 Using ENV API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // PRIORITAS 3: Development fallback
  console.log('🏠 Development mode - using /api');
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
  return `${BASE_URL}${path}`;
};

console.log('📊 Config:', {
  API_URL,
  BASE_URL,
  hostname: window.location.hostname
});
