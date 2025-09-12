#!/bin/bash

# =============================================================================
# File Integrity Verification Script for APP-YK
# =============================================================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}    APP-YK File Integrity Verification         ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Function to check file size and existence
check_file() {
    local file_path="$1"
    local min_size="${2:-100}"  # minimum size in bytes
    local file_name=$(basename "$file_path")
    
    if [ -f "$file_path" ]; then
        local size=$(stat -c%s "$file_path" 2>/dev/null || echo "0")
        if [ "$size" -gt "$min_size" ]; then
            echo -e "${GREEN}✓ $file_name - OK (${size} bytes)${NC}"
            return 0
        else
            echo -e "${RED}✗ $file_name - Too small (${size} bytes)${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ $file_name - Missing${NC}"
        return 1
    fi
}

# Function to check Docker container file
check_docker_file() {
    local container="$1"
    local file_path="$2"
    local min_size="${3:-100}"
    local file_name=$(basename "$file_path")
    
    if docker exec "$container" test -f "$file_path" 2>/dev/null; then
        local size=$(docker exec "$container" stat -c%s "$file_path" 2>/dev/null || echo "0")
        if [ "$size" -gt "$min_size" ]; then
            echo -e "${GREEN}✓ [Docker] $file_name - OK (${size} bytes)${NC}"
            return 0
        else
            echo -e "${RED}✗ [Docker] $file_name - Too small (${size} bytes)${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ [Docker] $file_name - Missing${NC}"
        return 1
    fi
}

echo -e "${YELLOW}Checking Host Files...${NC}"
echo "=================================="

# Critical procurement files
critical_files=(
    "/root/APP-YK/frontend/src/components/procurement/CreatePurchaseOrder.js:18000"
    "/root/APP-YK/frontend/src/components/procurement/ProjectSelectionDialog.js:8000"
    "/root/APP-YK/frontend/src/components/procurement/ProjectSelectionPage.js:6000"
    "/root/APP-YK/frontend/src/components/procurement/PurchaseOrderApp.js:5000"
    "/root/APP-YK/frontend/src/components/procurement/PurchaseOrderManagement.js:20000"
    "/root/APP-YK/frontend/src/components/procurement/PurchaseOrderWorkflow.js:30000"
)

host_success=0
host_total=0

for file_info in "${critical_files[@]}"; do
    IFS=':' read -r file_path min_size <<< "$file_info"
    host_total=$((host_total + 1))
    if check_file "$file_path" "$min_size"; then
        host_success=$((host_success + 1))
    fi
done

echo ""
echo -e "${YELLOW}Checking Docker Container Files...${NC}"
echo "======================================="

# Check same files in Docker
docker_success=0
docker_total=0

for file_info in "${critical_files[@]}"; do
    IFS=':' read -r file_path min_size <<< "$file_info"
    # Convert host path to Docker path
    docker_path=$(echo "$file_path" | sed 's|/root/APP-YK/frontend|/app|')
    docker_total=$((docker_total + 1))
    if check_docker_file "yk-frontend-dev" "$docker_path" "$min_size"; then
        docker_success=$((docker_success + 1))
    fi
done

echo ""
echo -e "${YELLOW}Checking Other Important Files...${NC}"
echo "===================================="

# Other important files
other_files=(
    "/root/APP-YK/frontend/src/components/Dashboard.js:9000"
    "/root/APP-YK/frontend/src/components/PurchaseOrderManagement.js:9000"
    "/root/APP-YK/frontend/src/components/workflow/ProjectPurchaseOrders.js:30000"
)

other_success=0
other_total=0

for file_info in "${other_files[@]}"; do
    IFS=':' read -r file_path min_size <<< "$file_info"
    other_total=$((other_total + 1))
    if check_file "$file_path" "$min_size"; then
        other_success=$((other_success + 1))
    fi
done

echo ""
echo -e "${BLUE}Summary Report${NC}"
echo "==============="
echo -e "Host Procurement Files: ${GREEN}$host_success${NC}/${host_total}"
echo -e "Docker Procurement Files: ${GREEN}$docker_success${NC}/${docker_total}"
echo -e "Other Important Files: ${GREEN}$other_success${NC}/${other_total}"

total_success=$((host_success + docker_success + other_success))
total_files=$((host_total + docker_total + other_total))

echo ""
if [ "$total_success" -eq "$total_files" ]; then
    echo -e "${GREEN}🎉 All files are OK! ($total_success/$total_files)${NC}"
    echo -e "${GREEN}✅ Frontend should be fully functional${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Some files need attention ($total_success/$total_files)${NC}"
    echo -e "${YELLOW}💡 Run ./docker-data-recovery.sh sync to fix issues${NC}"
    exit 1
fi