# 📄 Workflow Invoice Hardcopy - Surat Formal

## Alur Kerja Invoice (Hardcopy dengan TTD Basah & Stempel)

### 1️⃣ Payment Approved → Invoice Generated
- Payment di-approve di tab **Progress Payments**
- Invoice otomatis dibuat dengan status **`generated`**
- Invoice muncul di tab **Invoice Management**

### 2️⃣ Download & Cetak PDF Invoice
**Format Surat Formal Mencakup:**
- ✅ Kop surat perusahaan (letterhead)
- ✅ Logo perusahaan
- ✅ Nomor invoice & tanggal
- ✅ Informasi klien lengkap
- ✅ Detail pembayaran (amount, PPN, retensi)
- ✅ Detail rekening bank
- ✅ Ruang untuk tanda tangan basah
- ✅ Ruang untuk stempel perusahaan
- ✅ Ruang untuk materai (jika diperlukan)
- ✅ Footer resmi perusahaan

**Cara Download:**
1. Buka tab **Invoice Management**
2. Cari invoice dengan status **`generated`** (biru)
3. Klik tombol **Printer** 🖨️ untuk download PDF
4. File akan tersimpan: `Invoice-[nomor].pdf`

### 3️⃣ Persiapan Dokumen Fisik
**Checklist Sebelum Kirim:**
- [ ] Cetak invoice pada kertas berkualitas (80gsm minimum)
- [ ] Tanda tangan basah dari Direktur/Pejabat berwenang
- [ ] Stempel perusahaan (cap basah)
- [ ] Materai 10.000 (untuk invoice > Rp 5 juta)
- [ ] Fotocopy untuk arsip internal
- [ ] Amplop resmi perusahaan (optional)

### 4️⃣ Pengiriman Hardcopy
**Metode Pengiriman:**
- 📮 Pos/Kurir
- 🚗 Diantar langsung
- 📫 Diserahkan saat rapat koordinasi

**Setelah Kirim:**
1. Klik tombol **Send** ✉️ (icon amplop kuning)
2. Input nama penerima
3. Tambahkan catatan pengiriman (optional)
4. Status berubah menjadi **`sent`** (kuning)

### 5️⃣ Menunggu Pembayaran
- Invoice status: **`sent`** (Menunggu pembayaran)
- Monitor due date di dashboard
- Jika lewat due date → status otomatis **`overdue`** (merah)

### 6️⃣ Pembayaran Diterima
- Update payment status di tab **Progress Payments**
- Klik **Mark as Paid**
- Invoice status berubah menjadi **`paid`** (hijau)

---

## 🎨 Status Invoice & Maknanya

| Status | Warna | Makna | Action Available |
|--------|-------|-------|------------------|
| **Draft** | Abu-abu | Payment belum approved | - |
| **Generated** | Biru | Siap dicetak & dikirim | Download PDF, Mark as Sent |
| **Sent** | Kuning | Hardcopy terkirim, tunggu pembayaran | Send Email (backup) |
| **Paid** | Hijau | Pembayaran diterima | View, Download |
| **Overdue** | Merah | Lewat due date, belum dibayar | Send Reminder |

---

## 📋 Template Info Perusahaan (Untuk Kustomisasi)

File: `/backend/routes/projects/progress-payment.routes.js`

```javascript
const companyInfo = {
  name: 'PT YK CONSTRUCTION',
  address: 'Jl. Raya Konstruksi No. 123, Jakarta Selatan 12345',
  phone: '021-12345678',
  email: 'info@ykconstruction.com',
  npwp: '01.234.567.8-901.000',
  website: 'www.ykconstruction.com',
  directorName: 'Budi Santoso',
  directorTitle: 'Direktur Utama',
  logoPath: './assets/logo.png' // Optional
};
```

**Untuk Update:**
1. Edit file tersebut
2. Ganti dengan data perusahaan yang sesuai
3. Restart backend: `docker restart nusantara-backend`

---

## 🔧 Technical Details

### Backend API Endpoints

#### Generate PDF
```
GET /api/projects/:projectId/progress-payments/:paymentId/invoice/pdf
```
**Response:** PDF file (application/pdf)

#### Mark as Sent
```
PATCH /api/projects/:projectId/progress-payments/:paymentId/mark-sent
Body: {
  recipientName: string,
  notes: string,
  sentDate: Date
}
```

### Frontend Components
- **InvoiceManager.js** - Main invoice management UI
- **invoicePdfGenerator.js** - PDF generation utility (backend)

### PDF Library
- **PDFKit** - Professional PDF generation for Node.js
- Format: A4 (595x842 points)
- Font: Helvetica family
- Margins: 50pt on all sides

---

## 💡 Tips & Best Practices

### 1. Kualitas Cetak
- Gunakan printer laser untuk hasil terbaik
- Kertas 80gsm minimum (lebih baik 100gsm)
- Pastikan tinta hitam legible

### 2. Tanda Tangan
- Gunakan pena tinta gel/ballpoint hitam/biru
- TTD harus jelas dan sesuai specimen
- Posisi TTD pada ruang yang disediakan

### 3. Stempel
- Stempel basah (bukan digital)
- Posisi di dekat tanda tangan
- Pastikan tidak menutupi informasi penting

### 4. Materai
- Untuk invoice > Rp 5.000.000
- Tempel di area yang disediakan
- Materai juga perlu di-cap/tandatangan sebagian

### 5. Arsip
- Simpan fotocopy invoice yang sudah TTD & stempel
- Scan invoice final untuk backup digital
- Catat tanggal pengiriman dan penerima

### 6. Follow Up
- Konfirmasi penerimaan invoice (1-2 hari setelah kirim)
- Reminder H-3 sebelum due date jika belum dibayar
- Untuk overdue: reminder setiap minggu

---

## ❓ FAQ

**Q: Apakah bisa kirim invoice via email saja?**  
A: Bisa sebagai backup/courtesy copy, tapi invoice resmi tetap perlu hardcopy dengan TTD basah dan stempel untuk legalitas.

**Q: Bagaimana jika klien minta invoice digital?**  
A: Scan invoice yang sudah TTD & stempel, kirim via email. Atau gunakan fitur "Send Email" setelah mark as sent.

**Q: Apa bedanya status 'generated' dan 'sent'?**  
A: `generated` = sudah dibuat, siap dicetak. `sent` = hardcopy sudah dikirim/diterima klien.

**Q: Bagaimana cara edit info perusahaan di invoice?**  
A: Edit file backend `/backend/routes/projects/progress-payment.routes.js` bagian `companyInfo`, lalu restart backend.

**Q: Apakah bisa tambahkan logo perusahaan?**  
A: Ya, simpan logo di `/backend/assets/logo.png`, lalu set `logoPath` di `companyInfo`.

---

## 📞 Support

Untuk pertanyaan atau issue terkait invoice:
1. Check console browser (F12) untuk error
2. Check backend logs: `docker logs nusantara-backend`
3. Contact: tech@ykconstruction.com

---

**Dibuat:** 13 Oktober 2025  
**Versi:** 1.0  
**Author:** Nusantara Construction Management System
