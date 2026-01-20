-- Sample Data untuk Testing RAB Quantity Tracking
-- Project: 2025PJK001 (Proyek uji coba 2)

-- =================================================================
-- SCENARIO: Construction Project dengan Multiple Material Items
-- =================================================================

-- Clear existing test data (optional, for clean test)
-- DELETE FROM rab_purchase_tracking WHERE "projectId" = '2025PJK001';
-- DELETE FROM project_rab WHERE "projectId" = '2025PJK001';

-- =================================================================
-- 1. RAB Items (Budget Items)
-- =================================================================

-- Item 1: Semen (Full purchase scenario)
INSERT INTO project_rab (
  id,
  "projectId",
  category,
  description,
  unit,
  quantity,
  "unitPrice",
  "totalPrice",
  status,
  "isApproved",
  "createdAt",
  "updatedAt"
) VALUES (
  'rab-item-semen-001',
  '2025PJK001',
  'Material',
  'Semen Portland Type I',
  'Sak',
  1000,
  75000,
  75000000,
  'active',
  true,
  NOW(),
  NOW()
);

-- Item 2: Pasir (Partial purchase scenario)
INSERT INTO project_rab (
  id,
  "projectId",
  category,
  description,
  unit,
  quantity,
  "unitPrice",
  "totalPrice",
  status,
  "isApproved",
  "createdAt",
  "updatedAt"
) VALUES (
  'rab-item-pasir-001',
  '2025PJK001',
  'Material',
  'Pasir Beton',
  'M3',
  500,
  250000,
  125000000,
  'active',
  true,
  NOW(),
  NOW()
);

-- Item 3: Besi Beton (No purchase yet)
INSERT INTO project_rab (
  id,
  "projectId",
  category,
  description,
  unit,
  quantity,
  "unitPrice",
  "totalPrice",
  status,
  "isApproved",
  "createdAt",
  "updatedAt"
) VALUES (
  'rab-item-besi-001',
  '2025PJK001',
  'Material',
  'Besi Beton D16',
  'Kg',
  5000,
  15000,
  75000000,
  'active',
  true,
  NOW(),
  NOW()
);

-- Item 4: Urugan Tanah (Multiple small purchases)
INSERT INTO project_rab (
  id,
  "projectId",
  category,
  description,
  unit,
  quantity,
  "unitPrice",
  "totalPrice",
  status,
  "isApproved",
  "createdAt",
  "updatedAt"
) VALUES (
  'rab-item-urugan-001',
  '2025PJK001',
  'Material',
  'Urugan Tanah Merah',
  'M3',
  2000,
  50000,
  100000000,
  'active',
  true,
  NOW(),
  NOW()
);

-- =================================================================
-- 2. Purchase Orders (Historical)
-- =================================================================

-- PO 1: Full purchase of Semen
INSERT INTO purchase_orders (
  id,
  po_number,
  supplier_id,
  supplier_name,
  order_date,
  expected_delivery_date,
  status,
  items,
  subtotal,
  tax_amount,
  total_amount,
  notes,
  project_id,
  created_by,
  "createdAt",
  "updatedAt"
) VALUES (
  'PO-TEST-SEMEN-001',
  'PO-TEST-SEMEN-001',
  'SUP-SEMEN-GRESIK',
  'PT Semen Gresik',
  '2025-10-01',
  '2025-10-05',
  'received',
  '[{"inventoryId":"rab-item-semen-001","itemName":"Semen Portland Type I","quantity":1000,"unitPrice":75000,"totalPrice":75000000,"description":"Semen Portland Type I (Sak)"}]',
  75000000,
  0,
  75000000,
  'Purchase completed',
  '2025PJK001',
  'USR-IT-HADEZ-001',
  '2025-10-01 08:00:00',
  '2025-10-01 08:00:00'
);

-- PO 2: First partial purchase of Pasir (300/500)
INSERT INTO purchase_orders (
  id,
  po_number,
  supplier_id,
  supplier_name,
  order_date,
  expected_delivery_date,
  status,
  items,
  subtotal,
  tax_amount,
  total_amount,
  notes,
  project_id,
  created_by,
  "createdAt",
  "updatedAt"
) VALUES (
  'PO-TEST-PASIR-001',
  'PO-TEST-PASIR-001',
  'SUP-MATERIAL-JAYA',
  'CV Material Jaya',
  '2025-10-03',
  '2025-10-07',
  'approved',
  '[{"inventoryId":"rab-item-pasir-001","itemName":"Pasir Beton","quantity":300,"unitPrice":250000,"totalPrice":75000000,"description":"Pasir Beton (M3)"}]',
  75000000,
  0,
  75000000,
  'First batch',
  '2025PJK001',
  'USR-IT-HADEZ-001',
  '2025-10-03 09:00:00',
  '2025-10-03 09:00:00'
);

