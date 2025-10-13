-- ============================================================================
-- MIGRATION: Rename camelCase timestamps to snake_case
-- Date: 2025-10-13
-- Purpose: Fix naming convention inconsistency between database and Sequelize
-- 
-- CRITICAL: This migration renames createdAt/updatedAt to created_at/updated_at
-- to align with Sequelize models that now have underscored: true
-- ============================================================================

-- Start transaction
BEGIN;

-- Backup information
-- All changes can be reverted by replacing created_at → createdAt, updated_at → updatedAt

-- ============================================================================
-- TABLE: berita_acara
-- ============================================================================
ALTER TABLE berita_acara 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE berita_acara 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: delivery_receipts
-- ============================================================================
ALTER TABLE delivery_receipts 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE delivery_receipts 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: entities
-- ============================================================================
ALTER TABLE entities 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE entities 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: finance_transactions
-- ============================================================================
ALTER TABLE finance_transactions 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE finance_transactions 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: fixed_assets
-- ============================================================================
ALTER TABLE fixed_assets 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE fixed_assets 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: inventory_items
-- ============================================================================
ALTER TABLE inventory_items 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE inventory_items 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: journal_entries
-- ============================================================================
ALTER TABLE journal_entries 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE journal_entries 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: journal_entry_lines
-- ============================================================================
ALTER TABLE journal_entry_lines 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE journal_entry_lines 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: progress_payments
-- ============================================================================
ALTER TABLE progress_payments 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE progress_payments 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: project_documents
-- ============================================================================
ALTER TABLE project_documents 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE project_documents 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: project_milestones
-- ============================================================================
ALTER TABLE project_milestones 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE project_milestones 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: project_rab
-- ============================================================================
ALTER TABLE project_rab 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE project_rab 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: project_team_members
-- ============================================================================
ALTER TABLE project_team_members 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE project_team_members 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: projects
-- ============================================================================
ALTER TABLE projects 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE projects 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: purchase_orders
-- ============================================================================
ALTER TABLE purchase_orders 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE purchase_orders 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: rab_items_availability
-- ============================================================================
ALTER TABLE rab_items_availability 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE rab_items_availability 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: rab_purchase_tracking
-- ============================================================================
ALTER TABLE rab_purchase_tracking 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE rab_purchase_tracking 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: subsidiaries
-- ============================================================================
ALTER TABLE subsidiaries 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE subsidiaries 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: tax_records
-- ============================================================================
ALTER TABLE tax_records 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE tax_records 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- TABLE: users
-- ============================================================================
ALTER TABLE users 
  RENAME COLUMN "createdAt" TO created_at;
  
ALTER TABLE users 
  RENAME COLUMN "updatedAt" TO updated_at;

-- ============================================================================
-- Commit all changes
-- ============================================================================
COMMIT;

-- Verify changes
SELECT 
  table_name, 
  column_name,
  data_type
FROM information_schema.columns 
WHERE column_name IN ('created_at', 'updated_at') 
  AND table_schema = 'public'
ORDER BY table_name, column_name;

-- Success message
\echo '✅ Migration complete: All timestamp columns renamed to snake_case'
\echo '📊 Total tables updated: 20'
\echo '📊 Total columns renamed: 40 (20 × created_at + 20 × updated_at)'
