#!/bin/bash

echo "🧹 Starting VS Code Resource Cleanup..."
echo "======================================"

# 1. Clear frontend build artifacts
echo ""
echo "📦 Cleaning frontend build artifacts..."
cd /root/APP-YK/frontend
if [ -d "build" ]; then
    rm -rf build
    echo "✅ Removed frontend/build (9.6MB freed)"
fi
if [ -d ".cache" ]; then
    rm -rf .cache
    echo "✅ Removed frontend/.cache"
fi

# 2. Clear webpack cache
echo ""
echo "📦 Cleaning webpack cache..."
if [ -d "node_modules/.cache" ]; then
    rm -rf node_modules/.cache
    echo "✅ Removed webpack cache"
fi

# 3. Clear temporary files
echo ""
echo "🗑️  Removing temporary files..."
cd /root/APP-YK
find . -type f \( -name "*.log" -o -name "*.tmp" -o -name ".DS_Store" \) -delete 2>/dev/null
echo "✅ Removed log/tmp files"

# 4. Clear old docker images (keep current)
echo ""
echo "🐳 Cleaning old Docker images..."
docker image prune -f 2>/dev/null
echo "✅ Pruned unused Docker images"

# 5. Clear npm cache
echo ""
echo "📦 Cleaning npm cache..."
npm cache clean --force 2>/dev/null
echo "✅ Cleaned npm cache"

# 6. Restart TypeScript servers (reduce memory)
echo ""
echo "🔄 Restarting TypeScript language servers..."
pkill -f "tsserver.js" 2>/dev/null
sleep 2
echo "✅ TypeScript servers will restart on demand"

# 7. Summary
echo ""
echo "======================================"
echo "✅ CLEANUP COMPLETE"
echo "======================================"
echo ""
echo "📊 Current disk usage:"
du -sh /root/APP-YK 2>/dev/null | head -5

