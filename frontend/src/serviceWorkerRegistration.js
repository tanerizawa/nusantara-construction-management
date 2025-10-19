// Service Worker Registration Module
// Handles PWA installation and updates

class ServiceWorkerRegistration {
  constructor() {
    this.registration = null;
    this.updateAvailable = false;
    this.listeners = {
      update: [],
      install: [],
      ready: []
    };
  }

  // Register service worker
  async register() {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported in this browser');
      return null;
    }

    try {
      this.registration = await navigator.serviceWorker.register(
        '/service-worker.js',
        { scope: '/' }
      );

      console.log('✅ Service Worker registered:', this.registration);

      // Listen for updates
      this.registration.addEventListener('updatefound', () => {
        this.handleUpdateFound();
      });

      // Check for updates periodically
      setInterval(() => {
        this.registration.update();
      }, 60 * 60 * 1000); // Check every hour

      // Listen for controlling service worker changes
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
      });

      // Notify when ready
      if (this.registration.active) {
        this.emit('ready', this.registration);
      }

      return this.registration;
    } catch (error) {
      console.error('❌ Service Worker registration failed:', error);
      return null;
    }
  }

  // Handle service worker updates
  handleUpdateFound() {
    const newWorker = this.registration.installing;
    console.log('🔄 New Service Worker found, installing...');

    newWorker.addEventListener('statechange', () => {
      console.log('Service Worker state:', newWorker.state);

      if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
        // New service worker available
        this.updateAvailable = true;
        this.emit('update', newWorker);
        
        // Show update notification
        this.showUpdateNotification();
      } else if (newWorker.state === 'activated') {
        // First install
        this.emit('install', newWorker);
        this.showInstallNotification();
      }
    });
  }

  // Skip waiting and activate new service worker
  skipWaiting() {
    if (!this.registration || !this.registration.waiting) {
      return;
    }

    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  }

  // Show update notification
  showUpdateNotification() {
    // You can implement custom UI here
    const updateAvailable = new CustomEvent('swUpdate', {
      detail: {
        registration: this.registration,
        skipWaiting: () => this.skipWaiting()
      }
    });
    window.dispatchEvent(updateAvailable);
  }

  // Show install notification
  showInstallNotification() {
    const installed = new CustomEvent('swInstalled', {
      detail: { registration: this.registration }
    });
    window.dispatchEvent(installed);
  }

  // Event emitter
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  // Unregister service worker
  async unregister() {
    if (!this.registration) {
      return false;
    }

    const success = await this.registration.unregister();
    if (success) {
      console.log('✅ Service Worker unregistered');
      this.registration = null;
    }
    return success;
  }

  // Clear all caches
  async clearCaches() {
    const cacheNames = await caches.keys();
    await Promise.all(
      cacheNames.map(cacheName => caches.delete(cacheName))
    );
    console.log('✅ All caches cleared');
  }

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return 'unsupported';
    }

    if (Notification.permission === 'granted') {
      return 'granted';
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return Notification.permission;
  }

  // Subscribe to push notifications
  async subscribeToPush(vapidPublicKey) {
    if (!this.registration) {
      throw new Error('Service Worker not registered');
    }

    try {
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('✅ Push subscription successful:', subscription);
      return subscription;
    } catch (error) {
      console.error('❌ Push subscription failed:', error);
      throw error;
    }
  }

  // Helper: Convert VAPID key
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Get current subscription
  async getSubscription() {
    if (!this.registration) {
      return null;
    }

    return await this.registration.pushManager.getSubscription();
  }

  // Unsubscribe from push
  async unsubscribeFromPush() {
    const subscription = await this.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      console.log('✅ Unsubscribed from push notifications');
    }
  }
}

// Export singleton instance
const swRegistration = new ServiceWorkerRegistration();

// Auto-register on load (in production)
if (process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    swRegistration.register();
  });
}

export default swRegistration;

// Named exports for convenience
export const {
  register,
  unregister,
  skipWaiting,
  clearCaches,
  requestNotificationPermission,
  subscribeToPush,
  getSubscription,
  unsubscribeFromPush
} = swRegistration;
