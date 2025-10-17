# 📊 COMPREHENSIVE ANALYSIS: PROJECT BUDGET VALIDATION & MONITORING PAGE

**Date:** October 16, 2025  
**Purpose:** Halaman baru untuk validasi dan monitoring anggaran proyek secara komprehensif  
**Location:** Project Detail → New Tab "Budget Validation"

---

## 🎯 OBJECTIVE

Membuat halaman baru di project detail yang menampilkan:

### Core Features
1. **RAB List Lengkap** - Semua item RAB dengan nama pekerjaan dan total anggaran
2. **Actual Budget Tracking** - Kolom isian untuk mencatat realisasi anggaran aktual
3. **Additional Expenses** - Fitur penambahan pengeluaran lain (kasbon, biaya tak terduga, dll)
4. **Budget Validation** - Validasi real-time antara anggaran vs aktual
5. **Comprehensive Monitoring** - Dashboard monitoring anggaran secara menyeluruh

---

## 📐 CURRENT STATE ANALYSIS

### 1. Database Schema (EXISTING)

#### Table: `project_rab` (Budget Planning)
```sql
CREATE TABLE project_rab (
  id UUID PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,       -- e.g., "Material", "Labor", "Equipment"
  description TEXT NOT NULL,            -- Nama pekerjaan
  unit VARCHAR(255) NOT NULL,           -- m3, kg, unit, dll
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(15,2) NOT NULL,
  total_price NUMERIC(15,2) NOT NULL,   -- ANGGARAN
  notes TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  status ENUM('draft', 'pending', 'approved', 'rejected'),
  item_type rab_item_type DEFAULT 'material',
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id)
);
```

**Purpose:** Menyimpan Rencana Anggaran Biaya (RAB) yang sudah disetujui

---

#### Table: `rab_purchase_tracking` (Actual Spending)
```sql
CREATE TABLE rab_purchase_tracking (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  rab_item_id VARCHAR(255) NOT NULL,    -- Link ke project_rab.id
  po_number VARCHAR(255),               -- Reference PO
  quantity NUMERIC(10,2) NOT NULL,
  unit_price NUMERIC(15,2) NOT NULL,
  total_amount NUMERIC(15,2) NOT NULL,  -- AKTUAL SPENDING
  purchase_date TIMESTAMP NOT NULL,
  status ENUM('pending', 'approved', 'completed', 'cancelled'),
  notes TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

**Purpose:** Tracking pembelian aktual yang terhubung dengan RAB items

---

#### Table: `milestone_costs` (Milestone-based Expenses)
```sql
-- Struktur akan dicek, tapi kemungkinan ada kolom:
CREATE TABLE milestone_costs (
  id UUID PRIMARY KEY,
  milestone_id UUID,
  project_id VARCHAR(255),
  cost_type VARCHAR(255),              -- "material", "labor", "equipment", "other"
  amount NUMERIC(15,2),
  description TEXT,
  created_at TIMESTAMP
);
```

**Purpose:** Biaya yang terkait dengan milestone tertentu

---

### 2. Frontend Structure (EXISTING)

#### Current Tabs in Project Detail
```javascript
// File: frontend/src/pages/project-detail/config/tabConfig.js

export const createTabConfig = (workflowData) => [
  { id: 'overview', label: 'Ringkasan Proyek' },
  { id: 'rab-workflow', label: 'RAB & BOQ' },
  { id: 'approval-status', label: 'Status Approval' },
  { id: 'purchase-orders', label: 'Purchase Orders' },
  { id: 'budget-monitoring', label: 'Budget Monitoring' },  // ✅ EXISTING
  { id: 'team', label: 'Tim Proyek' },
  { id: 'documents', label: 'Dokumen' },
  { id: 'reports', label: 'Reports' },
  { id: 'milestones', label: 'Milestone' },
  { id: 'berita-acara', label: 'Berita Acara' },
  { id: 'progress-payments', label: 'Progress Payments' }
];
```

**Note:** Ada tab "Budget Monitoring" tapi belum komprehensif untuk validasi aktual vs budget

---

### 3. Backend API (EXISTING)

#### Available Endpoints

**File:** `backend/routes/projects/budget-statistics.routes.js`
```javascript
// GET /api/projects/:id/budget-statistics?timeframe=month
// Returns:
{
  categoryBudgets: {
    "Material": { budget: 500000000, actual: 450000000, variance: -50000000 },
    "Labor": { budget: 300000000, actual: 320000000, variance: 20000000 }
  },
  totalBudget: 1000000000,
  totalActual: 800000000,
  variance: -200000000
}
```

**File:** `backend/routes/projects/rab.routes.js`
```javascript
// GET /api/projects/:id/rab
// Returns all RAB items for project

