/**
 * Browser Detection & Feature Support Utilities
 * 
 * Provides functions to detect browser capabilities and features
 * for implementing graceful degradation and fallbacks.
 * 
 * Usage:
 * import { hasFeature, getBrowserInfo, isSupported } from './browserDetection';
 * 
 * if (hasFeature('camera')) {
 *   // Use camera API
 * } else {
 *   // Show file input fallback
 * }
 */

/**
 * Detect if running in browser environment
 */
export const isBrowser = () => {
  return typeof window !== 'undefined' && typeof navigator !== 'undefined';
};

/**
 * Get detailed browser information
 */
export const getBrowserInfo = () => {
  if (!isBrowser()) return null;

  const ua = navigator.userAgent;
  
  return {
    userAgent: ua,
    vendor: navigator.vendor,
    platform: navigator.platform,
    language: navigator.language,
    languages: navigator.languages,
    online: navigator.onLine,
    cookieEnabled: navigator.cookieEnabled,
    deviceMemory: navigator.deviceMemory,
    hardwareConcurrency: navigator.hardwareConcurrency,
    maxTouchPoints: navigator.maxTouchPoints,
    
    // Browser detection
    isChrome: /Chrome/.test(ua) && /Google Inc/.test(navigator.vendor),
    isFirefox: /Firefox/.test(ua),
    isSafari: /Safari/.test(ua) && !/Chrome/.test(ua),
    isEdge: /Edg/.test(ua),
    isOpera: /OPR/.test(ua),
    isIE: /MSIE|Trident/.test(ua),
    
    // OS detection
    isWindows: /Win/.test(navigator.platform),
    isMac: /Mac/.test(navigator.platform),
    isLinux: /Linux/.test(navigator.platform),
    isAndroid: /Android/.test(ua),
    isIOS: /iPhone|iPad|iPod/.test(ua),
    
    // Device type
    isMobile: /Mobile|Android|iPhone|iPad|iPod/.test(ua),
    isTablet: /iPad|Android/.test(ua) && !/Mobile/.test(ua),
    isDesktop: !/Mobile|Android|iPhone|iPad|iPod/.test(ua),
    
    // Screen info
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    pixelRatio: window.devicePixelRatio || 1,
    
    // Connection info
    connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection,
  };
};

/**
 * Feature detection object
 */
