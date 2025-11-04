-- Fix Milestone RAB Link Missing category_name
-- This SQL fixes milestones that have RAB link enabled but missing category_name field
-- Run this if you get error: "Category name not found in milestone RAB link"

-- Step 1: Check affected milestones
SELECT 
  m.id,
  m.title,
  m.category_link,
  (SELECT category FROM project_rab WHERE project_id = m.project_id LIMIT 1) as first_rab_category
FROM project_milestones m
WHERE m.category_link->>'enabled' = 'true'
  AND m.category_link->>'category_name' IS NULL;

-- Step 2: Fix by inferring category_name from total_items match
UPDATE project_milestones m
SET category_link = jsonb_set(
  m.category_link,
  '{category_name}',
  to_jsonb((
    SELECT r.category 
    FROM project_rab r 
    WHERE r.project_id = m.project_id 
      AND r.is_approved = true
    GROUP BY r.category
    HAVING COUNT(*) = (m.category_link->>'total_items')::int
    LIMIT 1
  ))
)
WHERE m.category_link->>'enabled' = 'true'
  AND m.category_link->>'category_name' IS NULL
  AND EXISTS (
    SELECT 1 FROM project_rab r 
    WHERE r.project_id = m.project_id 
      AND r.is_approved = true
    GROUP BY r.category
    HAVING COUNT(*) = (m.category_link->>'total_items')::int
  );

-- Step 3: For milestones where auto-fix didn't work, list available categories
SELECT 
  m.id,
  m.title,
  m.project_id,
  m.category_link,
  array_agg(DISTINCT r.category) as available_categories,
  jsonb_object_agg(r.category, COUNT(*)::int) as category_counts
FROM project_milestones m
LEFT JOIN project_rab r ON r.project_id = m.project_id AND r.is_approved = true
WHERE m.category_link->>'enabled' = 'true'
  AND m.category_link->>'category_name' IS NULL
GROUP BY m.id, m.title, m.project_id, m.category_link;

-- Step 4: Manual fix for specific milestone (replace values as needed)
-- UPDATE project_milestones
-- SET category_link = jsonb_set(
--   category_link,
--   '{category_name}',
--   '"Your Category Name Here"'
-- )
-- WHERE id = 'your-milestone-id-here';

-- Example for current milestone:
UPDATE project_milestones
SET category_link = jsonb_set(
  category_link,
  '{category_name}',
  (
    SELECT to_jsonb(r.category)
    FROM project_rab r 
    WHERE r.project_id = project_milestones.project_id 
      AND r.is_approved = true
    GROUP BY r.category
    ORDER BY COUNT(*) DESC
    LIMIT 1
  )
)
WHERE id = '2fc4f9f2-e921-49e0-adf5-920c5b2ac2de';

-- Verify fix
SELECT 
  id,
  title,
  category_link->>'enabled' as link_enabled,
  category_link->>'category_name' as category_name,
  category_link->>'total_items' as total_items,
  category_link->>'total_value' as total_value
FROM project_milestones
WHERE id = '2fc4f9f2-e921-49e0-adf5-920c5b2ac2de';
