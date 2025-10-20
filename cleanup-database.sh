#!/bin/bash

echo "🗑️  DATABASE CLEANUP - Keep Only Users & Subsidiaries"
echo "====================================================="
echo ""
echo "⚠️  WARNING: This will delete:"
echo "   - All projects and related data"
echo "   - All financial reports and history"
echo "   - All notifications and tokens"
echo "   - All attendance records"
echo "   - All orphaned/duplicate records"
echo ""
echo "✅ Will KEEP:"
echo "   - Users"
echo "   - Subsidiaries"
echo ""

read -p "Are you sure? Type 'YES' to continue: " confirm

if [ "$confirm" != "YES" ]; then
  echo "❌ Cleanup cancelled"
  exit 1
fi

echo ""
echo "🔄 Starting cleanup..."
echo ""

# Backup first
echo "📦 Creating backup..."
docker exec nusantara-postgres pg_dump -U admin nusantara_construction > "/root/APP-YK/backup_before_cleanup_$(date +%Y%m%d_%H%M%S).sql"
echo "✅ Backup created"
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

-- Purchase Orders
TRUNCATE TABLE purchase_order_items CASCADE;
TRUNCATE TABLE purchase_orders CASCADE;

-- Berita Acara
TRUNCATE TABLE berita_acara_items CASCADE;
TRUNCATE TABLE berita_acara_photos CASCADE;
TRUNCATE TABLE berita_acara CASCADE;

-- Projects (last, after all related tables)
TRUNCATE TABLE projects CASCADE;

-- ==========================================
-- 2. DELETE FINANCIAL DATA
-- ==========================================
TRUNCATE TABLE financial_reports CASCADE;
TRUNCATE TABLE financial_report_items CASCADE;
TRUNCATE TABLE transactions CASCADE;
TRUNCATE TABLE transaction_details CASCADE;
TRUNCATE TABLE invoices CASCADE;
TRUNCATE TABLE invoice_items CASCADE;
TRUNCATE TABLE payments CASCADE;
TRUNCATE TABLE budgets CASCADE;
TRUNCATE TABLE budget_items CASCADE;

-- Chart of Accounts
TRUNCATE TABLE accounts CASCADE;

-- ==========================================
-- 3. DELETE NOTIFICATIONS
-- ==========================================
TRUNCATE TABLE notification_tokens CASCADE;
TRUNCATE TABLE approval_notifications CASCADE;
TRUNCATE TABLE notifications CASCADE;

-- ==========================================
-- 4. DELETE ATTENDANCE & LEAVE
-- ==========================================
TRUNCATE TABLE attendance_records CASCADE;
TRUNCATE TABLE leave_requests CASCADE;
TRUNCATE TABLE overtime_requests CASCADE;

-- ==========================================
-- 5. DELETE AUDIT LOGS (OPTIONAL)
-- ==========================================
TRUNCATE TABLE audit_logs CASCADE;

-- ==========================================
-- 6. DELETE ORPHANED/DUPLICATE DATA
-- ==========================================

-- Delete any orphaned records (if exist)
DELETE FROM project_team_members WHERE project_id NOT IN (SELECT id FROM projects);
DELETE FROM project_documents WHERE project_id NOT IN (SELECT id FROM projects);
DELETE FROM project_milestones WHERE project_id NOT IN (SELECT id FROM projects);

-- ==========================================
-- 7. RESET SEQUENCES (AUTO INCREMENT)
-- ==========================================

-- Reset sequences for tables that use serial/auto-increment
-- (Most tables use UUID so this might not be needed)

-- ==========================================
-- 8. CLEAN UP INDEXES
-- ==========================================

-- Reindex all tables to optimize
REINDEX DATABASE nusantara_construction;

-- ==========================================
-- 9. VACUUM & ANALYZE
-- ==========================================

-- Clean up dead tuples and update statistics
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

SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Subsidiaries', COUNT(*) FROM subsidiaries
UNION ALL
SELECT 'Projects', COUNT(*) FROM projects
UNION ALL
SELECT 'Project RAB', COUNT(*) FROM project_rab
UNION ALL
SELECT 'Purchase Orders', COUNT(*) FROM purchase_orders
UNION ALL
SELECT 'Financial Reports', COUNT(*) FROM financial_reports
UNION ALL
SELECT 'Transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'Notifications', COUNT(*) FROM notifications
UNION ALL
SELECT 'Notification Tokens', COUNT(*) FROM notification_tokens
UNION ALL
SELECT 'Attendance Records', COUNT(*) FROM attendance_records
UNION ALL
SELECT 'Audit Logs', COUNT(*) FROM audit_logs
ORDER BY table_name;

EOF

echo ""
echo "✅ Database is now clean!"
echo "✅ Users and Subsidiaries preserved"
echo "📦 Backup location: /root/APP-YK/backup_before_cleanup_*.sql"
echo ""