// POST /api/projects/:id/rab
// Create new RAB item

// PUT /api/projects/:id/rab/:rabId
// Update RAB item
```

**File:** `backend/routes/rabPurchaseTracking.js`
```javascript
// GET /api/rab-tracking?projectId=xxx
// Get all purchase tracking

// POST /api/rab-tracking
// Create new purchase tracking entry
```

---

## 🆕 PROPOSED SOLUTION: NEW TAB "BUDGET VALIDATION"

### 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│               PROJECT DETAIL PAGE                            │
│                                                              │
│  ┌────┬────┬────┬────┬─────────────────┬────┬────┬────┐   │
│  │Over│RAB │Appr│PO  │Budget Validation│Team│Docs│... │   │
│  │view│    │oval│    │    [NEW TAB]    │    │    │    │   │
│  └────┴────┴────┴────┴─────────────────┴────┴────┴────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          BUDGET VALIDATION CONTENT                    │  │
│  │                                                        │  │
│  │  1. Budget Summary Cards (Top)                        │  │
│  │  2. RAB vs Actual Comparison Table                    │  │
│  │  3. Additional Expenses Section                       │  │
│  │  4. Variance Analysis Chart                           │  │
│  │  5. Action Buttons (Export, Validate, etc)            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

### 2. Component Structure (MODULAR)

```
frontend/src/pages/project-detail/
├── tabs/
│   └── BudgetValidation/                    [NEW]
│       ├── index.js                         (Main container)
│       ├── BudgetValidationTab.js           (Main component - 300 lines)
│       │
│       ├── components/
│       │   ├── BudgetSummaryCards.js        (150 lines)
│       │   ├── RABComparisonTable.js        (400 lines)
│       │   ├── AdditionalExpensesSection.js (350 lines)
│       │   ├── VarianceAnalysisChart.js     (250 lines)
│       │   ├── ActualInputModal.js          (200 lines)
│       │   ├── ExpenseFormModal.js          (250 lines)
│       │   └── BudgetAlerts.js              (150 lines)
│       │
│       ├── hooks/
│       │   ├── useBudgetData.js             (150 lines)
│       │   ├── useActualTracking.js         (120 lines)
│       │   ├── useAdditionalExpenses.js     (130 lines)
│       │   └── useBudgetCalculations.js     (100 lines)
│       │
│       └── utils/
│           ├── budgetCalculations.js        (150 lines)
│           ├── varianceAnalysis.js          (120 lines)
│           └── budgetValidation.js          (100 lines)
│
└── config/
    └── tabConfig.js                         (Update to add new tab)
