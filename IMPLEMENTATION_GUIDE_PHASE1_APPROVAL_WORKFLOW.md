# 🔧 IMPLEMENTATION GUIDE - PHASE 1: Approval Workflow

## Overview
Implement validation/approval workflow untuk `milestone_costs` (realisasi biaya) agar tidak langsung approved, tapi melalui proses:
**Draft → Submit → Approved/Rejected → Paid**

---

## STEP 1: Database Migration

### File: `backend/migrations/YYYYMMDDHHMMSS-add-approval-workflow-milestone-costs.js`

```javascript
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // 1. Add status column
      await queryInterface.addColumn('milestone_costs', 'status', {
        type: Sequelize.STRING(20),
        defaultValue: 'draft',
        allowNull: false
      }, { transaction });

      // 2. Add submission tracking
      await queryInterface.addColumn('milestone_costs', 'submitted_by', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('milestone_costs', 'submitted_at', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });

      // 3. Add rejection tracking
      await queryInterface.addColumn('milestone_costs', 'rejection_reason', {
        type: Sequelize.TEXT,
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('milestone_costs', 'rejected_by', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });

      await queryInterface.addColumn('milestone_costs', 'rejected_at', {
        type: Sequelize.DATE,
        allowNull: true
      }, { transaction });

      // 4. Add link to finance transaction
      await queryInterface.addColumn('milestone_costs', 'finance_transaction_id', {
        type: Sequelize.STRING(255),
        allowNull: true
      }, { transaction });

      // 5. Create indexes
      await queryInterface.addIndex('milestone_costs', ['status'], {
        name: 'idx_milestone_costs_status',
        transaction
      });

      await queryInterface.addIndex('milestone_costs', ['submitted_at'], {
        name: 'idx_milestone_costs_submitted',
        transaction
      });

      await queryInterface.addIndex('milestone_costs', ['finance_transaction_id'], {
        name: 'idx_milestone_costs_finance_txn',
        transaction
      });

      // 6. Migrate existing data (set to 'approved' untuk backward compatibility)
      await queryInterface.sequelize.query(`
        UPDATE milestone_costs
        SET status = 'approved',
            submitted_by = recorded_by,
            submitted_at = recorded_at,
            approved_at = recorded_at
        WHERE status = 'draft' AND recorded_at IS NOT NULL;
      `, { transaction });

      await transaction.commit();
      console.log('✅ Migration completed: approval workflow added to milestone_costs');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    
    try {
      // Remove indexes
      await queryInterface.removeIndex('milestone_costs', 'idx_milestone_costs_status', { transaction });
      await queryInterface.removeIndex('milestone_costs', 'idx_milestone_costs_submitted', { transaction });
      await queryInterface.removeIndex('milestone_costs', 'idx_milestone_costs_finance_txn', { transaction });

      // Remove columns
      await queryInterface.removeColumn('milestone_costs', 'status', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'submitted_by', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'submitted_at', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rejection_reason', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rejected_by', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'rejected_at', { transaction });
      await queryInterface.removeColumn('milestone_costs', 'finance_transaction_id', { transaction });

      await transaction.commit();
      console.log('✅ Rollback completed: approval workflow removed');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
};
```

### Run Migration
```bash
# In backend container
docker-compose exec backend npm run migrate

# Or manually
docker-compose exec backend npx sequelize-cli db:migrate
```

---

## STEP 2: Backend API Implementation

### File: `backend/routes/projects/milestoneDetail.routes.js`

Add new endpoints after existing `/costs` routes:

