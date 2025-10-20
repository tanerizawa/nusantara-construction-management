✅ AKSES TEST PAGE

**Dari HP:**
http://31.97.222.208:3000/test-fcm.html

**Steps:**
1. Buka URL di atas
2. Click button "Test Firebase & Request Permission"
3. Allow notification
4. Check hasil di page
5. Jika success, token akan muncul

**Jika error:**
- Check console (F12)
- Screenshot error message
- Paste di sini

**Alternative Test (dari app):**
1. Login ke http://31.97.222.208:3000
2. Open browser console (F12 or chrome://inspect)
3. Run:
   ```javascript
   Notification.requestPermission().then(console.log)
   ```
4. Check output

**Check token after:**
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT * FROM notification_tokens;"
```
