# 📱 PWA (Progressive Web App) Implementation Plan

**Tanggal:** 19 Oktober 2025  
**Tujuan:** Transform aplikasi web menjadi PWA yang install-able di smartphone  
**Platform:** Cross-platform (Android, iOS, Desktop)  
**Status:** 🚀 RECOMMENDED APPROACH

---

## 🎯 PWA vs Native App - Comparison

### ⚡ **PWA (Progressive Web App)** ⭐ RECOMMENDED

**Keunggulan:**
- ✅ **Development cepat**: 2-3 minggu (vs 10 minggu native)
- ✅ **Biaya murah**: ~Rp 20-30 juta (vs Rp 105 juta native)
- ✅ **No app store**: Langsung deploy, no approval delay
- ✅ **Instant updates**: User selalu dapat versi terbaru
- ✅ **Cross-platform**: 1 codebase untuk semua device
- ✅ **SEO friendly**: Tetap searchable di Google
- ✅ **Lightweight**: ~5MB vs 50MB native app
- ✅ **Existing codebase**: 90% reuse dari web app yang sudah ada
- ✅ **Easy maintenance**: 1 codebase untuk maintain

**Kekurangan:**
- ❌ iOS push notification terbatas (iOS 16.4+ baru support)
- ❌ Tidak bisa akses fitur native advanced (Bluetooth, NFC, etc.)
- ❌ Performance slightly lower dari native (tapi untuk use case kita cukup)
- ❌ No presence di App Store/Play Store (tapi bisa add via TWA)

### 📱 **React Native (Native App)**

**Keunggulan:**
- ✅ Full native features access
- ✅ Best performance
- ✅ Better offline support
- ✅ App store presence

**Kekurangan:**
- ❌ Development lama: 10 minggu
- ❌ Biaya mahal: Rp 105 juta
- ❌ Perlu app store approval (bisa 1-2 minggu)
- ❌ Update lambat (via app store)
- ❌ Separate codebase dari web
- ❌ Maintenance cost lebih tinggi

---

## 🎨 PWA FEATURES YANG AKAN DIIMPLEMENTASI

### 1. **📲 Install Prompt (Add to Home Screen)**
User bisa install app ke home screen smartphone seperti native app.

**Features:**
- Install banner otomatis muncul
- Icon app di home screen
- Splash screen saat buka app
- Fullscreen mode (no browser UI)
- Standalone app experience

### 2. **🔔 Push Notifications**
Web Push Notifications dengan service workers.

**Supported:**
- ✅ Android (all browsers)
- ✅ Desktop (Chrome, Firefox, Edge)
- ✅ iOS 16.4+ (Safari)

**Features:**
- Approval notifications dengan deep link
- Badge count di app icon
- Notification actions (Approve/Reject langsung dari notif)
- Scheduled notifications
- Background sync

### 3. **💾 Offline Support**
Service Worker untuk cache data dan bisa kerja offline.

**Features:**
- Cache static assets (HTML, CSS, JS, images)
- Cache API responses
- Offline page fallback
- Background sync untuk upload photos ketika online
- IndexedDB untuk local data storage

### 4. **📸 Camera & Gallery Access**
HTML5 APIs untuk capture/upload photos.

**Features:**
- Camera capture langsung dari browser
- Multiple photo selection
- Image compression before upload
- Preview photos before submit
- EXIF data extraction (GPS, timestamp)

### 5. **📍 GPS Location Access**
Geolocation API untuk attendance tracking.

**Features:**
- Real-time location tracking
- Distance calculation dari project site
- Location accuracy verification
- Background location (dengan permission)
- Location history

### 6. **👆 Touch Gestures**
Mobile-optimized interactions.

**Features:**
- Swipe to approve/reject
- Pull-to-refresh
- Touch-friendly buttons (min 44px)
- Haptic feedback (vibration)
- Bottom sheet modals

### 7. **⚡ Performance Optimization**
Mobile-specific optimizations.

**Features:**
- Lazy loading images
- Code splitting
- Resource prioritization
- Reduced bundle size
- Fast 3G optimization

