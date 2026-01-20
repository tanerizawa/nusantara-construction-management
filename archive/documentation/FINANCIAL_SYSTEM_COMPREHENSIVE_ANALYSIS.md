# 📊 ANALISIS KOMPREHENSIF SISTEM KEUANGAN

## 🎯 EXECUTIVE SUMMARY

### Tujuan Analisis
Memastikan **data flow keuangan yang valid** dari perencanaan hingga realisasi dan arus kas, dengan prinsip:
- **RAB/RAP** = Data RENCANA (Planning/Budget)
- **Biaya/Kasbon** = Data REALISASI yang harus divalidasi
- **Arus Kas** = Hanya dari data yang sudah tervalidasi dan approved

---

## 📋 CURRENT STATE ANALYSIS

### 1. Database Structure

#### A. **Planning Layer - RAB (Rencana Anggaran Biaya)**
```sql
TABLE: project_rab
- id (uuid)
- project_id (varchar)
- category (varchar) -- e.g., "Pekerjaan Persiapan"
- description (text)
- quantity (numeric)
- unit_price (numeric)
- unit (varchar)
- approval_status (varchar) -- 'pending', 'approved', 'rejected'
- created_at, updated_at

STATUS: ✅ EXIST
PURPOSE: Master budget/planning data
```

#### B. **Realization Layer - Milestone Costs**
```sql
TABLE: milestone_costs
- id (uuid)
- milestone_id (uuid)
- cost_category (varchar) -- 'materials', 'labor', 'equipment', etc.
- cost_type (varchar) -- 'actual', 'estimated'
- amount (numeric)
- description (text)
- recorded_by (varchar)
- recorded_at (timestamp)
- approved_by (varchar) ⭐ CRITICAL FIELD
- approved_at (timestamp) ⭐ CRITICAL FIELD
- account_id (varchar) -- Expense account (COA)
- source_account_id (varchar) -- Bank/Cash source
- rab_item_id (uuid) -- Link to RAB
- is_rab_linked (boolean)
- rab_item_progress (numeric)
- deleted_at, deleted_by

STATUS: ✅ EXIST
PURPOSE: Actual cost realization
ISSUE: ❌ Tidak ada explicit STATUS field untuk workflow validation
```

#### C. **Transaction Layer - Finance Transactions**
```sql
TABLE: finance_transactions
- id (varchar)
- type (enum) -- 'income', 'expense', 'transfer'
- category, subcategory (varchar)
- amount (numeric)
- date (date)
- project_id (varchar)
- account_from, account_to (varchar)
- status (enum) -- 'completed', 'pending', 'cancelled'
- approved_by (varchar) ⭐
- approved_at (timestamp) ⭐
- submitted_by (varchar)
- submitted_at (timestamp)
- rejected_by, rejected_at, rejection_reason
- is_reversed (boolean)

STATUS: ✅ EXIST
PURPOSE: General ledger transactions
FEATURE: ✅ Full approval workflow
```

---

### 2. Data Flow Mapping

#### CURRENT FLOW (As-Is)
```
┌─────────────────────────────────────────────────────────────────┐
│ 1. RAB PLANNING                                                 │
│    - User create RAB items in project_rab                       │
│    - approval_status: pending → approved                        │
│    - SOURCE: Manual input or import                             │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. MILESTONE LINKING                                            │
│    - User create milestone & link to RAB category               │
│    - category_link stores category_name                         │
│    - Milestone shows planned budget from RAB                    │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. REALIZATION ENTRY (milestone_costs)                          │
│    ⚠️ PROBLEM: Direct save WITHOUT validation workflow         │
│    - User input actual cost via "Input Aktual" button           │
│    - Data saved directly to milestone_costs                     │
│    - approved_by, approved_at = NULL (no validation!)           │
│    - cost_type = 'actual'                                       │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. CASH FLOW REPORT                                             │
│    ⚠️ PROBLEM: Using MOCK DATA (not real transactions)         │
│    - Endpoint: GET /api/reports/cash-flow                       │
│    - Return hardcoded mock data                                 │
│    - NOT reading from milestone_costs or finance_transactions   │
└─────────────────────────────────────────────────────────────────┘
```

