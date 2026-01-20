#!/bin/bash

echo "🗑️  DATABASE CLEANUP - Keep Only Users & Subsidiaries"
echo "====================================================="
echo ""

# Execute cleanup
docker exec nusantara-postgres psql -U admin -d nusantara_construction << 'EOF'

-- Disable foreign key checks temporarily
SET session_replication_role = 'replica';

-- ==========================================
-- 1. DELETE PROJECT-RELATED DATA
-- ==========================================
TRUNCATE TABLE project_documents CASCADE;
TRUNCATE TABLE project_milestones CASCADE;
TRUNCATE TABLE project_team_members CASCADE;
TRUNCATE TABLE project_locations CASCADE;
TRUNCATE TABLE project_rab CASCADE;
TRUNCATE TABLE rab_items CASCADE;
TRUNCATE TABLE rab_purchase_tracking CASCADE;
TRUNCATE TABLE rab_work_order_tracking CASCADE;
TRUNCATE TABLE milestone_activities CASCADE;
TRUNCATE TABLE milestone_costs CASCADE;
TRUNCATE TABLE milestone_dependencies CASCADE;
TRUNCATE TABLE milestone_items CASCADE;
TRUNCATE TABLE milestone_photos CASCADE;
TRUNCATE TABLE project_additional_expenses CASCADE;

-- Purchase Orders & Work Orders
TRUNCATE TABLE purchase_orders CASCADE;
TRUNCATE TABLE work_orders CASCADE;
TRUNCATE TABLE delivery_receipts CASCADE;

-- Berita Acara
TRUNCATE TABLE berita_acara CASCADE;

-- Projects (last, after all related tables)
TRUNCATE TABLE projects CASCADE;

-- ==========================================
-- 2. DELETE FINANCIAL DATA & HISTORY
-- ==========================================
TRUNCATE TABLE finance_transactions CASCADE;
TRUNCATE TABLE journal_entries CASCADE;
TRUNCATE TABLE journal_entry_lines CASCADE;
TRUNCATE TABLE tax_records CASCADE;
TRUNCATE TABLE progress_payments CASCADE;
TRUNCATE TABLE fixed_assets CASCADE;

-- Chart of Accounts
TRUNCATE TABLE chart_of_accounts CASCADE;

-- ==========================================
-- 3. DELETE NOTIFICATIONS
-- ==========================================
TRUNCATE TABLE notification_tokens CASCADE;
TRUNCATE TABLE approval_notifications CASCADE;
TRUNCATE TABLE notifications CASCADE;
TRUNCATE TABLE notification_preferences CASCADE;

-- ==========================================
-- 4. DELETE ATTENDANCE & LEAVE
-- ==========================================
TRUNCATE TABLE attendance_records CASCADE;
TRUNCATE TABLE leave_requests CASCADE;

-- ==========================================
-- 5. DELETE APPROVAL WORKFLOWS & INSTANCES
-- ==========================================
TRUNCATE TABLE approval_instances CASCADE;
TRUNCATE TABLE approval_steps CASCADE;
TRUNCATE TABLE approval_workflows CASCADE;

-- ==========================================
-- 6. DELETE AUDIT LOGS & HISTORY
-- ==========================================
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE login_history CASCADE;
TRUNCATE TABLE backup_history CASCADE;

-- ==========================================
-- 7. DELETE OTHER DATA
-- ==========================================
TRUNCATE TABLE entities CASCADE;
TRUNCATE TABLE board_directors CASCADE;
TRUNCATE TABLE manpower CASCADE;
TRUNCATE TABLE inventory_items CASCADE;
TRUNCATE TABLE active_sessions CASCADE;
TRUNCATE TABLE attendance_settings CASCADE;

-- ==========================================
-- 8. REINDEX & VACUUM
-- ==========================================

-- Reindex all tables
REINDEX DATABASE nusantara_construction;

-- Clean up dead tuples
VACUUM FULL ANALYZE;

-- Re-enable foreign key checks
SET session_replication_role = 'origin';

EOF

echo ""
echo "✅ Database cleanup completed!"
echo ""

# Show summary
echo "📊 SUMMARY:"
echo "==========="
echo ""

docker exec nusantara-postgres psql -U admin -d nusantara_construction << 'EOF'

SELECT 
  CASE 
    WHEN table_name IN ('users', 'subsidiaries') THEN '✅ ' || INITCAP(table_name)
    ELSE '🗑️  ' || INITCAP(REPLACE(table_name, '_', ' '))
  END as "Table",
  COUNT(*) as "Records"
FROM (
  SELECT 'users' as table_name, COUNT(*) FROM users
  UNION ALL SELECT 'subsidiaries', COUNT(*) FROM subsidiaries
  UNION ALL SELECT 'projects', COUNT(*) FROM projects
  UNION ALL SELECT 'project_rab', COUNT(*) FROM project_rab
  UNION ALL SELECT 'purchase_orders', COUNT(*) FROM purchase_orders
  UNION ALL SELECT 'finance_transactions', COUNT(*) FROM finance_transactions
  UNION ALL SELECT 'journal_entries', COUNT(*) FROM journal_entries
  UNION ALL SELECT 'notifications', COUNT(*) FROM notifications
  UNION ALL SELECT 'notification_tokens', COUNT(*) FROM notification_tokens
  UNION ALL SELECT 'attendance_records', COUNT(*) FROM attendance_records
  UNION ALL SELECT 'audit_logs', COUNT(*) FROM audit_logs
  UNION ALL SELECT 'approval_instances', COUNT(*) FROM approval_instances
  UNION ALL SELECT 'chart_of_accounts', COUNT(*) FROM chart_of_accounts
) counts
GROUP BY table_name
ORDER BY 
  CASE WHEN table_name IN ('users', 'subsidiaries') THEN 1 ELSE 2 END,
  table_name;

EOF

echo ""
echo "✅ Database is now clean!"
echo "✅ Preserved: Users & Subsidiaries"
echo "🗑️  Deleted: All projects, financial records, notifications, history"
echo ""
