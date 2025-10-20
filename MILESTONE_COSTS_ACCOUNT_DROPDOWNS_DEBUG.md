# Milestone Costs - Account Dropdowns Debug
**Date:** October 20, 2025  
**Status:** 🔍 DEBUGGING

---

## 📋 Issue Report

**Problem:**
Form "Add Realization" di Milestone Details > Biaya & Kasbon menampilkan dropdown kosong:
- ❌ Expense Account dropdown kosong
- ❌ Source Account (Bank/Cash) dropdown kosong

**Expected Behavior:**
- ✅ Expense Account dropdown menampilkan EXPENSE accounts
- ✅ Source Account dropdown menampilkan CASH_AND_BANK accounts

---

## 🔍 Investigation

### Components Involved:

1. **CostsTab.js** (Parent)
   - Fetches expense accounts via `fetchExpenseAccounts()`
   - Fetches source accounts via `fetchSourceAccounts()`
   - Passes data to RABItemsSection

2. **RABItemsSection.js** (Middle)
   - Receives accounts as props
   - Passes to RABItemCard

3. **RABItemCard.js** (Child)
   - Renders inline form
   - Displays dropdown options from props

### Data Flow:
```
CostsTab (fetch) 
  ↓ props
RABItemsSection (pass-through) 
  ↓ props
RABItemCard (render)
```

---

## 🛠️ Debug Changes Applied

### 1. CostsTab.js - Enhanced Logging

**fetchExpenseAccounts():**
```javascript
console.log('[CostsTab] 🔄 Fetching expense accounts...');
// ... fetch logic ...
console.log('[CostsTab] 📡 Expense accounts response:', response.data);
console.log('[CostsTab] ✅ Loaded expense accounts:', {
  totalFromAPI: result.data.length,
  filteredCount: accounts.length,
  accounts: accounts
});
```

**fetchSourceAccounts():**
```javascript
console.log('[CostsTab] 🔄 Fetching source accounts (bank/cash)...');
// ... fetch logic ...
console.log('[CostsTab] 📡 Source accounts response:', response.data);
console.log('[CostsTab] ✅ Loaded source accounts (bank/cash):', {
  totalFromAPI: result.data.length,
  filteredCount: accounts.length,
  accounts: accounts
});
```

### 2. RABItemCard.js - Props Verification

**Added useEffect:**
```javascript
React.useEffect(() => {
  console.log('[RABItemCard] 🔍 Accounts received:', {
    expenseAccountsCount: expenseAccounts?.length || 0,
    expenseAccounts: expenseAccounts,
    sourceAccountsCount: sourceAccounts?.length || 0,
    sourceAccounts: sourceAccounts,
    itemId: item.id,
    itemDescription: item.description
  });
}, [expenseAccounts, sourceAccounts, item.id]);
```

---

## 🧪 Testing Instructions

### Step 1: Open Browser Console
1. Navigate to: `https://nusantaragroup.co/projects/[project-id]`
2. Open Developer Tools (F12)
3. Go to Console tab
4. Clear console

### Step 2: Navigate to Milestone Costs
1. Click on any milestone
2. Go to "Biaya & Kasbon" tab
3. Scroll to RAB Items section
4. Click "Add Realization" button

### Step 3: Check Console Logs

**Expected Logs:**

**On Tab Load:**
```
[CostsTab] 🔄 Fetching expense accounts...
[CostsTab] 📡 Expense accounts response: { success: true, data: [...] }
[CostsTab] ✅ Loaded expense accounts: {
  totalFromAPI: 13,
  filteredCount: X,
  accounts: [...]
}

[CostsTab] 🔄 Fetching source accounts (bank/cash)...
[CostsTab] 📡 Source accounts response: { success: true, data: [...] }
[CostsTab] ✅ Loaded source accounts (bank/cash): {
  totalFromAPI: 13,
  filteredCount: Y,
  accounts: [...]
}
```

**On Form Open:**
```
[RABItemCard] 🔍 Accounts received: {
  expenseAccountsCount: X,
  expenseAccounts: [...],
  sourceAccountsCount: Y,
  sourceAccounts: [...],
  itemId: "...",
  itemDescription: "..."
}
```

### Step 4: Analyze Results

#### Scenario A: API Returns Empty
**Symptoms:**
- `totalFromAPI: 0`
- `filteredCount: 0`

**Cause:** No accounts in database

**Solution:** Run `createBasicCOA.js` script

#### Scenario B: API Returns Data But Filtered Empty
**Symptoms:**
- `totalFromAPI: 13` (or > 0)
- `filteredCount: 0`

**Cause:** Filter criteria too strict

**Solution:** Adjust filter logic

