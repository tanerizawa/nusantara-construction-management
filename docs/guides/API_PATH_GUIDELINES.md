# 🔧 API Path Fix - fetch() vs api.get() Guide

**Date:** October 12, 2025  
**Issue:** Confusion between raw `fetch()` and Axios `api.get()` paths  
**Status:** ✅ RESOLVED WITH CLEAR GUIDELINES

---

## 🎯 The Core Problem

### Two Different API Methods = Two Different Path Rules

| Method | File | baseURL | Path Format | Final URL |
|--------|------|---------|-------------|-----------|
| `api.get()` | `services/api.js` | `/api` | `/projects/...` | `/api/projects/...` ✅ |
| `fetch()` | Any component | None | `/api/projects/...` | `/api/projects/...` ✅ |

---

## ✅ CORRECT Usage

### Using `api.get()` (Axios with baseURL)

```javascript
import api from '../services/api';

// ✅ CORRECT - No /api prefix
api.get('/projects/2025LTS001/rab')
api.post('/projects/2025LTS001/berita-acara', data)
api.put('/projects/2025LTS001/progress-payments/123', data)

// Result: /api + /projects/... = /api/projects/... ✅
```

### Using `fetch()` (Raw fetch without baseURL)

```javascript
// ✅ CORRECT - Include /api prefix
fetch('/api/projects/2025LTS001/rab', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Result: Direct path = /api/projects/... ✅
```

---

## ❌ WRONG Usage

### Using `api.get()` with /api prefix

```javascript
// ❌ WRONG - Double /api/api
api.get('/api/projects/2025LTS001/rab')

// Result: /api + /api/projects/... = /api/api/projects/... ❌ 404
```

### Using `fetch()` without /api prefix

```javascript
// ❌ WRONG - Missing /api, returns HTML (200 but not JSON)
fetch('/projects/2025LTS001/rab')

// Result: Hits root route, returns HTML instead of JSON
// Error: "<!DOCTYPE "... is not valid JSON
```

---

## 🔍 How to Identify Which Method You're Using

### Check 1: Look at imports

```javascript
// If you see this:
import api from '../services/api';
// → Use: api.get('/projects/...')  (no /api prefix)

// If you DON'T see api import:
// → Use: fetch('/api/projects/...')  (with /api prefix)
```

### Check 2: Look at the call

```javascript
// Axios (api.js)
api.get(...)    // No /api prefix
api.post(...)   // No /api prefix

// Raw fetch
fetch('...')    // Need /api prefix
```

---

## 📊 Files Fixed by Type

### Type A: Using `api.get()` - NO /api prefix needed ✅
**These files import and use Axios api.js**

Files using `api` instance (keep paths WITHOUT /api):
- None currently (all migrated to fetch or fixed)

### Type B: Using `fetch()` - NEED /api prefix ✅
**These files use raw fetch without api.js**

Files fixed to use `/api/projects/...`:
1. `useTandaTerima.js` ✅
2. `useAvailablePOs.js` ✅
3. `useTTForm.js` ✅
4. `CreateTandaTerimaModal.js` ✅
5. `CreateTandaTerimaForm.js` ✅
6. `useBeritaAcara.js` ✅
7. `useRABItems.js` (rab-workflow) ✅
8. `useRABItems.js` (purchase-orders) ✅
9. `useApprovalActions.js` (workflow) ✅
10. `useApprovalData.js` ✅
11. `useApprovedBA.js` ✅
12. `useProgressPayments.js` ✅
13. `PaymentCreateForm.js` ✅
14. `useBudgetData.js` ✅

### Type C: Using Axios api instance - Keep WITHOUT /api ✅
**ProjectRABWorkflow.js uses api.get():**
- ✅ `/projects/${projectId}/purchase-orders`
- ✅ `/projects/${projectId}/receipts`
- ✅ `/projects/${projectId}/berita-acara`
- ✅ `/projects/${projectId}/progress-payments`

---

## 🛠️ Migration Scripts Created

### Script 1: `fix-double-api-paths.sh`
**Purpose:** Remove `/api` prefix from api.get() calls  
**Result:** Fixed 15 files initially  
**Issue:** Also removed from fetch() calls (wrong!)

