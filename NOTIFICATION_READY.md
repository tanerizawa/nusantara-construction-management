✅ NOTIFIKASI SIAP!

**FCM Token sudah tersimpan di database:**
- User: USR-MGR-AZMY-001
- Token: eNSdmTQQcJlICW278v1Hvn:APA91b...
- Device: web

**Untuk test notifikasi:**

### Cara 1: Via Frontend (Recommended)
1. Buka HP: http://31.97.222.208:3000
2. Login dengan:
   - Username: azmy (atau user lain)
   - Password: [password]
3. Go to: Projects → RAB
4. Click "Add RAB"
5. Fill form:
   - Description: Test Notification
   - Quantity: 100
   - Unit: m3
   - Unit Price: 500000
   - **Status: Under Review** (penting!)
6. Click Save
7. **Notifikasi akan muncul di HP!** 🎉

### Cara 2: Via Another User
1. Login dari komputer lain sebagai user berbeda
2. Create RAB dengan status "Under Review"
3. User yang token-nya terdaftar (azmy) akan terima notifikasi di HP

### Verify Notification Sent
```bash
# Check backend logs
docker logs nusantara-backend --tail 50 | grep -i "notification\|fcm"

# Check database
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT COUNT(*) FROM notification_tokens WHERE is_active = true;"
```

### Troubleshoot
Jika notifikasi tidak muncul:
1. Check HP notification permission (Chrome → Settings)
2. Check battery saver OFF
3. Check Do Not Disturb OFF
4. Check backend logs for errors
5. Verify token still in database

**Status:** ✅ READY TO TEST!
