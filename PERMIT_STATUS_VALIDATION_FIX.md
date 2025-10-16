# Permit Status Validation Fix

**Date:** October 15, 2025  
**Status:** ✅ FIXED  
**Issue:** Backend validation error for permit status

---

## 🐛 Problem

### Error Message
```
Error: Validation Error: 
permits.0.status: "permits[0].status" must be one of [active, expired, pending]
permits.1.status: "permits[1].status" must be one of [active, expired, pending]
```

### Root Cause Analysis

**Mismatch between Database, Frontend, and Backend validation:**

| Component | Expected Value | Actual Value | Status |
|-----------|---------------|--------------|--------|
| **Database** | `valid` | `valid` | ✅ Correct |
| **Frontend Form** | `valid` | `valid` | ✅ Correct |
| **Backend Validation** | `active` | ❌ | ❌ Wrong |
| **Frontend Detail View** | `valid` | `valid` | ✅ Correct |

**Database Content:**
```sql
SELECT id, jsonb_array_elements(permits)->>'status' as permit_status 
FROM subsidiaries WHERE id IN ('NU001', 'NU002', 'NU003');

  id   | permit_status 
-------+---------------
 NU003 | valid
 NU001 | valid
 NU001 | valid
 NU001 | valid
 NU002 | valid
 NU002 | valid
```

All permits in database use `"valid"` status, but backend Joi validation was checking for `"active"`.

---

## ✅ Solution

### Changed Backend Validation

**File:** `backend/routes/subsidiaries/basic.routes.js`

#### Schema for CREATE (Line 74)
**Before:**
```javascript
status: Joi.string().valid('active', 'expired', 'pending').default('active').optional()
```

**After:**
```javascript
status: Joi.string().valid('valid', 'expired', 'pending').default('valid').optional()
```

#### Schema for UPDATE (Line 165)
**Before:**
```javascript
status: Joi.string().valid('active', 'expired', 'pending').optional()
```

**After:**
```javascript
status: Joi.string().valid('valid', 'expired', 'pending').optional()
```

---

## 📊 Valid Permit Status Values

Now all components use consistent status values:

### Status Options
1. **`valid`** - Permit is currently valid/active
2. **`expired`** - Permit has expired
3. **`pending`** - Permit is pending approval/processing

### Status Badge Colors (Frontend)
```javascript
const styles = {
  valid: 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30',    // Green
  expired: 'bg-[#FF453A]/20 text-[#FF453A] border-[#FF453A]/30',  // Red
  pending: 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30'   // Orange
};

const labels = {
  valid: 'Berlaku',
  expired: 'Kadaluarsa',
  pending: 'Pending'
};
```

---

## 🔧 Technical Details

### Joi Validation Changes

**Location 1 - Create Schema (subsidiarySchema)**
- **Line:** 74
- **Field:** `permits.status`
- **Change:** `'active'` → `'valid'`
- **Default:** `'valid'`

**Location 2 - Update Schema (updateSubsidiarySchema)**
- **Line:** 165
- **Field:** `permits.status`
- **Change:** `'active'` → `'valid'`
- **No default** (optional for updates)

### Why This Happened

The inconsistency likely occurred because:
1. Database was populated with `"valid"` status (semantically correct for permits)
2. Backend validation was copied from another model using `"active"` (like subsidiary status)
3. Frontend correctly used `"valid"` to match database
4. Validation schema wasn't updated to match database reality

### Semantic Difference

- **`active`** - Better for entity status (user active/inactive, subsidiary active/inactive)
- **`valid`** - Better for permit/license status (permit valid/expired)

---

## 🧪 Testing

### Before Fix
```bash
# Try to save subsidiary with permits
PUT /api/subsidiaries/NU001

# Response: 400 Bad Request
Error: permits.0.status must be one of [active, expired, pending]
```

### After Fix
```bash
# Try to save subsidiary with permits
PUT /api/subsidiaries/NU001

# Response: 200 OK
{ success: true, data: {...} }
```

### Test Cases
- [x] Save permit with status `"valid"` - ✅ Works
- [x] Save permit with status `"expired"` - ✅ Works
- [x] Save permit with status `"pending"` - ✅ Works
- [x] Save permit with status `"active"` - ❌ Validation error (correct)
- [x] Default status when not provided - ✅ Uses `"valid"`

---

## 📝 Related Files

### Modified
- `backend/routes/subsidiaries/basic.routes.js` (2 locations)

### Already Correct (No Changes Needed)
- `frontend/src/pages/subsidiary-edit/components/forms/LegalInfoForm.js`
  - Dropdown options already use `valid`
- `frontend/src/pages/Subsidiaries/Detail/components/tabs/LegalInfoView.js`
  - Badge mapping already handles `valid`
- Database permits data
  - All existing permits use `valid`

---

## ✅ Verification Steps

1. **Check backend validation:**
   ```bash
   grep -n "status.*valid.*expired.*pending" backend/routes/subsidiaries/basic.routes.js
   
   # Should show:
   # 74:    status: Joi.string().valid('valid', 'expired', 'pending')...
   # 165:   status: Joi.string().valid('valid', 'expired', 'pending')...
   ```

2. **Test API:**
   ```bash
   curl -X PUT http://localhost:5000/api/subsidiaries/NU001 \
     -H "Content-Type: application/json" \
     -d '{
       "permits": [{
         "name": "Test Permit",
         "status": "valid"
       }]
     }'
   
   # Should return 200 OK
   ```

3. **Test in browser:**
   - Navigate to `/subsidiaries/NU001/edit`
   - Go to "Informasi Legal" tab
   - Add or edit a permit
   - Select status from dropdown
   - Click "Simpan Perubahan"
   - Should save successfully ✅

---

## 🎯 Impact

### Before
- ❌ Cannot save subsidiaries with permits
- ❌ Edit page throwing validation errors
- ❌ User frustrated by 400 errors

### After
- ✅ Save subsidiaries with permits successfully
- ✅ All permit statuses validated correctly
- ✅ Consistent naming across stack
- ✅ Better semantic meaning (`valid` vs `active`)

---

## 📚 Lessons Learned

### Best Practices
1. **Consistent terminology** across database, backend, and frontend
2. **Match validation** to actual database content
3. **Semantic naming** - use `valid` for permits, `active` for entities
4. **Test validation** when changing schemas
5. **Document status values** in API docs

### Prevention
1. Use constants for status values:
   ```javascript
   // constants/permitStatus.js
   export const PERMIT_STATUS = {
     VALID: 'valid',
     EXPIRED: 'expired',
     PENDING: 'pending'
   };
   ```

2. Share constants between frontend and backend
3. Add validation tests for all status fields
4. Document valid values in schema comments

---

## ✅ Status: RESOLVED

**Problem:** Backend validation rejecting `"valid"` status for permits  
**Solution:** Changed validation from `['active', ...]` to `['valid', ...]`  
**Result:** All components now use consistent `valid/expired/pending` values  
**Impact:** Subsidiary edit forms now save successfully ✅

Backend restarted and validation is now working correctly! 🎉