```javascript
/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/submit
 * @desc    Submit cost realization for approval
 * @access  Private (Requester or Admin)
 */
router.post('/:projectId/milestones/:milestoneId/costs/:costId/submit', async (req, res) => {
  try {
    const { costId } = req.params;
    const userId = req.user?.id || req.body.userId; // From auth middleware

    // Find cost
    const cost = await sequelize.query(`
      SELECT * FROM milestone_costs
      WHERE id = :costId AND deleted_at IS NULL
    `, {
      replacements: { costId },
      type: sequelize.QueryTypes.SELECT
    });

    if (cost.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cost realization not found'
      });
    }

    const currentCost = cost[0];

    // Validate status
    if (currentCost.status !== 'draft') {
      return res.status(400).json({
        success: false,
        error: `Cannot submit. Current status: ${currentCost.status}`
      });
    }

    // Update to submitted
    await sequelize.query(`
      UPDATE milestone_costs
      SET status = 'submitted',
          submitted_by = :userId,
          submitted_at = NOW(),
          updated_at = NOW()
      WHERE id = :costId
    `, {
      replacements: { costId, userId }
    });

    res.json({
      success: true,
      message: 'Cost realization submitted for approval',
      data: { id: costId, status: 'submitted' }
    });

  } catch (error) {
    console.error('Error submitting cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit cost realization',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/approve
 * @desc    Approve cost realization
 * @access  Private (Supervisor/Manager only)
 */
router.post('/:projectId/milestones/:milestoneId/costs/:costId/approve', async (req, res) => {
  try {
    const { costId } = req.params;
    const { notes } = req.body;
    const userId = req.user?.id || req.body.userId;

    // TODO: Check user role (must be supervisor/manager)
    // if (req.user.role !== 'supervisor' && req.user.role !== 'manager') {
    //   return res.status(403).json({ error: 'Unauthorized. Only supervisors can approve.' });
    // }

    // Find cost
    const cost = await sequelize.query(`
      SELECT * FROM milestone_costs
      WHERE id = :costId AND deleted_at IS NULL
    `, {
      replacements: { costId },
      type: sequelize.QueryTypes.SELECT
    });

    if (cost.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cost realization not found'
      });
    }

    const currentCost = cost[0];

    // Validate status
    if (currentCost.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        error: `Cannot approve. Current status: ${currentCost.status}. Must be 'submitted'.`
      });
    }

    // Update to approved
    await sequelize.query(`
      UPDATE milestone_costs
      SET status = 'approved',
          approved_by = :userId,
          approved_at = NOW(),
          updated_at = NOW(),
          metadata = jsonb_set(
            COALESCE(metadata, '{}'::jsonb),
            '{approval_notes}',
            to_jsonb(:notes::text)
          )
      WHERE id = :costId
    `, {
      replacements: { costId, userId, notes: notes || '' }
    });

    res.json({
      success: true,
      message: 'Cost realization approved',
      data: { id: costId, status: 'approved' }
    });

  } catch (error) {
    console.error('Error approving cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve cost realization',
      details: error.message
    });
  }
});

/**
 * @route   POST /api/projects/:projectId/milestones/:milestoneId/costs/:costId/reject
 * @desc    Reject cost realization
 * @access  Private (Supervisor/Manager only)
 */
router.post('/:projectId/milestones/:milestoneId/costs/:costId/reject', async (req, res) => {
  try {
    const { costId } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id || req.body.userId;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required'
      });
    }

    // Find cost
    const cost = await sequelize.query(`
      SELECT * FROM milestone_costs
      WHERE id = :costId AND deleted_at IS NULL
    `, {
      replacements: { costId },
      type: sequelize.QueryTypes.SELECT
    });

    if (cost.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Cost realization not found'
      });
    }

    const currentCost = cost[0];

    // Validate status
    if (currentCost.status !== 'submitted') {
      return res.status(400).json({
        success: false,
        error: `Cannot reject. Current status: ${currentCost.status}. Must be 'submitted'.`
      });
    }

    // Update to rejected
    await sequelize.query(`
      UPDATE milestone_costs
      SET status = 'rejected',
          rejected_by = :userId,
          rejected_at = NOW(),
          rejection_reason = :reason,
          updated_at = NOW()
      WHERE id = :costId
    `, {
      replacements: { costId, userId, reason }
    });

    res.json({
      success: true,
      message: 'Cost realization rejected',
      data: { id: costId, status: 'rejected', reason }
    });

  } catch (error) {
    console.error('Error rejecting cost:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to reject cost realization',
      details: error.message
    });
  }
});

/**
 * @route   GET /api/projects/:projectId/milestones/:milestoneId/costs/pending
 * @desc    Get all pending cost realizations for approval
 * @access  Private (Supervisor/Manager)
 */
router.get('/:projectId/milestones/:milestoneId/costs/pending', async (req, res) => {
  try {
    const { milestoneId } = req.params;

    const pendingCosts = await sequelize.query(`
      SELECT 
        mc.*,
        u.username as recorded_by_name,
        su.username as submitted_by_name,
        ea.account_name as expense_account_name,
        sa.account_name as source_account_name
      FROM milestone_costs mc
      LEFT JOIN users u ON mc.recorded_by = u.id
      LEFT JOIN users su ON mc.submitted_by = su.id
      LEFT JOIN chart_of_accounts ea ON mc.account_id = ea.id
      LEFT JOIN chart_of_accounts sa ON mc.source_account_id = sa.id
      WHERE mc.milestone_id = :milestoneId
        AND mc.status = 'submitted'
        AND mc.deleted_at IS NULL
      ORDER BY mc.submitted_at DESC
    `, {
      replacements: { milestoneId },
      type: sequelize.QueryTypes.SELECT
    });

    res.json({
      success: true,
      data: pendingCosts,
      count: pendingCosts.length
    });

  } catch (error) {
    console.error('Error fetching pending costs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch pending approvals',
      details: error.message
    });
  }
});
```

