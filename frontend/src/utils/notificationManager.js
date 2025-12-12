// Notification Manager
// Centralized notification handling for Nusantara PWA

import {
  requestNotificationPermission,
  registerFCMToken,
  unregisterFCMToken,
  onForegroundMessage,
  isNotificationSupported,
  getNotificationPermission
} from '../firebase/firebaseConfig';

class NotificationManager {
  constructor() {
    this.fcmToken = null;
    this.unsubscribeForeground = null;
    this.notificationQueue = [];
    this.isInitialized = false;
  }

  /**
   * Initialize notification system
   * Called when user logs in or app starts
   */
  async initialize() {
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔔 Initializing NotificationManager...');
      }

      // Check if notifications are supported
      if (!isNotificationSupported()) {
        console.warn('⚠️ Notifications not supported in this browser');
        return false;
      }

      // Check current permission
      const currentPermission = getNotificationPermission();
      if (process.env.NODE_ENV === 'development') {
        console.log('📋 Current notification permission:', currentPermission);
      }

      // If already granted, register token
      if (currentPermission === 'granted') {
        await this.registerToken();
      }

      // Listen for foreground messages
      this.listenForMessages();

      this.isInitialized = true;
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ NotificationManager initialized successfully');
      }
      return true;
    } catch (error) {
      console.error('❌ Error initializing NotificationManager:', error);
      return false;
    }
  }

  /**
   * Request notification permission from user
   * Shows browser permission dialog
   */
  async requestPermission() {
    try {
      console.log('🔔 Requesting notification permission...');

      const token = await requestNotificationPermission();
      
      if (token) {
        this.fcmToken = token;
        
        // Register token with backend
        await registerFCMToken(token);
        
        console.log('✅ Notification permission granted and token registered');
        return true;
      } else {
        console.warn('⚠️ No FCM token received');
        return false;
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      
      // Show user-friendly error
      if (error.message.includes('denied')) {
        this.showInAppNotification({
          title: 'Notifications Blocked',
          body: 'Please enable notifications in your browser settings to receive important updates.',
          type: 'warning'
        });
      }
      
      return false;
    }
  }

  /**
   * Register FCM token
   * Called after permission granted
   */
  async registerToken() {
    try {
      if (!this.fcmToken) {
        const token = await requestNotificationPermission();
        if (token) {
          this.fcmToken = token;
        } else {
          throw new Error('Failed to get FCM token');
        }
      }

      await registerFCMToken(this.fcmToken);
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ FCM token registered');
      }
      return true;
    } catch (error) {
      console.error('❌ Error registering FCM token:', error);
      return false;
    }
  }

  /**
   * Listen for foreground messages
   * Shows in-app notifications when app is open
   */
  listenForMessages() {
    if (this.unsubscribeForeground) {
      this.unsubscribeForeground();
    }

    this.unsubscribeForeground = onForegroundMessage((payload) => {
      console.log('📩 Foreground message received:', payload);

      // Show in-app notification
      this.showInAppNotification({
        title: payload.title,
        body: payload.options.body,
        type: this.getNotificationType(payload.data),
        data: payload.data,
        onClick: () => this.handleNotificationClick(payload.data)
      });

      // Also show browser notification if permission granted
      if (getNotificationPermission() === 'granted') {
        new Notification(payload.title, payload.options);
      }
    });

    console.log('👂 Listening for foreground messages');
  }

  /**
   * Show in-app notification
   * Uses react-toastify or custom notification component
   */
  showInAppNotification({ title, body, type = 'info', data = {}, onClick }) {
    const notification = {
      id: Date.now(),
      title,
      body,
      type,
      data,
      timestamp: new Date(),
      onClick
    };

    // Add to queue
    this.notificationQueue.push(notification);

    // Emit custom event for React components to listen
    const event = new CustomEvent('nusantara-notification', {
      detail: notification
    });
    window.dispatchEvent(event);

    console.log('📱 In-app notification shown:', notification);
  }

  /**
   * Handle notification click
   * Navigate to appropriate page based on notification type
   */
  handleNotificationClick(data) {
    const { type, leaveRequestId, clickAction } = data;

    // Determine navigation URL
    let url = '/';

    switch (type) {
      case 'leave_approval_request':
        url = `/attendance/leave-request?id=${leaveRequestId}`;
        break;
      case 'leave_approved':
      case 'leave_rejected':
        url = '/attendance/leave-request';
        break;
      case 'attendance_reminder':
        url = '/attendance/clock-in';
        break;
      case 'clockout_reminder':
        url = '/attendance/clock-out';
        break;
      case 'approval_request':
        url = `/approval/${data.approvalId}`;
        break;
      default:
        url = clickAction || '/notifications';
    }

    // Navigate using React Router or window.location
    if (window.location.pathname !== url) {
      window.location.href = url;
    }
  }

  /**
   * Get notification type for styling
   */
  getNotificationType(data) {
    const { type } = data;

    if (type?.includes('approved')) return 'success';
    if (type?.includes('rejected')) return 'error';
    if (type?.includes('reminder')) return 'warning';
    if (type?.includes('request')) return 'info';
    
    return 'info';
  }

  /**
   * Send test notification
   * For development/testing purposes
   */
  async sendTestNotification() {
    try {
      const authToken = localStorage.getItem('token');
      if (!authToken) {
        throw new Error('User not authenticated');
      }

      const response = await fetch('/api/fcm-notifications/test', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to send test notification');
      }

      const data = await response.json();
      console.log('✅ Test notification sent:', data);
      return true;
    } catch (error) {
      console.error('❌ Error sending test notification:', error);
      return false;
    }
  }

  /**
   * Clear notification queue
   */
  clearQueue() {
    this.notificationQueue = [];
    console.log('🗑️ Notification queue cleared');
  }

  /**
   * Get notification queue
   */
  getQueue() {
    return this.notificationQueue;
  }

  /**
   * Unregister token (on logout)
   */
  async cleanup() {
    try {
      if (this.fcmToken) {
        await unregisterFCMToken();
        this.fcmToken = null;
      }

      if (this.unsubscribeForeground) {
        this.unsubscribeForeground();
        this.unsubscribeForeground = null;
      }

      this.clearQueue();
      this.isInitialized = false;

      console.log('✅ NotificationManager cleaned up');
    } catch (error) {
      console.error('❌ Error cleaning up NotificationManager:', error);
    }
  }

  /**
   * Check if initialized
   */
  getIsInitialized() {
    return this.isInitialized;
  }

  /**
   * Get current FCM token
   */
  getFCMToken() {
    return this.fcmToken;
  }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Export singleton
export default notificationManager;

// Also export class for testing
export { NotificationManager };
