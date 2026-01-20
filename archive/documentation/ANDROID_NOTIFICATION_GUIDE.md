# 📱 Android Notification Configuration

## 🎯 Overview

Untuk notifikasi tampil di **Android system notification**, beberapa hal harus configured:

---

## ✅ Requirements

### 1. Browser Support
- ✅ **Chrome for Android** (recommended)
- ✅ **Firefox for Android**
- ✅ **Samsung Internet**
- ⚠️ **Opera** (limited support)
- ❌ **Safari iOS** (tidak support push notifications sampai iOS 16.4)

### 2. Android Version
- ✅ **Android 5.0+ (Lollipop)**
- ✅ **Android 6.0+ (Marshmallow)** - Full support
- ✅ **Android 7.0+ (Nougat)** - Enhanced support
- ✅ **Android 8.0+ (Oreo)** - Notification channels
- ✅ **Android 10+ (Q)** - Bubbles support

### 3. Permissions
- ✅ **Notification Permission** (must grant)
- ✅ **Internet Connection** (WiFi or mobile data)
- ✅ **Google Play Services** (for FCM)
- ✅ **Background App Refresh** (for background notifications)

---

## 🔧 How Firebase FCM Works on Android Web

### Architecture Flow

```
Backend (Node.js + Firebase Admin SDK)
    ↓
Firebase Cloud Messaging (FCM)
    ↓
Google Play Services (on Android device)
    ↓
Chrome Browser (Service Worker)
    ↓
Android System Notification
    ↓
User sees notification in notification drawer
```

### Notification Types

#### 1. **Foreground Notifications** (App Open)
```
User is using the app
    ↓
FCM sends message
    ↓
Service Worker onMessage event fires
    ↓
Shows:
  • In-app toast notification (React)
  • Browser notification (JavaScript Notification API)
  • Android system notification (via Chrome)
```

#### 2. **Background Notifications** (App Closed)
```
App is closed or minimized
    ↓
FCM sends message
    ↓
Service Worker onBackgroundMessage fires
    ↓
Shows:
  • Android system notification
  • Appears in notification drawer
  • Can show on lock screen
```

---

## 📱 Android Notification Features

### Notification Appearance

**On Notification Drawer:**
```
┌─────────────────────────────────────┐
│ 🏗️ Nusantara Construction          │
│                                     │
│ RAB Approval Required               │
│ RAB "Pekerjaan Struktur" perlu      │
│ approval Anda                       │
│                                     │
│ [✓ Approve] [✗ Reject] [👁️ View]   │
│                                     │
│ Just now                            │
└─────────────────────────────────────┘
```

**On Lock Screen:**
```
┌─────────────────────────────────────┐
│ 🔒 Lock Screen                      │
│                                     │
│ 🏗️ Nusantara Construction          │
│ RAB Approval Required               │
│                                     │
│ [Slide to view]                     │
└─────────────────────────────────────┘
```

### Notification Actions

**Action Buttons:**
- ✓ **Approve** - Directly approve from notification
- ✗ **Reject** - Directly reject from notification
- 👁️ **View** - Open app to details page
- 🗑️ **Dismiss** - Close notification

**Interaction:**
- **Tap notification** → Opens app to relevant page
- **Tap action button** → Performs action (if implemented)
- **Swipe** → Dismiss notification
- **Long press** → Notification settings

---

## 🎨 Android Notification Customization

### Notification Channels (Android 8.0+)

Firebase automatically creates channels, but you can customize:

```javascript
// In firebase-messaging-sw.js
const notificationOptions = {
  // Basic
  title: 'RAB Approval Required',
  body: 'RAB "Pekerjaan Struktur" perlu approval Anda',
  icon: '/logo192.png',        // App icon
  badge: '/logo192.png',        // Badge icon
  
  // Android-specific
  tag: 'rab-approval-123',      // Unique ID (replace existing notification)
  requireInteraction: true,     // Stay until user acts
  vibrate: [200, 100, 200],     // Vibration pattern
  silent: false,                // Play sound
  
  // Visual
  image: '/path/to/image.jpg',  // Large image
  
  // Actions
  actions: [
    { action: 'approve', title: '✓ Approve', icon: '/approve.png' },
    { action: 'reject', title: '✗ Reject', icon: '/reject.png' },
    { action: 'view', title: '👁️ View', icon: '/view.png' }
  ],
  
  // Data
  data: {
    type: 'rab_approval',
    rabId: '123',
    projectId: '456',
    clickAction: '/projects/456/rab/123'
  }
};
```

