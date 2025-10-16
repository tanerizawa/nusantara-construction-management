#!/bin/bash
# ============================================
# CLEANUP ORPHANED DATA & DUPLICATE INDEXES
# Created: 2025-10-13
# ============================================

echo "============================================"
echo "DATABASE CLEANUP SCRIPT"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to run SQL
run_sql() {
    docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -c "$1"
}

echo -e "${YELLOW}STEP 1: Checking Orphaned Finance Transactions${NC}"
echo "------------------------------------------------"
ORPHAN_COUNT=$(run_sql "SELECT COUNT(*) FROM finance_transactions WHERE purchase_order_id IS NULL OR project_id IS NULL;" | grep -A 1 "count" | tail -1 | tr -d ' ')
echo "Found: $ORPHAN_COUNT orphaned finance transactions"

if [ "$ORPHAN_COUNT" -gt 0 ]; then
    echo ""
    echo "Orphaned Transactions Details:"
    run_sql "SELECT id, date, amount, description FROM finance_transactions WHERE purchase_order_id IS NULL OR project_id IS NULL ORDER BY date DESC;"
    
    echo ""
    read -p "Delete these orphaned transactions? (yes/no): " CONFIRM
    if [ "$CONFIRM" = "yes" ]; then
        echo "Deleting orphaned transactions..."
        run_sql "DELETE FROM finance_transactions WHERE purchase_order_id IS NULL OR project_id IS NULL;"
        echo -e "${GREEN}✓ Orphaned transactions deleted${NC}"
    else
        echo -e "${YELLOW}Skipped deletion${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}STEP 2: Checking Duplicate Indexes${NC}"
echo "------------------------------------------------"

# Get list of tables with duplicate indexes
echo "Analyzing duplicate indexes on key tables..."
echo ""

echo "Table: purchase_orders"
DUPLICATE_PO_INDEXES=$(run_sql "SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'purchase_orders' AND indexname LIKE 'purchase_orders_po_number_key%';" | grep -A 1 "count" | tail -1 | tr -d ' ')
echo "  - po_number indexes: $DUPLICATE_PO_INDEXES (should be 1)"

echo ""
echo "Table: manpower"
DUPLICATE_MP_INDEXES=$(run_sql "SELECT COUNT(*) FROM pg_indexes WHERE tablename = 'manpower' AND indexname LIKE 'manpower_employee_id_key%';" | grep -A 1 "count" | tail -1 | tr -d ' ')
echo "  - employee_id indexes: $DUPLICATE_MP_INDEXES (should be 1)"

if [ "$DUPLICATE_PO_INDEXES" -gt 1 ] || [ "$DUPLICATE_MP_INDEXES" -gt 1 ]; then
    echo ""
    echo -e "${RED}WARNING: Excessive duplicate indexes found!${NC}"
    echo "This can significantly impact write performance."
    echo ""
    read -p "Clean up duplicate indexes? (yes/no): " CONFIRM_INDEX
    
    if [ "$CONFIRM_INDEX" = "yes" ]; then
        echo ""
        echo "Creating index cleanup SQL script..."
        
        # Generate cleanup script
        cat > /tmp/cleanup_indexes.sql <<'EOF'
-- ============================================
-- CLEANUP DUPLICATE INDEXES
-- ============================================

-- Drop duplicate po_number constraints (keep only the first one)
DO $$
DECLARE
    idx_name TEXT;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'purchase_orders' 
        AND indexname LIKE 'purchase_orders_po_number_key%'
        AND indexname != 'purchase_orders_po_number_key'
        ORDER BY indexname
    LOOP
        EXECUTE 'ALTER TABLE purchase_orders DROP CONSTRAINT IF EXISTS ' || idx_name;
        RAISE NOTICE 'Dropped: %', idx_name;
    END LOOP;
END $$;

-- Drop duplicate employee_id constraints (keep only the first one)
DO $$
DECLARE
    idx_name TEXT;
BEGIN
    FOR idx_name IN 
        SELECT indexname 
        FROM pg_indexes 
        WHERE tablename = 'manpower' 
        AND indexname LIKE 'manpower_employee_id_key%'
        AND indexname != 'manpower_employee_id_key'
        ORDER BY indexname
    LOOP
        EXECUTE 'ALTER TABLE manpower DROP CONSTRAINT IF EXISTS ' || idx_name;
        RAISE NOTICE 'Dropped: %', idx_name;
    END LOOP;
END $$;

-- Verify cleanup
SELECT 'purchase_orders' AS table_name, COUNT(*) AS remaining_indexes
FROM pg_indexes 
WHERE tablename = 'purchase_orders' 
AND indexname LIKE 'purchase_orders_po_number_key%'
UNION ALL
SELECT 'manpower' AS table_name, COUNT(*) AS remaining_indexes
FROM pg_indexes 
WHERE tablename = 'manpower' 
AND indexname LIKE 'manpower_employee_id_key%';
EOF

        echo "Running index cleanup..."
        docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -f - < /tmp/cleanup_indexes.sql
        
        echo ""
        echo -e "${GREEN}✓ Duplicate indexes cleaned up${NC}"
    else
        echo -e "${YELLOW}Skipped index cleanup${NC}"
    fi
fi

echo ""
echo -e "${YELLOW}STEP 3: Final Verification${NC}"
echo "------------------------------------------------"
echo "Current Database Status:"
echo ""

run_sql "SELECT 
    'Finance Transactions' AS table_name, 
    COUNT(*) AS total_records,
    COUNT(CASE WHEN project_id IS NULL THEN 1 END) AS null_project,
    COUNT(CASE WHEN purchase_order_id IS NULL THEN 1 END) AS null_po
FROM finance_transactions
UNION ALL
SELECT 
    'Purchase Orders',
    COUNT(*),
    COUNT(CASE WHEN project_id IS NULL THEN 1 END),
    0
FROM purchase_orders
UNION ALL
SELECT 
    'Projects',
    COUNT(*),
    0,
    0
FROM projects;"

echo ""
echo "Index Summary:"
run_sql "SELECT 
    tablename,
    COUNT(*) as index_count
FROM pg_indexes 
WHERE tablename IN ('purchase_orders', 'manpower')
GROUP BY tablename
ORDER BY tablename;"

echo ""
echo "============================================"
echo -e "${GREEN}CLEANUP COMPLETE!${NC}"
echo "============================================"
