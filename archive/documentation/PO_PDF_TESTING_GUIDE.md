# 🧪 CARA TESTING PURCHASE ORDER PDF - PERUBAHAN BARU

## ⚠️ PENTING: Clear Cache Browser!

Sebelum testing, pastikan untuk **clear cache browser** atau buka di **Incognito/Private Window** agar tidak menggunakan PDF yang lama.

---

## 📋 Step-by-Step Testing

### 1️⃣ **Login ke Aplikasi**
```
URL: http://localhost:3000
Username: hadez (atau username Anda)
Password: (password Anda)
```

### 2️⃣ **Buka Purchase Order List**
```
Navigasi: Menu → Purchase Orders
Atau: http://localhost:3000/purchase-orders
```

### 3️⃣ **Pilih Purchase Order yang sudah ada**
Klik salah satu PO yang ada di list, contoh:
- PO Number: **PO-1760549092127**
- Project: **2025BSR001**
- Subsidiary: **CV. BINTANG SURAYA** (NU002)

### 4️⃣ **Generate PDF**
Di halaman detail PO, klik tombol:
- **"Generate Invoice"** atau
- **"Download PDF"** atau
- **"Lihat PDF"**

PDF akan terbuka di tab baru browser.

### 5️⃣ **Verifikasi Perubahan**

Cek hal-hal berikut di PDF:

#### ✅ **Header (Bagian Atas)**
**Sebelum:**
```
PT Nusantara Construction  ← Hardcoded
```

**Sesudah (yang benar):**
```
CV. BINTANG SURAYA  ← Dari subsidiary project
```

#### ✅ **Jumlah Halaman**
**Sebelum:** 2 halaman
**Sesudah:** **1 halaman** (semua konten muat dalam 1 halaman)

#### ✅ **Posisi TOTAL**
**Sebelum:** Nilai TOTAL overlap dengan tabel di atasnya
**Sesudah:** Posisi TOTAL rapi, tidak overlap

#### ✅ **Tanda Tangan (Bagian Bawah)**
**Sebelum:**
```
Yang Memesan,
Jakarta, 15 Oktober 2025

USR-IT-HADEZ-001  ← Username, salah!
(Pimpinan Subsidiary)
```

**Sesudah (yang benar):**
```
Yang Memesan,
Jakarta, 15 Oktober 2025

Ahmad Wijaya, S.E.  ← Nama direktur dari database
(Direktur)
```

---

## 🔍 Cek Backend Logs

Untuk melihat proses di backend, buka terminal dan jalankan:

```bash
# Lihat log saat generate PDF
docker-compose logs --tail=50 backend | grep -E "Subsidiary|director|Company info"
```

**Output yang benar:**
```
✓ Subsidiary data loaded: CV. BINTANG SURAYA
✓ Board of directors: [{"name":"Ahmad Wijaya, S.E.","position":"Direktur Utama",...}]
✓ Extracting director from board_of_directors...
✓ Director found: Ahmad Wijaya, S.E. ( Direktur Utama )
✓ Company info for PDF: {
  name: 'CV. BINTANG SURAYA',
  director: 'Ahmad Wijaya, S.E.',
  city: 'Jakarta'
}
```

---

## 📊 Data Subsidiary yang Tersedia

Saat ini, subsidiary berikut sudah memiliki data direktur:

| ID | Nama Subsidiary | Direktur |
|----|----------------|----------|
| NU001 | CV. CAHAYA UTAMA EMPATBELAS | Budi Santoso, S.T. |
| NU002 | CV. BINTANG SURAYA | Ahmad Wijaya, S.E. |
| NU003 | CV. LATANSA | Hendra Kusuma, S.T., M.Eng. |
| NU004 | CV. GRAHA BANGUN NUSANTARA | Ir. Hartono Wijaya, M.M. |
| NU005 | CV. SAHABAT SINAR RAYA | Ir. Bambang Suryanto |

---

## 🐛 Troubleshooting

### Problem 1: PDF Masih Menampilkan "PT Nusantara Construction"
**Penyebab:** Browser cache
**Solusi:**
1. Clear cache browser (Ctrl+Shift+Delete)
2. Atau buka Incognito window (Ctrl+Shift+N)
3. Generate PDF lagi