---

## 🏗️ ARCHITECTURE OVERVIEW

### Current Web App Stack
```
Frontend: React 18
State: Redux/Context API
Routing: React Router
UI: Custom components (dark mode)
API: Axios with interceptors
```

### PWA Additions
```
Service Worker: Workbox
Manifest: manifest.json
Push: Firebase Cloud Messaging (FCM)
Offline DB: IndexedDB (via Dexie.js)
Camera: navigator.mediaDevices
GPS: navigator.geolocation
Gestures: React Swipeable
```

---

## 📁 FILE STRUCTURE (New PWA Files)

```
frontend/
├── public/
│   ├── manifest.json               ✨ NEW - PWA manifest
│   ├── service-worker.js           ✨ NEW - Service worker
│   ├── offline.html                ✨ NEW - Offline fallback
│   ├── icons/                      ✨ NEW - App icons
│   │   ├── icon-72x72.png
│   │   ├── icon-96x96.png
│   │   ├── icon-128x128.png
│   │   ├── icon-144x144.png
│   │   ├── icon-152x152.png
│   │   ├── icon-192x192.png
│   │   ├── icon-384x384.png
│   │   └── icon-512x512.png
│   └── splash/                     ✨ NEW - Splash screens (iOS)
│       ├── splash-640x1136.png
│       ├── splash-750x1334.png
│       ├── splash-1242x2208.png
│       └── ...
│
├── src/
│   ├── sw/                         ✨ NEW - Service worker logic
│   │   ├── sw-register.js
│   │   ├── sw-config.js
│   │   └── push-notifications.js
│   │
│   ├── hooks/
│   │   ├── useInstallPrompt.js     ✨ NEW - PWA install hook
│   │   ├── useOnlineStatus.js      ✨ NEW - Network status hook
│   │   ├── usePushNotification.js  ✨ NEW - Push notif hook
│   │   ├── useCamera.js            ✨ NEW - Camera access hook
│   │   ├── useGeolocation.js       ✨ NEW - GPS location hook
│   │   └── useSwipeGesture.js      ✨ NEW - Touch gestures hook
│   │
│   ├── components/
│   │   ├── mobile/                 ✨ NEW - Mobile-specific components
│   │   │   ├── InstallPrompt.js
│   │   │   ├── OfflineBanner.js
│   │   │   ├── BottomSheet.js
│   │   │   ├── SwipeableCard.js
│   │   │   ├── CameraCapture.js
│   │   │   └── PullToRefresh.js
│   │   │
│   │   └── pwa/                    ✨ NEW - PWA utilities
│   │       ├── UpdatePrompt.js
│   │       └── NetworkStatus.js
│   │
│   ├── services/
│   │   ├── cacheService.js         ✨ NEW - Cache management
│   │   ├── syncService.js          ✨ NEW - Background sync
│   │   └── notificationService.js  ✨ UPDATE - Add web push
│   │
│   ├── utils/
│   │   ├── pwaHelpers.js           ✨ NEW - PWA utilities
│   │   ├── detectDevice.js         ✨ NEW - Device detection
│   │   └── vibration.js            ✨ NEW - Haptic feedback
│   │
│   └── styles/
│       └── mobile.css              ✨ NEW - Mobile-specific styles
│
└── workbox-config.js               ✨ NEW - Workbox configuration
```

---

## 🔧 IMPLEMENTATION STEPS

### Phase 1: PWA Foundation (Week 1)

#### Step 1.1: Create Web App Manifest

**File:** `public/manifest.json`