#### ISSUES IDENTIFIED

##### Issue #1: **No Validation Workflow for Milestone Costs** ❌
- `milestone_costs` langsung tersimpan tanpa approval
- `approved_by` dan `approved_at` selalu NULL
- Tidak ada status: 'draft', 'submitted', 'approved', 'rejected'
- User bisa input data realisasi tanpa supervisor review

##### Issue #2: **Cash Flow Using Mock Data** ❌
- Endpoint `/reports/cash-flow` return hardcoded data
- Tidak membaca dari `finance_transactions` atau `milestone_costs`
- Tidak ada koneksi real dengan actual spending

##### Issue #3: **No Link Between milestone_costs → finance_transactions** ❌
- `milestone_costs` hanya record di level milestone
- Tidak otomatis create `finance_transactions` untuk GL
- Chart of Accounts (COA) tidak terupdate real-time

##### Issue #4: **Missing Kasbon (Advance Payment) System** ⚠️
- Tidak ada table khusus untuk kasbon tracking
- Kasbon seharusnya: Request → Approve → Disburse → Reconcile
- Currently kasbon mungkin hanya dicatat di `milestone_costs`

---

## 🎯 TARGET STATE (To-Be)

### Proposed Data Flow

```
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 1: PLANNING (RAB/RAP)                                     │
│ ✅ Source of Truth untuk Budget                                 │
│ ✅ Hanya approved RAB yang bisa direalisasi                      │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 2: REALIZATION REQUEST (milestone_costs)                  │
│ Status Workflow:                                                 │
│ 1. DRAFT      - User input tapi belum submit                    │
│ 2. SUBMITTED  - Sudah submit, menunggu approval                 │
│ 3. APPROVED   - Approved by supervisor/manager                  │
│ 4. REJECTED   - Ditolak dengan alasan                           │
│ 5. PAID       - Sudah dibayar (linked to finance_transaction)   │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 3: PAYMENT EXECUTION (finance_transactions)               │
│ Only APPROVED milestone_costs can create transaction            │
│ - Create finance_transaction with type='expense'                │
│ - Deduct from source_account (bank/cash)                        │
│ - Link: finance_transaction.reference_id = milestone_cost.id    │
│ - Update Chart of Accounts balances                             │
└──────────────────────────────────────────────────────────────────┘
                            ↓
┌──────────────────────────────────────────────────────────────────┐
│ LAYER 4: REPORTING (Cash Flow, P&L, etc.)                       │
│ Only use VALIDATED data:                                        │
│ - Cash Flow: from finance_transactions with status='completed'  │
│ - P&L: from finance_transactions grouped by COA category        │
│ - Budget vs Actual: Compare RAB vs milestone_costs (approved)   │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTATION ROADMAP

### Phase 1: Add Validation Workflow to milestone_costs ⭐ HIGH PRIORITY

#### 1.1 Database Changes
```sql
-- Add status column to milestone_costs
ALTER TABLE milestone_costs 
ADD COLUMN status VARCHAR(20) DEFAULT 'draft' 
CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'paid'));

-- Add indexes
CREATE INDEX idx_milestone_costs_status ON milestone_costs(status);
CREATE INDEX idx_milestone_costs_approved ON milestone_costs(approved_at);

-- Add submission tracking
ALTER TABLE milestone_costs
ADD COLUMN submitted_by VARCHAR(255),
ADD COLUMN submitted_at TIMESTAMP,
ADD COLUMN rejection_reason TEXT;

-- Add link to finance transaction
ALTER TABLE milestone_costs
ADD COLUMN finance_transaction_id VARCHAR(255);
```

#### 1.2 Backend API Changes

**File:** `backend/routes/projects/milestoneDetail.routes.js`

**New Endpoints:**
```javascript
// Submit realization for approval
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/submit

