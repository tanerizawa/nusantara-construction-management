# Approval Dashboard Tab Persistence with URL Hash

## Problem
Ketika user refresh halaman di tab RAB, PO, atau Tanda Terima di Approval Dashboard, tab akan kembali ke tab default (Overview/RAB) karena state `activeCategory` di-reset saat komponen re-mount.

## Solution
Menggunakan **URL Hash** (`#rab`, `#po`, `#tandaTerima`) sebagai primary storage dan **localStorage** sebagai fallback untuk menyimpan dan memulihkan tab aktif agar tetap persistent setelah refresh.

### Benefits of URL Hash:
1. ✅ **Visible in URL** - User bisa lihat tab aktif di address bar
2. ✅ **Bookmarkable** - User bisa bookmark URL dengan tab spesifik
3. ✅ **Shareable** - Link bisa dishare dengan tab yang sudah ditentukan
4. ✅ **Browser Navigation** - Back/Forward button bekerja dengan baik
5. ✅ **SEO Friendly** - Search engines bisa index specific tabs
6. ✅ **No Page Reload** - Hash changes tidak reload halaman

## Changes Made

### File: `ProfessionalApprovalDashboard.js`

#### 1. Import `useEffect`
**Sebelum:**
```javascript
import React, { useState } from 'react';
```

**Sesudah:**
```javascript
import React, { useState, useEffect } from 'react';
```

#### 2. Get Initial Category from URL Hash + localStorage
**Sebelum:**
```javascript
const [activeCategory, setActiveCategory] = useState('rab');
```

**Sesudah:**
```javascript
// Get initial tab from URL hash, then localStorage, then default to 'rab'
const getInitialCategory = () => {
  // Priority 1: URL hash (e.g., #po, #tandaTerima)
  const hash = window.location.hash.replace('#', '');
  if (hash && approvalCategories.some(cat => cat.id === hash)) {
    return hash;
  }
  
  // Priority 2: localStorage
  const saved = localStorage.getItem('approvalDashboard_activeCategory');
  if (saved && approvalCategories.some(cat => cat.id === saved)) {
    return saved;
  }
  
  // Priority 3: default
  return 'rab';
};

const [activeCategory, setActiveCategory] = useState(getInitialCategory);
```

#### 3. Sync with URL Hash and localStorage + Handle Browser Navigation
**Tambahan:**
```javascript
// Sync active category with URL hash and localStorage
useEffect(() => {
  // Update URL hash
  window.location.hash = activeCategory;
  
  // Update localStorage as backup
  localStorage.setItem('approvalDashboard_activeCategory', activeCategory);
}, [activeCategory]);

// Listen for browser back/forward navigation (hash changes)
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash && approvalCategories.some(cat => cat.id === hash) && hash !== activeCategory) {
      setActiveCategory(hash);
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  
  return () => {
    window.removeEventListener('hashchange', handleHashChange);
  };
}, [activeCategory]);
```

## How It Works

### Priority Order:
1. **URL Hash** (Highest priority)
2. **localStorage** (Fallback)
3. **Default value** ('rab')

### Flow:
1. **Initial Load:**
   - Component mount → `getInitialCategory()` dipanggil
   - Check URL hash first: `window.location.hash`
     - Example: `https://app.com/project/ABC123#tandaTerima` → Use `tandaTerima`
   - If no hash → Check localStorage
   - If no localStorage → Default to `'rab'`

2. **User Changes Tab:**
   - User klik tab RAB/PO/Tanda Terima
   - `setActiveCategory()` dipanggil
   - First `useEffect` trigger:
     - Update URL hash: `window.location.hash = activeCategory`
     - Update localStorage as backup
   - URL changes to: `https://app.com/project/ABC123#po`

3. **User Refresh:**
   - Component unmount & remount
   - `getInitialCategory()` reads URL hash
   - Tab restored to position from hash! ✅

4. **User Clicks Browser Back/Forward:**
   - Browser changes hash (e.g., from `#po` back to `#rab`)
   - `hashchange` event fires
   - Second `useEffect` catches the change
   - `setActiveCategory()` updates to match hash
   - Tab changes without page reload! ✅

5. **User Shares URL:**
   - Copy URL: `https://app.com/project/ABC123#tandaTerima`
   - Share with colleague
   - Colleague opens link → Directly to Tanda Terima tab! ✅

## Benefits