```

**Total Estimated Lines:** ~2,700 lines split into 15 files (~180 lines average)

---

### 3. Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                           │
│                                                               │
│  BudgetValidationTab.js                                       │
│         │                                                     │
│         ├─→ useBudgetData()                                   │
│         │   ├─ Fetch RAB items                               │
│         │   ├─ Fetch actual tracking                         │
│         │   └─ Fetch additional expenses                     │
│         │                                                     │
│         ├─→ useBudgetCalculations()                           │
│         │   ├─ Calculate totals                              │
│         │   ├─ Calculate variances                           │
│         │   └─ Calculate budget utilization %               │
│         │                                                     │
│         └─→ Components                                        │
│             ├─ BudgetSummaryCards                            │
│             ├─ RABComparisonTable                            │
│             └─ AdditionalExpensesSection                     │
└──────────────────────────────────────────────────────────────┘
                        │
                        │ API Calls (axios)
                        │
┌──────────────────────────────────────────────────────────────┐
│                  BACKEND (Express + Sequelize)                │
│                                                               │
│  /api/projects/:id/budget-validation                         │
│         │                                                     │
│         ├─→ budgetValidation.routes.js [NEW]                 │
│         │   │                                                 │
│         │   ├─→ GET /budget-validation                       │
│         │   │   └─ Returns comprehensive budget data         │
│         │   │                                                 │
│         │   ├─→ POST /actual-costs                           │
│         │   │   └─ Record actual spending                    │
│         │   │                                                 │
│         │   ├─→ POST /additional-expenses                    │
│         │   │   └─ Add kasbon, biaya tak terduga, etc       │
│         │   │                                                 │
│         │   └─→ GET /variance-analysis                       │
│         │       └─ Calculate budget vs actual variance       │
│         │                                                     │
│         └─→ budgetValidation.service.js [NEW]                │
│             └─ Business logic for calculations                │
└──────────────────────────────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌──────────────────────────────────────────────────────────────┐
│                  DATABASE (PostgreSQL)                        │
│                                                               │
│  ┌──────────────────┐  ┌─────────────────────┐              │
│  │   project_rab    │  │ rab_purchase_       │              │
│  │   (Budget/RAB)   │  │   tracking          │              │
│  │                  │  │ (Actual Spending)   │              │
│  └────────┬─────────┘  └─────────┬───────────┘              │
│           │                       │                           │
│           │   JOIN ON             │                           │
│           │   id = rab_item_id    │                           │
│           └───────────┬───────────┘                           │
│                       │                                       │
│           ┌───────────▼───────────────┐                       │
│           │  project_additional_      │ [NEW TABLE]          │
│           │  expenses                 │                       │
│           │  (Kasbon, Extra Costs)    │                       │
│           └───────────────────────────┘                       │
└──────────────────────────────────────────────────────────────┘
```

---

## 🗄️ NEW DATABASE TABLE

### Table: `project_additional_expenses`

```sql
CREATE TABLE project_additional_expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id VARCHAR(255) NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  
  -- Expense Details
  expense_type VARCHAR(50) NOT NULL,     -- 'kasbon', 'overtime', 'emergency', 'other'
  category VARCHAR(100),                 -- Optional category for grouping
  description TEXT NOT NULL,
  amount NUMERIC(15,2) NOT NULL,
  
  -- Related Information
  related_milestone_id UUID,             -- Link to milestone if applicable
  related_rab_item_id UUID,              -- Link to RAB if applicable
  recipient_name VARCHAR(255),           -- For kasbon
  payment_method VARCHAR(50),            -- 'cash', 'transfer', 'check'
  
  -- Documentation
  receipt_url VARCHAR(500),              -- Photo bukti/receipt
  notes TEXT,
  
  -- Approval
  approved_by VARCHAR(255),
  approved_at TIMESTAMP,
  approval_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  
  -- Timestamps
  expense_date TIMESTAMP NOT NULL DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP                   -- Soft delete
);

-- Indexes
CREATE INDEX idx_additional_expenses_project ON project_additional_expenses(project_id);
CREATE INDEX idx_additional_expenses_type ON project_additional_expenses(expense_type);
CREATE INDEX idx_additional_expenses_date ON project_additional_expenses(expense_date);
CREATE INDEX idx_additional_expenses_status ON project_additional_expenses(approval_status);

-- Expense type ENUM (optional)
CREATE TYPE expense_type AS ENUM (
  'kasbon',           -- Kasbon/advance payment to worker
  'overtime',         -- Lembur
  'emergency',        -- Biaya darurat
  'transportation',   -- Transport
  'accommodation',    -- Akomodasi
  'meals',           -- Konsumsi
  'equipment_rental', -- Sewa alat tambahan
  'repair',          -- Perbaikan
  'other'            -- Lainnya
);
```

---

## 🎨 UI/UX DESIGN SPECIFICATION

### Section 1: Budget Summary Cards (Top)

```
┌────────────────────────────────────────────────────────────────┐
│  BUDGET SUMMARY                                                │
│                                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────┐ │
│  │ Total RAB   │ │ Total Aktual│ │  Variance   │ │ Progress│ │
│  │ Rp 1.0 B    │ │ Rp 850 M    │ │ -Rp 150 M   │ │   85%   │ │
│  │             │ │             │ │  (Under)    │ │         │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────┘ │
│                                                                │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │ Additional  │ │ Total Spent │ │ Remaining   │            │
│  │ Expenses    │ │ Rp 900 M    │ │ Rp 100 M    │            │
│  │ Rp 50 M     │ │             │ │   (10%)     │            │
│  └─────────────┘ └─────────────┘ └─────────────┘            │
└────────────────────────────────────────────────────────────────┘
```

