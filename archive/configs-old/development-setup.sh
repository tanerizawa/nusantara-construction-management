#!/bin/bash
# Development Mode Optimization Script
# Clean up and set proper development environment

set -e
echo "🛠️ SETTING UP PROPER DEVELOPMENT ENVIRONMENT"
echo "=================================================="

cd /root/APP-YK

# 1. Stop all containers
echo "🛑 Stopping all containers..."
docker-compose down

# 2. Check and convert mock data to database
echo "📊 Analyzing mock data usage..."

# Find all files using mock data
echo "🔍 Mock data locations found:"
grep -r "mock" frontend/src/ --include="*.js" | grep -i "const mock\|mockEmployees\|mockProjects" | cut -d: -f1 | sort | uniq | head -10

echo ""
echo "📋 RECOMMENDATIONS:"
echo "==================="

echo "✅ KEEP DEVELOPMENT MODE because:"
echo "   • Container names have -dev suffix"
echo "   • Mock data still extensively used"
echo "   • WebSocket Hot Reload needed for development"
echo "   • Database migration not completed"
echo ""

echo "🧹 CLEANUP ACTIONS:"
echo "=================="

# 3. Remove production-specific files we created
echo "🗑️ Removing production-specific files..."
rm -f docker-compose.websocket-fix.yml
rm -f websocket-fix.sh
rm -f docker-websocket-fix.sh

# 4. Set development environment
echo "🔧 Setting proper development environment..."

# Update .env.development for local development
cat > frontend/.env.development << 'EOF'
# Development Environment
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development

# WebSocket Configuration for Hot Reload (Development)
WDS_SOCKET_HOST=localhost
WDS_SOCKET_PORT=3000
WDS_SOCKET_PATH=/ws
REACT_APP_ENABLE_HOT_RELOAD=true

# Development Features
FAST_REFRESH=true
GENERATE_SOURCEMAP=true
REACT_APP_DEBUG_MODE=true

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEV_TOOLS=true

# Local Development
BROWSER=none
EOF

# 5. Fix webpack override for development
echo "🔧 Updating webpack override for development..."
cat > frontend/public/webpack-override.js << 'EOF'
// Development Mode WebSocket Configuration
(function() {
    'use strict';
    
    // Only run in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('🛠️ Development mode detected - WebSocket Hot Reload enabled');
        // Let webpack handle hot reload normally in development
        return;
    }
    
    // For production domain access during development
    if (window.location.protocol === 'https:' && window.location.hostname !== 'localhost') {
        console.log('🌐 Production domain detected - Configuring for development access');
        
        // Override WebSocket to use local development server
        if (typeof window !== 'undefined' && window.WebSocket) {
            const originalWebSocket = window.WebSocket;
            window.WebSocket = function(url, protocols) {
                // Redirect WebSocket connections to local development server
                if (url.includes('ws://') || url.includes('wss://')) {
                    const localUrl = url.replace(/wss?:\/\/[^\/]+/, 'ws://localhost:3000');
                    console.log('🔄 Redirecting WebSocket to local dev server:', localUrl);
                    try {
                        return new originalWebSocket(localUrl, protocols);
                    } catch (error) {
                        console.log('⚠️ Cannot connect to local dev server, disabling WebSocket');
                        return {
                            close: () => {},
                            send: () => {},
                            addEventListener: () => {},
                            removeEventListener: () => {}
                        };
                    }
                }
                return new originalWebSocket(url, protocols);
            };
        }
    }
})();
EOF

# 6. Start development containers
echo "🚀 Starting development containers..."
docker-compose up -d

# 7. Wait for containers
echo "⏳ Waiting for containers to start..."
sleep 15

# 8. Check status
echo "📊 Development environment status:"
docker-compose ps

# 9. Check mock data files
echo "📁 Checking mock data structure..."
if [ -d "backend/data" ]; then
    echo "✅ Mock data directory exists"
    ls -la backend/data/ || echo "⚠️ No mock data files found"
else
    echo "⚠️ Mock data directory not found"
fi

# 10. Database status
echo "🗄️ Database status:"
docker-compose exec -T database psql -U yk_user -d yk_construction_dev -c "\dt" 2>/dev/null || echo "⚠️ Cannot connect to database"

echo ""
echo "✅ DEVELOPMENT ENVIRONMENT READY!"
echo "=================================="
echo ""
echo "🔧 Current Setup:"
echo "   • Mode: DEVELOPMENT"
echo "   • Frontend: http://localhost:3000 (with Hot Reload)"
echo "   • Backend: http://localhost:5000"
echo "   • Database: PostgreSQL on port 5432"
echo "   • Admin: pgAdmin on http://localhost:8080"
echo "   • Mail: MailHog on http://localhost:8025"
echo ""
echo "📋 Next Steps:"
echo "   1. Convert mock data to database:"
echo "      cd backend && node scripts/data-mapper.js"
echo "   2. Create database migrations for mock data"
echo "   3. Update frontend to use real API instead of mock fallbacks"
echo "   4. Continue development with proper data flow"
echo ""
echo "🌐 For production deployment later:"
echo "   • Create separate production docker-compose"
echo "   • Disable development tools"
echo "   • Set production environment variables"
echo ""