export const features = {
  // PWA Features
  serviceWorker: () => 'serviceWorker' in navigator,
  
  // Camera & Media
  camera: () => !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
  mediaRecorder: () => typeof MediaRecorder !== 'undefined',
  imageCapture: () => typeof ImageCapture !== 'undefined',
  
  // Geolocation
  geolocation: () => 'geolocation' in navigator,
  geolocationWatchPosition: () => {
    return 'geolocation' in navigator && typeof navigator.geolocation.watchPosition === 'function';
  },
  
  // Storage
  localStorage: () => {
    try {
      const test = '__test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },
  sessionStorage: () => {
    try {
      const test = '__test__';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  },
  indexedDB: () => 'indexedDB' in window,
  
  // Notifications
  notifications: () => 'Notification' in window,
  notificationPermission: () => {
    return 'Notification' in window && Notification.permission === 'granted';
  },
  pushManager: () => 'PushManager' in window,
  
  // File APIs
  fileReader: () => typeof FileReader !== 'undefined',
  formData: () => typeof FormData !== 'undefined',
  blob: () => typeof Blob !== 'undefined',
  
  // Network
  fetch: () => typeof fetch !== 'undefined',
  websocket: () => typeof WebSocket !== 'undefined',
  
  // Graphics
  canvas: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(canvas.getContext && canvas.getContext('2d'));
    } catch (e) {
      return false;
    }
  },
  webgl: () => {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  },
  
  // Sensors
  deviceOrientation: () => 'DeviceOrientationEvent' in window,
  deviceMotion: () => 'DeviceMotionEvent' in window,
  
  // Touch
  touchEvents: () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
  
  // Clipboard
  clipboard: () => navigator.clipboard !== undefined,
  clipboardWrite: () => navigator.clipboard && typeof navigator.clipboard.write === 'function',
  
  // Network Information
  networkInformation: () => 'connection' in navigator || 'mozConnection' in navigator,
  
  // Battery
  battery: () => 'getBattery' in navigator,
  
  // Vibration
  vibration: () => 'vibrate' in navigator,
  
  // Web Share
  share: () => navigator.share !== undefined,
  
  // Install Prompt
  beforeInstallPrompt: () => 'BeforeInstallPromptEvent' in window,
  
  // Payment
  paymentRequest: () => typeof PaymentRequest !== 'undefined',
  
  // Credential Management
  credentials: () => 'credentials' in navigator,
  
  // Web Assembly
  webAssembly: () => typeof WebAssembly !== 'undefined',
  
  // Intersection Observer
  intersectionObserver: () => typeof IntersectionObserver !== 'undefined',
  
  // Resize Observer
  resizeObserver: () => typeof ResizeObserver !== 'undefined',
  
  // Mutation Observer
  mutationObserver: () => typeof MutationObserver !== 'undefined',
  
  // Passive Event Listeners
  passiveEvents: () => {
    let passive = false;
    try {
      const options = {
        get passive() {
          passive = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passive = false;
    }
    return passive;
  },
};

/**
 * Check if a specific feature is supported
 * @param {string} featureName - Name of the feature to check
 * @returns {boolean} - Whether the feature is supported
 */
export const hasFeature = (featureName) => {
  if (!isBrowser()) return false;
  
  const feature = features[featureName];
  if (typeof feature === 'function') {
    try {
      return feature();
    } catch (e) {
      console.warn(`Feature detection for ${featureName} failed:`, e);
      return false;
    }
  }
  
  console.warn(`Unknown feature: ${featureName}`);
  return false;
};

/**
 * Check multiple features at once
 * @param {string[]} featureNames - Array of feature names
 * @returns {Object} - Object with feature names as keys and support status as values
 */
export const checkFeatures = (featureNames) => {
  return featureNames.reduce((acc, name) => {
    acc[name] = hasFeature(name);
    return acc;
  }, {});
};

/**
 * Get all feature support status
 * @returns {Object} - Object with all features and their support status
 */
export const getAllFeatures = () => {
  return Object.keys(features).reduce((acc, name) => {
    acc[name] = hasFeature(name);
    return acc;
  }, {});
};

/**
 * Check if all required features are supported
 * @param {string[]} requiredFeatures - Array of required feature names
 * @returns {Object} - { supported: boolean, missing: string[] }
 */
export const isSupported = (requiredFeatures) => {
  const missing = requiredFeatures.filter(feature => !hasFeature(feature));
  return {
    supported: missing.length === 0,
    missing
  };
};

/**
 * Get connection information
 */
export const getConnectionInfo = () => {
  if (!isBrowser()) return null;
  
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (!connection) return null;
  
  return {
    effectiveType: connection.effectiveType, // '4g', '3g', '2g', 'slow-2g'
    downlink: connection.downlink, // Mbps
    downlinkMax: connection.downlinkMax,
    rtt: connection.rtt, // Round-trip time in ms
    saveData: connection.saveData, // Data saver mode
    type: connection.type, // 'wifi', 'cellular', etc.
  };
};

/**
 * Check if user is on slow connection
 */
export const isSlowConnection = () => {
  const connection = getConnectionInfo();
  if (!connection) return false;
  
  return (
    connection.saveData === true ||
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.rtt > 1000 ||
    connection.downlink < 0.5
  );
};

/**
 * Check if user is on mobile data
 */
export const isMobileConnection = () => {
  const connection = getConnectionInfo();
  return connection && connection.type === 'cellular';
};

/**
 * Check if device has sufficient resources
 */
export const hasSufficientResources = () => {
  if (!isBrowser()) return true;
  
  const memory = navigator.deviceMemory; // GB
  const cores = navigator.hardwareConcurrency;
  
  // Minimum requirements
  const minMemory = 2; // GB
  const minCores = 2;
  
  return (
    (!memory || memory >= minMemory) &&
    (!cores || cores >= minCores)
  );
};

/**
 * Detect if running as PWA (installed)
 */
export const isPWA = () => {
  if (!isBrowser()) return false;
  
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
};

/**
 * Check if device is in portrait mode
 */
export const isPortrait = () => {
  if (!isBrowser()) return false;
  return window.innerHeight > window.innerWidth;
};

/**
 * Check if device is in landscape mode
 */
export const isLandscape = () => {
  if (!isBrowser()) return false;
  return window.innerWidth > window.innerHeight;
};

/**
 * Get battery status (if supported)
 */
export const getBatteryInfo = async () => {
  if (!hasFeature('battery')) return null;
  
  try {
    const battery = await navigator.getBattery();
    return {
      level: battery.level * 100, // Percentage
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
    };
  } catch (e) {
    console.warn('Battery API not available:', e);
    return null;
  }
};

/**
 * Check if battery is low
 */
export const isLowBattery = async () => {
  const battery = await getBatteryInfo();
  if (!battery) return false;
  
  return battery.level < 20 && !battery.charging;
};

/**
 * Feature availability summary for debugging
 */
export const getFeatureSummary = () => {
  const browser = getBrowserInfo();
  const allFeatures = getAllFeatures();
  const connection = getConnectionInfo();
  
  return {
    browser,
    features: allFeatures,
    connection,
    isPWA: isPWA(),
    isSlowConnection: isSlowConnection(),
    hasSufficientResources: hasSufficientResources(),
  };
};

/**
 * Log feature support to console (for debugging)
 */
export const logFeatureSupport = () => {
  const summary = getFeatureSummary();
  console.group('🔍 Browser Feature Support');
  console.log('Browser:', summary.browser);
  console.log('Features:', summary.features);
  console.log('Connection:', summary.connection);
  console.log('Is PWA:', summary.isPWA);
  console.log('Slow Connection:', summary.isSlowConnection);
  console.log('Sufficient Resources:', summary.hasSufficientResources);
  console.groupEnd();
};

export default {
  isBrowser,
  getBrowserInfo,
  hasFeature,
  checkFeatures,
  getAllFeatures,
  isSupported,
  getConnectionInfo,
  isSlowConnection,
  isMobileConnection,
  hasSufficientResources,
  isPWA,
  isPortrait,
  isLandscape,
  getBatteryInfo,
  isLowBattery,
  getFeatureSummary,
  logFeatureSupport,
};
