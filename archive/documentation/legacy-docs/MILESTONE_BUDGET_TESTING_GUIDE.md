# 🧪 MILESTONE BUDGET FIX - TESTING GUIDE

## Overview
Kami telah memperbaiki masalah tampilan budget di milestone detail page. Sekarang perlu testing untuk verify fix dan debug mengapa budget tidak tersimpan ke database.

---

## 🎯 Test Objectives

1. ✅ Verify display fix untuk Budget section
2. 🔍 Debug mengapa budget = 0 di database
3. 🔍 Debug timestamp "7 hours ago" issue
4. ✅ Confirm no duplicate labels

---

## 📋 Testing Steps

### Test 1: Budget Display Fix

**Steps**:
1. Open browser → Navigate to project milestone page
2. Klik milestone "Proyek Uji coba 2" (yang sudah ada)
3. Lihat tab "Overview" bagian Budget

**Expected Results**:
- ✅ Label shows "Milestone Budget" (bukan "Planned Budget")
- ⚠️ Value mungkin masih Rp 0 (karena database budget = 0)
- ✅ Label shows "Actual Cost" (no duplicate)
- ✅ Label shows "Variance"
- ✅ NO "Contingency: Rp 0" row

**Screenshot Area**:
```
Budget:
  Milestone Budget: Rp 0 / Rp XXX.XXX.XXX  ← Check this section
  Actual Cost: Rp XXX.XXX.XXX
  
  Variance: Rp XXX.XXX.XXX
  XX%
```

---

### Test 2: Create New Milestone (DEBUG BUDGET)

**IMPORTANT**: Open Browser Console + Network Tab sebelum mulai!

**Steps**:

1. **Open DevTools**:
   - Press F12 atau Right Click → Inspect
   - Go to "Console" tab
   - Go to "Network" tab

2. **Click "Tambah Milestone Baru"**

3. **Fill Form**:
   ```
   Nama Milestone: Test Budget Save 2
   Target Tanggal: 2025-02-01
   Deskripsi: Testing budget persistence v2
   Budget (Rp): 75000000    ← CRITICAL: Type angka, lihat console
   Priority: Medium
   ```

4. **Before Submit - Check Console**:
   - Ketik nilai budget, tekan Enter atau Tab
   - Lihat apakah ada console log yang muncul
   - Screenshot jika ada log

5. **Click "Simpan Milestone"**

6. **Check Console Logs**:
   Look for these logs:
   ```
   [useMilestoneForm] Submitting milestone data: {
     title: "Test Budget Save 2",
     budget: 75000000,    ← Should be NUMBER, not string!
     ...
   }
   ```

7. **Check Network Tab**:
   - Find request: `POST /api/projects/{id}/milestones`
   - Click on it
   - Go to "Payload" tab
   - Look for:
     ```json
     {
       "title": "Test Budget Save 2",
       "budget": 75000000,
       ...
     }
     ```
   - **SCREENSHOT THIS PAYLOAD!**

8. **Check Response**:
   - Still in Network tab, go to "Response" tab
   - Look for:
     ```json
     {
       "success": true,
       "data": {
         "id": "xxx",
         "title": "Test Budget Save 2",
         "budget": "75000000.00",    ← Should NOT be "0.00"!
         ...
       }
     }
     ```
   - **SCREENSHOT THIS RESPONSE!**

9. **Verify in UI**:
   - After milestone created, klik milestone tersebut
   - Go to Overview tab
   - Check "Milestone Budget" value
   - Should show: Rp 75.000.000 (bukan Rp 0)

10. **Check Backend Logs**:
    ```bash
    docker logs nusantara-backend --tail 50
    ```
    Look for:
    ```
    [POST /milestones] Received request body: {...}
    [POST /milestones] Budget value: 75000000 Type: number
    [POST /milestones] Validated value: {...}
    [POST /milestones] Validated budget: 75000000 Type: number
    [POST /milestones] Created milestone: {...}
    ```
    - **SCREENSHOT THESE LOGS!**

---

### Test 3: Verify Database Value

**Steps**:
```bash
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, title, budget, status, created_at FROM project_milestones WHERE title LIKE '%Test Budget%' ORDER BY created_at DESC;"
```

**Expected Result**:
```
                  id                  |       title        |   budget   |   status    |         created_at
--------------------------------------+--------------------+------------+-------------+----------------------------
 xxx-xxx-xxx                          | Test Budget Save 2 | 75000000.00| pending     | 2025-01-14 02:35:00+07
```

**If budget = 0.00**:
- ❌ Problem: Data tidak tersimpan ke database
- Check backend logs untuk error
- Check Joi validation error

**If budget = 75000000.00**:
- ✅ Success! Budget tersimpan dengan benar
- Display issue was just from old data

---

### Test 4: Update Existing Milestone Budget

