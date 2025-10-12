-- Migration: Add RAB Integration to Milestones
-- Date: 2025-01-12
-- Phase 1: Foundation

-- ============================================
-- 1. Enhance milestones table
-- ============================================

-- Add category link support
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS category_link JSONB DEFAULT NULL;

-- Add workflow progress tracking
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS workflow_progress JSONB DEFAULT NULL;

-- Add alerts
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS alerts JSONB DEFAULT '[]'::jsonb;

-- Add auto-generated flag
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false;

-- Add last sync timestamp
ALTER TABLE milestones 
ADD COLUMN IF NOT EXISTS last_synced TIMESTAMP DEFAULT NULL;

-- Add comments
COMMENT ON COLUMN milestones.category_link IS 'Links milestone to RAB category: {enabled, category_id, category_name, auto_generated}';
COMMENT ON COLUMN milestones.workflow_progress IS 'Tracks workflow stages: {rab_approved, purchase_orders, receipts, berita_acara, payments}';
COMMENT ON COLUMN milestones.alerts IS 'Active alerts for this milestone';
COMMENT ON COLUMN milestones.auto_generated IS 'Was this milestone auto-suggested from RAB?';
COMMENT ON COLUMN milestones.last_synced IS 'Last time workflow data was synced';

-- ============================================
-- 2. Create milestone_items table
-- ============================================

