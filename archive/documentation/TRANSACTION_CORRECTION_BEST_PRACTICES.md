# 📋 Best Practice: Koreksi Kesalahan Transaksi Akuntansi

**Date:** October 20, 2025  
**Topic:** Transaction Correction & Error Handling in Accounting Systems  
**Standards:** PSAK, IFRS, International Accounting Standards

---

## 🎯 Pertanyaan Kunci

> **"Jika ada kesalahan input data transaksi, apakah EDIT atau HAPUS transaksi?"**

**Jawaban:** Tergantung **STATUS** transaksi!

---

## 📊 Best Practice Matrix

| Status Transaksi | EDIT? | DELETE? | Cara yang Benar |
|-----------------|-------|---------|-----------------|
| **DRAFT** | ✅ YA | ✅ YA | Boleh edit/delete freely |
| **PENDING** | ✅ YA | ✅ YA | Belum masuk pembukuan |
| **APPROVED** | ❌ TIDAK | ❌ TIDAK | Gunakan **VOID** |
| **POSTED** | ❌ TIDAK | ❌ TIDAK | Gunakan **REVERSAL** |

---

## 🏢 Standar Internasional

### 1. PSAK (Standar Akuntansi Indonesia)

**PSAK 25: Kebijakan Akuntansi, Perubahan Estimasi, dan Kesalahan**

```
Prinsip Utama:
✅ Kesalahan material HARUS dikoreksi
✅ Koreksi dilakukan dengan jurnal pembalik (reversal)
❌ TIDAK BOLEH menghapus transaksi yang sudah di-posting
❌ TIDAK BOLEH mengubah transaksi historis
```

**Alasan:**
- Audit trail harus **lengkap dan tidak terputus**
- Setiap perubahan harus **terekam dan terlacak**
- Memenuhi persyaratan **audit dan regulasi**

### 2. IFRS (International Financial Reporting Standards)

**IAS 8: Accounting Policies, Changes in Estimates and Errors**

```
Requirements:
- Prior period errors are corrected RETROSPECTIVELY
- Original entries are PRESERVED
- Correction entries are CLEARLY MARKED
- Disclosure of correction is REQUIRED
```

### 3. GAAP (Generally Accepted Accounting Principles)

```
Golden Rule:
"Once posted, never delete or modify. Always reverse and re-enter."
```

---

## 🔐 Audit & Compliance Requirements

### Kenapa Tidak Boleh Edit/Delete Transaksi Posted?

#### 1. **Audit Trail Integrity**
```
❌ SALAH (Edit langsung):
Before: Transaksi Rp 100 juta ke Supplier A
After:  Transaksi Rp 50 juta ke Supplier B
Result: TIDAK ADA JEJAK perubahan terjadi kapan, siapa, mengapa
```

```
✅ BENAR (Reversal):
Original: Transaksi Rp 100 juta ke Supplier A (kept)
Reversal: -Rp 100 juta (reverse original)
New:      Transaksi Rp 50 juta ke Supplier B (correct entry)
Result:   JELAS ada koreksi, lengkap dengan audit trail
```

#### 2. **Regulatory Compliance**
- **OJK (Otoritas Jasa Keuangan):** Wajib audit trail
- **DJP (Direktorat Jenderal Pajak):** Laporan harus konsisten
- **BPK (Badan Pemeriksa Keuangan):** Transaksi tidak boleh hilang

#### 3. **Internal Control**
- Mencegah fraud (penghapusan transaksi mencurigakan)
- Traceability (bisa lacak semua perubahan)
- Accountability (siapa yang koreksi, kapan, mengapa)

---

## 🔄 Transaction Status Lifecycle

### Diagram Status Flow

