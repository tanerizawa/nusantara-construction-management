# Panduan Setup RAB Tracking di Milestone

**Tanggal:** 4 November 2025  
**Topik:** Mengaktifkan Actual Cost Tracking dari RAB Items

---

## 📋 Masalah

Di tab **"Biaya & Kasbon"** milestone, hanya muncul **Additional Costs** tetapi tidak muncul **RAB Items** untuk tracking actual cost per item RAB.

---

## 🔍 Akar Masalah

Milestone belum di-**link** ke kategori RAB. Field `category_link` di database masih `NULL`.

```sql
-- Check milestone RAB link status
SELECT id, title, category_link 
FROM project_milestones 
WHERE id = 'd92b3f67-f59b-4eec-a64e-915a0dd83689';

-- Result:
-- category_link: NULL ❌
```

### Backend Logic

```javascript
// backend/routes/projects/milestoneDetail.routes.js
// GET /api/projects/:projectId/milestones/:milestoneId/rab-items

if (!milestone.category_link || !milestone.category_link.enabled) {
  return res.json({
    success: true,
    data: [],  // ← Empty! No RAB items shown
    message: 'No RAB link configured for this milestone'
  });
}
```

---

## ✅ Solusi

### Langkah 1: Edit Milestone

1. Buka halaman milestone detail
2. Klik tombol **"Edit"** (icon pensil) di pojok kanan atas milestone card
3. Form edit milestone akan terbuka

### Langkah 2: Aktifkan RAB Link

Di form edit milestone, cari bagian **"RAB Link"** atau **"Link to RAB Category"**:

1. **Toggle/Enable** RAB link
2. **Pilih kategori RAB** yang sesuai dari dropdown
   - Contoh: "Materials", "Labor", "Equipment", dll
   - Kategori harus sudah memiliki RAB items yang approved
3. Budget milestone akan **otomatis terisi** dari total nilai RAB kategori tersebut

### Langkah 3: Simpan

1. Klik tombol **"Update Milestone"** atau **"Simpan"**
2. Refresh halaman
3. RAB Items section akan muncul di tab "Biaya & Kasbon"

---

## 📊 Fitur RAB Tracking

Setelah RAB link diaktifkan, Anda akan dapat:

### 1. **Melihat Semua Item RAB**
- List lengkap item RAB dari kategori yang di-link
- Menampilkan:
  - Deskripsi item
  - Quantity & unit
  - Planned amount (dari RAB)
  - Actual amount (realisasi)
  - Variance (selisih)
  - Progress percentage

### 2. **Mencatat Actual Cost Per Item**
- Klik **"Add Realization"** pada item RAB
- Input:
  - Amount (nilai realisasi)
  - Description
  - Reference number (optional)
  - Expense account (dari Chart of Accounts)
  - Source account (Bank/Kas - sumber dana)
- Sistem otomatis:
  - Calculate variance
  - Update progress percentage
  - Highlight jika over budget

### 3. **Budget Monitoring Real-time**
- **Total Planned:** Sum of all RAB items
- **Total Actual:** Sum of all realizations
- **Total Variance:** Planned - Actual
  - Positive (hijau) = Under budget ✅
  - Negative (merah) = Over budget ⚠️
- **Completion Status:**
  - Not started: No realization yet
  - In progress: Partial realization
  - Completed: Realization >= planned
  - Over budget: Realization > planned

### 4. **Additional Costs (Di Luar RAB)**
- Tetap bisa menambah cost yang **tidak ada di RAB**
- Kategori: kasbon, overtime, emergency, unforeseen
- Tidak terikat ke item RAB tertentu

---

## 🎯 Struktur Data

### Milestone dengan RAB Link
```json
{
  "id": "d92b3f67-f59b-4eec-a64e-915a0dd83689",
  "title": "Implementasi RAB - uji coba 2025",
  "category_link": {
    "enabled": true,
    "category_name": "Materials",
    "category_id": "CAT-001",
    "totalValue": 60000000
  }
}
```

### RAB Item dengan Realization
```json
{
  "id": "RAB-001",
  "description": "Semen Portland 50kg",
  "quantity": 100,
  "unit": "sak",
  "unit_price": 75000,
  "planned_amount": 7500000,
  "actual_amount": 7350000,
  "variance": 150000,  // Under budget
  "progress_percentage": 98,
  "realization_status": "completed",
  "realization_count": 2
}
```

---

## 🔄 Workflow Lengkap

```
1. Buat Project
   ↓
2. Buat & Approve RAB Items (per kategori)
   ↓
3. Buat Milestone
   ↓
4. Edit Milestone → Enable RAB Link → Pilih Kategori
   ↓
5. Tab "Biaya & Kasbon" → RAB Items Section muncul
   ↓
6. Untuk setiap item RAB:
   - Klik "Add Realization"
   - Input actual cost
   - Pilih sumber dana (Bank/Kas Tunai)
   - Simpan
   ↓
7. Sistem otomatis:
   - Update progress
   - Calculate variance
   - Alert jika over budget
   - Update milestone budget status
```

