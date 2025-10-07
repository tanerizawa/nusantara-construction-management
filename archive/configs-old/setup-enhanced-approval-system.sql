-- ENHANCED APPROVAL SYSTEM FOR CONSTRUCTION INDUSTRY
-- Indonesian Construction Standards Compliance

-- 1. Enhanced User Roles for Construction Industry
INSERT INTO approval_workflows (
  id,
  name,
  description,
  entity_type,
  workflow_steps,
  approval_limits,
  is_active,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'RAB Construction Standard',
  'Multi-level RAB approval sesuai standar konstruksi Indonesia',
  'rab',
  '[
    {
      "step": 1,
      "name": "Project Manager Review",
      "role": "project_manager",
      "required": true,
      "parallel": false,
      "conditions": {
        "max_amount": 500000000,
        "technical_validation": true,
        "quantity_check": true
      },
      "sla_hours": 24
    },
    {
      "step": 2,
      "name": "Site Manager Validation",
      "role": "site_manager", 
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 100000000,
        "max_amount": 1000000000,
        "field_feasibility": true,
        "safety_compliance": true
      },
      "sla_hours": 48
    },
    {
      "step": 3,
      "name": "Operations Director Approval",
      "role": "operations_director",
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 500000000,
        "max_amount": 2000000000,
        "strategic_alignment": true,
        "risk_assessment": true
      },
      "sla_hours": 72
    },
    {
      "step": 4,
      "name": "Finance Director Authorization",
      "role": "finance_director",
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 1000000000,
        "max_amount": 5000000000,
        "budget_impact": true,
        "cash_flow_check": true
      },
      "sla_hours": 96
    },
    {
      "step": 5,
      "name": "Board of Directors Decision",
      "role": "board_member",
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 2000000000,
        "strategic_investment": true,
        "stakeholder_impact": true
      },
      "sla_hours": 168
    }
  ]'::json,
  '{
    "project_manager": 500000000,
    "site_manager": 1000000000,
    "operations_director": 2000000000,
    "finance_director": 5000000000,
    "board_member": 999999999999
  }'::json,
  true,
  'system',
  NOW(),
  NOW()
);

-- 2. Purchase Order Approval Workflow
INSERT INTO approval_workflows (
  id,
  name,
  description,
  entity_type,
  workflow_steps,
  approval_limits,
  is_active,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'PO Construction Standard',
  'Purchase Order approval untuk konstruksi dengan vendor management',
  'purchase_order',
  '[
    {
      "step": 1,
      "name": "Procurement Manager Review",
      "role": "procurement_manager",
      "required": true,
      "parallel": false,
      "conditions": {
        "max_amount": 100000000,
        "vendor_validation": true,
        "price_comparison": true,
        "contract_compliance": true
      },
      "sla_hours": 12
    },
    {
      "step": 2,
      "name": "Project Manager Approval",
      "role": "project_manager",
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 50000000,
        "max_amount": 500000000,
        "technical_specification": true,
        "timeline_alignment": true,
        "budget_allocation": true
      },
      "sla_hours": 24
    },
    {
      "step": 3,
      "name": "Operations Director Authorization", 
      "role": "operations_director",
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 200000000,
        "max_amount": 2000000000,
        "multi_project_coordination": true,
        "vendor_relationship": true,
        "risk_mitigation": true
      },
      "sla_hours": 48
    },
    {
      "step": 4,
      "name": "Finance Director Final Authorization",
      "role": "finance_director", 
      "required": true,
      "parallel": false,
      "conditions": {
        "min_amount": 1000000000,
        "financial_impact": true,
        "payment_terms": true,
        "cash_flow_optimization": true
      },
      "sla_hours": 72
    }
  ]'::json,
  '{
    "procurement_manager": 100000000,
    "project_manager": 500000000,
    "operations_director": 2000000000,
    "finance_director": 999999999999
  }'::json,
  true,
  'system',
  NOW(),
  NOW()
);

-- 3. Change Order Approval Workflow  
INSERT INTO approval_workflows (
  id,
  name,
  description,
  entity_type,
  workflow_steps,
  approval_limits,
  is_active,
  created_by,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'Change Order Standard',
  'Change order approval untuk modifikasi scope proyek konstruksi',
  'change_order',
  '[
    {
      "step": 1,
      "name": "Site Engineer Validation",
      "role": "site_engineer",
      "required": true,
      "parallel": false,
      "conditions": {
        "technical_necessity": true,
        "work_progress_impact": true,
        "resource_analysis": true
      },
      "sla_hours": 8
    },
    {
      "step": 2,
      "name": "Project Manager Assessment",
      "role": "project_manager",
      "required": true,
      "parallel": false,
      "conditions": {
        "scope_change_impact": true,
        "cost_benefit_analysis": true,
        "timeline_adjustment": true
      },
      "sla_hours": 24
    },
    {
      "step": 3,
      "name": "Operations Director Review",
      "role": "operations_director",
      "required": true,
      "parallel": false,
      "conditions": {
        "strategic_impact": true,
        "resource_reallocation": true,
        "risk_assessment": true
      },
      "sla_hours": 48
    },
    {
      "step": 4,
      "name": "Client Approval",
      "role": "client_representative",
      "required": true,
      "parallel": false,
      "conditions": {
        "scope_modification": true,
        "cost_adjustment": true,
        "timeline_extension": true,
        "contract_amendment": true
      },
      "sla_hours": 120
    }
  ]'::json,
  '{
    "site_engineer": 50000000,
    "project_manager": 200000000,
    "operations_director": 1000000000,
    "client_representative": 999999999999
  }'::json,
  true,
  'system',
  NOW(),
  NOW()
);