```
┌──────────┐
│  DRAFT   │ ← Baru dibuat, belum final
└────┬─────┘
     │ Submit
     ↓
┌──────────┐
│ PENDING  │ ← Menunggu approval
└────┬─────┘
     │ Approve
     ↓
┌──────────┐
│ APPROVED │ ← Sudah disetujui
└────┬─────┘
     │ Post to Ledger
     ↓
┌──────────┐
│  POSTED  │ ← Sudah masuk buku besar (IMMUTABLE)
└────┬─────┘
     │
     ├─ Void (batalkan) → [VOIDED]
     └─ Reverse (koreksi) → [REVERSED] + New Transaction
```

### Status Rules

#### **DRAFT**
```
Description: Transaksi baru dibuat, belum final
Allowed Actions:
  ✅ EDIT - Ubah nilai, akun, deskripsi, dll
  ✅ DELETE - Hapus sepenuhnya
  ✅ SUBMIT - Kirim untuk approval
```

#### **PENDING**
```
Description: Menunggu approval dari atasan/finance manager
Allowed Actions:
  ✅ EDIT - Masih bisa diubah sebelum diapprove
  ✅ DELETE - Bisa dibatalkan
  ✅ APPROVE - Finance manager setujui
  ✅ REJECT - Finance manager tolak (kembali ke DRAFT)
```

#### **APPROVED**
```
Description: Sudah disetujui, siap di-post
Allowed Actions:
  ❌ EDIT - TIDAK BOLEH
  ❌ DELETE - TIDAK BOLEH
  ✅ POST - Post ke buku besar
  ✅ VOID - Batalkan (dengan jejak)
```

#### **POSTED**
```
Description: Sudah masuk buku besar, mempengaruhi balance
Allowed Actions:
  ❌ EDIT - TIDAK BOLEH
  ❌ DELETE - TIDAK BOLEH
  ✅ VOID - Batalkan (balance dikembalikan)
  ✅ REVERSE - Balik + buat transaksi baru yang benar
```

#### **VOIDED**
```
Description: Dibatalkan, balance sudah dikembalikan
Properties:
  - Original transaction TETAP ADA
  - Balance effect = 0
  - Tidak muncul di laporan (kecuali audit trail)
  - Void date, void by, void reason TEREKAM
```

#### **REVERSED**
```
Description: Dibalik karena ada kesalahan, sudah dibuat koreksi
Properties:
  - Original transaction TETAP ADA
  - Reversal entry dibuat (opposite)
  - New correct transaction dibuat
  - Link antara original-reversal-new TEREKAM
```

---

## 🛠️ Implementation Guide

### Database Schema Addition

```sql
-- Add status field to finance_transactions
ALTER TABLE finance_transactions 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT';

-- Add reversal tracking fields
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS is_reversed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS reversed_by_transaction_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS reversal_of_transaction_id VARCHAR(50),
ADD COLUMN IF NOT EXISTS void_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS void_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS void_reason TEXT;

-- Add approval tracking
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS submitted_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(50),
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- Add indexes
CREATE INDEX idx_finance_transactions_status ON finance_transactions(status);
CREATE INDEX idx_finance_transactions_reversed ON finance_transactions(is_reversed);
```

### Backend API Endpoints

#### 1. **POST /api/finance/transactions** (Create DRAFT)
```javascript
// Create new transaction in DRAFT status
router.post('/transactions', async (req, res) => {
  const transaction = await FinanceTransaction.create({
    ...req.body,
    status: 'DRAFT',
    created_by: req.user.id
  });
  res.json({ success: true, data: transaction });
});
```

#### 2. **PUT /api/finance/transactions/:id** (Edit DRAFT/PENDING only)
```javascript
router.put('/transactions/:id', async (req, res) => {
  const transaction = await FinanceTransaction.findByPk(req.params.id);
  
  // Validasi: Hanya DRAFT atau PENDING yang bisa diedit
  if (!['DRAFT', 'PENDING'].includes(transaction.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot edit transaction with status: ' + transaction.status,
      hint: 'Use VOID or REVERSAL for posted transactions'
    });
  }
  
  await transaction.update(req.body);
  res.json({ success: true, data: transaction });
});
```