-- PO 3: Multiple small purchases of Urugan (total 800/2000)
INSERT INTO purchase_orders (
  id,
  po_number,
  supplier_id,
  supplier_name,
  order_date,
  expected_delivery_date,
  status,
  items,
  subtotal,
  tax_amount,
  total_amount,
  notes,
  project_id,
  created_by,
  "createdAt",
  "updatedAt"
) VALUES (
  'PO-TEST-URUGAN-001',
  'PO-TEST-URUGAN-001',
  'SUP-URUGAN-SEJAHTERA',
  'UD Urugan Sejahtera',
  '2025-10-05',
  '2025-10-08',
  'approved',
  '[{"inventoryId":"rab-item-urugan-001","itemName":"Urugan Tanah Merah","quantity":500,"unitPrice":50000,"totalPrice":25000000,"description":"Urugan Tanah Merah (M3)"}]',
  25000000,
  0,
  25000000,
  'Batch 1',
  '2025PJK001',
  'USR-IT-HADEZ-001',
  '2025-10-05 10:00:00',
  '2025-10-05 10:00:00'
);

INSERT INTO purchase_orders (
  id,
  po_number,
  supplier_id,
  supplier_name,
  order_date,
  expected_delivery_date,
  status,
  items,
  subtotal,
  tax_amount,
  total_amount,
  notes,
  project_id,
  created_by,
  "createdAt",
  "updatedAt"
) VALUES (
  'PO-TEST-URUGAN-002',
  'PO-TEST-URUGAN-002',
  'SUP-URUGAN-SEJAHTERA',
  'UD Urugan Sejahtera',
  '2025-10-06',
  '2025-10-09',
  'pending',
  '[{"inventoryId":"rab-item-urugan-001","itemName":"Urugan Tanah Merah","quantity":300,"unitPrice":50000,"totalPrice":15000000,"description":"Urugan Tanah Merah (M3)"}]',
  15000000,
  0,
  15000000,
  'Batch 2',
  '2025PJK001',
  'USR-IT-HADEZ-001',
  '2025-10-06 10:00:00',
  '2025-10-06 10:00:00'
);

-- =================================================================
-- 3. Purchase Tracking Records
-- =================================================================

-- Tracking for Semen (full purchase)
INSERT INTO rab_purchase_tracking (
  "projectId",
  "rabItemId",
  "poNumber",
  quantity,
  "unitPrice",
  "totalAmount",
  "purchaseDate",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  '2025PJK001',
  'rab-item-semen-001',
  'PO-TEST-SEMEN-001',
  1000,
  75000,
  75000000,
  '2025-10-01',
  'received',
  NOW(),
  NOW()
);

-- Tracking for Pasir (partial)
INSERT INTO rab_purchase_tracking (
  "projectId",
  "rabItemId",
  "poNumber",
  quantity,
  "unitPrice",
  "totalAmount",
  "purchaseDate",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  '2025PJK001',
  'rab-item-pasir-001',
  'PO-TEST-PASIR-001',
  300,
  250000,
  75000000,
  '2025-10-03',
  'approved',
  NOW(),
  NOW()
);

-- Tracking for Urugan (batch 1)
INSERT INTO rab_purchase_tracking (
  "projectId",
  "rabItemId",
  "poNumber",
  quantity,
  "unitPrice",
  "totalAmount",
  "purchaseDate",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  '2025PJK001',
  'rab-item-urugan-001',
  'PO-TEST-URUGAN-001',
  500,
  50000,
  25000000,
  '2025-10-05',
  'approved',
  NOW(),
  NOW()
);

-- Tracking for Urugan (batch 2)
INSERT INTO rab_purchase_tracking (
  "projectId",
  "rabItemId",
  "poNumber",
  quantity,
  "unitPrice",
  "totalAmount",
  "purchaseDate",
  status,
  "createdAt",
  "updatedAt"
) VALUES (
  '2025PJK001',
  'rab-item-urugan-001',
  'PO-TEST-URUGAN-002',
  300,
  50000,
  15000000,
  '2025-10-06',
  'pending',
  NOW(),
  NOW()
);

-- =================================================================
-- EXPECTED RESULTS FROM VIEW:
-- =================================================================
-- 
-- Item 1 - Semen:
--   original_quantity: 1000
--   total_purchased: 1000
--   available_quantity: 0 (FULLY PURCHASED)
--   purchase_progress_percent: 100%
--   active_po_count: 1
--
-- Item 2 - Pasir:
--   original_quantity: 500
--   total_purchased: 300
--   available_quantity: 200 (PARTIAL)
--   purchase_progress_percent: 60%
--   active_po_count: 1
--
-- Item 3 - Besi:
--   original_quantity: 5000
--   total_purchased: 0
--   available_quantity: 5000 (NOT PURCHASED)
--   purchase_progress_percent: 0%
--   active_po_count: 0
--
-- Item 4 - Urugan:
--   original_quantity: 2000
--   total_purchased: 800
--   available_quantity: 1200 (PARTIAL, MULTIPLE POs)
--   purchase_progress_percent: 40%
--   active_po_count: 2
--
-- =================================================================

-- Query to verify
SELECT 
  description,
  original_quantity,
  total_purchased,
  available_quantity,
  purchase_progress_percent,
  active_po_count
FROM rab_items_availability
WHERE "projectId" = '2025PJK001'
ORDER BY description;
