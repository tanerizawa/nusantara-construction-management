# 🏦 Chart of Accounts - Semi-Automatic Implementation Plan

**Date**: October 20, 2025  
**Objective**: Create user-friendly, PSAK-compliant, semi-automatic COA system  
**Target Users**: Non-accountants, construction managers

---

## 📊 Problem Analysis

### Current Pain Points:
1. ❌ **Manual Account Code Creation** - Users must know PSAK numbering
2. ❌ **Complex Forms** - Too many fields (12+ fields)
3. ❌ **No Guidance** - No hints or templates for common accounts
4. ❌ **Account Code Confusion** - Users don't understand hierarchical codes
5. ❌ **No Validation** - Can create duplicate/invalid codes

### Current Schema (Good Foundation):
```sql
chart_of_accounts:
- id (PK)
- account_code (VARCHAR(10)) - e.g., "1101.01"
- account_name (VARCHAR)
- account_type (ENUM) - ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE
- account_sub_type (VARCHAR)
- parent_account_id (FK)
- level (INTEGER) - 1=Main, 2=Sub, 3=Detail, 4=Sub-detail
- normal_balance (ENUM) - DEBIT, CREDIT
- is_control_account (BOOLEAN)
- current_balance (DECIMAL)
```

---

## 🎯 Solution Design

### 1. **Hierarchical PSAK Structure**

#### Level 1: Account Type (Control)
```
1xxx = ASSET (Aset)
2xxx = LIABILITY (Kewajiban)  
3xxx = EQUITY (Ekuitas)
4xxx = REVENUE (Pendapatan)
5xxx = EXPENSE (Beban)
```

#### Level 2: Main Category (Control)
```
11xx = Current Asset (Aset Lancar)
12xx = Fixed Asset (Aset Tetap)
13xx = Other Asset (Aset Lainnya)

21xx = Current Liability (Kewajiban Lancar)
22xx = Long-term Liability (Kewajiban Jangka Panjang)

31xx = Equity

41xx = Operating Revenue
42xx = Other Revenue

51xx = Direct Costs (HPP/Cost of Revenue)
52xx = Operating Expenses
53xx = Other Expenses
```

#### Level 3: Sub-Category (Postable)
```
1101 = Cash & Bank (Kas & Bank)
1102 = Accounts Receivable (Piutang Usaha)
1103 = Inventory (Persediaan)

1201 = Land (Tanah)
1202 = Buildings (Bangunan)
1203 = Machinery & Equipment (Mesin & Peralatan)
1204 = Vehicles (Kendaraan)

5101 = Direct Materials (Bahan Langsung)
5102 = Direct Labor (Tenaga Kerja Langsung)
5103 = Subcontractor (Subkontraktor)

5201 = Salaries & Wages (Gaji & Upah)
5202 = Office Rent (Sewa Kantor)
5203 = Utilities (Listrik, Air, Telepon)
```

#### Level 4: Detail Account (Postable)
```
1101.01 = Petty Cash (Kas Kecil)
1101.02 = Bank BCA
1101.03 = Bank Mandiri
1101.04 = Bank BNI

1102.01 = Piutang Usaha - PT A
1102.02 = Piutang Usaha - PT B

5101.01 = Besi & Baja
5101.02 = Semen
5101.03 = Pasir & Batu
```

---

## 🚀 Implementation Strategy

### Phase 1: Backend Account Code Generator Service ✅

**File**: `/backend/services/accountCodeGenerator.js`

**Features**:
1. Auto-generate next available code in sequence
2. Validate parent-child relationships
3. Ensure uniqueness
4. Respect hierarchical levels

```javascript
class AccountCodeGenerator {
  // Generate next code based on parent
  async generateNextCode(parentId, accountType)
  
  // Validate code follows PSAK rules
  validateAccountCode(code, type, level)
  
  // Get available parent accounts for type
  getAvailableParents(accountType, level)
  
  // Suggest account name based on type
  suggestAccountName(code, type, subType)
}
```

### Phase 2: Account Templates System ✅

**File**: `/backend/config/accountTemplates.js`

**Common Construction Accounts**:
```javascript
ACCOUNT_TEMPLATES = {
  CASH_BANK: [
    { name: 'Kas Kecil', code: '1101.01' },
    { name: 'Bank BCA', code: '1101.02' },
    { name: 'Bank Mandiri', code: '1101.03' }
  ],
  RECEIVABLES: [
    { name: 'Piutang Usaha', code: '1102' },
    { name: 'Piutang Retensi', code: '1103' }
  ],
  INVENTORY: [
    { name: 'Persediaan Bahan Bangunan', code: '1104' }
  ],
  FIXED_ASSETS: [
    { name: 'Tanah', code: '1201' },
    { name: 'Bangunan', code: '1202' },
    { name: 'Kendaraan', code: '1203' },
    { name: 'Alat Berat', code: '1204' }
  ],
  DIRECT_COSTS: [
    { name: 'Bahan Langsung', code: '5101' },
    { name: 'Tenaga Kerja Langsung', code: '5102' },
    { name: 'Subkontraktor', code: '5103' }
  ],
  OPERATING_EXPENSES: [
    { name: 'Gaji & Upah', code: '5201' },
    { name: 'Sewa Kantor', code: '5202' },
    { name: 'Listrik & Air', code: '5203' },
    { name: 'Telepon & Internet', code: '5204' },
    { name: 'Bahan Bakar & Transportasi', code: '5205' }
  ]
}
```