**Component:** `BudgetSummaryCards.js`

**Props:**
```javascript
{
  totalRAB: Number,
  totalActual: Number,
  additionalExpenses: Number,
  variance: Number,
  progress: Number
}
```

---

### Section 2: RAB vs Actual Comparison Table

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  RAB VS ACTUAL COMPARISON                                                    │
│                                                                              │
│  [Search] [Filter: All Categories ▾] [Export Excel] [+ Input Actual]        │
│                                                                              │
│  ┌───┬──────────────┬──────────┬─────────┬─────────┬─────────┬──────────┐ │
│  │No │ Item Name    │ Category │ RAB     │ Actual  │Variance │ Action   │ │
│  ├───┼──────────────┼──────────┼─────────┼─────────┼─────────┼──────────┤ │
│  │ 1 │Beton K-300   │Material  │250.0 M  │240.0 M  │-10.0 M  │[Input]   │ │
│  │   │              │          │         │  (96%)  │  ✓      │[History] │ │
│  ├───┼──────────────┼──────────┼─────────┼─────────┼─────────┼──────────┤ │
│  │ 2 │Pekerja      │Labor     │150.0 M  │160.0 M  │+10.0 M  │[Input]   │ │
│  │   │Harian       │          │         │ (107%)  │  ⚠️      │[History] │ │
│  ├───┼──────────────┼──────────┼─────────┼─────────┼─────────┼──────────┤ │
│  │ 3 │Excavator    │Equipment │ 80.0 M  │ 75.0 M  │ -5.0 M  │[Input]   │ │
│  │   │Rental       │          │         │  (94%)  │  ✓      │[History] │ │
│  └───┴──────────────┴──────────┴─────────┴─────────┴─────────┴──────────┘ │
│                                                                              │
│  Showing 3 of 45 items • Page 1 of 15                                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Component:** `RABComparisonTable.js`

**Features:**
- Real-time variance calculation
- Color coding: Green (under budget), Red (over budget), Yellow (near limit)
- Click [Input] → Opens modal to input actual spending
- Click [History] → Shows history of actual inputs
- Export to Excel
- Search and filter by category

---

### Section 3: Additional Expenses Section

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ADDITIONAL EXPENSES                                          [+ Add Expense]│
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Recent Expenses                                                        │ │
│  │                                                                        │ │
│  │ ┌──────┬─────────────┬──────────┬──────────┬─────────┬────────────┐  │ │
│  │ │Date  │ Type        │ Desc     │ Amount   │ Status  │ Action     │  │ │
│  │ ├──────┼─────────────┼──────────┼──────────┼─────────┼────────────┤  │ │
│  │ │10/15 │Kasbon       │Pak Budi  │ 5.0 M    │Approved │ [View]     │  │ │
│  │ ├──────┼─────────────┼──────────┼──────────┼─────────┼────────────┤  │ │
│  │ │10/14 │Overtime     │Weekend   │ 3.5 M    │Approved │ [View]     │  │ │
│  │ ├──────┼─────────────┼──────────┼──────────┼─────────┼────────────┤  │ │
│  │ │10/12 │Emergency    │Pump Fix  │ 8.0 M    │Pending  │ [Approve]  │  │ │
│  │ └──────┴─────────────┴──────────┴──────────┴─────────┴────────────┘  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Expense Summary by Type                                                │ │
│  │                                                                        │ │
│  │  Kasbon: Rp 25.0 M (50%)     ███████████████░░░░░░░░░░░░░░░░░        │ │
│  │  Overtime: Rp 12.0 M (24%)   ████████░░░░░░░░░░░░░░░░░░░░░░░░        │ │
│  │  Emergency: Rp 13.0 M (26%)  █████████░░░░░░░░░░░░░░░░░░░░░░         │ │
│  │                                                                        │ │
│  │  Total Additional Expenses: Rp 50.0 M                                 │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Component:** `AdditionalExpensesSection.js`

**Sub-components:**
- `ExpenseList.js` - List of expenses
- `ExpenseFormModal.js` - Form to add new expense
- `ExpenseSummaryChart.js` - Pie/bar chart by type

---