```json
{
  "name": "Nusantara Construction Management",
  "short_name": "Nusantara CM",
  "description": "Construction management app for Nusantara YK",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0A84FF",
  "background_color": "#1C1C1E",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/dashboard.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    },
    {
      "src": "/screenshots/approval.png",
      "sizes": "540x720",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Approvals",
      "short_name": "Approvals",
      "description": "View pending approvals",
      "url": "/approvals",
      "icons": [{ "src": "/icons/approval-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Documentation",
      "short_name": "Photos",
      "description": "Upload documentation photos",
      "url": "/documentation",
      "icons": [{ "src": "/icons/camera-96x96.png", "sizes": "96x96" }]
    },
    {
      "name": "Attendance",
      "short_name": "Attendance",
      "description": "Clock in/out",
      "url": "/attendance",
      "icons": [{ "src": "/icons/attendance-96x96.png", "sizes": "96x96" }]
    }
  ],
  "categories": ["business", "productivity"],
  "prefer_related_applications": false,
  "related_applications": []
}
```

**Update:** `public/index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
    <meta name="theme-color" content="#0A84FF" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Nusantara CM" />
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Favicon -->
    <link rel="icon" href="/favicon.ico" />
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    
    <!-- iOS Splash Screens -->
    <link rel="apple-touch-startup-image" href="/splash/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px)" />
    <link rel="apple-touch-startup-image" href="/splash/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px)" />
    <!-- Add more splash screens for different iPhone/iPad sizes -->
    
    <title>Nusantara Construction Management</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
  </body>
</html>
```

#### Step 1.2: Create Service Worker

**File:** `public/service-worker.js`

```javascript
/* eslint-disable no-restricted-globals */
const CACHE_NAME = 'nusantara-cm-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/offline.html',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching app shell');
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Check if valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone response
        const responseToCache = response.clone();

        // Cache new resources
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // If both cache and network fail, show offline page
        return caches.match('/offline.html');
      });
    })
  );
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push received:', event);
  
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Nusantara CM';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: data.data || {},
    actions: data.actions || [],
    tag: data.tag || 'default',
    requireInteraction: data.requireInteraction || false,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked:', event);
  event.notification.close();

  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if already open
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync event (for offline photo uploads)
self.addEventListener('sync', (event) => {
  console.log('[Service Worker] Background sync:', event.tag);
  
  if (event.tag === 'sync-photos') {
    event.waitUntil(syncPhotos());
  }
});

async function syncPhotos() {
  // Get pending uploads from IndexedDB
  // Send to server
  // Clear from IndexedDB on success
  console.log('[Service Worker] Syncing photos...');
}
```

#### Step 1.3: Register Service Worker

**File:** `src/serviceWorkerRegistration.js`

```javascript
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('✅ Service Worker registered:', registration);

          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                console.log('🔄 New content available, please refresh.');
                showUpdateNotification();
              }
            });
          });
        })
        .catch((error) => {
          console.error('❌ Service Worker registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

function showUpdateNotification() {
  // Show toast/banner to user
  if (window.confirm('New version available! Refresh to update?')) {
    window.location.reload();
  }
}
```

**Update:** `src/index.js`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register service worker for PWA
serviceWorkerRegistration.register();
```

#### Step 1.4: Install Prompt Hook

**File:** `src/hooks/useInstallPrompt.js`

```javascript
import { useState, useEffect } from 'react';

export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Listen for install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      console.log('💡 Install prompt available');
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
      console.log('✅ App installed successfully');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) {
      console.log('❌ No install prompt available');
      return false;
    }

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    console.log(`User response: ${outcome}`);
    
    if (outcome === 'accepted') {
      setInstallPrompt(null);
      return true;
    }
    
    return false;
  };

  return {
    installPrompt,
    isInstalled,
    promptInstall,
    canInstall: !!installPrompt && !isInstalled
  };
};
```

#### Step 1.5: Install Prompt Component

**File:** `src/components/mobile/InstallPrompt.js`

```javascript
import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';

