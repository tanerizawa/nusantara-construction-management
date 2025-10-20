#!/bin/bash

# Quick Verification Script
# Checks if Firebase config is properly set

echo "============================================"
echo "🔍 Firebase Config Verification"
echo "============================================"
echo ""

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

FRONTEND_DIR="/root/APP-YK/frontend"
ERRORS=0

# Check File 1: firebaseConfig.js
echo -e "${BLUE}📝 Checking firebaseConfig.js...${NC}"

CONFIG_FILE="$FRONTEND_DIR/src/firebase/firebaseConfig.js"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${RED}   ❌ File not found${NC}"
    ERRORS=$((ERRORS+1))
else
    # Check for placeholders
    if grep -q "YOUR_API_KEY_HERE" "$CONFIG_FILE"; then
        echo -e "${RED}   ❌ apiKey not configured (still has placeholder)${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}   ✓ apiKey configured${NC}"
    fi
    
    if grep -q "YOUR_SENDER_ID" "$CONFIG_FILE"; then
        echo -e "${RED}   ❌ messagingSenderId not configured${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}   ✓ messagingSenderId configured${NC}"
    fi
    
    if grep -q "YOUR_APP_ID" "$CONFIG_FILE"; then
        echo -e "${RED}   ❌ appId not configured${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}   ✓ appId configured${NC}"
    fi
    
    if grep -q "YOUR_VAPID_KEY_HERE" "$CONFIG_FILE"; then
        echo -e "${RED}   ❌ VAPID key not configured${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}   ✓ VAPID key configured${NC}"
    fi
fi

echo ""

# Check File 2: firebase-messaging-sw.js
echo -e "${BLUE}📝 Checking firebase-messaging-sw.js...${NC}"

SW_FILE="$FRONTEND_DIR/public/firebase-messaging-sw.js"

if [ ! -f "$SW_FILE" ]; then
    echo -e "${RED}   ❌ File not found${NC}"
    ERRORS=$((ERRORS+1))
else
    if grep -q "YOUR_API_KEY_HERE" "$SW_FILE"; then
        echo -e "${RED}   ❌ Service Worker config not configured${NC}"
        ERRORS=$((ERRORS+1))
    else
        echo -e "${GREEN}   ✓ Service Worker configured${NC}"
    fi
fi

echo ""

# Check database for tokens
echo -e "${BLUE}🔍 Checking database for FCM tokens...${NC}"

TOKEN_COUNT=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c "SELECT COUNT(*) FROM notification_tokens;" 2>/dev/null | tr -d ' ')

if [ $? -eq 0 ]; then
    if [ "$TOKEN_COUNT" -gt 0 ]; then
        echo -e "${GREEN}   ✓ Found $TOKEN_COUNT FCM token(s) in database${NC}"
    else
        echo -e "${YELLOW}   ⚠ No FCM tokens in database yet (users need to login and allow permissions)${NC}"
    fi
else
    echo -e "${RED}   ❌ Cannot connect to database${NC}"
    ERRORS=$((ERRORS+1))
fi

echo ""

# Check backend service
echo -e "${BLUE}🔍 Checking backend FCM service...${NC}"

if docker exec nusantara-backend cat /app/backend/config/firebase-service-account.json > /dev/null 2>&1; then
    echo -e "${GREEN}   ✓ Backend Firebase credentials found${NC}"
else
    echo -e "${RED}   ❌ Backend Firebase credentials not found${NC}"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "============================================"

# Final result
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo -e "${BLUE}Next steps:${NC}"
    echo "1. Restart frontend: cd frontend && npm start"
    echo "2. Login to app: http://localhost:3000"
    echo "3. Allow notification permission when prompted"
    echo "4. Create RAB to test notification"
else
    echo -e "${RED}❌ Found $ERRORS error(s)${NC}"
    echo ""
    echo -e "${YELLOW}To fix:${NC}"
    echo "1. Run: ./update-firebase-web-config.sh"
    echo "   OR"
    echo "2. Manually update config files with values from Firebase Console"
    echo ""
    echo -e "${YELLOW}Get credentials from:${NC}"
    echo "Firebase Console → Project Settings → Your apps → Web app"
fi

echo "============================================"
