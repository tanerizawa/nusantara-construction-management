# Troubleshooting Notifikasi Tidak Muncul di HP

## Checklist Cepat

### 1. Apakah sudah login via HP?
- [ ] Buka http://YOUR_SERVER_IP:3000 di HP
- [ ] Login dengan akun user
- [ ] Browser akan minta permission

### 2. Apakah sudah allow notification?
- [ ] Browser dialog: "Allow notifications?" → Click Allow
- [ ] Android dialog: "Chrome wants to send notifications" → Click Allow

### 3. Check FCM Token
Jalankan:
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, user_id, device_type FROM notification_tokens;"
```

Jika kosong (0 rows) → Token belum teregister

### 4. Check Browser Console di HP
- Buka Chrome di HP
- Login ke app
- Chrome DevTools: chrome://inspect
- Atau check via Desktop Chrome → Remote Devices
- Look for: "Firebase Messaging initialized successfully"

### 5. Test Notification
- Login di HP
- Create RAB dari komputer lain
- Check HP notification

## Solusi Umum

### A. Token Tidak Teregister
**Penyebab:** User belum login atau permission denied

**Fix:**
1. Logout dari app
2. Clear browser cache (Chrome → Settings → Privacy → Clear browsing data)
3. Login ulang
4. Allow permission saat diminta
5. Check console: "FCM Token received"

### B. Permission Denied
**Penyebab:** User block notification

**Fix:**
1. Chrome → Settings → Site settings → Notifications
2. Find localhost:3000 atau IP server
3. Change to "Allow"
4. Reload page

### C. Service Worker Tidak Aktif
**Penyebab:** Service worker failed to register

**Fix:**
1. Chrome DevTools → Application → Service Workers
2. Check if firebase-messaging-sw.js is registered
3. If not, unregister all and reload

### D. HTTPS Required (Production)
**Penyebab:** Service Worker requires HTTPS in production

**Fix:**
1. Setup SSL certificate
2. Use ngrok for testing: `ngrok http 3000`
3. Access via HTTPS URL

## Test Commands

### Check Token di Database
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT COUNT(*) FROM notification_tokens;"
```

### Check Backend Logs
```bash
docker logs nusantara-backend --tail 50 | grep -i notification
```

### Test Send Notification
```bash
# Create RAB via API
curl -X POST http://localhost:5000/api/projects/rab \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": 1,
    "description": "Test Notification",
    "quantity": 1,
    "unit": "pcs",
    "unit_price": 100000,
    "status": "under_review"
  }'
```

## Verifikasi Step-by-Step

### Step 1: Check Config File
```bash
grep -n "apiKey" /root/APP-YK/frontend/src/firebase/firebaseConfig.js
```
Harus ada value real (bukan "YOUR_API_KEY")

### Step 2: Check Service Worker
```bash
grep -n "apiKey" /root/APP-YK/frontend/public/firebase-messaging-sw.js
```
Harus sama dengan firebaseConfig.js

### Step 3: Frontend Running?
```bash
docker ps | grep frontend
```
Harus "Up" dan "healthy"

### Step 4: Backend Running?
```bash
docker ps | grep backend
```
Harus "Up" dan "healthy"

### Step 5: Test dari HP
1. Buka Chrome di HP
2. Go to: http://SERVER_IP:3000
3. Login
4. Check notification permission
5. Create test data

## Debugging di HP

### Chrome Remote Debugging
1. Di HP: Enable USB debugging (Developer options)
2. Connect HP ke komputer via USB
3. Di Desktop Chrome: chrome://inspect
4. Select device → Inspect
5. Check console logs

### Check Notification Permission
```javascript
// Di browser console HP:
Notification.permission
// Should return: "granted"
```

### Check Service Worker
```javascript
// Di browser console HP:
navigator.serviceWorker.getRegistrations().then(console.log)
// Should show firebase-messaging-sw.js
```

### Check FCM Token
```javascript
// Di browser console HP (after login):
localStorage.getItem('token')  // Auth token
// Check console for: "FCM Token received: ..."
```

## Common Issues

### Issue 1: "Notification permission denied"
**Fix:** Chrome settings → Notifications → Allow for this site

### Issue 2: "Service worker registration failed"
**Fix:** Clear cache, reload, check HTTPS requirement

### Issue 3: "No FCM token received"
**Fix:** Check vapidKey is correct, regenerate if needed

### Issue 4: "Token registered but no notification"
**Fix:** Check backend logs, verify RAB creation triggers notification

### Issue 5: "Notification works on desktop but not mobile"
**Fix:** Check mobile Chrome version (need 42+), check battery saver mode

## Next Steps

1. **Verify config:** Run verify script
2. **Check token:** Query database
3. **Test from HP:** Login and allow permission
4. **Create RAB:** Trigger notification
5. **Check logs:** Backend and frontend

## Quick Fix Script

```bash
#!/bin/bash
echo "=== Notification Troubleshoot ==="
echo "1. Check FCM Tokens:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT COUNT(*) as token_count FROM notification_tokens;"

echo ""
echo "2. Check Backend Logs:"
docker logs nusantara-backend --tail 20 | grep -i notification

echo ""
echo "3. Check Frontend Status:"
docker ps | grep frontend

echo ""
echo "4. Access app from HP:"
echo "   http://$(hostname -I | awk '{print $1}'):3000"
```

Save as: troubleshoot-notification.sh
Run: ./troubleshoot-notification.sh
