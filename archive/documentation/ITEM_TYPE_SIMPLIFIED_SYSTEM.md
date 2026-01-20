# Item Type - Simplified & Robust System

## 📋 Overview
Sistem item type telah disederhanakan menjadi **user-driven** dan **database as single source of truth**. Auto-detection logic yang kompleks telah dihapus untuk menciptakan sistem yang lebih predictable dan maintainable.

## 🎯 Design Principles

### 1. User Control (Frontend)
- User **WAJIB** memilih item type saat membuat RAB item
- Item type selector tersedia di form dengan pilihan:
  - `material` - Material/Bahan
  - `service` - Jasa/Borongan
  - `labor` - Tenaga Kerja/Upah
  - `equipment` - Peralatan/Sewa Alat
  - `overhead` - Overhead/Biaya Umum

### 2. Backend Validation (Simple & Strict)
- Backend **TIDAK** melakukan auto-detection
- Backend hanya:
  1. Menerima `itemType` dari request
  2. Validasi bahwa `itemType` tidak null/undefined
  3. Validasi bahwa `itemType` ada dalam daftar valid
  4. Simpan langsung ke database

### 3. Database as Single Source of Truth
- Field `item_type` di tabel `project_rab` adalah kebenaran tunggal
- Frontend dan backend selalu mengacu ke database
- Tidak ada "smart logic" yang override pilihan user

## 🔧 Implementation

### Frontend (useRABForm.js)
```javascript
const itemData = {
  category: formData.category,
  description: formData.description,
  unit: formData.unit,
  quantity: parseFloat(formData.quantity),
  unitPrice: parseFloat(formData.unitPrice),
  totalPrice: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
  notes: formData.specifications || '',
  itemType: formData.itemType,  // ✅ Direct from user selection
  workflow: workflow,
  paymentMethod: paymentMethod,
  supplier: formData.itemType === 'material' ? formData.supplier : null,
  laborCategory: formData.itemType === 'labor' ? formData.laborCategory : null,
  serviceScope: formData.itemType === 'service' ? formData.serviceScope : null
};
```

### Backend (rab.routes.js)
```javascript
// ✅ SIMPLIFIED: Validate itemType (required field)
const validItemTypes = ['material', 'service', 'labor', 'equipment', 'overhead'];
if (!itemType) {
  return res.status(400).json({
    success: false,
    error: 'itemType is required. Must be one of: material, service, labor, equipment, overhead'
  });
}

if (!validItemTypes.includes(itemType)) {
  return res.status(400).json({
    success: false,
    error: `Invalid itemType: ${itemType}. Must be one of: ${validItemTypes.join(', ')}`
  });
}

console.log(`[RAB Create] Creating item with type: ${itemType}, description: "${description}"`);

const rabItem = await ProjectRAB.create({
  projectId: id,
  category,
  itemType: itemType, // ✅ Direct from user input
  description,
  unit,
  quantity: qty,
  unitPrice: price,
  totalPrice: qty * price,
  status,
  notes,
  createdBy
});
```

## ✅ Benefits

### 1. Predictability
- User tahu persis apa yang akan tersimpan
- Tidak ada "magic" behavior yang mengubah pilihan user
- What you select is what you get (WYSIWYG)

### 2. Maintainability
- Code lebih sederhana dan mudah dibaca
- Tidak ada complex keyword matching logic
- Debugging lebih mudah dengan clear logging

### 3. Consistency
- Database adalah sumber kebenaran tunggal
- Frontend dan backend tidak konflik
- Tidak ada edge cases dari auto-detection

### 4. User Experience
- User memiliki kontrol penuh
- Kesalahan kategorisasi = kesalahan user, bukan bug sistem
- User dapat memperbaiki dengan edit item

## 🔍 Validation Flow

```
Frontend Form
    ↓
User selects itemType (required field)
    ↓
Form validation checks itemType exists
    ↓
API POST /api/projects/:id/rab
    ↓
Backend receives itemType
    ↓
Backend validates:
  - itemType is not null/undefined ✓
  - itemType is in validItemTypes array ✓
    ↓
Backend saves to database
    ↓
Database stores item_type (single source of truth)
    ↓
Frontend reads from database
    ↓
Purchase Orders: filter where item_type = 'material'
Work Orders: filter where item_type IN ('service', 'labor', 'equipment')
```

## 📊 Data Flow

### Creating RAB Item
1. **User Action**: Pilih "Jasa" dari dropdown → `itemType = 'service'`
2. **Frontend**: `addRABItem({ ...data, itemType: 'service' })`
3. **Backend**: Validate `'service'` in validItemTypes ✓
4. **Database**: INSERT `item_type = 'service'`
5. **Result**: Item masuk ke **Work Orders** tab

