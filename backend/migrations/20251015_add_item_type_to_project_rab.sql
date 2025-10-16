-- Migration: Add item_type field to project_rab table
-- Date: 2024-10-15
-- Purpose: Support Purchase Order vs Work Order separation

-- Step 1: Create ENUM type for item_type
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'rab_item_type') THEN
        CREATE TYPE rab_item_type AS ENUM ('material', 'service', 'labor', 'equipment', 'overhead');
    END IF;
END $$;

-- Step 2: Add item_type column to project_rab table
ALTER TABLE project_rab 
ADD COLUMN IF NOT EXISTS item_type rab_item_type DEFAULT 'material';

-- Step 3: Add comment for documentation
COMMENT ON COLUMN project_rab.item_type IS 'Type of RAB item: material (bahan), service (jasa), labor (tenaga kerja), equipment (peralatan), overhead (overhead)';

-- Step 4: Update existing records based on category keywords
-- This is a one-time migration to set proper item_type for existing data

-- Update items with "jasa" or "service" keywords to 'service'
UPDATE project_rab
SET item_type = 'service'
WHERE (
    LOWER(category) LIKE '%jasa%' OR 
    LOWER(category) LIKE '%service%' OR
    LOWER(description) LIKE '%jasa%' OR
    LOWER(description) LIKE '%instalasi%' OR
    LOWER(description) LIKE '%pasang%'
) AND item_type = 'material';

-- Update items with labor keywords to 'labor'
UPDATE project_rab
SET item_type = 'labor'
WHERE (
    LOWER(category) LIKE '%upah%' OR 
    LOWER(category) LIKE '%tenaga%' OR
    LOWER(category) LIKE '%labor%' OR
    LOWER(category) LIKE '%pekerja%' OR
    LOWER(category) LIKE '%tukang%' OR
    LOWER(category) LIKE '%kuli%' OR
    LOWER(category) LIKE '%man power%' OR
    LOWER(description) LIKE '%upah%' OR
    LOWER(description) LIKE '%tenaga kerja%' OR
    LOWER(description) LIKE '%kuli%' OR
    LOWER(description) LIKE '%man power%'
) AND item_type = 'material';

-- Update items with equipment keywords to 'equipment'
UPDATE project_rab
SET item_type = 'equipment'
WHERE (
    LOWER(category) LIKE '%alat%' OR 
    LOWER(category) LIKE '%equipment%' OR
    LOWER(category) LIKE '%sewa%' OR
    LOWER(description) LIKE '%alat%' OR
    LOWER(description) LIKE '%equipment%' OR
    LOWER(description) LIKE '%sewa%'
) AND item_type = 'material';

-- Verify the migration
SELECT 
    item_type,
    COUNT(*) as count,
    STRING_AGG(DISTINCT category, ', ') as categories
FROM project_rab
GROUP BY item_type
ORDER BY item_type;

-- Show sample of updated records
SELECT 
    id,
    category,
    description,
    item_type
FROM project_rab
LIMIT 20;