#### 3. **DELETE /api/finance/transactions/:id** (Delete DRAFT/PENDING only)
```javascript
router.delete('/transactions/:id', async (req, res) => {
  const transaction = await FinanceTransaction.findByPk(req.params.id);
  
  // Validasi: Hanya DRAFT atau PENDING yang bisa dihapus
  if (!['DRAFT', 'PENDING'].includes(transaction.status)) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete transaction with status: ' + transaction.status,
      hint: 'Use VOID for posted transactions'
    });
  }
  
  await transaction.destroy();
  res.json({ success: true, message: 'Transaction deleted' });
});
```

#### 4. **POST /api/finance/transactions/:id/submit** (Submit for Approval)
```javascript
router.post('/transactions/:id/submit', async (req, res) => {
  const transaction = await FinanceTransaction.findByPk(req.params.id);
  
  if (transaction.status !== 'DRAFT') {
    return res.status(400).json({
      success: false,
      message: 'Only DRAFT transactions can be submitted'
    });
  }
  
  await transaction.update({
    status: 'PENDING',
    submitted_at: new Date(),
    submitted_by: req.user.id
  });
  
  // TODO: Send notification to finance manager
  
  res.json({ success: true, data: transaction });
});
```

#### 5. **POST /api/finance/transactions/:id/approve** (Approve & Post)
```javascript
router.post('/transactions/:id/approve', async (req, res) => {
  // Hanya finance manager yang bisa approve
  if (!req.user.permissions.includes('approve_transactions')) {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized: Only finance manager can approve'
    });
  }
  
  const transaction = await FinanceTransaction.findByPk(req.params.id);
  
  if (transaction.status !== 'PENDING') {
    return res.status(400).json({
      success: false,
      message: 'Only PENDING transactions can be approved'
    });
  }
  
  // Start database transaction
  const t = await sequelize.transaction();
  
  try {
    // Update transaction status
    await transaction.update({
      status: 'POSTED',  // Langsung POSTED setelah approve
      approved_at: new Date(),
      approved_by: req.user.id,
      approval_notes: req.body.notes
    }, { transaction: t });
    
    // Update account balances
    await updateAccountBalances(transaction, t);
    
    // Create audit log
    await AuditLog.create({
      action: 'APPROVE_TRANSACTION',
      entity_type: 'FinanceTransaction',
      entity_id: transaction.id,
      user_id: req.user.id,
      changes: { status: 'PENDING → POSTED' }
    }, { transaction: t });
    
    await t.commit();
    res.json({ success: true, data: transaction });
    
  } catch (error) {
    await t.rollback();
    throw error;
  }
});
```

#### 6. **POST /api/finance/transactions/:id/void** (Void Posted Transaction)
```javascript
router.post('/transactions/:id/void', async (req, res) => {
  const { reason } = req.body;
  
  if (!reason) {
    return res.status(400).json({
      success: false,
      message: 'Void reason is required'
    });
  }
  
  const transaction = await FinanceTransaction.findByPk(req.params.id);
  
  if (!['APPROVED', 'POSTED'].includes(transaction.status)) {
    return res.status(400).json({
      success: false,
      message: 'Only APPROVED/POSTED transactions can be voided'
    });
  }
  
  if (transaction.status === 'VOIDED') {
    return res.status(400).json({
      success: false,
      message: 'Transaction already voided'
    });
  }
  
  const t = await sequelize.transaction();
  
  try {
    // Reverse account balances
    await reverseAccountBalances(transaction, t);
    
    // Update transaction status
    await transaction.update({
      status: 'VOIDED',
      void_date: new Date(),
      void_by: req.user.id,
      void_reason: reason
    }, { transaction: t });
    
    // Create audit log
    await AuditLog.create({
      action: 'VOID_TRANSACTION',
      entity_type: 'FinanceTransaction',
      entity_id: transaction.id,
      user_id: req.user.id,
      changes: { 
        status: 'POSTED → VOIDED',
        reason: reason
      }
    }, { transaction: t });
    
    await t.commit();
    res.json({ 
      success: true, 
      message: 'Transaction voided successfully',
      data: transaction 
    });
    
  } catch (error) {
    await t.rollback();
    throw error;
  }
});
```

