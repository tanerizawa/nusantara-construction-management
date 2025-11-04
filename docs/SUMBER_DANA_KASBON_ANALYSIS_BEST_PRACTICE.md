# 📊 Analisis & Rekomendasi Best Practice: Sumber Dana Kasbon & Keuangan

**Created**: 4 November 2025  
**Status**: Analisis & Rekomendasi  
**Purpose**: Integrasi sumber dana pada sistem keuangan & kasbon dengan opsi cash tanpa display nilai

---

## 🔍 Current State Analysis

### 1. **Existing Models**

#### A. ProjectAdditionalExpense (Kasbon Model)
```javascript
// File: backend/models/ProjectAdditionalExpense.js

Fields:
- expenseType: ENUM('kasbon', 'overtime', 'emergency', ...)
- paymentMethod: ENUM('cash', 'transfer', 'check', 'giro', 'other')
- amount: DECIMAL(15, 2)
- ❌ MISSING: sourceAccountId (sumber dana/rekening pembayar)
```

**Current Limitation**:
- ✅ Ada `paymentMethod` (cash/transfer) tapi hanya string kategori
- ❌ Tidak ada link ke Chart of Accounts (COA)
- ❌ Tidak tracking rekening mana yang mengeluarkan uang
- ❌ Tidak ada validasi saldo saat kasbon cash

#### B. MilestoneCost Model
```javascript
// File: backend/models/MilestoneCost.js

Fields:
- accountId: STRING(50) // Jenis pengeluaran (expense account)
- sourceAccountId: STRING(50) // Sumber dana (bank/cash account)
- amount: DECIMAL(15, 2)
```

**Current Status**:
- ✅ **Sudah lengkap** - memiliki `sourceAccountId`
- ✅ Terintegrasi dengan COA untuk sumber dana
- ✅ Menampilkan saldo bank/cash saat memilih sumber dana

### 2. **Chart of Accounts (COA) - Cash & Bank**

```javascript
// Available cash/bank accounts in COA
Account Type: ASSET
Account SubType: CASH_AND_BANK

Examples:
COA-110101: Bank BCA (1101.01)
COA-110102: Bank BNI (1101.02)
COA-110103: Bank BJB (1101.03)
COA-110107: Kas Tunai (1101.07) ✨
COA-110108: Kas Kecil - Petty Cash (1101.08) ✨
```

---

## 🎯 Requirements Analysis

### User Request Breakdown:

1. **"Buat sumber dana di manajemen keuangan"**
   - ✅ COA sudah memiliki account bank/cash
   - ✅ MilestoneCost sudah integrate
   - ❌ ProjectAdditionalExpense (Kasbon) belum integrate

2. **"Terintegrasi dengan halaman keuangan & kasbon"**
   - Perlu link `ProjectAdditionalExpense.sourceAccountId` ke COA
   - Perlu update UI form kasbon untuk pilih sumber dana

3. **"Tambahan opsi cash"**
   - ✅ Sudah ada account "Kas Tunai" & "Kas Kecil" di COA
   - Perlu filter khusus untuk cash accounts

4. **"Cash tidak menampilkan nilai"**
   - **Key Requirement**: Opsi cash HIDE balance/saldo
   - Alasan: Privacy/security untuk transaksi cash

---

## 💡 Best Practice Recommendations

### Option 1: **Simple Flag-Based Approach** ⭐ RECOMMENDED

**Concept**: Tambah logic di frontend untuk hide balance jika account type = cash

**Pros**:
- ✅ Simple implementation
- ✅ Flexible - bisa toggle show/hide per user role
- ✅ Tidak perlu ubah database structure
- ✅ Maintain data integrity - tetap track saldo actual

**Cons**:
- ⚠️ Balance tetap ada di database (bisa diakses via API jika tidak properly secured)

**Implementation**:
```javascript
// Frontend logic
const shouldShowBalance = (account) => {
  // Hide balance for cash accounts
  if (account.accountName.toLowerCase().includes('kas')) {
    return false;
  }
  
  // Hide for specific codes
  if (account.accountCode.startsWith('1101.07') || // Kas Tunai
      account.accountCode.startsWith('1101.08')) { // Kas Kecil
    return false;
  }
  
  return true; // Show for bank accounts
};

// Usage in dropdown
<option value={account.id}>
  {account.accountCode} - {account.accountName}
  {shouldShowBalance(account) && account.currentBalance !== null
    ? ` (Saldo: ${formatCurrency(account.currentBalance)})`
    : '' // Empty string for cash accounts
  }
</option>
```

---

### Option 2: **Database Flag Approach**

