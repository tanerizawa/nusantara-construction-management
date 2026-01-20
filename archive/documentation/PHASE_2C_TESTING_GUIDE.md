# Phase 2C: Testing Guide - Subsidiary Field & Badge

**Status:** ✅ Implementation Complete - Ready for Testing  
**Date:** 17 Oktober 2025  
**Test Environment:** http://localhost:3000

---

## 🎯 TESTING OBJECTIVES

Verify that:
1. ✅ Subsidiary dropdown appears in account form
2. ✅ Subsidiary dropdown loads all 6 active subsidiaries
3. ✅ Account can be created with subsidiary assignment
4. ✅ Subsidiary badge appears in AccountTree
5. ✅ Badge shows correct subsidiary code
6. ✅ Tooltip shows full subsidiary name

---

## 📋 PRE-TEST CHECKLIST

### System Status ✅
- [x] Frontend container: **Up 9 minutes (healthy)** - Port 3000
- [x] Backend container: **Up 24 minutes (healthy)** - Port 5000
- [x] Database container: **Up 2 days (healthy)** - Port 5432
- [x] Compilation: **Compiled successfully!**
- [x] No errors in logs

### Expected Subsidiaries (6 total):
1. **BSR** - CV. BINTANG SURAYA
2. **CUE14** - PT. CAHAYA UTAMA ELECTRINDO
3. **GBN** - PT. GEMA BANGUNAN NUSANTARA
4. **LTS** - PT. LIGHT TOWER SOLUTION
5. **SSR** - PT. SINERGI SURYA RAYA
6. **PJK** - PT. PELITA JAYA KONSULINDO

---

## 🧪 TEST CASES

### TEST 1: Subsidiary Dropdown Visibility ⭐ CRITICAL

**Objective:** Verify subsidiary field appears in account form

**Steps:**
1. Open browser: http://localhost:3000
2. Login to application
3. Navigate: **Finance** → **Chart of Accounts**
4. Click **"Tambah Akun"** button (top right)
5. Scroll down in modal to find subsidiary field

**Expected Result:**
```
┌────────────────────────────────────┐
│ Tambah Akun Baru              [×]  │
├────────────────────────────────────┤
│ Kode Akun *                        │
│ [____________]                     │
│                                    │
│ Nama Akun *                        │
│ [____________]                     │
│                                    │
│ Parent Account ID                  │
│ [-- Pilih Parent Account --]  [▼] │
│                                    │
│ Subsidiary / Entitas          ⭐   │ ← LOOK FOR THIS
│ [-- Pilih Subsidiary (Optional) --]│
│ Assign account to specific entity  │
│ for multi-entity accounting        │
│                                    │
│ Level *                            │
│ [1]                           [▼] │
└────────────────────────────────────┘
```

**✅ PASS Criteria:**
- [ ] Field labeled "Subsidiary / Entitas" is visible
- [ ] Field is positioned after "Parent Account ID"
- [ ] Field is positioned before "Level"
- [ ] Helper text is visible below dropdown
- [ ] Placeholder says "-- Pilih Subsidiary (Optional) --"

**❌ FAIL Actions:**
If field not visible → Check console for errors → Report issue

---

### TEST 2: Subsidiary Dropdown Options ⭐ CRITICAL

**Objective:** Verify all 6 subsidiaries load correctly

**Steps:**
1. Continue from TEST 1 (form modal open)
2. Click on **"Subsidiary / Entitas"** dropdown
3. Wait for options to load (should be instant if already loaded)
4. Count the number of subsidiaries

**Expected Result:**
```
┌────────────────────────────────────┐
│ Subsidiary / Entitas          [▼] │
├────────────────────────────────────┤
│ -- Pilih Subsidiary (Optional) -- ← Default option
│ BSR - CV. BINTANG SURAYA           ← Option 1
│ CUE14 - PT. CAHAYA UTAMA ELECTR... ← Option 2
│ GBN - PT. GEMA BANGUNAN NUSANTA... ← Option 3
│ LTS - PT. LIGHT TOWER SOLUTION     ← Option 4
│ SSR - PT. SINERGI SURYA RAYA       ← Option 5
│ PJK - PT. PELITA JAYA KONSULINDO   ← Option 6
└────────────────────────────────────┘
```

**✅ PASS Criteria:**
- [ ] Dropdown shows exactly 7 options (1 placeholder + 6 subsidiaries)
- [ ] Each option shows format: "{CODE} - {NAME}"
- [ ] All 6 subsidiary codes visible: BSR, CUE14, GBN, LTS, SSR, PJK
- [ ] No loading spinner after initial load
- [ ] Dropdown not disabled

**❌ FAIL Actions:**
- If no options → Check network tab → Check API /api/subsidiaries
- If less than 6 → Check database: `SELECT * FROM subsidiaries WHERE is_active = true`
- If format wrong → Check subsidiaryService transformation

