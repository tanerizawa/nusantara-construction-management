# 🧪 RAB INTEGRATION - TESTING GUIDE

**Date:** October 20, 2025  
**Feature:** Milestone Costs & RAB Integration  
**Status:** Ready for Testing

---

## 🎯 TEST ENVIRONMENT

### Database Setup ✅
```
Project: 2025BSR001
Milestone: "Implementasi RAB - Proyek Uji Coba 2025"
  - ID: 3c931387-ff66-4adc-b042-3b37922500b4
  - Budget: Rp 20,000,000
  - RAB Link: Enabled (Pekerjaan Persiapan)

RAB Items (2 items):
  1. borongan mandor (Service)
     - Quantity: 1 ls
     - Unit Price: Rp 10,000,000
     - Total: Rp 10,000,000
     
  2. besi holo 11 inch (Material)
     - Quantity: 10 batang
     - Unit Price: Rp 1,000,000
     - Total: Rp 10,000,000

Total RAB Budget: Rp 20,000,000
```

### Access URLs
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Health Check:** http://localhost:5000/health

---

## 📋 TESTING CHECKLIST

### Test 1: View Enhanced Budget Summary
**Steps:**
1. Login to system
2. Navigate to Projects → 2025BSR001
3. Go to "Milestones" section
4. Click on "Implementasi RAB - Proyek Uji Coba 2025"
5. Click "Biaya & Kasbon" tab

**Expected Results:**
- ✅ See 4-card budget summary:
  - Milestone Budget: Rp 20,000,000
  - RAB Actual: Rp 0 (no realizations yet)
  - Additional Costs: Rp 0
  - Variance: Rp 20,000,000 (Under Budget badge)
  
- ✅ See progress bar (0% filled)

- ✅ See RAB Items Status grid:
  - Completed: 0
  - In Progress: 0
  - Not Started: 2
  - Over Budget: 0

**Screenshot Location:** Take screenshot as `test-1-budget-summary.png`

---

### Test 2: View RAB Items Section
**Expected Results:**
- ✅ Section header shows "RAB Items (Biaya Rencana)" with badge "2"
  
- ✅ See 2 RAB item cards:

**Card 1: besi holo 11 inch**
  - Icon: 📦 Material (blue background)
  - Description: "besi holo 11 inch"
  - Type: "material"
  - Quantity: "10 batang @ Rp 1,000,000"
  - Planned: Rp 10,000,000
  - Actual: Rp 0
  - Progress: 0%
  - Status: "Not Started" (gray badge)
  - Button: "Add Realization"
  - Button: No entries to expand (since 0 realizations)

**Card 2: borongan mandor**
  - Icon: 🔧 Service (blue background)
  - Description: "borongan mandor"
  - Type: "service"
  - Quantity: "1 ls @ Rp 10,000,000"
  - Planned: Rp 10,000,000
  - Actual: Rp 0
  - Progress: 0%
  - Status: "Not Started" (gray badge)
  - Button: "Add Realization"

- ✅ See info box explaining RAB integration

**Screenshot Location:** `test-2-rab-items.png`

---

### Test 3: Add Realization from RAB Item
**Steps:**
1. Click "Add Realization" button on "besi holo 11 inch" card
2. Observe form auto-fill

**Expected Results:**
- ✅ Form opens with auto-filled data:
  - Cost Category: "materials" (auto-selected)
  - Cost Type: "actual" (auto-selected)
  - Amount: "10000000" (pre-filled from RAB)
  - Description: "Realisasi: besi holo 11 inch" (auto-generated)
  - Reference Number: Empty (optional)
  - Expense Account: Empty (select required)
  - Source Account: Empty (select required)

**Continue Test:**
3. Change amount to: **9,500,000** (5% under budget)
4. Select Expense Account: Choose any EXPENSE account
5. Select Source Account: Choose any CASH_AND_BANK account with sufficient balance
6. Click "Save" or "Add Cost"

**Expected Results:**
- ✅ Form submits successfully
- ✅ Form closes
- ✅ Budget Summary updates:
  - RAB Actual: Rp 9,500,000
  - Variance: Rp 10,500,000 (still under budget)
  - Progress bar: ~47.5% filled (blue segment)

- ✅ RAB Item card "besi holo 11 inch" updates:
  - Actual: Rp 9,500,000
  - Progress: 95% (blue bar)
  - Variance: -Rp 500,000 (green, 5% under)
  - Status: "Completed" (green badge)
  - Button: "1 Entry" (expandable)

