-- ============================================
-- CLEANUP ORPHANED DATA & DUPLICATE INDEXES
-- Created: 2025-10-13
-- ============================================

\echo '============================================'
\echo 'DATABASE CLEANUP SCRIPT'
\echo '============================================'
\echo ''

-- STEP 1: Show orphaned finance transactions
\echo 'STEP 1: Orphaned Finance Transactions'
\echo '-------------------------------------'
SELECT 
    id,
    date,
    type,
    amount,
    description
FROM finance_transactions
WHERE purchase_order_id IS NULL OR project_id IS NULL
ORDER BY date DESC;

\echo ''
\echo 'Total orphaned transactions:'
SELECT COUNT(*) AS orphaned_count
FROM finance_transactions
WHERE purchase_order_id IS NULL OR project_id IS NULL;

\echo ''
\echo 'DELETING orphaned transactions...'
DELETE FROM finance_transactions
WHERE purchase_order_id IS NULL OR project_id IS NULL;

\echo 'Orphaned transactions deleted!'
\echo ''

-- STEP 2: Cleanup duplicate indexes on purchase_orders
\echo 'STEP 2: Cleaning Duplicate Indexes - purchase_orders'
\echo '----------------------------------------------------'

-- Drop duplicate po_number constraints
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'purchase_orders' 
        AND indexname LIKE 'purchase_orders_po_number_key%'
        AND indexname != 'purchase_orders_po_number_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop: % (may be index not constraint)', idx_name;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints', drop_count;
END $$;

\echo 'Remaining purchase_orders indexes:'
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'purchase_orders' 
AND indexname LIKE '%po_number%'
ORDER BY indexname;

\echo ''

-- STEP 3: Cleanup duplicate indexes on manpower
\echo 'STEP 3: Cleaning Duplicate Indexes - manpower'
\echo '---------------------------------------------'

DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'manpower' 
        AND indexname LIKE 'manpower_employee_id_key%'
        AND indexname != 'manpower_employee_id_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE manpower DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Could not drop: % (may be index not constraint)', idx_name;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints', drop_count;
END $$;

\echo 'Remaining manpower indexes:'
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'manpower' 
AND indexname LIKE '%employee_id%'
ORDER BY indexname;

\echo ''

-- STEP 4: Final Verification
\echo 'STEP 4: Final Verification'
\echo '-------------------------'

\echo 'Database Status:'
SELECT 
    'Finance Transactions' AS table_name, 
    COUNT(*) AS total_records,
    COUNT(CASE WHEN project_id IS NULL THEN 1 END) AS null_project,
    COUNT(CASE WHEN purchase_order_id IS NULL THEN 1 END) AS null_po
FROM finance_transactions
UNION ALL
SELECT 
    'Purchase Orders',
    COUNT(*),
    COUNT(CASE WHEN project_id IS NULL THEN 1 END),
    0
FROM purchase_orders
UNION ALL
SELECT 
    'Projects',
    COUNT(*),
    0,
    0
FROM projects;

\echo ''
\echo 'Index Count by Table:'
SELECT 
    tablename,
    COUNT(*) as total_indexes
FROM pg_indexes 
WHERE tablename IN ('purchase_orders', 'manpower')
GROUP BY tablename
ORDER BY tablename;

\echo ''
\echo '============================================'
\echo 'CLEANUP COMPLETE!'
\echo '============================================'
