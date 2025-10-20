-- Migration: Update Transaction Status Enum for VOID/REVERSE System
-- Date: October 20, 2025
-- Purpose: Extend existing enum with new status values

-- ========================================
-- PART 1: Add New Status Values to Enum
-- ========================================

-- Check current enum values
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status') 
ORDER BY enumsortorder;

-- Add new status values if they don't exist
DO $$ 
BEGIN
    -- Add DRAFT status
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'draft' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status')
    ) THEN
        ALTER TYPE enum_finance_transactions_status ADD VALUE 'draft';
    END IF;
    
    -- Add POSTED status (for clarity, maps to 'completed')
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'posted' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status')
    ) THEN
        ALTER TYPE enum_finance_transactions_status ADD VALUE 'posted';
    END IF;
    
    -- Add VOIDED status (maps to existing 'cancelled')
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'voided' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status')
    ) THEN
        ALTER TYPE enum_finance_transactions_status ADD VALUE 'voided';
    END IF;
    
    -- Add REVERSED status
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'reversed' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status')
    ) THEN
        ALTER TYPE enum_finance_transactions_status ADD VALUE 'reversed';
    END IF;
    
    -- Add APPROVED status
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'approved' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status')
    ) THEN
        ALTER TYPE enum_finance_transactions_status ADD VALUE 'approved';
    END IF;
END $$;

-- ========================================
-- PART 2: Migrate Existing Status Values
-- ========================================

-- Map old status to new status
-- pending -> pending (no change)
-- completed -> posted (more accurate for accounting)
-- cancelled -> voided (more accurate for accounting)
-- failed -> voided (treat as voided)

UPDATE finance_transactions 
SET status = 'posted'::enum_finance_transactions_status 
WHERE status = 'completed'::enum_finance_transactions_status;

UPDATE finance_transactions 
SET status = 'voided'::enum_finance_transactions_status 
WHERE status = 'cancelled'::enum_finance_transactions_status;

UPDATE finance_transactions 
SET status = 'voided'::enum_finance_transactions_status 
WHERE status = 'failed'::enum_finance_transactions_status;

-- ========================================
-- PART 3: Verify Migration
-- ========================================

-- Show updated enum values
SELECT enumlabel, enumsortorder 
FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'enum_finance_transactions_status') 
ORDER BY enumsortorder;

-- Show status distribution after migration
SELECT status, COUNT(*) as count 
FROM finance_transactions 
GROUP BY status 
ORDER BY status;

-- ========================================
-- MIGRATION COMPLETE
-- ========================================

SELECT 'Migration completed successfully! New status values added.' as result;