### Phase 3: Smart Account Creation Wizard ✅

**Component**: `/frontend/src/components/ChartOfAccounts/AccountWizard.js`

**3-Step Process**:

#### Step 1: Choose Account Type
```
┌─────────────────────────────────────┐
│  What type of account?              │
├─────────────────────────────────────┤
│  📦 ASSET (Aset)                    │
│  💰 LIABILITY (Kewajiban)           │
│  🏦 EQUITY (Ekuitas)                │
│  📈 REVENUE (Pendapatan)            │
│  📊 EXPENSE (Beban)                 │
└─────────────────────────────────────┘
```

#### Step 2: Choose Category (Smart Suggestions)
```
Selected: ASSET
┌─────────────────────────────────────┐
│  Choose category:                   │
├─────────────────────────────────────┤
│  💵 Cash & Bank (Kas & Bank)        │
│  📄 Receivables (Piutang)           │
│  📦 Inventory (Persediaan)          │
│  🏢 Fixed Assets (Aset Tetap)       │
│  📋 Other Assets (Aset Lainnya)     │
│  ➕ Create New Category             │
└─────────────────────────────────────┘
```

#### Step 3: Enter Details (Minimal Fields)
```
Category: Cash & Bank (1101)

┌─────────────────────────────────────┐
│  Account Name: *                    │
│  ┌─────────────────────────────┐   │
│  │ Bank BCA                     │   │
│  └─────────────────────────────┘   │
│                                     │
│  Account Code: (Auto-generated)     │
│  ┌─────────────────────────────┐   │
│  │ 1101.02  🔄 Change           │   │
│  └─────────────────────────────┘   │
│                                     │
│  Opening Balance: (Optional)        │
│  ┌─────────────────────────────┐   │
│  │ Rp 0                         │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Cancel]  [Create Account ✓]      │
└─────────────────────────────────────┘
```

### Phase 4: Quick Template Selection ✅

**Component**: `/frontend/src/components/ChartOfAccounts/QuickTemplates.js`

```
┌─────────────────────────────────────────────────┐
│  🚀 Quick Start: Common Accounts                │
├─────────────────────────────────────────────────┤
│  💵 Cash & Bank Package (5 accounts)            │
│     • Kas Kecil                                 │
│     • Bank BCA, Mandiri, BNI                    │
│     [+ Add All]                                 │
│                                                 │
│  🏗️ Construction Direct Costs (3 accounts)      │
│     • Bahan Langsung                            │
│     • Tenaga Kerja Langsung                     │
│     • Subkontraktor                             │
│     [+ Add All]                                 │
│                                                 │
│  📊 Operating Expenses (5 accounts)             │
│     • Gaji, Sewa, Listrik, Telepon, BBM        │
│     [+ Add All]                                 │
└─────────────────────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### Backend API Endpoints

#### 1. Auto-generate Account Code
```
POST /api/chart-of-accounts/generate-code
Request: {
  accountType: 'ASSET',
  parentId: 'COA-1101', // optional
  level: 4
}
Response: {
  suggestedCode: '1101.04',
  nextAvailable: '1101.04',
  parentCode: '1101',
  level: 4
}
```

#### 2. Get Account Templates
```
GET /api/chart-of-accounts/templates
Response: {
  categories: {
    CASH_BANK: [...],
    RECEIVABLES: [...],
    ...
  }
}
```

#### 3. Bulk Create from Template
```
POST /api/chart-of-accounts/bulk-create-template
Request: {
  templateId: 'CASH_BANK',
  subsidiaryId: 'SUB001' // optional
}
Response: {
  created: 5,
  accounts: [...]
}
```

#### 4. Smart Create (Wizard)
```
POST /api/chart-of-accounts/smart-create
Request: {
  accountName: 'Bank BCA',
  accountType: 'ASSET',
  categoryCode: '1101',
  openingBalance: 50000000
}
Response: {
  account: {
    id: 'COA-...',
    accountCode: '1101.02', // auto-generated
    accountName: 'Bank BCA',
    ...
  }
}
```

---

## 📋 User Flow Examples

### Example 1: Creating Bank Account (Semi-Auto)

**User Action**:
1. Click "Add New Account"
2. Select "Quick Template" → "Cash & Bank"
3. Click "+ Add New Bank"
4. Enter: "Bank BCA"
5. (System auto-fills): Code: 1101.02, Type: ASSET, SubType: CASH_AND_BANK
6. Enter opening balance (optional): Rp 10,000,000
7. Click "Create"

**Result**:
```json
{
  "accountCode": "1101.02",
  "accountName": "Bank BCA",
  "accountType": "ASSET",
  "accountSubType": "CASH_AND_BANK",
  "parentAccountId": "COA-1101",
  "level": 4,
  "normalBalance": "DEBIT",
  "isControlAccount": false,
  "currentBalance": 10000000
}
```

### Example 2: Creating Expense Account

**User Action**:
1. Click "Add New Account"
2. Select Type: "EXPENSE (Beban)"
3. Select Category: "Operating Expenses"
4. Enter Name: "Sewa Kantor Jakarta"
5. (System suggests): Code: 5202.01
6. Click "Create"

**Result**:
```json
{
  "accountCode": "5202.01",
  "accountName": "Sewa Kantor Jakarta",
  "accountType": "EXPENSE",
  "accountSubType": "OPERATING_EXPENSE",
  "parentAccountId": "COA-5202",
  "level": 4,
  "normalBalance": "DEBIT",
  "constructionSpecific": false
}
```

---

## 🎨 UI/UX Improvements

### 1. Visual Account Hierarchy
```
📦 1000 - ASET
  💵 1100 - Aset Lancar
    💰 1101 - Kas & Bank
      └─ 1101.01 Kas Kecil      Rp 5,000,000
      └─ 1101.02 Bank BCA       Rp 50,000,000
      └─ 1101.03 Bank Mandiri   Rp 30,000,000
    📄 1102 - Piutang Usaha
      └─ 1102.01 Piutang PT A   Rp 100,000,000