#### 7. **POST /api/finance/transactions/:id/reverse** (Reverse & Create New)
```javascript
router.post('/transactions/:id/reverse', async (req, res) => {
  const { reason, newTransactionData } = req.body;
  
  if (!reason || !newTransactionData) {
    return res.status(400).json({
      success: false,
      message: 'Reversal reason and new transaction data required'
    });
  }
  
  const originalTransaction = await FinanceTransaction.findByPk(req.params.id);
  
  if (originalTransaction.status !== 'POSTED') {
    return res.status(400).json({
      success: false,
      message: 'Only POSTED transactions can be reversed'
    });
  }
  
  if (originalTransaction.is_reversed) {
    return res.status(400).json({
      success: false,
      message: 'Transaction already reversed'
    });
  }
  
  const t = await sequelize.transaction();
  
  try {
    // 1. Create reversal entry (opposite of original)
    const reversalTransaction = await FinanceTransaction.create({
      type: originalTransaction.type,
      category: originalTransaction.category,
      amount: originalTransaction.amount,
      // Swap debit/credit or from/to
      account_from: originalTransaction.account_to,
      account_to: originalTransaction.account_from,
      description: `REVERSAL: ${originalTransaction.description} (Reason: ${reason})`,
      date: new Date(),
      status: 'POSTED',
      reversal_of_transaction_id: originalTransaction.id,
      created_by: req.user.id
    }, { transaction: t });
    
    // Update balances for reversal
    await updateAccountBalances(reversalTransaction, t);
    
    // 2. Mark original as reversed
    await originalTransaction.update({
      is_reversed: true,
      reversed_by_transaction_id: reversalTransaction.id
    }, { transaction: t });
    
    // 3. Create new correct transaction
    const newTransaction = await FinanceTransaction.create({
      ...newTransactionData,
      status: 'POSTED',
      description: `CORRECTED: ${newTransactionData.description} (Original: ${originalTransaction.id})`,
      created_by: req.user.id
    }, { transaction: t });
    
    // Update balances for new transaction
    await updateAccountBalances(newTransaction, t);
    
    // 4. Create audit log
    await AuditLog.create({
      action: 'REVERSE_TRANSACTION',
      entity_type: 'FinanceTransaction',
      entity_id: originalTransaction.id,
      user_id: req.user.id,
      changes: {
        original_id: originalTransaction.id,
        reversal_id: reversalTransaction.id,
        new_transaction_id: newTransaction.id,
        reason: reason
      }
    }, { transaction: t });
    
    await t.commit();
    
    res.json({
      success: true,
      message: 'Transaction reversed and corrected',
      data: {
        original: originalTransaction,
        reversal: reversalTransaction,
        corrected: newTransaction
      }
    });
    
  } catch (error) {
    await t.rollback();
    throw error;
  }
});
```

---

## 📋 Real-World Examples

### Example 1: Edit DRAFT Transaction (✅ ALLOWED)

**Scenario:** User baru input transaksi tapi salah jumlah, masih draft

```javascript
// Original (DRAFT)
{
  id: 'FIN-0001',
  type: 'EXPENSE',
  amount: 10000000,  // ❌ Salah, seharusnya 15 juta
  account_to: 'COA-5101',
  status: 'DRAFT'
}

// Action: EDIT langsung
PUT /api/finance/transactions/FIN-0001
{
  amount: 15000000  // ✅ Update langsung, no problem
}

// Result:
{
  id: 'FIN-0001',
  type: 'EXPENSE',
  amount: 15000000,  // ✅ Fixed
  status: 'DRAFT'
}
```

**Kesimpulan:** ✅ BOLEH edit karena masih DRAFT (belum masuk pembukuan)

---

### Example 2: Delete PENDING Transaction (✅ ALLOWED)

**Scenario:** Transaksi sudah disubmit tapi ternyata salah semua, mau hapus

