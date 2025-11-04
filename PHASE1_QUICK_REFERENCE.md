# 🚀 PHASE 1 QUICK REFERENCE - Approval Workflow

## 📊 Status Workflow

```
┌─────────┐
│  DRAFT  │ ← Initial state (editable)
└────┬────┘
     │ Submit
     ↓
┌──────────┐
│SUBMITTED │ ← Awaiting approval
└────┬─────┘
     │
     ├─→ Approve → ┌──────────┐
     │             │ APPROVED │ ← Ready for payment
     │             └──────────┘
     │
     └─→ Reject → ┌──────────┐
                  │ REJECTED │ ← Can edit & resubmit
                  └──────────┘
```

## 🔐 User Permissions

| Action | User Role | Status Required |
|--------|-----------|-----------------|
| Create Cost | Any | - |
| Edit Cost | Any | draft, rejected |
| Delete Cost | Any | draft, rejected |
| Submit for Approval | Any | draft |
| Approve | **Manager Only** | submitted |
| Reject | **Manager Only** | submitted |

## 🎨 Status Badge Colors

| Status | Color | Icon | Description |
|--------|-------|------|-------------|
| `draft` | Gray | 📝 | Initial state, can be edited |
| `submitted` | Yellow | ⏳ | Waiting for manager approval |
| `approved` | Green | ✅ | Approved by manager |
| `rejected` | Red | ❌ | Rejected with reason |
| `paid` | Blue | 💰 | Payment executed (Phase 2) |

## 📡 API Endpoints

### Submit Cost
```http
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/submit
Authorization: Bearer {token}
x-username: {username}

Response 200:
{
  "success": true,
  "data": {
    "id": "...",
    "status": "submitted",
    "submitted_by": "username",
    "submitted_at": "2025-11-04T...",
    ...
  },
  "message": "Cost realization submitted for approval"
}

Error 400:
{
  "success": false,
  "error": "Cannot submit cost with status \"approved\". Only draft costs can be submitted."
}
```

### Approve Cost
```http
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/approve
Authorization: Bearer {token}
x-username: {manager-username}

Response 200:
{
  "success": true,
  "data": {
    "id": "...",
    "status": "approved",
    "approved_by": "manager-username",
    "approved_at": "2025-11-04T...",
    ...
  },
  "message": "Cost realization approved successfully"
}

Error 400:
{
  "success": false,
  "error": "Cannot approve cost with status \"draft\". Only submitted costs can be approved."
}
```

### Reject Cost
```http
POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/reject
Authorization: Bearer {token}
x-username: {manager-username}
Content-Type: application/json

Body:
{
  "reason": "Jumlah tidak sesuai dengan nota pembelian"
}

Response 200:
{
  "success": true,
  "data": {
    "id": "...",
    "status": "rejected",
    "rejected_by": "manager-username",
    "rejected_at": "2025-11-04T...",
    "rejection_reason": "Jumlah tidak sesuai dengan nota pembelian",
    ...
  },
  "message": "Cost realization rejected"
}

Error 400 (missing reason):
{
  "success": false,
  "error": "Rejection reason is required"
}
```

### Get Pending Costs
```http
GET /api/projects/:projectId/milestones/:milestoneId/costs/pending
Authorization: Bearer {token}

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "...",
      "status": "submitted",
      "submitted_by": "username",
      "submitted_at": "2025-11-04T...",
      "actual_value": 1000000,
      "description": "Pembelian material",
      ...
    }
  ],
  "count": 5,
  "message": "Found 5 pending cost(s) awaiting approval"
}
```

## 🗄️ Database Schema

### milestone_costs Table - New Columns

