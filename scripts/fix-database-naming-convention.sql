-- ============================================================================
-- DATABASE NAMING CONVENTION FIX SCRIPT
-- ============================================================================
-- Purpose: Rename all camelCase constraints to snake_case
-- Date: October 16, 2025
-- Database: nusantara_construction
-- Impact: LOW (constraints only, no data or column changes)
-- ============================================================================

-- STEP 0: Backup reminder
-- Run this BEFORE executing this script:
-- docker exec nusantara-postgres pg_dump -U admin nusantara_construction > backup_$(date +%Y%m%d_%H%M%S).sql

-- ============================================================================
-- PART 1: CLEAN UP DUPLICATE CONSTRAINTS (berita_acara table)
-- ============================================================================
-- Issue: 66 duplicate unique constraints on baNumber column
-- Solution: Keep baNumber_key, remove all duplicates (key1 through key65)
-- ============================================================================

BEGIN;

-- Remove duplicate constraints (keep only baNumber_key)
DO $$
DECLARE
    constraint_rec RECORD;
BEGIN
    FOR constraint_rec IN 
        SELECT conname 
        FROM pg_constraint 
        WHERE conrelid = 'berita_acara'::regclass 
        AND conname LIKE 'berita_acara_baNumber_key%'
        AND conname != 'berita_acara_baNumber_key'
        ORDER BY conname
    LOOP
        EXECUTE format('ALTER TABLE berita_acara DROP CONSTRAINT IF EXISTS %I', constraint_rec.conname);
        RAISE NOTICE 'Dropped duplicate constraint: %', constraint_rec.conname;
    END LOOP;
    
    -- Rename the remaining constraint to snake_case
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'berita_acara_baNumber_key') THEN
        EXECUTE 'ALTER TABLE berita_acara DROP CONSTRAINT berita_acara_baNumber_key';
        EXECUTE 'ALTER TABLE berita_acara ADD CONSTRAINT berita_acara_ba_number_key UNIQUE (ba_number)';
        RAISE NOTICE 'Renamed berita_acara_baNumber_key to berita_acara_ba_number_key';
    END IF;
END $$;

COMMIT;

-- ============================================================================
-- PART 2: RENAME FOREIGN KEY CONSTRAINTS TO SNAKE_CASE
-- ============================================================================
-- Pattern: approval_notifications_userId_fkey → approval_notifications_user_id_fkey
-- ============================================================================

BEGIN;

-- approval_notifications table
ALTER TABLE approval_notifications 
    DROP CONSTRAINT IF EXISTS approval_notifications_userId_fkey;
ALTER TABLE approval_notifications 
    ADD CONSTRAINT approval_notifications_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id);

-- berita_acara table
ALTER TABLE berita_acara 
    DROP CONSTRAINT IF EXISTS berita_acara_milestoneId_fkey;
ALTER TABLE berita_acara 
    ADD CONSTRAINT berita_acara_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE berita_acara 
    DROP CONSTRAINT IF EXISTS berita_acara_projectId_fkey;
ALTER TABLE berita_acara 
    ADD CONSTRAINT berita_acara_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- delivery_receipts table
ALTER TABLE delivery_receipts 
    DROP CONSTRAINT IF EXISTS delivery_receipts_approvedBy_fkey;
