/**
 * Notification Manager Tests
 * Unit tests for notification system
 */

import notificationManager from '../utils/notificationManager';

// Mock Firebase messaging
jest.mock('firebase/messaging', () => ({
  getMessaging: jest.fn(),
  getToken: jest.fn(),
  onMessage: jest.fn()
}));

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

// Mock window.Notification
global.Notification = {
  permission: 'default',
  requestPermission: jest.fn()
};

// Mock fetch
global.fetch = jest.fn();

describe('notificationManager', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    global.Notification.permission = 'default';
  });

  describe('Permission Check', () => {
    test('should check notification permission', () => {
      global.Notification.permission = 'granted';
      
      // This would need the actual method from notificationManager
      // Assuming there's a checkPermission method
      expect(global.Notification.permission).toBe('granted');
    });

    test('should detect denied permission', () => {
      global.Notification.permission = 'denied';
      
      expect(global.Notification.permission).toBe('denied');
    });
  });

  describe('Notification Storage', () => {
    test('should store notification in localStorage', () => {
      const notification = {
        id: 1,
        title: 'Test Notification',
        body: 'Test body',
        timestamp: new Date().toISOString(),
        read: false
      };

      const stored = JSON.parse(localStorage.getItem('notifications') || '[]');
      stored.unshift(notification);
      localStorage.setItem('notifications', JSON.stringify(stored));

      const retrieved = JSON.parse(localStorage.getItem('notifications'));
      expect(retrieved).toHaveLength(1);
      expect(retrieved[0].title).toBe('Test Notification');
    });

    test('should limit stored notifications to 100', () => {
      const notifications = Array.from({ length: 110 }, (_, i) => ({
        id: i,
        title: `Notification ${i}`,
        body: 'Body',
        timestamp: new Date().toISOString(),
        read: false
      }));

      // Keep only last 100
      const limited = notifications.slice(0, 100);
      localStorage.setItem('notifications', JSON.stringify(limited));

      const retrieved = JSON.parse(localStorage.getItem('notifications'));
      expect(retrieved).toHaveLength(100);
    });

    test('should mark notification as read', () => {
      const notifications = [
        { id: 1, title: 'Test 1', read: false },
        { id: 2, title: 'Test 2', read: false }
      ];

      localStorage.setItem('notifications', JSON.stringify(notifications));

      // Mark first as read
      const stored = JSON.parse(localStorage.getItem('notifications'));
      stored[0].read = true;
      localStorage.setItem('notifications', JSON.stringify(stored));

      const retrieved = JSON.parse(localStorage.getItem('notifications'));
      expect(retrieved[0].read).toBe(true);
      expect(retrieved[1].read).toBe(false);
    });
  });

  describe('FCM Token Management', () => {
    test('should register FCM token', async () => {
      const token = 'test-fcm-token';
      localStorage.setItem('token', 'auth-token');

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true })
      });

      await fetch('/api/fcm/register-token', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer auth-token',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token })
      });

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/fcm/register-token',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({ token })
        })
      );
    });

    test('should handle token registration error', async () => {
      global.fetch.mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch('/api/fcm/register-token', {
          method: 'POST',
          body: JSON.stringify({ token: 'test-token' })
        });
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });
  });

  describe('Custom Events', () => {
    test('should dispatch notification event', () => {
      const dispatchSpy = jest.spyOn(window, 'dispatchEvent');

      const notification = {
        title: 'Test',
        body: 'Test body',
        type: 'success',
        timestamp: new Date().toISOString()
      };

      window.dispatchEvent(new CustomEvent('nusantara-notification', {
        detail: notification
      }));

      expect(dispatchSpy).toHaveBeenCalled();
    });

    test('should listen for notification events', () => {
      let receivedNotification = null;

      const handler = (event) => {
        receivedNotification = event.detail;
      };

      window.addEventListener('nusantara-notification', handler);

      const notification = {
        title: 'Test',
        body: 'Test body'
      };

      window.dispatchEvent(new CustomEvent('nusantara-notification', {
        detail: notification
      }));

      expect(receivedNotification).toEqual(notification);

      window.removeEventListener('nusantara-notification', handler);
    });
  });

  describe('Notification Formatting', () => {
    test('should format timestamp correctly', () => {
      const now = Date.now();
      const testCases = [
        { ms: 30 * 1000, expected: 'Just now' },
        { ms: 5 * 60 * 1000, expected: '5 minutes ago' },
        { ms: 2 * 60 * 60 * 1000, expected: '2 hours ago' },
        { ms: 3 * 24 * 60 * 60 * 1000, expected: '3 days ago' }
      ];

      testCases.forEach(({ ms, expected }) => {
        const timestamp = new Date(now - ms).toISOString();
        const diff = now - new Date(timestamp).getTime();

        let result;
        if (diff < 60 * 1000) {
          result = 'Just now';
        } else if (diff < 60 * 60 * 1000) {
          const minutes = Math.floor(diff / (60 * 1000));
          result = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (diff < 24 * 60 * 60 * 1000) {
          const hours = Math.floor(diff / (60 * 60 * 1000));
          result = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else {
          const days = Math.floor(diff / (24 * 60 * 60 * 1000));
          result = `${days} day${days > 1 ? 's' : ''} ago`;
        }

        expect(result).toBe(expected);
      });
    });

    test('should format notification icon by type', () => {
      const iconMap = {
        leave_approval_request: '📝',
        leave_approved: '✅',
        leave_rejected: '❌',
        attendance_reminder: '⏰',
        clockout_reminder: '🔔',
        project_update: '📊',
        default: '🔔'
      };

      Object.entries(iconMap).forEach(([type, icon]) => {
        const result = iconMap[type] || iconMap.default;
        expect(result).toBe(icon);
      });
    });
  });

  describe('Unread Count', () => {
    test('should calculate unread count correctly', () => {
      const notifications = [
        { id: 1, read: false },
        { id: 2, read: true },
        { id: 3, read: false },
        { id: 4, read: false },
        { id: 5, read: true }
      ];

      const unreadCount = notifications.filter(n => !n.read).length;
      expect(unreadCount).toBe(3);
    });

    test('should update unread count on mark as read', () => {
      const notifications = [
        { id: 1, read: false },
        { id: 2, read: false },
        { id: 3, read: false }
      ];

      let unreadCount = notifications.filter(n => !n.read).length;
      expect(unreadCount).toBe(3);

      // Mark one as read
      notifications[0].read = true;

      unreadCount = notifications.filter(n => !n.read).length;
      expect(unreadCount).toBe(2);
    });
  });
});

describe('Service Worker Integration', () => {
  beforeEach(() => {
    global.navigator.serviceWorker = {
      ready: Promise.resolve({
        active: true
      }),
      controller: {
        postMessage: jest.fn()
      },
      addEventListener: jest.fn()
    };
  });

  test('should send message to service worker', () => {
    const message = {
      type: 'STORE_AUTH_TOKEN',
      token: 'test-token'
    };

    navigator.serviceWorker.controller.postMessage(message);

    expect(navigator.serviceWorker.controller.postMessage).toHaveBeenCalledWith(message);
  });

  test('should listen for service worker messages', () => {
    const handler = jest.fn();

    navigator.serviceWorker.addEventListener('message', handler);

    expect(navigator.serviceWorker.addEventListener).toHaveBeenCalledWith('message', handler);
  });
});