const InstallPrompt = () => {
  const { canInstall, promptInstall, isInstalled } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if user already dismissed
    const isDismissed = localStorage.getItem('pwa-install-dismissed');
    if (isDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const installed = await promptInstall();
    if (installed) {
      console.log('App installed!');
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!canInstall || dismissed || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-2xl animate-slide-up">
      <div className="max-w-md mx-auto flex items-center gap-4">
        <div className="flex-shrink-0">
          <Download size={32} />
        </div>
        
        <div className="flex-1">
          <h3 className="font-bold text-lg">Install App</h3>
          <p className="text-sm text-blue-100">
            Install Nusantara CM untuk akses lebih cepat dan notifikasi real-time
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleInstall}
            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-2 hover:bg-blue-600 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
```

---

### Phase 2: Push Notifications (Week 1)

#### Step 2.1: Web Push with Firebase

**Install dependencies:**
```bash
npm install firebase
```

**File:** `src/services/firebase-messaging.js`

```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestNotificationPermission = async () => {
  try {
    console.log('🔔 Requesting notification permission...');
    
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      console.log('✅ Notification permission granted');
      
      // Get FCM token
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      
      console.log('📱 FCM Token:', token);
      
      // Register token to backend
      await registerTokenToBackend(token);
      
      return token;
    } else if (permission === 'denied') {
      console.log('❌ Notification permission denied');
    }
    
    return null;
  } catch (error) {
    console.error('❌ Error getting notification permission:', error);
    return null;
  }
};

async function registerTokenToBackend(token) {
  try {
    const userId = localStorage.getItem('userId');
    const response = await fetch('/api/notifications/register-device', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        userId,
        token,
        platform: 'web',
        appVersion: '1.0.0'
      })
    });
    
    if (response.ok) {
      console.log('✅ Token registered to backend');
    }
  } catch (error) {
    console.error('❌ Failed to register token:', error);
  }
}

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log('📨 Foreground message received:', payload);
      resolve(payload);
    });
  });

export default messaging;
```

#### Step 2.2: Push Notification Hook

**File:** `src/hooks/usePushNotification.js`

```javascript
import { useState, useEffect } from 'react';
import { requestNotificationPermission, onMessageListener } from '../services/firebase-messaging';

export const usePushNotification = () => {
  const [notification, setNotification] = useState(null);
  const [fcmToken, setFcmToken] = useState(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true);
    }
  }, []);

  useEffect(() => {
    if (!isSupported) return;

    // Listen for foreground messages
    onMessageListener()
      .then((payload) => {
        console.log('Notification received:', payload);
        setNotification(payload);
        
        // Show browser notification if not in focus
        if (document.hidden) {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.icon || '/icons/icon-192x192.png',
            badge: '/icons/badge-72x72.png',
            data: payload.data
          });
        }
      })
      .catch((err) => console.error('Failed to receive message:', err));
  }, [isSupported]);

  const requestPermission = async () => {
    const token = await requestNotificationPermission();
    setFcmToken(token);
    return token;
  };

  const showNotification = (title, options) => {
    if (!isSupported || Notification.permission !== 'granted') {
      console.log('Notifications not allowed');
      return;
    }

    new Notification(title, {
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      ...options
    });
  };

  return {
    notification,
    fcmToken,
    isSupported,
    requestPermission,
    showNotification,
    permission: Notification.permission
  };
};
```

---

### Phase 3: Camera & Photo Upload (Week 2)

#### Step 3.1: Camera Hook

**File:** `src/hooks/useCamera.js`

```javascript
import { useState, useRef, useCallback } from 'react';

export const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera on mobile
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);
      setIsActive(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera error:', err);
      setError(err.message);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsActive(false);
    }
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return null;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob);
      }, 'image/jpeg', 0.85);
    });
  }, []);

  const switchCamera = useCallback(async () => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    const currentFacingMode = videoTrack.getSettings().facingMode;
    const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';

    stopCamera();
    
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: newFacingMode }
    });

    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [stream, stopCamera]);

  return {
    videoRef,
    isActive,
    error,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera
  };
};
```

#### Step 3.2: Camera Component

**File:** `src/components/mobile/CameraCapture.js`

```javascript
import React, { useEffect } from 'react';
import { Camera, X, FlipHorizontal, Circle } from 'lucide-react';
import { useCamera } from '../../hooks/useCamera';

