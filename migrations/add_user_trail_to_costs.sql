-- Add user trail columns to milestone_costs for full audit tracking
-- Date: 2025-10-13

-- Add columns
ALTER TABLE milestone_costs 
  ADD COLUMN IF NOT EXISTS updated_by VARCHAR(255),
  ADD COLUMN IF NOT EXISTS deleted_by VARCHAR(255),
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITHOUT TIME ZONE;

-- Add foreign key constraints
ALTER TABLE milestone_costs
  ADD CONSTRAINT milestone_costs_updated_by_fkey 
    FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE milestone_costs
  ADD CONSTRAINT milestone_costs_deleted_by_fkey 
    FOREIGN KEY (deleted_by) REFERENCES users(id) ON DELETE SET NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_milestone_costs_deleted ON milestone_costs(deleted_at);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_updated_by ON milestone_costs(updated_by);
CREATE INDEX IF NOT EXISTS idx_milestone_costs_deleted_by ON milestone_costs(deleted_by);

-- Add comments for documentation
COMMENT ON COLUMN milestone_costs.updated_by IS 'User who last updated this cost entry';
COMMENT ON COLUMN milestone_costs.deleted_by IS 'User who soft-deleted this cost entry';
COMMENT ON COLUMN milestone_costs.deleted_at IS 'Timestamp when cost entry was soft-deleted (soft delete)';

-- Display result
SELECT 'User trail columns added successfully!' AS status;
