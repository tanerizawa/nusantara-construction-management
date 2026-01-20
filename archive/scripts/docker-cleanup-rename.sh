#!/bin/bash

echo "╔═══════════════════════════════════════════════════════════════════════════╗"
echo "║          DOCKER CLEANUP & RENAME: app-yk → nusantaragroup                 ║"
echo "╚═══════════════════════════════════════════════════════════════════════════╝"
echo ""

# Step 1: Remove unused volumes
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Removing unused volumes"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker volume ls -qf dangling=true
docker volume prune -f
echo "✅ Unused volumes removed"
echo ""

# Step 2: Remove build cache
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Removing build cache"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker builder prune -af
echo "✅ Build cache removed"
echo ""

# Step 3: Rename Docker images
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Renaming images: app-yk-* → nusantaragroup-*"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Tag old images with new names
docker tag app-yk-frontend:latest nusantaragroup-frontend:latest
docker tag app-yk-backend:latest nusantaragroup-backend:latest
echo "✅ Images tagged with new names"
echo ""

# Step 4: Stop and remove old containers
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Recreating containers with new image names"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Recreate frontend container
docker stop nusantara-frontend
docker rm nusantara-frontend
docker run -d \
  --name nusantara-frontend \
  --network host \
  --restart unless-stopped \
  -v /root/APP-YK/frontend:/app \
  -w /app \
  nusantaragroup-frontend:latest \
  sh -c "npm install --legacy-peer-deps && npm start"
echo "✅ Frontend container recreated with nusantaragroup-frontend image"

# Recreate backend container  
docker stop nusantara-backend
docker rm nusantara-backend
docker run -d \
  --name nusantara-backend \
  --network host \
  --restart unless-stopped \
  -v /root/APP-YK/backend:/app \
  -v app-yk_backend_node_modules:/app/node_modules \
  -w /app \
  nusantaragroup-backend:latest
echo "✅ Backend container recreated with nusantaragroup-backend image"
echo ""

# Step 5: Remove old image tags
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Removing old image tags"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker rmi app-yk-frontend:latest
docker rmi app-yk-backend:latest
echo "✅ Old image tags removed"
echo ""

# Step 6: Show final state
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 FINAL STATE"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Images:"
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
echo ""
echo "Containers:"
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Status}}"
echo ""
echo "Volumes:"
docker volume ls
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CLEANUP & RENAME COMPLETE!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