### Modify POST /costs Endpoint

Update existing POST endpoint to save with `status='draft'` by default:

```javascript
// In POST /:projectId/milestones/:milestoneId/costs

// After validation, before INSERT:
const status = req.query.submit === 'true' ? 'submitted' : 'draft';
const submittedBy = status === 'submitted' ? req.user?.id : null;
const submittedAt = status === 'submitted' ? 'NOW()' : null;

// Then in INSERT query:
await sequelize.query(`
  INSERT INTO milestone_costs (
    milestone_id, cost_category, cost_type, amount, description,
    recorded_by, account_id, source_account_id, rab_item_id,
    is_rab_linked, rab_item_progress, status, submitted_by, submitted_at
  ) VALUES (
    :milestoneId, :costCategory, :costType, :amount, :description,
    :recordedBy, :accountId, :sourceAccountId, :rabItemId,
    :isRabLinked, :rabItemProgress, :status, :submittedBy, ${submittedAt}
  ) RETURNING *
`, {
  replacements: {
    // existing replacements...
    status,
    submittedBy
  }
});
```

---

## STEP 3: Frontend Implementation

### File: `frontend/src/components/milestones/detail-tabs/costs/SimplifiedRABTable.js`

#### 3.1 Add Status Badge Component

```jsx
// Add after imports
const StatusBadge = ({ status }) => {
  const config = {
    draft: {
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      label: 'Draft'
    },
    submitted: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      border: 'border-yellow-300',
      label: 'Menunggu Approval'
    },
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Approved'
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-700',
      border: 'border-red-300',
      label: 'Ditolak'
    },
    paid: {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'Sudah Dibayar'
    }
  };

  const style = config[status] || config.draft;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${style.bg} ${style.text} ${style.border}`}>
      {style.label}
    </span>
  );
};
```

#### 3.2 Add Action Buttons for Each Status

```jsx
const ActionButtons = ({ realization, onSubmit, onApprove, onReject, onExecutePayment, currentUser }) => {
  const { status, recorded_by, id } = realization;

  // Draft: Can submit (only by creator)
  if (status === 'draft' && recorded_by === currentUser.id) {
    return (
      <button
        onClick={() => onSubmit(id)}
        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
      >
        Submit untuk Approval
      </button>
    );
  }

  // Submitted: Can approve/reject (only supervisor/manager)
  if (status === 'submitted' && (currentUser.role === 'supervisor' || currentUser.role === 'manager')) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onApprove(id)}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Approve
        </button>
        <button
          onClick={() => onReject(id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Reject
        </button>
      </div>
    );
  }

  // Approved: Can execute payment (only finance/manager)
  if (status === 'approved' && (currentUser.role === 'finance' || currentUser.role === 'manager')) {
    return (
      <button
        onClick={() => onExecutePayment(id)}
        className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
      >
        Execute Payment
      </button>
    );
  }

  // Rejected or Paid: Show status only
  return <StatusBadge status={status} />;
};
```

#### 3.3 Add Handler Functions

```jsx
const SimplifiedRABTable = ({ ...existingProps }) => {
  // ... existing state ...

  const [currentUser, setCurrentUser] = useState(() => {
    // Get from localStorage or auth context
    return JSON.parse(localStorage.getItem('user') || '{}');
  });

  // Submit for approval
  const handleSubmitForApproval = async (realizationId) => {
    if (!window.confirm('Submit realisasi ini untuk approval?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/milestones/${milestoneId}/costs/${realizationId}/submit`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit');
      }

      alert('Realisasi berhasil disubmit untuk approval!');
      
      // Reload data
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Approve realization
  const handleApprove = async (realizationId) => {
    const notes = prompt('Catatan approval (opsional):');
    if (notes === null) return; // User cancelled

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/milestones/${milestoneId}/costs/${realizationId}/approve`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ notes })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to approve');
      }

      alert('Realisasi berhasil di-approve!');
      
      // Reload data
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error approving:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Reject realization
  const handleReject = async (realizationId) => {
    const reason = prompt('Alasan rejection (wajib):');
    if (!reason || reason.trim() === '') {
      alert('Alasan rejection harus diisi!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:5000/api/projects/${projectId}/milestones/${milestoneId}/costs/${realizationId}/reject`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ reason })
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to reject');
      }

      alert('Realisasi ditolak.');
      
      // Reload data
      if (selectedItem?.id) {
        const data = await getRealizations(selectedItem.id);
        setRealizations(prev => ({ ...prev, [selectedItem.id]: data || [] }));
      }
    } catch (error) {
      console.error('Error rejecting:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Execute payment (Phase 2)
  const handleExecutePayment = async (realizationId) => {
    alert('Feature "Execute Payment" akan diimplementasi di Phase 2');
    // TODO: Open modal for payment details
    // Then create finance_transaction
  };

  // ... rest of component ...

  return (
    <div>
      {/* ... existing table ... */}
      
      {/* Add ActionButtons in realization row */}
      {expandedItems[item.id] && realizations[item.id]?.map(real => (
        <tr key={real.id}>
          <td>{/* ... existing columns ... */}</td>
          <td>
            <StatusBadge status={real.status || 'draft'} />
          </td>
          <td>
            <ActionButtons
              realization={real}
              onSubmit={handleSubmitForApproval}
              onApprove={handleApprove}
              onReject={handleReject}
              onExecutePayment={handleExecutePayment}
              currentUser={currentUser}
            />
          </td>
        </tr>
      ))}
    </div>
  );
};
```

---

## STEP 4: Testing Checklist

### Unit Tests
- [ ] POST /costs saves with status='draft' by default
- [ ] POST /costs with ?submit=true saves as 'submitted'
- [ ] POST /costs/:id/submit changes draft → submitted
- [ ] POST /costs/:id/approve changes submitted → approved
- [ ] POST /costs/:id/reject changes submitted → rejected
- [ ] Cannot approve/reject if status != 'submitted'
- [ ] Cannot submit if status != 'draft'

### Integration Tests
- [ ] User creates realization → status = 'draft'
- [ ] User clicks "Submit" → status = 'submitted'
- [ ] Supervisor sees pending approval list
- [ ] Supervisor approves → approved_by & approved_at populated
- [ ] Supervisor rejects → rejection_reason required
- [ ] Rejected realization cannot be submitted again (must edit first)

### UI Tests
- [ ] Status badge displays correctly for each status
- [ ] Action buttons only show based on role & status
- [ ] Requester can only submit their own drafts
- [ ] Supervisor can approve/reject any submitted realization
- [ ] Status updates in real-time after action

---

## STEP 5: Deployment

### Pre-Deployment
```bash
# 1. Backup database
docker-compose exec postgres pg_dump -U admin nusantara_construction > backup_before_approval_workflow.sql

# 2. Run migration in staging first
docker-compose exec backend npm run migrate

# 3. Test all endpoints
# 4. Run frontend build
docker-compose exec frontend npm run build
```

### Deployment
```bash
# 1. Stop services
docker-compose down

# 2. Pull latest code
git pull origin main

# 3. Rebuild containers
docker-compose build

# 4. Start services
docker-compose up -d

# 5. Run migration
docker-compose exec backend npm run migrate

# 6. Verify services
docker-compose ps
docker-compose logs -f backend | grep "migration"
```

### Post-Deployment
- [ ] Test create realization → should be draft
- [ ] Test submit → should change to submitted
- [ ] Test approve/reject as supervisor
- [ ] Monitor backend logs for errors
- [ ] Check database: SELECT * FROM milestone_costs WHERE status IS NOT NULL;

---

## Rollback Plan

If issues occur:

```bash
# 1. Rollback migration
docker-compose exec backend npx sequelize-cli db:migrate:undo

# 2. Restore database backup
docker-compose exec -T postgres psql -U admin nusantara_construction < backup_before_approval_workflow.sql

# 3. Revert code
git revert <commit-hash>

# 4. Rebuild and restart
docker-compose down
docker-compose up -d --build
```

---

**Document Version:** 1.0  
**Phase:** 1 (Approval Workflow)  
**Estimated Time:** 3-5 days  
**Status:** 🟢 Ready for Implementation
