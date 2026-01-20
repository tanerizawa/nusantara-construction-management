-- Sample Data untuk Testing Project Finance Integration
-- Menambahkan sample finance transactions dan purchase orders

-- Insert sample finance transactions linked to projects
INSERT INTO finance_transactions (
  id, type, category, subcategory, amount, description, date, 
  project_id, payment_method, reference_number, status, 
  "createdAt", "updatedAt"
) VALUES 
-- Project 2025BSR001 transactions
('FIN-2025-001', 'income', 'Project Revenue', 'Contract Payment', 150000000, 
 'Payment from client for Proyek Uji Coba - Phase 1', '2025-09-20', 
 '2025BSR001', 'bank_transfer', 'PAY-2025-001', 'completed', 
 NOW(), NOW()),

('FIN-2025-002', 'expense', 'Material Purchase', 'Construction Materials', 45000000, 
 'Purchase of cement and steel for Proyek Uji Coba', '2025-09-21', 
 '2025BSR001', 'bank_transfer', 'PO-2025-001', 'completed', 
 NOW(), NOW()),

('FIN-2025-003', 'expense', 'Labor Cost', 'Construction Workers', 25000000, 
 'Payment for construction workers - Week 1', '2025-09-22', 
 '2025BSR001', 'cash', 'LABOR-2025-001', 'completed', 
 NOW(), NOW()),

('FIN-2025-004', 'income', 'Project Revenue', 'Progress Payment', 75000000, 
 'Progress payment from client - 30% completion', '2025-09-23', 
 '2025BSR001', 'bank_transfer', 'PAY-2025-002', 'completed', 
 NOW(), NOW()),

('FIN-2025-005', 'expense', 'Equipment Rental', 'Heavy Machinery', 15000000, 
 'Excavator rental for site preparation', '2025-09-24', 
 '2025BSR001', 'bank_transfer', 'RENT-2025-001', 'completed', 
 NOW(), NOW()),

-- General operational expenses (no project link)
('FIN-2025-006', 'expense', 'Office Expense', 'Utilities', 3000000, 
 'Monthly office electricity and water bills', '2025-09-25', 
 NULL, 'bank_transfer', 'UTIL-2025-001', 'completed', 
 NOW(), NOW()),

('FIN-2025-007', 'expense', 'Administrative', 'Office Supplies', 1500000, 
 'Monthly office supplies and stationery', '2025-09-25', 
 NULL, 'cash', 'SUPP-2025-001', 'completed', 
 NOW(), NOW());

-- Insert sample purchase orders
INSERT INTO purchase_orders (
  id, po_number, supplier_id, supplier_name, order_date, 
  expected_delivery_date, status, items, subtotal, total_amount, 
  project_id, notes, "createdAt", "updatedAt"
) VALUES 
('PO-2025-001', 'PO-BSR-2025-001', 'SUP-001', 'PT Semen Jaya', '2025-09-20', 
 '2025-09-25', 'received', 
 '[{"itemName":"Cement","quantity":100,"unitPrice":150000,"totalPrice":15000000},{"itemName":"Steel Bars","quantity":50,"unitPrice":600000,"totalPrice":30000000}]'::jsonb,
 45000000, 45000000, '2025BSR001', 
 'Materials for foundation work', NOW(), NOW()),

('PO-2025-002', 'PO-BSR-2025-002', 'SUP-002', 'CV Alat Berat Mandiri', '2025-09-23', 
 '2025-09-28', 'approved', 
 '[{"itemName":"Excavator Rental","quantity":7,"unitPrice":2000000,"totalPrice":14000000}]'::jsonb,
 14000000, 14000000, '2025BSR001', 
 'Heavy equipment for excavation work', NOW(), NOW());

-- Link purchase orders to finance transactions
UPDATE finance_transactions 
SET purchase_order_id = 'PO-2025-001' 
WHERE id = 'FIN-2025-002';

-- Verify the data
SELECT 'Finance Transactions Count' as info, COUNT(*) as count FROM finance_transactions;
SELECT 'Purchase Orders Count' as info, COUNT(*) as count FROM purchase_orders;
SELECT 'Project-linked Transactions' as info, COUNT(*) as count FROM finance_transactions WHERE project_id IS NOT NULL;
SELECT 'PO-linked Transactions' as info, COUNT(*) as count FROM finance_transactions WHERE purchase_order_id IS NOT NULL;