```sql
-- Status workflow
status VARCHAR(20) DEFAULT 'draft' NOT NULL
  CHECK (status IN ('draft', 'submitted', 'approved', 'rejected', 'paid'))

-- Submission tracking
submitted_by VARCHAR(255)
submitted_at TIMESTAMP

-- Rejection tracking
rejected_by VARCHAR(255)
rejected_at TIMESTAMP
rejection_reason TEXT

-- Payment link (Phase 2)
finance_transaction_id VARCHAR(255)

-- Indexes
CREATE INDEX idx_milestone_costs_status ON milestone_costs(status);
CREATE INDEX idx_milestone_costs_submitted ON milestone_costs(submitted_at);
CREATE INDEX idx_milestone_costs_finance_txn ON milestone_costs(finance_transaction_id);
```

## 🔍 Common SQL Queries

### Get all pending costs
```sql
SELECT 
  mc.*,
  u.username as recorded_by_name,
  su.username as submitted_by_name
FROM milestone_costs mc
LEFT JOIN users u ON mc.recorded_by = u.username
LEFT JOIN users su ON mc.submitted_by = su.username
WHERE mc.status = 'submitted' 
  AND mc.deleted_at IS NULL
ORDER BY mc.submitted_at DESC;
```

### Get cost history
```sql
SELECT 
  id,
  status,
  recorded_at,
  recorded_by,
  submitted_at,
  submitted_by,
  approved_at,
  approved_by,
  rejected_at,
  rejected_by,
  rejection_reason
FROM milestone_costs
WHERE id = 'your-cost-id';
```

### Status distribution
```sql
SELECT 
  status,
  COUNT(*) as count,
  SUM(actual_value) as total_value
FROM milestone_costs
WHERE deleted_at IS NULL
GROUP BY status
ORDER BY status;
```

## 🎯 Frontend Components

### StatusBadge
```jsx
import StatusBadge from './StatusBadge';

<StatusBadge status="submitted" size="small" />
<StatusBadge status="approved" size="normal" />
```

### ActionButtons
```jsx
import ActionButtons from './ActionButtons';

<ActionButtons
  cost={costObject}
  onSubmit={handleSubmitCost}
  onApprove={handleApproveCost}
  onReject={handleRejectCost}
  isManager={true}
  loading={false}
/>
```

### SimplifiedRABTable
```jsx
<SimplifiedRABTable
  rabItems={rabItems}
  projectId={projectId}
  milestoneId={milestoneId}
  isManager={isUserManager}
  // ... other props
/>
```

## 🐛 Troubleshooting

### Issue: Status not updating
**Solution:** Check backend logs, verify database transaction committed
```bash
docker-compose logs backend | tail -50
```

### Issue: Action buttons not showing
**Solution:** Check `isManager` prop is passed correctly
```javascript
console.log('isManager:', isManager);
```

### Issue: Rejection reason not saving
**Solution:** Verify request body contains `reason` field
```javascript
console.log('Request body:', JSON.stringify({ reason }));
```

### Issue: Cannot submit draft cost
**Solution:** Check cost status in database
```sql
SELECT id, status FROM milestone_costs WHERE id = 'your-cost-id';
```

## 📋 Testing Checklist

- [ ] Create new cost (status = draft)
- [ ] Submit cost for approval (draft → submitted)
- [ ] See yellow "Menunggu Persetujuan" badge
- [ ] Manager approves cost (submitted → approved)
- [ ] See green "Disetujui" badge
- [ ] Edit/Delete buttons disabled for approved cost
- [ ] Reset status to submitted, then reject with reason
- [ ] See red "Ditolak" badge with reason displayed
- [ ] Edit rejected cost and resubmit
- [ ] Get pending costs returns correct count
- [ ] Status validation prevents invalid transitions

## 🚀 Next Phase Preview

**Phase 2: Payment Execution**
- Add "Execute Payment" button for approved costs
- Auto-create finance_transaction records
- Update status to 'paid'
- Link via finance_transaction_id
- Real-time Chart of Accounts updates

**Estimated:** 3-5 days after Phase 1 UAT

---

**Quick Links:**
- Full Implementation: `PHASE1_APPROVAL_WORKFLOW_COMPLETE.md`
- Testing Script: `test_phase1_workflow.sh`
- Comprehensive Analysis: `FINANCIAL_SYSTEM_COMPREHENSIVE_ANALYSIS.md`