### Section 4: Variance Analysis Chart

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  VARIANCE ANALYSIS                                                           │
│                                                                              │
│  [By Category ▾] [Monthly ▾]                                                │
│                                                                              │
│  Budget vs Actual by Category                                               │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  Material     ████████████░░     240M / 250M  (96%)  -10M             │ │
│  │  Labor        ██████████████     160M / 150M  (107%) +10M  ⚠️         │ │
│  │  Equipment    ███████████░░░      75M / 80M   (94%)  -5M              │ │
│  │  Overhead     ████████████░       50M / 55M   (91%)  -5M              │ │
│  │                                                                        │ │
│  │  ░ RAB Budget    ▌ Actual Spent                                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Spending Trend (Last 6 Months)                                             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  250M │                                               ●                │ │
│  │       │                                       ●     ●                  │ │
│  │  200M │                               ●     ●                          │ │
│  │       │                       ●     ●                                  │ │
│  │  150M │               ●     ●                                          │ │
│  │       │       ●     ●                                                  │ │
│  │  100M │ ●   ●                                                          │ │
│  │       └───────────────────────────────────────────────────────────     │ │
│  │         May   Jun   Jul   Aug   Sep   Oct                             │ │
│  │                                                                        │ │
│  │  ● Cumulative Spending    ▬ Planned Budget Line                       │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Component:** `VarianceAnalysisChart.js`

**Charts:**
- Horizontal bar chart (Budget vs Actual by category)
- Line chart (Spending trend over time)
- Uses Chart.js or Recharts

---

## 🔧 IMPLEMENTATION ROADMAP

### Phase 1: Database & Backend API (Week 1)

**Tasks:**
1. ✅ Create migration for `project_additional_expenses` table
2. ✅ Create Sequelize model for additional expenses
3. ✅ Implement backend routes:
   - `GET /api/projects/:id/budget-validation` - Get comprehensive budget data
   - `POST /api/projects/:id/actual-costs` - Record actual spending
   - `POST /api/projects/:id/additional-expenses` - Add expense
   - `GET /api/projects/:id/variance-analysis` - Get variance data
   - `GET /api/projects/:id/additional-expenses` - List expenses
   - `PUT /api/projects/:id/additional-expenses/:expenseId` - Update expense
   - `DELETE /api/projects/:id/additional-expenses/:expenseId` - Delete expense
4. ✅ Create service layer for budget calculations
5. ✅ Write unit tests for calculations

**Files to Create:**
```
backend/
├── migrations/
│   └── XXXXXX-create-project-additional-expenses.js
├── models/
│   └── ProjectAdditionalExpense.js
├── routes/projects/
│   └── budgetValidation.routes.js
└── services/
    └── budgetValidation.service.js
```

---

### Phase 2: Frontend Components (Week 2)

**Tasks:**
1. ✅ Create folder structure
2. ✅ Implement custom hooks:
   - `useBudgetData()` - Fetch budget data
   - `useActualTracking()` - Track actual costs
   - `useAdditionalExpenses()` - Manage expenses
   - `useBudgetCalculations()` - Calculate variances
3. ✅ Build utility functions:
   - `budgetCalculations.js` - Math functions
   - `varianceAnalysis.js` - Variance logic
   - `budgetValidation.js` - Validation rules
4. ✅ Create base components:
   - `BudgetSummaryCards.js`
   - `RABComparisonTable.js`
   - `AdditionalExpensesSection.js`
   - `VarianceAnalysisChart.js`

**Files to Create:**
```
frontend/src/pages/project-detail/tabs/BudgetValidation/
├── index.js
├── BudgetValidationTab.js
├── components/
│   ├── BudgetSummaryCards.js
│   ├── RABComparisonTable.js
│   ├── AdditionalExpensesSection.js
│   ├── VarianceAnalysisChart.js
│   ├── ActualInputModal.js
│   ├── ExpenseFormModal.js
│   └── BudgetAlerts.js
├── hooks/
│   ├── useBudgetData.js
│   ├── useActualTracking.js
│   ├── useAdditionalExpenses.js
│   └── useBudgetCalculations.js
└── utils/
    ├── budgetCalculations.js
    ├── varianceAnalysis.js
    └── budgetValidation.js
```

---

### Phase 3: Integration & Testing (Week 3)