```javascript
// Existing (PENDING)
{
  id: 'FIN-0002',
  type: 'INCOME',
  amount: 50000000,
  status: 'PENDING',  // Menunggu approval
  submitted_at: '2025-10-20T10:00:00'
}

// Action: DELETE
DELETE /api/finance/transactions/FIN-0002

// Result: Transaction deleted (no trace needed karena belum POSTED)
```

**Kesimpulan:** ✅ BOLEH hapus karena masih PENDING (belum approved & posted)

---

### Example 3: Void POSTED Transaction (✅ CORRECT)

**Scenario:** Transaksi sudah di-post, ternyata salah total (harus dibatalkan)

```javascript
// Original (POSTED)
{
  id: 'FIN-0003',
  type: 'EXPENSE',
  amount: 20000000,
  account_from: 'COA-1101-02',  // Bank
  account_to: 'COA-5101',       // Beban Material
  status: 'POSTED',
  date: '2025-10-15'
}

// Bank balance affected: -Rp 20 juta

// ❌ WRONG: Edit or Delete
PUT /api/finance/transactions/FIN-0003  // ERROR: Cannot edit POSTED
DELETE /api/finance/transactions/FIN-0003  // ERROR: Cannot delete POSTED

// ✅ CORRECT: VOID
POST /api/finance/transactions/FIN-0003/void
{
  reason: 'Transaksi duplikat, sudah dibayar sebelumnya'
}

// Result:
{
  id: 'FIN-0003',
  status: 'VOIDED',
  void_date: '2025-10-20',
  void_by: 'USER-123',
  void_reason: 'Transaksi duplikat, sudah dibayar sebelumnya'
}

// Bank balance restored: +Rp 20 juta (back to original)
```

**Kesimpulan:** ✅ VOID untuk membatalkan transaksi yang sudah posted

---

### Example 4: Reverse POSTED Transaction (✅ CORRECT)

**Scenario:** Transaksi sudah di-post, tapi salah jumlah (perlu koreksi)

```javascript
// Original (POSTED) - SALAH
{
  id: 'FIN-0004',
  type: 'EXPENSE',
  amount: 50000000,  // ❌ Seharusnya 30 juta
  account_from: 'COA-1101-02',  // Bank
  account_to: 'COA-5101',       // Beban Material
  status: 'POSTED',
  description: 'Pembelian besi'
}

// Bank balance: -Rp 50 juta

// ✅ CORRECT: REVERSE + Create New
POST /api/finance/transactions/FIN-0004/reverse
{
  reason: 'Salah input jumlah, seharusnya 30 juta',
  newTransactionData: {
    type: 'EXPENSE',
    amount: 30000000,  // ✅ Jumlah yang benar
    account_from: 'COA-1101-02',
    account_to: 'COA-5101',
    description: 'Pembelian besi'
  }
}

// Result: 3 transactions created/updated
// 1. Original (marked as reversed)
{
  id: 'FIN-0004',
  status: 'POSTED',
  is_reversed: true,
  reversed_by_transaction_id: 'FIN-0005'
}

// 2. Reversal entry (balance dikembalikan)
{
  id: 'FIN-0005',
  amount: 50000000,
  account_from: 'COA-5101',  // ← REVERSED
  account_to: 'COA-1101-02',  // ← REVERSED
  status: 'POSTED',
  reversal_of_transaction_id: 'FIN-0004',
  description: 'REVERSAL: Pembelian besi (Reason: Salah input jumlah)'
}
// Bank balance: +Rp 50 juta (net = 0)

// 3. New correct transaction
{
  id: 'FIN-0006',
  amount: 30000000,  // ✅ Benar
  account_from: 'COA-1101-02',
  account_to: 'COA-5101',
  status: 'POSTED',
  description: 'CORRECTED: Pembelian besi (Original: FIN-0004)'
}
// Bank balance: -Rp 30 juta (net total = -Rp 30 juta ✅)
```

