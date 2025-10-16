# 🎯 User Trail Implementation Plan - Activity Timeline

**Date**: October 13, 2025  
**Objective**: Implement proper user tracking (created, updated, deleted by) for timeline activities

---

## 📋 Current Situation Analysis

### Current Tables:

**milestone_costs**:
- ✅ `recorded_by` (user who created)
- ✅ `recorded_at` (timestamp)
- ✅ `approved_by` (user who approved)
- ✅ `approved_at` (timestamp)
- ❌ **Missing**: `updated_by`
- ❌ **Missing**: `deleted_by`
- ❌ **Missing**: `deleted_at` (soft delete)

**milestone_activities**:
- ✅ `performed_by` (user who performed action)
- ✅ `performed_at` (timestamp)
- ✅ `activity_type` (cost_added, cost_updated, cost_deleted, etc.)
- ✅ `related_cost_id` (link to cost)

### Current Timeline Display Issues:
- ❌ Shows "Cost entry (deleted)" without context
- ❌ No info WHO deleted it
- ❌ No info WHEN deleted
- ❌ Hard delete loses all audit trail

---

## 🎯 Proposed Solution: Enhanced User Trail

### Phase 1: Add Soft Delete to milestone_costs ✅ RECOMMENDED

#### 1.1 Database Migration
```sql
-- Add soft delete columns to milestone_costs
ALTER TABLE milestone_costs 
  ADD COLUMN updated_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN deleted_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN deleted_at TIMESTAMP WITHOUT TIME ZONE;

-- Add indexes for performance
CREATE INDEX idx_milestone_costs_deleted ON milestone_costs(deleted_at);
CREATE INDEX idx_milestone_costs_updated_by ON milestone_costs(updated_by);
CREATE INDEX idx_milestone_costs_deleted_by ON milestone_costs(deleted_by);
```

#### 1.2 Benefits:
- ✅ Keep cost data in database (audit compliance)
- ✅ Track WHO deleted the cost
- ✅ Track WHEN deleted
- ✅ Can restore if needed
- ✅ Full audit trail preserved

---

### Phase 2: Update Backend Logic

#### 2.1 Cost Queries - Filter Soft Deleted
```javascript
// GET costs - exclude deleted
WHERE milestone_id = ? AND deleted_at IS NULL

// Include deleted (for admin audit view)
WHERE milestone_id = ? 
```

#### 2.2 Cost DELETE Endpoint - Soft Delete
```javascript
router.delete('/:projectId/milestones/:milestoneId/costs/:costId', async (req, res) => {
  const userId = req.user?.id;
  
  // Soft delete
  await sequelize.query(
    `UPDATE milestone_costs 
     SET deleted_by = :userId, 
         deleted_at = CURRENT_TIMESTAMP 
     WHERE id = :costId`,
    { replacements: { userId, costId } }
  );
  
  // Create activity log
  await MilestoneActivity.create({
    milestone_id: milestoneId,
    activity_type: 'cost_deleted',
    activity_title: `Cost deleted: ${cost.cost_category}`,
    activity_description: `Deleted ${cost.cost_type} cost of ${cost.amount}`,
    performed_by: userId,
    related_cost_id: costId,
    metadata: { 
      cost_category: cost.cost_category,
      amount: cost.amount,
      reason: req.body.reason 
    }
  });
});
```

#### 2.3 Cost UPDATE Endpoint - Track updater
```javascript
router.put('/:projectId/milestones/:milestoneId/costs/:costId', async (req, res) => {
  const userId = req.user?.id;
  
  await sequelize.query(
    `UPDATE milestone_costs 
     SET amount = :amount,
         description = :description,
         updated_by = :userId,
         updated_at = CURRENT_TIMESTAMP
     WHERE id = :costId`,
    { replacements: { ...req.body, userId, costId } }
  );
  
  // Create activity log
  await MilestoneActivity.create({
    milestone_id: milestoneId,
    activity_type: 'cost_updated',
    activity_title: `Cost updated: ${cost.cost_category}`,
    activity_description: `Updated amount from ${oldAmount} to ${newAmount}`,
    performed_by: userId,
    related_cost_id: costId,
    metadata: { 
      old_amount: oldAmount,
      new_amount: newAmount 
    }
  });
});
```

---

### Phase 3: Enhanced Activity Timeline Display

#### 3.1 Backend - Enrich Activities with User Names