**Tasks:**
1. ✅ Integrate components into `BudgetValidationTab`
2. ✅ Add new tab to `tabConfig.js`
3. ✅ Connect frontend to backend APIs
4. ✅ Implement real-time calculations
5. ✅ Add loading states and error handling
6. ✅ Write integration tests
7. ✅ User acceptance testing

---

### Phase 4: Features & Polish (Week 4)

**Tasks:**
1. ✅ Add export to Excel functionality
2. ✅ Implement budget alerts (over-budget warnings)
3. ✅ Add approval workflow for additional expenses
4. ✅ Create print-friendly view
5. ✅ Add tooltips and help text
6. ✅ Performance optimization
7. ✅ Documentation

---

## 📋 DETAILED COMPONENT SPECIFICATIONS

### Component 1: BudgetSummaryCards.js

**Purpose:** Display key budget metrics at a glance

**Props:**
```javascript
{
  totalRAB: Number,           // Total dari semua RAB items
  totalActual: Number,        // Total actual dari purchase tracking
  additionalExpenses: Number, // Total dari additional expenses
  loading: Boolean,
  refreshData: Function
}
```

**Calculations:**
```javascript
const variance = totalActual - totalRAB;
const totalSpent = totalActual + additionalExpenses;
const remaining = totalRAB - totalSpent;
const progress = (totalSpent / totalRAB) * 100;
const status = variance > 0 ? 'over' : variance < 0 ? 'under' : 'ontrack';
```

**Display:**
- 6 cards in grid layout (2x3 or 3x2)
- Color coded: Green (under budget), Red (over budget), Blue (info)
- Animated number counters
- Refresh button

---

### Component 2: RABComparisonTable.js

**Purpose:** Main table comparing RAB vs actual costs per item

**Props:**
```javascript
{
  rabItems: Array<RABItem>,
  actualTracking: Array<Tracking>,
  onInputActual: Function,
  onViewHistory: Function
}
```

**Data Structure:**
```javascript
interface RABItem {
  id: string;
  description: string;
  category: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;  // RAB amount
  actualSpent: number; // Calculated from tracking
  variance: number;    // actualSpent - totalPrice
  percentUsed: number; // (actualSpent / totalPrice) * 100
}
```

**Features:**
- Sortable columns
- Search by description
- Filter by category
- Pagination (15 items per page)
- Inline edit for notes
- Modal for inputting actual costs
- History modal showing all transactions

**Actions:**
- [Input Actual] → Opens `ActualInputModal`
- [View History] → Opens modal with list of all purchase tracking entries

---

### Component 3: AdditionalExpensesSection.js

**Purpose:** Manage kasbon, overtime, and other expenses

**Props:**
```javascript
{
  projectId: string,
  expenses: Array<Expense>,
  onAddExpense: Function,
  onUpdateExpense: Function,
  onDeleteExpense: Function,
  onApprove: Function
}
```

**Data Structure:**
```javascript
interface Expense {
  id: string;
  expenseType: 'kasbon' | 'overtime' | 'emergency' | 'other';
  description: string;
  amount: number;
  recipientName?: string;
  expenseDate: Date;
  approvalStatus: 'pending' | 'approved' | 'rejected';
  receiptUrl?: string;
  notes?: string;
}
```

**Sub-sections:**
1. **Add Expense Button** (top-right)
2. **Recent Expenses Table**
   - Last 10 expenses
   - Quick view of status
   - Actions: View details, Edit, Delete, Approve
3. **Expense Summary Chart**
   - Pie chart by expense type
   - Total amount per type

---

### Component 4: VarianceAnalysisChart.js

**Purpose:** Visual analysis of budget variances

**Props:**
```javascript
{
  categoryData: Array<CategoryData>,
  timeSeriesData: Array<TimeSeriesPoint>,
  timeframe: 'week' | 'month' | 'quarter'
}
```

**Charts:**

1. **Horizontal Bar Chart (Budget vs Actual)**
   ```javascript
   {
     labels: ['Material', 'Labor', 'Equipment', 'Overhead'],
     datasets: [
       { label: 'RAB Budget', data: [250, 150, 80, 55] },
       { label: 'Actual Spent', data: [240, 160, 75, 50] }
     ]
   }
   ```

2. **Line Chart (Spending Trend)**
   ```javascript
   {
     labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
     datasets: [
       { label: 'Cumulative Spending', data: [50, 120, 200, 280, 380, 525] },
       { label: 'Planned Budget', data: [100, 200, 300, 400, 500, 600] }
     ]
   }
   ```