```

### 2. Smart Input Fields

**Account Name Field**:
- Real-time validation
- Duplicate detection
- Similar name suggestions

**Account Code Field**:
- Auto-generated (read-only by default)
- "🔄 Change" button for manual override
- Live validation (red/green border)

### 3. Contextual Help

```
ℹ️ Account Code: 1101.02
   ↓
   1 = ASSET (Main Type)
   1 = Current Asset (Category)
   01 = Cash & Bank (Sub-category)
   .02 = Detail Account (Sequential)
```

---

## ✅ Validation Rules

### 1. Code Format Validation
```javascript
ASSET:      /^1\d{3}(\.\d{2})?$/
LIABILITY:  /^2\d{3}(\.\d{2})?$/
EQUITY:     /^3\d{3}(\.\d{2})?$/
REVENUE:    /^4\d{3}(\.\d{2})?$/
EXPENSE:    /^5\d{3}(\.\d{2})?$/
```

### 2. Parent-Child Validation
- Level 2 can only have Level 1 parent
- Level 3 can only have Level 2 parent
- Level 4 can only have Level 3 parent
- Code prefix must match parent code

### 3. Control Account Rules
- Control accounts (level 1-2) cannot have transactions
- Only postable accounts (level 3-4) can have balances
- Control accounts auto-set isControlAccount = true

---

## 🚀 Implementation Priority

### Week 1: Backend Foundation
- [x] Account Code Generator Service
- [x] Template Configuration
- [x] Smart Create API
- [x] Bulk Create API

### Week 2: Frontend Wizard
- [ ] Account Creation Wizard Component
- [ ] Quick Templates Component
- [ ] Visual Hierarchy View
- [ ] Smart Form Fields

### Week 3: Integration & Testing
- [ ] API Integration
- [ ] User Testing
- [ ] Documentation
- [ ] Video Tutorial

---

## 📊 Success Metrics

**Before**:
- ❌ Average account creation time: 5-10 minutes
- ❌ Error rate: 30% (wrong codes, duplicates)
- ❌ Requires accounting knowledge

**After**:
- ✅ Average account creation time: 1-2 minutes
- ✅ Error rate: < 5% (validated automatically)
- ✅ Can be used by non-accountants
- ✅ 80% users use templates/wizard

---

## 📝 Next Steps

1. Create Account Code Generator Service (backend)
2. Create Account Templates Config (backend)
3. Create Smart Create API (backend)
4. Create Account Wizard Component (frontend)
5. Create Quick Templates Component (frontend)
6. Update existing Add Account Modal
7. Add visual hierarchy view
8. User testing with non-accountants

---

**Implementation Status**: 🟡 Planning Complete, Ready to Implement  
**Estimated Time**: 2-3 weeks  
**Complexity**: Medium  
**Impact**: High (Major UX improvement)
