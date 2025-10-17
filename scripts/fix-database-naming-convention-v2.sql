-- ============================================================================
-- DATABASE NAMING CONVENTION FIX SCRIPT - SIMPLIFIED VERSION
-- ============================================================================
-- Purpose: Rename camelCase constraints to snake_case (only existing ones)
-- Date: October 16, 2025
-- ============================================================================

BEGIN;

-- ============================================================================
-- PART 1: CLEAN UP DUPLICATE CONSTRAINTS (berita_acara table)
-- ============================================================================

DO $$
DECLARE
    constraint_rec RECORD;
    dropped_count INT := 0;
BEGIN
    -- Remove all duplicate baNumber constraints
    FOR constraint_rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'berita_acara'::regclass 
        AND conname LIKE 'berita_acara_baNumber_key%'
        ORDER BY conname
    LOOP
        EXECUTE format('ALTER TABLE berita_acara DROP CONSTRAINT IF EXISTS %I', constraint_rec.conname);
        dropped_count := dropped_count + 1;
    END LOOP;
    
    -- Add back ONE snake_case constraint
    EXECUTE 'ALTER TABLE berita_acara ADD CONSTRAINT berita_acara_ba_number_key UNIQUE (ba_number)';
    
    RAISE NOTICE 'Cleaned up berita_acara constraints: Removed % duplicates, added 1 snake_case constraint', dropped_count;
END $$;

-- ============================================================================
-- PART 2: RENAME FOREIGN KEY CONSTRAINTS TO SNAKE_CASE
-- ============================================================================

DO $$
DECLARE
    constraint_rec RECORD;
    new_name TEXT;
    renamed_count INT := 0;
BEGIN
    -- Find all camelCase foreign key constraints
    FOR constraint_rec IN 
        SELECT 
            conname,
            conrelid::regclass::text as table_name,
            pg_get_constraintdef(oid) as constraint_def
        FROM pg_constraint 
        WHERE contype = 'f' 
        AND conname ~ '[A-Z]'
        ORDER BY conrelid::regclass::text, conname
    LOOP
        -- Generate snake_case name
        new_name := REPLACE(
            REPLACE(
                REPLACE(
                    REPLACE(
                        REPLACE(
                            REPLACE(constraint_rec.conname, 'userId', 'user_id'),
                            'projectId', 'project_id'
                        ),
                        'milestoneId', 'milestone_id'
                    ),
                    'beritaAcaraId', 'berita_acara_id'
                ),
                'approvedBy', 'approved_by'
            ),
            'createdBy', 'created_by'
        );
        
        -- Skip if already snake_case
        IF new_name != constraint_rec.conname THEN
            -- Drop old constraint
            EXECUTE format('ALTER TABLE %I DROP CONSTRAINT IF EXISTS %I', 
                          constraint_rec.table_name, constraint_rec.conname);
            
            -- Add new constraint with snake_case name
            EXECUTE format('ALTER TABLE %I ADD CONSTRAINT %I %s', 
                          constraint_rec.table_name, new_name, constraint_rec.constraint_def);
            
            renamed_count := renamed_count + 1;
            RAISE NOTICE 'Renamed: % → %', constraint_rec.conname, new_name;
        END IF;
    END LOOP;
    
    RAISE NOTICE 'Total foreign key constraints renamed: %', renamed_count;
END $$;

COMMIT;

-- ============================================================================
-- VERIFICATION
-- ============================================================================

\echo '\n============================================================'
\echo 'VERIFICATION RESULTS'
\echo '============================================================\n'

-- Count remaining camelCase constraints
SELECT 
    'CamelCase constraints remaining:' as metric,
    COUNT(*) as count
FROM pg_constraint 
WHERE conname ~ '[A-Z]';

-- List them if any
\echo '\nRemaining camelCase constraints (if any):\n'
SELECT 
    conrelid::regclass as table_name,
    conname as constraint_name,
    contype as type
FROM pg_constraint 
WHERE conname ~ '[A-Z]'
ORDER BY conrelid::regclass::text, conname;

\echo '\n============================================================'
\echo 'FIX COMPLETED SUCCESSFULLY!'
\echo '============================================================\n'