**Library:** Chart.js or Recharts

---

## 🔗 API ENDPOINT SPECIFICATIONS

### 1. GET /api/projects/:id/budget-validation

**Purpose:** Get comprehensive budget data for validation page

**Response:**
```json
{
  "success": true,
  "data": {
    "projectId": "2025BSR001",
    "projectName": "Proyek Pembangunan Gedung",
    "summary": {
      "totalRAB": 1000000000,
      "totalActual": 850000000,
      "additionalExpenses": 50000000,
      "totalSpent": 900000000,
      "remaining": 100000000,
      "variance": -150000000,
      "progress": 90.0
    },
    "rabItems": [
      {
        "id": "uuid-1",
        "description": "Beton K-300",
        "category": "Material",
        "unit": "m3",
        "quantity": 500,
        "unitPrice": 500000,
        "totalPrice": 250000000,
        "actualSpent": 240000000,
        "variance": -10000000,
        "percentUsed": 96.0,
        "lastUpdated": "2025-10-15T10:00:00Z"
      }
    ],
    "categoryBreakdown": [
      {
        "category": "Material",
        "budget": 500000000,
        "actual": 480000000,
        "variance": -20000000,
        "percentUsed": 96.0
      }
    ],
    "additionalExpenses": [
      {
        "id": "exp-1",
        "expenseType": "kasbon",
        "description": "Kasbon Pak Budi",
        "amount": 5000000,
        "recipientName": "Budi",
        "expenseDate": "2025-10-15",
        "approvalStatus": "approved",
        "receiptUrl": "https://...",
        "notes": ""
      }
    ],
    "timeSeriesData": [
      {
        "period": "2025-05",
        "cumulativeSpending": 50000000,
        "plannedBudget": 100000000
      }
    ]
  }
}
```

---

### 2. POST /api/projects/:id/actual-costs

**Purpose:** Record actual spending for a RAB item

**Request Body:**
```json
{
  "rabItemId": "uuid-1",
  "quantity": 100,
  "unitPrice": 480000,
  "totalAmount": 48000000,
  "poNumber": "PO-2025-001",
  "purchaseDate": "2025-10-15",
  "notes": "Pembelian batch 1"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Actual cost recorded successfully",
  "data": {
    "id": "track-1",
    "rabItemId": "uuid-1",
    "totalAmount": 48000000,
    "newTotalActual": 240000000,
    "variance": -10000000
  }
}
```

---

### 3. POST /api/projects/:id/additional-expenses

**Purpose:** Add kasbon, overtime, or other additional expenses

**Request Body:**
```json
{
  "expenseType": "kasbon",
  "description": "Kasbon untuk Pak Budi - Minggu 3",
  "amount": 5000000,
  "recipientName": "Budi Santoso",
  "paymentMethod": "transfer",
  "expenseDate": "2025-10-15",
  "notes": "Transfer BCA",
  "receiptUrl": "https://storage.../receipt.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Additional expense added successfully",
  "data": {
    "id": "exp-123",
    "expenseType": "kasbon",
    "amount": 5000000,
    "approvalStatus": "pending",
    "createdAt": "2025-10-15T14:30:00Z"
  }
}
```

---

### 4. GET /api/projects/:id/variance-analysis

**Purpose:** Get variance analysis data for charts

**Query Params:**
- `timeframe`: 'week' | 'month' | 'quarter' | 'year'
- `groupBy`: 'category' | 'time' | 'both'

**Response:**
```json
{
  "success": true,
  "data": {
    "byCategory": [
      {
        "category": "Material",
        "budget": 500000000,
        "actual": 480000000,
        "variance": -20000000,
        "percentUsed": 96.0
      }
    ],
    "timeSeries": [
      {
        "period": "2025-10",
        "spending": 150000000,
        "cumulative": 900000000,
        "plannedCumulative": 1000000000
      }
    ],
    "alerts": [
      {
        "type": "warning",
        "category": "Labor",
        "message": "Labor costs 107% of budget",
        "severity": "medium"
      }
    ]
  }
}
```

---

## 🧮 BUSINESS LOGIC & CALCULATIONS

