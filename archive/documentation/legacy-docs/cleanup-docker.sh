#!/bin/bash

# Docker Cleanup Script for Nusantara Group
# Clean old project and optimize resources

echo "🔍 DOCKER RESOURCE CLEANUP - NUSANTARA GROUP"
echo "=============================================="
echo ""

# 1. Show current resource usage
echo "📊 Current Docker Usage:"
docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Size}}" | grep -E "NAME|nusantara"
echo ""

# 2. Stop and remove OLD project (nusantara_*)
echo "🛑 Stopping OLD project containers (nusantara_*)..."
cd /root/nusantaragroup.co
docker-compose down -v 2>/dev/null || echo "No compose file or already stopped"
echo ""

# 3. Remove OLD project containers (force)
echo "🗑️  Removing OLD project containers..."
docker rm -f nusantara_app nusantara_nginx nusantara_postgres nusantara_redis nusantara_minio nusantara_queue nusantara_scheduler 2>/dev/null || echo "Containers already removed"
echo ""

# 4. Remove dangling images
echo "🧹 Cleaning dangling images..."
docker image prune -f
echo ""

# 5. Remove unused images
echo "🗑️  Removing OLD project images..."
docker rmi nusantaragroupco-app nusantaragroupco-queue nusantaragroupco-scheduler 2>/dev/null || echo "Images already removed"
echo ""

# 6. Clean dangling volumes
echo "🧹 Cleaning unused volumes..."
docker volume prune -f
echo ""

# 7. Clean unused networks
echo "🧹 Cleaning unused networks..."
docker network prune -f
echo ""

# 8. Remove build cache
echo "🧹 Cleaning build cache..."
docker builder prune -f
echo ""

# 9. Show final resource usage
echo "✅ CLEANUP COMPLETE!"
echo ""
echo "📊 Current Docker Usage:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Size}}"
echo ""

echo "💾 Disk Space Freed:"
df -h / | grep -E "Filesystem|/$"
echo ""

echo "🎯 Active Containers (APP-YK only):"
cd /root/APP-YK
docker-compose ps
echo ""

echo "✅ Done! Only nusantara-* (APP-YK) containers are running."
echo "🚀 Application: https://nusantaragroup.co"
