#!/bin/bash

echo "🚀 Nusantara Construction Management - Flexible Development Setup"
echo "================================================================="
echo "Pilihan deployment:"
echo "1. Development Full (Hot reload + Debug logs) - Port 3001"
echo "2. Staging (Production build + Source maps) - Port 8080 (Domain ready)"
echo "3. Production (Optimized) - Port 80 via Apache"
echo ""

read -p "Pilih mode (1-3): " choice

case $choice in
    1)
        echo "🔧 Starting Development Mode..."
        echo "Frontend: http://localhost:3001"
        echo "Backend: http://localhost:5001"
        echo "Features: Hot reload, debug logs, source maps"
        docker-compose -f docker-compose.development.yml up --build
        ;;
    2)
        echo "🎯 Starting Staging Mode..."
        echo "Access via: https://nusantaragroup.co (Apache proxy required)"
        echo "Features: Production build + source maps untuk debug"
        docker-compose -f docker-compose.staging.yml up --build
        ;;
    3)
        echo "🏭 Starting Production Mode..."
        echo "Access via: https://nusantaragroup.co"
        echo "Features: Full optimization, no debug"
        docker-compose -f docker-compose.production.yml up --build
        ;;
    *)
        echo "❌ Invalid choice. Please run again."
        exit 1
        ;;
esac