**Purpose**: Fix old milestone yang budget = 0

**Steps**:

1. **Via SQL** (Quick Fix):
   ```sql
   docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c \
     "UPDATE project_milestones SET budget = 50000000 WHERE title = 'Proyek Uji coba 2';"
   ```

2. **Verify Update**:
   ```sql
   docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c \
     "SELECT id, title, budget FROM project_milestones WHERE title = 'Proyek Uji coba 2';"
   ```

3. **Refresh Browser**:
   - Reload milestone detail page
   - Check if "Milestone Budget" now shows Rp 50.000.000

---

### Test 5: Timestamp Debug

**Steps**:

1. Create new milestone (use Test 2 steps)
2. Immediately after creation, klik milestone tersebut
3. Go to "Activity" tab
4. Check timestamp of first activity (milestone created)

**Expected**:
- Should show "Just now" atau "A few seconds ago"
- NOT "7 hours ago"

**If shows wrong time**:
- Check browser console for timestamp logs
- Compare:
  - Server time: `docker exec nusantara-backend date`
  - Client time: Open console, run `new Date()`
  - Database time: Check `created_at` field

---

## 🔍 Debugging Checklist

### If Budget Still Shows Rp 0:

**Check List**:
- [ ] Console log shows budget value? (Frontend issue)
- [ ] Network payload includes budget? (Frontend → Backend issue)
- [ ] Backend log shows budget received? (Backend parsing issue)
- [ ] Backend log shows validation passed? (Joi validation issue)
- [ ] Database shows budget value? (Database save issue)
- [ ] Response includes budget? (Serialization issue)

### If Input Field Doesn't Work:

**Try**:
1. Change input type from `number` to `text`
2. Add onBlur handler
3. Check if onChange fires (add console.log)
4. Test with different browsers

### If Joi Validation Fails:

**Check**:
- Schema allows number type? ✅ Yes: `Joi.number().min(0).optional()`
- Value is number not string? Check type in log
- Value is not negative? Budget >= 0

---

## 📊 Expected Outcomes

### Success Criteria:

1. ✅ **Display Fix**:
   - "Milestone Budget" label correct
   - No duplicate labels
   - No "Contingency: Rp 0" row

2. ✅ **Budget Save**:
   - Console log shows correct budget value
   - Network payload includes budget
   - Backend log confirms received
   - Database stores correct value
   - Response returns correct value
   - UI displays correct value after refresh

3. ✅ **Timestamp Fix**:
   - New milestone shows "Just now"
   - Not showing old timestamp

### Failure Scenarios:

1. ❌ **Budget = 0 in Database**:
   - Need to check input field onChange
   - May need to change parsing logic
   - Check if Joi converts string to number

2. ❌ **Budget in Request but Not in DB**:
   - Check database constraints
   - Check Sequelize model definition
   - Check if column exists: `budget numeric(15,2)`

3. ❌ **No Budget in Request Payload**:
   - Frontend form state not updating
   - Check useMilestoneForm hook
   - Check input field onChange handler

---

## 🚀 Quick Commands Reference

```bash
# Check database values
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction \
  -c "SELECT id, title, budget, status FROM project_milestones ORDER BY created_at DESC LIMIT 3;"

# Check backend logs
docker logs nusantara-backend --tail 50 | grep -A 10 "POST /milestones"

# Update old milestone budget
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction \
  -c "UPDATE project_milestones SET budget = 50000000 WHERE title = 'Proyek Uji coba 2';"

# Check server time
docker exec nusantara-backend date

# Restart services if needed
docker restart nusantara-backend nusantara-frontend
```

---

## 📝 Report Template

Setelah testing, mohon report dengan format:

```
## Test Results - [Date]

### Test 1: Display Fix
Status: [✅ Success / ❌ Failed]
- Milestone Budget label: [✅/❌]
- No duplicate labels: [✅/❌]
- No Contingency row: [✅/❌]
Screenshot: [attach if needed]

### Test 2: Budget Save
Status: [✅ Success / ❌ Failed]
- Console log budget value: [number / string / undefined]
- Network payload includes budget: [Yes / No / Value: XXX]
- Backend log shows received: [Yes / No]
- Database has correct value: [Yes / No / Value: XXX]
- UI displays correctly: [Yes / No]
Screenshots: [attach payload, response, logs]

### Test 3: Database Verification
Query Result:
```sql
-- Paste query result here
```

### Test 4: Timestamp
Status: [✅ Success / ❌ Failed]
New milestone shows: ["Just now" / "X hours ago"]

### Issues Found:
1. [Describe any issues]

### Additional Notes:
[Any other observations]
```

---

**Created**: 2025-01-14 02:35 WIB
**Last Updated**: 2025-01-14 02:35 WIB
**Status**: Ready for Testing

**Next**: Please run tests and report results! 🚀
