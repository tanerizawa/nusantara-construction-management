# 🔍 Subsidiary Filter Debug Testing Guide

## ✅ Debug Logging Successfully Added

### What Was Changed:

#### 1. **Frontend - SubsidiarySelector.js**
Added debug logging to track filter selection:
```javascript
const handleSelect = (subsidiaryId) => {
  console.log('🔍 [SubsidiarySelector] Selected:', subsidiaryId);
  console.log('🔍 [SubsidiarySelector] onSubsidiaryChange exists?', !!onSubsidiaryChange);
  if (onSubsidiaryChange) {
    onSubsidiaryChange(subsidiaryId);
  } else {
    console.error('❌ [SubsidiarySelector] onSubsidiaryChange is undefined!');
  }
  setIsOpen(false);
};
```

#### 2. **Backend - coa.js**
Added debug logging to track API requests and query results:
```javascript
router.get('/', async (req, res) => {
  const { subsidiaryId } = req.query;
  console.log('🔍 [Backend COA] GET /api/coa - Query params:', { subsidiaryId });
  
  if (subsidiaryId) {
    console.log('🔍 [Backend COA] Filtering by subsidiaryId:', subsidiaryId);
    whereClause.subsidiaryId = subsidiaryId;
  }
  
  console.log('🔍 [Backend COA] WHERE clause:', whereClause);
  
  // After query
  console.log('🔍 [Backend COA] Found accounts:', accounts.length);
  console.log('🔍 [Backend COA] Sample subsidiaryId values:', 
    accounts.slice(0, 3).map(acc => ({ code: acc.accountCode, subsidiaryId: acc.subsidiaryId }))
  );
});
```

### Status:
- ✅ Frontend restarted: **Compiled successfully**
- ✅ Backend restarted: **Running**
- ✅ Ready for testing

---

## 📋 Step-by-Step Testing Instructions

### Step 1: Open Application
```
1. Open browser (Chrome/Firefox recommended)
2. Navigate to: http://localhost:3000
3. Login if required
4. Go to: Finance → Chart of Accounts
```

### Step 2: Open Developer Tools
```
1. Press F12 (or right-click → Inspect)
2. Go to "Console" tab
3. Clear console (trash icon)
4. Go to "Network" tab
5. Filter by "Fetch/XHR"
```

### Step 3: Test Filter Selection

#### A. Select "All Entities" (Clear Filter)
```
1. Click SubsidiarySelector dropdown
2. Select "All Entities"
3. EXPECTED CONSOLE LOGS:
   🔍 [SubsidiarySelector] Selected: null
   🔍 [SubsidiarySelector] onSubsidiaryChange exists? true

4. EXPECTED NETWORK REQUEST:
   GET http://localhost:5000/api/coa
   (NO subsidiaryId parameter)

5. EXPECTED BACKEND LOGS (run: docker-compose logs backend --tail=20):
   🔍 [Backend COA] GET /api/coa - Query params: {}
   🔍 [Backend COA] WHERE clause: { isActive: true }
   🔍 [Backend COA] Found accounts: [total count]
```

#### B. Select "BSR - CV. BINTANG SURAYA"
```
1. Click SubsidiarySelector dropdown
2. Select "BSR - CV. BINTANG SURAYA"
3. EXPECTED CONSOLE LOGS:
   🔍 [SubsidiarySelector] Selected: NU002
   🔍 [SubsidiarySelector] onSubsidiaryChange exists? true

4. EXPECTED NETWORK REQUEST:
   GET http://localhost:5000/api/coa?subsidiaryId=NU002
   
   Check response:
   - Should ONLY contain accounts with subsidiaryId: "NU002"
   - Example: { accountCode: "1-00000", subsidiaryId: "NU002", ... }

5. EXPECTED BACKEND LOGS:
   🔍 [Backend COA] GET /api/coa - Query params: { subsidiaryId: 'NU002' }
   🔍 [Backend COA] Filtering by subsidiaryId: NU002
   🔍 [Backend COA] WHERE clause: { isActive: true, subsidiaryId: 'NU002' }
   🔍 [Backend COA] Found accounts: [filtered count]
   🔍 [Backend COA] Sample subsidiaryId values: [
     { code: '1-00000', subsidiaryId: 'NU002' },
     ...
   ]
```

#### C. Select Other Subsidiaries
Test with:
- **CUE14** - PT. CUANKI EMAS 14 (NU006)
- **GBN** - PT. GUBANG NAPAL (NU001)
- **LTS** - PT. LINTANG TRANS SEMESTA (NU004)

Each should show:
- ✅ Correct subsidiaryId in console
- ✅ API call with ?subsidiaryId=XXX parameter
- ✅ Backend logs showing filtering
- ✅ Only accounts for that subsidiary

---

## 🐛 Common Issues & Diagnoses

### Issue 1: onSubsidiaryChange is undefined
**Symptoms:**
```
❌ [SubsidiarySelector] onSubsidiaryChange is undefined!
```

**Root Cause:** Prop not passed from parent component

