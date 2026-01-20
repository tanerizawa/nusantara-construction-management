# 🎯 PANDUAN PENGGUNAAN - PENCARIAN LOKASI CERDAS

## 🚀 FITUR BARU: Smart Address Search

Sistem pencarian lokasi sekarang **LEBIH PINTAR** dan **TOLERAN TERHADAP KESALAHAN**!

---

## ✨ YANG BARU

### ✅ Toleran Typo
Salah ketik? Tidak masalah!
- **"Kerawang"** → Otomatis dikenali sebagai **"Karawang"** ✅
- **"Jakrta"** → Dikenali sebagai **"Jakarta"** ✅
- **"Bandng"** → Dikenali sebagai **"Bandung"** ✅

### ✅ Multi-Level Pencarian
Jika alamat lengkap tidak ditemukan, sistem otomatis:
1. Coba dengan alamat lengkap
2. Coba tanpa nama jalan
3. Coba hanya kota + provinsi
4. Coba hanya provinsi

### ✅ Feedback yang Jelas
Sistem memberitahu tingkat akurasi:
- **✅ Akurat** - Lokasi tepat ditemukan
- **⚠️ Perkiraan Area** - Area ditemukan, perlu cek ulang
- **⚠️ Perkiraan Luas** - Wilayah umum, perlu sesuaikan manual

---

## 📝 CARA MENGGUNAKAN

### Opsi 1: Auto-Search (Direkomendasikan)
1. Isi field alamat (minimal **Kota** atau **Desa**)
2. Klik **"Pilih Koordinat GPS"**
3. Sistem otomatis mencari dan menampilkan di peta
4. Sesuaikan marker jika perlu dengan klik peta
5. Klik **"Simpan"**

### Opsi 2: Manual Search
1. Isi semua field alamat yang tersedia
2. Klik tombol **"🔍 Cari Lokasi dari Alamat"**
3. Peta akan pindah ke lokasi yang ditemukan
4. Klik peta untuk posisi yang lebih tepat
5. Klik **"Simpan"**

### Opsi 3: Manual Click (Fallback)
1. Jika pencarian gagal
2. Scroll/zoom peta secara manual
3. Klik lokasi yang tepat
4. Klik **"Simpan"**

---

## 💡 TIPS AGAR PENCARIAN SUKSES

### ✅ DO (Lakukan):
- **Isi minimal Kota/Kabupaten** - Ini wajib!
- **Gunakan nama resmi** - Contoh: "Karawang" bukan "Kota Karawang"
- **Cek ejaan** - Meski toleran typo, ejaan yang benar lebih baik
- **Lengkapi Provinsi** - Membantu akurasi
- **Cek hasil di peta** - Selalu verifikasi posisi

### ❌ DON'T (Jangan):
- Jangan kosongkan semua field
- Jangan gunakan singkatan tidak standar (contoh: "JKT" untuk Jakarta)
- Jangan harap 100% akurat untuk daerah baru/remote
- Jangan lupa klik peta untuk fine-tuning

---

## 📍 CONTOH PENGGUNAAN

### Contoh 1: Alamat Lengkap
```
Alamat: Jl. MH Thamrin No. 1
Desa/Kel: Menteng
Kecamatan: Menteng
Kota: Jakarta Pusat
Provinsi: DKI Jakarta

Hasil: ✅ Lokasi ditemukan dengan akurat
Zoom: Street level (dekat)
```

### Contoh 2: Typo di Nama Kota
```
Alamat: Jl. Ahmad Yani
Kota: Bandng ← TYPO!
Provinsi: Jawa Barat

Hasil: ⚠️ Lokasi ditemukan (perkiraan area)
System Fix: "Bandng" → "Bandung" otomatis
Zoom: Neighborhood level
Action: Cek visual dan sesuaikan jika perlu
```

### Contoh 3: Daerah Remote
```
Desa: Sukamaju
Kecamatan: Cibitung
Kota: Bekasi
Provinsi: Jawa Barat

Hasil: ✅ Lokasi ditemukan dengan akurat
System: Mencari di database desa
Zoom: Village level
```

### Contoh 4: Hanya Provinsi
```
Provinsi: Bali

Hasil: ⚠️ Lokasi ditemukan (perkiraan luas)
System: Fallback ke pusat provinsi
Zoom: Province level (jauh)
Action: Zoom in dan klik lokasi manual
```

### Contoh 5: Nama Jalan Salah
```
Alamat: Jl. Random Wrong Name ← SALAH!
Kota: Surabaya ← BENAR
Provinsi: Jawa Timur

Hasil: ⚠️ Lokasi ditemukan (perkiraan area)
System: Fallback ke Level 3 (kota only)
Zoom: City level
Action: Cari lokasi manual di peta
```

---

## 🎯 MEMAHAMI PESAN SISTEM

### ✅ "Lokasi ditemukan dengan akurat"
**Artinya**:
- Sistem yakin ini lokasi yang benar
- Skor kecocokan > 70%
- Zoom dekat (street/neighborhood level)

**Yang Perlu Dilakukan**:
- Cek visual di peta
- Klik marker jika perlu penyesuaian kecil
- Lanjut simpan

---

### ⚠️ "Lokasi ditemukan (perkiraan area, mohon cek ulang)"
**Artinya**:
- Sistem menemukan area yang cocok
- Skor kecocokan 40-70%
- Zoom sedang (neighborhood/city level)

