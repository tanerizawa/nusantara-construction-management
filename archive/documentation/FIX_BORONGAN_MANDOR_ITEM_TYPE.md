# Fix Data - Borongan Mandor Item Type

## 🔍 Problem Identified

Item "Borongan Mandor" tersimpan dengan `item_type = 'material'` padahal seharusnya `'labor'` atau `'service'`, sehingga muncul di **Purchase Orders** tab padahal seharusnya di **Work Orders** tab.

## 📊 Root Cause Analysis

### Previous System (FLAWED)
1. Auto-detection menggunakan keyword matching
2. Kata "Borongan" tidak tercakup dalam logic awal
3. Kata "Mandor" tidak terdeteksi sebagai labor
4. Default fallback = 'material' jika tidak match

### Impact
- Item masuk kategori salah (PO instead of WO)
- User confusion
- Workflow tidak tepat

## ✅ Solution Implemented

### 1. System Refactor
- ❌ Removed complex auto-detection (100+ lines)
- ✅ Implemented simple validation (10 lines)
- ✅ Made itemType **required field**
- ✅ User selects type explicitly

### 2. Backend Changes (rab.routes.js)

**Before:**
```javascript
// Auto-detect with fallback
let finalItemType = itemType;
if (!finalItemType) {
  // 70+ lines of keyword matching...
  finalItemType = 'material'; // Default
}
```

**After:**
```javascript
// Required field validation
const validItemTypes = ['material', 'service', 'labor', 'equipment', 'overhead'];
if (!itemType) {
  return res.status(400).json({
    error: 'itemType is required'
  });
}
if (!validItemTypes.includes(itemType)) {
  return res.status(400).json({
    error: `Invalid itemType: ${itemType}`
  });
}
// Direct save
itemType: itemType
```

### 3. Data Integrity

**Check Existing Data:**
```sql
SELECT id, description, category, item_type, created_at 
FROM project_rab 
WHERE description ILIKE '%borongan%' OR description ILIKE '%mandor%';
```

**Result:**
```
id: b1085e7c-384f-4aa5-bd22-209ab265cc6f
description: Borongan Mandor
category: Pekerjaan Persiapan
item_type: material  ❌ WRONG!
created_at: 2025-10-15 23:38:02
```

**Fix Command:**
```sql
UPDATE project_rab 
SET item_type = 'labor' 
WHERE id = 'b1085e7c-384f-4aa5-bd22-209ab265cc6f';
```

**Verification:**
```sql
SELECT id, description, item_type 
FROM project_rab 
WHERE id = 'b1085e7c-384f-4aa5-bd22-209ab265cc6f';
```

**Expected Result:**
```
id: b1085e7c-384f-4aa5-bd22-209ab265cc6f
description: Borongan Mandor
item_type: labor  ✅ CORRECTED!
```

## 🚀 Execution Plan

### Step 1: Backup Data (Safety First)
```bash
docker-compose exec postgres pg_dump -U admin -d nusantara_construction \
  --table=project_rab \
  --file=/tmp/project_rab_backup_$(date +%Y%m%d_%H%M%S).sql
```

### Step 2: Identify All Wrong Items
```sql
-- Find all items that might be wrongly categorized
SELECT id, description, category, item_type, created_at 
FROM project_rab 
WHERE (
  -- Labor keywords in material category
  (item_type = 'material' AND (
    description ILIKE '%borongan%' OR
    description ILIKE '%mandor%' OR
    description ILIKE '%upah%' OR
    description ILIKE '%tenaga%' OR
    description ILIKE '%tukang%' OR
    description ILIKE '%kuli%'
  ))
  OR
  -- Service keywords in material category
  (item_type = 'material' AND (
    description ILIKE '%jasa%' OR
    description ILIKE '%instalasi%' OR
    category ILIKE '%jasa%'
  ))
  OR
  -- Equipment keywords in material category
  (item_type = 'material' AND (
    description ILIKE '%sewa%' OR
    description ILIKE '%alat%' OR
    description ILIKE '%rental%'
  ))
)
ORDER BY created_at DESC;
```

### Step 3: Fix Items by Category

