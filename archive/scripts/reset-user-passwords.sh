#!/bin/bash

# =====================================================
# Reset User Passwords - Nusantara YK
# File: reset-user-passwords.sh
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
echo "║  🔐 Reset User Passwords                              ║"
echo "║  Nusantara YK Construction Management                 ║"
echo "╚════════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""

# Check if postgres container is running
if ! docker ps | grep -q nusantara-postgres; then
    echo -e "${RED}❌ Error: PostgreSQL container not running${NC}"
    echo "Start it with: docker-compose up -d postgres"
    exit 1
fi

# Generate password hash
echo -e "${CYAN}🔒 Generating password hash...${NC}"
PASSWORD="admin123"
HASH=$(docker exec -it nusantara-backend node -e "
const bcrypt = require('bcryptjs');
console.log(bcrypt.hashSync('$PASSWORD', 10));
" | tr -d '\r\n')

echo "Password: $PASSWORD"
echo "Hash: ${HASH:0:30}..."
echo ""

# Get list of users
echo -e "${CYAN}👥 Current users in database:${NC}"
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT username, role, is_active, 
       CASE 
         WHEN email IS NOT NULL THEN email 
         ELSE 'No email'
       END as email
FROM users 
ORDER BY username;
" 2>/dev/null

echo ""
read -p "Reset password to 'admin123' for ALL users? (yes/no): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo -e "${CYAN}❌ Password reset cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${CYAN}🔄 Resetting passwords...${NC}"

# Update all users
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -c "
UPDATE users 
SET password = '$HASH',
    updated_at = CURRENT_TIMESTAMP
WHERE password IS NOT NULL;
" 2>/dev/null

UPDATED=$(docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -t -c "
SELECT COUNT(*) FROM users WHERE password IS NOT NULL;
" | tr -d ' \r\n')

echo ""
echo -e "${GREEN}✅ Password reset complete!${NC}"
echo "   Updated $UPDATED users"
echo ""

# Test login
echo -e "${CYAN}🧪 Testing login...${NC}"
echo ""

# Get first user
FIRST_USER=$(docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -t -c "
SELECT username FROM users WHERE password IS NOT NULL LIMIT 1;
" | tr -d ' \r\n')

if [ -n "$FIRST_USER" ]; then
    echo "Testing with user: $FIRST_USER"
    RESPONSE=$(curl -s http://localhost:5000/api/auth/login \
      -X POST \
      -H "Content-Type: application/json" \
      -d "{\"username\":\"$FIRST_USER\",\"password\":\"$PASSWORD\"}")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        echo -e "${GREEN}✅ Login test PASSED${NC}"
        echo ""
        echo "Response:"
        echo "$RESPONSE" | grep -o '"user":{[^}]*}' | head -c 200
        echo "..."
    else
        echo -e "${RED}❌ Login test FAILED${NC}"
        echo "Response: $RESPONSE"
    fi
else
    echo -e "${YELLOW}⚠️  No users found to test${NC}"
fi

echo ""
echo -e "${GREEN}╔════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅ PASSWORD RESET COMPLETE                    ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${CYAN}📋 Login Credentials:${NC}"
echo ""
echo "All users now have password: ${GREEN}admin123${NC}"
echo ""
echo "Available users:"
docker exec -it nusantara-postgres psql -U admin -d nusantara_construction -t -c "
SELECT '  • ' || username || ' (' || role || ')' 
FROM users 
WHERE password IS NOT NULL 
ORDER BY 
  CASE role
    WHEN 'admin' THEN 1
    WHEN 'project_manager' THEN 2
    WHEN 'supervisor' THEN 3
    ELSE 4
  END,
  username;
" 2>/dev/null | grep -v '^$'

echo ""
echo -e "${CYAN}🌐 Login URLs:${NC}"
echo "  • Local:      ${GREEN}http://localhost:3000${NC}"
echo "  • Production: ${GREEN}https://nusantaragroup.co${NC}"
echo ""
echo -e "${YELLOW}📝 Note: For security, change passwords after first login!${NC}"
echo ""