const CameraCapture = ({ onCapture, onClose }) => {
  const { videoRef, isActive, error, startCamera, stopCamera, capturePhoto, switchCamera } = useCamera();

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [startCamera, stopCamera]);

  const handleCapture = async () => {
    const blob = await capturePhoto();
    if (blob) {
      const file = new File([blob], `photo-${Date.now()}.jpg`, { type: 'image/jpeg' });
      onCapture(file);
    }
  };

  if (error) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-4">
        <div className="text-center text-white">
          <Camera size={64} className="mx-auto mb-4 text-red-500" />
          <h3 className="text-xl font-bold mb-2">Camera Error</h3>
          <p className="text-gray-300 mb-4">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover"
      />

      {/* Top Controls */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onClose}
          className="p-2 bg-black/30 rounded-full backdrop-blur-sm hover:bg-black/50"
        >
          <X size={24} className="text-white" />
        </button>

        <button
          onClick={switchCamera}
          className="p-2 bg-black/30 rounded-full backdrop-blur-sm hover:bg-black/50"
        >
          <FlipHorizontal size={24} className="text-white" />
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-gradient-to-t from-black/50 to-transparent">
        <button
          onClick={handleCapture}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 active:scale-95 transition-all"
        >
          <Circle size={60} className="text-white fill-white" />
        </button>
      </div>

      {/* Focus Indicator (optional) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white/50 rounded-lg pointer-events-none" />
    </div>
  );
};

export default CameraCapture;
```

---

### Phase 4: Geolocation & Attendance (Week 2)

#### Step 4.1: Geolocation Hook

**File:** `src/hooks/useGeolocation.js`

```javascript
import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0,
    ...options
  };

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      defaultOptions
    );
  }, [defaultOptions]);

  const watchLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported');
      return null;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp
        });
      },
      (err) => {
        setError(err.message);
      },
      defaultOptions
    );

    return watchId;
  }, [defaultOptions]);

  const clearWatch = (watchId) => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return {
    location,
    error,
    loading,
    getLocation,
    watchLocation,
    clearWatch,
    calculateDistance
  };
};
```

---

### Phase 5: Touch Gestures & Swipe Actions (Week 2)

#### Step 5.1: Install Swipe Library

```bash
npm install react-swipeable
```

#### Step 5.2: Swipeable Approval Card

**File:** `src/components/mobile/SwipeableApprovalCard.js`

```javascript
import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Check, X } from 'lucide-react';

const SwipeableApprovalCard = ({ approval, onApprove, onReject }) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [swiping, setSwiping] = useState(false);

  const swipeThreshold = 100;

  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      setSwiping(true);
      setSwipeOffset(eventData.deltaX);
    },
    onSwiped: (eventData) => {
      setSwiping(false);
      
      if (Math.abs(eventData.deltaX) > swipeThreshold) {
        if (eventData.deltaX > 0) {
          // Swipe right = Approve
          onApprove(approval.id);
        } else {
          // Swipe left = Reject
          onReject(approval.id);
        }
        setSwipeOffset(0);
      } else {
        // Snap back
        setSwipeOffset(0);
      }
    },
    trackMouse: true
  });

  const getBackgroundColor = () => {
    if (!swiping) return 'bg-gray-800';
    
    if (swipeOffset > swipeThreshold) {
      return 'bg-green-600';
    } else if (swipeOffset < -swipeThreshold) {
      return 'bg-red-600';
    }
    return 'bg-gray-800';
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      {/* Swipe indicators */}
      <div className={`absolute inset-0 flex items-center justify-between p-4 ${getBackgroundColor()} transition-colors`}>
        <Check size={32} className="text-white" />
        <X size={32} className="text-white" />
      </div>

      {/* Card */}
      <div
        {...handlers}
        style={{
          transform: `translateX(${swipeOffset}px)`,
          transition: swiping ? 'none' : 'transform 0.3s ease-out'
        }}
        className="relative bg-gray-800 p-4 rounded-lg border border-gray-700 cursor-grab active:cursor-grabbing"
      >
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-white">{approval.title}</h3>
            <p className="text-sm text-gray-400">{approval.entityType}</p>
          </div>
          <span className="px-2 py-1 text-xs bg-orange-500/20 text-orange-400 rounded">
            {approval.priority}
          </span>
        </div>

        <p className="text-gray-300 mb-3">{approval.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>By: {approval.submittedBy}</span>
          <span>{approval.submittedAt}</span>
        </div>

        {/* Swipe hint */}
        {!swiping && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">
            ← Swipe to Reject | Approve Swipe →
          </div>
        )}
      </div>
    </div>
  );
};