```javascript
// Get activities with user names
const enrichedActivities = await Promise.all(
  activities.map(async (activity) => {
    let performerName = null;
    let costInfo = null;
    
    // Get performer name
    if (activity.performed_by) {
      const user = await sequelize.query(
        'SELECT name FROM users WHERE id = :userId LIMIT 1',
        { 
          replacements: { userId: activity.performed_by },
          type: sequelize.QueryTypes.SELECT,
          plain: true
        }
      );
      performerName = user?.name || 'Unknown User';
    }
    
    // Get cost info including who deleted it
    if (activity.related_cost_id) {
      const cost = await sequelize.query(
        `SELECT 
          c.amount, 
          c.cost_category,
          c.deleted_at,
          u1.name as recorded_by_name,
          u2.name as deleted_by_name
         FROM milestone_costs c
         LEFT JOIN users u1 ON c.recorded_by = u1.id
         LEFT JOIN users u2 ON c.deleted_by = u2.id
         WHERE c.id = :costId 
         LIMIT 1`,
        { 
          replacements: { costId: activity.related_cost_id },
          type: sequelize.QueryTypes.SELECT,
          plain: true
        }
      );
      
      costInfo = {
        amount: cost?.amount ?? null,
        category: cost?.cost_category ?? null,
        is_deleted: !!cost?.deleted_at,
        deleted_at: cost?.deleted_at ?? null,
        recorded_by_name: cost?.recorded_by_name ?? null,
        deleted_by_name: cost?.deleted_by_name ?? null
      };
    }
    
    return {
      ...activity,
      performer_name: performerName,
      cost_info: costInfo
    };
  })
);
```

#### 3.2 Frontend - Display User Trail

```jsx
// ActivityTab.js
{activity.related_cost_id && (
  <>
    <span>•</span>
    {activity.cost_info?.is_deleted ? (
      // Cost was deleted - show who deleted it
      <span 
        className="flex items-center gap-1 text-[#636366] line-through opacity-60"
        title={`Deleted by ${activity.cost_info.deleted_by_name} on ${formatDate(activity.cost_info.deleted_at)}`}
      >
        <DollarSign size={12} />
        <span>
          Cost deleted by {activity.cost_info.deleted_by_name}
        </span>
      </span>
    ) : activity.cost_info?.amount ? (
      // Cost exists - show amount and creator
      <span 
        className="flex items-center gap-1"
        title={`Created by ${activity.cost_info.recorded_by_name}`}
      >
        <DollarSign size={12} />
        <span>
          Cost: Rp {activity.cost_info.amount.toLocaleString('id-ID')}
        </span>
      </span>
    ) : null}
  </>
)}
```

#### 3.3 Timeline Display Examples:

**Cost Added:**
```
💰 Cost added: contingency
   By: John Doe
   Amount: Rp 1.000.000.000
   7 hours ago
```

**Cost Updated:**
```
💰 Cost updated: labor
   By: Jane Smith
   Changed: Rp 5.000.000 → Rp 7.000.000
   2 hours ago
```

**Cost Deleted:**
```
💰̶ Cost deleted: materials
   By: Admin User
   Original amount: Rp 5.000.000
   1 hour ago
```

---

## 🚀 Implementation Steps

### Step 1: Database Migration (5 min)
```bash
# Create migration file
cd /root/APP-YK
cat > migrations/add_user_trail_to_costs.sql << 'EOF'
-- Add user trail columns to milestone_costs
ALTER TABLE milestone_costs 
  ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255) REFERENCES users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITHOUT TIME ZONE;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_milestone_costs_deleted ON milestone_costs(deleted_at);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_updated_by ON milestone_costs(updated_by);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_deleted_by ON milestone_costs(deleted_by);

-- Add comment for documentation
COMMENT ON COLUMN milestone_costs.updated_by IS 'User who last updated this cost entry';
COMMENT ON COLUMN milestone_costs.deleted_by IS 'User who soft-deleted this cost entry';
COMMENT ON COLUMN milestone_costs.deleted_at IS 'Timestamp when cost entry was soft-deleted';
EOF

# Run migration
docker-compose exec -T postgres psql -U admin -d nusantara_construction -f /app/migrations/add_user_trail_to_costs.sql
```

### Step 2: Update Backend Routes (30 min)
- [ ] Update GET costs endpoint - filter `deleted_at IS NULL`
- [ ] Update DELETE costs endpoint - soft delete with `deleted_by` and `deleted_at`
- [ ] Update PUT costs endpoint - track `updated_by`
- [ ] Update POST costs endpoint - ensure `recorded_by` is set
- [ ] Update GET activities endpoint - enrich with user names and cost info