1. **Better UX**: User tidak perlu navigasi ulang setelah refresh
2. **URL Transparency**: Tab aktif visible di address bar
3. **Bookmarkable**: User bisa bookmark URL dengan tab spesifik
4. **Shareable Links**: Bisa share link langsung ke tab tertentu
5. **Browser Navigation**: Back/Forward button bekerja dengan baik
6. **No Backend Required**: Purely frontend solution
7. **Fast**: Instant retrieval from URL hash
8. **Persistent**: localStorage sebagai fallback jika hash tidak ada
9. **SEO Friendly**: Each tab has unique URL for indexing

## Testing Checklist

- [x] Klik tab RAB → URL shows `#rab` → Refresh → Tetap di RAB ✅
- [x] Klik tab PO → URL shows `#po` → Refresh → Tetap di PO ✅
- [x] Klik tab Tanda Terima → URL shows `#tandaTerima` → Refresh → Tetap di Tanda Terima ✅
- [x] Default ke RAB jika tidak ada hash atau localStorage ✅
- [x] Tab switch smooth tanpa delay ✅
- [x] Browser Back button → Tab berubah sesuai history ✅
- [x] Browser Forward button → Tab berubah sesuai history ✅
- [x] Copy URL dengan hash → Share ke orang lain → Langsung ke tab yang benar ✅
- [x] Bookmark URL dengan hash → Open bookmark → Langsung ke tab yang benar ✅

### Example URLs:
- `http://localhost:3000/project/2025PJK001#rab` → RAB tab
- `http://localhost:3000/project/2025PJK001#po` → PO tab
- `http://localhost:3000/project/2025PJK001#tandaTerima` → Tanda Terima tab

## URL Hash + localStorage Strategy

### Primary: URL Hash
**Key:** `window.location.hash`

**Possible Values:**
- `#rab` - Tab RAB
- `#po` - Tab Purchase Order
- `#tandaTerima` - Tab Tanda Terima

**Example URLs:**
```
http://localhost:3000/project/2025PJK001#rab
http://localhost:3000/project/2025PJK001#po
http://localhost:3000/project/2025PJK001#tandaTerima
```

### Fallback: localStorage
**Key:** `approvalDashboard_activeCategory`

**Possible Values:**
- `'rab'` - Tab RAB
- `'po'` - Tab Purchase Order
- `'tandaTerima'` - Tab Tanda Terima

**Example localStorage entry:**
```json
{
  "approvalDashboard_activeCategory": "tandaTerima"
}
```

### Why Both?
- **URL Hash**: Primary, visible, shareable, bookmarkable
- **localStorage**: Fallback jika user menghapus hash dari URL secara manual
- **Default**: 'rab' jika keduanya tidak ada

## Browser Compatibility

✅ **Supported:** All modern browsers
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Opera: Full support

**Note:** localStorage available in all browsers since IE8+

## Privacy & Cleanup

**When is localStorage cleared?**
- User clears browser cache/data
- User uses incognito/private mode (separate storage)
- Manual deletion via browser DevTools
- Programmatic clear (if implemented)

**Storage Quota:**
- Typical: ~5-10MB per domain
- This feature uses: ~50 bytes
- Safe: No quota concerns

## Future Enhancements (Optional)

1. **Query Parameters Instead of Hash:**
   ```javascript
   // URL: /project/ABC123?tab=tandaTerima
   const searchParams = new URLSearchParams(window.location.search);
   const tab = searchParams.get('tab');
   ```

2. **React Router Integration:**
   ```javascript
   // URL: /project/ABC123/approval/tandaTerima
   import { useParams, useNavigate } from 'react-router-dom';
   ```

3. **Deep Linking with Filters:**
   ```javascript
   // URL: #tandaTerima?status=approved&search=supplier
   window.location.hash = `${activeCategory}?status=${statusFilter}&search=${searchTerm}`;
   ```

4. **Analytics Tracking:**
   ```javascript
   useEffect(() => {
     analytics.track('Approval Tab Changed', { tab: activeCategory });
   }, [activeCategory]);
   ```

## Related Files

- `/frontend/src/components/workflow/approval/ProfessionalApprovalDashboard.js`
- `/frontend/src/pages/project-detail/ProjectDetail.js` (imports dashboard)

## Impact

**Components Affected:**
- ✅ ProfessionalApprovalDashboard (main component)
- ✅ RAB tab content
- ✅ PO tab content  
- ✅ Tanda Terima tab content

**User Impact:**
- ✅ RAB tab - persistent after refresh
- ✅ PO tab - persistent after refresh
- ✅ Tanda Terima tab - persistent after refresh
- ✅ Filters and search still work independently per tab

## Date
October 9, 2025

## Status
✅ **IMPLEMENTED AND DEPLOYED**

Frontend recompiled successfully with no errors.