**Final Balance:**
```
Original:  -Rp 50 juta
Reversal:  +Rp 50 juta
Corrected: -Rp 30 juta
─────────────────────────
Net:       -Rp 30 juta ✅ (BENAR)
```

**Audit Trail:**
```
FIN-0004: Original transaction (reversed)
  ↓ reversed by
FIN-0005: Reversal entry
  ↓ corrected with
FIN-0006: New correct transaction
```

**Kesimpulan:** ✅ REVERSE untuk koreksi transaksi yang sudah posted

---

## 📊 Comparison: Edit vs Void vs Reverse

| Aspect | EDIT | VOID | REVERSE |
|--------|------|------|---------|
| **When to Use** | DRAFT/PENDING | Batalkan seluruhnya | Koreksi jumlah/akun |
| **Original Kept?** | No (replaced) | Yes (marked voided) | Yes (marked reversed) |
| **Balance Effect** | Direct update | Reversed to 0 | Reversed + new |
| **Audit Trail** | Limited | Full | Full + linked |
| **Use Case** | Belum final | Duplikat, salah total | Salah jumlah/akun |
| **Result** | 1 transaction | 1 transaction (voided) | 3 transactions (original + reversal + new) |

---

## 🚨 Common Mistakes & Solutions

### ❌ Mistake 1: Edit Posted Transaction Directly
```javascript
// WRONG
const transaction = await FinanceTransaction.findByPk(id);
transaction.amount = 30000000;  // ❌ Audit trail hilang!
await transaction.save();
```

```javascript
// CORRECT
// Gunakan REVERSE endpoint
POST /api/finance/transactions/{id}/reverse
```

### ❌ Mistake 2: Delete Posted Transaction
```javascript
// WRONG
await FinanceTransaction.destroy({ where: { id } });  // ❌ Ilegal!
```

```javascript
// CORRECT
// Gunakan VOID endpoint
POST /api/finance/transactions/{id}/void
```

### ❌ Mistake 3: No Reason for Void/Reverse
```javascript
// WRONG
await transaction.void();  // ❌ Tidak ada alasan koreksi
```

```javascript
// CORRECT
await transaction.void({
  reason: 'Transaksi duplikat',
  voided_by: user.id
});
```

---

## 🎯 Implementation Checklist

### Phase 1: Add Status Field ✅
- [ ] Add `status` column to finance_transactions
- [ ] Add status validation in backend
- [ ] Update frontend to show status badge
- [ ] Add status filter in transaction list

### Phase 2: Edit/Delete Validation ✅
- [ ] Block edit for APPROVED/POSTED status
- [ ] Block delete for APPROVED/POSTED status
- [ ] Show appropriate error messages
- [ ] Add "Cannot edit, please VOID" hints

### Phase 3: Approval Workflow ✅
- [ ] Add submit for approval button
- [ ] Add approval page for finance manager
- [ ] Send notification when pending approval
- [ ] Post to ledger after approval

### Phase 4: Void Functionality ✅
- [ ] Create VOID endpoint
- [ ] Add void reason input form
- [ ] Reverse account balances
- [ ] Update audit log
- [ ] Show voided transactions with strikethrough

### Phase 5: Reversal Functionality ✅
- [ ] Create REVERSE endpoint
- [ ] Build reversal + new transaction form
- [ ] Link original-reversal-new transactions
- [ ] Show reversal chain in UI
- [ ] Update audit log with full chain

### Phase 6: Reporting & Audit ✅
- [ ] Show transaction history with reversals
- [ ] Add "Show Voided" filter option
- [ ] Create audit trail report
- [ ] Add reversal chain visualization
- [ ] Export audit log to Excel/PDF

---

## 📱 UI/UX Recommendations

