/**
 * Deep Link Handler for Nusantara PWA
 * Handles app:// URLs and notification deep links
 * 
 * @module deepLinkHandler
 */

/**
 * Parse deep link URL and extract route and parameters
 * @param {string} url - Deep link URL (app://... or https://...)
 * @returns {Object} Parsed deep link data
 */
export const parseDeepLink = (url) => {
  try {
    // Handle both app:// and https:// schemes
    let parsedUrl;
    
    if (url.startsWith('app://')) {
      // Convert app:// to https:// for URL parsing
      parsedUrl = new URL(url.replace('app://', 'https://'));
    } else {
      parsedUrl = new URL(url);
    }

    const pathname = parsedUrl.pathname;
    const searchParams = Object.fromEntries(parsedUrl.searchParams);

    return {
      path: pathname,
      params: searchParams,
      fullUrl: url,
      isValid: true
    };
  } catch (error) {
    console.error('Failed to parse deep link:', error);
    return {
      path: '/',
      params: {},
      fullUrl: url,
      isValid: false,
      error: error.message
    };
  }
};

/**
 * Route mapping for deep links
 */
const ROUTE_MAP = {
  // Attendance routes
  '/attendance/leave-request': {
    route: '/attendance/leave-request',
    requiresAuth: true,
    allowedParams: ['id', 'action', 'status']
  },
  '/attendance/clock-in': {
    route: '/attendance/clock-in',
    requiresAuth: true,
    allowedParams: []
  },
  '/attendance/clock-out': {
    route: '/attendance/clock-out',
    requiresAuth: true,
    allowedParams: []
  },
  '/attendance/history': {
    route: '/attendance/history',
    requiresAuth: true,
    allowedParams: ['date', 'user_id']
  },
  
  // Project routes
  '/projects': {
    route: '/projects',
    requiresAuth: true,
    allowedParams: ['id']
  },
  '/projects/detail': {
    route: '/projects/detail',
    requiresAuth: true,
    allowedParams: ['id']
  },
  
  // RAB routes
  '/rab': {
    route: '/rab',
    requiresAuth: true,
    allowedParams: ['project_id']
  },
  '/rab/detail': {
    route: '/rab/detail',
    requiresAuth: true,
    allowedParams: ['id']
  },
  
  // Notification routes
  '/notifications': {
    route: '/notifications',
    requiresAuth: true,
    allowedParams: ['id']
  },
  
  // Profile routes
  '/profile': {
    route: '/profile',
    requiresAuth: true,
    allowedParams: []
  },
  
  // Dashboard (default)
  '/dashboard': {
    route: '/dashboard',
    requiresAuth: true,
    allowedParams: []
  }
};

/**
 * Validate and map deep link to application route
 * @param {Object} deepLink - Parsed deep link data
 * @returns {Object} Route configuration
 */
export const mapDeepLinkToRoute = (deepLink) => {
  const { path, params, isValid } = deepLink;

  if (!isValid) {
    return {
      route: '/dashboard',
      params: {},
      requiresAuth: true,
      error: 'Invalid deep link'
    };
  }

  // Find matching route
  const routeConfig = ROUTE_MAP[path];

  if (!routeConfig) {
    console.warn('Unknown deep link path:', path);
    return {
      route: '/dashboard',
      params: {},
      requiresAuth: true,
      error: 'Unknown route'
    };
  }

  // Filter params to only allowed ones
  const filteredParams = {};
  routeConfig.allowedParams.forEach(param => {
    if (params[param]) {
      filteredParams[param] = params[param];
    }
  });

  return {
    route: routeConfig.route,
    params: filteredParams,
    requiresAuth: routeConfig.requiresAuth
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean}
 */
export const isUserAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return false;
  }

  try {
    // Check token expiration
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiresAt = payload.exp * 1000;
    
    if (Date.now() >= expiresAt) {
      console.warn('Token expired');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to validate token:', error);
    return false;
  }
};

/**
 * Handle deep link navigation
 * @param {string} url - Deep link URL
 * @param {Function} navigate - React Router navigate function
 * @returns {Promise<boolean>} Success status
 */
