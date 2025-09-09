-- Phase 1: Approval Workflow Foundation
-- Migration: Create approval workflow tables

-- 1. Approval Workflows Configuration
CREATE TABLE IF NOT EXISTS approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    entity_type VARCHAR(50) NOT NULL, -- 'rab', 'purchase_order', 'change_order', 'material_request'
    workflow_steps JSON NOT NULL, -- Array of approval steps with roles and conditions
    approval_limits JSON, -- Budget limits per role
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Approval Instances (Per RAB/Document)
CREATE TABLE IF NOT EXISTS approval_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES approval_workflows(id),
    entity_id VARCHAR(255) NOT NULL, -- RAB ID, PO ID, etc.
    entity_type VARCHAR(50) NOT NULL,
    entity_data JSON, -- Store entity summary data
    current_step INTEGER DEFAULT 1,
    overall_status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    total_amount DECIMAL(15,2) DEFAULT 0,
    submitted_by VARCHAR(255),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Individual Approval Steps
CREATE TABLE IF NOT EXISTS approval_steps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES approval_instances(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    step_name VARCHAR(255),
    approver_role VARCHAR(100),
    approver_user_id VARCHAR(255),
    required_role VARCHAR(100), -- Required role for this step
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'skipped'
    decision VARCHAR(50), -- 'approve', 'reject', 'approve_with_conditions'
    comments TEXT,
    conditions TEXT, -- Approval conditions if any
    approved_at TIMESTAMP,
    due_date TIMESTAMP,
    escalated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Approval Notifications
CREATE TABLE IF NOT EXISTS approval_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instance_id UUID REFERENCES approval_instances(id),
    step_id UUID REFERENCES approval_steps(id),
    recipient_user_id VARCHAR(255),
    notification_type VARCHAR(50), -- 'approval_request', 'approved', 'rejected', 'escalation'
    subject VARCHAR(255),
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'sent', 'read', 'failed'
    sent_at TIMESTAMP,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Enhanced Project RAB with approval tracking
ALTER TABLE project_rab ADD COLUMN IF NOT EXISTS approval_instance_id UUID REFERENCES approval_instances(id);
ALTER TABLE project_rab ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'draft';
ALTER TABLE project_rab ADD COLUMN IF NOT EXISTS submitted_for_approval_at TIMESTAMP;
ALTER TABLE project_rab ADD COLUMN IF NOT EXISTS final_approved_at TIMESTAMP;
ALTER TABLE project_rab ADD COLUMN IF NOT EXISTS approved_amount DECIMAL(15,2);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_approval_instances_entity ON approval_instances(entity_id, entity_type);
CREATE INDEX IF NOT EXISTS idx_approval_instances_status ON approval_instances(overall_status);
CREATE INDEX IF NOT EXISTS idx_approval_steps_approver ON approval_steps(approver_user_id, status);
CREATE INDEX IF NOT EXISTS idx_approval_steps_instance ON approval_steps(instance_id, step_number);
CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON approval_notifications(recipient_user_id, status);

-- 7. Insert default RAB approval workflow
INSERT INTO approval_workflows (
    name,
    description,
    entity_type,
    workflow_steps,
    approval_limits,
    created_by
) VALUES (
    'RAB Standard Approval',
    'Standard multi-level approval workflow for RAB (Rencana Anggaran Biaya)',
    'rab',
    '[
        {
            "step": 1,
            "name": "Project Manager Review",
            "role": "project_manager",
            "required": true,
            "parallel": false,
            "conditions": {"max_amount": 50000000}
        },
        {
            "step": 2,
            "name": "Site Manager Approval",
            "role": "site_manager", 
            "required": true,
            "parallel": false,
            "conditions": {"max_amount": 200000000}
        },
        {
            "step": 3,
            "name": "Operations Director Approval",
            "role": "operations_director",
            "required": true,
            "parallel": false,
            "conditions": {"max_amount": 1000000000}
        },
        {
            "step": 4,
            "name": "Finance Director Approval",
            "role": "finance_director",
            "required": true,
            "parallel": false,
            "conditions": {"min_amount": 200000000}
        },
        {
            "step": 5,
            "name": "CEO Final Approval",
            "role": "ceo",
            "required": true,
            "parallel": false,
            "conditions": {"min_amount": 1000000000}
        }
    ]'::json,
    '{
        "project_manager": 50000000,
        "site_manager": 200000000,
        "operations_director": 1000000000,
        "finance_director": 5000000000,
        "ceo": 999999999999
    }'::json,
    'system'
) ON CONFLICT (name, entity_type) DO NOTHING;

-- 8. Add approval-related triggers
CREATE OR REPLACE FUNCTION update_approval_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER approval_instances_updated_at
    BEFORE UPDATE ON approval_instances
    FOR EACH ROW
    EXECUTE FUNCTION update_approval_timestamp();

CREATE TRIGGER approval_steps_updated_at
    BEFORE UPDATE ON approval_steps
    FOR EACH ROW
    EXECUTE FUNCTION update_approval_timestamp();

COMMENT ON TABLE approval_workflows IS 'Configuration for different approval workflows';
COMMENT ON TABLE approval_instances IS 'Individual approval instances per document/RAB';
COMMENT ON TABLE approval_steps IS 'Individual approval steps within each instance';
COMMENT ON TABLE approval_notifications IS 'Notification tracking for approval process';