---

### TEST 3: Create Account WITHOUT Subsidiary 🟢 NORMAL

**Objective:** Verify optional field doesn't break existing flow

**Steps:**
1. Continue from TEST 2 (form modal open)
2. Fill required fields:
   - Kode Akun: `9999`
   - Nama Akun: `Test Account No Subsidiary`
   - Tipe Akun: Select any (e.g., "Asset")
   - Level: `1`
3. **DO NOT** select a subsidiary (leave default)
4. Click **"Simpan"** button

**Expected Result:**
- ✅ Form submits successfully
- ✅ No validation error about subsidiary
- ✅ Account appears in tree without subsidiary badge
- ✅ Modal closes automatically

**✅ PASS Criteria:**
- [ ] Form submission succeeds
- [ ] No error messages
- [ ] Account visible in tree
- [ ] NO subsidiary badge on this account

**❌ FAIL Actions:**
If error → Check if field incorrectly marked as required → Fix accountFormConfig

---

### TEST 4: Create Account WITH Subsidiary ⭐ CRITICAL

**Objective:** Verify account creation with subsidiary assignment

**Steps:**
1. Click **"Tambah Akun"** again
2. Fill required fields:
   - Kode Akun: `9998`
   - Nama Akun: `Test Account With BSR`
   - Tipe Akun: Select any
   - Level: `1`
3. **SELECT** subsidiary: **"BSR - CV. BINTANG SURAYA"**
4. Click **"Simpan"**

**Expected Result:**
```
API Payload should include:
{
  "code": "9998",
  "name": "Test Account With BSR",
  "accountType": "Asset",
  "level": 1,
  "subsidiaryId": "NU002",  ← LOOK FOR THIS
  ...
}
```

**✅ PASS Criteria:**
- [ ] Form submits successfully
- [ ] Network tab shows subsidiaryId in POST payload
- [ ] Account appears in tree
- [ ] **Subsidiary badge visible on account:** `[🏢 BSR]`
- [ ] Badge has orange color
- [ ] Badge positioned after other badges

**❌ FAIL Actions:**
- If no badge → Check AccountTree subsidiaryData loading
- If wrong code → Check subsidiaryData map creation
- If wrong color → Check AccountTreeItem badge styles

---

### TEST 5: Subsidiary Badge Display ⭐ CRITICAL

**Objective:** Verify badge appearance and behavior

**Steps:**
1. Locate account created in TEST 4 (`9998 - Test Account With BSR`)
2. Observe the badge next to account name
3. Hover mouse over the badge
4. Expand/collapse parent accounts (if nested)

**Expected Visual:**
```
📁 9998 - Test Account With BSR  [🏢 BSR]
                                  ↑
                              Orange badge
                              Building icon
                              Shows "BSR" code
```