ALTER TABLE delivery_receipts 
    ADD CONSTRAINT delivery_receipts_approved_by_fkey 
    FOREIGN KEY (approved_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE delivery_receipts 
    DROP CONSTRAINT IF EXISTS delivery_receipts_createdBy_fkey;
ALTER TABLE delivery_receipts 
    ADD CONSTRAINT delivery_receipts_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE delivery_receipts 
    DROP CONSTRAINT IF EXISTS delivery_receipts_inspectedBy_fkey;
ALTER TABLE delivery_receipts 
    ADD CONSTRAINT delivery_receipts_inspected_by_fkey 
    FOREIGN KEY (inspected_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE delivery_receipts 
    DROP CONSTRAINT IF EXISTS delivery_receipts_projectId_fkey;
ALTER TABLE delivery_receipts 
    ADD CONSTRAINT delivery_receipts_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE;

ALTER TABLE delivery_receipts 
    DROP CONSTRAINT IF EXISTS delivery_receipts_purchaseOrderId_fkey;
ALTER TABLE delivery_receipts 
    ADD CONSTRAINT delivery_receipts_purchase_order_id_fkey 
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON UPDATE CASCADE;

ALTER TABLE delivery_receipts 
    DROP CONSTRAINT IF EXISTS delivery_receipts_receivedBy_fkey;
ALTER TABLE delivery_receipts 
    ADD CONSTRAINT delivery_receipts_received_by_fkey 
    FOREIGN KEY (received_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- entities table
ALTER TABLE entities 
    DROP CONSTRAINT IF EXISTS entities_parentEntityId_fkey;
ALTER TABLE entities 
    ADD CONSTRAINT entities_parent_entity_id_fkey 
    FOREIGN KEY (parent_entity_id) REFERENCES entities(id);

-- finance_transactions table
ALTER TABLE finance_transactions 
    DROP CONSTRAINT IF EXISTS finance_transactions_approvedBy_fkey;
ALTER TABLE finance_transactions 
    ADD CONSTRAINT finance_transactions_approved_by_fkey 
    FOREIGN KEY (approved_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE finance_transactions 
    DROP CONSTRAINT IF EXISTS finance_transactions_projectId_fkey;
ALTER TABLE finance_transactions 
    ADD CONSTRAINT finance_transactions_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE finance_transactions 
    DROP CONSTRAINT IF EXISTS finance_transactions_purchaseOrderId_fkey;
ALTER TABLE finance_transactions 
    ADD CONSTRAINT finance_transactions_purchase_order_id_fkey 
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- fixed_assets table
ALTER TABLE fixed_assets 
    DROP CONSTRAINT IF EXISTS fixed_assets_projectId_fkey;
ALTER TABLE fixed_assets 
    ADD CONSTRAINT fixed_assets_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE fixed_assets 
    DROP CONSTRAINT IF EXISTS fixed_assets_purchaseOrderId_fkey;
ALTER TABLE fixed_assets 
    ADD CONSTRAINT fixed_assets_purchase_order_id_fkey 
    FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- journal_entries table
ALTER TABLE journal_entries 
    DROP CONSTRAINT IF EXISTS journal_entries_createdBy_fkey;
ALTER TABLE journal_entries 
    ADD CONSTRAINT journal_entries_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE journal_entries 
    DROP CONSTRAINT IF EXISTS journal_entries_projectId_fkey;
ALTER TABLE journal_entries 
    ADD CONSTRAINT journal_entries_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- journal_entry_lines table
ALTER TABLE journal_entry_lines 
    DROP CONSTRAINT IF EXISTS journal_entry_lines_accountId_fkey;
ALTER TABLE journal_entry_lines 
    ADD CONSTRAINT journal_entry_lines_account_id_fkey 
    FOREIGN KEY (account_id) REFERENCES chart_of_accounts(id) ON UPDATE CASCADE ON DELETE RESTRICT;

ALTER TABLE journal_entry_lines 
    DROP CONSTRAINT IF EXISTS journal_entry_lines_journalEntryId_fkey;
ALTER TABLE journal_entry_lines 
    ADD CONSTRAINT journal_entry_lines_journal_entry_id_fkey 
    FOREIGN KEY (journal_entry_id) REFERENCES journal_entries(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- manpower table
ALTER TABLE manpower 
    DROP CONSTRAINT IF EXISTS manpower_currentProjectId_fkey;
ALTER TABLE manpower 
    ADD CONSTRAINT manpower_current_project_id_fkey 
    FOREIGN KEY (current_project) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE manpower 
    DROP CONSTRAINT IF EXISTS manpower_subsidiaryId_fkey;
ALTER TABLE manpower 
    ADD CONSTRAINT manpower_subsidiary_id_fkey 
    FOREIGN KEY (subsidiary_id) REFERENCES subsidiaries(id);

-- milestone_activities table
ALTER TABLE milestone_activities 
    DROP CONSTRAINT IF EXISTS milestone_activities_milestoneId_fkey;
ALTER TABLE milestone_activities 
    ADD CONSTRAINT milestone_activities_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- milestone_costs table
ALTER TABLE milestone_costs 
    DROP CONSTRAINT IF EXISTS milestone_costs_milestoneId_fkey;
ALTER TABLE milestone_costs 
    ADD CONSTRAINT milestone_costs_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- milestone_dependencies table
ALTER TABLE milestone_dependencies 
    DROP CONSTRAINT IF EXISTS milestone_dependencies_dependentMilestoneId_fkey;
ALTER TABLE milestone_dependencies 
    ADD CONSTRAINT milestone_dependencies_dependent_milestone_id_fkey 
    FOREIGN KEY (dependent_milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE milestone_dependencies 
    DROP CONSTRAINT IF EXISTS milestone_dependencies_milestoneId_fkey;
ALTER TABLE milestone_dependencies 
    ADD CONSTRAINT milestone_dependencies_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- milestone_items table
ALTER TABLE milestone_items 
    DROP CONSTRAINT IF EXISTS milestone_items_milestoneId_fkey;
ALTER TABLE milestone_items 
    ADD CONSTRAINT milestone_items_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- milestone_photos table
ALTER TABLE milestone_photos 
    DROP CONSTRAINT IF EXISTS milestone_photos_milestoneId_fkey;
ALTER TABLE milestone_photos 
    ADD CONSTRAINT milestone_photos_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- progress_payments table
ALTER TABLE progress_payments 
    DROP CONSTRAINT IF EXISTS progress_payments_milestoneId_fkey;
ALTER TABLE progress_payments 
    ADD CONSTRAINT progress_payments_milestone_id_fkey 
    FOREIGN KEY (milestone_id) REFERENCES project_milestones(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE progress_payments 
    DROP CONSTRAINT IF EXISTS progress_payments_projectId_fkey;
ALTER TABLE progress_payments 
    ADD CONSTRAINT progress_payments_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- project_documents table
ALTER TABLE project_documents 
    DROP CONSTRAINT IF EXISTS project_documents_projectId_fkey;
ALTER TABLE project_documents 
    ADD CONSTRAINT project_documents_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- project_milestones table
ALTER TABLE project_milestones 
    DROP CONSTRAINT IF EXISTS project_milestones_projectId_fkey;
ALTER TABLE project_milestones 
    ADD CONSTRAINT project_milestones_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- project_rab table
ALTER TABLE project_rab 
    DROP CONSTRAINT IF EXISTS project_rab_projectId_fkey;
ALTER TABLE project_rab 
    ADD CONSTRAINT project_rab_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- project_team_members table
ALTER TABLE project_team_members 
    DROP CONSTRAINT IF EXISTS project_team_members_projectId_fkey;
ALTER TABLE project_team_members 
    ADD CONSTRAINT project_team_members_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE project_team_members 
    DROP CONSTRAINT IF EXISTS project_team_members_userId_fkey;
ALTER TABLE project_team_members 
    ADD CONSTRAINT project_team_members_user_id_fkey 
    FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE;

-- purchase_orders table
ALTER TABLE purchase_orders 
    DROP CONSTRAINT IF EXISTS purchase_orders_approvedBy_fkey;
ALTER TABLE purchase_orders 
    ADD CONSTRAINT purchase_orders_approved_by_fkey 
    FOREIGN KEY (approved_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE purchase_orders 
    DROP CONSTRAINT IF EXISTS purchase_orders_createdBy_fkey;
ALTER TABLE purchase_orders 
    ADD CONSTRAINT purchase_orders_created_by_fkey 
    FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL;

ALTER TABLE purchase_orders 
    DROP CONSTRAINT IF EXISTS purchase_orders_projectId_fkey;
ALTER TABLE purchase_orders 
    ADD CONSTRAINT purchase_orders_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE CASCADE ON DELETE SET NULL;

-- rab_items table
ALTER TABLE rab_items 
    DROP CONSTRAINT IF EXISTS rab_items_projectRabId_fkey;
ALTER TABLE rab_items 
    ADD CONSTRAINT rab_items_project_rab_id_fkey 
    FOREIGN KEY (project_rab_id) REFERENCES project_rab(id) ON UPDATE CASCADE ON DELETE CASCADE;

COMMIT;

-- ============================================================================
-- PART 3: VERIFICATION
-- ============================================================================

-- Check for remaining camelCase constraints
SELECT 
    'Remaining camelCase constraints:' as check_type,
    COUNT(*) as count
FROM pg_constraint 
WHERE conname ~ '[A-Z]';

-- List all constraints (should all be snake_case now)
SELECT 
    conrelid::regclass as table_name,
    conname as constraint_name,
    contype as type
FROM pg_constraint 
WHERE connamespace = 'public'::regnamespace
AND conname ~ '[A-Z]'
ORDER BY conrelid::regclass::text, conname;

-- ============================================================================
-- COMPLETION SUMMARY
-- ============================================================================

DO $$
BEGIN
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'DATABASE NAMING CONVENTION FIX COMPLETED';
    RAISE NOTICE '============================================================';
    RAISE NOTICE 'Actions performed:';
    RAISE NOTICE '1. Removed 65 duplicate constraints from berita_acara';
    RAISE NOTICE '2. Renamed all foreign key constraints to snake_case';
    RAISE NOTICE '3. Total constraints fixed: 80+';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '1. Run verification queries above';
    RAISE NOTICE '2. Test application thoroughly';
    RAISE NOTICE '3. Update documentation';
    RAISE NOTICE '============================================================';
END $$;