---

## 🛠️ Technical Implementation

### Frontend Changes
**File:** `frontend/src/components/milestones/detail-tabs/CostsTab.js`

**Added:** Info box yang muncul jika RAB link belum diaktifkan:

```jsx
{/* Info: RAB Link Not Configured */}
{!loadingRAB && (!rabItems || rabItems.length === 0) && (
  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-blue-400" />
      <div>
        <h4 className="font-semibold text-blue-400 mb-1">
          RAB Tracking Belum Diaktifkan
        </h4>
        <p className="text-sm text-gray-300">
          Milestone ini belum di-link ke kategori RAB...
        </p>
        <ol className="text-sm text-gray-300 space-y-1 ml-4 list-decimal">
          <li>Klik tombol Edit pada milestone</li>
          <li>Pilih kategori RAB di bagian RAB Link</li>
          <li>Simpan perubahan</li>
        </ol>
      </div>
    </div>
  </div>
)}
```

### Backend Endpoints

**1. Get RAB Items for Milestone**
```
GET /api/projects/:projectId/milestones/:milestoneId/rab-items
```
- Returns RAB items dengan actual cost summary
- Only items dari kategori yang di-link
- Include: variance, progress, status

**2. Get Realizations for RAB Item**
```
GET /api/projects/:projectId/milestones/:milestoneId/rab-items/:rabItemId/realizations
```
- Returns all cost entries for specific RAB item
- Show history of realizations

**3. Add Cost (with RAB link)**
```
POST /api/projects/:projectId/milestones/:milestoneId/costs
Body: {
  rabItemId: "RAB-001",  // Link to RAB item
  amount: 1000000,
  sourceAccountId: "COA-110107"  // Kas Tunai
}
```

---

## 📝 Catatan Penting

1. **RAB Must Be Approved First**
   - RAB items harus sudah di-approve sebelum bisa di-link ke milestone
   - Status RAB: `approved` & `is_approved = true`

2. **One Category Per Milestone**
   - Satu milestone hanya bisa di-link ke **satu kategori RAB**
   - Jika butuh multiple categories, buat multiple milestones

3. **Budget Auto-Calculated**
   - Ketika RAB link enabled, budget milestone = sum of RAB items di kategori tersebut
   - Budget field menjadi read-only

4. **Additional Costs Still Available**
   - Tetap bisa tambah cost di luar RAB items
   - Gunakan untuk biaya tidak terduga/kasbon/overtime

5. **Kas Tunai = Unlimited**
   - Jika pilih source account "Kas Tunai", tidak ada validasi saldo
   - Treated as owner's capital injection

---

## ✅ Checklist Testing

- [ ] Edit milestone → Enable RAB link → Pilih kategori
- [ ] RAB Items section muncul di tab "Biaya & Kasbon"
- [ ] Bisa add realization untuk item RAB
- [ ] Progress percentage ter-update otomatis
- [ ] Variance calculated correctly (positive/negative)
- [ ] Status berubah: not_started → in_progress → completed
- [ ] Over budget warning muncul jika actual > planned
- [ ] Additional costs tetap bisa ditambahkan
- [ ] Kas Tunai source account: no balance validation

---

## 🐛 Troubleshooting

### RAB Items Tidak Muncul
**Problem:** Section RAB kosong/tidak ada

**Check:**
1. Apakah milestone sudah di-link ke kategori RAB?
   ```sql
   SELECT category_link FROM project_milestones WHERE id = 'xxx';
   -- Harus tidak NULL dan enabled = true
   ```
2. Apakah kategori RAB tersebut punya items yang approved?
   ```sql
   SELECT * FROM project_rab 
   WHERE category = 'Materials' 
     AND is_approved = true 
     AND status = 'approved';
   ```
3. Check browser console for API errors

### Insufficient Balance Error (Kas Tunai)
**Problem:** Error "Saldo tidak cukup" padahal pilih Kas Tunai

**Solution:** 
- Sudah di-fix di `backend/routes/projects/milestoneDetail.routes.js`
- Kas Tunai (account_code = '1101.07') skip balance validation
- Restart backend jika masih error

---

## 📚 Related Documentation

- `docs/SUMBER_DANA_KASBON_ANALYSIS_BEST_PRACTICE.md` - Source account implementation
- `docs/KAS_TUNAI_MODAL_OWNER_BEST_PRACTICE.md` - Unlimited cash logic

---

**Status:** ✅ IMPLEMENTED  
**Version:** 1.0  
**Author:** GitHub Copilot  
**Last Updated:** 4 November 2025
