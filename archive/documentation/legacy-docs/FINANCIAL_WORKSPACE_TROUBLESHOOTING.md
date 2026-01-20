# 🔍 Financial Workspace Troubleshooting Guide

**Issue**: Dashboard menampilkan semua card dan informasi kosong

---

## ✅ Diagnostic Checklist

### 1. Backend API Test
```bash
# Test dari host
curl http://localhost:5000/api/financial/dashboard/overview

# Should return:
{
  "success": true,
  "data": {
    "totalRevenue": 100000000,
    "totalExpenses": 50000000,
    ...
  }
}
```
**Status**: ✅ WORKING (verified)

### 2. Frontend Proxy Configuration
```javascript
// /frontend/src/setupProxy.js
app.use('/api', createProxyMiddleware({
  target: 'http://backend:5000',
  changeOrigin: true,
  secure: false,
}));
```
**Status**: ✅ CONFIGURED

### 3. API Client Configuration
```javascript
// /frontend/src/utils/config.js
// Returns: '/api' (will be proxied to backend)
```
**Status**: ✅ CONFIGURED

---

## 🐛 Potential Issues

### Issue 1: Initial State Problem
**Code**: `const [financialData, setFinancialData] = useState({});`
**Problem**: Empty object might cause destructuring issues
**Fix Applied**: Changed to `null` and added safety check

### Issue 2: Data Not Loading
**Symptoms**:
- API returns data correctly
- Frontend shows empty cards
- No errors in backend logs

**Possible Causes**:

#### A. Frontend Can't Reach Backend
**Test**:
```bash
# From browser console:
fetch('/api/financial/dashboard/overview')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Expected**: Should log data object
**If fails**: Network/proxy issue

#### B. Data Structure Mismatch
**Check**:
```javascript
// In fetchFinancialData(), after setFinancialData(dashboardData)
console.log('Dashboard data set:', dashboardData);
console.log('Dashboard object:', dashboardData.dashboard);
```

**Expected**: Should see full data object
**If undefined**: Data transformation issue

#### C. React State Not Updating
**Check**:
```javascript
// In component body, after destructuring
console.log('financialData:', financialData);
console.log('dashboard:', dashboard);
console.log('incomeStatement:', incomeStatement);
```

**Expected**: Should see data
**If undefined**: State management issue

---

## 🔧 Applied Fixes

### Fix 1: Initial State
```javascript
// Before
const [financialData, setFinancialData] = useState({});

// After
const [financialData, setFinancialData] = useState(null);
```

### Fix 2: Safety Check
```javascript
if (!financialData) {
  return (
    <div>
      <AlertTriangle />
      <p>No financial data available</p>
      <button onClick={handleRefresh}>Refresh Data</button>
    </div>
  );
}
```

### Fix 3: Enhanced Logging
```javascript
console.log('✅ [FINANCIAL WORKSPACE] Real data loaded:', realData);
console.log('✅ [FINANCIAL WORKSPACE] Dashboard data set:', dashboardData);
console.log('✅ [FINANCIAL WORKSPACE] Trends data:', trendsData);
```

---

## 🧪 Testing Steps

### Step 1: Open Browser DevTools
```
F12 → Console Tab
```

### Step 2: Navigate to Financial Workspace
```
URL: http://your-domain:3000/workspace/financial
```

### Step 3: Check Console Logs
**Expected to see**:
```
🔐 AXIOS REQUEST DEBUG: { url: '/financial/dashboard/overview', ... }
✅ Token added to request headers
✅ [FINANCIAL WORKSPACE] Real data loaded: { totalRevenue: 100000000, ... }
✅ [FINANCIAL WORKSPACE] Dashboard data set: { dashboard: {...}, ... }
✅ [FINANCIAL WORKSPACE] Trends data: { trends: [...], ... }
```

**If you see**:
```
❌ [FINANCIAL WORKSPACE] Error fetching data: ...
```
→ API call failed, check Network tab

**If you see**:
```
⚠️ [FINANCIAL WORKSPACE] API returned no data
```
→ API response structure wrong

### Step 4: Check Network Tab
```
F12 → Network Tab → Filter: XHR
```

**Look for**:
- Request to `/api/financial/dashboard/overview`
- Status: 200 OK
- Response: JSON with data

**If fails**:
- Status 404: Route not found
- Status 500: Backend error
- Status 401: Authentication issue
- CORS error: Proxy configuration issue

### Step 5: Manual API Test
```javascript
// In browser console, run:
fetch('/api/financial/dashboard/overview', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(d => console.log('API Response:', d))
.catch(e => console.error('API Error:', e))
```

**Expected**: Should log data object with totalRevenue, totalExpenses, etc.

---

## 🎯 Solution Matrix

| Symptom | Cause | Solution |
|---------|-------|----------|
| Cards show "Rp 0" | API returns 0 values | Check database transactions |
| Cards completely empty | Data structure mismatch | Check console logs |
| Loading forever | API not responding | Check backend status |
| "No data available" error | financialData is null | Check API call |
| Network error | Proxy not working | Restart frontend container |
| 401 Unauthorized | Token expired | Re-login |
| CORS error | Proxy misconfigured | Check setupProxy.js |

---

## 🚀 Quick Fixes

### Fix 1: Restart Containers
```bash
docker-compose restart backend frontend
```

### Fix 2: Clear Browser Cache
```
Hard Refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

### Fix 3: Check Token
```javascript
// In browser console
localStorage.getItem('token')
// Should return JWT token, not null
```

### Fix 4: Force Refresh Data
```javascript
// In browser console
window.location.reload(true)
```

---

## 📊 Expected vs Actual

### Expected Display:
```
┌──────────────────────────────────────┐
│ Total Revenue      Rp 100.000.000   │
│ Total Expenses     Rp 50.000.000    │
│ Net Profit         Rp 50.000.000    │
│ Cash & Bank        Rp 3.400.000.000 │
└──────────────────────────────────────┘
```

### If Shows:
```
┌──────────────────────────────────────┐
│ Total Revenue      Rp 0              │
│ Total Expenses     Rp 0              │
│ Net Profit         Rp 0              │
│ Cash & Bank        Rp 0              │
└──────────────────────────────────────┘
```

**Causes**:
1. API returns 0 → Database empty
2. Data not received → Network issue
3. Data structure wrong → Check console

---

## 🔍 Next Steps

1. **Check Browser Console** for errors
2. **Check Network Tab** for failed requests
3. **Test API manually** with fetch()
4. **Check token** in localStorage
5. **Restart containers** if needed

Share the console logs and Network tab details for further diagnosis!

