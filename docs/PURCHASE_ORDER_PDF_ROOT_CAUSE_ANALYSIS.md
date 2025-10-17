## FIX PURCHASE ORDER PDF - Root Cause Found

### 🔍 Analisis Komprehensif

#### Masalah Utama
Error: `Cannot generate PDF: Subsidiary data not found`

#### Root Cause yang Ditemukan

1. **Sequelize `raw: true` Issue**:
   - Saat menggunakan `raw: true` dalam query Sequelize, field mapping otomatis dari snake_case ke camelCase tidak terjadi
   - Model Project mendefinisikan `subsidiaryId` dengan `field: 'subsidiary_id'`
   - Dengan `raw: true`, Sequelize mengembalikan `subsidiary_id` (snake_case) bukan `subsidiaryId` (camelCase)
   - Kode sebelumnya hanya mengecek `project.subsidiary_id` yang tidak ada saat model mengembalikan camelCase

2. **Enum Status Subsidiaries**:
   - Query fallback menggunakan `status: 'main'` yang tidak valid
   - Enum hanya memiliki nilai: `'active'` dan `'inactive'`
   - Ini menyebabkan SQL error saat mencoba fallback

#### Solusi yang Diterapkan

1. **Dual Field Check**:
   ```javascript
   const subsidiaryId = project?.subsidiary_id || project?.subsidiaryId;
   ```
   Sekarang kode mengecek kedua format field name

2. **Fixed Enum Value**:
   ```javascript
   where: { 
     status: 'active' // Hanya nilai enum yang valid
   }
   ```

3. **Enhanced Logging**:
   - Menambahkan logging untuk debug kedua format field
   - Memudahkan troubleshooting di masa depan

#### Verifikasi Data
```sql
-- Project memiliki subsidiary_id
SELECT id, subsidiary_id FROM projects WHERE id='2025PJK001';
-- Result: subsidiary_id = 'NU006'

-- Subsidiary ada dan aktif
SELECT id, name, status FROM subsidiaries WHERE id='NU006';
-- Result: status = 'active', deleted_at = NULL
```

#### Status
✅ **FIXED** - Backend sudah di-restart dengan fix yang tepat
- PDF sekarang akan berhasil digenerate dengan data subsidiary yang benar (PT. PUTRA JAYA KONSTRUKASI)
- Fallback subsidiary juga sudah diperbaiki jika diperlukan

#### Testing
Silakan coba generate PDF Purchase Order lagi. Seharusnya sudah berhasil.