### Problem 2: Tanda Tangan Masih Username
**Penyebab:** Project belum ter-link ke subsidiary
**Cek:**
```bash
docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -c \
"SELECT po.po_number, po.project_id, p.subsidiary_id, s.name 
FROM purchase_orders po 
LEFT JOIN projects p ON po.project_id = p.id 
LEFT JOIN subsidiaries s ON p.subsidiary_id = s.id 
WHERE po.po_number = 'PO-1760549092127';"
```

**Jika subsidiary_id NULL:**
- Project belum di-assign ke subsidiary
- Perlu update project untuk set subsidiary_id

### Problem 3: PDF Error "Not Found"
**Cek backend logs:**
```bash
docker-compose logs --tail=100 backend | grep -i error
```

### Problem 4: Director Name Masih Blank
**Penyebab:** board_of_directors data kosong
**Cek:**
```bash
docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -c \
"SELECT id, name, board_of_directors 
FROM subsidiaries 
WHERE id = 'NU002';"
```

**Jika kosong, tambahkan data:**
```sql
UPDATE subsidiaries 
SET board_of_directors = '[
  {
    "name": "Nama Direktur",
    "position": "Direktur Utama",
    "phone": "+62-812-xxxx-xxxx",
    "email": "email@domain.com",
    "appointmentDate": "2020-01-01",
    "isActive": true
  }
]'::jsonb
WHERE id = 'NU002';
```

---

## 🎯 Checklist Testing

- [ ] Clear browser cache atau buka Incognito
- [ ] Login ke aplikasi
- [ ] Buka Purchase Order list
- [ ] Pilih PO yang ter-link ke subsidiary
- [ ] Klik Generate/Download PDF
- [ ] **Verifikasi Header** → Nama subsidiary (bukan PT Nusantara)
- [ ] **Verifikasi Halaman** → Hanya 1 halaman
- [ ] **Verifikasi TOTAL** → Tidak overlap
- [ ] **Verifikasi Signature** → Nama direktur (bukan username)
- [ ] Cek backend logs untuk konfirmasi

---

## 📸 Screenshot Comparison

### BEFORE (Salah) ❌
```
┌─────────────────────────────────────┐
│ PT Nusantara Construction          │ ← Hardcoded
│ Jakarta, Indonesia                  │
│ Telp: 021-xxx | Email: info@...    │
└─────────────────────────────────────┘

        PURCHASE ORDER
        ...
        
(Content di 2 halaman)          ← Terlalu panjang

Total: Rp 10.000.000           ← Overlap!

...

Yang Memesan,
Jakarta, 15 Okt 2025

USR-IT-HADEZ-001               ← Username!
(Pimpinan Subsidiary)
```

### AFTER (Benar) ✅
```
┌─────────────────────────────────────┐
│ CV. BINTANG SURAYA                 │ ← Dari subsidiary!
│ Jakarta, Indonesia                  │
│ Telp: 021-xxx | Email: info@...    │
└─────────────────────────────────────┘

        PURCHASE ORDER
        ...
        
(Semua content di 1 halaman)    ← Compact!

Total: Rp 10.000.000           ← Posisi rapi!

...

Yang Memesan,
Jakarta, 15 Okt 2025

Ahmad Wijaya, S.E.             ← Nama direktur!
(Direktur)
```

---

## 💡 Tips

1. **Gunakan Incognito** untuk testing agar tidak ter-affect cache
2. **Cek backend logs** untuk debug jika ada masalah
3. **Verifikasi data subsidiary** punya board_of_directors
4. **Test dengan berbagai PO** untuk memastikan konsistensi

---

## ✅ Status Implementasi

- ✅ Backend code updated
- ✅ PDF generator optimized
- ✅ Director extraction implemented
- ✅ Database populated with directors
- ✅ Enhanced logging added
- ✅ Backend restarted

**READY FOR TESTING!** 🚀

Silakan test dan beri tahu jika masih ada yang perlu diperbaiki!