export const handleDeepLink = async (url, navigate) => {
  console.log('📱 Handling deep link:', url);

  try {
    // Parse deep link
    const deepLink = parseDeepLink(url);
    
    if (!deepLink.isValid) {
      console.error('Invalid deep link:', deepLink.error);
      navigate('/dashboard');
      return false;
    }

    // Map to route
    const routeConfig = mapDeepLinkToRoute(deepLink);

    // Check authentication
    if (routeConfig.requiresAuth && !isUserAuthenticated()) {
      console.warn('Authentication required for:', routeConfig.route);
      
      // Store intended destination
      sessionStorage.setItem('redirectAfterLogin', JSON.stringify({
        route: routeConfig.route,
        params: routeConfig.params
      }));
      
      navigate('/login');
      return false;
    }

    // Build final URL with params
    let finalUrl = routeConfig.route;
    const paramKeys = Object.keys(routeConfig.params);
    
    if (paramKeys.length > 0) {
      const queryString = paramKeys
        .map(key => `${key}=${encodeURIComponent(routeConfig.params[key])}`)
        .join('&');
      finalUrl += `?${queryString}`;
    }

    console.log('✅ Navigating to:', finalUrl);
    
    // Navigate to route
    navigate(finalUrl, { 
      replace: false,
      state: { fromDeepLink: true }
    });

    return true;
  } catch (error) {
    console.error('Failed to handle deep link:', error);
    navigate('/dashboard');
    return false;
  }
};

/**
 * Handle notification action (approve/reject)
 * @param {Object} action - Action data
 * @returns {Promise<Object>} API response
 */
export const handleNotificationAction = async (action) => {
  const { type, leaveRequestId, actionType } = action;

  console.log('🔔 Handling notification action:', { type, leaveRequestId, actionType });

  try {
    if (type === 'leave_approval_request' && leaveRequestId && actionType) {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`/api/attendance/leave-request/${leaveRequestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: actionType === 'approve' ? 'approved' : 'rejected'
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to process action');
      }

      const data = await response.json();

      // Show success notification
      window.dispatchEvent(new CustomEvent('nusantara-notification', {
        detail: {
          title: actionType === 'approve' ? 'Leave Request Approved' : 'Leave Request Rejected',
          body: 'Action completed successfully',
          type: 'success',
          timestamp: new Date().toISOString(),
          data: {
            type: 'leave_action_result',
            leaveRequestId,
            action: actionType
          }
        }
      }));

      return {
        success: true,
        data
      };
    }

    throw new Error('Unsupported action type');
  } catch (error) {
    console.error('Failed to handle notification action:', error);

    // Show error notification
    window.dispatchEvent(new CustomEvent('nusantara-notification', {
      detail: {
        title: 'Action Failed',
        body: error.message,
        type: 'error',
        timestamp: new Date().toISOString(),
        data: {
          type: 'leave_action_error',
          error: error.message
        }
      }
    }));

    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Check and handle redirect after login
 * @param {Function} navigate - React Router navigate function
 * @returns {boolean} Whether redirect was handled
 */
export const handlePostLoginRedirect = (navigate) => {
  try {
    const redirectData = sessionStorage.getItem('redirectAfterLogin');
    
    if (!redirectData) {
      return false;
    }

    const { route, params } = JSON.parse(redirectData);
    
    // Clear redirect data
    sessionStorage.removeItem('redirectAfterLogin');

    // Build URL with params
    let finalUrl = route;
    const paramKeys = Object.keys(params || {});
    
    if (paramKeys.length > 0) {
      const queryString = paramKeys
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&');
      finalUrl += `?${queryString}`;
    }

    console.log('🔐 Redirecting after login to:', finalUrl);
    
    navigate(finalUrl, { replace: true });
    
    return true;
  } catch (error) {
    console.error('Failed to handle post-login redirect:', error);
    return false;
  }
};

/**
 * Register deep link listener for the app
 * @param {Function} navigate - React Router navigate function
 * @returns {Function} Cleanup function
 */
export const registerDeepLinkListener = (navigate) => {
  const handleMessage = (event) => {
    // Check if message is from service worker
    if (event.data && event.data.type === 'DEEP_LINK') {
      const { url } = event.data;
      handleDeepLink(url, navigate);
    }
  };

  // Listen for messages from service worker
  navigator.serviceWorker?.addEventListener('message', handleMessage);

  // Listen for custom deep link events
  const handleCustomEvent = (event) => {
    const { url } = event.detail;
    handleDeepLink(url, navigate);
  };

  window.addEventListener('nusantara-deep-link', handleCustomEvent);

  console.log('📱 Deep link listener registered');

  // Return cleanup function
  return () => {
    navigator.serviceWorker?.removeEventListener('message', handleMessage);
    window.removeEventListener('nusantara-deep-link', handleCustomEvent);
    console.log('📱 Deep link listener unregistered');
  };
};

export default {
  parseDeepLink,
  mapDeepLinkToRoute,
  isUserAuthenticated,
  handleDeepLink,
  handleNotificationAction,
  handlePostLoginRedirect,
  registerDeepLinkListener
};
