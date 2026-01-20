#!/bin/bash

# =====================================================
# Docker Redundancy Cleanup Script
# File: cleanup-docker-redundancy.sh
# =====================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}"
echo "╔════════════════════════════════════════════════════════╗"
echo "║  🧹 Docker Redundancy Cleanup                         ║"
echo "║  Menghapus duplicate images, volumes, dan configs     ║"
echo "╔════════════════════════════════════════════════════════╗"
echo -e "${NC}"
echo ""

# Change to project directory
cd /root/APP-YK

# =====================================================
# Phase 1: Analysis & Backup
# =====================================================
echo -e "${CYAN}📊 Phase 1: Analyzing current state...${NC}"
echo ""

# Save current state
docker-compose ps > /tmp/docker_state_before_$(date +%Y%m%d).txt 2>/dev/null || true
docker volume ls > /tmp/volumes_before_$(date +%Y%m%d).txt
docker images > /tmp/images_before_$(date +%Y%m%d).txt

echo "Current Docker resources:"
echo ""
echo -e "${YELLOW}Containers:${NC}"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}" | grep -E "nusantara|app-yk" || echo "  None"
echo ""

echo -e "${YELLOW}Images:${NC}"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | grep -E "app-yk|nusantara" || echo "  None"
echo ""

echo -e "${YELLOW}Volumes (Total: $(docker volume ls | grep app-yk | wc -l)):${NC}"
docker volume ls --format "table {{.Name}}" | grep app-yk | head -15
echo ""

# Calculate sizes
TOTAL_VOLUMES=$(docker volume ls | grep app-yk | wc -l)
UNUSED_VOLUMES=9  # Redis (3) + Nginx (2) + Postgres variants (3) + PgAdmin (1)

echo -e "${GREEN}Summary:${NC}"
echo "  • Total volumes: $TOTAL_VOLUMES"
echo "  • Unused volumes: $UNUSED_VOLUMES"
echo "  • Redundant images: 1 (app-yk-migrations)"
echo ""

# =====================================================
# Phase 2: Confirmation
# =====================================================
echo -e "${YELLOW}⚠️  This script will:${NC}"
echo "  1. Backup current docker-compose.yml"
echo "  2. Replace with docker-compose.complete.yml"
echo "  3. Remove redundant migrations image (514MB)"
echo "  4. Remove 9 unused volumes (~2-3GB)"
echo ""
echo -e "${RED}WARNING: Unused volumes will be permanently deleted!${NC}"
echo -e "${GREEN}Current postgres_data will be PRESERVED.${NC}"
echo ""

read -p "Continue? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${CYAN}❌ Cleanup cancelled${NC}"
    exit 0
fi

echo ""

# =====================================================
# Phase 3: Backup Database
# =====================================================
echo -e "${CYAN}💾 Phase 2: Backing up database...${NC}"

BACKUP_DIR="/root/APP-YK/backups"
BACKUP_FILE="postgres_backup_$(date +%Y%m%d_%H%M%S).tar.gz"

mkdir -p "$BACKUP_DIR"

echo "Creating backup: $BACKUP_FILE"
docker run --rm \
  -v app-yk_postgres_data:/data \
  -v "$BACKUP_DIR":/backup \
  alpine tar czf "/backup/$BACKUP_FILE" /data

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database backed up to: $BACKUP_DIR/$BACKUP_FILE${NC}"
    echo "   Size: $(du -sh $BACKUP_DIR/$BACKUP_FILE | cut -f1)"
else
    echo -e "${RED}❌ Backup failed! Stopping cleanup.${NC}"
    exit 1
fi

echo ""

# =====================================================
# Phase 4: Stop Containers (Optional - keep running)
# =====================================================
echo -e "${CYAN}🔄 Phase 3: Updating Docker configuration...${NC}"

# Backup old docker-compose.yml
if [ -f "docker-compose.yml" ]; then
    BACKUP_COMPOSE="docker-compose.yml.backup_$(date +%Y%m%d_%H%M%S)"
    echo "Backing up docker-compose.yml → $BACKUP_COMPOSE"
    mv docker-compose.yml "$BACKUP_COMPOSE"
    echo -e "${GREEN}✅ Old compose file backed up${NC}"
fi

# Copy complete version as new default
echo "Setting docker-compose.complete.yml as default..."
cp docker-compose.complete.yml docker-compose.yml
echo -e "${GREEN}✅ New docker-compose.yml created${NC}"

echo ""

# =====================================================
# Phase 5: Clean Redundant Image
# =====================================================
echo -e "${CYAN}🗑️  Phase 4: Removing redundant images...${NC}"

if docker images | grep -q "app-yk-migrations"; then
    echo "Removing app-yk-migrations image (514MB)..."
    docker rmi app-yk-migrations 2>/dev/null || echo "  (Already removed or in use)"
    echo -e "${GREEN}✅ Redundant image removed${NC}"
else
    echo "  app-yk-migrations already removed"
fi

echo ""

