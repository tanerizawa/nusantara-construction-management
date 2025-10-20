# 🔥 Panduan Membuat Firebase Project & Get Credentials

## 📋 Langkah 1: Buat/Akses Firebase Project

### 1.1 Buka Firebase Console
```
https://console.firebase.google.com/
```

### 1.2 Login dengan Google Account
- Gunakan akun Google yang akan jadi admin project

### 1.3 Cek Project yang Ada
- Project sudah ada: **nusantaragroup-905e2**
- Jika tidak ada, create new project (skip ke step 2)

---

## 📋 Langkah 2: Setup Web App (Jika Belum Ada)

### 2.1 Buka Project Settings
```
Click icon ⚙️ (gear) di sidebar → Project settings
```

### 2.2 Scroll ke Section "Your apps"
```
Lihat apakah sudah ada Web app (icon </>)
```

### 2.3 Jika Belum Ada Web App - Create New
```
1. Click tombol "Add app"
2. Pilih icon </> (Web)
3. App nickname: "Nusantara Construction Web"
4. ☑ Check "Also set up Firebase Hosting" (optional)
5. Click "Register app"
6. Click "Continue to console"
```

---

## 📋 Langkah 3: Get Web App Config (7 Values)

### 3.1 Navigate ke Web App Config
```
⚙️ Project Settings → Your apps → Web app section
```

### 3.2 Click "Config" Radio Button (bukan "npm")

### 3.3 Copy Firebase SDK Config
```javascript
// You'll see this:
const firebaseConfig = {
  apiKey: "AIzaSyC...",                    // ✅ COPY INI
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.appspot.com",
  messagingSenderId: "123456789",          // ✅ COPY INI
  appId: "1:123456789:web:abc123",         // ✅ COPY INI
  measurementId: "G-XXXXXXXXX"             // ✅ COPY INI (optional)
};
```

### 3.4 Save Values
```
Buat file sementara: firebase-credentials.txt
Paste semua values di atas
```

---

## 📋 Langkah 4: Enable Cloud Messaging

### 4.1 Buka Cloud Messaging Settings
```
⚙️ Project Settings → Tab "Cloud Messaging"
```

### 4.2 Check Cloud Messaging API Status
```
Jika ada peringatan "Cloud Messaging API (Legacy) disabled"
→ Click "Enable" atau "Manage API in Google Cloud Console"
```

### 4.3 Enable API (Jika Diminta)
```
1. Click link ke Google Cloud Console
2. Click "Enable" pada Cloud Messaging API
3. Wait 1-2 menit sampai enabled
4. Refresh Firebase Console page
```

---

## 📋 Langkah 5: Generate Web Push Certificate (VAPID Key)

### 5.1 Scroll ke Section "Web Push certificates"
```
Masih di tab Cloud Messaging
Scroll ke bawah sampai ketemu "Web Push certificates"
```

### 5.2 Generate Key Pair
```
Jika belum ada key:
1. Click "Generate key pair"
2. Key akan muncul instantly
3. Key format: B... (very long string)
```

### 5.3 Copy VAPID Key
```
Key pair: BNXj3h4K9L2M5P8Q1R4T7V0W3Z6A9C2E5G8J...

✅ COPY key ini (full string)
```

### 5.4 Save VAPID Key
```
Tambahkan ke file firebase-credentials.txt
```

---

## 📋 Langkah 6: Setup Service Account (Backend - Sudah Ada)

**Note:** Service account sudah ada di `/backend/config/firebase-service-account.json`

Jika perlu generate baru:
```
⚙️ Project Settings → Tab "Service accounts"
→ Click "Generate new private key"
→ Download JSON file
→ Rename to: firebase-service-account.json
→ Move to: /root/APP-YK/backend/config/
```

---

## 📋 Langkah 7: Verify Credentials

### 7.1 Checklist Values yang Perlu
```
✅ apiKey (AIza...)
✅ authDomain (nusantaragroup-905e2.firebaseapp.com)
✅ projectId (nusantaragroup-905e2)
✅ storageBucket (nusantaragroup-905e2.appspot.com)
✅ messagingSenderId (numbers)
✅ appId (1:...:web:...)
✅ measurementId (G-...) [optional]
✅ vapidKey (B...)
```

### 7.2 Example Format
```
firebase-credentials.txt:
==================================
apiKey: AIzaSyC1234567890abcdefghijklmnop
authDomain: nusantaragroup-905e2.firebaseapp.com
projectId: nusantaragroup-905e2
storageBucket: nusantaragroup-905e2.appspot.com
messagingSenderId: 123456789012
appId: 1:123456789012:web:abc123def456
measurementId: G-ABC123DEF4
vapidKey: BNXj3h4K9L2M5P8Q1R4T7V0W3Z6A9C2E5G8J1M4O7R0U3X6Z9B2D5H8K1N4Q7T0W3Z6
==================================
```

---

## 📋 Langkah 8: Update Frontend Config

### 8.1 Edit File 1
```bash
nano /root/APP-YK/frontend/src/firebase/firebaseConfig.js
```

**Update line 11-17:**
```javascript
const firebaseConfig = {
  apiKey: "PASTE_REAL_API_KEY",
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.appspot.com",
  messagingSenderId: "PASTE_REAL_SENDER_ID",
  appId: "PASTE_REAL_APP_ID",
  measurementId: "PASTE_REAL_MEASUREMENT_ID"
};
```

**Update line 64:**
```javascript
vapidKey: 'PASTE_REAL_VAPID_KEY'
```

