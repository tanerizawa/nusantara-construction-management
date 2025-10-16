-- ================================================================
-- RAB Item Type Auto-Fix Script
-- Purpose: Fix wrong item_type values in project_rab table
-- Usage: Run this script after importing old data or finding miscategorized items
-- ================================================================

-- Backup recommendation:
-- pg_dump -U admin -d nusantara_construction --table=project_rab --file=/tmp/project_rab_backup_$(date +%Y%m%d_%H%M%S).sql

BEGIN;

-- ================================================================
-- 1. FIX LABOR ITEMS (should be in Work Orders)
-- ================================================================
UPDATE project_rab 
SET item_type = 'labor' 
WHERE item_type != 'labor' 
AND (
  -- Indonesian keywords for labor
  description ILIKE '%borongan%' OR
  description ILIKE '%tukang%' OR
  description ILIKE '%upah%' OR
  description ILIKE '%mandor%' OR
  description ILIKE '%tenaga%' OR
  description ILIKE '%kuli%' OR
  description ILIKE '%pekerja%' OR
  description ILIKE '%buruh%' OR
  
  -- English keywords for labor
  description ILIKE '%labor%' OR
  description ILIKE '%worker%' OR
  description ILIKE '%foreman%' OR
  
  -- Category-based detection
  category ILIKE '%upah%' OR
  category ILIKE '%tenaga%' OR
  category ILIKE '%labor%'
);

-- ================================================================
-- 2. FIX SERVICE ITEMS (should be in Work Orders)
-- ================================================================
UPDATE project_rab 
SET item_type = 'service' 
WHERE item_type != 'service' 
AND item_type != 'labor' -- Don't override labor items
AND (
  -- Indonesian keywords for service
  description ILIKE '%jasa%' OR
  description ILIKE '%instalasi%' OR
  description ILIKE '%pemasangan%' OR
  description ILIKE '%subkontraktor%' OR
  description ILIKE '%kontraktor%' OR
  
  -- English keywords for service
  description ILIKE '%service%' OR
  description ILIKE '%installation%' OR
  description ILIKE '%contractor%' OR
  
  -- Category-based detection
  category ILIKE '%jasa%' OR
  category ILIKE '%service%'
);

-- ================================================================
-- 3. FIX EQUIPMENT ITEMS (should be in Work Orders)
-- ================================================================
UPDATE project_rab 
SET item_type = 'equipment' 
WHERE item_type != 'equipment' 
AND item_type NOT IN ('labor', 'service') -- Don't override labor/service
AND (
  -- Indonesian keywords for equipment
  description ILIKE '%sewa%' OR
  description ILIKE '%rental%' OR
  description ILIKE '%alat berat%' OR
  description ILIKE '%excavator%' OR
  description ILIKE '%bulldozer%' OR
  description ILIKE '%crane%' OR
  description ILIKE '%mixer%' OR
  
  -- English keywords for equipment
  description ILIKE '%rent%' OR
  description ILIKE '%equipment%' OR
  description ILIKE '%machinery%' OR
  
  -- Category-based detection
  category ILIKE '%alat%' OR
  category ILIKE '%equipment%' OR
  category ILIKE '%sewa%'
);

-- ================================================================
-- 4. REPORT RESULTS
-- ================================================================

-- Show summary by type
SELECT 
  '=== SUMMARY BY ITEM TYPE ===' as report,
  '' as spacer;
  
SELECT 
  item_type,
  COUNT(*) as total_items,
  SUM(total_price) as total_value,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM project_rab), 2) as percentage
FROM project_rab
GROUP BY item_type
ORDER BY total_items DESC;

-- Show items that might need manual review
SELECT 
  '' as spacer,
  '=== ITEMS THAT MIGHT NEED MANUAL REVIEW ===' as report,
  '' as spacer2;

SELECT 
  id,
  description,
  category,
  item_type,
  total_price
FROM project_rab
WHERE 
  -- Material items with suspicious keywords
  (item_type = 'material' AND (
    description ILIKE '%borongan%' OR
    description ILIKE '%upah%' OR
    description ILIKE '%jasa%' OR
    description ILIKE '%sewa%'
  ))
  OR
  -- Very generic descriptions
  (description SIMILAR TO '%(item|barang|material)%' AND LENGTH(description) < 15)
ORDER BY created_at DESC
LIMIT 20;

-- Show recently fixed items
SELECT 
  '' as spacer,
  '=== RECENTLY MODIFIED ITEMS ===' as report,
  '' as spacer2;

SELECT 
  id,
  description,
  category,
  item_type,
  updated_at
FROM project_rab
WHERE updated_at > NOW() - INTERVAL '1 hour'
ORDER BY updated_at DESC
LIMIT 20;

COMMIT;

-- ================================================================
-- VERIFICATION QUERIES
-- ================================================================

-- Check specific keywords
-- SELECT id, description, item_type FROM project_rab WHERE description ILIKE '%borongan%';
-- SELECT id, description, item_type FROM project_rab WHERE description ILIKE '%tukang%';
-- SELECT id, description, item_type FROM project_rab WHERE description ILIKE '%jasa%';
-- SELECT id, description, item_type FROM project_rab WHERE description ILIKE '%sewa%';

-- Count by type
-- SELECT item_type, COUNT(*) FROM project_rab GROUP BY item_type;