### Reading RAB Items
1. **Database Query**: `SELECT * FROM project_rab`
2. **Filter for PO**: `WHERE item_type = 'material'`
3. **Filter for WO**: `WHERE item_type IN ('service', 'labor', 'equipment')`
4. **Frontend Display**: Tampilkan sesuai tab yang aktif

## 🚨 Error Handling

### Missing itemType
```javascript
// Request: { description: "Borongan Mandor", ... } (no itemType)
// Response:
{
  success: false,
  error: 'itemType is required. Must be one of: material, service, labor, equipment, overhead'
}
```

### Invalid itemType
```javascript
// Request: { itemType: "invalid_type", ... }
// Response:
{
  success: false,
  error: 'Invalid itemType: invalid_type. Must be one of: material, service, labor, equipment, overhead'
}
```

## 🛠️ Migration from Auto-Detection

### Old System (REMOVED ❌)
```javascript
// Complex keyword matching
if (descLower.includes('jasa') || descLower.includes('borongan') || ...) {
  finalItemType = 'service';
} else if (descLower.includes('upah') || descLower.includes('mandor') || ...) {
  finalItemType = 'labor';
}
// ... 50+ lines of detection logic
```

### New System (CURRENT ✅)
```javascript
// Simple validation
const validItemTypes = ['material', 'service', 'labor', 'equipment', 'overhead'];
if (!itemType || !validItemTypes.includes(itemType)) {
  return error;
}
// Direct assignment
itemType: itemType
```

## 📝 Fixing Existing Data

Jika ada data lama dengan item_type salah:

```sql
-- Check current data
SELECT id, description, category, item_type 
FROM project_rab 
WHERE description ILIKE '%borongan%' OR description ILIKE '%mandor%';

-- Fix specific item
UPDATE project_rab 
SET item_type = 'labor' 
WHERE id = 'b1085e7c-384f-4aa5-bd22-209ab265cc6f';

-- Verify
SELECT id, description, item_type 
FROM project_rab 
WHERE id = 'b1085e7c-384f-4aa5-bd22-209ab265cc6f';
```

## 🔐 Validation Rules

### Required Fields
- `category` ✓
- `description` ✓
- `unit` ✓
- `quantity` ✓
- `unitPrice` ✓
- **`itemType`** ✓ (NEW - now required)

### Valid Item Types
```javascript
const validItemTypes = [
  'material',   // Purchase Orders
  'service',    // Work Orders
  'labor',      // Work Orders
  'equipment',  // Work Orders
  'overhead'    // Work Orders (future use)
];
```

## 📚 Usage Examples

### Example 1: Creating Material (PO)
```javascript
{
  "category": "Bahan Bangunan",
  "description": "Semen Portland 50kg",
  "unit": "Sak",
  "quantity": 100,
  "unitPrice": 85000,
  "itemType": "material",  // ✅ Goes to Purchase Orders
  "supplier": "Toko Bangunan Jaya"
}
```

### Example 2: Creating Service (WO)
```javascript
{
  "category": "Pekerjaan Persiapan",
  "description": "Borongan Mandor",
  "unit": "Hari",
  "quantity": 30,
  "unitPrice": 150000,
  "itemType": "service",  // ✅ Goes to Work Orders
  "serviceScope": "Pengawasan pekerjaan tanah"
}
```

### Example 3: Creating Labor (WO)
```javascript
{
  "category": "Tenaga Kerja",
  "description": "Upah Tukang Batu",
  "unit": "Hari",
  "quantity": 60,
  "unitPrice": 120000,
  "itemType": "labor",  // ✅ Goes to Work Orders
  "laborCategory": "Tukang terampil"
}
```

## 🎓 Key Takeaways

1. **Simple is Better**: Removed 100+ lines of complex auto-detection logic
2. **User is King**: User menentukan type, bukan sistem
3. **Database is Truth**: Satu sumber kebenaran, tidak ada konflik
4. **Explicit is Better than Implicit**: Validasi eksplisit lebih baik dari deteksi implisit
5. **Fail Fast**: Error langsung di validasi, tidak silent failure

## 🔄 Status

- ✅ Backend simplified (rab.routes.js)
- ✅ Validation logic implemented
- ✅ Frontend already sending itemType correctly
- ✅ Database schema supports item_type ENUM
- ✅ Logging added for debugging
- ⏳ Need to fix existing wrong data (manual SQL or migration script)

## 🚀 Next Steps

1. **Test new RAB creation** - Verify itemType is required
2. **Fix existing data** - Update "Borongan Mandor" and similar items
3. **User training** - Inform users bahwa item type selection is mandatory
4. **Monitor logs** - Check backend logs untuk ensure proper validation

---

**Last Updated**: October 15, 2025
**Status**: ✅ Implemented & Active
**Complexity**: Simple & Maintainable
