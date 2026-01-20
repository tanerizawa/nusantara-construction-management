# 🔥 Firebase Web Setup - Quick Guide

## 📋 Langkah-Langkah

### 1. Buka Firebase Console

```
URL: https://console.firebase.google.com/
Project: nusantaragroup-905e2
```

### 2. Get Web App Config

**Navigate:**
```
Project Settings (⚙️) → Your apps → Web app (</> icon)
```

**If no web app exists:**
```
1. Click "Add app"
2. Choose Web (</> icon)
3. Register app name: "Nusantara Construction Web"
4. Check "Also set up Firebase Hosting" (optional)
5. Click "Register app"
```

**Copy this config:**
```javascript
const firebaseConfig = {
  apiKey: "AIza...",                           // 📝 COPY THIS
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.appspot.com",
  messagingSenderId: "123456789012",           // 📝 COPY THIS
  appId: "1:123456789012:web:abc123def456",    // 📝 COPY THIS
  measurementId: "G-XXXXXXXXXX"                // 📝 COPY THIS (optional)
};
```

### 3. Get VAPID Key (Web Push Certificate)

**Navigate:**
```
Project Settings (⚙️) → Cloud Messaging tab
```

**Scroll to:**
```
"Web Push certificates" section
```

**If no key exists:**
```
1. Click "Generate key pair"
2. Key will be generated instantly
3. Copy the key (long string starting with "B...")
```

**Example:**
```
BNXj3h4K9L2M5P8Q1R4T7V0W3Z6A9C2E5G8J1M4O7R0U3X6Z9...
```

---

## 📝 Values to Copy

Create a file: `firebase-web-config.txt` (DO NOT COMMIT)

```
=== Firebase Web Config ===

apiKey: 
authDomain: nusantaragroup-905e2.firebaseapp.com
projectId: nusantaragroup-905e2
storageBucket: nusantaragroup-905e2.appspot.com
messagingSenderId: 
appId: 
measurementId: 

=== VAPID Key ===
vapidKey: 

=== Date ===
Retrieved: [TODAY'S DATE]
Retrieved By: [YOUR NAME]
```

---

## 🔧 Files to Update

After getting credentials, update these 2 files:

### File 1: `/frontend/src/firebase/firebaseConfig.js`

**Find and replace:**
```javascript
// BEFORE (Line 11-17)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",           // ❌ REPLACE
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// AFTER (with real values)
const firebaseConfig = {
  apiKey: "AIza...",                     // ✅ PASTE HERE
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456",
  measurementId: "G-XXXXXXXXXX"
};
```

**Find and replace VAPID:**
```javascript
// BEFORE (Line 64)
vapidKey: 'YOUR_VAPID_KEY_HERE'  // ❌ REPLACE

// AFTER (with real value)
vapidKey: 'BNXj3h4K9L2M5P8...'  // ✅ PASTE HERE
```

### File 2: `/frontend/public/firebase-messaging-sw.js`

**Find and replace:**
```javascript
// BEFORE (Line 14-19)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// AFTER (with real values)
const firebaseConfig = {
  apiKey: "AIza...",              // ✅ PASTE HERE
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

---

## ✅ Verification Checklist

After updating files:

- [ ] `firebaseConfig.apiKey` tidak lagi "YOUR_API_KEY_HERE"
- [ ] `firebaseConfig.messagingSenderId` adalah angka (bukan "YOUR_SENDER_ID")
- [ ] `firebaseConfig.appId` dimulai dengan "1:" (bukan "YOUR_APP_ID")
- [ ] `vapidKey` dimulai dengan "B" dan sangat panjang
- [ ] Kedua file (firebaseConfig.js dan firebase-messaging-sw.js) sudah diupdate
- [ ] File `firebase-web-config.txt` disimpan di tempat aman (TIDAK di Git!)

---

## 🧪 Testing Steps

### 1. Restart Frontend
```bash
cd /root/APP-YK/frontend
npm start
```

### 2. Open Browser Console
```
F12 → Console tab
```

### 3. Login to App
```
http://localhost:3000/login
```

### 4. Check Console Logs

**Expected Success Logs:**
```
✅ Firebase Messaging initialized successfully
✅ Notification permission granted
✅ FCM Token received: eyJhb...
✅ FCM token registered with backend
🔔 NotificationManager initialized successfully
```

**If you see errors:**
```
❌ Firebase initialization error: [API_KEY_INVALID]
   → Check apiKey is correct

❌ Error getting token: [VAPID_KEY_INVALID]
   → Check vapidKey is correct

❌ Firebase messaging not initialized
   → Check firebaseConfig values
```

### 5. Check Database

```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, user_id, LEFT(token, 40) as token_preview, device_type, created_at FROM notification_tokens ORDER BY created_at DESC LIMIT 5;"
```

**Expected:**
```
 id | user_id | token_preview                     | device_type | created_at
----+---------+-----------------------------------+-------------+-------------------
  1 | USR-... | eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXV... | web         | 2024-10-19 21:30:00
```

### 6. Test Notification

**Create RAB:**
```
1. Go to Project → RAB
2. Click "Add RAB"
3. Fill form dengan status "Under Review"
4. Click Save
```

**Expected:**
```
✅ Notification toast appears (top-right)
✅ Browser notification appears
✅ Android notification appears (if on mobile)
```

---

## 🚨 Troubleshooting

### Error: "API_KEY_INVALID"
**Solution:** Check apiKey di Firebase Console → Project Settings → General

### Error: "VAPID_KEY_INVALID"
**Solution:** Regenerate VAPID key di Cloud Messaging tab

### Error: "No registration token available"
**Solution:** 
1. Check service worker registered: `navigator.serviceWorker.getRegistrations()`
2. Check notification permission: `Notification.permission` (should be "granted")
3. Clear browser cache and retry

### No notification appears
**Check:**
1. Browser notification permission granted?
2. FCM token in database?
3. Backend logs show "notification sent"?
4. Service worker active?

---

## 📚 Additional Resources

**Firebase Documentation:**
- https://firebase.google.com/docs/cloud-messaging/js/client
- https://firebase.google.com/docs/cloud-messaging/js/receive

**Notification API:**
- https://developer.mozilla.org/en-US/docs/Web/API/Notifications_API

**Service Workers:**
- https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API

---

## 🔐 Security Notes

⚠️ **IMPORTANT:**

1. **Never commit credentials to Git!**
   ```bash
   # Add to .gitignore
   firebase-web-config.txt
   frontend/src/firebase/firebaseConfig.js
   frontend/public/firebase-messaging-sw.js
   ```

2. **Use environment variables in production:**
   ```javascript
   const firebaseConfig = {
     apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
     authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
     // ...
   };
   ```

3. **Restrict API keys in Firebase Console:**
   ```
   Project Settings → General → API Keys
   → Click key → Set application restrictions
   ```

---

**Created:** October 19, 2024  
**Status:** ⏳ Waiting for credentials from Firebase Console  
**Next:** Paste credentials and test!
