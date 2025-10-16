# 🧪 Balance Validation Testing Guide

**Quick Reference untuk Testing Balance System**

---

## 📊 Current Account Balances

```
Bank BCA (1101.01)     : Rp 1.000.000.000
Bank BNI (1101.02)     : Rp 1.000.000.000
Bank BJB (1101.03)     : Rp   100.000.000
Bank Mandiri (1101.04) : Rp 1.000.000.000
Bank BRI (1101.05)     : Rp   100.000.000
Bank CIMB Niaga (1101.06): Rp   100.000.000
Kas Tunai (1101.07)    : Rp    10.000.000
Kas Kecil (1101.08)    : Rp    10.000.000
──────────────────────────────────────────
Total                  : Rp 3.430.000.000
```

---

## 🎯 Test Scenarios

### ✅ Test 1: Insufficient Balance (Should REJECT)

**Goal**: Verify system rejects transaction when balance insufficient

**Steps**:
1. Go to frontend milestone costs
2. Click "Tambah Biaya Baru"
3. Fill form:
   - Amount: **Rp 15.000.000**
   - Sumber Dana: **Kas Tunai (Saldo: Rp 10.000.000)**
   - Jenis Pengeluaran: Any expense account
4. Click Submit

**Expected Result**:
- ❌ **Transaction REJECTED**
- Error message: "Saldo tidak cukup! Saldo Kas Tunai: Rp 10.000.000, Dibutuhkan: Rp 15.000.000"
- Balance remains: **Rp 10.000.000**

**Verification**:
```bash
# Check balance unchanged
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT account_name, current_balance FROM chart_of_accounts WHERE account_code = '1101.07';"

# Expected: current_balance = 10000000.00 (unchanged)
```

---

### ✅ Test 2: Successful Transaction (Should ACCEPT)

**Goal**: Verify successful transaction with automatic balance deduction

**Steps**:
1. Go to frontend milestone costs
2. Click "Tambah Biaya Baru"
3. Fill form:
   - Amount: **Rp 5.000.000**
   - Sumber Dana: **Bank BCA (Saldo: Rp 1.000.000.000)**
   - Jenis Pengeluaran: Any expense account
   - Description: "Test successful transaction"
4. Click Submit

**Expected Result**:
- ✅ **Transaction ACCEPTED**
- Success message shown
- New cost entry appears in table
- Balance updated: **Rp 995.000.000** (1B - 5M)

**Verification**:
```bash
# Check balance deducted
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT account_name, current_balance FROM chart_of_accounts WHERE account_code = '1101.01';"

# Expected: current_balance = 995000000.00

# Check backend logs
docker logs --tail 20 nusantara-backend | grep "MilestoneCost"

# Expected: "[MilestoneCost] Deducted 5000000 from account COA-110101"
```

---

### ✅ Test 3: Update Amount (Same Account)

**Goal**: Verify balance adjustment when amount changes

**Prerequisites**: Complete Test 2 first (5M transaction from Bank BCA)

**Steps**:
1. Find the cost entry created in Test 2
2. Click Edit
3. Change amount from **Rp 5.000.000** to **Rp 8.000.000**
4. Keep same Sumber Dana (Bank BCA)
5. Click Save

**Expected Result**:
- ✅ **Update ACCEPTED**
- Balance calculation:
  - Restore old: 995M + 5M = 1,000M
  - Deduct new: 1,000M - 8M = 992M
- Final balance: **Rp 992.000.000**

**Verification**:
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT account_name, current_balance FROM chart_of_accounts WHERE account_code = '1101.01';"

# Expected: current_balance = 992000000.00

# Check logs
docker logs --tail 30 nusantara-backend | grep "MilestoneCost"

# Expected:
# "[MilestoneCost] Restored 5000000 to account COA-110101"
# "[MilestoneCost] Deducted 8000000 from account COA-110101"
```

---

### ✅ Test 4: Change Source Account

**Goal**: Verify balance restoration and deduction when source account changes

**Prerequisites**: Cost entry exists with 8M from Bank BCA

**Steps**:
1. Edit the same cost entry
2. Keep amount: **Rp 8.000.000**
3. Change Sumber Dana from **Bank BCA** to **Bank BNI**
4. Click Save

**Expected Result**:
- ✅ **Update ACCEPTED**
- Bank BCA: 992M + 8M = **1,000M** (restored)
- Bank BNI: 1,000M - 8M = **992M** (deducted)

**Verification**:
```bash
# Check both accounts
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT account_code, account_name, current_balance 
   FROM chart_of_accounts 
   WHERE account_code IN ('1101.01', '1101.02');"

# Expected:
# 1101.01 | Bank BCA     | 1000000000.00
# 1101.02 | Bank BNI     |  992000000.00
```

---

### ✅ Test 5: Delete Cost Entry

**Goal**: Verify balance restoration when cost entry deleted

**Prerequisites**: Cost entry exists with 8M from Bank BNI

**Steps**:
1. Find the cost entry
2. Click Delete
3. Confirm deletion

**Expected Result**:
- ✅ **Delete SUCCESSFUL**
- Cost entry marked as deleted (soft delete)
- Balance restored: **992M + 8M = 1,000M**
- Bank BNI back to original balance

**Verification**:
```bash
# Check balance restored
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT account_name, current_balance FROM chart_of_accounts WHERE account_code = '1101.02';"

# Expected: current_balance = 1000000000.00 (original balance)

# Check soft delete
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT id, description, amount, deleted_at FROM milestone_costs WHERE deleted_at IS NOT NULL LIMIT 5;"

# Expected: Shows deleted entry with deleted_at timestamp

# Check logs
docker logs --tail 20 nusantara-backend | grep "Restored"

