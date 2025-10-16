# Implementasi Pemisahan Material dan Non-Material

## Permasalahan

Implementasi sebelumnya belum berhasil memisahkan item material untuk Purchase Order dan item non-material (jasa, tenaga kerja, peralatan) untuk Work Order dengan baik. Hal ini terlihat dari tampilan pemilihan item yang masih menampilkan kedua jenis item dalam satu tabel.

## Solusi yang Diimplementasikan

1. **Deteksi Tipe Item yang Lebih Canggih**
   - Menambahkan fungsi `detectItemType` di `workOrderTypes.js` yang dapat menentukan jenis item berdasarkan nama, kategori, dan properti lainnya
   - Menggunakan keyword detection untuk mengidentifikasi jenis item

2. **Tampilan Tab Terpisah**
   - Membuat komponen baru `RABSelectionViewTabs.js` yang memisahkan tampilan material dan non-material
   - Menambahkan tab untuk memudahkan pengguna melihat dan memilih jenis item yang berbeda

3. **UI yang Lebih Informatif**
   - Menambahkan pemilihan tipe dokumen (PO/WO) di breadcrumb
   - Menampilkan statistik yang lebih detail tentang jumlah item per kategori

4. **Pemisahan Data**
   - Memisahkan data menjadi kategori Material, Jasa, Tenaga Kerja, dan Peralatan
   - Memfilter tampilan berdasarkan jenis dokumen yang sedang dibuat

## Detail Implementasi

### 1. Deteksi Tipe Item

```javascript
export const detectItemType = (item) => {
  // If itemType is explicitly set, use it
  if (item.itemType) return item.itemType;
  
  // Check kategori/category field for clues
  const category = (item.kategori || item.category || '').toLowerCase();
  
  // Check for keywords
  const serviceKeywords = ['jasa', 'service', 'pekerjaan', 'persiapan', 'instalasi', 'pasang'];
  const laborKeywords = ['tenaga', 'labor', 'pekerja', 'tukang'];
  const equipmentKeywords = ['alat', 'equipment', 'sewa'];
  const materialKeywords = ['material', 'bahan', 'besi', 'kayu', 'beton', 'cat'];
  
  // ... additional detection logic ...
  
  // Default fallback - assume material
  return 'material';
};
```

### 2. Tampilan Tab

- Jika pengguna memilih mode Work Order, tampilan menunjukkan tab:
  - Jasa
  - Tenaga Kerja
  - Peralatan

- Jika pengguna memilih mode Purchase Order, tampilan menunjukkan tab:
  - Material

### 3. Integrasi dengan Alur Kerja Existing

- Tetap menggunakan alur kerja yang sama seperti implementasi sebelumnya
- Menambahkan pemilihan tipe dokumen yang lebih jelas
- Mengintegrasikan deteksi tipe item yang lebih canggih ke seluruh alur kerja

## Cara Kerja

1. Pengguna memilih untuk membuat Purchase Order atau Work Order
2. Sistem menampilkan dialog pemilihan proyek
3. Setelah memilih proyek, sistem menampilkan halaman pemilihan item dengan filter sesuai jenis dokumen:
   - Mode PO: Hanya menampilkan material
   - Mode WO: Menampilkan tab Jasa, Tenaga Kerja, dan Peralatan
4. Pengguna memilih item dan melanjutkan ke formulir pembuatan dokumen
5. Pengguna mengisi detail dokumen dan menyimpannya

## Keunggulan Implementasi Baru

1. **Deteksi Otomatis**: Tetap berfungsi meskipun data tidak memiliki properti `itemType` yang eksplisit
2. **UI yang Lebih Baik**: Pemisahan tab dan statistik yang lebih detail
3. **Fleksibilitas**: Pengguna dapat beralih antara mode PO dan WO untuk melihat item yang sesuai
4. **Robustness**: Menangani berbagai format data dan inconsistencies

## Pengujian

1. Pastikan material ditampilkan saat mode Purchase Order
2. Pastikan jasa, tenaga kerja, dan peralatan ditampilkan saat mode Work Order
3. Pastikan deteksi tipe item berfungsi dengan baik
4. Pastikan statistik dan tab berfungsi dengan benar