// Approve realization
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/approve

// Reject realization
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/reject

// Get pending approvals (for supervisor)
GET /api/projects/:projectId/milestones/:milestoneId/costs/pending
```

**Modified Endpoint:**
```javascript
// POST /api/projects/:projectId/milestones/:milestoneId/costs
// Change: Save with status='draft' by default
// Add option to submit immediately: ?submit=true
```

#### 1.3 Frontend Changes

**File:** `frontend/src/components/milestones/detail-tabs/costs/SimplifiedRABTable.js`

**Add Status Badge:**
```jsx
const getStatusBadge = (status) => {
  const config = {
    draft: { color: 'gray', label: 'Draft' },
    submitted: { color: 'yellow', label: 'Menunggu Approval' },
    approved: { color: 'green', label: 'Approved' },
    rejected: { color: 'red', label: 'Ditolak' },
    paid: { color: 'blue', label: 'Sudah Dibayar' }
  };
  return config[status] || config.draft;
};
```

**Add Action Buttons:**
- Draft → Submit for Approval
- Submitted → Approve / Reject (only for supervisor)
- Approved → Create Payment (link to finance transaction)

---

### Phase 2: Integrate milestone_costs → finance_transactions ⭐ HIGH PRIORITY

#### 2.1 Create Payment from Approved Realization

**New Endpoint:**
```javascript
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/execute-payment

Request Body:
{
  "payment_date": "2025-11-04",
  "payment_method": "bank_transfer",
  "reference_number": "TRF20251104001",
  "notes": "Pembayaran realisasi pekerjaan persiapan"
}

Logic:
1. Check cost status = 'approved'
2. Create finance_transaction:
   - type = 'expense'
   - amount = cost.amount
   - account_from = cost.source_account_id (bank/cash)
   - account_to = cost.account_id (expense COA)
   - project_id = milestone.project_id
   - status = 'completed'
3. Update milestone_cost:
   - status = 'paid'
   - finance_transaction_id = transaction.id
4. Update Chart of Accounts balances
5. Return success
```

#### 2.2 UI Flow
```
Approved Realization Row:
[Description] [Amount] [Status: Approved] [Execute Payment Button]
                                              ↓
                                    Payment Modal:
                                    - Payment Date
                                    - Payment Method
                                    - Reference Number
                                    - Notes
                                    [Submit Payment]
                                              ↓
                                    finance_transaction created
                                    Status → 'Paid'
```

---

### Phase 3: Fix Cash Flow Report (Real Data) ⭐ MEDIUM PRIORITY

#### 3.1 Backend Service

**File:** `backend/services/cash-flow.service.js` (create new)

```javascript
class CashFlowService {
  async generateCashFlow(startDate, endDate, projectId = null) {
    // Operating Activities: from finance_transactions
    const operating = await this.getOperatingActivities(startDate, endDate, projectId);
    
    // Investing Activities: from asset purchases
    const investing = await this.getInvestingActivities(startDate, endDate, projectId);
    
    // Financing Activities: from loans/equity
    const financing = await this.getFinancingActivities(startDate, endDate, projectId);
    
    // Opening & Closing Cash
    const openingCash = await this.getCashBalance(startDate, projectId);
    const closingCash = await this.getCashBalance(endDate, projectId);
    
    return {
      period: { startDate, endDate },
      operatingActivities: operating,
      investingActivities: investing,
      financingActivities: financing,
      summary: {
        netCashFlow: operating.total + investing.total + financing.total,
        openingCash,
        closingCash
      }
    };
  }
  
