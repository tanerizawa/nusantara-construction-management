#!/bin/bash

echo "🧹 Clearing Frontend Cache and Forcing Browser Refresh..."
echo "============================================"

# 1. Clear webpack cache
echo "📦 Clearing webpack cache..."
docker exec nusantara-frontend rm -rf /app/node_modules/.cache 2>/dev/null
docker exec nusantara-frontend rm -rf /app/.cache 2>/dev/null
echo "✅ Webpack cache cleared"

# 2. Clear build directory
echo "🏗️  Clearing build directory..."
docker exec nusantara-frontend rm -rf /app/build 2>/dev/null
echo "✅ Build directory cleared"

# 3. Restart container
echo "🔄 Restarting container..."
docker restart nusantara-frontend
echo "✅ Container restarted"

# 4. Wait for compilation
echo "⏳ Waiting for webpack compilation..."
sleep 30

# 5. Check compilation status
echo "🔍 Checking compilation status..."
docker logs nusantara-frontend --tail 20 2>&1 | grep -E "(Compiled|compiled|webpack)" | tail -5

echo ""
echo "============================================"
echo "✅ Cache cleared successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Open browser DevTools (F12)"
echo "   2. Go to Network tab"
echo "   3. Check 'Disable cache'"
echo "   4. Hard refresh: Ctrl+Shift+R (Linux/Windows) or Cmd+Shift+R (Mac)"
echo "   5. Or clear browser cache: Ctrl+Shift+Delete"
echo ""
echo "🌐 Application URL: http://your-domain:3000"
echo "============================================"
