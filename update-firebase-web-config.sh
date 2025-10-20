#!/bin/bash

# ========================================
# Firebase Web Config Update Script
# ========================================
# This script updates Firebase configuration
# in frontend files with real credentials
# ========================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/frontend"

echo "============================================"
echo "🔥 Firebase Web Config Update Script"
echo "============================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if frontend directory exists
if [ ! -d "$FRONTEND_DIR" ]; then
    echo -e "${RED}❌ Error: Frontend directory not found${NC}"
    echo "Expected: $FRONTEND_DIR"
    exit 1
fi

echo -e "${BLUE}📋 This script will update Firebase config in 2 files:${NC}"
echo "   1. frontend/src/firebase/firebaseConfig.js"
echo "   2. frontend/public/firebase-messaging-sw.js"
echo ""

# Prompt for values
echo -e "${YELLOW}🔑 Enter Firebase Web Config values:${NC}"
echo -e "${YELLOW}(Get these from Firebase Console → Project Settings → Your apps → Web)${NC}"
echo ""

read -p "apiKey (AIza...): " API_KEY
read -p "messagingSenderId (numbers): " SENDER_ID
read -p "appId (1:123...:web:...): " APP_ID
read -p "measurementId (G-...) [optional, press Enter to skip]: " MEASUREMENT_ID

echo ""
echo -e "${YELLOW}🔑 Enter VAPID Key (Web Push Certificate):${NC}"
echo -e "${YELLOW}(Get from Firebase Console → Cloud Messaging → Web Push certificates)${NC}"
echo ""

read -p "vapidKey (B...): " VAPID_KEY

# Validate inputs
if [ -z "$API_KEY" ] || [ -z "$SENDER_ID" ] || [ -z "$APP_ID" ] || [ -z "$VAPID_KEY" ]; then
    echo -e "${RED}❌ Error: All fields except measurementId are required!${NC}"
    exit 1
fi

# Fixed values
PROJECT_ID="nusantaragroup-905e2"
AUTH_DOMAIN="${PROJECT_ID}.firebaseapp.com"
STORAGE_BUCKET="${PROJECT_ID}.appspot.com"

echo ""
echo -e "${BLUE}📝 Using these values:${NC}"
echo "   apiKey: ${API_KEY:0:10}..."
echo "   authDomain: $AUTH_DOMAIN"
echo "   projectId: $PROJECT_ID"
echo "   storageBucket: $STORAGE_BUCKET"
echo "   messagingSenderId: $SENDER_ID"
echo "   appId: ${APP_ID:0:20}..."
if [ -n "$MEASUREMENT_ID" ]; then
    echo "   measurementId: $MEASUREMENT_ID"
fi
echo "   vapidKey: ${VAPID_KEY:0:10}..."
echo ""

read -p "Continue with these values? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ]; then
    echo -e "${YELLOW}⚠️  Cancelled by user${NC}"
    exit 0
fi

echo ""
echo -e "${GREEN}🔄 Updating files...${NC}"

# Backup files
echo "📦 Creating backups..."
cp "$FRONTEND_DIR/src/firebase/firebaseConfig.js" "$FRONTEND_DIR/src/firebase/firebaseConfig.js.backup"
cp "$FRONTEND_DIR/public/firebase-messaging-sw.js" "$FRONTEND_DIR/public/firebase-messaging-sw.js.backup"
echo "   ✓ Backups created (.backup files)"

# Update firebaseConfig.js
echo "📝 Updating firebaseConfig.js..."

CONFIG_FILE="$FRONTEND_DIR/src/firebase/firebaseConfig.js"

# Build measurement ID line
if [ -n "$MEASUREMENT_ID" ]; then
    MEASUREMENT_LINE="  measurementId: \"$MEASUREMENT_ID\""
else
    MEASUREMENT_LINE="  // measurementId: \"YOUR_MEASUREMENT_ID\" // Optional"
fi

# Create new config block
NEW_CONFIG="const firebaseConfig = {
  apiKey: \"$API_KEY\",
  authDomain: \"$AUTH_DOMAIN\",
  projectId: \"$PROJECT_ID\",
  storageBucket: \"$STORAGE_BUCKET\",
  messagingSenderId: \"$SENDER_ID\",
  appId: \"$APP_ID\",
