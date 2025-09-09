#!/bin/bash

# Script to clean up resources and start optimized Docker development environment
# Nusantara Construction Management System

echo "🧹 Membersihkan sistem untuk performa optimal..."

# Stop all running containers
echo "🛑 Menghentikan semua Docker containers..."
docker stop $(docker ps -q) 2>/dev/null || true

# Clean up Docker resources
echo "🗑️  Membersihkan Docker resources..."
docker system prune -f --volumes 2>/dev/null || true

# Kill any remaining Node.js processes
echo "🚫 Menghentikan proses Node.js yang tidak diperlukan..."
pkill -f "node.*complete-manpower" 2>/dev/null || true
pkill -f "react-scripts" 2>/dev/null || true

# Clear npm cache
echo "🧽 Membersihkan npm cache..."
npm cache clean --force 2>/dev/null || true

# Clear VS Code TypeScript cache to reduce CPU usage
echo "📁 Membersihkan cache TypeScript..."
rm -rf /root/.cache/typescript/* 2>/dev/null || true
rm -rf /tmp/vscode-typescript* 2>/dev/null || true

# Optimize VS Code settings for lower CPU usage
echo "⚙️  Mengoptimalkan VS Code..."
mkdir -p /root/.vscode-server/data/Machine
cat > /root/.vscode-server/data/Machine/settings.json << 'EOF'
{
    "typescript.preferences.includePackageJsonAutoImports": "off",
    "typescript.disableAutomaticTypeAcquisition": true,
    "typescript.preferences.includeProposedAPITypes": "off",
    "search.followSymlinks": false,
    "files.watcherExclude": {
        "**/node_modules/**": true,
        "**/.git/**": true,
        "**/dist/**": true,
        "**/build/**": true,
        "**/coverage/**": true
    },
    "files.exclude": {
        "**/node_modules": true,
        "**/.git": true,
        "**/dist": true,
        "**/build": true
    }
}
EOF

echo "🐳 Memulai aplikasi dengan Docker Compose..."
cd /root/APP-YK

# Start the optimized Docker environment
docker-compose up -d --build

echo "⏳ Menunggu services siap..."
sleep 10

# Check service status
echo "📊 Status Services:"
docker-compose ps

# Show logs for quick debugging
echo "📝 Backend logs (last 10 lines):"
docker-compose logs --tail=10 backend

echo "📝 Frontend logs (last 10 lines):"
docker-compose logs --tail=10 frontend

# Final resource check
echo "💾 Penggunaan Resource:"
free -h
echo ""
ps aux --sort=-%cpu | head -10

echo "✅ Setup selesai!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "🗄️  Database: localhost:5432"
echo ""
echo "📊 Untuk memonitor: docker-compose logs -f [service_name]"
echo "🛑 Untuk menghentikan: docker-compose down"