CREATE TABLE IF NOT EXISTS milestone_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  rab_item_id UUID REFERENCES rab_items(id) ON DELETE SET NULL,
  
  -- Item details (denormalized for performance)
  description TEXT NOT NULL,
  unit VARCHAR(50),
  
  -- Quantity tracking across workflow
  quantity_planned DECIMAL(15,2) DEFAULT 0,      -- From RAB
  quantity_po DECIMAL(15,2) DEFAULT 0,           -- From Purchase Orders
  quantity_received DECIMAL(15,2) DEFAULT 0,     -- From Tanda Terima
  quantity_completed DECIMAL(15,2) DEFAULT 0,    -- From Berita Acara
  quantity_remaining DECIMAL(15,2) DEFAULT 0,    -- Calculated
  
  -- Value tracking across workflow
  value_planned DECIMAL(15,2) DEFAULT 0,         -- From RAB
  value_po DECIMAL(15,2) DEFAULT 0,              -- From Purchase Orders
  value_received DECIMAL(15,2) DEFAULT 0,        -- From Tanda Terima
  value_completed DECIMAL(15,2) DEFAULT 0,       -- From Berita Acara
  value_paid DECIMAL(15,2) DEFAULT 0,            -- From Progress Payments
  
  -- Status tracking
  status VARCHAR(50) DEFAULT 'planning',
  -- Status values: planning, procured, delivered, in_progress, completed
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id),
  CONSTRAINT fk_rab_item FOREIGN KEY (rab_item_id) REFERENCES rab_items(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_milestone_items_milestone ON milestone_items(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_items_rab ON milestone_items(rab_item_id);
CREATE INDEX IF NOT EXISTS idx_milestone_items_status ON milestone_items(status);

COMMENT ON TABLE milestone_items IS 'Tracks individual RAB items within a milestone across the full workflow';
COMMENT ON COLUMN milestone_items.status IS 'planning|procured|delivered|in_progress|completed';

-- ============================================
-- 3. Create milestone_dependencies table
-- ============================================

CREATE TABLE IF NOT EXISTS milestone_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  depends_on_milestone_id UUID NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  
  -- Dependency configuration
  dependency_type VARCHAR(50) DEFAULT 'finish-to-start',
  -- Types: finish-to-start, start-to-start, finish-to-finish, start-to-finish
  lag_days INTEGER DEFAULT 0,
  -- Positive = delay, negative = lead time
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Metadata
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID REFERENCES users(id),
  
  -- Prevent self-dependency
  CONSTRAINT no_self_dependency CHECK (milestone_id != depends_on_milestone_id),
  CONSTRAINT unique_dependency UNIQUE (milestone_id, depends_on_milestone_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_milestone_deps_milestone ON milestone_dependencies(milestone_id);
CREATE INDEX IF NOT EXISTS idx_milestone_deps_depends_on ON milestone_dependencies(depends_on_milestone_id);

COMMENT ON TABLE milestone_dependencies IS 'Defines dependencies between milestones for project scheduling';
COMMENT ON COLUMN milestone_dependencies.dependency_type IS 'finish-to-start|start-to-start|finish-to-finish|start-to-finish';

-- ============================================
-- 4. Create helper views
-- ============================================

-- View: Milestone progress summary
CREATE OR REPLACE VIEW milestone_progress_summary AS
SELECT 
  m.id,
  m.title,
  m.project_id,
  m.status,
  m.progress_percentage as overall_progress,
  
  -- Item counts
  COUNT(mi.id) as total_items,
  COUNT(CASE WHEN mi.status = 'completed' THEN 1 END) as completed_items,
  COUNT(CASE WHEN mi.status = 'in_progress' THEN 1 END) as in_progress_items,
  COUNT(CASE WHEN mi.status = 'planning' THEN 1 END) as planning_items,
  
  -- Value summary
  COALESCE(SUM(mi.value_planned), 0) as total_value_planned,
  COALESCE(SUM(mi.value_po), 0) as total_value_po,
  COALESCE(SUM(mi.value_received), 0) as total_value_received,
  COALESCE(SUM(mi.value_completed), 0) as total_value_completed,
  COALESCE(SUM(mi.value_paid), 0) as total_value_paid,
  
  -- Progress calculations
  CASE 
    WHEN COALESCE(SUM(mi.value_planned), 0) > 0 
    THEN ROUND((COALESCE(SUM(mi.value_completed), 0) * 100.0 / SUM(mi.value_planned)), 2)
    ELSE 0 
  END as value_progress_percentage,
  
  -- Category info
  m.category_link->>'category_name' as category_name,
  (m.category_link->>'enabled')::boolean as has_category_link,
  
  -- Sync status
  m.last_synced,
  CASE 
    WHEN m.last_synced IS NULL THEN 'never'
    WHEN m.last_synced < NOW() - INTERVAL '1 hour' THEN 'stale'
    ELSE 'recent'
  END as sync_status
  
FROM milestones m
LEFT JOIN milestone_items mi ON m.id = mi.milestone_id
GROUP BY m.id, m.title, m.project_id, m.status, m.progress_percentage, m.category_link, m.last_synced;

COMMENT ON VIEW milestone_progress_summary IS 'Provides aggregated progress data for all milestones';

-- ============================================
-- 5. Create update triggers
-- ============================================

-- Function: Update milestone_items updated_at
CREATE OR REPLACE FUNCTION update_milestone_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for milestone_items
DROP TRIGGER IF EXISTS trigger_milestone_items_updated_at ON milestone_items;
CREATE TRIGGER trigger_milestone_items_updated_at
  BEFORE UPDATE ON milestone_items
  FOR EACH ROW
  EXECUTE FUNCTION update_milestone_items_updated_at();

-- ============================================
-- 6. Sample data structure (for reference)
-- ============================================

-- Example category_link structure:
/*
{
  "enabled": true,
  "category_id": "uuid",
  "category_name": "Pekerjaan Tanah",
  "auto_generated": false
}
*/

-- Example workflow_progress structure:
/*
{
  "rab_approved": {
    "status": true,
    "total_value": 50000000,
    "total_items": 8,
    "approved_date": "2024-12-15"
  },
  "purchase_orders": {
    "total_count": 3,
    "approved_count": 2,
    "pending_count": 1,
    "total_value": 48000000
  },
  "receipts": {
    "received_count": 1,
    "expected_count": 2,
    "received_value": 20000000,
    "pending_value": 28000000
  },
  "berita_acara": {
    "total_count": 0,
    "completed_percentage": 0,
    "total_value": 0
  },
  "payments": {
    "paid_count": 0,
    "paid_value": 0,
    "pending_value": 50000000,
    "payment_percentage": 0
  }
}
*/

-- Example alerts structure:
/*
[
  {
    "id": "uuid",
    "type": "delivery_delay",
    "severity": "medium",
    "message": "PO-002 approved 7 days ago, material not received",
    "created_at": "2025-01-05",
    "dismissed": false
  }
]
*/

-- ============================================
-- 7. Rollback script (if needed)
-- ============================================

-- To rollback this migration:
/*
DROP VIEW IF EXISTS milestone_progress_summary CASCADE;
DROP TRIGGER IF EXISTS trigger_milestone_items_updated_at ON milestone_items;
DROP FUNCTION IF EXISTS update_milestone_items_updated_at();
DROP TABLE IF EXISTS milestone_dependencies CASCADE;
DROP TABLE IF EXISTS milestone_items CASCADE;

ALTER TABLE milestones DROP COLUMN IF EXISTS category_link;
ALTER TABLE milestones DROP COLUMN IF EXISTS workflow_progress;
ALTER TABLE milestones DROP COLUMN IF EXISTS alerts;
ALTER TABLE milestones DROP COLUMN IF EXISTS auto_generated;
ALTER TABLE milestones DROP COLUMN IF EXISTS last_synced;
*/
