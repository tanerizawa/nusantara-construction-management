# Logo Upload - Bug Fix: 404 Error

## Problem
Error 404 saat mengakses endpoint logo:
```
/api/api/subsidiaries/NU002/logo:1  Failed to load resource: the server responded with a status of 404 (Not Found)
```

## Root Cause
URL duplikasi `/api/api` karena:
1. `API_URL` dari `utils/config.js` sudah berisi `/api`
2. Kode menambahkan `/api` lagi: `${API_URL}/api/subsidiaries/...`

## Solution

### 1. Fix Import & API Configuration
**File:** `frontend/src/pages/subsidiary-edit/components/forms/BasicInfoForm.js`

**Before:**
```javascript
import axios from 'axios';

const BasicInfoForm = ({ ... }) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  
  // ...
  
  const response = await axios.post(
    `${API_URL}/api/subsidiaries/${formData.id}/logo`, // ❌ Double /api
    uploadFormData,
    { ... }
  );
}
```

**After:**
```javascript
import axios from 'axios';
import { API_URL } from '../../../../utils/config';

const BasicInfoForm = ({ ... }) => {
  // Removed local API_URL declaration - use centralized config
  
  // ...
  
  const response = await axios.post(
    `${API_URL}/subsidiaries/${formData.id}/logo`, // ✅ Correct path
    uploadFormData,
    { ... }
  );
}
```

### 2. Fix Upload Endpoint
**Before:**
```javascript
`${API_URL}/api/subsidiaries/${formData.id}/logo`
```

**After:**
```javascript
`${API_URL}/subsidiaries/${formData.id}/logo`
```

### 3. Fix Delete Endpoint
**Before:**
```javascript
`${API_URL}/api/subsidiaries/${formData.id}/logo`
```

**After:**
```javascript
`${API_URL}/subsidiaries/${formData.id}/logo`
```

### 4. Fix Static File URL (Logo Display)
**File:** `frontend/src/pages/subsidiary-edit/components/forms/BasicInfoForm.js`

**Before:**
```javascript
src={`${API_URL}/uploads/${formData.logo}`}
```

**After:**
```javascript
src={`${window.location.origin}/uploads/${formData.logo}`}
```

**Reason:** Static files are served from root path `/uploads`, not from API path `/api/uploads`

### 5. Fix Detail Page Logo Display
**File:** `frontend/src/pages/Subsidiaries/Detail/SubsidiaryDetail.js`

**Before:**
```javascript
src={`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${subsidiary.logo}`}
```

**After:**
```javascript
src={`${window.location.origin}/uploads/${subsidiary.logo}`}
```

## URL Structure Explanation

### API Endpoints (with /api prefix)
```
POST   /api/subsidiaries/:id/logo      ← API_URL already includes /api
DELETE /api/subsidiaries/:id/logo      ← API_URL already includes /api
GET    /api/subsidiaries/:id           ← API_URL already includes /api
```

### Static Files (no /api prefix)
```
GET    /uploads/subsidiaries/logos/1-123456.png    ← Direct file access
```

### Why API_URL includes /api

From `frontend/src/utils/config.js`:
```javascript
const getApiUrl = () => {
  // Environment Variable
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL; // Usually 'http://localhost:5000/api'
  }

  // Production hostname
  if (hostname === 'nusantaragroup.co') {
    return '/api'; // Proxied through Apache
  }

  // Development - use setupProxy
  return '/api'; // Proxied through React dev server
};
```

So `API_URL` = `/api` or `http://localhost:5000/api`

## Testing

### Test Upload Endpoint
```javascript
// URL should be: /api/subsidiaries/NU002/logo
// NOT: /api/api/subsidiaries/NU002/logo

console.log('Upload URL:', `${API_URL}/subsidiaries/${id}/logo`);
// Expected: /api/subsidiaries/NU002/logo
```

### Test Logo Display
```javascript
// URL should be: http://localhost:3000/uploads/subsidiaries/logos/NU002-123456.png
// NOT: /api/uploads/...

console.log('Image URL:', `${window.location.origin}/uploads/${logo}`);
// Expected: http://localhost:3000/uploads/subsidiaries/logos/NU002-123456.png
```

## Files Modified

1. ✅ `frontend/src/pages/subsidiary-edit/components/forms/BasicInfoForm.js`
   - Import API_URL from centralized config
   - Remove duplicate `/api` in upload endpoint
   - Remove duplicate `/api` in delete endpoint
   - Use `window.location.origin` for static file URLs

2. ✅ `frontend/src/pages/Subsidiaries/Detail/SubsidiaryDetail.js`
   - Use `window.location.origin` for logo image URLs

## Result

✅ Upload endpoint: `/api/subsidiaries/:id/logo` (correct)
✅ Delete endpoint: `/api/subsidiaries/:id/logo` (correct)
✅ Logo display URL: `/uploads/subsidiaries/logos/...` (correct)
✅ No more 404 errors
✅ Frontend compiled successfully

## Key Takeaways

1. **Always use centralized config:** Import `API_URL` from `utils/config.js`
2. **Don't duplicate /api:** API_URL already includes it
3. **Static files ≠ API endpoints:** Use `window.location.origin` for `/uploads`
4. **Check URL structure:** Log URLs during development to catch duplications

## Related Documentation

- `LOGO_UPLOAD_FEATURE_COMPLETE.md` - Full implementation details
- `frontend/src/utils/config.js` - Centralized API configuration
- `frontend/src/setupProxy.js` - Development proxy configuration

---

**Fixed:** October 15, 2025
**Status:** ✅ RESOLVED