**Fix Location:** ChartOfAccountsHeader.js or ChartOfAccounts.js
```javascript
// Verify this line exists:
<SubsidiarySelector 
  selectedSubsidiary={selectedSubsidiary}
  onSubsidiaryChange={handleSubsidiaryChange}  // ← Must be passed
/>
```

---

### Issue 2: No Network Request
**Symptoms:**
- Console shows: "🔍 [SubsidiarySelector] Selected: NU002"
- But NO network request in Network tab

**Root Cause:** handleSubsidiaryChange not calling API

**Fix Location:** useChartOfAccounts.js or ChartOfAccounts.js
```javascript
const handleSubsidiaryChange = (subsidiaryId) => {
  setSelectedSubsidiary(subsidiaryId);
  loadAccounts(false, subsidiaryId); // ← Must trigger reload
};
```

---

### Issue 3: API Called But No Filter Applied
**Symptoms:**
- Network tab shows: GET /api/coa?subsidiaryId=NU002
- Backend logs show: { subsidiaryId: 'NU002' }
- But response contains ALL accounts (not filtered)

**Possible Causes:**

#### A. Accounts Don't Have subsidiaryId
```sql
-- Check database:
SELECT account_code, account_name, subsidiary_id 
FROM chart_of_accounts 
WHERE is_active = true 
LIMIT 10;

-- If subsidiary_id is NULL for all accounts → Issue in AddAccountModal
```

**Fix:** Verify form submission in AddAccountModal.js saves subsidiaryId

#### B. Backend WHERE Clause Not Working
```javascript
// Check Sequelize model - is field name correct?
// Should be: subsidiaryId (camelCase) or subsidiary_id (snake_case)?

// Test raw query:
const { Sequelize } = require('sequelize');
const accounts = await ChartOfAccounts.findAll({
  where: Sequelize.literal(`subsidiary_id = 'NU002'`),
  raw: true
});
console.log('Raw query results:', accounts.length);
```

---

### Issue 4: Filter Shows Wrong Results
**Symptoms:**
- Select BSR (NU002)
- See accounts with subsidiaryId: "NU001" or NULL

**Root Cause:** Include associations not filtered

**Fix:** Add subsidiaryId filter to SubAccounts include:
```javascript
include: [
  {
    model: ChartOfAccounts,
    as: 'SubAccounts',
    where: { 
      isActive: true,
      ...(subsidiaryId && { subsidiaryId })  // ← Add this
    },
    required: false
  }
]
```

---

## 📊 Expected Test Results

### Scenario 1: All Entities (No Filter)
- **Request:** GET /api/coa
- **Backend WHERE:** `{ isActive: true }`
- **Results:** All active accounts (any subsidiary)
- **UI:** Shows full tree with all subsidiaries

### Scenario 2: BSR Selected
- **Request:** GET /api/coa?subsidiaryId=NU002
- **Backend WHERE:** `{ isActive: true, subsidiaryId: 'NU002' }`
- **Results:** Only accounts with subsidiaryId = 'NU002'
- **UI:** Shows only BSR accounts

### Scenario 3: New Account Created
```
1. Create new account with BSR subsidiary
2. Save successfully
3. Filter by BSR
4. New account should appear
5. Filter by CUE14
6. New account should NOT appear
```

---

## 🎯 What to Report Back

### Successful Test:
```
✅ Filter working!
- Dropdown selection triggers API call
- Backend receives subsidiaryId parameter
- Response contains only filtered accounts
- UI updates to show filtered tree
```

### Failed Test - Report:
```
1. Which step failed?
   □ Dropdown not triggering console log
   □ No network request
   □ API called but not filtering
   □ Other: ___________

2. Console logs screenshot

3. Network tab screenshot (showing request/response)

4. Backend logs (run: docker-compose logs backend --tail=50)
```

---

## 🔧 Next Steps After Diagnosis

### If Filter Works:
✅ Move to Phase 2: Implement CRUD endpoints
- PUT /api/coa/:id (Edit)
- DELETE /api/coa/:id (Delete)
- GET /api/coa/:id (Detail)

### If Filter Fails:
🔴 Fix based on diagnosis above, then re-test

---

## 📝 Testing Checklist

- [ ] Frontend compiled successfully
- [ ] Backend restarted
- [ ] Browser console open
- [ ] Network tab ready
- [ ] Backend logs monitored
- [ ] Tested "All Entities" selection
- [ ] Tested BSR selection
- [ ] Tested other subsidiaries
- [ ] Checked API request parameters
- [ ] Checked API response data
- [ ] Verified UI updates correctly
- [ ] Tested creating new account
- [ ] Verified new account appears in correct filter

---

## 🚀 Ready to Test!

**Current Status:**
- ✅ Debug logging added to frontend
- ✅ Debug logging added to backend
- ✅ Both containers restarted
- ✅ Application compiled successfully

**Action Required:**
1. Open http://localhost:3000 → Finance → Chart of Accounts
2. Open F12 Developer Tools
3. Follow Step 3 testing instructions above
4. Report back with results!

**Estimated Testing Time:** 10-15 minutes
