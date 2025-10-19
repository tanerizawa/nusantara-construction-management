/**
 * Performance Optimization Utilities
 * 
 * Provides functions for optimizing app performance based on:
 * - Battery status
 * - Network connection speed
 * - Device resources
 * - User preferences
 */

import { 
  isSlowConnection, 
  isLowBattery, 
  getConnectionInfo,
  getBatteryInfo,
  hasSufficientResources 
} from './browserDetection';

/**
 * Get recommended quality settings based on current conditions
 * @returns {Object} Quality settings for images, GPS, etc.
 */
export const getOptimalQualitySettings = async () => {
  const settings = {
    imageQuality: 0.85,
    imageMaxWidth: 1920,
    imageMaxHeight: 1080,
    gpsUpdateInterval: 5000, // 5 seconds
    gpsHighAccuracy: true,
    enableAnimations: true,
    enableAutoRefresh: true,
  };

  // Check battery status
  const battery = await getBatteryInfo();
  const lowBattery = await isLowBattery();

  if (lowBattery || (battery && battery.level < 20 && !battery.charging)) {
    // Low battery: reduce quality and frequency
    settings.imageQuality = 0.7;
    settings.imageMaxWidth = 1280;
    settings.imageMaxHeight = 720;
    settings.gpsUpdateInterval = 10000; // 10 seconds
    settings.gpsHighAccuracy = false;
    settings.enableAnimations = false;
    settings.enableAutoRefresh = false;
  }

  // Check network connection
  const slowConnection = isSlowConnection();
  const connection = getConnectionInfo();

  if (slowConnection || (connection && connection.saveData)) {
    // Slow connection: reduce data usage
    settings.imageQuality = 0.65;
    settings.imageMaxWidth = 1280;
    settings.imageMaxHeight = 720;
    settings.enableAutoRefresh = false;
  }

  // Check device resources
  const sufficientResources = hasSufficientResources();
  if (!sufficientResources) {
    // Low-end device: reduce processing
    settings.imageQuality = 0.7;
    settings.enableAnimations = false;
  }

  return settings;
};

/**
 * Optimize image quality based on current conditions
 * @param {Object} options - Original image options
 * @returns {Object} Optimized image options
 */
export const optimizeImageSettings = async (options = {}) => {
  const optimalSettings = await getOptimalQualitySettings();
  
  return {
    maxWidth: optimalSettings.imageMaxWidth,
    maxHeight: optimalSettings.imageMaxHeight,
    quality: optimalSettings.imageQuality,
    maxSizeMB: 1,
    ...options
  };
};

/**
 * Optimize GPS settings based on current conditions
 * @param {Object} options - Original GPS options
 * @returns {Object} Optimized GPS options
 */
export const optimizeGPSSettings = async (options = {}) => {
  const optimalSettings = await getOptimalQualitySettings();
  
  return {
    enableHighAccuracy: optimalSettings.gpsHighAccuracy,
    timeout: 15000,
    maximumAge: optimalSettings.gpsUpdateInterval,
    ...options
  };
};

/**
 * Check if animations should be enabled
 * @returns {boolean}
 */
export const shouldEnableAnimations = async () => {
  const settings = await getOptimalQualitySettings();
  
  // Also check user preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  return settings.enableAnimations && !prefersReducedMotion;
};

/**
 * Get recommended polling interval for updates
 * @returns {number} Interval in milliseconds
 */
export const getRecommendedPollingInterval = async () => {
  const settings = await getOptimalQualitySettings();
  
  if (!settings.enableAutoRefresh) {
    return null; // Disable auto-refresh
  }
  
  const lowBattery = await isLowBattery();
  const slowConnection = isSlowConnection();
  
  if (lowBattery) {
    return 60000; // 1 minute
  }
  
  if (slowConnection) {
    return 30000; // 30 seconds
  }
  
  return 15000; // 15 seconds (default)
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Throttle function for performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function} Throttled function
 */
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Lazy load image with placeholder
 * @param {string} src - Image source
 * @param {string} placeholder - Placeholder image
 * @returns {Promise<string>} Loaded image source
 */
export const lazyLoadImage = (src, placeholder = '') => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = reject;
    img.src = src;
    
    // Return placeholder immediately
    if (placeholder) {
      resolve(placeholder);
    }
  });
};

/**
 * Preload critical images
 * @param {string[]} imageUrls - Array of image URLs
 */
export const preloadImages = (imageUrls) => {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
};

/**
 * Check if device is idle (for background tasks)
 * @returns {Promise<boolean>}
 */
