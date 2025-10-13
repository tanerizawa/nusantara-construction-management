-- ============================================
-- CHECK ORPHANED DATA IN DATABASE (PostgreSQL - Correct Table Names)
-- Created: 2025-10-13
-- Purpose: Find orphaned records in purchase_orders and related tables
-- ============================================

\echo '============================================'
\echo 'ORPHANED DATA CHECK REPORT'
\echo '============================================'
\echo ''

-- 1. purchase_orders with missing project references
\echo '1. purchase_orders - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM purchase_orders po
LEFT JOIN projects p ON po.project_id = p.id
WHERE po.project_id IS NOT NULL AND p.id IS NULL;

\echo 'Sample orphaned purchase_orders (missing projects):'
SELECT 
    po.id,
    po.project_id,
    po.po_number,
    po.po_date,
    po.total_amount,
    po.created_at
FROM purchase_orders po
LEFT JOIN projects p ON po.project_id = p.id
WHERE po.project_id IS NOT NULL AND p.id IS NULL
ORDER BY po.created_at DESC
LIMIT 10;

\echo ''
\echo '2. purchase_orders - Missing Subsidiaries:'
SELECT 
    COUNT(*) AS orphaned_count
FROM purchase_orders po
LEFT JOIN subsidiaries s ON po.subsidiary_id = s.id
WHERE po.subsidiary_id IS NOT NULL AND s.id IS NULL;

\echo 'Sample orphaned purchase_orders (missing subsidiaries):'
SELECT 
    po.id,
    po.subsidiary_id,
    po.po_number,
    po.po_date,
    po.total_amount,
    po.created_at
FROM purchase_orders po
LEFT JOIN subsidiaries s ON po.subsidiary_id = s.id
WHERE po.subsidiary_id IS NOT NULL AND s.id IS NULL
ORDER BY po.created_at DESC
LIMIT 10;

\echo ''
\echo '3. purchase_orders - With NULL project_id:'
SELECT 
    COUNT(*) AS null_project_count
FROM purchase_orders
WHERE project_id IS NULL;

\echo 'Sample purchase_orders with NULL project_id:'
SELECT 
    id,
    po_number,
    po_date,
    total_amount,
    subsidiary_id,
    created_at
FROM purchase_orders
WHERE project_id IS NULL
ORDER BY created_at DESC
LIMIT 10;

\echo ''
\echo '4. berita_acara - Missing purchase_order references:'
SELECT 
    COUNT(*) AS orphaned_count
FROM berita_acara ba
LEFT JOIN purchase_orders po ON ba.purchase_order_id = po.id
WHERE ba.purchase_order_id IS NOT NULL AND po.id IS NULL;

\echo 'Sample orphaned berita_acara:'
SELECT 
    ba.id,
    ba.purchase_order_id,
    ba.ba_number,
    ba.ba_date,
    ba.created_at
FROM berita_acara ba
LEFT JOIN purchase_orders po ON ba.purchase_order_id = po.id
WHERE ba.purchase_order_id IS NOT NULL AND po.id IS NULL
ORDER BY ba.created_at DESC
LIMIT 10;

\echo ''
\echo '5. progress_payments - Missing purchase_order:'
SELECT 
    COUNT(*) AS orphaned_count
FROM progress_payments pp
LEFT JOIN purchase_orders po ON pp.purchase_order_id = po.id
WHERE pp.purchase_order_id IS NOT NULL AND po.id IS NULL;

\echo 'Sample orphaned progress_payments:'
SELECT 
    pp.id,
    pp.purchase_order_id,
    pp.payment_number,
    pp.payment_date,
    pp.amount,
    pp.created_at
FROM progress_payments pp
LEFT JOIN purchase_orders po ON pp.purchase_order_id = po.id
WHERE pp.purchase_order_id IS NOT NULL AND po.id IS NULL
ORDER BY pp.created_at DESC
LIMIT 10;

\echo ''
\echo '6. progress_payments - Missing berita_acara:'
SELECT 
    COUNT(*) AS orphaned_count
FROM progress_payments pp
LEFT JOIN berita_acara ba ON pp.berita_acara_id = ba.id
WHERE pp.berita_acara_id IS NOT NULL AND ba.id IS NULL;

\echo 'Sample orphaned progress_payments (missing BA):'
SELECT 
    pp.id,
    pp.berita_acara_id,
    pp.payment_number,
    pp.payment_date,
    pp.amount,
    pp.created_at
FROM progress_payments pp
LEFT JOIN berita_acara ba ON pp.berita_acara_id = ba.id
WHERE pp.berita_acara_id IS NOT NULL AND ba.id IS NULL
ORDER BY pp.created_at DESC
LIMIT 10;

\echo ''
\echo '7. rab_items - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM rab_items ri
LEFT JOIN projects p ON ri.project_id = p.id
WHERE ri.project_id IS NOT NULL AND p.id IS NULL;

\echo 'Sample orphaned rab_items:'
SELECT 
    ri.id,
    ri.project_id,
    ri.item_code,
    ri.description,
    ri.quantity,
    ri.created_at