export default SwipeableApprovalCard;
```

---

### Phase 6: Mobile Responsive Optimization (Week 3)

#### Step 6.1: Mobile-Specific Styles

**File:** `src/styles/mobile.css`

```css
/* Mobile-first responsive design */

/* Touch-friendly buttons */
@media (max-width: 768px) {
  button, a {
    min-height: 44px;
    min-width: 44px;
  }

  /* Larger tap targets */
  .tap-target {
    padding: 16px;
  }

  /* Bottom navigation safe area (for iPhone notch) */
  .bottom-nav {
    padding-bottom: env(safe-area-inset-bottom);
  }

  /* Hide scrollbar on mobile */
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }

  /* Pull to refresh */
  .ptr-container {
    overscroll-behavior-y: contain;
  }

  /* Smooth scroll */
  html {
    scroll-behavior: smooth;
    -webkit-overflow-scrolling: touch;
  }

  /* Disable text selection on swipeable elements */
  .swipeable {
    user-select: none;
    -webkit-user-select: none;
  }

  /* Bottom sheet modal */
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    max-height: 90vh;
    border-radius: 24px 24px 0 0;
    transform: translateY(100%);
    transition: transform 0.3s ease-out;
  }

  .bottom-sheet.open {
    transform: translateY(0);
  }

  /* Card stack spacing */
  .card-stack > * + * {
    margin-top: 12px;
  }

  /* Responsive grid */
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }
}

/* Tablet breakpoint */
@media (min-width: 769px) and (max-width: 1024px) {
  .photo-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  }
}

/* Animations */
@keyframes slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out;
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

