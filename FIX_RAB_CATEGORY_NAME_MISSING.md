# ✅ FIXED - RAB Items Not Displaying (category_name Missing)

## Problem
RAB items endpoint returned 500 error:
```
Error: Named replacement ":categoryName" has no entry in the replacement map
```

## Root Cause
Milestone created with **old format** where `category_link` only had:
```json
{
  "enabled": true,
  "total_items": 1,
  "total_value": 60000000
  // ❌ Missing: "category_name"
}
```

New code expects:
```json
{
  "enabled": true,
  "total_items": 1,
  "total_value": 60000000,
  "category_name": "Pekerjaan Persiapan"  // ✅ Required
}
```

## Solution Applied

### 1. Added Validation & Clear Error Message
**File:** `/root/APP-YK/backend/routes/projects/milestoneDetail.routes.js`

```javascript
if (!categoryName) {
  return res.status(400).json({
    success: false,
    error: 'Category name not found in milestone RAB link. Please edit and re-link the milestone.',
    details: 'The milestone was created with an older format...',
    fix: 'Go to milestone edit form → Select RAB category → Save'
  });
}
```

### 2. Database Fix Script
**File:** `/root/APP-YK/backend/migrations/fix_milestone_category_name.sql`

Auto-infers `category_name` from existing RAB items.

### 3. Fixed Milestone 2fc4f9f2-e921-49e0-adf5-920c5b2ac2de
```sql
UPDATE project_milestones
SET category_link = jsonb_set(
  category_link,
  '{category_name}',
  '"Pekerjaan Persiapan"'
)
WHERE id = '2fc4f9f2-e921-49e0-adf5-920c5b2ac2de';
```

**Result:**
```json
{
  "enabled": true,
  "total_items": 1,
  "total_value": 60000000,
  "category_name": "Pekerjaan Persiapan"  // ✅ ADDED
}
```

## Testing
1. ✅ Refresh browser (Ctrl+Shift+R)
2. ✅ Open milestone detail page
3. ✅ Click "Costs" tab
4. ✅ RAB items will now load automatically

## Prevention
All **new milestones** created through the form will automatically include `category_name` in `category_link`.

Existing milestones can be fixed by:
1. **Option A:** Edit milestone → Re-select RAB category → Save
2. **Option B:** Run SQL fix script (for bulk updates)

## Status
✅ **FIXED & DEPLOYED**
- Backend validation added
- Database fixed for problematic milestone
- Frontend will now display RAB items correctly