  async getOperatingActivities(startDate, endDate, projectId) {
    // Query finance_transactions where:
    // - type = 'expense' OR 'income'
    // - category IN (operational categories)
    // - date BETWEEN startDate AND endDate
    // - status = 'completed'
    // - project_id = projectId (if provided)
    
    const query = `
      SELECT 
        category,
        subcategory,
        SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) as net_amount
      FROM finance_transactions
      WHERE date >= :startDate
        AND date <= :endDate
        AND status = 'completed'
        AND is_reversed = false
        ${projectId ? 'AND project_id = :projectId' : ''}
      GROUP BY category, subcategory
      ORDER BY category, subcategory
    `;
    
    // Process and structure data...
  }
}
```

#### 3.2 Replace Mock Data
**File:** `backend/routes/financial-reports/financial-statements.routes.js`

```javascript
router.get('/cash-flow', async (req, res) => {
  try {
    const { start_date, end_date, project_id } = req.query;
    
    const cashFlowService = new CashFlowService();
    const data = await cashFlowService.generateCashFlow(
      start_date || new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      end_date || new Date(),
      project_id
    );
    
    res.json({ success: true, data });
  } catch (error) {
    console.error('Error generating cash flow:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
```

---

### Phase 4: Implement Kasbon System ⭐ MEDIUM PRIORITY

#### 4.1 New Table Structure
```sql
CREATE TABLE kasbon_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(255) NOT NULL,
  milestone_id UUID,
  request_number VARCHAR(50) UNIQUE, -- KSB20251104001
  requester_id VARCHAR(255) NOT NULL,
  requester_name VARCHAR(255),
  amount NUMERIC(15,2) NOT NULL,
  purpose TEXT NOT NULL,
  requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Approval workflow
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN (
    'draft', 'submitted', 'approved', 'rejected', 'disbursed', 'settled'
  )),
  approved_by VARCHAR(255),
  approved_at TIMESTAMP,
  rejected_by VARCHAR(255),
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  
  -- Disbursement
  disbursed_by VARCHAR(255),
  disbursed_at TIMESTAMP,
  disbursement_method VARCHAR(50),
  disbursement_reference VARCHAR(100),
  source_account_id VARCHAR(50),
  
  -- Settlement/Reconciliation
  settled_at TIMESTAMP,
  settled_by VARCHAR(255),
  actual_spent NUMERIC(15,2),
  returned_amount NUMERIC(15,2) DEFAULT 0,
  settlement_notes TEXT,
  
  -- Linking
  finance_transaction_id VARCHAR(255),
  
  -- Audit
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (project_id) REFERENCES projects(id),
  FOREIGN KEY (milestone_id) REFERENCES project_milestones(id)
);

-- Indexes
CREATE INDEX idx_kasbon_status ON kasbon_requests(status);
CREATE INDEX idx_kasbon_project ON kasbon_requests(project_id);
CREATE INDEX idx_kasbon_requester ON kasbon_requests(requester_id);
```

#### 4.2 Kasbon Workflow
```
1. DRAFT → User create kasbon request
2. SUBMITTED → Submit for approval
3. APPROVED → Supervisor approve
4. DISBURSED → Finance execute payment (create finance_transaction)
5. SETTLED → User submit expense report & return unused amount
```

#### 4.3 API Endpoints
```javascript
POST   /api/projects/:projectId/kasbon                    // Create request
GET    /api/projects/:projectId/kasbon                    // List all
GET    /api/projects/:projectId/kasbon/:id                // Get detail
PUT    /api/projects/:projectId/kasbon/:id                // Update
POST   /api/projects/:projectId/kasbon/:id/submit         // Submit for approval
POST   /api/projects/:projectId/kasbon/:id/approve        // Approve
POST   /api/projects/:projectId/kasbon/:id/reject         // Reject
POST   /api/projects/:projectId/kasbon/:id/disburse       // Execute payment
POST   /api/projects/:projectId/kasbon/:id/settle         // Settlement
```

---

## 📊 PRIORITY MATRIX

| Phase | Task | Impact | Effort | Priority | Timeline |
|-------|------|--------|--------|----------|----------|
| 1 | Add status workflow to milestone_costs | 🔴 HIGH | Medium | **P0** | Week 1 |
| 1 | Backend API for approval workflow | 🔴 HIGH | Medium | **P0** | Week 1 |
| 1 | Frontend UI for status & actions | 🔴 HIGH | Medium | **P0** | Week 1-2 |
| 2 | Execute payment from approved costs | 🔴 HIGH | High | **P1** | Week 2 |
| 2 | Auto-create finance_transactions | 🔴 HIGH | High | **P1** | Week 2-3 |
| 3 | Build CashFlowService | 🟡 MEDIUM | High | **P2** | Week 3 |
| 3 | Replace mock cash flow data | 🟡 MEDIUM | Medium | **P2** | Week 3 |
| 4 | Design kasbon table & workflow | 🟡 MEDIUM | High | **P3** | Week 4 |
| 4 | Implement kasbon APIs | 🟡 MEDIUM | High | **P3** | Week 4-5 |
| 4 | Kasbon frontend UI | 🟡 MEDIUM | Medium | **P3** | Week 5 |

---

## ✅ SUCCESS CRITERIA

### Phase 1 Success Metrics
- ✅ All new `milestone_costs` have status = 'draft'
- ✅ Supervisor can view pending approvals
- ✅ Approval/rejection updates `approved_by`, `approved_at`
- ✅ Only approved costs can trigger payment
- ✅ UI shows clear status badges for each realization

### Phase 2 Success Metrics
- ✅ "Execute Payment" button only visible for approved costs
- ✅ Payment creates `finance_transaction` automatically
- ✅ `milestone_cost.finance_transaction_id` is populated
- ✅ Chart of Accounts balances update real-time
- ✅ Source account (bank/cash) balance decreases correctly

### Phase 3 Success Metrics
- ✅ Cash Flow report shows real data from `finance_transactions`
- ✅ No more mock/hardcoded data
- ✅ Operating activities include all project expenses
- ✅ Opening/closing cash balances are accurate
- ✅ Report can filter by project_id

### Phase 4 Success Metrics
- ✅ Kasbon request workflow: Draft → Submit → Approve → Disburse → Settle
- ✅ Disbursement creates `finance_transaction`
- ✅ Settlement tracks actual spend vs requested amount
- ✅ Unused amount returned and recorded
- ✅ Full audit trail for all kasbon movements

---

## 🚨 RISKS & MITIGATION

### Risk 1: Breaking Existing Features
**Mitigation:**
- Add status field with DEFAULT 'draft' (non-breaking)
- Add endpoints, don't modify existing ones yet
- Feature flag for approval workflow

### Risk 2: Data Migration for Existing milestone_costs
**Mitigation:**
```sql
-- Set all existing costs to 'approved' to maintain status quo
UPDATE milestone_costs
SET status = 'approved',
    approved_by = recorded_by,
    approved_at = recorded_at
WHERE status IS NULL;
```

### Risk 3: Performance Impact (Multiple Queries)
**Mitigation:**
- Use database indexes on status, approved_at
- Implement caching for cash flow reports
- Paginate pending approvals list

---

## 📝 NEXT STEPS

### Immediate Actions (This Week)
1. **Review & Approve** this analysis document
2. **Create database migration** for Phase 1 (add status column)
3. **Implement approval endpoints** in backend
4. **Update frontend UI** to show status workflow

### Short Term (Next 2 Weeks)
1. Complete Phase 1 & Phase 2
2. Test approval workflow end-to-end
3. Integrate payment execution

### Medium Term (Next Month)
1. Implement real cash flow reporting (Phase 3)
2. Design and implement kasbon system (Phase 4)
3. User training on new approval workflow

---

## 📞 STAKEHOLDERS

- **Decision Maker:** Product Owner / Finance Manager
- **Implementation:** Development Team
- **Testing:** QA Team + Finance Team
- **Users:** Project Managers, Supervisors, Finance Staff

---

**Document Version:** 1.0  
**Created:** November 4, 2025  
**Status:** 🟡 Pending Review & Approval  
**Next Review:** After Phase 1 implementation
