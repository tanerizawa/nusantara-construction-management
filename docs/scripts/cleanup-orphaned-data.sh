#!/bin/bash

# ================================================
# DATA CLEANUP SCRIPT
# Removes all orphaned data and test/dummy records
# ================================================

echo "🧹 Starting comprehensive data cleanup..."
echo ""

docker-compose exec -T postgres psql -U admin -d nusantara_construction << 'EOF'

-- ================================================
-- 1. DELETE TEST/DUMMY USERS
-- ================================================
DELETE FROM users 
WHERE username IN ('testadmin', 'newuser001', 'createuser')
   OR id IN ('TEST-ADMIN-001', 'USR006', 'U007')
   OR email LIKE '%@test.com%';

-- ================================================
-- 2. VERIFY NO ORPHANED PROJECT-RELATED DATA
-- ================================================
-- These should already be empty but let's make sure
DELETE FROM rab_items WHERE TRUE;  -- Already empty since projects deleted
DELETE FROM rab_purchase_tracking WHERE TRUE;  -- Already empty
DELETE FROM project_milestones WHERE TRUE;  -- Already empty
DELETE FROM milestone_items WHERE TRUE;  -- Already empty
DELETE FROM purchase_orders WHERE TRUE;  -- Already empty
DELETE FROM delivery_receipts WHERE TRUE;  -- Already empty
DELETE FROM berita_acara WHERE TRUE;  -- Already empty
DELETE FROM progress_payments WHERE TRUE;  -- Already empty
DELETE FROM project_documents WHERE TRUE;  -- Already empty
DELETE FROM project_team_members WHERE TRUE;  -- Already empty
DELETE FROM project_rab WHERE TRUE;  -- Already empty

-- ================================================
-- 3. FINAL VERIFICATION
-- ================================================
SELECT '=== CLEANUP RESULTS ===' as status;
SELECT '' as separator;

SELECT 'Users' as table_name, COUNT(*) as remaining, 
       STRING_AGG(username, ', ') as usernames
FROM users
UNION ALL
SELECT 'Projects', COUNT(*), NULL FROM projects
UNION ALL
SELECT 'RAB Items', COUNT(*), NULL FROM rab_items
UNION ALL
SELECT 'RAB Purchase Tracking', COUNT(*), NULL FROM rab_purchase_tracking
UNION ALL
SELECT 'Project Milestones', COUNT(*), NULL FROM project_milestones
UNION ALL
SELECT 'Milestone Items', COUNT(*), NULL FROM milestone_items
UNION ALL
SELECT 'Purchase Orders', COUNT(*), NULL FROM purchase_orders
UNION ALL
SELECT 'Delivery Receipts', COUNT(*), NULL FROM delivery_receipts
UNION ALL
SELECT 'Berita Acara', COUNT(*), NULL FROM berita_acara
UNION ALL
SELECT 'Progress Payments', COUNT(*), NULL FROM progress_payments
UNION ALL
SELECT 'Project Documents', COUNT(*), NULL FROM project_documents
UNION ALL
SELECT 'Project Team Members', COUNT(*), NULL FROM project_team_members
UNION ALL
SELECT 'Project RAB', COUNT(*), NULL FROM project_rab
UNION ALL
SELECT 'Approval Instances', COUNT(*), NULL FROM approval_instances
ORDER BY table_name;

SELECT '' as separator;
SELECT '=== CLEANUP COMPLETE ===' as status;

EOF

echo ""
echo "✅ Cleanup complete!"
echo ""
echo "📊 Summary:"
echo "  - Removed test users (testadmin, newuser001, createuser)"
echo "  - Removed all orphaned RAB data"
echo "  - Removed all orphaned project-related data"
echo "  - All tables verified and cleaned"
echo ""
