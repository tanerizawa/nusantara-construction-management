-- ============================================================================
-- ROLLBACK: Revert snake_case timestamps back to camelCase
-- Date: 2025-10-13
-- Purpose: Rollback migration if needed
-- 
-- USAGE: Only use this if rename-timestamps-to-snake-case.sql needs to be reverted
-- ============================================================================

BEGIN;

-- Revert all changes (created_at → createdAt, updated_at → updatedAt)

ALTER TABLE berita_acara RENAME COLUMN created_at TO "createdAt";
ALTER TABLE berita_acara RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE delivery_receipts RENAME COLUMN created_at TO "createdAt";
ALTER TABLE delivery_receipts RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE entities RENAME COLUMN created_at TO "createdAt";
ALTER TABLE entities RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE finance_transactions RENAME COLUMN created_at TO "createdAt";
ALTER TABLE finance_transactions RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE fixed_assets RENAME COLUMN created_at TO "createdAt";
ALTER TABLE fixed_assets RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE inventory_items RENAME COLUMN created_at TO "createdAt";
ALTER TABLE inventory_items RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE journal_entries RENAME COLUMN created_at TO "createdAt";
ALTER TABLE journal_entries RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE journal_entry_lines RENAME COLUMN created_at TO "createdAt";
ALTER TABLE journal_entry_lines RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE progress_payments RENAME COLUMN created_at TO "createdAt";
ALTER TABLE progress_payments RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE project_documents RENAME COLUMN created_at TO "createdAt";
ALTER TABLE project_documents RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE project_milestones RENAME COLUMN created_at TO "createdAt";
ALTER TABLE project_milestones RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE project_rab RENAME COLUMN created_at TO "createdAt";
ALTER TABLE project_rab RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE project_team_members RENAME COLUMN created_at TO "createdAt";
ALTER TABLE project_team_members RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE projects RENAME COLUMN created_at TO "createdAt";
ALTER TABLE projects RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE purchase_orders RENAME COLUMN created_at TO "createdAt";
ALTER TABLE purchase_orders RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE rab_items_availability RENAME COLUMN created_at TO "createdAt";
ALTER TABLE rab_items_availability RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE rab_purchase_tracking RENAME COLUMN created_at TO "createdAt";
ALTER TABLE rab_purchase_tracking RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE subsidiaries RENAME COLUMN created_at TO "createdAt";
ALTER TABLE subsidiaries RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE tax_records RENAME COLUMN created_at TO "createdAt";
ALTER TABLE tax_records RENAME COLUMN updated_at TO "updatedAt";

ALTER TABLE users RENAME COLUMN created_at TO "createdAt";
ALTER TABLE users RENAME COLUMN updated_at TO "updatedAt";

COMMIT;

\echo '✅ Rollback complete: All timestamp columns reverted to camelCase'
