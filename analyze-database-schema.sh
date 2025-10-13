#!/bin/bash
# ============================================
# DATABASE SCHEMA ANALYSIS
# Check for naming inconsistencies and remaining index issues
# ============================================

echo "============================================"
echo "DATABASE SCHEMA ANALYSIS REPORT"
echo "============================================"
echo ""

run_query() {
    docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -c "$1" 2>&1
}

echo "1. COLUMN NAMING CONVENTION ANALYSIS"
echo "====================================="
echo ""
echo "Checking all tables for mixed snake_case and camelCase..."
echo ""

# Get all tables and their columns
run_query "
SELECT 
    table_name,
    STRING_AGG(column_name, ', ' ORDER BY ordinal_position) as columns
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name NOT IN ('sequelize_meta')
GROUP BY table_name
ORDER BY table_name;
" | head -100

echo ""
echo "2. SPECIFIC COLUMN NAMING INCONSISTENCIES"
echo "=========================================="
echo ""

# Check each major table
echo "Table: purchase_orders"
run_query "SELECT column_name FROM information_schema.columns WHERE table_name = 'purchase_orders' ORDER BY ordinal_position;"

echo ""
echo "Table: finance_transactions"
run_query "SELECT column_name FROM information_schema.columns WHERE table_name = 'finance_transactions' ORDER BY ordinal_position;"

echo ""
echo "Table: projects"
run_query "SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' ORDER BY ordinal_position;"

echo ""
echo "3. INDEX DUPLICATION CHECK"
echo "=========================="
echo ""

echo "Tables with multiple indexes on same column:"
run_query "
SELECT 
    tablename,
    COUNT(*) as duplicate_count,
    STRING_AGG(DISTINCT indexname, ', ') as index_names
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename, indexdef
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC;
"

echo ""
echo "4. REDUNDANT UNIQUE CONSTRAINTS"
echo "================================"
echo ""

echo "All UNIQUE constraints per table:"
run_query "
SELECT 
    tablename,
    COUNT(*) as constraint_count,
    STRING_AGG(indexname, ', ' ORDER BY indexname) as constraints
FROM pg_indexes
WHERE schemaname = 'public'
AND indexname LIKE '%_key%'
GROUP BY tablename
HAVING COUNT(*) > 1
ORDER BY constraint_count DESC
LIMIT 20;
"

echo ""
echo "5. DETAILED INDEX ANALYSIS"
echo "=========================="
echo ""

echo "Total indexes per table (Top 20):"
run_query "
SELECT 
    tablename,
    COUNT(*) as total_indexes
FROM pg_indexes
WHERE schemaname = 'public'
GROUP BY tablename
ORDER BY total_indexes DESC
LIMIT 20;
"

echo ""
echo "6. UNUSED/REDUNDANT INDEXES"
echo "==========================="
echo ""

echo "Indexes that might be redundant:"
run_query "
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexname NOT LIKE '%_pkey'
ORDER BY tablename, indexname
LIMIT 30;
"

echo ""
echo "============================================"
echo "ANALYSIS COMPLETE"
echo "============================================"
