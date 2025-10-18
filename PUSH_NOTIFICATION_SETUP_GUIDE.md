# 🔔 Push Notification System Setup Guide

Complete guide to implement Firebase Cloud Messaging (FCM) for push notifications in the User Management system.

## 📋 Table of Contents
1. [Firebase Setup](#firebase-setup)
2. [Backend Configuration](#backend-configuration)
3. [Frontend Implementation](#frontend-implementation)
4. [Testing](#testing)
5. [Production Deployment](#production-deployment)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `nusantara-yk-construction`
4. Disable Google Analytics (optional)
5. Click **"Create project"**

### Step 2: Enable Cloud Messaging

1. In Firebase Console, go to **Project Settings** (⚙️ icon)
2. Click **"Cloud Messaging"** tab
3. Note your **Server Key** (will be used later)

### Step 3: Generate Service Account Key

1. Go to **Project Settings** → **Service Accounts**
2. Click **"Generate New Private Key"**
3. Download the JSON file
4. Save as: `/root/APP-YK/backend/config/firebase-service-account.json`

```bash
# Create config directory if not exists
mkdir -p /root/APP-YK/backend/config

# Move downloaded file (adjust path)
mv ~/Downloads/firebase-adminsdk-*.json /root/APP-YK/backend/config/firebase-service-account.json

# Secure the file
chmod 600 /root/APP-YK/backend/config/firebase-service-account.json
```

### Step 4: Get Firebase Config for Web

1. In Firebase Console, go to **Project Settings** → **General**
2. Scroll to **"Your apps"** section
3. Click **Web icon** (</>) to add a web app
4. Register app name: `Nusantara YK Web`
5. Copy the `firebaseConfig` object

---

## ⚙️ Backend Configuration

### Step 1: Install Dependencies

```bash
cd /root/APP-YK/backend

# Install Firebase Admin SDK
npm install firebase-admin

# Install Email support (Nodemailer)
npm install nodemailer

# Optional: Install SMS support (Twilio)
npm install twilio
```

### Step 2: Configure Environment Variables

Add to `/root/APP-YK/backend/.env`:

```env
# ============================================
# FIREBASE CLOUD MESSAGING (FCM)
# ============================================
FIREBASE_SERVICE_ACCOUNT_PATH=./config/firebase-service-account.json
FIREBASE_PROJECT_ID=nusantara-yk-construction

# ============================================
# EMAIL NOTIFICATIONS (Gmail SMTP)
# ============================================
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
APP_NAME=Nusantara YK Construction

# ============================================
# SMS NOTIFICATIONS (Optional - Twilio)
# ============================================
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890
```

#### Gmail App Password Setup:

1. Go to [Google Account Settings](https://myaccount.google.com/security)
2. Enable **2-Step Verification**
3. Go to **App Passwords**
4. Generate password for "Mail"
5. Copy 16-character password to `SMTP_PASS`

### Step 3: Verify Files Created

```bash
# Check files exist
ls -la /root/APP-YK/backend/services/UserNotificationService.js
ls -la /root/APP-YK/backend/routes/user-notifications.js
ls -la /root/APP-YK/backend/config/firebase-service-account.json

# Test Firebase SDK
node -e "const admin = require('firebase-admin'); \
  admin.initializeApp({ \
    credential: admin.credential.cert(require('./config/firebase-service-account.json')) \
  }); \
  console.log('✅ Firebase initialized successfully');"
```

---

## 🎨 Frontend Implementation

### Step 1: Install Firebase SDK

```bash
cd /root/APP-YK/frontend

# Install Firebase
npm install firebase
```

### Step 2: Create Firebase Config

Create `/root/APP-YK/frontend/src/config/firebase.js`:

```javascript
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "nusantara-yk-construction",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
```

### Step 3: Create Service Worker

Create `/root/APP-YK/frontend/public/firebase-messaging-sw.js`:

```javascript
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "YOUR_API_KEY",
  projectId: "nusantara-yk-construction",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
    badge: '/logo192.png',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
```

### Step 4: Create Notification Hook

Create `/root/APP-YK/frontend/src/hooks/useNotifications.js`:

```javascript
import { useEffect, useState } from 'react';
import { messaging, getToken, onMessage } from '../config/firebase';

export const useNotifications = (userId) => {
  const [permission, setPermission] = useState(Notification.permission);
  const [token, setToken] = useState(null);

  useEffect(() => {
    requestPermission();
    
    // Listen for foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload);
      
      // Show toast notification
      if (window.showToast) {
        window.showToast(payload.notification.body, 'info');
      }
      
      // Update notification badge
      fetchUnreadCount();
    });

    return () => unsubscribe();
  }, [userId]);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        const fcmToken = await getToken(messaging, {
          vapidKey: 'YOUR_VAPID_KEY' // From Firebase Console
        });
        
        setToken(fcmToken);
        
        // Register token with backend
        await fetch('/api/user-notifications/register-device', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, token: fcmToken })
        });
      }
    } catch (error) {
      console.error('Error getting FCM token:', error);
    }
  };

  const fetchUnreadCount = async () => {
    // Implementation to fetch unread count
  };

  return { permission, token, requestPermission };
};
```

### Step 5: Create Notification Center Component

Create `/root/APP-YK/frontend/src/components/NotificationCenter.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, X } from 'lucide-react';

const NotificationCenter = ({ userId }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`/api/user-notifications/my?userId=${userId}&limit=10`);
      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await fetch(`/api/user-notifications/my/unread-count?userId=${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setUnreadCount(data.data.count);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/user-notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch('/api/user-notifications/mark-all-read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  return (
    <div className="relative">
      {/* Bell Icon */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 transition"
      >
        <Bell className="w-6 h-6 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Mark all read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-gray-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 ${
                    !notification.readAt ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.readAt && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-1 rounded hover:bg-gray-200"
                        title="Mark as read"
                      >
                        <Check className="w-4 h-4 text-blue-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t text-center">
              <a
                href="/notifications"
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
```

### Step 6: Integrate in App

Update `/root/APP-YK/frontend/src/App.js`:

```javascript
import NotificationCenter from './components/NotificationCenter';
import { useNotifications } from './hooks/useNotifications';

function App() {
  const userId = 'U001'; // Get from auth context
  
  // Initialize notifications
  useNotifications(userId);

  return (
    <div className="App">
      {/* Header with notification bell */}
      <header>
        <NotificationCenter userId={userId} />
      </header>
      
      {/* Rest of your app */}
    </div>
  );
}
```

---

## 🧪 Testing

### Backend Testing

```bash
cd /root/APP-YK/backend
npm run dev

# Test sending notification
curl -X POST http://localhost:5000/api/user-notifications/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "U001",
    "title": "Test Notification",
    "message": "This is a test push notification",
    "type": "info",
    "channels": ["push", "email"]
  }'

# Test sending to roles
curl -X POST http://localhost:5000/api/user-notifications/send-to-roles \
  -H "Content-Type: application/json" \
  -d '{
    "roles": ["admin", "project_manager"],
    "title": "System Announcement",
    "message": "New feature released!",
    "channels": ["push", "email"]
  }'
```

### Frontend Testing

1. **Open browser** → http://localhost:3000
2. **Accept notification permission** when prompted
3. **Check browser console** for FCM token
4. **Send test notification** from backend
5. **Verify notification** appears in:
   - NotificationCenter dropdown
   - Browser push notification
   - Email inbox (if configured)

---

## 🚀 Production Deployment

### Security Checklist

- [ ] Firebase service account JSON **NOT** committed to git
- [ ] Environment variables set in production server
- [ ] HTTPS enabled (required for push notifications)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled for notification endpoints

### Performance Optimization

```javascript
// Batch notifications for multiple users
const batchSize = 500; // FCM limit
for (let i = 0; i < users.length; i += batchSize) {
  const batch = users.slice(i, i + batchSize);
  await sendBatchNotifications(batch);
}
```

### Monitoring

```javascript
// Log notification metrics
console.log({
  timestamp: new Date(),
  action: 'notification_sent',
  userId,
  channels: ['push', 'email'],
  success: true
});
```

---

## 📚 API Endpoints Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/user-notifications/send` | Send to specific user |
| POST | `/api/user-notifications/send-to-roles` | Send to role(s) |
| GET | `/api/user-notifications/my` | Get user's notifications |
| GET | `/api/user-notifications/my/unread-count` | Get unread count |
| PATCH | `/api/user-notifications/:id/read` | Mark as read |
| PATCH | `/api/user-notifications/mark-all-read` | Mark all as read |
| POST | `/api/user-notifications/register-device` | Register FCM token |
| POST | `/api/user-notifications/unregister-device` | Unregister FCM token |
| GET | `/api/user-notifications/preferences` | Get preferences |
| PUT | `/api/user-notifications/preferences` | Update preferences |

---

## 💡 Tips & Best Practices

1. **Test with one device first** before rolling out
2. **Use notification priorities** appropriately
3. **Respect user preferences** (quiet hours, disabled categories)
4. **Handle token refresh** (tokens can expire)
5. **Implement retry logic** for failed deliveries
6. **Monitor delivery rates** and adjust as needed
7. **Keep messages concise** (title: 50 chars, body: 200 chars)
8. **Use deep links** in notification data for better UX

---

## 🐛 Troubleshooting

### Push notifications not received?

1. Check Firebase credentials are correct
2. Verify device token is registered
3. Check browser console for errors
4. Ensure HTTPS is enabled
5. Check notification permissions

### Email not sent?

1. Verify Gmail app password is correct
2. Check "Less secure app access" is enabled
3. Review email logs in backend
4. Test SMTP connection manually

### High latency?

1. Use background jobs for bulk notifications
2. Implement message queues (Redis/RabbitMQ)
3. Cache user preferences
4. Use CDN for assets

---

## 📞 Support

For issues or questions:
- Backend Service: `/root/APP-YK/backend/services/UserNotificationService.js`
- Backend Routes: `/root/APP-YK/backend/routes/user-notifications.js`
- Frontend Component: `/root/APP-YK/frontend/src/components/NotificationCenter.js`

---

**Last Updated:** October 17, 2025
**Status:** ✅ Ready for Implementation
**Firebase Cost:** FREE (Unlimited push notifications on Spark plan)
