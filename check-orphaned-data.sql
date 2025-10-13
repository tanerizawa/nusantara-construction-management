-- ============================================
-- CHECK ORPHANED DATA IN DATABASE
-- Created: 2025-10-13
-- Purpose: Find orphaned records in transaksiPO and related tables
-- ============================================

-- 1. Check transaksiPO with missing project references
SELECT 
    'transaksiPO - Missing Projects' AS issue_type,
    COUNT(*) AS orphaned_count
FROM transaksiPO po
LEFT JOIN projects p ON po.projectId = p.id
WHERE p.id IS NULL;

-- Show actual orphaned transaksiPO records
SELECT 
    po.id,
    po.projectId,
    po.nomorPO,
    po.tanggalPO,
    po.createdAt
FROM transaksiPO po
LEFT JOIN projects p ON po.projectId = p.id
WHERE p.id IS NULL
ORDER BY po.createdAt DESC
LIMIT 20;

-- 2. Check transaksiPO with missing subsidiary references
SELECT 
    'transaksiPO - Missing Subsidiaries' AS issue_type,
    COUNT(*) AS orphaned_count
FROM transaksiPO po
LEFT JOIN subsidiaries s ON po.subsidiaryId = s.id
WHERE s.id IS NULL;

-- Show actual orphaned transaksiPO records (missing subsidiary)
SELECT 
    po.id,
    po.subsidiaryId,
    po.nomorPO,
    po.tanggalPO,
    po.createdAt
FROM transaksiPO po
LEFT JOIN subsidiaries s ON po.subsidiaryId = s.id
WHERE s.id IS NULL
ORDER BY po.createdAt DESC
LIMIT 20;

-- 3. Check transaksiPO_items with missing transaksiPO parent
SELECT 
    'transaksiPO_items - Missing Parent PO' AS issue_type,
    COUNT(*) AS orphaned_count
FROM transaksiPO_items poi
LEFT JOIN transaksiPO po ON poi.transaksiPOId = po.id
WHERE po.id IS NULL;

-- Show actual orphaned transaksiPO_items
SELECT 
    poi.id,
    poi.transaksiPOId,
    poi.description,
    poi.quantity,
    poi.unitPrice,
    poi.createdAt
FROM transaksiPO_items poi
LEFT JOIN transaksiPO po ON poi.transaksiPOId = po.id
WHERE po.id IS NULL
ORDER BY poi.createdAt DESC
LIMIT 20;

-- 4. Check invoices with missing transaksiPO references
SELECT 
    'invoices - Missing PO Reference' AS issue_type,
    COUNT(*) AS orphaned_count
FROM invoices i
LEFT JOIN transaksiPO po ON i.transaksiPOId = po.id
WHERE i.transaksiPOId IS NOT NULL AND po.id IS NULL;

-- Show actual orphaned invoices
SELECT 
    i.id,
    i.transaksiPOId,
    i.invoiceNumber,
    i.amount,
    i.createdAt
FROM invoices i
LEFT JOIN transaksiPO po ON i.transaksiPOId = po.id
WHERE i.transaksiPOId IS NOT NULL AND po.id IS NULL
ORDER BY i.createdAt DESC
LIMIT 20;

-- 5. Check BA_ProgressPayment with missing references
SELECT 
    'BA_ProgressPayment - Missing PO' AS issue_type,
    COUNT(*) AS orphaned_count
FROM BA_ProgressPayment ba
LEFT JOIN transaksiPO po ON ba.transaksiPOId = po.id
WHERE ba.transaksiPOId IS NOT NULL AND po.id IS NULL;

-- Show actual orphaned BA_ProgressPayment
SELECT 
    ba.id,
    ba.transaksiPOId,
    ba.nomorBA,
    ba.tanggalBA,
    ba.createdAt
FROM BA_ProgressPayment ba
LEFT JOIN transaksiPO po ON ba.transaksiPOId = po.id
WHERE ba.transaksiPOId IS NOT NULL AND po.id IS NULL
ORDER BY ba.createdAt DESC
LIMIT 20;

-- 6. Check RAB items with missing project references
SELECT 
    'rab_items - Missing Projects' AS issue_type,
    COUNT(*) AS orphaned_count
FROM rab_items ri
LEFT JOIN projects p ON ri.projectId = p.id
WHERE ri.projectId IS NOT NULL AND p.id IS NULL;

-- 7. Check milestones with missing project references
SELECT 
    'milestones - Missing Projects' AS issue_type,
    COUNT(*) AS orphaned_count
FROM milestones m
LEFT JOIN projects p ON m.projectId = p.id
WHERE p.id IS NULL;

-- 8. Check team_members with missing project references
SELECT 
    'team_members - Missing Projects' AS issue_type,
    COUNT(*) AS orphaned_count
FROM team_members tm
LEFT JOIN projects p ON tm.projectId = p.id
WHERE p.id IS NULL;

-- 9. Check project_files with missing project references
SELECT 
    'project_files - Missing Projects' AS issue_type,
    COUNT(*) AS orphaned_count
FROM project_files pf
LEFT JOIN projects p ON pf.projectId = p.id
WHERE p.id IS NULL;

-- 10. SUMMARY - Count all orphaned records by type
SELECT 
    'SUMMARY' AS report_type,
    (SELECT COUNT(*) FROM transaksiPO po LEFT JOIN projects p ON po.projectId = p.id WHERE p.id IS NULL) AS po_missing_project,
    (SELECT COUNT(*) FROM transaksiPO po LEFT JOIN subsidiaries s ON po.subsidiaryId = s.id WHERE s.id IS NULL) AS po_missing_subsidiary,
    (SELECT COUNT(*) FROM transaksiPO_items poi LEFT JOIN transaksiPO po ON poi.transaksiPOId = po.id WHERE po.id IS NULL) AS po_items_orphaned,
    (SELECT COUNT(*) FROM invoices i LEFT JOIN transaksiPO po ON i.transaksiPOId = po.id WHERE i.transaksiPOId IS NOT NULL AND po.id IS NULL) AS invoices_orphaned,
    (SELECT COUNT(*) FROM BA_ProgressPayment ba LEFT JOIN transaksiPO po ON ba.transaksiPOId = po.id WHERE ba.transaksiPOId IS NOT NULL AND po.id IS NULL) AS ba_payment_orphaned,
    (SELECT COUNT(*) FROM rab_items ri LEFT JOIN projects p ON ri.projectId = p.id WHERE ri.projectId IS NOT NULL AND p.id IS NULL) AS rab_items_orphaned,
    (SELECT COUNT(*) FROM milestones m LEFT JOIN projects p ON m.projectId = p.id WHERE p.id IS NULL) AS milestones_orphaned,
    (SELECT COUNT(*) FROM team_members tm LEFT JOIN projects p ON tm.projectId = p.id WHERE p.id IS NULL) AS team_members_orphaned,
    (SELECT COUNT(*) FROM project_files pf LEFT JOIN projects p ON pf.projectId = p.id WHERE p.id IS NULL) AS project_files_orphaned;
