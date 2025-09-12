#!/bin/bash

# =============================================================================
# Docker Data Recovery & Backup Script for APP-YK
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=================================================${NC}"
echo -e "${BLUE}    APP-YK Docker Data Recovery & Backup       ${NC}"
echo -e "${BLUE}=================================================${NC}"

# Function to check if container exists
check_container() {
    if ! docker ps -q --filter "name=$1" > /dev/null; then
        echo -e "${RED}Error: Container $1 is not running${NC}"
        exit 1
    fi
}

# Function to backup files from Docker to host
backup_from_docker() {
    echo -e "${YELLOW}Backing up files from Docker containers...${NC}"
    
    # Backup frontend files
    echo -e "${BLUE}Backing up frontend files...${NC}"
    docker cp yk-frontend-dev:/app/src/components/. /root/APP-YK/backup/frontend/components/
    docker cp yk-frontend-dev:/app/src/pages/. /root/APP-YK/backup/frontend/pages/
    docker cp yk-frontend-dev:/app/src/services/. /root/APP-YK/backup/frontend/services/
    
    # Backup backend files
    echo -e "${BLUE}Backing up backend files...${NC}"
    docker cp yk-backend-dev:/app/routes/. /root/APP-YK/backup/backend/routes/
    docker cp yk-backend-dev:/app/controllers/. /root/APP-YK/backup/backend/controllers/
    docker cp yk-backend-dev:/app/models/. /root/APP-YK/backup/backend/models/
    
    echo -e "${GREEN}Backup completed!${NC}"
}

# Function to restore files from host to Docker
restore_to_docker() {
    echo -e "${YELLOW}Restoring files to Docker containers...${NC}"
    
    # Restore frontend files
    echo -e "${BLUE}Restoring frontend files...${NC}"
    docker cp /root/APP-YK/frontend/src/. yk-frontend-dev:/app/src/
    
    # Restore backend files
    echo -e "${BLUE}Restoring backend files...${NC}"
    docker cp /root/APP-YK/backend/. yk-backend-dev:/app/
    
    echo -e "${GREEN}Restore completed!${NC}"
}

# Function to sync files bidirectionally
sync_files() {
    echo -e "${YELLOW}Syncing files between host and Docker...${NC}"
    
    # Sync specific important files
    docker cp /root/APP-YK/frontend/src/components/workflow/ProjectPurchaseOrders.js yk-frontend-dev:/app/src/components/workflow/
    docker cp /root/APP-YK/frontend/src/components/procurement/PurchaseOrderWorkflow.js yk-frontend-dev:/app/src/components/procurement/
    docker cp /root/APP-YK/frontend/src/components/Dashboard.js yk-frontend-dev:/app/src/components/
    docker cp /root/APP-YK/frontend/src/components/PurchaseOrderManagement.js yk-frontend-dev:/app/src/components/
    
    echo -e "${GREEN}Sync completed!${NC}"
}

# Function to create empty file structure
create_structure() {
    echo -e "${YELLOW}Creating directory structure...${NC}"
    
    mkdir -p /root/APP-YK/backup/frontend/{components,pages,services}
    mkdir -p /root/APP-YK/backup/backend/{routes,controllers,models}
    
    echo -e "${GREEN}Directory structure created!${NC}"
}

# Function to check file integrity
check_integrity() {
    echo -e "${YELLOW}Checking file integrity...${NC}"
    
    # Check if important files exist and are not empty
    files=(
        "/root/APP-YK/frontend/src/components/workflow/ProjectPurchaseOrders.js"
        "/root/APP-YK/frontend/src/components/procurement/PurchaseOrderWorkflow.js"
        "/root/APP-YK/frontend/src/components/Dashboard.js"
        "/root/APP-YK/frontend/src/components/PurchaseOrderManagement.js"
    )
    
    for file in "${files[@]}"; do
        if [ -f "$file" ] && [ -s "$file" ]; then
            echo -e "${GREEN}✓ $file - OK${NC}"
        else
            echo -e "${RED}✗ $file - Missing or empty${NC}"
        fi
    done
}

# Main script
case "$1" in
    "backup")
        check_container "yk-frontend-dev"
        check_container "yk-backend-dev"
        create_structure
        backup_from_docker
        ;;
    "restore")
        check_container "yk-frontend-dev"
        check_container "yk-backend-dev"
        restore_to_docker
        echo -e "${YELLOW}Restarting containers...${NC}"
        docker restart yk-frontend-dev yk-backend-dev
        ;;
    "sync")
        check_container "yk-frontend-dev"
        check_container "yk-backend-dev"
        sync_files
        ;;
    "check")
        check_integrity
        ;;
    "verify")
        ./verify-integrity.sh
        ;;
    "status")
        echo -e "${BLUE}Container Status:${NC}"
        docker ps --filter "name=yk-" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
        echo ""
        ./verify-integrity.sh
        ;;
    *)
        echo "Usage: $0 {backup|restore|sync|check|verify|status}"
        echo ""
        echo "Commands:"
        echo "  backup  - Backup all files from Docker containers to host"
        echo "  restore - Restore all files from host to Docker containers"
        echo "  sync    - Sync important files from host to Docker"
        echo "  check   - Check integrity of important files (deprecated, use verify)"
        echo "  verify  - Comprehensive file integrity verification"
        echo "  status  - Show container status and file integrity"
        exit 1
        ;;
esac

echo -e "${GREEN}Operation completed successfully!${NC}"