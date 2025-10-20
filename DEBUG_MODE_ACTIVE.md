# 🔍 DEBUGGING MODE ACTIVATED

## ✅ Yang Sudah Dilakukan:

1. **Added extensive logging** di:
   - `/backend/routes/projects/rab.routes.js` (bulk endpoint)
   - `/backend/services/FCMNotificationService.js` (FCM service)

2. **Logging akan menampilkan:**
   - Berapa items yang dibuat
   - Berapa items yang require approval
   - Status setiap item
   - Creator name
   - Approver IDs yang ditemukan
   - Token yang digunakan untuk kirim notifikasi
   - Response dari FCM (success/failure)

---

## 📱 TEST SEKARANG & MONITOR LOGS:

### Step 1: Monitor Backend Logs
```bash
# Terminal 1 - Monitor logs real-time
docker logs -f nusantara-backend 2>&1 | grep -E "🔔|📤|📬|🔑|📨|✅|⚠️|❌"
```

### Step 2: Create RAB from HP
1. Login ke http://31.97.222.208:3000
2. Buat RAB baru
3. **Lihat terminal - akan muncul detailed logs!**

---

## 🔍 What To Look For:

Saat RAB dibuat, harusnya muncul log seperti:

```
🔔 [RAB Bulk] Created items: 1, Requiring approval: 1
🔔 [RAB Bulk] Item statuses: ['draft']
🔔 [RAB Bulk] Creator: azmy
🔔 [RAB Bulk] Approver IDs: ['USR-MGR-AZMY-001']
🔔 [RAB Bulk] Sending notification: {...}
📤 [FCM] sendToMultipleUsers called for 1 users
📬 [FCM] sendToUser called for userId: USR-MGR-AZMY-001
🔑 [FCM] Found 1 active tokens for user USR-MGR-AZMY-001
📨 [FCM] Sending message: {...}
✅ [FCM] Response: 1/1 delivered
✅ Bulk RAB approval notification sent for 1 items to 1 users
```

**Jika TIDAK muncul log ini, berarti ada masalah di logic!**

---

## 🐛 Possible Issues To Check:

1. **No items created?**
   - Cek: `Created items: 0`
   - Problem: Request tidak sampai ke bulk endpoint

2. **Items created but requiring approval = 0?**
   - Cek: `Requiring approval: 0`
   - Problem: Status bukan draft/under_review/pending_approval

3. **No approvers found?**
   - Cek: `Approver IDs: []`
   - Problem: Tidak ada project team members atau admin

4. **No tokens found?**
   - Cek: `Found 0 active tokens`
   - Problem: Token tidak terdaftar atau inactive

5. **FCM delivery failed?**
   - Cek: `0/1 delivered`
   - Problem: Token invalid atau FCM error

---

## 🚀 Ready for Deep Debugging!

Backend sudah restart dengan full logging.
**Silakan buat RAB baru dan pantau logs!**

Jika masih tidak muncul notifikasi, paste logs yang muncul di terminal.