**Fix Labor Items:**
```sql
UPDATE project_rab 
SET item_type = 'labor' 
WHERE item_type = 'material' 
AND (
  description ILIKE '%borongan mandor%' OR
  description ILIKE '%upah%' OR
  description ILIKE '%tenaga%' OR
  description ILIKE '%tukang%' OR
  description ILIKE '%kuli%'
);
```

**Fix Service Items:**
```sql
UPDATE project_rab 
SET item_type = 'service' 
WHERE item_type = 'material' 
AND (
  description ILIKE '%jasa%' OR
  description ILIKE '%instalasi%' OR
  category ILIKE '%jasa%'
);
```

**Fix Equipment Items:**
```sql
UPDATE project_rab 
SET item_type = 'equipment' 
WHERE item_type = 'material' 
AND (
  description ILIKE '%sewa%' OR
  description ILIKE '%rental%'
);
```

### Step 4: Verify Changes
```sql
-- Count by type
SELECT item_type, COUNT(*) as count 
FROM project_rab 
GROUP BY item_type 
ORDER BY count DESC;

-- Show recently updated
SELECT id, description, category, item_type 
FROM project_rab 
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC;
```

### Step 5: Test in Application
1. Refresh browser (Ctrl + Shift + R)
2. Go to Purchase Orders tab
3. Go to Work Orders tab
4. Verify "Borongan Mandor" now appears in Work Orders
5. Verify material items still in Purchase Orders

## 📋 Manual Review Needed

Some items may need manual review:
```sql
-- Items with ambiguous descriptions
SELECT id, description, category, item_type 
FROM project_rab 
WHERE description NOT ILIKE '%material%'
  AND description NOT ILIKE '%bahan%'
  AND description NOT ILIKE '%upah%'
  AND description NOT ILIKE '%jasa%'
  AND description NOT ILIKE '%sewa%'
  AND item_type = 'material'
ORDER BY description;
```

User should review these items and manually set correct type via edit form.

## 🔒 Prevent Future Issues

### 1. Frontend Validation
```javascript
// In useRABForm.js - already implemented
itemType: editingItem?.itemType || 'material'  // Default
```

### 2. Backend Validation
```javascript
// In rab.routes.js - already implemented
if (!itemType) {
  return res.status(400).json({
    error: 'itemType is required'
  });
}
```

### 3. User Training
- Inform users that item type selection is **mandatory**
- Provide clear guidelines:
  - **Material**: Bahan yang dibeli (semen, besi, pasir, dll)
  - **Labor**: Upah tenaga kerja (tukang, mandor, pekerja)
  - **Service**: Jasa/borongan (instalasi, pengawasan, dll)
  - **Equipment**: Sewa alat (excavator, mixer, scaffolding)
  - **Overhead**: Biaya operasional (listrik, transport, dll)

## 📈 Success Criteria

✅ All "Borongan" items in Work Orders
✅ All "Mandor" items in Work Orders
✅ All "Upah" items in Work Orders
✅ All "Jasa" items in Work Orders
✅ Material items only in Purchase Orders
✅ No auto-detection errors
✅ User has full control over item type

## 🔧 Maintenance Commands

### Quick Check
```bash
docker-compose exec -T postgres psql -U admin -d nusantara_construction \
  -c "SELECT item_type, COUNT(*) FROM project_rab GROUP BY item_type;"
```

### Find Specific Item
```bash
docker-compose exec -T postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, description, item_type FROM project_rab WHERE description ILIKE '%borongan%';"
```

### Update Specific Item
```bash
docker-compose exec -T postgres psql -U admin -d nusantara_construction \
  -c "UPDATE project_rab SET item_type = 'labor' WHERE id = 'YOUR_ID_HERE';"
```

## 📝 Next Actions

1. **Execute SQL fixes** - Update wrong item_type values
2. **Restart frontend** - Refresh cached data
3. **Test workflow** - Create new items and verify correct categorization
4. **Monitor logs** - Check backend logs for validation errors
5. **User feedback** - Collect feedback on new system

---

**Status**: Ready to Execute
**Risk Level**: Low (data backup recommended)
**Estimated Time**: 5 minutes
**Rollback Plan**: Restore from backup if needed