**Yang Perlu Dilakukan**:
- **PENTING**: Cek visual di peta
- Zoom in untuk lihat detail
- Klik lokasi yang lebih tepat
- Baru simpan

---

### ⚠️ "Lokasi ditemukan (perkiraan luas, mohon sesuaikan manual)"
**Artinya**:
- Sistem hanya bisa menemukan wilayah umum
- Skor kecocokan 20-40%
- Zoom jauh (city/province level)

**Yang Perlu Dilakukan**:
- **WAJIB**: Cari lokasi manual di peta
- Gunakan layer satelit untuk bantuan
- Zoom in hingga level jalan
- Klik lokasi yang tepat

---

### ❌ "Lokasi tidak ditemukan"
**Artinya**:
- Semua 4 level pencarian gagal
- Alamat mungkin tidak ada di database peta
- Input mungkin salah total

**Yang Perlu Dilakukan**:
1. Cek ejaan nama kota/kabupaten
2. Coba nama yang lebih umum (contoh: "Karawang" bukan "Karawang Barat")
3. Gunakan pencarian manual di peta
4. Klik lokasi yang tepat

---

## 🔧 TROUBLESHOOTING

### Problem: Lokasi tidak ketemu
**Solusi**:
- Pastikan nama **Kota** sudah benar
- Coba gunakan nama kota yang umum
- Periksa ejaan
- Gunakan fallback manual click

### Problem: Lokasi terlalu jauh
**Solusi**:
- Ini normal untuk alamat yang tidak lengkap
- Zoom in secara manual
- Klik lokasi yang tepat di peta
- Sistem tetap simpan koordinat yang Anda pilih

### Problem: Marker tidak muncul
**Solusi**:
- Klik langsung di peta
- Marker akan muncul di posisi klik
- Koordinat tersimpan otomatis

### Problem: Ingin ganti lokasi
**Solusi**:
- Klik tombol **"Hapus Lokasi"**
- Atau langsung klik posisi baru di peta
- Marker akan pindah ke posisi baru

---

## 📊 FAQ

**Q: Apakah harus isi semua field alamat?**  
A: Tidak. Minimal **Kota** atau **Desa/Kelurahan**. Tapi semakin lengkap, semakin akurat.

**Q: Bagaimana jika nama jalan saya salah?**  
A: Sistem akan fallback ke level kota. Anda bisa klik manual di peta setelahnya.

**Q: Apakah sistem bisa mengenali typo?**  
A: Ya! Sistem punya database typo umum (Kerawang→Karawang, dll) dan fuzzy matching.

**Q: Berapa lama proses pencarian?**  
A: 0.5-4 detik tergantung berapa level fallback yang dibutuhkan.

**Q: Apakah bisa untuk alamat di luar Jawa?**  
A: Ya! Sistem bekerja untuk seluruh Indonesia.

**Q: Bagaimana untuk daerah baru/perumahan baru?**  
A: Jika tidak ada di database peta, gunakan pencarian manual atau klik di peta.

**Q: Apakah hasil pencarian selalu akurat?**  
A: Sistem memberikan "best effort". Selalu cek visual dan sesuaikan jika perlu.

**Q: Bisa tidak langsung klik di peta tanpa search?**  
A: Bisa! Opsi manual click selalu tersedia.

---

## 🎓 BEST PRACTICES

### Untuk Proyek di Kota Besar
```
✅ Isi: Jalan, Kelurahan, Kota, Provinsi
✅ Hasil: Akurat sekali
✅ Zoom: Street level
```

### Untuk Proyek di Desa/Remote
```
✅ Isi: Desa, Kecamatan, Kabupaten, Provinsi
⚠️ Hasil: Mungkin perkiraan area
✅ Action: Fine-tune dengan klik manual
```

### Untuk Proyek di Area Baru
```
✅ Isi: Minimal Kota + Provinsi
⚠️ Hasil: Area umum
✅ Action: Gunakan layer satelit
✅ Zoom: Manual sampai lokasi terlihat
✅ Klik: Posisi tepat di peta
```

---

## 🌟 TIPS PRO

1. **Gunakan Layer Satelit**
   - Aktifkan di pojok kanan atas peta
   - Lihat gedung/jalan actual
   - Lebih mudah untuk area baru

2. **Zoom Bertahap**
   - Jangan langsung zoom maksimal
   - Zoom step by step untuk orientasi
   - Cari landmark yang dikenal

3. **Cek Ulang**
   - Selalu verifikasi posisi marker
   - Koordinat GPS harus tepat
   - Radius geofence sesuaikan dengan luas area

4. **Save Koordinat Penting**
   - Screenshot peta dengan marker
   - Catat koordinat (lat, lng) di notes
   - Backup untuk referensi

---

## 📱 UNTUK MOBILE USERS

- Gunakan **2 jari** untuk zoom
- **Tap** untuk place marker
- **Long press** untuk fine positioning
- **Pinch** untuk zoom in/out

---

## ✅ CHECKLIST SEBELUM SIMPAN

- [ ] Nama kota sudah diisi dan benar
- [ ] Provinsi sudah dipilih
- [ ] Pencarian sudah dilakukan (auto atau manual)
- [ ] Posisi marker sudah dicek di peta
- [ ] Zoom cukup dekat untuk lihat detail
- [ ] Koordinat sudah sesuai dengan lokasi asli
- [ ] Radius geofence sudah disesuaikan

---

**Selamat mencoba! Sistem baru ini akan membuat pekerjaan Anda lebih mudah.** 🚀
