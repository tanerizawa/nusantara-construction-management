/**
 * Deep Link Handler Tests
 * Unit tests for deep linking functionality
 */

import {
  parseDeepLink,
  mapDeepLinkToRoute,
  isUserAuthenticated,
  handleDeepLink,
  handleNotificationAction
} from '../utils/deepLinkHandler';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value.toString(); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

global.sessionStorage = sessionStorageMock;

describe('parseDeepLink', () => {
  test('should parse app:// URL correctly', () => {
    const result = parseDeepLink('app://attendance/leave-request?id=123');
    
    expect(result.isValid).toBe(true);
    expect(result.path).toBe('/attendance/leave-request');
    expect(result.params).toEqual({ id: '123' });
    expect(result.fullUrl).toBe('app://attendance/leave-request?id=123');
  });

  test('should parse https:// URL correctly', () => {
    const result = parseDeepLink('https://example.com/projects?id=456');
    
    expect(result.isValid).toBe(true);
    expect(result.path).toBe('/projects');
    expect(result.params).toEqual({ id: '456' });
  });

  test('should handle URL with multiple parameters', () => {
    const result = parseDeepLink('app://attendance/history?date=2024-10-19&user_id=789');
    
    expect(result.isValid).toBe(true);
    expect(result.params).toEqual({ 
      date: '2024-10-19', 
      user_id: '789' 
    });
  });

  test('should handle URL without parameters', () => {
    const result = parseDeepLink('app://dashboard');
    
    expect(result.isValid).toBe(true);
    expect(result.path).toBe('/dashboard');
    expect(result.params).toEqual({});
  });

  test('should handle invalid URL', () => {
    const result = parseDeepLink('invalid-url');
    
    expect(result.isValid).toBe(false);
    expect(result.error).toBeDefined();
  });
});

describe('mapDeepLinkToRoute', () => {
  test('should map valid route correctly', () => {
    const deepLink = {
      path: '/attendance/leave-request',
      params: { id: '123' },
      isValid: true
    };
    
    const result = mapDeepLinkToRoute(deepLink);
    
    expect(result.route).toBe('/attendance/leave-request');
    expect(result.params).toEqual({ id: '123' });
    expect(result.requiresAuth).toBe(true);
  });

  test('should filter disallowed parameters', () => {
    const deepLink = {
      path: '/attendance/leave-request',
      params: { 
        id: '123', 
        malicious: 'script',
        action: 'approve'
      },
      isValid: true
    };
    
    const result = mapDeepLinkToRoute(deepLink);
    
    // Only id and action should be allowed
    expect(result.params).toEqual({ 
      id: '123',
      action: 'approve'
    });
    expect(result.params.malicious).toBeUndefined();
  });

  test('should fallback to dashboard for unknown route', () => {
    const deepLink = {
      path: '/unknown/route',
      params: {},
      isValid: true
    };
    
    const result = mapDeepLinkToRoute(deepLink);
    
    expect(result.route).toBe('/dashboard');
    expect(result.error).toBeDefined();
  });

  test('should handle invalid deep link', () => {
    const deepLink = {
      path: '/some/path',
      params: {},
      isValid: false
    };
    
    const result = mapDeepLinkToRoute(deepLink);
    
    expect(result.route).toBe('/dashboard');
    expect(result.error).toBeDefined();
  });
});