### Notification Priority

```javascript
// High priority (heads-up notification)
const highPriorityNotification = {
  ...notificationOptions,
  priority: 'high',
  requireInteraction: true
};

// Low priority (no sound, no vibration)
const lowPriorityNotification = {
  ...notificationOptions,
  priority: 'low',
  silent: true
};
```

### Notification Sound

**Default sound:**
```javascript
// Uses system default notification sound
{ silent: false }
```

**Custom sound:**
```javascript
// Not supported in web push (Android limitation)
// Must use default or silent
```

### Vibration Pattern

```javascript
// Vibrate pattern: [vibrate, pause, vibrate, pause, ...]
vibrate: [200, 100, 200]       // Short, short
vibrate: [500, 200, 500]       // Long, long
vibrate: [100, 100, 100, 100]  // Multiple short
```

---

## 🔔 Android Permission Flow

### User Experience

**Step 1: First Login**
```
User logs in
    ↓
App shows permission dialog (after 5 seconds)
    ↓
Browser asks: "Allow notifications from localhost:3000?"
    [Block] [Allow]
```

**Step 2: User Allows**
```
User clicks "Allow"
    ↓
Browser requests permission from Android
    ↓
Android shows system dialog:
    "Chrome wants to send you notifications"
    [Deny] [Allow]
```

**Step 3: Android Allows**
```
Android grants permission
    ↓
Chrome gets FCM token
    ↓
Token saved to backend
    ↓
User can receive notifications
```

### Permission States

```javascript
// Check permission status
const permission = Notification.permission;

// "default" - Not asked yet
// "granted" - User allowed
// "denied" - User blocked
```

### Re-request Permission

If user denied:
```
Settings → Site Settings → localhost:3000 → Notifications → Allow
```

---

## 🧪 Testing Android Notifications

### Test 1: Foreground Notification

**Steps:**
1. Open app on Android device
2. Login with valid credentials
3. Allow notification permission
4. Keep app OPEN (foreground)
5. Create RAB with approval status
6. **Expected:**
   - ✅ In-app toast appears
   - ✅ Android notification appears
   - ✅ Notification stays in drawer

### Test 2: Background Notification

**Steps:**
1. Open app on Android device
2. Login and allow permissions
3. **Press Home button** (minimize app)
4. From another device/computer, create RAB
5. **Expected:**
   - ✅ Android notification appears
   - ✅ Notification drawer updates
   - ✅ Sound/vibration plays
   - ✅ Can see on lock screen

### Test 3: Lock Screen Notification

**Steps:**
1. Open app, login, allow permissions
2. **Lock device** (power button)
3. Create RAB from another device
4. **Expected:**
   - ✅ Notification on lock screen
   - ✅ Can interact without unlocking
   - ✅ Tap to open app

### Test 4: Action Buttons

**Steps:**
1. Receive RAB approval notification
2. Expand notification (swipe down)
3. **Tap action button** (Approve/Reject)
4. **Expected:**
   - ✅ Action processed
   - ✅ Notification updates or dismisses
   - ✅ App reflects change

---

## 🚨 Troubleshooting Android

### No Notification Appears

**Check 1: Browser Notification Permission**
```
Chrome → Settings → Site Settings → localhost:3000 → Notifications
Should be: "Allow"
```

**Check 2: Android Notification Permission**
```
Android Settings → Apps → Chrome → Notifications
Should be: "On"
```

**Check 3: Do Not Disturb**
```
Android Settings → Sound → Do Not Disturb
Should be: "Off" (or allow notifications)
```

**Check 4: Battery Saver**
```
Android Settings → Battery → Battery Saver
May block notifications when enabled
```

**Check 5: FCM Token Generated**
```javascript
// Check browser console
// Should see: "✅ FCM Token received: ..."
```

**Check 6: Service Worker Active**
```javascript
// Check in Chrome DevTools
navigator.serviceWorker.getRegistrations()
// Should return active service worker
```

### Notification Not Showing on Lock Screen