-- 4. Create sample approval instances for existing RAB data
-- For PRJ-2025-001 (Rp 13.58 miliar - requires up to Finance Director)
INSERT INTO approval_instances (
  id,
  workflow_id,
  entity_id,
  entity_type,
  entity_data,
  current_step,
  overall_status,
  total_amount,
  submitted_by,
  submitted_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM approval_workflows WHERE name = 'RAB Construction Standard' LIMIT 1),
  'PRJ-2025-001',
  'rab',
  '{
    "project_id": "PRJ-2025-001",
    "project_name": "Pembangunan Kompleks Perkantoran Karawang",
    "total_items": 3,
    "categories": ["Pekerjaan Persiapan", "Pekerjaan Pondasi", "Pekerjaan Struktur"],
    "submitted_reason": "RAB lengkap untuk tahap awal konstruksi kompleks perkantoran"
  }'::json,
  1,
  'pending',
  13575000000.00,
  'admin',
  NOW(),
  NOW(),
  NOW()
);

-- For PRJ-2025-003 (Rp 44+ miliar - requires Board approval)  
INSERT INTO approval_instances (
  id,
  workflow_id,
  entity_id,
  entity_type,
  entity_data,
  current_step,
  overall_status,
  total_amount,
  submitted_by,
  submitted_at,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM approval_workflows WHERE name = 'RAB Construction Standard' LIMIT 1),
  'PRJ-2025-003', 
  'rab',
  '{
    "project_id": "PRJ-2025-003",
    "project_name": "Pembangunan Rumah Sakit Umum Karawang",
    "total_items": 5,
    "categories": ["Pekerjaan Persiapan", "Pekerjaan Pondasi", "Peralatan Medis", "Pekerjaan Struktur", "Pekerjaan Finishing"],
    "submitted_reason": "RAB komprehensif untuk pembangunan rumah sakit 200 bed dengan fasilitas lengkap"
  }'::json,
  1,
  'pending',
  44500000000.00,
  'admin',
  NOW(),
  NOW(),
  NOW()
);

-- 5. Create approval steps for the instances
-- PRJ-2025-001 steps (requires 4 levels)
INSERT INTO approval_steps (
  id,
  instance_id,
  step_number,
  step_name,
  approver_role,
  required_role,
  status,
  due_date,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-001' LIMIT 1),
  1,
  'Project Manager Review',
  'project_manager',
  'project_manager',
  'pending',
  NOW() + INTERVAL '24 hours',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-001' LIMIT 1),
  2,
  'Site Manager Validation',
  'site_manager', 
  'site_manager',
  'waiting',
  NOW() + INTERVAL '48 hours',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-001' LIMIT 1),
  3,
  'Operations Director Approval',
  'operations_director',
  'operations_director', 
  'waiting',
  NOW() + INTERVAL '72 hours',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-001' LIMIT 1),
  4,
  'Finance Director Authorization',
  'finance_director',
  'finance_director',
  'waiting', 
  NOW() + INTERVAL '96 hours',
  NOW(),
  NOW()
);

-- PRJ-2025-003 steps (requires all 5 levels including Board)
INSERT INTO approval_steps (
  id,
  instance_id,
  step_number,
  step_name,
  approver_role,
  required_role,
  status,
  due_date,
  created_at,
  updated_at
) VALUES 
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-003' LIMIT 1),
  1,
  'Project Manager Review',
  'project_manager',
  'project_manager',
  'pending',
  NOW() + INTERVAL '24 hours',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-003' LIMIT 1),
  2,
  'Site Manager Validation',
  'site_manager',
  'site_manager',
  'waiting',
  NOW() + INTERVAL '48 hours', 
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-003' LIMIT 1),
  3,
  'Operations Director Approval',
  'operations_director',
  'operations_director',
  'waiting',
  NOW() + INTERVAL '72 hours',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-003' LIMIT 1),
  4,
  'Finance Director Authorization',
  'finance_director',
  'finance_director',
  'waiting',
  NOW() + INTERVAL '96 hours',
  NOW(),
  NOW()
),
(
  gen_random_uuid(),
  (SELECT id FROM approval_instances WHERE entity_id = 'PRJ-2025-003' LIMIT 1),
  5,
  'Board of Directors Decision',
  'board_member',
  'board_member',
  'waiting',
  NOW() + INTERVAL '168 hours',
  NOW(),
  NOW()
);

-- 6. Update user roles to match construction industry standards
UPDATE users SET 
  role = CASE 
    WHEN role = 'admin' THEN 'operations_director'
    WHEN role = 'manager' THEN 'project_manager'
    WHEN role = 'user' THEN 'site_engineer'
    ELSE role
  END,
  updated_at = NOW()
WHERE role IN ('admin', 'manager', 'user');