**Concept**: Tambah field `hideBalance` di ChartOfAccounts

**Pros**:
- ✅ Controlled at database level
- ✅ Consistent across all UI
- ✅ Easy to manage per account

**Cons**:
- ❌ Require database migration
- ❌ More complex setup

**Implementation**:
```javascript
// Add to ChartOfAccounts model
hideBalance: {
  type: DataTypes.BOOLEAN,
  defaultValue: false,
  field: 'hide_balance',
  comment: 'Hide balance display for privacy (e.g., cash accounts)'
}

// Migration
ALTER TABLE chart_of_accounts 
ADD COLUMN hide_balance BOOLEAN DEFAULT false;

UPDATE chart_of_accounts 
SET hide_balance = true 
WHERE account_code IN ('1101.07', '1101.08'); -- Kas Tunai, Kas Kecil
```

---

### Option 3: **Separate Cash Account Type**

**Concept**: Pisahkan `accountSubType` menjadi `BANK` dan `CASH`

**Current**: `accountSubType = 'CASH_AND_BANK'` (digabung)  
**Proposed**: 
- `accountSubType = 'BANK'` → Show balance
- `accountSubType = 'CASH'` → Hide balance

**Pros**:
- ✅ Clear separation
- ✅ Better for reporting/analytics
- ✅ Standard accounting practice

**Cons**:
- ❌ Require data migration
- ❌ Update all existing queries

---

## 🏆 Final Recommendation: **Hybrid Approach**

Combine Option 1 (frontend flag) + Option 3 (separate subtypes) for future-proof solution:

### Phase 1: Quick Win (Option 1)
```javascript
// Immediate implementation - no DB changes
// Hide balance for cash accounts in UI
```

### Phase 2: Long-term (Option 2 + 3)
```javascript
// Add hideBalance flag to COA
// Separate BANK and CASH subtypes
// Update all queries and UI
```

---

## 📋 Implementation Plan

### Step 1: Update ProjectAdditionalExpense Model

```javascript
// backend/models/ProjectAdditionalExpense.js

sourceAccountId: {
  type: DataTypes.STRING(50),
  allowNull: true,
  field: 'source_account_id',
  comment: 'Chart of Accounts ID for payment source (bank/cash)',
  references: {
    model: 'chart_of_accounts',
    key: 'id'
  }
}
```

**Migration**:
```sql
ALTER TABLE project_additional_expenses 
ADD COLUMN source_account_id VARCHAR(50) NULL,
ADD CONSTRAINT fk_additional_expense_source_account 
  FOREIGN KEY (source_account_id) 
  REFERENCES chart_of_accounts(id);

-- Add index for performance
CREATE INDEX idx_additional_expense_source_account 
ON project_additional_expenses(source_account_id);
```

---

### Step 2: Update Backend Routes

```javascript
// backend/routes/projects/budgetValidation.routes.js

router.post('/additional-expenses', verifyToken, async (req, res) => {
  const { sourceAccountId, amount, ... } = req.body;
  
  // Validate source account exists
  if (sourceAccountId) {
    const sourceAccount = await ChartOfAccounts.findByPk(sourceAccountId);
    
    if (!sourceAccount) {
      return res.status(400).json({
        error: 'Invalid source account'
      });
    }
    
    // Validate account is cash/bank type
    if (sourceAccount.accountSubType !== 'CASH_AND_BANK') {
      return res.status(400).json({
        error: 'Source account must be a cash or bank account'
      });
    }
    
    // Optional: Check balance (if not cash)
    const isCashAccount = sourceAccount.accountName.toLowerCase().includes('kas');
    
    if (!isCashAccount && sourceAccount.currentBalance < amount) {
      return res.status(400).json({
        error: 'Insufficient balance',
        available: sourceAccount.currentBalance,
        required: amount
      });
    }
  }
  
  // Create expense
  const expense = await ProjectAdditionalExpense.create({
    ...req.body,
    sourceAccountId,
    createdBy: req.user.id
  });
  
  // Update account balance (if approved)
  if (expense.approvalStatus === 'approved' && sourceAccountId) {
    await ChartOfAccounts.decrement(
      'currentBalance',
      { 
        by: amount,
        where: { id: sourceAccountId }
      }
    );
  }
  
  res.json({ success: true, data: expense });
});
```

---

### Step 3: Update Frontend - Kasbon Form