### Script 2: `fix-fetch-api-paths.sh`
**Purpose:** Add `/api` back to fetch() calls only  
**Result:** Fixed 14 files  
**Status:** ✅ Complete

---

## 📋 Quick Reference Card

### When to use `/api` prefix:

```javascript
// ✅ YES - Use /api with fetch()
fetch('/api/projects/...')

// ❌ NO - Don't use /api with api.get()
api.get('/projects/...')  // baseURL already has /api
```

### Common Patterns:

```javascript
// Pattern 1: Axios api.get() (most common in new code)
import api from '../services/api';
const response = await api.get('/projects/123/rab');

// Pattern 2: Raw fetch() (legacy code, needs refactoring)
const response = await fetch('/api/projects/123/rab', {
  headers: { 'Authorization': `Bearer ${token}` }
});

// Pattern 3: Axios with custom instance (rare)
const customApi = axios.create({ baseURL: '/api' });
const response = await customApi.get('/projects/123/rab');
```

---

## 🚨 Common Errors and Solutions

### Error 1: Double /api/api (404)
```
GET /api/api/projects/... 404
```
**Cause:** Using `/api` prefix with `api.get()`  
**Solution:** Remove `/api` prefix → Use `/projects/...`

### Error 2: HTML instead of JSON (200 but parse error)
```
SyntaxError: Unexpected token '<', "<!DOCTYPE "... is not valid JSON
```
**Cause:** Using `/projects/...` with raw `fetch()`  
**Solution:** Add `/api` prefix → Use `/api/projects/...`

### Error 3: CORS or 404 on root
```
GET /projects/... 404
```
**Cause:** Missing `/api` prefix with `fetch()`  
**Solution:** Add `/api` → Use `/api/projects/...`

---

## ✅ Best Practices

### 1. **Prefer Axios api.get() over fetch()**
```javascript
// ✅ RECOMMENDED
import api from '../services/api';
const response = await api.get('/projects/123/rab');

// ⚠️ LEGACY (works but not preferred)
const response = await fetch('/api/projects/123/rab');
```

**Why?**
- Automatic authentication via interceptors
- Centralized error handling
- Consistent baseURL
- Less code duplication

### 2. **Never mix /api in paths when using api.js**
```javascript
// ❌ WRONG
api.get('/api/projects/...')

// ✅ CORRECT
api.get('/projects/...')
```

### 3. **Always use /api with raw fetch()**
```javascript
// ❌ WRONG
fetch('/projects/...')

// ✅ CORRECT
fetch('/api/projects/...')
```

### 4. **Check your imports**
```javascript
// If you have this import:
import api from '../services/api';

// Then use:
api.get('/projects/...')  // No /api

// If you don't have api import:
fetch('/api/projects/...')  // With /api
```

---

## 🧪 Testing Checklist

### After Fix, Verify:

- [ ] No 404 errors in console
- [ ] No "<!DOCTYPE..." JSON parse errors
- [ ] RAB data loads correctly
- [ ] Purchase Orders work
- [ ] Tanda Terima (Receipts) work
- [ ] Berita Acara works
- [ ] Progress Payments work
- [ ] Approval workflows work

### Check Console For:
```javascript
// ✅ GOOD - Correct paths
GET /api/projects/2025LTS001/rab 200
POST /api/projects/2025LTS001/berita-acara 201

// ❌ BAD - Double /api
GET /api/api/projects/... 404

// ❌ BAD - Missing /api with fetch
GET /projects/... 404 or returns HTML
```

---

## 📚 Summary

**Golden Rules:**
1. **api.get()** → Path WITHOUT `/api` prefix
2. **fetch()** → Path WITH `/api` prefix
3. When in doubt, check if file imports `api.js`

**Files Status:**
- ✅ 14 files using fetch() → Fixed with `/api` prefix
- ✅ ProjectRABWorkflow.js using api.get() → Correct without `/api`
- ✅ Frontend compiled successfully

**Next:** User testing to ensure all workflows function correctly

---

**Fixed:** October 12, 2025  
**Scripts:** `fix-fetch-api-paths.sh`  
**Status:** ✅ Complete and documented
