-- ============================================
-- COMPREHENSIVE INDEX CLEANUP
-- Remove ALL duplicate indexes across database
-- Created: 2025-10-13
-- ============================================

\echo '============================================'
\echo 'COMPREHENSIVE INDEX CLEANUP SCRIPT'
\echo 'Removing ALL duplicate UNIQUE constraints'
\echo '============================================'
\echo ''

-- STEP 1: users table (1552 indexes!)
\echo '1. Cleaning users table (1552 → expected: 3-5)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    -- Drop duplicate email constraints
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'users' 
        AND indexname LIKE 'users_email_key%'
        AND indexname != 'users_email_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE users DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    
    -- Drop duplicate username constraints
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'users' 
        AND indexname LIKE 'users_username_key%'
        AND indexname != 'users_username_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE users DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    
    RAISE NOTICE 'Dropped % duplicate constraints from users', drop_count;
END $$;

\echo ''

-- STEP 2: subsidiaries table (757 indexes!)
\echo '2. Cleaning subsidiaries table (757 → expected: 2-3)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'subsidiaries' 
        AND indexname LIKE 'subsidiaries_code_key%'
        AND indexname != 'subsidiaries_code_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE subsidiaries DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints from subsidiaries', drop_count;
END $$;

\echo ''

-- STEP 3: inventory_items table (742 indexes!)
\echo '3. Cleaning inventory_items table (742 → expected: 2-3)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'inventory_items' 
        AND indexname LIKE 'inventory_items_sku_key%'
        AND indexname != 'inventory_items_sku_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE inventory_items DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints from inventory_items', drop_count;
END $$;

\echo ''

-- STEP 4: fixed_assets table (159 indexes!)
\echo '4. Cleaning fixed_assets table (159 → expected: 2-3)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'fixed_assets' 
        AND indexname LIKE 'fixed_assets_asset_code_key%'
        AND indexname != 'fixed_assets_asset_code_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE fixed_assets DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints from fixed_assets', drop_count;
END $$;

\echo ''

-- STEP 5: entities table (136 indexes!)
\echo '5. Cleaning entities table (136 → expected: 2-3)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'entities' 
        AND indexname LIKE 'entities_entity_code_key%'
        AND indexname != 'entities_entity_code_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE entities DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints from entities', drop_count;
END $$;

\echo ''

-- STEP 6: berita_acara table (67 indexes!)
\echo '6. Cleaning berita_acara table (67 → expected: 2-3)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'berita_acara' 
        AND indexname LIKE 'berita_acara_baNumber_key%'
        AND indexname != 'berita_acara_baNumber_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE berita_acara DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints from berita_acara', drop_count;
END $$;

\echo ''

-- STEP 7: delivery_receipts table (65 indexes!)
\echo '7. Cleaning delivery_receipts table (65 → expected: 2-3)...'
DO $$
DECLARE
    idx_name TEXT;
    drop_count INT := 0;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'delivery_receipts' 
        AND indexname LIKE 'delivery_receipts_receipt_number_key%'
        AND indexname != 'delivery_receipts_receipt_number_key'
        ORDER BY indexname
    LOOP
        BEGIN
            EXECUTE 'ALTER TABLE delivery_receipts DROP CONSTRAINT IF EXISTS ' || idx_name;
            drop_count := drop_count + 1;
        EXCEPTION WHEN OTHERS THEN
            NULL;
        END;
    END LOOP;
    RAISE NOTICE 'Dropped % duplicate constraints from delivery_receipts', drop_count;
END $$;

\echo ''
\echo '============================================'
\echo 'FINAL VERIFICATION'
\echo '============================================'

SELECT 
    tablename,
    COUNT(*) as remaining_indexes
FROM pg_indexes
WHERE schemaname = 'public'
AND tablename IN ('users', 'subsidiaries', 'inventory_items', 'fixed_assets', 
                  'entities', 'berita_acara', 'delivery_receipts', 
                  'purchase_orders', 'manpower')
GROUP BY tablename
ORDER BY remaining_indexes DESC;

\echo ''
\echo 'Total indexes in database:'
SELECT COUNT(*) as total_indexes FROM pg_indexes WHERE schemaname = 'public';

\echo ''
\echo '============================================'
\echo 'CLEANUP COMPLETE!'
\echo '============================================'