#### Scenario C: Data Not Reaching Component
**Symptoms:**
- CostsTab logs show data
- RABItemCard logs show empty

**Cause:** Props not passed correctly

**Solution:** Check component props chain

#### Scenario D: Network Error
**Symptoms:**
- `❌ Error fetching...` in console

**Cause:** API endpoint issue

**Solution:** Check backend logs and API routes

---

## 📝 Filter Criteria

### Expense Accounts Filter:
```javascript
account.accountType === 'EXPENSE' && 
account.level >= 2 && 
!account.isControlAccount
```

**Rationale:**
- `accountType === 'EXPENSE'` - Only expense accounts
- `level >= 2` - Exclude level 1 control account (5000 - BEBAN)
- `!isControlAccount` - Exclude control accounts (only operational)

**Expected Accounts:**
- 5101 - Biaya Gaji & Upah
- 5102 - Biaya Material Langsung
- 5103 - Biaya Subkontraktor
- 5104 - Biaya Sewa Alat
- 5201 - Biaya Listrik
- 5202 - Biaya Air
- 5203 - Biaya Telekomunikasi
- 5204 - Biaya Pemeliharaan
- 5205 - Biaya Transportasi
- 5206 - Biaya Konsumsi
- 5301 - Beban Bunga

**Total Expected:** ~11 accounts

### Source Accounts Filter:
```javascript
account.accountType === 'ASSET' && 
account.accountSubType === 'CASH_AND_BANK' &&
account.level >= 3 && 
!account.isControlAccount
```

**Rationale:**
- `accountType === 'ASSET'` - Only asset accounts
- `accountSubType === 'CASH_AND_BANK'` - Only cash/bank
- `level >= 3` - Exclude level 1 (1000 - ASET) and level 2 (1100 - Aset Lancar)
- `!isControlAccount` - Only transactional accounts

**Expected Accounts:**
- 1101.01 - Kas Kecil
- 1101.02 - Kas Besar
- 1101.03 - Bank Mandiri
- 1101.04 - Bank BCA

**Total Expected:** ~4 accounts

---

## 🔄 Next Steps

### If Dropdowns Still Empty:

1. **Check Console Logs**
   - Share screenshot of all `[CostsTab]` and `[RABItemCard]` logs

2. **Verify Database**
   ```bash
   curl https://nusantaragroup.co/api/chart-of-accounts
   ```
   - Count EXPENSE accounts with level >= 2
   - Count ASSET accounts with CASH_AND_BANK subtype

3. **Test API Directly**
   ```bash
   # Test expense accounts
   curl https://nusantaragroup.co/api/chart-of-accounts?account_type=EXPENSE&is_active=true
   
   # Test source accounts
   curl https://nusantaragroup.co/api/chart-of-accounts?account_type=ASSET&is_active=true
   ```

4. **Check Network Tab**
   - Filter requests to `/chart-of-accounts`
   - Check response status and data

---

## 🐛 Potential Issues

### Issue 1: API Query Parameters
**Problem:** Backend doesn't support query params
**Check:**
```javascript
// In chartOfAccounts.js routes
router.get('/', async (req, res) => {
  const { account_type, is_active } = req.query;
  // ... should filter by these params
});
```

### Issue 2: Field Name Mismatch
**Problem:** API returns snake_case, frontend expects camelCase
**Check:**
```javascript
// Backend should convert:
account_type -> accountType
account_sub_type -> accountSubType
is_control_account -> isControlAccount
```

### Issue 3: Race Condition
**Problem:** Fetch completes after component unmounts
**Check:**
```javascript
// Add cleanup in useEffect
useEffect(() => {
  let mounted = true;
  fetchAccounts().then(data => {
    if (mounted) setAccounts(data);
  });
  return () => { mounted = false; };
}, []);
```

---

## 📚 Related Files

- `/root/APP-YK/frontend/src/components/milestones/detail-tabs/CostsTab.js`
- `/root/APP-YK/frontend/src/components/milestones/detail-tabs/costs/RABItemsSection.js`
- `/root/APP-YK/frontend/src/components/milestones/detail-tabs/costs/RABItemCard.js`
- `/root/APP-YK/backend/routes/chartOfAccounts.js`
- `/root/APP-YK/backend/models/chartOfAccounts.js`

---

## ✅ Verification Checklist

- [x] Debug logging added to CostsTab
- [x] Debug logging added to RABItemCard
- [x] Frontend restarted
- [ ] Browser console checked
- [ ] API responses verified
- [ ] Dropdowns working
- [ ] Can submit realization form

---

**Status:** 🟡 Awaiting Console Logs  
**Next Action:** Check browser console and share logs
