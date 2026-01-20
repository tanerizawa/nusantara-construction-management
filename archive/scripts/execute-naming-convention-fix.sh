#!/bin/bash
# ============================================================================
# Database Naming Convention Fix - Execution Script
# ============================================================================
# This script safely executes the database naming convention fixes
# with proper backup and verification steps
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
DB_CONTAINER="nusantara-postgres"
DB_USER="admin"
DB_NAME="nusantara_construction"
BACKUP_DIR="./backups"
SCRIPT_DIR="./scripts"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

echo -e "${BLUE}============================================================================${NC}"
echo -e "${BLUE}DATABASE NAMING CONVENTION FIX - EXECUTION SCRIPT${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""

# ============================================================================
# STEP 1: Pre-flight checks
# ============================================================================
echo -e "${YELLOW}[1/6] Running pre-flight checks...${NC}"

# Check if Docker container is running
if ! docker ps | grep -q $DB_CONTAINER; then
    echo -e "${RED}ERROR: PostgreSQL container '$DB_CONTAINER' is not running!${NC}"
    exit 1
fi
echo -e "${GREEN}✓ PostgreSQL container is running${NC}"

# Check if backup directory exists
mkdir -p $BACKUP_DIR
echo -e "${GREEN}✓ Backup directory created/verified${NC}"

# Check if SQL script exists
if [ ! -f "$SCRIPT_DIR/fix-database-naming-convention.sql" ]; then
    echo -e "${RED}ERROR: SQL script not found at $SCRIPT_DIR/fix-database-naming-convention.sql${NC}"
    exit 1
fi
echo -e "${GREEN}✓ SQL script found${NC}"

echo ""

# ============================================================================
# STEP 2: Backup database
# ============================================================================
echo -e "${YELLOW}[2/6] Creating database backup...${NC}"
BACKUP_FILE="$BACKUP_DIR/nusantara_construction_before_naming_fix_$TIMESTAMP.sql"

docker exec $DB_CONTAINER pg_dump -U $DB_USER $DB_NAME > $BACKUP_FILE

if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h $BACKUP_FILE | cut -f1)
    echo -e "${GREEN}✓ Backup created successfully${NC}"
    echo -e "  File: $BACKUP_FILE"
    echo -e "  Size: $BACKUP_SIZE"
else
    echo -e "${RED}ERROR: Backup failed!${NC}"
    exit 1
fi

echo ""

# ============================================================================
# STEP 3: Show current status
# ============================================================================
echo -e "${YELLOW}[3/6] Analyzing current database status...${NC}"

# Count camelCase constraints
CAMELCASE_COUNT=$(docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_constraint WHERE conname ~ '[A-Z]';" | xargs)
echo -e "  CamelCase constraints found: ${RED}$CAMELCASE_COUNT${NC}"

# Count duplicate constraints on berita_acara
DUPLICATE_COUNT=$(docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'berita_acara'::regclass AND conname LIKE 'berita_acara_baNumber_key%' AND conname != 'berita_acara_baNumber_key';" | xargs)
echo -e "  Duplicate constraints (berita_acara): ${RED}$DUPLICATE_COUNT${NC}"

echo ""

# ============================================================================
# STEP 4: Confirmation prompt
# ============================================================================
echo -e "${YELLOW}[4/6] Ready to execute fixes${NC}"
echo -e "${YELLOW}This will:${NC}"
echo -e "  - Remove $DUPLICATE_COUNT duplicate constraints"
echo -e "  - Rename $CAMELCASE_COUNT constraints to snake_case"
echo -e "  - No data will be modified"
echo -e "  - No columns will be changed"
echo ""
echo -e "${YELLOW}Backup created at: $BACKUP_FILE${NC}"
echo ""
read -p "Do you want to proceed? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${YELLOW}Operation cancelled by user${NC}"
    exit 0
fi

echo ""

# ============================================================================
# STEP 5: Execute SQL script
# ============================================================================
echo -e "${YELLOW}[5/6] Executing naming convention fixes...${NC}"

# Execute the SQL script
docker exec -i $DB_CONTAINER psql -U $DB_USER -d $DB_NAME < $SCRIPT_DIR/fix-database-naming-convention.sql

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ SQL script executed successfully${NC}"
else
    echo -e "${RED}ERROR: SQL script execution failed!${NC}"
    echo -e "${YELLOW}You can restore from backup: $BACKUP_FILE${NC}"
    exit 1
fi

echo ""

# ============================================================================
# STEP 6: Verification
# ============================================================================
echo -e "${YELLOW}[6/6] Verifying results...${NC}"

# Count remaining camelCase constraints
REMAINING_CAMELCASE=$(docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_constraint WHERE conname ~ '[A-Z]';" | xargs)

# Count remaining duplicates
REMAINING_DUPLICATES=$(docker exec $DB_CONTAINER psql -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM pg_constraint WHERE conrelid = 'berita_acara'::regclass AND conname LIKE 'berita_acara_baNumber_key%' AND conname != 'berita_acara_ba_number_key';" | xargs)

echo -e "  CamelCase constraints remaining: ${GREEN}$REMAINING_CAMELCASE${NC}"
echo -e "  Duplicate constraints remaining: ${GREEN}$REMAINING_DUPLICATES${NC}"

if [ "$REMAINING_CAMELCASE" -eq 0 ] && [ "$REMAINING_DUPLICATES" -eq 0 ]; then
    echo -e "${GREEN}✓ All naming convention issues fixed successfully!${NC}"
else
    echo -e "${YELLOW}⚠ Some issues may remain. Check the output above.${NC}"
fi

echo ""

# ============================================================================
# COMPLETION SUMMARY
# ============================================================================
echo -e "${BLUE}============================================================================${NC}"
echo -e "${GREEN}DATABASE NAMING CONVENTION FIX COMPLETED${NC}"
echo -e "${BLUE}============================================================================${NC}"
echo ""
echo -e "${GREEN}Summary:${NC}"
echo -e "  ✓ Backup created: $BACKUP_FILE ($BACKUP_SIZE)"
echo -e "  ✓ CamelCase constraints fixed: $CAMELCASE_COUNT → $REMAINING_CAMELCASE"
echo -e "  ✓ Duplicate constraints removed: $DUPLICATE_COUNT → $REMAINING_DUPLICATES"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Test your application thoroughly"
echo -e "  2. Check error messages and logs"
echo -e "  3. Verify all foreign key relationships work"
echo -e "  4. Update documentation if needed"
echo ""
echo -e "${YELLOW}If any issues occur:${NC}"
echo -e "  Restore from backup:"
echo -e "  ${BLUE}docker exec -i $DB_CONTAINER psql -U $DB_USER $DB_NAME < $BACKUP_FILE${NC}"
echo ""
echo -e "${BLUE}============================================================================${NC}"
