-- Migration: Create work_orders table and rab_work_order_tracking table
-- Date: 2025-10-15
-- Purpose: Support Work Orders feature for services, labor, and equipment

-- Create work_orders table
CREATE TABLE IF NOT EXISTS work_orders (
  id VARCHAR(255) PRIMARY KEY,
  wo_number VARCHAR(255) UNIQUE NOT NULL,
  contractor_id VARCHAR(255),
  contractor_name VARCHAR(255) NOT NULL,
  contractor_contact VARCHAR(255) NOT NULL,
  contractor_address TEXT,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'in_progress', 'completed', 'cancelled')),
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DECIMAL(15, 2) NOT NULL DEFAULT 0,
  notes TEXT,
  project_id VARCHAR(255) REFERENCES projects(id),
  created_by VARCHAR(255) REFERENCES users(id),
  updated_by VARCHAR(255) REFERENCES users(id),
  approved_by VARCHAR(255) REFERENCES users(id),
  approved_at TIMESTAMP,
  approval_notes TEXT,
  rejected_by VARCHAR(255) REFERENCES users(id),
  rejected_at TIMESTAMP,
  rejection_reason TEXT,
  deleted BOOLEAN NOT NULL DEFAULT false,
  deleted_at TIMESTAMP,
  deleted_by VARCHAR(255) REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for work_orders
CREATE INDEX IF NOT EXISTS idx_work_orders_wo_number ON work_orders(wo_number);
CREATE INDEX IF NOT EXISTS idx_work_orders_contractor_id ON work_orders(contractor_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_work_orders_start_date ON work_orders(start_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_end_date ON work_orders(end_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_project_id ON work_orders(project_id);
CREATE INDEX IF NOT EXISTS idx_work_orders_created_by ON work_orders(created_by);
CREATE INDEX IF NOT EXISTS idx_work_orders_deleted ON work_orders(deleted);

-- Create rab_work_order_tracking table
CREATE TABLE IF NOT EXISTS rab_work_order_tracking (
  id SERIAL PRIMARY KEY,
  project_id VARCHAR(255) NOT NULL,
  rab_item_id VARCHAR(255) NOT NULL,
  wo_number VARCHAR(255),
  quantity DECIMAL(10, 2) NOT NULL,
  unit_price DECIMAL(15, 2) NOT NULL,
  total_amount DECIMAL(15, 2) NOT NULL,
  work_date TIMESTAMP NOT NULL DEFAULT NOW(),
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for rab_work_order_tracking
CREATE INDEX IF NOT EXISTS idx_rab_wo_tracking_project_id ON rab_work_order_tracking(project_id);
CREATE INDEX IF NOT EXISTS idx_rab_wo_tracking_rab_item_id ON rab_work_order_tracking(rab_item_id);
CREATE INDEX IF NOT EXISTS idx_rab_wo_tracking_wo_number ON rab_work_order_tracking(wo_number);
CREATE INDEX IF NOT EXISTS idx_rab_wo_tracking_status ON rab_work_order_tracking(status);

-- Add comment
COMMENT ON TABLE work_orders IS 'Work orders for services, labor, equipment, and overhead items';
COMMENT ON TABLE rab_work_order_tracking IS 'Tracking table for RAB items used in work orders';

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON TABLE work_orders TO your_app_user;
-- GRANT ALL PRIVILEGES ON TABLE rab_work_order_tracking TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE rab_work_order_tracking_id_seq TO your_app_user;
