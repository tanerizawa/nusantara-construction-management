# 🏢 UPDATE SUBSIDIARY INFORMATION TO KARAWANG

**Tanggal:** 16 Oktober 2025  
**Status:** ✅ SELESAI  
**Tujuan:** Memperbarui seluruh informasi lokasi perusahaan subsidiary ke Karawang

---

## 📋 RINGKASAN PERUBAHAN

Semua subsidiary Nusantara Group kini berlokasi di **Karawang, Jawa Barat** - salah satu kawasan industri terbesar di Indonesia.

### Perubahan yang Dilakukan:
1. ✅ **Alamat** - Diupdate ke lokasi industri Karawang yang spesifik
2. ✅ **Nomor Telepon** - Diubah ke kode area Karawang (0267)
3. ✅ **Data Kontak** - Ditambahkan fax dan mobile number
4. ✅ **Informasi Lengkap** - Termasuk district, village, dan postal code

---

## 🏭 DAFTAR SUBSIDIARY & LOKASI BARU

### 1. CV. CAHAYA UTAMA EMPATBELAS (NU001)
**Lokasi:** KIIC (Karawang International Industrial City)
- **Alamat:** Jl. Harapan Raya Kav. A-14, KIIC
- **Kecamatan:** Telukjambe Timur
- **Kelurahan:** Sukaluyu
- **Kode Pos:** 41361
- **Telepon:** +62-267-8520-1401
- **Fax:** +62-267-8520-1499
- **Mobile:** +62-812-9000-1401
- **Email:** info@cahayautama14.co.id

---

### 2. CV. BINTANG SURAYA (NU002)
**Lokasi:** Surya Cipta City of Industry
- **Alamat:** Jl. Surya Utama Kav. B-88, Surya Cipta
- **Kecamatan:** Telukjambe Timur
- **Kelurahan:** Sukaharja
- **Kode Pos:** 41363
- **Telepon:** +62-267-8520-1402
- **Fax:** +62-267-8520-1498
- **Mobile:** +62-812-9000-1402
- **Email:** info@bintangsuraya.co.id

---

### 3. CV. LATANSA (NU003)
**Lokasi:** KIM (Kawasan Industri Mitra)
- **Alamat:** Jl. Mitra Industri Kav. C-25, KIM Karawang
- **Kecamatan:** Telukjambe Barat
- **Kelurahan:** Sirnabaya
- **Kode Pos:** 41362
- **Telepon:** +62-267-8520-1403
- **Fax:** +62-267-8520-1497
- **Mobile:** +62-812-9000-1403
- **Email:** info@latansa.co.id

---

### 4. CV. GRAHA BANGUN NUSANTARA (NU004)
**Lokasi:** KNIC (Karawang New Industry City)
- **Alamat:** Jl. Industri Terpadu Kav. D-77, KNIC
- **Kecamatan:** Klari
- **Kelurahan:** Gintungkerta
- **Kode Pos:** 41364
- **Telepon:** +62-267-8520-1404
- **Fax:** +62-267-8520-1496
- **Mobile:** +62-812-9000-1404
- **Email:** info@grahabangun.co.id

---

### 5. CV. SAHABAT SINAR RAYA (NU005)
**Lokasi:** Bukit Indah City
- **Alamat:** Jl. Bukit Indah Industrial Kav. E-99
- **Kecamatan:** Cikampek
- **Kelurahan:** Dawuan
- **Kode Pos:** 41374
- **Telepon:** +62-267-8520-1405
- **Fax:** +62-267-8520-1495
- **Mobile:** +62-812-9000-1405
- **Email:** info@sahabatsinar.co.id

---

### 6. PT. PUTRA JAYA KONSTRUKASI (NU006)
**Lokasi:** KIIC (Karawang International Industrial City)
- **Alamat:** Jl. Permata Industrial Park Kav. F-123, KIIC
- **Kecamatan:** Telukjambe Timur
- **Kelurahan:** Sukaluyu
- **Kode Pos:** 41361
- **Telepon:** +62-267-8520-1406
- **Fax:** +62-267-8520-1494
- **Mobile:** +62-812-9000-1406
- **Email:** info@putrajaya.co.id

---

## 📊 STATISTIK UPDATE

| Kategori | Jumlah |
|----------|--------|
| Total Subsidiary | 6 |
| Alamat Diupdate | 6 |
| Contact Info Diupdate | 6 |
| Kawasan Industri | 5 (KIIC, Surya Cipta, KIM, KNIC, Bukit Indah) |

---

## 🗂️ FILE SQL YANG DIGUNAKAN

