#!/bin/bash
# ============================================
# QUICK ORPHANED DATA CHECK
# ============================================

echo "============================================"
echo "ORPHANED DATA CHECK - QUICK REPORT"
echo "============================================"
echo ""

# Function to run SQL and show results
run_query() {
    docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -c "$1" 2>&1
}

echo "1. Checking berita_acara with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_ba FROM berita_acara ba LEFT JOIN projects p ON ba.\"projectId\" = p.id WHERE p.id IS NULL;"

echo ""
echo "2. Checking progress_payments with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_pp FROM progress_payments pp LEFT JOIN projects p ON pp.\"projectId\" = p.id WHERE pp.\"projectId\" IS NOT NULL AND p.id IS NULL;"

echo ""
echo "3. Checking project_milestones with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_milestones FROM project_milestones m LEFT JOIN projects p ON m.\"projectId\" = p.id WHERE p.id IS NULL;"

echo ""
echo "4. Checking project_team_members with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_team FROM project_team_members tm LEFT JOIN projects p ON tm.\"projectId\" = p.id WHERE p.id IS NULL;"

echo ""
echo "5. Checking project_documents with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_docs FROM project_documents pd LEFT JOIN projects p ON pd.\"projectId\" = p.id WHERE p.id IS NULL;"

echo ""
echo "6. Checking rab_items with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_rab FROM rab_items ri LEFT JOIN projects p ON ri.\"projectId\" = p.id WHERE ri.\"projectId\" IS NOT NULL AND p.id IS NULL;"

echo ""
echo "7. Checking project_rab with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_project_rab FROM project_rab pr LEFT JOIN projects p ON pr.\"projectId\" = p.id WHERE p.id IS NULL;"

echo ""
echo "8. Checking manpower with missing projects..."
run_query "SELECT COUNT(*) AS orphaned_manpower FROM manpower m LEFT JOIN projects p ON m.\"projectId\" = p.id WHERE m.\"projectId\" IS NOT NULL AND p.id IS NULL;"

echo ""
echo "9. Total projects in database..."
run_query "SELECT COUNT(*) AS total_projects FROM projects;"

echo ""
echo "10. Total records per table..."
run_query "SELECT 
    'berita_acara' AS table_name, COUNT(*) AS count FROM berita_acara
UNION ALL SELECT 'progress_payments', COUNT(*) FROM progress_payments
UNION ALL SELECT 'project_milestones', COUNT(*) FROM project_milestones
UNION ALL SELECT 'project_team_members', COUNT(*) FROM project_team_members
UNION ALL SELECT 'project_documents', COUNT(*) FROM project_documents
UNION ALL SELECT 'rab_items', COUNT(*) FROM rab_items
UNION ALL SELECT 'project_rab', COUNT(*) FROM project_rab
UNION ALL SELECT 'manpower', COUNT(*) FROM manpower
UNION ALL SELECT 'purchase_orders', COUNT(*) FROM purchase_orders
ORDER BY count DESC;"

echo ""
echo "============================================"
echo "Check complete!"
echo "============================================"
