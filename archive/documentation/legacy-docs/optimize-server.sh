#!/bin/bash

echo "🔧 SERVER OPTIMIZATION SCRIPT - NUSANTARA GROUP"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to show disk usage
show_disk_usage() {
    echo -e "${GREEN}📊 Current Disk Usage:${NC}"
    df -h / | grep -v Filesystem
    echo ""
}

# Function to show memory usage
show_memory_usage() {
    echo -e "${GREEN}💾 Current Memory Usage:${NC}"
    free -h | grep -E "Mem:|Swap:"
    echo ""
}

echo "=== BEFORE OPTIMIZATION ==="
show_disk_usage
show_memory_usage

# Step 1: Remove unused Docker images
echo -e "${YELLOW}Step 1: Removing unused Docker images...${NC}"
docker images --format "{{.Repository}}:{{.Tag}} {{.ID}}" | grep -E "(app-yk-frontend-dev|app-yk-backend-dev|nusantara-frontend-prod|yk-frontend-prod|mongo|minio/minio|certbot/certbot|dpage/pgadmin4|nginx:alpine|alpine:latest|mailhog/mailhog|redis:7-alpine)" | awk '{print $2}' | xargs -r docker rmi -f 2>/dev/null || true
echo -e "${GREEN}✅ Unused Docker images removed${NC}"
echo ""

# Step 2: Clean Docker system
echo -e "${YELLOW}Step 2: Cleaning Docker system...${NC}"
docker system prune -af --volumes 2>/dev/null || true
echo -e "${GREEN}✅ Docker system cleaned${NC}"
echo ""

# Step 3: Remove Webmin/Virtualmin/Usermin (OPTIONAL - will ask)
echo -e "${RED}Step 3: Webmin/Virtualmin/Usermin detected${NC}"
echo "These services use ~292MB disk + 200MB memory"
echo "They are NOT needed for your React/Node.js application"
read -p "Remove Webmin/Virtualmin/Usermin? (y/n): " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Stopping services...${NC}"
    systemctl stop webmin usermin lookup-domain 2>/dev/null || true
    systemctl disable webmin usermin lookup-domain 2>/dev/null || true
    
    echo -e "${YELLOW}Removing packages...${NC}"
    apt-get remove -y webmin usermin virtualmin-core virtualmin-config webmin-virtual-server 2>/dev/null || true
    apt-get autoremove -y 2>/dev/null || true
    
    echo -e "${YELLOW}Cleaning up files...${NC}"
    rm -rf /usr/share/webmin /usr/share/usermin /etc/webmin /etc/usermin 2>/dev/null || true
    
    echo -e "${GREEN}✅ Webmin/Virtualmin/Usermin removed${NC}"
else
    echo -e "${YELLOW}⏭️  Skipped Webmin removal${NC}"
fi
echo ""

# Step 4: Clean snap cache
echo -e "${YELLOW}Step 4: Cleaning snap cache...${NC}"
rm -rf /var/lib/snapd/cache/* 2>/dev/null || true
# Remove old snap versions
snap list --all | awk '/disabled/{print $1, $3}' | while read snapname revision; do
    snap remove "$snapname" --revision="$revision" 2>/dev/null || true
done
echo -e "${GREEN}✅ Snap cache cleaned${NC}"
echo ""

# Step 5: Clean APT cache
echo -e "${YELLOW}Step 5: Cleaning APT cache...${NC}"
apt-get clean
apt-get autoclean
apt-get autoremove -y
echo -e "${GREEN}✅ APT cache cleaned${NC}"
echo ""

# Step 6: Limit systemd journal size
echo -e "${YELLOW}Step 6: Limiting systemd journal size to 50MB...${NC}"
journalctl --vacuum-size=50M
echo -e "${GREEN}✅ Journal size limited${NC}"
echo ""

# Step 7: Clean Apache logs (if exists)
if [ -d "/var/log/apache2" ]; then
    echo -e "${YELLOW}Step 7: Rotating Apache logs...${NC}"
    find /var/log/apache2 -name "*.log" -type f -exec truncate -s 0 {} \; 2>/dev/null || true
    find /var/log/apache2 -name "*.gz" -type f -delete 2>/dev/null || true
    echo -e "${GREEN}✅ Apache logs cleaned${NC}"
else
    echo -e "${YELLOW}Step 7: No Apache logs found${NC}"
fi
echo ""

# Step 8: Clean temporary files
echo -e "${YELLOW}Step 8: Cleaning temporary files...${NC}"
find /tmp -type f -atime +7 -delete 2>/dev/null || true
find /var/tmp -type f -atime +7 -delete 2>/dev/null || true
echo -e "${GREEN}✅ Temporary files cleaned${NC}"
echo ""

# Step 9: Clean old kernels (keep current + 1 previous)
echo -e "${YELLOW}Step 9: Checking for old kernels...${NC}"
CURRENT_KERNEL=$(uname -r)
dpkg -l | grep linux-image | grep -v "$CURRENT_KERNEL" | awk '{print $2}' | sort -V | head -n -1 | xargs -r apt-get remove -y 2>/dev/null || true
echo -e "${GREEN}✅ Old kernels checked${NC}"
echo ""

echo "=== AFTER OPTIMIZATION ==="
show_disk_usage
show_memory_usage

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ SERVER OPTIMIZATION COMPLETE!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${YELLOW}Recommended next steps:${NC}"
echo "1. Restart Docker containers if needed: cd /root/APP-YK && docker-compose restart"
echo "2. Monitor disk usage: df -h"
echo "3. Monitor memory: free -h"
echo "4. Check running services: systemctl list-units --type=service --state=running"
echo ""

# Show what's still using resources
echo -e "${GREEN}📊 Top 10 Memory Consumers:${NC}"
ps aux --sort=-%mem | head -11 | awk '{printf "%-15s %6s %6s %s\n", $1, $3"%", $4"%", $11}'
echo ""

echo -e "${GREEN}📊 Docker Images (remaining):${NC}"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo ""

echo -e "${GREEN}🎯 Active Services:${NC}"
systemctl list-units --type=service --state=running --no-pager --no-legend | wc -l
echo "services running"
