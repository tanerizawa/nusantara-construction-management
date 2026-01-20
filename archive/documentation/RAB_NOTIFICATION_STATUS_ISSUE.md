# 🎯 CARA TEST NOTIFIKASI RAB

## ❌ Masalah Yang Ditemukan:

**RAB dibuat dengan status `draft`, bukan `under_review`**
- Notifikasi FCM **hanya dikirim** saat status = `under_review` atau `pending_approval`
- Backend code (line 331-341 di rab.routes.js) mengecek status sebelum kirim notifikasi
- Default status saat create = `draft` (line 211 di useRABItems.js)

## ✅ SOLUSI - Test Via Frontend:

### **Cara 1: Buat RAB Baru dari HP**
1. **Buka HP**: http://31.97.222.208:3000
2. **Login**: azmy / Admin123
3. **Pilih Project**: 2025PJK001
4. **Create RAB**:
   - Kategori: Material
   - Deskripsi: Besi 12mm untuk test notif
   - Satuan: kg
   - Qty: 100
   - Harga: 15000
5. **Save** → RAB akan tersimpan dengan status `draft`
6. **Edit RAB** tersebut → **Ubah status jadi `under_review`**

### **Cara 2: Update RAB Existing (Recommended)**
```bash
# 1. Lihat RAB yang ada
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT id, LEFT(description, 30) as desc, status 
   FROM project_rab 
   WHERE project_id = '2025PJK001' 
   ORDER BY created_at DESC 
   LIMIT 3;"

# 2. Update status RAB ke 'under_review' via database
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "UPDATE project_rab 
   SET status = 'under_review' 
   WHERE id = '33950922-3372-4ec7-a24d-c0831e49c3bd';"

# NOTE: Update via database TIDAK trigger notifikasi!
# Notifikasi hanya dikirim saat update via API endpoint
```

### **Cara 3: Trigger Manual via API** (Need Auth Fix)
Saat ini ada issue 400/401 saat create via API dari curl.
Perlu debug lebih lanjut atau test via Postman.

---

## 🔍 Root Cause Analysis:

1. **Frontend** (useRABItems.js line 211):
   ```js
   status: 'draft',  // ← Selalu draft!
   ```

2. **Backend** (rab.routes.js line 331):
   ```js
   if (status === 'under_review' || status === 'pending_approval') {
     await sendRABApprovalNotification(id, rabItem, creatorName);
   }
   ```

3. **Solution Options**:
   - **A)** Change frontend default status dari `draft` → `under_review`
   - **B)** Add status dropdown di RAB form (user bisa pilih)
   - **C)** Auto-trigger notif even for `draft` status
   - **D)** Add "Submit for Approval" button yang update status

---

## 📱 Testing Checklist:

✅ FCM Token registered (user azmy)
✅ Firebase config updated
✅ VAPID key correct
✅ Service worker working
✅ Backend notification service ready
❌ RAB status default is `draft` (needs `under_review`)

**Next Step:** 
Update RAB status di frontend atau tambahkan dropdown status saat create RAB.

---

## 🚀 Quick Fix - Change Default Status:

Edit: `/root/APP-YK/frontend/src/components/workflow/rab-workflow/hooks/useRABItems.js`

Line 211:
```js
// OLD:
status: 'draft',

// NEW:
status: 'under_review',  // Auto-send notification on create
```

Restart frontend:
```bash
docker-compose restart frontend
```

Lalu buat RAB baru dari HP → notifikasi akan langsung muncul! 🎉
