#!/bin/bash

echo "================================================"
echo " DATABASE CLEANUP - Removing Orphan Data"
echo "================================================"
echo ""

echo "Current database status:"
echo "  - Projects: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM projects;' | xargs)"
echo "  - RAB Items: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM project_rab;' | xargs)"
echo "  - Purchase Orders: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM purchase_orders;' | xargs)"
echo "  - Tracking Records: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM rab_purchase_tracking;' | xargs)"
echo ""

echo "Existing POs (should be deleted):"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT po_number, project_id, supplier_name FROM purchase_orders;'
echo ""

echo "Existing Tracking Records (should be deleted):"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT "projectId", "poNumber", quantity FROM rab_purchase_tracking;'
echo ""

read -p "Do you want to DELETE all this orphan data? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
  echo "Cleanup cancelled."
  exit 0
fi

echo ""
echo "================================================"
echo " CLEANING UP DATABASE..."
echo "================================================"
echo ""

# 1. Delete tracking records (no FK constraint issues)
echo "[1] Deleting tracking records..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM rab_purchase_tracking;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 2. Delete purchase orders
echo "[2] Deleting purchase orders..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM purchase_orders;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 3. Delete project_rab (should be empty but just in case)
echo "[3] Deleting project RAB items..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM project_rab;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 4. Delete project milestones
echo "[4] Deleting project milestones..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM project_milestones;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 5. Delete project documents
echo "[5] Deleting project documents..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM project_documents;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 6. Delete project team members
echo "[6] Deleting project team members..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM project_team_members;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 7. Delete projects (should be empty but confirm)
echo "[7] Deleting projects..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM projects;" 2>&1 | grep -E "DELETE|ERROR" || echo "Done"

# 8. Check other tables that might have test/sample data
echo "[8] Checking and cleaning other test data..."

# Delete test inventory items
echo "  - Cleaning inventory (test items)..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM inventory WHERE name LIKE '%test%' OR name LIKE '%sample%' OR name LIKE '%mock%';" 2>&1 | grep -E "DELETE|ERROR" || echo "  Done"

# Delete BA approvals without project
echo "  - Cleaning BA approvals (orphan)..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM ba_approvals WHERE project_id NOT IN (SELECT id FROM projects);" 2>&1 | grep -E "DELETE|ERROR" || echo "  Done"

# Delete progress payments without project
echo "  - Cleaning progress payments (orphan)..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM progress_payments WHERE project_id NOT IN (SELECT id FROM projects);" 2>&1 | grep -E "DELETE|ERROR" || echo "  Done"

# Delete finance transactions related to deleted POs
echo "  - Cleaning finance transactions (orphan)..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "DELETE FROM transactions WHERE reference_number IN (
    SELECT reference_number FROM transactions 
    WHERE category = 'purchase' 
    AND reference_number NOT IN (SELECT po_number FROM purchase_orders)
  );" 2>&1 | grep -E "DELETE|ERROR" || echo "  Done"

echo ""
echo "================================================"
echo " CLEANUP COMPLETE"
echo "================================================"
echo ""

echo "Final database status:"
echo "  - Projects: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM projects;' | xargs)"
echo "  - RAB Items: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM project_rab;' | xargs)"
echo "  - Purchase Orders: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM purchase_orders;' | xargs)"
echo "  - Tracking Records: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM rab_purchase_tracking;' | xargs)"
echo "  - Inventory: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM inventory;' | xargs)"
echo "  - Transactions: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM transactions;' | xargs)"
echo ""

echo "✅ Database is now clean!"
echo ""
echo "You can now create fresh projects and data."