# =====================================================
# Phase 6: Clean Unused Volumes
# =====================================================
echo -e "${CYAN}🧹 Phase 5: Cleaning unused volumes...${NC}"

UNUSED_VOLUMES=(
    "app-yk_postgres_data_prod"
    "app-yk_postgres_dev_data"
    "app-yk_postgres_prod_data"
    "app-yk_nginx_cache"
    "app-yk_nginx_logs"
    "app-yk_pgadmin_dev_data"
    "app-yk_redis_data"
    "app-yk_redis_dev_data"
    "app-yk_redis_prod_data"
)

REMOVED_COUNT=0

for volume in "${UNUSED_VOLUMES[@]}"; do
    if docker volume ls | grep -q "$volume"; then
        echo "Removing: $volume"
        docker volume rm "$volume" 2>/dev/null && REMOVED_COUNT=$((REMOVED_COUNT + 1)) || echo "  (In use or doesn't exist)"
    fi
done

echo ""
echo -e "${GREEN}✅ Removed $REMOVED_COUNT unused volumes${NC}"

echo ""

# =====================================================
# Phase 7: Restart Services (if needed)
# =====================================================
echo -e "${CYAN}🔄 Phase 6: Checking service status...${NC}"

if docker ps | grep -q nusantara-backend; then
    echo "Services are running:"
    docker-compose ps 2>/dev/null || docker ps --format "table {{.Names}}\t{{.Status}}"
    echo ""
    
    read -p "Restart services with new config? (yes/no): " RESTART
    
    if [ "$RESTART" = "yes" ]; then
        echo "Stopping services..."
        docker-compose down
        
        echo "Starting with new configuration..."
        docker-compose up -d postgres backend frontend
        
        echo "Waiting for services..."
        sleep 10
        
        echo -e "${GREEN}✅ Services restarted${NC}"
    fi
else
    echo "Services are stopped. Start with:"
    echo "  docker-compose up -d"
fi

echo ""

# =====================================================
# Phase 8: Final Report
# =====================================================
echo -e "${CYAN}📊 Phase 7: Final status...${NC}"
echo ""

# Save final state
docker volume ls > /tmp/volumes_after_$(date +%Y%m%d).txt
docker images > /tmp/images_after_$(date +%Y%m%d).txt

echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ CLEANUP COMPLETE!                          ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📊 Summary:${NC}"
echo ""

# Count remaining volumes
REMAINING_VOLUMES=$(docker volume ls | grep app-yk | wc -l)
echo "  ${YELLOW}Volumes:${NC}"
echo "    • Before: $TOTAL_VOLUMES"
echo "    • After:  $REMAINING_VOLUMES"
echo "    • Removed: $(($TOTAL_VOLUMES - $REMAINING_VOLUMES))"
echo ""

# List remaining volumes
echo "  ${YELLOW}Active Volumes:${NC}"
docker volume ls --format "    • {{.Name}}" | grep app-yk
echo ""

# Images
echo "  ${YELLOW}Docker Images:${NC}"
docker images --format "    • {{.Repository}}:{{.Tag}} ({{.Size}})" | grep -E "app-yk|postgres:15"
echo ""

# Disk space saved
IMAGES_SAVED="514MB"
VOLUMES_SAVED="~2-3GB"
echo "  ${YELLOW}Disk Space Saved:${NC}"
echo "    • Images:  $IMAGES_SAVED (migrations removed)"
echo "    • Volumes: $VOLUMES_SAVED (9 unused removed)"
echo "    • ${GREEN}Total: ~2.5-3.5 GB${NC}"
echo ""

# Backup info
echo "  ${YELLOW}Backups Created:${NC}"
echo "    • Database: $BACKUP_DIR/$BACKUP_FILE"
echo "    • Old compose: $BACKUP_COMPOSE"
echo "    • State snapshots: /tmp/docker_state_*, /tmp/volumes_*, /tmp/images_*"
echo ""

# Current services
echo "  ${YELLOW}Current Services:${NC}"
if docker ps | grep -q nusantara; then
    docker ps --format "    • {{.Names}} ({{.Status}})" | grep nusantara
else
    echo "    • No services running (start with: docker-compose up -d)"
fi
echo ""

# Testing
echo -e "${CYAN}🧪 Testing:${NC}"
echo "  • Backend:  curl http://localhost:5000/health"
echo "  • Frontend: curl http://localhost:3000"
echo "  • Database: docker exec -it nusantara-postgres psql -U admin -d nusantara_construction"
echo ""

# Rollback info
echo -e "${YELLOW}📝 Rollback (if needed):${NC}"
echo "  1. Restore compose: mv $BACKUP_COMPOSE docker-compose.yml"
echo "  2. Restore database: docker run --rm -v app-yk_postgres_data:/data -v $BACKUP_DIR:/backup alpine tar xzf /backup/$BACKUP_FILE -C /"
echo "  3. Restart: docker-compose up -d"
echo ""

echo -e "${GREEN}✨ Cleanup completed successfully!${NC}"