### 8.2 Edit File 2
```bash
nano /root/APP-YK/frontend/public/firebase-messaging-sw.js
```

**Update line 14-19:**
```javascript
const firebaseConfig = {
  apiKey: "PASTE_SAME_API_KEY",
  authDomain: "nusantaragroup-905e2.firebaseapp.com",
  projectId: "nusantaragroup-905e2",
  storageBucket: "nusantaragroup-905e2.appspot.com",
  messagingSenderId: "PASTE_SAME_SENDER_ID",
  appId: "PASTE_SAME_APP_ID"
};
```

---

## 📋 Langkah 9: Test Configuration

### 9.1 Restart Frontend
```bash
cd /root/APP-YK/frontend
npm start
```

### 9.2 Check Browser Console
```
1. Open http://localhost:3000
2. Login dengan user credentials
3. F12 → Console tab
4. Look for:
   ✅ "Firebase Messaging initialized successfully"
   ✅ "FCM Token received: ..."
```

### 9.3 Check Permission Dialog
```
Browser akan muncul dialog:
"localhost:3000 wants to send you notifications"
→ Click "Allow"
```

### 9.4 Verify Token in Database
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, user_id, LEFT(token, 40), device_type FROM notification_tokens;"
```

**Expected:** At least 1 row with token

---

## 📋 Langkah 10: Test Notification

### 10.1 Create RAB
```
1. Login to app
2. Go to Project → RAB
3. Click "Add RAB"
4. Fill form
5. Set status "Under Review"
6. Save
```

### 10.2 Check Notification Appears
```
✅ Toast notification (top-right corner)
✅ Browser notification (system)
✅ Backend logs: "notification sent"
```

### 10.3 Check Backend Logs
```bash
docker logs nusantara-backend --tail 50 | grep -i notification
```

**Expected:**
```
[FCM] ✓ Notification sent to X users
[FCM] ✓ Delivered: X/X successful
```

---

## 🚨 Troubleshooting

### Error: "API_KEY_INVALID"
```
Solution:
1. Check apiKey copied correctly (no spaces)
2. Check API key status in Firebase Console
3. Regenerate if needed
```

### Error: "VAPID_KEY_INVALID"
```
Solution:
1. Check vapidKey copied completely
2. Key should start with "B" and be very long
3. Regenerate if needed: Cloud Messaging → Generate new key pair
```

### Error: "Permission denied"
```
Solution:
1. Browser settings → Site settings
2. Remove localhost from blocked list
3. Clear cache and retry
```

### Error: "No registration token available"
```
Solution:
1. Check service worker registered:
   navigator.serviceWorker.getRegistrations()
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)
4. Retry login
```

---

## 📸 Screenshots Guide

### Screenshot 1: Firebase Console Home
```
[Firebase Console Homepage]
- Shows all projects
- Click on "nusantaragroup-905e2"
```

### Screenshot 2: Project Settings
```
[Sidebar]
Click ⚙️ gear icon → Project settings
```

### Screenshot 3: Your Apps Section
```
[General Tab]
Scroll to "Your apps"
Shows: iOS, Android, Web apps
```

### Screenshot 4: Web App Config
```
[Web App Section]
Radio buttons: npm | Config
Select: Config
Shows: firebaseConfig object
```

### Screenshot 5: Cloud Messaging Tab
```
[Cloud Messaging Tab]
- Cloud Messaging API status
- Web Push certificates section
```

### Screenshot 6: Generate VAPID Key
```
[Web Push certificates]
Button: "Generate key pair"
Shows: Key pair (long string starting with B...)
```

---

## ✅ Success Checklist

### Firebase Console
- [ ] Project nusantaragroup-905e2 exists
- [ ] Web app registered
- [ ] Cloud Messaging API enabled
- [ ] VAPID key generated

### Credentials Collected
- [ ] apiKey copied
- [ ] messagingSenderId copied
- [ ] appId copied
- [ ] measurementId copied (optional)
- [ ] vapidKey copied

### Files Updated
- [ ] frontend/src/firebase/firebaseConfig.js (2 places)
- [ ] frontend/public/firebase-messaging-sw.js (1 place)

### Testing
- [ ] Frontend restarted
- [ ] Browser cache cleared
- [ ] Login successful
- [ ] Permission granted
- [ ] FCM token generated
- [ ] Token in database
- [ ] Notification appears on RAB create

---

## 🔐 Security Notes

### DO NOT Commit to Git
```bash
# Add to .gitignore
firebase-credentials.txt
frontend/src/firebase/firebaseConfig.js
frontend/public/firebase-messaging-sw.js
```

### Restrict API Key (Recommended)
```
Firebase Console → Project Settings → General
→ Click API key
→ Set application restrictions:
  - HTTP referrers
  - Add: localhost:3000, your-domain.com
```

### Monitor Usage
```
Firebase Console → Usage and billing
→ Check quotas
→ Set budget alerts
```

---

## ⏱️ Total Time Required

```
Firebase Console navigation:  5 min
Get web app config:          2 min
Generate VAPID key:          2 min
Update frontend files:       3 min
Test configuration:          5 min
-----------------------------------
TOTAL:                      17 min
```

---

## 📞 Support Links

**Firebase Documentation:**
- https://firebase.google.com/docs/web/setup
- https://firebase.google.com/docs/cloud-messaging/js/client

**Firebase Console:**
- https://console.firebase.google.com/

**Google Cloud Console:**
- https://console.cloud.google.com/

---

**Created:** 19 Oktober 2024  
**Project:** nusantaragroup-905e2  
**Purpose:** Setup Firebase Cloud Messaging untuk web app
