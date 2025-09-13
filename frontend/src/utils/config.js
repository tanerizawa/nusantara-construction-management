/**
 * SINGLE SOURCE OF TRUTH untuk konfigurasi API
 * Semua komponen HARUS menggunakan file ini
 */

// Prioritas konfigurasi:
// 1. Environment Variable (tertinggi) 
// 2. Hostname detection (fallback)
// 3. Localhost default (terakhir)

const getApiUrl = () => {
  // PRIORITAS 1: Environment Variable dari Docker/Build
  if (process.env.REACT_APP_API_URL) {
    console.log('🔧 Using ENV API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // PRIORITAS 2: Production hostname detection  
  const hostname = window.location.hostname;
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    console.log('🌐 Production mode detected - using Apache proxy');
    return '/api';
  }

  // PRIORITAS 3: Development fallback
  console.log('🏠 Development fallback - using localhost');
  return 'http://localhost:5000/api';
};

// Export konstanta yang akan digunakan oleh semua komponen
export const API_URL = getApiUrl();
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// Logging untuk debugging
console.log('📊 Config Summary:', {
  API_URL,
  NODE_ENV,
  hostname: window.location.hostname,
  envApiUrl: process.env.REACT_APP_API_URL
});