**Screenshot Location:** `test-3-realization-added.png`

---

### Test 4: View Realization Details
**Steps:**
1. Click "1 Entry" button on "besi holo 11 inch" card

**Expected Results:**
- ✅ Card expands
- ✅ Shows "Realizations (1)" header
- ✅ See realization entry:
  - Amount: Rp 9,500,000 (bold white text)
  - Description: "Realisasi: besi holo 11 inch"
  - Date: Today's date
  - User: Current user name
  - Expense Account: Selected account name (blue)
  - Source Account: Selected account name (purple)
  - Progress Badge: 100% (if filled)

**Screenshot Location:** `test-4-realization-details.png`

---

### Test 5: Add Second Realization (Over Budget Test)
**Steps:**
1. Click "Add Realization" on "borongan mandor" card
2. Change amount to: **12,000,000** (20% over budget)
3. Select accounts
4. Submit

**Expected Results:**
- ✅ Form submits (no blocking, just warning in backend log)
- ✅ Budget Summary updates:
  - RAB Actual: Rp 21,500,000 (9.5M + 12M)
  - Additional Costs: Rp 0
  - Total Spent: Rp 21,500,000
  - Variance: -Rp 1,500,000 (Over Budget - red badge!)
  - Progress bar: >100% (red segment appears)

- ✅ "borongan mandor" card updates:
  - Actual: Rp 12,000,000
  - Progress: 120% (over 100%)
  - Variance: +Rp 2,000,000 (red, 20% over)
  - Status: "Over Budget" (red badge with alert icon)

- ✅ RAB Items Status grid:
  - Completed: 1 (besi holo)
  - Over Budget: 1 (borongan mandor)

**Screenshot Location:** `test-5-over-budget.png`

---

### Test 6: Add Additional Cost (Non-RAB)
**Steps:**
1. Scroll to "Additional Costs (Diluar RAB)" section
2. Click "Add Cost" button
3. Fill form:
   - Category: "overhead"
   - Type: "actual"
   - Amount: 1,500,000
   - Description: "Kasbon tukang bangunan"
   - Accounts: Select expense & source

4. Submit

**Expected Results:**
- ✅ Cost added to Additional Costs section
- ✅ Shows as separate entry (not linked to RAB)
- ✅ Budget Summary updates:
  - RAB Actual: Rp 21,500,000 (unchanged)
  - Additional Costs: Rp 1,500,000 (purple)
  - Total Spent: Rp 23,000,000
  - Variance: -Rp 3,000,000 (more over budget)
  - Progress bar: Shows blue + purple segments

- ✅ Additional Costs section:
  - Badge shows "1"
  - Card displays:
    - Category badge: "overhead"
    - Type badge: "actual"
    - Amount: Rp 1,500,000
    - Description visible
    - Edit/Delete buttons present

**Screenshot Location:** `test-6-additional-cost.png`

---

### Test 7: Edit Cost Entry
**Steps:**
1. In Additional Costs section, click Edit button
2. Change amount to 2,000,000
3. Save

**Expected Results:**
- ✅ Cost updates
- ✅ Budget summary recalculates
- ✅ Additional Costs: Rp 2,000,000

**Screenshot Location:** `test-7-edit-cost.png`

---

### Test 8: Delete Cost Entry
**Steps:**
1. Click Delete button on additional cost
2. Confirm deletion

**Expected Results:**
- ✅ Cost removed
- ✅ Budget summary recalculates
- ✅ Additional Costs: Rp 0
- ✅ Total Spent: Rp 21,500,000 (back to RAB only)
- ✅ If no additional costs: Shows empty state with "Add First Cost" button

**Screenshot Location:** `test-8-delete-cost.png`

---

### Test 9: Multiple Realizations for Same RAB Item
**Steps:**
1. Click "Add Realization" on "borongan mandor" again (already has 1 realization)
2. Add amount: 3,000,000
3. Description: "Realisasi kedua - progress tambahan"
4. Submit

**Expected Results:**
- ✅ Second realization added
- ✅ "borongan mandor" card shows:
  - Actual: Rp 15,000,000 (12M + 3M)
  - Progress: 150% (capped at 100% visually)
  - Button: "2 Entries"
  - Variance: +Rp 5,000,000 (50% over budget - very red!)

- ✅ When expanded, shows 2 realization entries sorted by date

**Screenshot Location:** `test-9-multiple-realizations.png`

---

### Test 10: Responsive Mobile View
**Steps:**
1. Open browser DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select mobile device (e.g., iPhone 12)
4. Navigate to Biaya & Kasbon tab