### Step 3: Update Frontend Display (20 min)
- [ ] Update ActivityTab.js to show user names
- [ ] Add tooltips with full user trail info
- [ ] Style deleted items differently
- [ ] Add "Created by", "Updated by", "Deleted by" labels

### Step 4: Testing (15 min)
- [ ] Test cost creation - should log recorded_by
- [ ] Test cost update - should log updated_by
- [ ] Test cost deletion - should soft delete with deleted_by
- [ ] Test timeline display - should show user names
- [ ] Test activity filter - should exclude deleted costs by default

---

## 📊 Data Structure Changes

### Before:
```json
{
  "id": "cost-uuid",
  "amount": 1000000000,
  "recorded_by": "user-uuid",  // ✅ Has creator
  "recorded_at": "2025-10-13T10:00:00Z",
  // ❌ No updater tracking
  // ❌ Hard delete (data lost)
}
```

### After:
```json
{
  "id": "cost-uuid",
  "amount": 1000000000,
  "recorded_by": "user-uuid",        // ✅ Creator
  "recorded_at": "2025-10-13T10:00:00Z",
  "updated_by": "user-uuid-2",       // ✅ Last updater
  "updated_at": "2025-10-13T12:00:00Z",
  "deleted_by": "user-uuid-3",       // ✅ Who deleted
  "deleted_at": "2025-10-13T14:00:00Z"  // ✅ Soft delete
}
```

---

## 🎯 Benefits of This Approach

### 1. Full Audit Trail ✅
- Track WHO created each cost
- Track WHO updated each cost
- Track WHO deleted each cost
- Track WHEN each action occurred

### 2. Data Preservation ✅
- Soft delete keeps all data
- Can restore deleted items
- Historical data maintained
- Compliance-friendly

### 3. Better UX ✅
- Clear user attribution
- Transparent actions
- No confusion about deleted items
- Professional audit log

### 4. Accountability ✅
- Every action has a responsible user
- Can track user behavior
- Can investigate issues
- Can generate reports

---

## 🔄 Migration Strategy

### For Existing Data:
```sql
-- Set recorded_by for existing costs without it
UPDATE milestone_costs 
SET recorded_by = (
  SELECT performed_by 
  FROM milestone_activities 
  WHERE related_cost_id = milestone_costs.id 
    AND activity_type = 'cost_added' 
  LIMIT 1
)
WHERE recorded_by IS NULL;
```

---

## 📝 API Response Structure (New)

### GET /activities Response:
```json
{
  "success": true,
  "data": [
    {
      "id": "activity-uuid",
      "activity_type": "cost_added",
      "activity_title": "Cost added: contingency",
      "performed_by": "user-uuid",
      "performed_at": "2025-10-13T17:06:00Z",
      "performer_name": "John Doe",            // ← NEW
      "related_cost_id": "cost-uuid",
      "cost_info": {                            // ← NEW
        "amount": 1000000000,
        "category": "contingency",
        "is_deleted": false,
        "deleted_at": null,
        "recorded_by_name": "John Doe",
        "deleted_by_name": null
      }
    },
    {
      "id": "activity-uuid-2",
      "activity_type": "cost_deleted",
      "activity_title": "Cost deleted: materials",
      "performed_by": "admin-uuid",
      "performed_at": "2025-10-13T18:00:00Z",
      "performer_name": "Admin User",
      "related_cost_id": "cost-uuid-2",
      "cost_info": {
        "amount": 5000000,
        "category": "materials",
        "is_deleted": true,                     // ← Shows deleted
        "deleted_at": "2025-10-13T18:00:00Z",
        "recorded_by_name": "John Doe",
        "deleted_by_name": "Admin User"         // ← Who deleted
      }
    }
  ]
}
```

---

## ✅ Checklist

- [ ] Create database migration file
- [ ] Run migration on database
- [ ] Update Cost DELETE endpoint (soft delete)
- [ ] Update Cost UPDATE endpoint (track updated_by)
- [ ] Update Cost GET endpoints (filter deleted_at IS NULL)
- [ ] Update Activities GET endpoint (enrich with user info)
- [ ] Update frontend ActivityTab.js (display user names)
- [ ] Test cost creation
- [ ] Test cost update
- [ ] Test cost deletion (soft)
- [ ] Test timeline display
- [ ] Document API changes
- [ ] Create user guide

---

**Estimated Time**: 1-2 hours  
**Complexity**: Medium  
**Impact**: High (better UX and audit compliance)  
**Risk**: Low (backward compatible)

Ready to implement? 🚀
