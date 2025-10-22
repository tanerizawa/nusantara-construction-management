// Firebase Cloud Messaging Configuration
// For Nusantara PWA Attendance System

import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVctaDJWMZxXihETnfazpZ6IxfV_ioLAk",
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.firebasestorage.app",
  messagingSenderId: "916540071307",
  appId: "1:916540071307:web:e1c17e42be364df696a38e",
  measurementId: "G-1SXZ3G0Y74"
};

// Initialize Firebase
let app;
let messaging = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Check if messaging is supported
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    messaging = getMessaging(app);
    console.log('✅ Firebase Messaging initialized successfully');
  } else {
    console.warn('⚠️ Push notifications not supported in this browser');
  }
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
}

// Request notification permission and get FCM token
export const requestNotificationPermission = async () => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      throw new Error('This browser does not support notifications');
    }

    // Check current permission status
    let permission = Notification.permission;

    // If not granted, request permission
    if (permission === 'default') {
      permission = await Notification.requestPermission();
    }

    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      
      if (!messaging) {
        throw new Error('Firebase messaging not initialized');
      }

      // Get FCM token
      // VAPID key from Firebase Console > Project Settings > Cloud Messaging > Web Push certificates
      const currentToken = await getToken(messaging, {
        vapidKey: 'BIJ08FG_sF-kLOWQpaZE6qw1nmskqFZyibqdt-hMsEi_xD9GSCQfIy94tZ9tMKCmjhS1VlO5L1-91HaPjnCweNo'
      });

      if (currentToken) {
        console.log('✅ FCM Token received:', currentToken.substring(0, 20) + '...');
        return currentToken;
      } else {
        console.warn('⚠️ No registration token available');
        return null;
      }
    } else if (permission === 'denied') {
      console.warn('⚠️ Notification permission denied');
      throw new Error('Notification permission denied. Please enable notifications in your browser settings.');
    } else {
      console.warn('⚠️ Notification permission not granted');
      return null;
    }
  } catch (error) {
    console.error('❌ Error getting notification permission:', error);
    throw error;
  }
};

// Listen for foreground messages
export const onForegroundMessage = (callback) => {
  if (!messaging) {
    console.warn('⚠️ Firebase messaging not initialized');
    return () => {};
  }

  return onMessage(messaging, (payload) => {
    console.log('📩 Foreground message received:', payload);
    
    // Extract notification data
    const notificationTitle = payload.notification?.title || 'New Notification';
    const notificationOptions = {
      body: payload.notification?.body || '',
      icon: payload.notification?.icon || '/logo192.png',
      badge: '/logo192.png',
      image: payload.notification?.image,
      data: payload.data || {},
      tag: payload.data?.tag || 'default',
      requireInteraction: payload.data?.requireInteraction === 'true',
      actions: payload.data?.actions ? JSON.parse(payload.data.actions) : []
    };

    // Call callback with notification data
    callback({
      title: notificationTitle,
      options: notificationOptions,
      data: payload.data || {}
    });

    // Show notification if app is in foreground
    if (document.visibilityState === 'visible') {
      // Browser will show notification via service worker
      // But we can also show in-app notification using callback
    }
  });
};

// Register FCM token with backend
export const registerFCMToken = async (token) => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      throw new Error('User not authenticated');
    }

    const response = await fetch('/api/fcm-notifications/register-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        deviceType: 'web',
        browserInfo: {
          userAgent: navigator.userAgent,
          platform: navigator.platform,
          vendor: navigator.vendor
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to register token');
    }

    const data = await response.json();
    console.log('✅ FCM token registered with backend:', data);
    return data;
  } catch (error) {
    console.error('❌ Error registering FCM token:', error);
    throw error;
  }
};

// Unregister FCM token (on logout)
export const unregisterFCMToken = async () => {
  try {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      return; // Already logged out
    }

    // Unregister all tokens for current user (no body required)
    const response = await fetch('/api/fcm-notifications/unregister-all', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });

    if (response.ok) {
      console.log('✅ FCM token unregistered');
    }
  } catch (error) {
    console.error('❌ Error unregistering FCM token:', error);
  }
};

// Check if notifications are supported
export const isNotificationSupported = () => {
  return 'Notification' in window && 
         'serviceWorker' in navigator && 
         'PushManager' in window;
};

// Get current notification permission status
export const getNotificationPermission = () => {
  if (!('Notification' in window)) {
    return 'unsupported';
  }
  return Notification.permission;
};

// Export messaging instance for advanced usage
export { messaging };

export default {
  requestNotificationPermission,
  onForegroundMessage,
  registerFCMToken,
  unregisterFCMToken,
  isNotificationSupported,
  getNotificationPermission,
  messaging
};