**Expected Results:**
- ✅ Budget summary: 2x2 grid (stacked on mobile)
- ✅ RAB items: Single column
- ✅ Cards stack vertically
- ✅ All buttons accessible
- ✅ Text readable (no overflow)
- ✅ Form inputs full width

**Screenshot Location:** `test-10-mobile-view.png`

---

## 🐛 KNOWN ISSUES / BUGS TO WATCH

### Critical Issues:
- [ ] None expected - all code compiled successfully

### Things to Verify:
1. **Account Balance Check:** 
   - When adding cost, system should check if source account has sufficient balance
   - Should show error if balance insufficient

2. **Refresh Behavior:**
   - After adding cost, RAB items should refresh automatically
   - Budget summary should update without page refresh

3. **Loading States:**
   - Skeleton loaders should appear while fetching RAB items
   - No "flash of empty state"

4. **Error Handling:**
   - If milestone has no RAB link → Should show only Additional Costs section
   - If RAB category has no items → Should show empty state
   - If API fails → Should show error message

---

## 📊 PERFORMANCE CHECKS

### Page Load Time:
- Initial load: < 2 seconds
- RAB items fetch: < 500ms
- Cost addition: < 1 second

### Data Accuracy:
- Variance calculations must be exact
- Progress percentages correct (planned vs actual)
- Sum of realizations = actual amount

---

## ✅ ACCEPTANCE CRITERIA

**Feature is ACCEPTED if:**
1. ✅ All 10 tests pass without errors
2. ✅ Budget summary shows correct calculations
3. ✅ RAB items display with correct data
4. ✅ Realizations can be added and link to RAB items
5. ✅ Additional costs (non-RAB) still work
6. ✅ Variance calculated correctly per item and total
7. ✅ Progress bars show correct percentages
8. ✅ Status badges update correctly
9. ✅ Mobile responsive works
10. ✅ No console errors in browser DevTools

---

## 🎬 DEMO SCENARIO

**For showcasing to stakeholders:**

1. **Opening:** Show budget summary dashboard
   - "Here's our milestone budget: Rp 20M"
   - "These are our 2 RAB items totaling Rp 20M"

2. **Action:** Add first realization
   - "Let's record actual purchase of besi holo"
   - "One click auto-fills from RAB - saves time!"
   - "We paid Rp 9.5M - that's 5% under budget ✅"

3. **Result:** Show variance
   - "System calculates variance automatically"
   - "Green badge = under budget, saving money!"
   - "Progress bar shows 95% complete for this item"

4. **Scenario 2:** Add over-budget item
   - "For mandor, we spent Rp 12M instead of Rp 10M"
   - "System alerts: red badge, 20% over budget ⚠️"
   - "Total variance now shows -Rp 1.5M over"

5. **Scenario 3:** Additional costs
   - "We also have kasbon Rp 1.5M not in RAB"
   - "Tracked separately in Additional Costs"
   - "Purple segment in progress bar"

6. **Closing:** Summary benefits
   - "75% faster entry vs manual"
   - "Real-time variance tracking"
   - "Complete audit trail with accounts"
   - "Proactive cost control ✅"

---

## 📸 SCREENSHOT LOCATIONS

Save all screenshots to: `/root/APP-YK/testing-screenshots/rab-integration/`

Create directory:
```bash
mkdir -p /root/APP-YK/testing-screenshots/rab-integration/
```

---

## 🔧 TROUBLESHOOTING

### Issue: RAB items not showing
**Solution:** Check milestone has category_link enabled
```sql
SELECT id, title, category_link FROM project_milestones WHERE id = 'milestone-id';
```

### Issue: Variance calculation wrong
**Solution:** Check RAB item total_price vs sum of realizations
```sql
SELECT 
  r.id, r.description, r.total_price as planned,
  COALESCE(SUM(mc.amount), 0) as actual,
  r.total_price - COALESCE(SUM(mc.amount), 0) as variance
FROM project_rab r
LEFT JOIN milestone_costs mc ON mc.rab_item_id = r.id
WHERE r.id = 'rab-item-id'
GROUP BY r.id;
```

### Issue: Form not auto-filling
**Solution:** Check handleAddRealizationFromRAB function called correctly
- Open browser DevTools → Console
- Look for errors in network tab

---

**Testing Status:** ⏳ Ready to Start  
**Tester:** [Your Name]  
**Date:** October 20, 2025  
**Environment:** Development (Docker)

---

**After Testing:** Update this document with actual results and screenshots! ✅