```javascript
// frontend/src/components/kasbon/KasbonForm.js (or similar)

const [sourceAccounts, setSourceAccounts] = useState([]);
const [loadingAccounts, setLoadingAccounts] = useState(false);

// Fetch cash/bank accounts
const fetchSourceAccounts = async () => {
  setLoadingAccounts(true);
  try {
    const response = await fetch('/api/chart-of-accounts?account_type=ASSET&is_active=true');
    const result = await response.json();
    
    // Filter for bank and cash accounts
    const cashBankAccounts = result.data.filter(account => 
      account.accountType === 'ASSET' &&
      account.accountSubType === 'CASH_AND_BANK' &&
      account.level >= 3 &&
      !account.isControlAccount
    );
    
    setSourceAccounts(cashBankAccounts);
  } catch (error) {
    console.error('Failed to fetch accounts:', error);
  } finally {
    setLoadingAccounts(false);
  }
};

// Helper: Check if account is cash (hide balance)
const isCashAccount = (account) => {
  const name = account.accountName.toLowerCase();
  const code = account.accountCode;
  
  return name.includes('kas') || 
         code === '1101.07' || // Kas Tunai
         code === '1101.08';   // Kas Kecil
};

// Form JSX
<div>
  <label className="block text-sm font-medium mb-1">
    Sumber Dana (Bank/Kas) *
  </label>
  
  <select
    value={formData.sourceAccountId}
    onChange={(e) => setFormData({ ...formData, sourceAccountId: e.target.value })}
    className="w-full px-3 py-2 bg-[#1C1C1E] border rounded text-white"
    required
    disabled={loadingAccounts}
  >
    <option value="">
      {loadingAccounts ? 'Loading...' : '-- Pilih Sumber Dana --'}
    </option>
    
    {sourceAccounts.map(account => (
      <option key={account.id} value={account.id}>
        {account.accountCode} - {account.accountName}
        
        {/* Hide balance for cash accounts */}
        {!isCashAccount(account) && account.currentBalance !== null
          ? ` (Saldo: ${formatCurrency(account.currentBalance)})`
          : '' // No balance shown for cash
        }
      </option>
    ))}
  </select>
  
  {/* Validation message */}
  {formData.sourceAccountId && (() => {
    const selectedAccount = sourceAccounts.find(a => a.id === formData.sourceAccountId);
    
    if (!selectedAccount) return null;
    
    const isCash = isCashAccount(selectedAccount);
    const balance = selectedAccount.currentBalance;
    const amount = parseFloat(formData.amount) || 0;
    
    // Show balance warning only for bank accounts
    if (!isCash && balance !== undefined && amount > balance) {
      return (
        <p className="text-xs text-[#FF453A] mt-1">
          ⚠️ Saldo tidak cukup! (Tersedia: {formatCurrency(balance)})
        </p>
      );
    }
    
    // Show success checkmark for all
    return (
      <p className="text-xs text-[#30D158] mt-1">
        ✓ {selectedAccount.accountName}
        {!isCash && balance !== null 
          ? ` - Saldo: ${formatCurrency(balance)}`
          : ' - Kas Tunai'
        }
      </p>
    );
  })()}
  
  <p className="text-xs text-[#8E8E93] mt-1">
    💡 Pilih rekening bank atau kas untuk pembayaran kasbon
  </p>
</div>
```

---

### Step 4: Update Finance Transaction Integration

Ensure kasbon expenses are reflected in finance transactions:

```javascript
// When kasbon is approved, create finance transaction
const createFinanceTransaction = async (expense) => {
  await FinanceTransaction.create({
    type: 'expense',
    category: 'kasbon',
    amount: expense.amount,
    accountFrom: expense.sourceAccountId, // Source account (bank/cash)
    description: `Kasbon: ${expense.description}`,
    projectId: expense.projectId,
    referenceNumber: expense.id,
    status: 'completed',
    createdBy: expense.approvedBy
  });
};
```

---

## 🔒 Security & Privacy Considerations

### 1. **Cash Balance Privacy**
```javascript
// API Response - Hide cash balance
router.get('/cash-accounts', verifyToken, async (req, res) => {
  const accounts = await ChartOfAccounts.findAll({
    where: { accountSubType: 'CASH_AND_BANK', isActive: true }
  });
  
  // Mask cash account balances
  const maskedAccounts = accounts.map(account => ({
    ...account.toJSON(),
    currentBalance: account.accountName.includes('Kas') 
      ? null // Hide for cash
      : account.currentBalance // Show for bank
  }));
  
  res.json({ data: maskedAccounts });
});
```

### 2. **Role-Based Balance Visibility**
```javascript
// Show balance only for specific roles
const canViewCashBalance = (userRole) => {
  return ['admin', 'finance_manager', 'director'].includes(userRole);
};

// In API
if (!canViewCashBalance(req.user.role)) {
  account.currentBalance = null;
}
```