FROM rab_items ri
LEFT JOIN projects p ON ri.project_id = p.id
WHERE ri.project_id IS NOT NULL AND p.id IS NULL
ORDER BY ri.created_at DESC
LIMIT 10;

\echo ''
\echo '8. project_milestones - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM project_milestones m
LEFT JOIN projects p ON m.project_id = p.id
WHERE p.id IS NULL;

\echo ''
\echo '9. project_team_members - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM project_team_members tm
LEFT JOIN projects p ON tm.project_id = p.id
WHERE p.id IS NULL;

\echo ''
\echo '10. project_documents - Missing Projects:'
SELECT 
    COUNT(*) AS orphaned_count
FROM project_documents pd
LEFT JOIN projects p ON pd.project_id = p.id
WHERE p.id IS NULL;

\echo ''
\echo '11. rab_purchase_tracking - Missing rab_items:'
SELECT 
    COUNT(*) AS orphaned_count
FROM rab_purchase_tracking rpt
LEFT JOIN rab_items ri ON rpt.rab_item_id = ri.id
WHERE rpt.rab_item_id IS NOT NULL AND ri.id IS NULL;

\echo ''
\echo '12. rab_purchase_tracking - Missing purchase_orders:'
SELECT 
    COUNT(*) AS orphaned_count
FROM rab_purchase_tracking rpt
LEFT JOIN purchase_orders po ON rpt.purchase_order_id = po.id
WHERE rpt.purchase_order_id IS NOT NULL AND po.id IS NULL;

\echo ''
\echo '============================================'
\echo 'SUMMARY - Total Orphaned Records by Type'
\echo '============================================'
SELECT 
    'PO missing project' AS issue_type,
    (SELECT COUNT(*) FROM purchase_orders po LEFT JOIN projects p ON po.project_id = p.id WHERE po.project_id IS NOT NULL AND p.id IS NULL) AS count
UNION ALL
SELECT 
    'PO missing subsidiary' AS issue_type,
    (SELECT COUNT(*) FROM purchase_orders po LEFT JOIN subsidiaries s ON po.subsidiary_id = s.id WHERE po.subsidiary_id IS NOT NULL AND s.id IS NULL) AS count
UNION ALL
SELECT 
    'PO with NULL project_id' AS issue_type,
    (SELECT COUNT(*) FROM purchase_orders WHERE project_id IS NULL) AS count
UNION ALL
SELECT 
    'Berita Acara orphaned' AS issue_type,
    (SELECT COUNT(*) FROM berita_acara ba LEFT JOIN purchase_orders po ON ba.purchase_order_id = po.id WHERE ba.purchase_order_id IS NOT NULL AND po.id IS NULL) AS count
UNION ALL
SELECT 
    'Progress Payment (PO) orphaned' AS issue_type,
    (SELECT COUNT(*) FROM progress_payments pp LEFT JOIN purchase_orders po ON pp.purchase_order_id = po.id WHERE pp.purchase_order_id IS NOT NULL AND po.id IS NULL) AS count
UNION ALL
SELECT 
    'Progress Payment (BA) orphaned' AS issue_type,
    (SELECT COUNT(*) FROM progress_payments pp LEFT JOIN berita_acara ba ON pp.berita_acara_id = ba.id WHERE pp.berita_acara_id IS NOT NULL AND ba.id IS NULL) AS count
UNION ALL
SELECT 
    'RAB items orphaned' AS issue_type,
    (SELECT COUNT(*) FROM rab_items ri LEFT JOIN projects p ON ri.project_id = p.id WHERE ri.project_id IS NOT NULL AND p.id IS NULL) AS count
UNION ALL
SELECT 
    'Milestones orphaned' AS issue_type,
    (SELECT COUNT(*) FROM project_milestones m LEFT JOIN projects p ON m.project_id = p.id WHERE p.id IS NULL) AS count
UNION ALL
SELECT 
    'Team members orphaned' AS issue_type,
    (SELECT COUNT(*) FROM project_team_members tm LEFT JOIN projects p ON tm.project_id = p.id WHERE p.id IS NULL) AS count
UNION ALL
SELECT 
    'Project documents orphaned' AS issue_type,
    (SELECT COUNT(*) FROM project_documents pd LEFT JOIN projects p ON pd.project_id = p.id WHERE p.id IS NULL) AS count
UNION ALL
SELECT 
    'RAB tracking (items) orphaned' AS issue_type,
    (SELECT COUNT(*) FROM rab_purchase_tracking rpt LEFT JOIN rab_items ri ON rpt.rab_item_id = ri.id WHERE rpt.rab_item_id IS NOT NULL AND ri.id IS NULL) AS count
UNION ALL
SELECT 
    'RAB tracking (PO) orphaned' AS issue_type,
    (SELECT COUNT(*) FROM rab_purchase_tracking rpt LEFT JOIN purchase_orders po ON rpt.purchase_order_id = po.id WHERE rpt.purchase_order_id IS NOT NULL AND po.id IS NULL) AS count
ORDER BY count DESC;

\echo ''
\echo 'Check complete!'
