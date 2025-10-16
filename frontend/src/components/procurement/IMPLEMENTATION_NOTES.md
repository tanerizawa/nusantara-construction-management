# Implementasi Pemisahan Purchase Order dan Work Order

## Ringkasan Perubahan

Dokumen ini menjelaskan perubahan yang telah diimplementasikan untuk memisahkan antara Purchase Order (untuk material) dan Work Order (untuk jasa, tenaga kerja, dan peralatan).

## Komponen yang Diperbarui

1. **PurchaseOrderApp.js**
   - Diperbarui untuk mendukung dua jenis dokumen: 'po' dan 'wo'
   - Ditambahkan tombol pembuatan untuk kedua jenis dokumen
   - Diperbarui navigasi untuk mendukung alur kerja baru

2. **PurchaseOrderManagement.js**
   - Diperbarui untuk mendukung pembuatan kedua jenis dokumen
   - Ditambahkan tombol untuk membuat Work Order

3. **ProjectSelectionDialog.js**
   - Diperbarui untuk menampilkan judul yang sesuai dengan jenis dokumen yang dipilih

4. **CreatePurchaseOrder.js**
   - Ditambahkan parameter documentType untuk mengetahui jenis dokumen yang dibuat

## Komponen Baru

1. **RABItemsSelectionContainer.js**
   - Container untuk RABSelectionViewEnhanced
   - Mengelola pemilihan item RAB berdasarkan jenis dokumen

2. **CreateWorkOrder.js**
   - Placeholder untuk pembuatan Work Order
   - Saat ini mengarah ke WorkOrdersNotImplemented.js

3. **RABSelectionViewEnhanced.js** (sudah ada)
   - Digunakan untuk memfilter item RAB berdasarkan jenis (material, jasa, dll)
   - Menampilkan item yang sesuai berdasarkan mode dokumen ('po' atau 'wo')

4. **WorkOrdersNotImplemented.js** (sudah ada)
   - Halaman placeholder untuk fitur Work Order yang akan datang

5. **workOrderTypes.js** (sudah ada)
   - Konfigurasi dan utilitas untuk pengelompokan jenis Work Order

## Alur Kerja Baru

1. User memilih jenis dokumen (PO atau WO) di halaman utama
2. User memilih proyek dari dialog
3. User diarahkan ke halaman pemilihan item RAB yang difilter berdasarkan jenis dokumen
   - PO: hanya menampilkan item material
   - WO: hanya menampilkan item jasa, tenaga kerja, dan peralatan
4. User memilih item dan melanjutkan ke formulir pembuatan dokumen
5. User mengisi detail dokumen dan menyimpannya

## Fitur yang Belum Diimplementasikan

1. Implementasi lengkap formulir Work Order
2. Manajemen Work Order
3. Persetujuan dan alur kerja Work Order
4. Tracking dan pelaporan Work Order

## Pengujian

1. Pastikan dapat membuat Purchase Order dengan hanya memilih item material
2. Pastikan dapat melihat halaman placeholder untuk Work Order
3. Pastikan alur navigasi berjalan dengan benar