---

## 📊 Database Schema Summary

### Before (Current):
```
project_additional_expenses
├── id
├── project_id
├── expense_type (kasbon, overtime, etc)
├── payment_method (cash, transfer) ← String only, not linked to COA
├── amount
└── ... (other fields)
```

### After (Recommended):
```
project_additional_expenses
├── id
├── project_id
├── expense_type
├── payment_method ← Legacy field (keep for backward compatibility)
├── source_account_id ← NEW: FK to chart_of_accounts ✨
├── amount
└── ... (other fields)

FOREIGN KEY (source_account_id) REFERENCES chart_of_accounts(id)
```

---

## 🎯 Expected Behavior

### Scenario 1: Kasbon dengan Bank Transfer
```
User Input:
- Expense Type: Kasbon
- Amount: Rp 5.000.000
- Source: Bank BCA (1101.01)

UI Display:
[Bank BCA (1101.01) - Saldo: Rp 150.000.000] ← SHOW BALANCE

Validation:
✓ Check if balance >= amount
✓ Show warning if insufficient
```

### Scenario 2: Kasbon dengan Cash
```
User Input:
- Expense Type: Kasbon
- Amount: Rp 5.000.000
- Source: Kas Tunai (1101.07)

UI Display:
[Kas Tunai (1101.07)] ← NO BALANCE SHOWN

Validation:
✓ No balance check
✓ Allow transaction regardless of recorded balance
```

---

## 📈 Benefits

### 1. **Financial Tracking**
- ✅ Track semua kasbon per sumber dana
- ✅ Report: Total kasbon dari Bank A, Bank B, Kas, etc.
- ✅ Audit trail lengkap

### 2. **Cash Flow Management**
- ✅ Real-time balance bank accounts
- ✅ Prevent over-spending dari rekening tertentu
- ✅ Better budget control

### 3. **Privacy & Security**
- ✅ Hide cash balance untuk privacy
- ✅ Role-based access control
- ✅ Comply dengan internal policy

### 4. **Integration**
- ✅ Seamless dengan Chart of Accounts
- ✅ Consistent dengan Milestone Costs (same pattern)
- ✅ Ready untuk future reporting/analytics

---

## 🚦 Implementation Priority

### Phase 1: MVP (1-2 days) ⭐
- [ ] Add `sourceAccountId` field to ProjectAdditionalExpense model
- [ ] Database migration
- [ ] Update POST /additional-expenses endpoint
- [ ] Basic frontend dropdown (show all accounts)
- [ ] Hide balance for cash accounts (frontend logic)

### Phase 2: Enhancement (3-5 days)
- [ ] Balance validation for bank accounts
- [ ] Auto-update COA balances on approval
- [ ] Enhanced error messages
- [ ] Loading states & UX polish

### Phase 3: Advanced (Optional)
- [ ] Role-based balance visibility
- [ ] Separate BANK/CASH subtypes in COA
- [ ] Add `hideBalance` flag to COA model
- [ ] Analytics & reporting dashboard

---

## 🔗 Related Files to Update

### Backend:
1. `/backend/models/ProjectAdditionalExpense.js` - Add sourceAccountId
2. `/backend/routes/projects/budgetValidation.routes.js` - Update endpoints
3. `/backend/migrations/YYYYMMDD_add_source_account_to_expenses.js` - New migration

### Frontend:
1. `/frontend/src/components/workflow/budget-validation/*` - Kasbon forms
2. `/frontend/src/pages/finance/*` - Finance management pages
3. Create: `/frontend/src/utils/accountHelpers.js` - Helper functions (isCashAccount, etc)

---

## ✅ Success Criteria

- [ ] User dapat pilih sumber dana saat create kasbon
- [ ] Dropdown menampilkan bank accounts dengan saldo
- [ ] Dropdown menampilkan cash accounts TANPA saldo
- [ ] Validation: error jika bank balance tidak cukup
- [ ] Validation: allow cash tanpa check balance
- [ ] COA balance auto-update saat kasbon approved
- [ ] Terintegrasi dengan halaman finance management
- [ ] Data konsisten antara kasbon dan finance transactions

---

## 📝 Notes

1. **Backward Compatibility**: Field `paymentMethod` tetap ada untuk legacy data
2. **Migration Strategy**: Existing kasbon records tidak perlu di-update (sourceAccountId = NULL ok)
3. **Testing**: Test dengan berbagai role (admin, finance_manager, project_manager)
4. **Documentation**: Update API docs setelah implementation

---

**Next Steps**: Proceed dengan Phase 1 implementation setelah approval requirements.
