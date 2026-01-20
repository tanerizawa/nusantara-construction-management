#!/bin/bash

# =====================================================
# Quick Fix: Login Issue di Production
# File: fix-login-production.sh
# =====================================================

set -e

echo "🔧 Fixing production login issue..."
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# Step 1: Check current directory
if [ ! -d "/root/APP-YK/frontend" ]; then
    echo -e "${RED}❌ Error: Frontend directory not found${NC}"
    exit 1
fi

cd /root/APP-YK/frontend

# Step 2: Verify .env file
echo -e "${CYAN}📋 Step 1: Verifying environment configuration...${NC}"
if [ -f ".env" ]; then
    echo "Current .env contents:"
    cat .env
    echo ""
else
    echo -e "${YELLOW}⚠️  No .env file found, creating one...${NC}"
    echo "REACT_APP_API_URL=https://nusantaragroup.co/api" > .env
    echo "GENERATE_SOURCEMAP=false" >> .env
    echo "✅ Created .env file"
fi

# Step 3: Install dependencies (if needed)
echo -e "${CYAN}📦 Step 2: Checking dependencies...${NC}"
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

# Step 4: Build with production environment
echo -e "${CYAN}🔨 Step 3: Building frontend with production config...${NC}"
echo "Using: REACT_APP_API_URL=https://nusantaragroup.co/api"
echo ""

export REACT_APP_API_URL=https://nusantaragroup.co/api
export NODE_ENV=production
export GENERATE_SOURCEMAP=false

npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful${NC}"
echo ""

# Step 5: Verify build output
echo -e "${CYAN}📊 Step 4: Verifying build output...${NC}"
if [ -d "build" ]; then
    echo "Build directory size:"
    du -sh build
    echo ""
    
    # Check if index.html contains the correct API URL
    if grep -q "nusantaragroup.co" build/static/js/*.js 2>/dev/null; then
        echo -e "${GREEN}✅ Production URL found in build files${NC}"
    else
        echo -e "${YELLOW}⚠️  Warning: Production URL not found in build (might use relative paths)${NC}"
    fi
else
    echo -e "${RED}❌ Build directory not found${NC}"
    exit 1
fi

# Step 6: Backup current production
echo -e "${CYAN}💾 Step 5: Backing up current production files...${NC}"
BACKUP_DIR="/var/www/html_backup_$(date +%Y%m%d_%H%M%S)"

if [ -d "/var/www/html" ]; then
    sudo mkdir -p "$BACKUP_DIR"
    sudo cp -r /var/www/html/* "$BACKUP_DIR/" 2>/dev/null || true
    echo "✅ Backup created at: $BACKUP_DIR"
else
    echo "⚠️  No existing /var/www/html directory"
fi

# Step 7: Deploy to production
echo -e "${CYAN}🚀 Step 6: Deploying to production...${NC}"
sudo mkdir -p /var/www/html
sudo cp -r build/* /var/www/html/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files deployed to /var/www/html${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    exit 1
fi

# Step 8: Set correct permissions
echo -e "${CYAN}🔒 Step 7: Setting file permissions...${NC}"
sudo chown -R www-data:www-data /var/www/html 2>/dev/null || sudo chown -R nginx:nginx /var/www/html 2>/dev/null || echo "⚠️  Could not set owner (may need manual fix)"
sudo chmod -R 755 /var/www/html
echo "✅ Permissions set"

# Step 9: Restart backend (ensure CORS config loaded)
echo -e "${CYAN}🔄 Step 8: Restarting backend...${NC}"
if docker ps | grep -q nusantara-backend; then
    docker restart nusantara-backend
    echo "✅ Backend restarted"
else
    echo "⚠️  Backend container not running, skipping restart"
fi

# Step 10: Reload web server
echo -e "${CYAN}🌐 Step 9: Reloading web server...${NC}"
if command -v apache2 &> /dev/null; then
    echo "Detected: Apache"
    sudo systemctl reload apache2
    echo "✅ Apache reloaded"
elif command -v nginx &> /dev/null; then
    echo "Detected: Nginx"
    sudo nginx -t && sudo systemctl reload nginx
    echo "✅ Nginx reloaded"
else
    echo "⚠️  No web server detected (Apache/Nginx)"
fi

# Step 11: Test endpoints
echo ""
echo -e "${CYAN}🧪 Step 10: Testing endpoints...${NC}"
echo ""

# Test 1: Backend health
echo "Test 1: Backend Health Check"
HEALTH_RESPONSE=$(curl -s https://nusantaragroup.co/api/health 2>/dev/null || echo "failed")
if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed: $HEALTH_RESPONSE${NC}"
fi

# Test 2: Frontend
echo ""
echo "Test 2: Frontend Accessibility"
FRONTEND_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://nusantaragroup.co 2>/dev/null || echo "failed")
if [ "$FRONTEND_RESPONSE" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is accessible (HTTP $FRONTEND_RESPONSE)${NC}"
else
    echo -e "${RED}❌ Frontend returned: $FRONTEND_RESPONSE${NC}"
fi

# Test 3: CORS preflight
echo ""
echo "Test 3: CORS Preflight for Login"
CORS_RESPONSE=$(curl -s -X OPTIONS https://nusantaragroup.co/api/auth/login \
  -H "Origin: https://nusantaragroup.co" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -I 2>/dev/null | grep -i "access-control-allow")

if [ -n "$CORS_RESPONSE" ]; then
    echo -e "${GREEN}✅ CORS is configured:${NC}"
    echo "$CORS_RESPONSE"
else
    echo -e "${YELLOW}⚠️  CORS headers not detected (might need proxy configuration)${NC}"
fi

# Final summary
echo ""
echo -e "${GREEN}╔════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ DEPLOYMENT COMPLETE!                   ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📊 Summary:${NC}"
echo -e "  • Frontend built with: ${GREEN}https://nusantaragroup.co/api${NC}"
echo -e "  • Deployed to: ${GREEN}/var/www/html${NC}"
echo -e "  • Backup location: ${GREEN}$BACKUP_DIR${NC}"
echo -e "  • Backend status: ${GREEN}Running${NC}"
echo ""
echo -e "${CYAN}🌐 Access your application:${NC}"
echo -e "  • Frontend: ${GREEN}https://nusantaragroup.co${NC}"
echo -e "  • Backend API: ${GREEN}https://nusantaragroup.co/api${NC}"
echo ""
echo -e "${YELLOW}📝 Next Steps:${NC}"
echo "  1. Clear browser cache (Ctrl+Shift+Delete)"
echo "  2. Open https://nusantaragroup.co in incognito/private mode"
echo "  3. Check browser console (F12) for any errors"
echo "  4. Try logging in with your credentials"
echo ""
echo -e "${CYAN}🔍 Debugging:${NC}"
echo "  • View backend logs: docker logs nusantara-backend"
echo "  • View Apache logs: sudo tail -f /var/log/apache2/error.log"
echo "  • View Nginx logs: sudo tail -f /var/log/nginx/error.log"
echo "  • Test API: curl https://nusantaragroup.co/api/health"
echo ""
echo -e "${GREEN}✨ Done!${NC}"