### Transaction List View
```
┌─────────────────────────────────────────────────────────────┐
│ Finance Transactions                        [+ New] [Filter] │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│ FIN-0001  2025-10-20  INCOME   Rp 100M  [DRAFT]    [Edit]  │
│                       Pendapatan proyek                       │
│                                                               │
│ FIN-0002  2025-10-19  EXPENSE  Rp 50M   [PENDING]  [View]  │
│                       Pembelian material                      │
│                                       Waiting for approval    │
│                                                               │
│ FIN-0003  2025-10-18  EXPENSE  Rp 30M   [POSTED]   [Void]  │
│                       Beban operasional                       │
│                                                               │
│ FIN-0004  2025-10-17  EXPENSE  Rp 50M   [REVERSED] [View]  │
│                       Pembelian besi                          │
│                       ↓ reversed by FIN-0005                  │
│                       ↓ corrected with FIN-0006               │
│                                                               │
│ FIN-0005  2025-10-17  EXPENSE -Rp 50M   [POSTED]   [Info]  │
│                       REVERSAL: Pembelian besi                │
│                       ↑ reversal of FIN-0004                  │
│                                                               │
│ FIN-0006  2025-10-17  EXPENSE  Rp 30M   [POSTED]   [Void]  │
│                       CORRECTED: Pembelian besi               │
│                       ↑ correction of FIN-0004                │
│                                                               │
│ FIN-0007  2025-10-16  INCOME   Rp 20M   [VOIDED]   [Info]  │
│                       Pendapatan lain                         │
│                       Voided: Transaksi duplikat              │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Status Badges
```css
DRAFT    → Gray badge, blinking cursor
PENDING  → Yellow badge, clock icon
POSTED   → Green badge, checkmark icon
VOIDED   → Red badge, X icon, strikethrough text
REVERSED → Orange badge, refresh icon, link icon
```

### Action Buttons based on Status
```
DRAFT    → [Edit] [Delete] [Submit]
PENDING  → [View] [Recall] [Approve if manager]
POSTED   → [View] [Void] [Reverse]
VOIDED   → [View] [Info]
REVERSED → [View] [Show Chain]
```

---

## 🎓 Summary: Best Practice Rules

### ✅ DO:

1. **Use status field** (DRAFT → PENDING → POSTED)
2. **Allow edit/delete** only for DRAFT/PENDING
3. **Use VOID** untuk membatalkan transaksi posted
4. **Use REVERSE** untuk mengoreksi transaksi posted
5. **Keep audit trail** lengkap untuk semua perubahan
6. **Require reason** untuk setiap void/reversal
7. **Link transactions** (original-reversal-new)
8. **Show all transactions** (including voided, dengan filter)

### ❌ DON'T:

1. **DON'T edit** transaksi yang sudah POSTED
2. **DON'T delete** transaksi yang sudah POSTED
3. **DON'T hide** voided/reversed transactions
4. **DON'T allow** void/reverse tanpa alasan
5. **DON'T break** audit trail chain
6. **DON'T modify** historical data directly
7. **DON'T skip** approval workflow untuk transaksi besar
8. **DON'T forget** to update account balances

---

## 📚 References

1. **PSAK 25:** Kebijakan Akuntansi, Perubahan Estimasi, dan Kesalahan
2. **IAS 8:** Accounting Policies, Changes in Accounting Estimates and Errors
3. **SAP FICO:** Document Reversal Best Practices
4. **Oracle Financials:** Journal Entry Reversal Guide
5. **Accounting Information Systems (Romney & Steinbart):** Chapter 6 - Transaction Processing

---

## 📞 Contact & Support

**Implementation Questions:** Contact dev team  
**Accounting Policy Questions:** Contact finance manager  
**Audit Requirements:** Contact internal audit

---

**KESIMPULAN SINGKAT:**

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  🚫 TIDAK BOLEH edit/delete transaksi POSTED   │
│                                                 │
│  ✅ GUNAKAN:                                    │
│     • VOID untuk membatalkan                    │
│     • REVERSE untuk mengoreksi                  │
│                                                 │
│  💡 ALASAN:                                     │
│     • Audit trail harus lengkap                 │
│     • Regulasi mengharuskan jejak perubahan     │
│     • Mencegah fraud dan manipulasi data        │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

**END OF DOCUMENTATION**
