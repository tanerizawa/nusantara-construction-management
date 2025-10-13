#!/bin/bash

# Quick Thumbnail Diagnostic Script
# Run this after uploading a photo to check all systems

echo "🔍 THUMBNAIL DIAGNOSTIC TOOL"
echo "================================"
echo ""

# Check if services are running
echo "📊 Service Status:"
docker-compose ps | grep -E "(backend|frontend)" | awk '{print $1, $NF}'
echo ""

# Check backend logs for recent thumbnail generation
echo "🔧 Recent Backend Activity (last 20 lines):"
docker-compose logs backend --tail=20 | grep -E "\[POST /photos\]|Thumbnail|Auto-generated" || echo "No recent photo uploads found"
echo ""

# Check if thumbnails directory exists
echo "📁 Thumbnails Directory:"
docker-compose exec -T backend ls -lah /app/uploads/milestones/thumbnails/ 2>/dev/null | tail -5 || echo "Directory not accessible"
echo ""

# Check Sharp installation
echo "🔧 Sharp Library Status:"
docker-compose exec -T backend npm list sharp 2>&1 | grep sharp || echo "Sharp not found"
echo ""

# Count files
echo "📸 File Counts:"
ORIGINALS=$(docker-compose exec -T backend find /app/uploads/milestones -maxdepth 1 -type f 2>/dev/null | wc -l)
THUMBNAILS=$(docker-compose exec -T backend find /app/uploads/milestones/thumbnails -maxdepth 1 -type f 2>/dev/null | wc -l)
echo "  Original photos: $ORIGINALS"
echo "  Thumbnails: $THUMBNAILS"
echo ""

# Check permissions
echo "🔐 Directory Permissions:"
docker-compose exec -T backend ls -ld /app/uploads/milestones 2>/dev/null || echo "Cannot check permissions"
docker-compose exec -T backend ls -ld /app/uploads/milestones/thumbnails 2>/dev/null || echo "Thumbnails dir missing"
echo ""

# Frontend compilation status
echo "🎨 Frontend Status:"
docker-compose logs frontend --tail=3 | tail -2
echo ""

# Recent errors
echo "❌ Recent Errors (if any):"
docker-compose logs backend --tail=50 | grep -i "error\|fail\|warn" | tail -5 || echo "No recent errors"
echo ""

echo "================================"
echo "✅ Diagnostic complete!"
echo ""
echo "Next steps:"
echo "1. Upload a test photo"
echo "2. Check browser console for logs"
echo "3. Run this script again to see backend activity"
echo "4. If thumbnails still don't work, share this output"
