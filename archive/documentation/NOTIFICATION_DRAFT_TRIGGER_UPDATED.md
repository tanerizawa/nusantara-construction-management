# ✅ NOTIFIKASI RAB - LOGIC UPDATED

## 🔄 Perubahan Logic Notifikasi:

### **SEBELUM:**
```js
// Notifikasi hanya untuk under_review & pending_approval
if (status === 'under_review' || status === 'pending_approval') {
  await sendRABApprovalNotification();
}
```

### **SESUDAH:**
```js
// Notifikasi untuk SEMUA status termasuk draft
if (status === 'draft' || status === 'under_review' || status === 'pending_approval') {
  await sendRABApprovalNotification();
}
```

---

## 📝 File Yang Diubah:

### 1. Backend - CREATE RAB (Line 331)
**File:** `/backend/routes/projects/rab.routes.js`
```diff
- // Send notification if RAB requires approval
- if (status === 'under_review' || status === 'pending_approval') {
+ // Send notification when RAB is created (including draft status)
+ if (status === 'draft' || status === 'under_review' || status === 'pending_approval') {
```

### 2. Backend - UPDATE RAB (Line 576)
**File:** `/backend/routes/projects/rab.routes.js`
```diff
- // Send notification if status changed to require approval
- if (status && (status === 'under_review' || status === 'pending_approval') &&
+ // Send notification if status changed (including draft)
+ if (status && (status === 'draft' || status === 'under_review' || status === 'pending_approval') &&
```

### 3. Frontend - Default Status (Line 211)
**File:** `/frontend/src/components/workflow/rab-workflow/hooks/useRABItems.js`
```diff
- status: 'under_review', // Changed from 'draft' to trigger FCM notification
+ status: 'draft', // Default status - will trigger FCM notification
```

---

## 🎯 Impact:

**SEKARANG:**
- ✅ RAB dibuat dengan status **`draft`** (default)
- ✅ Notifikasi **LANGSUNG DIKIRIM** saat create
- ✅ Notifikasi juga dikirim saat update ke `under_review` atau `pending_approval`
- ✅ User tidak perlu ubah status manual

---

## 📱 TEST SEKARANG:

1. **Buka HP**: http://31.97.222.208:3000
2. **Login**: azmy / Admin123
3. **Buat RAB baru** di project 2025PJK001
4. **Save** → Status otomatis `draft`
5. **🔔 NOTIFIKASI LANGSUNG MUNCUL!**

---

## 🔍 Verify Notification Sent:

```bash
# Check backend logs for FCM
docker logs nusantara-backend --tail 50 | grep -i "notification\|fcm"

# Check RAB created
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, LEFT(description, 30), status, created_at 
      FROM project_rab 
      ORDER BY created_at DESC 
      LIMIT 3;"

# Check tokens active
docker exec nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT user_id, device_type, is_active 
      FROM notification_tokens 
      WHERE is_active = true;"
```

---

## ✅ Status:

- ✅ Backend restarted with new logic
- ✅ Frontend restarted with default 'draft' status
- ✅ FCM token registered (user azmy)
- ✅ Notification will trigger on ANY RAB creation

**Ready to test!** 🚀