**Android Settings:**
```
Settings → Apps → Chrome → Notifications
    → Advanced
        → Lock screen: "Show all notification content"
```

### No Sound/Vibration

**Check 1: Phone not in Silent Mode**
```
Use volume buttons to ensure ringer is on
```

**Check 2: Notification Settings**
```
Settings → Apps → Chrome → Notifications
    → Advanced
        → Sound: Enabled
        → Vibrate: Enabled
```

### Action Buttons Not Working

**Check 1: Service Worker Event Handler**
```javascript
// In serviceWorkerDeepLink.js
self.addEventListener('notificationclick', (event) => {
  const { action } = event;
  // Should handle: 'approve', 'reject', 'view'
});
```

**Check 2: Backend Endpoint**
```javascript
// Ensure endpoints exist:
// POST /api/projects/rab/:id/approve
// POST /api/projects/rab/:id/reject
```

---

## 📊 Android Notification Best Practices

### 1. Keep Title Short
```
✅ Good: "RAB Approval Required"
❌ Bad: "You have received a new request for approval of a RAB document that requires your immediate attention"
```

### 2. Clear Body Text
```
✅ Good: "RAB 'Pekerjaan Struktur' needs your approval"
❌ Bad: "Document 123 has been submitted by user John Doe on project ABC for your review and approval action is required please check the app for more details"
```

### 3. Use Action Buttons Wisely
```
✅ Good: [Approve] [Reject] [View]
❌ Bad: [Approve] [Reject] [Maybe Later] [Remind Me] [View Details] [Share]
       (Too many options)
```

### 4. Group Related Notifications
```
✅ Good: Use same 'tag' for same RAB updates
❌ Bad: Create new notification for each update
```

### 5. Set Appropriate Priority
```
Urgent (Approval needed): requireInteraction: true
Informational: requireInteraction: false
```

---

## 🎯 Android-Specific Features

### 1. Notification Channels (Android 8.0+)

FCM creates these automatically:
- **fcm_fallback_notification_channel** - Default channel

To customize (requires native Android app):
```java
// Not available in web push
// Must use PWA or native app wrapper
```

### 2. Notification Badges

Show unread count on app icon:
```javascript
// Automatic via service worker
badge: '/logo192.png'
```

### 3. Notification Grouping

Group multiple notifications:
```javascript
tag: 'rab-approvals'  // All RAB approvals use same tag
```

### 4. Notification Timeout

Auto-dismiss after time:
```javascript
// Not directly supported
// Must implement via backend scheduling
```

---

## 🔐 Privacy & Security

### What Data is Sent?

**Via FCM:**
- ✅ Notification title & body
- ✅ Custom data (rabId, projectId, etc.)
- ✅ FCM token (device identifier)
- ❌ Personal data (name, email, etc.)
- ❌ Passwords or sensitive data

### Data Encryption

- ✅ FCM uses TLS encryption
- ✅ Data encrypted in transit
- ✅ Tokens securely stored

### User Control

- ✅ Can disable notifications anytime
- ✅ Can block specific notification types
- ✅ Can clear notification history

---

## 📚 Additional Resources

**Android Notification Guidelines:**
- https://developer.android.com/design/patterns/notifications

**Chrome Push Notifications:**
- https://developer.chrome.com/docs/web-platform/notifications/

**Firebase Cloud Messaging:**
- https://firebase.google.com/docs/cloud-messaging/android/client

**Service Workers:**
- https://developers.google.com/web/fundamentals/primers/service-workers

---

## ✅ Android Testing Checklist

- [ ] Notification appears in foreground
- [ ] Notification appears in background
- [ ] Notification appears on lock screen
- [ ] Notification sound plays
- [ ] Vibration works
- [ ] Action buttons appear
- [ ] Action buttons work correctly
- [ ] Tap notification opens app
- [ ] Notification grouping works
- [ ] Badge count updates
- [ ] Swipe to dismiss works
- [ ] Notification persists correctly
- [ ] Works on WiFi
- [ ] Works on mobile data
- [ ] Works after phone restart
- [ ] Works with battery saver
- [ ] Works with data saver

---

**Last Updated:** October 19, 2024  
**Tested On:** Android 10, 11, 12, 13  
**Browser:** Chrome 118+

**Status:** ⏳ Waiting for Firebase Web Config to test
