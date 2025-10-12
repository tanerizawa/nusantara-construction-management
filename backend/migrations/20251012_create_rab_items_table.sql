-- Migration: Create rab_items table for RAB Integration
-- This table is required for milestone RAB integration features

CREATE TABLE IF NOT EXISTS rab_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id VARCHAR(32) NOT NULL,
  category VARCHAR(128) NOT NULL,
  description TEXT,
  quantity DECIMAL(15,2) NOT NULL DEFAULT 0,
  unit_price DECIMAL(15,2) NOT NULL DEFAULT 0,
  unit VARCHAR(32),
  approval_status VARCHAR(32) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rab_items_project ON rab_items(project_id);
CREATE INDEX IF NOT EXISTS idx_rab_items_category ON rab_items(category);
CREATE INDEX IF NOT EXISTS idx_rab_items_approval_status ON rab_items(approval_status);

COMMENT ON TABLE rab_items IS 'RAB items for project budgeting and milestone integration.';
COMMENT ON COLUMN rab_items.category IS 'Category name for grouping RAB items.';
COMMENT ON COLUMN rab_items.approval_status IS 'Approval status: approved, pending, rejected, etc.';