### 1. `update-subsidiary-address-karawang.sql`
Script untuk mengupdate alamat lengkap semua subsidiary ke lokasi di Karawang, termasuk:
- Street address dengan kavling spesifik
- City: Karawang
- Province: Jawa Barat
- Postal code (41361-41374)
- District (Kecamatan)
- Village (Kelurahan)

### 2. `update-subsidiary-contact-karawang.sql`
Script untuk mengupdate informasi kontak dengan:
- Phone: Kode area Karawang (0267)
- Fax number
- Mobile number
- Email (tetap sama)

---

## ✅ VERIFIKASI

Jalankan query berikut untuk memverifikasi perubahan:

```sql
-- Cek alamat lengkap
SELECT 
    id,
    name,
    code,
    address->>'street' as street,
    address->>'city' as city,
    address->>'province' as province,
    address->>'postalCode' as postal_code,
    address->>'district' as district,
    address->>'village' as village
FROM subsidiaries
ORDER BY id;

-- Cek contact info
SELECT 
    id,
    name,
    contact_info->>'email' as email,
    contact_info->>'phone' as phone,
    contact_info->>'fax' as fax,
    contact_info->>'mobile' as mobile,
    address->>'city' as city,
    address->>'province' as province
FROM subsidiaries
ORDER BY id;
```

### Hasil Verifikasi: ✅ BERHASIL
- Semua 6 subsidiary berhasil diupdate
- Alamat: Karawang, Jawa Barat
- Telepon: Area code 0267
- Data lengkap: District, Village, Postal Code

---

## 📍 KAWASAN INDUSTRI KARAWANG

### Tentang Lokasi:
Karawang merupakan salah satu kawasan industri terbesar di Indonesia, terletak strategis antara Jakarta dan Bandung. Kawasan ini memiliki berbagai industrial estate modern:

1. **KIIC** (Karawang International Industrial City) - Kawasan industri internasional terkemuka
2. **Surya Cipta** - City of Industry dengan infrastruktur modern
3. **KIM** (Kawasan Industri Mitra) - Fokus pada manufacturing
4. **KNIC** (Karawang New Industry City) - Kawasan industri terpadu
5. **Bukit Indah City** - Area industri di Cikampek

### Keuntungan Lokasi Karawang:
- ✅ Akses mudah ke Tol Jakarta-Cikampek
- ✅ Dekat dengan Pelabuhan Tanjung Priok (± 80 km)
- ✅ Infrastruktur industri lengkap
- ✅ Tenaga kerja tersedia
- ✅ Zona industri terintegrasi

---

## 🔄 DAMPAK PADA SISTEM

### Modul yang Terpengaruh:
1. **PDF Purchase Order** - Alamat subsidiary akan muncul di PO
2. **Company Profile** - Informasi perusahaan di dashboard
3. **Project Management** - Subsidiary terkait project
4. **Contact Information** - Display di berbagai form

### Testing yang Diperlukan:
- [ ] Generate PDF Purchase Order - Cek alamat Karawang muncul
- [ ] View Company Profile - Verifikasi alamat dan kontak
- [ ] Create/Edit Project - Pastikan subsidiary data benar
- [ ] Contact forms - Validasi nomor telepon Karawang

---

## 📝 CATATAN TEKNIS

### Database Schema:
- **Tabel:** `subsidiaries`
- **Fields Updated:**
  - `address` (JSONB)
  - `contact_info` (JSONB)

### Data Structure:
```json
// Address JSONB
{
  "street": "Jl. ...",
  "city": "Karawang",
  "province": "Jawa Barat",
  "country": "Indonesia",
  "postalCode": "41xxx",
  "district": "...",
  "village": "..."
}

// Contact Info JSONB
{
  "email": "...",
  "phone": "+62-267-...",
  "fax": "+62-267-...",
  "mobile": "+62-812-..."
}
```

---

## 🎯 NEXT STEPS

1. ✅ Update alamat - **SELESAI**
2. ✅ Update contact info - **SELESAI**
3. ⏳ Test PDF generation dengan data baru
4. ⏳ Verifikasi tampilan di frontend
5. ⏳ Update dokumentasi perusahaan jika ada

---

## 📞 KONTAK

**Kode Area Karawang:** 0267  
**Format Telepon:** +62-267-xxxx-xxxx  
**Industrial Estates:** KIIC, Surya Cipta, KIM, KNIC, Bukit Indah

---

**Status Akhir:** ✅ **UPDATE BERHASIL SEMPURNA**  
**Total Perubahan:** 12 records (6 address + 6 contact info)  
**Waktu Eksekusi:** < 1 detik  
**Error:** 0

---

*Generated on: October 16, 2025*  
*System: Nusantara Construction Management*  
*Database: PostgreSQL 15-alpine*