**Badge Specifications:**
- **Icon:** Building2 (lucide-react)
- **Color:** Orange (#FF9F0A)
- **Background:** rgba(255, 159, 10, 0.15)
- **Size:** Small (12px icon)
- **Position:** After project/cost center badges

**✅ PASS Criteria:**
- [ ] Badge visible next to account name
- [ ] Badge shows "BSR" text
- [ ] Badge has orange color scheme
- [ ] Building icon (🏢) visible
- [ ] Hover shows tooltip with full subsidiary name
- [ ] Badge doesn't break tree layout
- [ ] Badge stays visible when tree expanded/collapsed

**❌ FAIL Actions:**
- If not visible → Check browser console for errors
- If no data → Check subsidiaryData prop passed to AccountTreeItem
- If wrong styling → Check AccountTreeItem badge CSS

---

### TEST 6: Edit Account - Change Subsidiary 🟢 NORMAL

**Objective:** Verify subsidiary can be changed via edit

**Steps:**
1. Find account created in TEST 4 (`9998`)
2. Click **Edit** button (pencil icon)
3. Modal opens with existing data
4. Change subsidiary from **"BSR"** to **"CUE14"**
5. Click **"Simpan"**

**Expected Result:**
- ✅ Form loads with current subsidiaryId selected
- ✅ Can change to different subsidiary
- ✅ Update succeeds
- ✅ Badge changes from `[🏢 BSR]` to `[🏢 CUE14]`

**✅ PASS Criteria:**
- [ ] Dropdown shows current subsidiary selected
- [ ] Can select different subsidiary
- [ ] Update API call includes new subsidiaryId
- [ ] Badge updates in tree without page refresh

**❌ FAIL Actions:**
If dropdown not pre-filled → Check form initialization in AddAccountModal

---

### TEST 7: Edit Account - Remove Subsidiary 🟢 NORMAL

**Objective:** Verify subsidiary can be unassigned

**Steps:**
1. Edit account `9998` again
2. Change subsidiary dropdown back to **"-- Pilih Subsidiary (Optional) --"**
3. Click **"Simpan"**

**Expected Result:**
- ✅ Update succeeds
- ✅ Badge disappears from tree
- ✅ Account still functional without subsidiary

**✅ PASS Criteria:**
- [ ] Can select placeholder option
- [ ] Update sends subsidiaryId as null/empty
- [ ] Badge removed from tree
- [ ] No errors

---

### TEST 8: Subsidiary Filter Integration 🔵 BONUS

**Objective:** Verify filter works with new badges

**Steps:**
1. Look at top of Chart of Accounts page
2. Find **SubsidiarySelector** dropdown (from Phase 2B)
3. Select **"BSR - CV. BINTANG SURAYA"**
4. Observe tree updates

**Expected Result:**
- ✅ Only accounts with subsidiaryId="NU002" (BSR) show
- ✅ Account `9998` (if BSR assigned) is visible
- ✅ Account `9999` (no subsidiary) is hidden
- ✅ Badges still display correctly on filtered accounts

**✅ PASS Criteria:**
- [ ] Filter works as before (Phase 2B functionality)
- [ ] Badges visible on filtered accounts
- [ ] No duplicate badges
- [ ] Performance acceptable

---

### TEST 9: Multiple Badges Display 🟢 NORMAL

**Objective:** Verify subsidiary badge coexists with other badges

**Scenario:** Account has multiple badges (Konstruksi + Cost Center + Subsidiary)

**Steps:**
1. Find or create account with:
   - isConstructionProject = true
   - projectCostCenterId = some value
   - subsidiaryId = NU002
2. Observe badge layout

**Expected Visual:**
```
📁 Account Name  [Konstruksi] [Cost Center] [🏢 BSR]
                 └─ Blue      └─ Green      └─ Orange
```

**✅ PASS Criteria:**
- [ ] All 3 badges visible
- [ ] Badges have distinct colors
- [ ] Badges don't overlap
- [ ] Badges aligned horizontally
- [ ] Responsive layout (no wrapping issues)

---

### TEST 10: Performance Check ⚡ PERFORMANCE

**Objective:** Verify no performance degradation

**Metrics to Check:**
- [ ] Form modal opens in <200ms
- [ ] Subsidiary dropdown loads in <200ms
- [ ] Account tree renders in <500ms
- [ ] Badge rendering adds <5ms per account
- [ ] No memory leaks after 10+ form opens

**Tools:**
- Browser DevTools → Performance tab
- Network tab → Check API response times
- Console → No warnings about re-renders

**✅ PASS Criteria:**
- [ ] Page loads quickly
- [ ] No lag when scrolling tree
- [ ] Form interactions smooth
- [ ] No console warnings

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: Subsidiary Dropdown Empty
**Symptoms:** Dropdown shows only placeholder, no subsidiaries

**Debug Steps:**
```bash
# Check API response
curl http://localhost:5000/api/subsidiaries | jq

# Check database
docker exec nusantara-postgres psql -U nusantara_user -d nusantara_db \
  -c "SELECT id, code, name, is_active FROM subsidiaries;"
```

**Solution:**
- If API returns empty → Check database has 6 subsidiaries
- If API fails → Check backend logs: `docker-compose logs backend`
- If transformation fails → Check subsidiaryService.js

---

### Issue 2: Badge Not Appearing
**Symptoms:** Account created with subsidiary, but no badge

**Debug Steps:**
1. Open browser console
2. Check AccountTree component state:
   ```javascript
   // In console
   console.log(window.subsidiaryData); // Should show map of subsidiaries
   ```
3. Check network tab for GET /api/subsidiaries

**Solution:**
- If subsidiaryData empty → Check AccountTree useEffect
- If subsidiaryId missing → Check form submission payload
- If conditional not met → Check AccountTreeItem render logic

---

### Issue 3: Wrong Subsidiary Code in Badge
**Symptoms:** Badge shows wrong code or "[object Object]"

**Debug:**
```javascript
// Check data structure
console.log(subsidiaryData['NU002']); 
// Should show: { id: 'NU002', code: 'BSR', name: '...' }
```

**Solution:**
- Check subsidiaryData map creation in AccountTree
- Verify subsidiaryId matches map keys
- Check badge render code uses `.code` property

---

### Issue 4: Form Submission Fails
**Symptoms:** Error when submitting form with subsidiary

**Check:**
1. Network tab → Check POST /api/coa payload
2. Backend logs → Look for validation errors
3. Database schema → Verify subsidiary_id column exists

**Solution:**
- If column missing → Run migration: `20251017_add_subsidiary_id_to_coa.js`
- If foreign key fails → Check subsidiaryId is valid
- If null not allowed → Check migration set nullable=true

---

## 📸 EXPECTED SCREENSHOTS

### Screenshot 1: Account Form with Subsidiary Dropdown
```
┌──────────────────────────────────────────┐
│ Tambah Akun Baru                    [×]  │
├──────────────────────────────────────────┤
│                                          │
│ [... other fields ...]                   │
│                                          │
│ Subsidiary / Entitas                     │
│ ┌────────────────────────────────────┐  │
│ │ BSR - CV. BINTANG SURAYA        ▼ │  │
│ └────────────────────────────────────┘  │
│ Assign account to specific entity for   │
│ multi-entity accounting                  │
│                                          │
│ [... other fields ...]                   │
│                                          │
│         [Batal]  [Simpan]                │
└──────────────────────────────────────────┘
```

### Screenshot 2: AccountTree with Subsidiary Badge
```
Finance / Chart of Accounts

 Subsidiary: [ All Entities ▼ ]     [Tambah Akun]

📁 1000 - ASSET
  📁 1100 - Current Assets
    📄 1101 - Bank BCA  [Konstruksi] [CC-01] [🏢 BSR]  ← Badge here
    📄 1102 - Bank BRI  [🏢 CUE14]                      ← Badge here
    📄 1103 - Cash      (no badge - no subsidiary)
```

---

## ✅ TEST COMPLETION CHECKLIST

### Core Functionality
- [ ] TEST 1: Subsidiary dropdown visible ⭐
- [ ] TEST 2: All 6 subsidiaries load ⭐
- [ ] TEST 3: Create without subsidiary works 🟢
- [ ] TEST 4: Create with subsidiary works ⭐
- [ ] TEST 5: Badge displays correctly ⭐
- [ ] TEST 6: Edit subsidiary works 🟢
- [ ] TEST 7: Remove subsidiary works 🟢

### Integration
- [ ] TEST 8: Filter integration works 🔵
- [ ] TEST 9: Multiple badges display 🟢
- [ ] TEST 10: Performance acceptable ⚡

### Total Tests: 10
- ⭐ Critical: 4 tests
- 🟢 Normal: 4 tests
- 🔵 Bonus: 1 test
- ⚡ Performance: 1 test

---

## 📊 TEST RESULTS TEMPLATE

```
=== PHASE 2C TEST RESULTS ===
Date: [Fill in date]
Tester: [Your name]
Browser: [Chrome/Firefox/Safari]
Environment: http://localhost:3000

TEST 1: Subsidiary Dropdown Visibility
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 2: Subsidiary Dropdown Options
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 3: Create Account WITHOUT Subsidiary
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 4: Create Account WITH Subsidiary
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 5: Subsidiary Badge Display
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 6: Edit Account - Change Subsidiary
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 7: Edit Account - Remove Subsidiary
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 8: Subsidiary Filter Integration
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 9: Multiple Badges Display
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

TEST 10: Performance Check
Status: [ ] PASS  [ ] FAIL
Notes: ________________________________

OVERALL RESULT: [X/10] PASSED
READY FOR PRODUCTION: [ ] YES  [ ] NO

Issues Found:
1. ________________________________
2. ________________________________

Recommendations:
1. ________________________________
2. ________________________________
```

---

## 🚀 TESTING WORKFLOW

### Quick Test (15 minutes)
1. Open app → Finance → Chart of Accounts
2. Click "Tambah Akun"
3. ✅ Check dropdown visible
4. ✅ Check 6 subsidiaries load
5. Create account with BSR
6. ✅ Check badge appears

### Full Test (45 minutes)
1. Run all 10 test cases
2. Fill test results template
3. Take screenshots
4. Document issues
5. Create bug tickets if needed

### Smoke Test (5 minutes)
1. Open form
2. Select subsidiary
3. Submit
4. See badge
5. ✅ Done

---

## 📞 SUPPORT

**If Tests Fail:**
1. Check docker containers: `docker-compose ps`
2. Check logs: `docker-compose logs frontend backend`
3. Check database: `docker exec -it nusantara-postgres psql -U nusantara_user nusantara_db`
4. Review implementation: `/CHART_OF_ACCOUNTS_PHASE_2C_ACCOUNT_FORM_SUBSIDIARY_COMPLETE.md`

**For Questions:**
- Frontend issues → Check browser console
- Backend issues → Check API logs
- Database issues → Check PostgreSQL logs

---

## ✨ SUCCESS CRITERIA

**Phase 2C is successful when:**
- ✅ All 10 tests pass
- ✅ No console errors
- ✅ Badges display correctly
- ✅ Performance acceptable
- ✅ User experience smooth
- ✅ Ready for production deployment

---

**Document Version:** 1.0  
**Last Updated:** 17 Oktober 2025  
**Status:** Ready for Testing  
**Estimated Test Time:** 15-45 minutes

---

**START TESTING:** http://localhost:3000 → Finance → Chart of Accounts 🚀
