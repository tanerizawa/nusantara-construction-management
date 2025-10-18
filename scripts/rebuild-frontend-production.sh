#!/bin/bash

# =====================================================
# Rebuild & Deploy Frontend ke Production
# File: rebuild-frontend-production.sh
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
echo "║  🔨 Rebuild Frontend for Production                   ║"
echo "║  Target: https://nusantaragroup.co                    ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Change to frontend directory
cd /root/APP-YK/frontend

echo -e "${CYAN}📋 Step 1: Verifying configuration...${NC}"
echo ""

# Check .env file
if [ -f ".env" ]; then
    echo "Current .env:"
    cat .env
    echo ""
else
    echo -e "${YELLOW}⚠️  No .env file found, creating...${NC}"
    cat > .env << EOF
REACT_APP_API_URL=https://nusantaragroup.co/api
GENERATE_SOURCEMAP=false
EOF
    echo "✅ Created .env file"
fi

# Verify config.js
echo -e "${CYAN}📋 Step 2: Updating config.js...${NC}"

# Update config.js to prioritize hostname detection
cat > src/utils/config.js << 'EOF'
/**
 * SINGLE SOURCE OF TRUTH untuk konfigurasi API
 * PRODUCTION FIX: Hostname detection FIRST
 */

const getApiUrl = () => {
  // PRIORITAS 1: Production hostname detection (FIRST!)
  const hostname = window.location.hostname;
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    console.log('🌐 Production mode - using https://nusantaragroup.co/api');
    return 'https://nusantaragroup.co/api';
  }

  // PRIORITAS 2: Environment Variable
  if (process.env.REACT_APP_API_URL) {
    console.log('🔧 Using ENV API URL:', process.env.REACT_APP_API_URL);
    return process.env.REACT_APP_API_URL;
  }

  // PRIORITAS 3: Development fallback
  console.log('🏠 Development mode - using /api');
  return '/api';
};

export const API_URL = getApiUrl();
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

export const BASE_URL = (() => {
  const hostname = window.location.hostname;
  if (hostname === 'nusantaragroup.co' || hostname.includes('nusantaragroup')) {
    return 'https://nusantaragroup.co';
  }
  return 'http://localhost:5000';
})();

export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

console.log('📊 Config:', {
  API_URL,
  BASE_URL,
  hostname: window.location.hostname
});
EOF

echo "✅ config.js updated (hostname detection FIRST)"
echo ""

echo -e "${CYAN}🔨 Step 3: Building with Docker...${NC}"
echo ""

# Build inside Docker container
docker run --rm \
  -v /root/APP-YK/frontend:/app \
  -w /app \
  -e REACT_APP_API_URL=https://nusantaragroup.co/api \
  -e NODE_ENV=production \
  -e GENERATE_SOURCEMAP=false \
  node:20-alpine \
  sh -c "
    echo '📦 Installing dependencies...' && \
    npm install --legacy-peer-deps && \
    echo '🔨 Building production bundle...' && \
    npm run build && \
    echo '✅ Build complete!'
  "

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✅ Build successful!${NC}"
echo ""

# Verify build
if [ ! -d "build" ]; then
    echo -e "${RED}❌ Build directory not found${NC}"
    exit 1
fi

echo -e "${CYAN}📊 Step 4: Build verification...${NC}"
echo "Build size: $(du -sh build | cut -f1)"
echo ""

# Check if API URL is in the bundle
if grep -q "nusantaragroup.co/api" build/static/js/*.js 2>/dev/null; then
    echo -e "${GREEN}✅ Production API URL found in bundle${NC}"
else
    echo -e "${YELLOW}⚠️  Production URL not found (hostname detection will be used)${NC}"
fi
echo ""

echo -e "${CYAN}💾 Step 5: Backing up current production...${NC}"
BACKUP_DIR="/var/www/html_backup_$(date +%Y%m%d_%H%M%S)"
sudo mkdir -p "$BACKUP_DIR"
sudo cp -r /var/www/html/nusantara-frontend "$BACKUP_DIR/" 2>/dev/null || echo "No existing production to backup"
echo "✅ Backup created at: $BACKUP_DIR"
echo ""

echo -e "${CYAN}🚀 Step 6: Deploying to production...${NC}"
sudo rm -rf /var/www/html/nusantara-frontend
sudo mkdir -p /var/www/html/nusantara-frontend
sudo cp -r build/* /var/www/html/nusantara-frontend/

echo "✅ Files deployed"
echo ""

echo -e "${CYAN}🔒 Step 7: Setting permissions...${NC}"
sudo chown -R www-data:www-data /var/www/html/nusantara-frontend
sudo chmod -R 755 /var/www/html/nusantara-frontend
echo "✅ Permissions set"
echo ""

echo -e "${CYAN}🔄 Step 8: Reloading web server...${NC}"
if command -v apache2 &> /dev/null; then
    sudo systemctl reload apache2
    echo "✅ Apache reloaded"
elif command -v nginx &> /dev/null; then
    sudo nginx -t && sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
fi
echo ""

echo -e "${CYAN}🧪 Step 9: Testing...${NC}"
echo ""

# Test 1: Backend API
echo "Test 1: Backend API Health"
HEALTH=$(curl -s https://nusantaragroup.co/api/health 2>/dev/null || echo "failed")
if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend API is healthy${NC}"
else
    echo -e "${RED}❌ Backend API test failed${NC}"
fi

# Test 2: Frontend
echo ""
echo "Test 2: Frontend Accessibility"
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" https://nusantaragroup.co 2>/dev/null)
if [ "$FRONTEND" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is accessible (HTTP 200)${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend returned: $FRONTEND${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DEPLOYMENT COMPLETE!                       ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""

echo -e "${CYAN}📊 Summary:${NC}"
echo "  • Built with: ${GREEN}https://nusantaragroup.co/api${NC}"
echo "  • Deployed to: ${GREEN}/var/www/html/nusantara-frontend${NC}"
echo "  • Backup: ${GREEN}$BACKUP_DIR${NC}"
echo ""

echo -e "${CYAN}🌐 Access your application:${NC}"
echo "  • URL: ${GREEN}https://nusantaragroup.co${NC}"
echo ""

echo -e "${CYAN}🔐 Login credentials:${NC}"
echo "  • Username: ${GREEN}hadez${NC}"
echo "  • Password: ${GREEN}T@n12089${NC}"
echo ""

echo -e "${YELLOW}📝 Next steps:${NC}"
echo "  1. Clear browser cache (Ctrl+Shift+Delete)"
echo "  2. Open https://nusantaragroup.co in incognito mode"
echo "  3. Press F12, check Console for config logs"
echo "  4. Login with credentials above"
echo ""

echo -e "${GREEN}✨ Done!${NC}"