### Calculation 1: Total Budget (RAB)
```javascript
const totalRAB = rabItems
  .filter(item => item.status === 'approved')
  .reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);
```

### Calculation 2: Total Actual Spending
```javascript
const totalActual = purchaseTracking
  .filter(track => track.status !== 'cancelled')
  .reduce((sum, track) => sum + parseFloat(track.totalAmount), 0);
```

### Calculation 3: Additional Expenses Total
```javascript
const totalAdditional = additionalExpenses
  .filter(exp => exp.approvalStatus === 'approved')
  .reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
```

### Calculation 4: Total Spent
```javascript
const totalSpent = totalActual + totalAdditional;
```

### Calculation 5: Remaining Budget
```javascript
const remaining = totalRAB - totalSpent;
const remainingPercent = (remaining / totalRAB) * 100;
```

### Calculation 6: Variance
```javascript
const variance = totalSpent - totalRAB;
const variancePercent = (variance / totalRAB) * 100;
```

### Calculation 7: Per-Item Actual
```javascript
const itemActual = (rabItemId) => {
  return purchaseTracking
    .filter(track => track.rabItemId === rabItemId)
    .reduce((sum, track) => sum + parseFloat(track.totalAmount), 0);
};
```

### Calculation 8: Budget Health Status
```javascript
const getBudgetHealth = (percentUsed) => {
  if (percentUsed <= 90) return { status: 'healthy', color: 'green' };
  if (percentUsed <= 100) return { status: 'warning', color: 'yellow' };
  return { status: 'critical', color: 'red' };
};
```

---

## ⚠️ VALIDATION RULES

### Rule 1: Actual Cost Cannot Be Negative
```javascript
if (actualAmount < 0) {
  throw new Error('Actual cost must be greater than or equal to 0');
}
```

### Rule 2: Warning When Exceeding Budget
```javascript
if (actualAmount > rabItem.totalPrice) {
  showWarning('Actual cost exceeds RAB budget. Please confirm.');
}
```

### Rule 3: Additional Expense Requires Approval
```javascript
if (expenseAmount > 10000000) { // > 10M
  expense.approvalStatus = 'pending';
  expense.requiresApproval = true;
}
```

### Rule 4: Cannot Delete Approved Expenses
```javascript
if (expense.approvalStatus === 'approved') {
  throw new Error('Cannot delete approved expense. Please reject first.');
}
```

---

## 🎯 SUCCESS METRICS

### Functional Requirements ✅
- [ ] Display all RAB items in table
- [ ] Show actual costs per RAB item
- [ ] Calculate variance (RAB vs Actual)
- [ ] Add additional expenses (kasbon, overtime, etc)
- [ ] Real-time budget calculation
- [ ] Export to Excel
- [ ] Approval workflow for expenses
- [ ] Visual charts for variance analysis

### Performance Requirements ✅
- Page load < 2 seconds
- Table render < 500ms for 100 items
- API response < 1 second
- Real-time calculation < 100ms

### UX Requirements ✅
- Intuitive navigation
- Clear visual indicators (colors)
- Responsive design (mobile-friendly)
- Helpful tooltips and error messages
- Loading states for async operations

---

## 📚 DOCUMENTATION DELIVERABLES

1. **User Guide** - How to use budget validation page
2. **API Documentation** - Endpoint specifications
3. **Developer Guide** - Component architecture
4. **Database Schema** - Table structures
5. **Testing Plan** - Test cases and scenarios

---

## 🚀 NEXT STEPS

### Immediate Actions
1. ✅ Review and approve this analysis document
2. ✅ Create database migration for `project_additional_expenses`
3. ✅ Set up backend route skeleton
4. ✅ Create frontend folder structure
5. ✅ Start Phase 1 implementation

### Questions to Clarify
1. Approval workflow: Single approver or multi-level?
2. Budget limit: Hard limit or warning only?
3. Export format: Excel only or PDF too?
4. Historical data: Keep all versions or latest only?
5. Access control: Who can input actual costs?

---

**END OF ANALYSIS**

**Status:** ✅ Ready for Implementation  
**Estimated Timeline:** 4 weeks  
**Total Lines of Code:** ~2,700 lines (modular)  
**Database Changes:** 1 new table + indexes

---

**Prepared by:** GitHub Copilot Assistant  
**Date:** October 16, 2025  
**Version:** 1.0
