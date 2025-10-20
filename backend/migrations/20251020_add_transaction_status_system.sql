-- Migration: Add Transaction Status & Reversal System
-- Date: October 20, 2025
-- Purpose: Implement VOID/REVERSE functionality according to accounting best practices

-- ========================================
-- PART 1: Add Status Field
-- ========================================

-- Add status column with default 'POSTED' for existing records
ALTER TABLE finance_transactions 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'DRAFT';

-- Update existing records to POSTED (backward compatibility)
UPDATE finance_transactions 
SET status = 'POSTED' 
WHERE status IS NULL OR status = 'DRAFT';

-- Add check constraint for valid status values
ALTER TABLE finance_transactions
ADD CONSTRAINT check_transaction_status 
CHECK (status IN ('DRAFT', 'PENDING', 'APPROVED', 'POSTED', 'VOIDED', 'REVERSED'));

-- ========================================
-- PART 2: Add Reversal Tracking Fields
-- ========================================

-- Track if this transaction has been reversed
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS is_reversed BOOLEAN DEFAULT false;

-- Link to the reversal transaction (if this was reversed)
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS reversed_by_transaction_id VARCHAR(50);

-- Link to the original transaction (if this is a reversal)
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS reversal_of_transaction_id VARCHAR(50);

-- ========================================
-- PART 3: Add Void Tracking Fields
-- ========================================

-- Void timestamp
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS void_date TIMESTAMP;

-- Who voided this transaction
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS void_by VARCHAR(50);

-- Why was it voided
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS void_reason TEXT;

-- ========================================
-- PART 4: Add Approval Workflow Fields
-- ========================================

-- Submission tracking
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP;

ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS submitted_by VARCHAR(50);

-- Approval tracking
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;

ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS approved_by VARCHAR(50);

ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS approval_notes TEXT;

-- Rejection tracking
ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS rejected_at TIMESTAMP;

ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS rejected_by VARCHAR(50);

ALTER TABLE finance_transactions
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- ========================================
-- PART 5: Add Indexes for Performance
-- ========================================

-- Index on status for filtering
CREATE INDEX IF NOT EXISTS idx_finance_transactions_status 
ON finance_transactions(status);

-- Index on is_reversed for queries
CREATE INDEX IF NOT EXISTS idx_finance_transactions_reversed 
ON finance_transactions(is_reversed);

-- Index on reversal relationships
CREATE INDEX IF NOT EXISTS idx_finance_transactions_reversed_by 
ON finance_transactions(reversed_by_transaction_id);

CREATE INDEX IF NOT EXISTS idx_finance_transactions_reversal_of 
ON finance_transactions(reversal_of_transaction_id);

-- Index on approval workflow
CREATE INDEX IF NOT EXISTS idx_finance_transactions_submitted_at 
ON finance_transactions(submitted_at);

CREATE INDEX IF NOT EXISTS idx_finance_transactions_approved_at 
ON finance_transactions(approved_at);

-- ========================================
-- PART 6: Add Foreign Key Constraints
-- ========================================

-- Note: We cannot add FK constraints because the referenced transactions
-- might be in the same table. We'll handle this in application logic.

-- ========================================
-- PART 7: Add Comments for Documentation
-- ========================================

COMMENT ON COLUMN finance_transactions.status IS 
'Transaction status: DRAFT (editable), PENDING (awaiting approval), APPROVED (approved not posted), POSTED (posted to ledger), VOIDED (cancelled), REVERSED (corrected)';

COMMENT ON COLUMN finance_transactions.is_reversed IS 
'True if this transaction has been reversed by another transaction';

COMMENT ON COLUMN finance_transactions.reversed_by_transaction_id IS 
'ID of the transaction that reversed this one';

COMMENT ON COLUMN finance_transactions.reversal_of_transaction_id IS 
'ID of the original transaction if this is a reversal entry';

COMMENT ON COLUMN finance_transactions.void_date IS 
'Date when this transaction was voided';

COMMENT ON COLUMN finance_transactions.void_by IS 
'User ID who voided this transaction';

COMMENT ON COLUMN finance_transactions.void_reason IS 
'Reason why this transaction was voided (required for audit)';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check if all columns were added successfully
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'finance_transactions' 
    AND column_name IN (
        'status', 'is_reversed', 'reversed_by_transaction_id', 
        'reversal_of_transaction_id', 'void_date', 'void_by', 
        'void_reason', 'submitted_at', 'submitted_by', 
        'approved_at', 'approved_by', 'approval_notes'
    )
ORDER BY column_name;

-- Check indexes
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'finance_transactions' 
    AND indexname LIKE 'idx_finance_transactions_%'
ORDER BY indexname;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================