/* Loading skeleton */
.skeleton {
  background: linear-gradient(
    90deg,
    #2c2c2e 25%,
    #3a3a3c 50%,
    #2c2c2e 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s ease-in-out infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
```

---

## 📊 PWA IMPLEMENTATION TIMELINE

### Week 1: Core PWA Setup
- ✅ Day 1-2: Manifest + Service Worker
- ✅ Day 3: Install Prompt
- ✅ Day 4-5: Push Notifications

### Week 2: Mobile Features
- ✅ Day 1-2: Camera Integration
- ✅ Day 3: Geolocation
- ✅ Day 4-5: Touch Gestures & Swipe

### Week 3: Polish & Testing
- ✅ Day 1-2: Responsive Design
- ✅ Day 3: Offline Support
- ✅ Day 4: Performance Optimization
- ✅ Day 5: Testing on real devices

**Total Development Time: 3 weeks**

---

## 💰 COST COMPARISON

### PWA Implementation
| Item | Cost |
|------|------|
| Frontend Developer (3 weeks) | Rp 30,000,000 |
| UI/UX Optimization | Rp 5,000,000 |
| Testing & QA | Rp 5,000,000 |
| Firebase (FCM) | FREE |
| Hosting (no change) | Rp 0 |
| **TOTAL** | **Rp 40,000,000** |

### vs React Native
| Item | Cost |
|------|------|
| Development (10 weeks) | Rp 105,000,000 |
| Google Play Account | Rp 400,000 |
| **TOTAL** | **Rp 105,400,000** |

**💰 Savings: Rp 65,400,000 (62% cheaper!)**

---

## ✅ PWA CHECKLIST

### Core Requirements
- [ ] HTTPS enabled (required for PWA)
- [ ] Web App Manifest
- [ ] Service Worker registered
- [ ] Install prompt implemented
- [ ] Offline page fallback
- [ ] App icons (8 sizes)
- [ ] Splash screens (iOS)

### Features
- [ ] Push notifications
- [ ] Camera access
- [ ] Geolocation
- [ ] Touch gestures
- [ ] Swipe actions
- [ ] Pull to refresh
- [ ] Background sync
- [ ] Add to home screen

### Performance
- [ ] Lighthouse PWA score > 90
- [ ] First Contentful Paint < 2s
- [ ] Time to Interactive < 3s
- [ ] Cache hit rate > 80%

### Testing
- [ ] Test on Android Chrome
- [ ] Test on iOS Safari
- [ ] Test on Desktop Chrome
- [ ] Test offline functionality
- [ ] Test push notifications
- [ ] Test install flow

---

## 🚀 DEPLOYMENT STEPS

### 1. Build for Production
```bash
npm run build
```

### 2. Update nginx config for PWA
```nginx
location /service-worker.js {
  add_header Cache-Control "no-cache";
  add_header Service-Worker-Allowed "/";
}

location /manifest.json {
  add_header Cache-Control "public, max-age=86400";
}
```

### 3. Enable HTTPS (Required!)
PWA requires HTTPS. Ensure SSL certificate is installed.

### 4. Test with Lighthouse
```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

Target scores:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
- **PWA: > 90** ✨

---

## 📱 TESTING GUIDE

### Android Testing
1. Open Chrome on Android
2. Go to your website
3. Check install prompt appears
4. Tap "Install" or "Add to Home Screen"
5. App icon should appear on home screen
6. Open app → Should be fullscreen (no browser UI)
7. Test push notifications
8. Test camera access
9. Test offline mode (enable airplane mode)

### iOS Testing (iOS 16.4+)
1. Open Safari on iPhone
2. Go to your website
3. Tap Share button
4. Tap "Add to Home Screen"
5. Fill app name
6. Tap "Add"
7. App icon appears on home screen
8. Test features (limited compared to Android)

**Note:** iOS has limited PWA support:
- ❌ No install prompt
- ❌ Limited push notifications (iOS 16.4+ only)
- ✅ Camera works
- ✅ Geolocation works
- ✅ Offline caching works

---

## 🎯 SUCCESS METRICS

### Performance
- ✅ App loads < 2 seconds (3G)
- ✅ Install rate > 30%
- ✅ Push notification CTR > 20%
- ✅ Offline usage > 10%

### User Satisfaction
- ✅ 85%+ adoption rate
- ✅ 4+ user rating
- ✅ < 2% uninstall rate

---

## 📚 RESOURCES

### PWA Tools
- Lighthouse: https://developers.google.com/web/tools/lighthouse
- Workbox: https://developers.google.com/web/tools/workbox
- PWA Builder: https://www.pwabuilder.com/

### Testing
- Chrome DevTools: Application tab
- Firefox DevTools: Application tab
- Safari Web Inspector

### Documentation
- MDN PWA Guide: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- Google PWA Checklist: https://web.dev/pwa-checklist/
- Firebase Web Push: https://firebase.google.com/docs/cloud-messaging/js/client

---

## 🏆 RECOMMENDATION

**PWA adalah pilihan terbaik untuk use case Anda karena:**

1. **💰 Cost-Effective**: Rp 40 juta vs Rp 105 juta (62% lebih murah)
2. **⚡ Fast Development**: 3 minggu vs 10 minggu (70% lebih cepat)
3. **🔄 Easy Updates**: Deploy instant, no app store delay
4. **📱 Cross-Platform**: Auto support Android, iOS, Desktop
5. **♻️ Code Reuse**: 90% reuse dari web app existing
6. **🚀 Quick to Market**: Bisa launch dalam 1 bulan
7. **🛠️ Easy Maintenance**: 1 codebase, 1 team

**When to use React Native instead:**
- Need advanced native features (Bluetooth, NFC, AR/VR)
- Need best possible performance
- Must have app store presence
- Offline-first complex app

**For your use case (Dokumentasi, Approval, Absensi):**
✅ PWA is perfect!

---

**Next Steps:**
1. Review this PWA plan
2. Get stakeholder approval
3. Start Week 1: Core PWA setup
4. Deploy in 3 weeks! 🚀