$MEASUREMENT_LINE
};"

# Update using sed (replace between markers)
sed -i.tmp "/^const firebaseConfig = {/,/^};/c\\
$NEW_CONFIG" "$CONFIG_FILE"

# Update VAPID key
sed -i.tmp "s/vapidKey: '[^']*'/vapidKey: '$VAPID_KEY'/" "$CONFIG_FILE"

rm -f "$CONFIG_FILE.tmp"

echo "   ✓ firebaseConfig.js updated"

# Update firebase-messaging-sw.js
echo "📝 Updating firebase-messaging-sw.js..."

SW_FILE="$FRONTEND_DIR/public/firebase-messaging-sw.js"

# Create new config block for service worker (no measurementId needed)
SW_CONFIG="const firebaseConfig = {
  apiKey: \"$API_KEY\",
  authDomain: \"$AUTH_DOMAIN\",
  projectId: \"$PROJECT_ID\",
  storageBucket: \"$STORAGE_BUCKET\",
  messagingSenderId: \"$SENDER_ID\",
  appId: \"$APP_ID\"
};"

# Update using sed
sed -i.tmp "/^const firebaseConfig = {/,/^};/c\\
$SW_CONFIG" "$SW_FILE"

rm -f "$SW_FILE.tmp"

echo "   ✓ firebase-messaging-sw.js updated"

echo ""
echo -e "${GREEN}✅ Configuration updated successfully!${NC}"
echo ""

# Verify updates
echo -e "${BLUE}🔍 Verification:${NC}"

if grep -q "YOUR_API_KEY_HERE" "$CONFIG_FILE"; then
    echo -e "   ${RED}❌ firebaseConfig.js still has placeholder values${NC}"
else
    echo -e "   ${GREEN}✓${NC} firebaseConfig.js updated"
fi

if grep -q "YOUR_VAPID_KEY_HERE" "$CONFIG_FILE"; then
    echo -e "   ${RED}❌ VAPID key not updated${NC}"
else
    echo -e "   ${GREEN}✓${NC} VAPID key updated"
fi

if grep -q "YOUR_API_KEY_HERE" "$SW_FILE"; then
    echo -e "   ${RED}❌ firebase-messaging-sw.js still has placeholder values${NC}"
else
    echo -e "   ${GREEN}✓${NC} firebase-messaging-sw.js updated"
fi

echo ""
echo -e "${BLUE}📚 Next Steps:${NC}"
echo "1. Restart frontend development server:"
echo "   ${YELLOW}cd frontend && npm start${NC}"
echo ""
echo "2. Clear browser cache (hard refresh):"
echo "   ${YELLOW}Ctrl + Shift + R (Windows/Linux)${NC}"
echo "   ${YELLOW}Cmd + Shift + R (Mac)${NC}"
echo ""
echo "3. Login to app and check console logs:"
echo "   ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "4. Allow notification permission when prompted"
echo ""
echo "5. Test by creating RAB with approval status"
echo ""
echo -e "${GREEN}🎉 Setup complete! Notifications should now work!${NC}"
echo ""
echo -e "${YELLOW}⚠️  Remember: Add these files to .gitignore to protect credentials!${NC}"
echo ""

# Offer to add to gitignore
read -p "Add config files to .gitignore? (recommended) (y/n): " ADD_GITIGNORE
if [ "$ADD_GITIGNORE" = "y" ]; then
    GITIGNORE="$SCRIPT_DIR/.gitignore"
    
    if [ -f "$GITIGNORE" ]; then
        # Check if already exists
        if ! grep -q "firebase-web-config.txt" "$GITIGNORE"; then
            echo "" >> "$GITIGNORE"
            echo "# Firebase credentials (added by setup script)" >> "$GITIGNORE"
            echo "firebase-web-config.txt" >> "$GITIGNORE"
            echo "   ✓ Added to .gitignore"
        else
            echo "   ✓ Already in .gitignore"
        fi
    fi
fi

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🎊 Firebase Web Config Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