export const isDeviceIdle = async () => {
  // Check if page is visible
  if (document.hidden) {
    return true;
  }
  
  // Check if user is idle (no interaction for 5 minutes)
  // This is a simple implementation, can be enhanced
  return false;
};

/**
 * Optimize fetch requests based on connection
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise<Response>}
 */
export const optimizedFetch = async (url, options = {}) => {
  const connection = getConnectionInfo();
  
  // Add timeout for slow connections
  if (connection && (connection.effectiveType === '2g' || connection.effectiveType === 'slow-2g')) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 seconds
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(timeout);
      return response;
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  }
  
  return fetch(url, options);
};

/**
 * Monitor performance metrics
 * @returns {Object} Performance metrics
 */
export const getPerformanceMetrics = () => {
  if (!window.performance) {
    return null;
  }
  
  const navigation = performance.getEntriesByType('navigation')[0];
  const paint = performance.getEntriesByType('paint');
  
  return {
    // Navigation timing
    domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart,
    loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart,
    domInteractive: navigation?.domInteractive,
    
    // Paint timing
    firstPaint: paint.find(entry => entry.name === 'first-paint')?.startTime,
    firstContentfulPaint: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
    
    // Memory (if available)
    memory: performance.memory ? {
      usedJSHeapSize: performance.memory.usedJSHeapSize,
      totalJSHeapSize: performance.memory.totalJSHeapSize,
      jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    } : null
  };
};

/**
 * Log performance metrics to console
 */
export const logPerformanceMetrics = () => {
  const metrics = getPerformanceMetrics();
  if (metrics) {
    console.group('📊 Performance Metrics');
    console.log('DOM Content Loaded:', metrics.domContentLoaded?.toFixed(2), 'ms');
    console.log('Load Complete:', metrics.loadComplete?.toFixed(2), 'ms');
    console.log('First Paint:', metrics.firstPaint?.toFixed(2), 'ms');
    console.log('First Contentful Paint:', metrics.firstContentfulPaint?.toFixed(2), 'ms');
    if (metrics.memory) {
      console.log('JS Heap Used:', (metrics.memory.usedJSHeapSize / 1048576).toFixed(2), 'MB');
    }
    console.groupEnd();
  }
};

/**
 * Create a performance observer
 * @param {string} entryType - Type of entries to observe
 * @param {Function} callback - Callback function
 * @returns {PerformanceObserver}
 */
export const createPerformanceObserver = (entryType, callback) => {
  if (!window.PerformanceObserver) {
    return null;
  }
  
  try {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach(callback);
    });
    
    observer.observe({ entryTypes: [entryType] });
    return observer;
  } catch (error) {
    console.warn('PerformanceObserver not supported:', error);
    return null;
  }
};

/**
 * Battery-aware GPS tracking
 * Class to manage GPS updates based on battery status
 */
export class BatteryAwareGPSTracker {
  constructor() {
    this.watchId = null;
    this.interval = 5000;
    this.isTracking = false;
    this.onPositionUpdate = null;
    this.onError = null;
  }
  
  async start(onPositionUpdate, onError) {
    this.onPositionUpdate = onPositionUpdate;
    this.onError = onError;
    this.isTracking = true;
    
    await this.adjustUpdateInterval();
    this.startTracking();
    
    // Monitor battery changes
    if ('getBattery' in navigator) {
      const battery = await navigator.getBattery();
      battery.addEventListener('levelchange', () => this.adjustUpdateInterval());
      battery.addEventListener('chargingchange', () => this.adjustUpdateInterval());
    }
  }
  
  async adjustUpdateInterval() {
    const settings = await getOptimalQualitySettings();
    this.interval = settings.gpsUpdateInterval;
    
    // Restart tracking with new interval
    if (this.isTracking) {
      this.stopTracking();
      this.startTracking();
    }
  }
  
  startTracking() {
    if (!navigator.geolocation) return;
    
    const options = {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: this.interval
    };
    
    this.watchId = navigator.geolocation.watchPosition(
      this.onPositionUpdate,
      this.onError,
      options
    );
  }
  
  stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
  
  stop() {
    this.isTracking = false;
    this.stopTracking();
  }
}

export default {
  getOptimalQualitySettings,
  optimizeImageSettings,
  optimizeGPSSettings,
  shouldEnableAnimations,
  getRecommendedPollingInterval,
  debounce,
  throttle,
  lazyLoadImage,
  preloadImages,
  isDeviceIdle,
  optimizedFetch,
  getPerformanceMetrics,
  logPerformanceMetrics,
  createPerformanceObserver,
  BatteryAwareGPSTracker
};