# Expected: "[MilestoneCost] Restored 8000000 to account COA-110102 (deleted cost ...)"
```

---

## 🔍 Advanced Test Scenarios

### Test 6: Update with Insufficient Balance

**Scenario**: Increase amount but new account doesn't have enough balance

**Steps**:
1. Create cost: 5M from Bank BJB (balance: 100M)
2. Edit: Change to 150M (more than available)
3. Try to save

**Expected**:
- ❌ **Update REJECTED**
- Error: "Saldo tidak cukup! Saldo Bank BJB: Rp 100.000.000, Dibutuhkan: Rp 45.000.000"
  (System checks difference: 150M - 5M = 45M increase)

### Test 7: Change Source to Account with Insufficient Balance

**Scenario**: Change source account to one with insufficient balance

**Steps**:
1. Create cost: 50M from Bank BCA
2. Edit: Change source to Kas Tunai (balance: 10M)
3. Try to save

**Expected**:
- ❌ **Update REJECTED**
- Error: "Saldo tidak cukup! Saldo Kas Tunai: Rp 10.000.000, Dibutuhkan: Rp 50.000.000"

### Test 8: Multiple Operations Integrity

**Scenario**: Test balance integrity after multiple operations

**Steps**:
1. Create 5 cost entries from Bank BCA (10M each = 50M total)
2. Update 2 entries (increase amounts by 5M each = 10M more)
3. Delete 1 entry (restore 15M)
4. Verify final balance

**Expected**:
- Initial: 1,000M
- After creates: 1,000M - 50M = 950M
- After updates: 950M + 10M - 20M = 940M (restore old, deduct new)
- After delete: 940M + 15M = 955M
- **Final balance should be exactly 955M**

---

## 📋 Quick Verification Commands

### Check All Bank/Cash Balances
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT 
    account_code,
    account_name,
    TO_CHAR(current_balance, 'FM999,999,999,999') as saldo
   FROM chart_of_accounts 
   WHERE account_sub_type = 'CASH_AND_BANK'
   ORDER BY account_code;"
```

### Check Recent Cost Entries with Balances
```bash
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT 
    mc.description,
    mc.amount,
    sa.account_name as sumber_dana,
    sa.current_balance as saldo_sekarang,
    mc.created_at
   FROM milestone_costs mc
   LEFT JOIN chart_of_accounts sa ON mc.source_account_id = sa.id
   WHERE mc.deleted_at IS NULL
   ORDER BY mc.created_at DESC
   LIMIT 10;"
```

### Check Backend Logs for Balance Operations
```bash
docker logs --tail 50 nusantara-backend | grep -E "MilestoneCost|Deducted|Restored"
```

### Reset Test Account Balance (If Needed)
```bash
# Reset Bank BCA to 1 billion
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "UPDATE chart_of_accounts 
   SET current_balance = 1000000000.00 
   WHERE account_code = '1101.01';"
```

---

## 🚨 Common Issues & Solutions

### Issue 1: Balance Not Updating
**Symptom**: Transaction succeeds but balance unchanged

**Check**:
```bash
# Check if backend restarted after code changes
docker ps | grep nusantara-backend

# Check backend logs for errors
docker logs --tail 50 nusantara-backend
```

**Solution**: Restart backend
```bash
docker restart nusantara-backend
```

### Issue 2: Frontend Shows Stale Balance
**Symptom**: Old balance displayed in dropdown after transaction

**Solution**: 
- Refresh page
- Or implement auto-refresh in frontend after successful transaction

### Issue 3: Error "Account Not Found"
**Symptom**: Validation fails with "Invalid source account ID"

**Check**:
```bash
# Verify account exists and is active
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT id, account_code, account_name, is_active 
   FROM chart_of_accounts 
   WHERE id = 'COA-110101';"
```

### Issue 4: Negative Balance
**Symptom**: Balance becomes negative (should never happen)

**Root Cause**: Race condition or validation bypassed

**Verify**:
```bash
# Check for negative balances
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT account_code, account_name, current_balance 
   FROM chart_of_accounts 
   WHERE current_balance < 0;"
```

**Solution**: 
- Add database constraint: `CHECK (current_balance >= 0)`
- Implement row-level locking for concurrent transactions

---

## ✅ Test Completion Checklist

- [ ] Test 1: Insufficient balance rejection ✅
- [ ] Test 2: Successful transaction with deduction ✅
- [ ] Test 3: Update amount (same account) ✅
- [ ] Test 4: Change source account ✅
- [ ] Test 5: Delete with balance restoration ✅
- [ ] Test 6: Update with insufficient balance ✅
- [ ] Test 7: Change to account with insufficient balance ✅
- [ ] Test 8: Multiple operations integrity ✅
- [ ] All balances verified correct ✅
- [ ] Backend logs show proper tracking ✅
- [ ] No negative balances exist ✅
- [ ] Soft delete preserves audit trail ✅

---

## 📊 Expected Final State After All Tests

If you run all tests in order:

```
Initial State:
Bank BCA: 1,000,000,000
Bank BNI: 1,000,000,000
Kas Tunai: 10,000,000

After Test 1 (rejected):
Bank BCA: 1,000,000,000 (unchanged)
Kas Tunai: 10,000,000 (unchanged)

After Test 2 (5M from BCA):
Bank BCA: 995,000,000

After Test 3 (update to 8M):
Bank BCA: 992,000,000

After Test 4 (change to BNI):
Bank BCA: 1,000,000,000 (restored)
Bank BNI: 992,000,000 (deducted)

After Test 5 (delete):
Bank BNI: 1,000,000,000 (restored)

Final State:
All accounts back to original balances ✅
```

---

**Testing Status**: Ready to begin  
**Backend Status**: ✅ Running  
**Database Status**: ✅ Connected  

Start with Test 1! 🚀
