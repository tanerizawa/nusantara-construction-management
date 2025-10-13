-- ============================================
-- CHECK ORPHANED DATA IN DATABASE (PostgreSQL)
-- Created: 2025-10-13
-- Purpose: Find orphaned records in transaksiPO and related tables
-- ============================================

\echo '============================================'
\echo 'ORPHANED DATA CHECK REPORT'
\echo '============================================'
\echo ''

-- 1. transaksiPO with missing project references
\echo '1. transaksiPO - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM "transaksiPO" po
LEFT JOIN projects p ON po."projectId" = p.id
WHERE p.id IS NULL;

\echo 'Details:'
SELECT 
    po.id,
    po."projectId",
    po."nomorPO",
    po."tanggalPO",
    po."createdAt"
FROM "transaksiPO" po
LEFT JOIN projects p ON po."projectId" = p.id
WHERE p.id IS NULL
ORDER BY po."createdAt" DESC
LIMIT 10;

\echo ''
\echo '2. transaksiPO - Missing Subsidiaries:'
SELECT 
    COUNT(*) AS orphaned_count
FROM "transaksiPO" po
LEFT JOIN subsidiaries s ON po."subsidiaryId" = s.id
WHERE s.id IS NULL;

\echo 'Details:'
SELECT 
    po.id,
    po."subsidiaryId",
    po."nomorPO",
    po."tanggalPO",
    po."createdAt"
FROM "transaksiPO" po
LEFT JOIN subsidiaries s ON po."subsidiaryId" = s.id
WHERE s.id IS NULL
ORDER BY po."createdAt" DESC
LIMIT 10;

\echo ''
\echo '3. transaksiPO_items - Missing Parent PO:'
SELECT 
    COUNT(*) AS orphaned_count
FROM "transaksiPO_items" poi
LEFT JOIN "transaksiPO" po ON poi."transaksiPOId" = po.id
WHERE po.id IS NULL;

\echo 'Details:'
SELECT 
    poi.id,
    poi."transaksiPOId",
    poi.description,
    poi.quantity,
    poi."unitPrice",
    poi."createdAt"
FROM "transaksiPO_items" poi
LEFT JOIN "transaksiPO" po ON poi."transaksiPOId" = po.id
WHERE po.id IS NULL
ORDER BY poi."createdAt" DESC
LIMIT 10;

\echo ''
\echo '4. invoices - Missing PO Reference:'
SELECT 
    COUNT(*) AS orphaned_count
FROM invoices i
LEFT JOIN "transaksiPO" po ON i."transaksiPOId" = po.id
WHERE i."transaksiPOId" IS NOT NULL AND po.id IS NULL;

\echo 'Details:'
SELECT 
    i.id,
    i."transaksiPOId",
    i."invoiceNumber",
    i.amount,
    i."createdAt"
FROM invoices i
LEFT JOIN "transaksiPO" po ON i."transaksiPOId" = po.id
WHERE i."transaksiPOId" IS NOT NULL AND po.id IS NULL
ORDER BY i."createdAt" DESC
LIMIT 10;

\echo ''
\echo '5. BA_ProgressPayment - Missing PO:'
SELECT 
    COUNT(*) AS orphaned_count
FROM "BA_ProgressPayment" ba
LEFT JOIN "transaksiPO" po ON ba."transaksiPOId" = po.id
WHERE ba."transaksiPOId" IS NOT NULL AND po.id IS NULL;

\echo 'Details:'
SELECT 
    ba.id,
    ba."transaksiPOId",
    ba."nomorBA",
    ba."tanggalBA",
    ba."createdAt"
FROM "BA_ProgressPayment" ba
LEFT JOIN "transaksiPO" po ON ba."transaksiPOId" = po.id
WHERE ba."transaksiPOId" IS NOT NULL AND po.id IS NULL
ORDER BY ba."createdAt" DESC
LIMIT 10;

\echo ''
\echo '6. rab_items - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM rab_items ri
LEFT JOIN projects p ON ri."projectId" = p.id
WHERE ri."projectId" IS NOT NULL AND p.id IS NULL;

\echo ''
\echo '7. milestones - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM milestones m
LEFT JOIN projects p ON m."projectId" = p.id
WHERE p.id IS NULL;

\echo ''
\echo '8. team_members - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM team_members tm
LEFT JOIN projects p ON tm."projectId" = p.id
WHERE p.id IS NULL;

\echo ''
\echo '9. project_files - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM project_files pf
LEFT JOIN projects p ON pf."projectId" = p.id
WHERE p.id IS NULL;

\echo ''
\echo '============================================'
\echo 'SUMMARY'
\echo '============================================'
SELECT 
    'PO missing project' AS issue_type,
    (SELECT COUNT(*) FROM "transaksiPO" po LEFT JOIN projects p ON po."projectId" = p.id WHERE p.id IS NULL) AS count
UNION ALL
SELECT 
    'PO missing subsidiary' AS issue_type,
    (SELECT COUNT(*) FROM "transaksiPO" po LEFT JOIN subsidiaries s ON po."subsidiaryId" = s.id WHERE s.id IS NULL) AS count
UNION ALL
SELECT 
    'PO items orphaned' AS issue_type,
    (SELECT COUNT(*) FROM "transaksiPO_items" poi LEFT JOIN "transaksiPO" po ON poi."transaksiPOId" = po.id WHERE po.id IS NULL) AS count
UNION ALL
SELECT 
    'Invoices orphaned' AS issue_type,
    (SELECT COUNT(*) FROM invoices i LEFT JOIN "transaksiPO" po ON i."transaksiPOId" = po.id WHERE i."transaksiPOId" IS NOT NULL AND po.id IS NULL) AS count
UNION ALL
SELECT 
    'BA Payment orphaned' AS issue_type,
    (SELECT COUNT(*) FROM "BA_ProgressPayment" ba LEFT JOIN "transaksiPO" po ON ba."transaksiPOId" = po.id WHERE ba."transaksiPOId" IS NOT NULL AND po.id IS NULL) AS count
UNION ALL
SELECT 
    'RAB items orphaned' AS issue_type,
    (SELECT COUNT(*) FROM rab_items ri LEFT JOIN projects p ON ri."projectId" = p.id WHERE ri."projectId" IS NOT NULL AND p.id IS NULL) AS count
UNION ALL
SELECT 
    'Milestones orphaned' AS issue_type,
    (SELECT COUNT(*) FROM milestones m LEFT JOIN projects p ON m."projectId" = p.id WHERE p.id IS NULL) AS count
UNION ALL
SELECT 
    'Team members orphaned' AS issue_type,
    (SELECT COUNT(*) FROM team_members tm LEFT JOIN projects p ON tm."projectId" = p.id WHERE p.id IS NULL) AS count
UNION ALL
SELECT 
    'Project files orphaned' AS issue_type,
    (SELECT COUNT(*) FROM project_files pf LEFT JOIN projects p ON pf."projectId" = p.id WHERE p.id IS NULL) AS count
ORDER BY count DESC;