describe('isUserAuthenticated', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('should return false when no token', () => {
    expect(isUserAuthenticated()).toBe(false);
  });

  test('should return false when no user data', () => {
    localStorage.setItem('token', 'some-token');
    
    expect(isUserAuthenticated()).toBe(false);
  });

  test('should return true with valid token', () => {
    // Create a valid JWT token (not expired)
    const payload = {
      userId: 1,
      exp: Math.floor(Date.now() / 1000) + 3600 // expires in 1 hour
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    expect(isUserAuthenticated()).toBe(true);
  });

  test('should return false with expired token', () => {
    // Create an expired JWT token
    const payload = {
      userId: 1,
      exp: Math.floor(Date.now() / 1000) - 3600 // expired 1 hour ago
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test User' }));
    
    expect(isUserAuthenticated()).toBe(false);
  });
});

describe('handleDeepLink', () => {
  let mockNavigate;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mockNavigate = jest.fn();
  });

  test('should navigate to route when authenticated', async () => {
    // Setup valid authentication
    const payload = {
      userId: 1,
      exp: Math.floor(Date.now() / 1000) + 3600
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    const url = 'app://attendance/leave-request?id=123';
    const result = await handleDeepLink(url, mockNavigate);

    expect(result).toBe(true);
    expect(mockNavigate).toHaveBeenCalledWith(
      '/attendance/leave-request?id=123',
      expect.objectContaining({ 
        replace: false,
        state: { fromDeepLink: true }
      })
    );
  });

  test('should redirect to login when not authenticated', async () => {
    const url = 'app://attendance/leave-request?id=123';
    const result = await handleDeepLink(url, mockNavigate);

    expect(result).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
    
    // Check that redirect is stored
    const redirect = sessionStorage.getItem('redirectAfterLogin');
    expect(redirect).toBeDefined();
    
    const redirectData = JSON.parse(redirect);
    expect(redirectData.route).toBe('/attendance/leave-request');
    expect(redirectData.params).toEqual({ id: '123' });
  });

  test('should fallback to dashboard on invalid URL', async () => {
    const url = 'invalid-url';
    const result = await handleDeepLink(url, mockNavigate);

    expect(result).toBe(false);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

describe('handleNotificationAction', () => {
  beforeEach(() => {
    localStorage.clear();
    global.fetch = jest.fn();
    global.window.dispatchEvent = jest.fn();
  });

  test('should approve leave request successfully', async () => {
    const token = 'valid-token';
    localStorage.setItem('token', token);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: { id: 123, status: 'approved' } 
      })
    });

    const result = await handleNotificationAction({
      type: 'leave_approval_request',
      leaveRequestId: 123,
      actionType: 'approve'
    });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/attendance/leave-request/123',
      expect.objectContaining({
        method: 'PUT',
        headers: expect.objectContaining({
          'Authorization': `Bearer ${token}`
        }),
        body: JSON.stringify({ status: 'approved' })
      })
    );

    // Check success notification dispatched
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  test('should reject leave request successfully', async () => {
    const token = 'valid-token';
    localStorage.setItem('token', token);

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ 
        success: true, 
        data: { id: 123, status: 'rejected' } 
      })
    });

    const result = await handleNotificationAction({
      type: 'leave_approval_request',
      leaveRequestId: 123,
      actionType: 'reject'
    });

    expect(result.success).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/attendance/leave-request/123',
      expect.objectContaining({
        body: JSON.stringify({ status: 'rejected' })
      })
    );
  });

  test('should handle API error', async () => {
    localStorage.setItem('token', 'valid-token');

    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Not found' })
    });

    const result = await handleNotificationAction({
      type: 'leave_approval_request',
      leaveRequestId: 999,
      actionType: 'approve'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();

    // Check error notification dispatched
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  test('should require authentication', async () => {
    const result = await handleNotificationAction({
      type: 'leave_approval_request',
      leaveRequestId: 123,
      actionType: 'approve'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Authentication required');
  });

  test('should handle unsupported action type', async () => {
    localStorage.setItem('token', 'valid-token');

    const result = await handleNotificationAction({
      type: 'unknown_type',
      leaveRequestId: 123,
      actionType: 'approve'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Unsupported action type');
  });
});

// Test edge cases
describe('Edge Cases', () => {
  test('should handle URL with special characters', () => {
    const result = parseDeepLink('app://search?q=hello%20world&filter=new');
    
    expect(result.isValid).toBe(true);
    expect(result.params.q).toBe('hello world');
    expect(result.params.filter).toBe('new');
  });

  test('should handle URL with hash fragment', () => {
    const result = parseDeepLink('app://projects?id=123#section-2');
    
    expect(result.isValid).toBe(true);
    expect(result.params.id).toBe('123');
  });

  test('should handle empty query parameters', () => {
    const result = parseDeepLink('app://dashboard?');
    
    expect(result.isValid).toBe(true);
    expect(result.params).toEqual({});
  });

  test('should handle malformed JWT token', () => {
    localStorage.setItem('token', 'not-a-valid-jwt');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));
    
    expect(isUserAuthenticated()).toBe(false);
  });
});
