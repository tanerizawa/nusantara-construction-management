# Unused Components Archive

Folder ini berisi komponen-komponen yang sudah tidak digunakan lagi dalam aplikasi frontend Nusantara Group. File-file ini dipindahkan untuk membersihkan struktur kode dan meningkatkan maintainability.

## Struktur Folder

### 📁 `backup-files/`
Berisi file-file backup dan versi lama dari komponen yang masih aktif:
- `*.backup` - File backup dari pengembangan
- `*_old` - Versi lama dari komponen
- `*.complex` - Versi kompleks yang sudah disederhanakan

### 📁 `legacy-dashboards/`
Berisi dashboard dan komponen analytics yang sudah tidak digunakan:
- `AnalyticsDashboard.js` - Dashboard analytics versi lama
- `EnterpriseDashboard.js` - Dashboard enterprise yang tidak digunakan
- `EnterpriseDashboard_clean.js` - Versi clean yang tidak jadi dipakai
- `EnhancedDashboard.js` - Dashboard enhanced yang diganti
- `HRAnalyticsDashboard.js` - Dashboard HR analytics
- `DetailedBalanceSheet.js` - Laporan neraca detail versi lama
- `DetailedCashFlowStatement.js` - Laporan cash flow detail versi lama
- `DetailedIncomeStatement.js` - Laporan income statement detail versi lama

### 📁 `management-modules/`
Berisi modul manajemen yang belum diintegrasikan atau tidak digunakan:

#### Inventory & Warehouse
- `CategoryManagement.js` - Manajemen kategori produk
- `WarehouseManagement.js` - Manajemen gudang
- `StockOpname.js` - Stock opname/audit inventory
- `MaterialReservationSystem.js` - Sistem reservasi material
- `StockMovementManagement.js` - Manajemen pergerakan stok
- `ReorderAlerts.js` - Alert untuk reorder stok

#### Financial Management
- `TaxManagement.js` - Manajemen pajak
- `CostAllocation.js` - Alokasi biaya
- `MaterialCostAllocation.js` - Alokasi biaya material

#### Supplier & Procurement
- `SupplierManagement.js` - Manajemen supplier
- `SupplierPerformance.js` - Evaluasi performa supplier

#### HR & Training
- `AttendancePayroll.js` - Absensi dan payroll
- `TrainingManagement.js` - Manajemen training
- `PerformanceEvaluationManagement.js` - Evaluasi performa karyawan

#### Equipment & Safety
- `EquipmentMaintenanceManagement.js` - Manajemen maintenance equipment
- `SafetyComplianceManagement.js` - Manajemen compliance keselamatan

#### Construction Specific
- `BOQIntegrationModule.js` - Integrasi Bill of Quantity
- `CertificationAlertsManagement.js` - Manajemen alert sertifikasi
- `ClientPortal.js` - Portal klien

### 📁 `utility-components/`
Berisi komponen utility yang tidak digunakan:
- `DebugRoute.js` - Komponen debug untuk routing
- `DensityToggle.js` - Toggle untuk density tampilan
- `PageActions.js` - Actions untuk halaman (menggunakan DensityToggle)
- `UnitConversionComponent.js` - Konversi unit pengukuran

## Alasan Pemindahan

### Tidak Digunakan dalam Routing
Komponen-komponen ini tidak ditemukan dalam:
- `App.js` - Routing utama aplikasi
- File routing lainnya
- Import statements dalam komponen aktif

### Belum Diintegrasikan
Beberapa modul management merupakan fitur yang:
- Belum diintegrasikan dengan workflow utama
- Tidak ada UI untuk mengaksesnya
- Masih dalam tahap development

### Versi Lama/Backup
File backup dan versi lama yang sudah digantikan oleh versi yang lebih baru.

## Rekomendasi

### Dapat Dihapus Aman
- Semua file dalam `backup-files/`
- File dalam `legacy-dashboards/` yang sudah ada penggantinya

### Pertimbangkan untuk Fitur Masa Depan
- Modul dalam `management-modules/` bisa dikembangkan kembali jika dibutuhkan
- `utility-components/` mungkin berguna untuk fitur tertentu

### Review Berkala
Lakukan review setiap 3-6 bulan untuk:
- Memastikan file masih tidak digunakan
- Menghapus file yang sudah tidak relevan
- Mengintegrasikan kembali modul yang dibutuhkan

## Restore File

Untuk mengembalikan file yang dipindahkan:
```bash
# Contoh: mengembalikan TaxManagement
cp unused-components/management-modules/TaxManagement.js components/

# Update routing jika diperlukan
# Update import statements
```

---

**Tanggal Pemindahan:** $(date)
**Total File Dipindahkan:** $(find . -name "*.js" | wc -l) files
**Disusun oleh:** AI Assistant

*Catatan: Sebelum menghapus file secara permanen, pastikan untuk melakukan backup repository.*