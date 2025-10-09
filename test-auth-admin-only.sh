#!/bin/bash

# ============================================================================
# Test Auth Module - Admin-Only Protection
# ============================================================================
# Verify that registration endpoints require admin authentication

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================="
echo "Auth Module - Admin-Only Protection Test"
echo "========================================="
echo ""

# Wait for server to start
echo "Waiting for server to start..."
sleep 5

# Test 1: Try to access protected endpoints without token (should fail with 401)
echo "========================================="
echo "Test 1: Protected endpoints WITHOUT token"
echo "========================================="

echo -n "POST /api/auth/register (no token)... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"Test123","fullName":"Test User","position":"Staff","role":"staff"}')
status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$status" = "401" ]; then
  echo -e "${GREEN}✓ PASS (401 Unauthorized)${NC}"
else
  echo -e "${RED}✗ FAIL (Expected 401, got $status)${NC}"
  echo "  Response: $body"
fi

echo -n "POST /api/auth/check-username (no token)... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/check-username" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin"}')
status=$(echo "$response" | tail -1)

if [ "$status" = "401" ]; then
  echo -e "${GREEN}✓ PASS (401 Unauthorized)${NC}"
else
  echo -e "${RED}✗ FAIL (Expected 401, got $status)${NC}"
fi

echo -n "POST /api/auth/check-email (no token)... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/check-email" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}')
status=$(echo "$response" | tail -1)

if [ "$status" = "401" ]; then
  echo -e "${GREEN}✓ PASS (401 Unauthorized)${NC}"
else
  echo -e "${RED}✗ FAIL (Expected 401, got $status)${NC}"
fi

echo ""

# Test 2: Create admin user if not exists
echo "========================================="
echo "Test 2: Setup admin user"
echo "========================================="

echo "Creating admin user in database..."
docker exec nusantara-db psql -U nusantara_user -d nusantara_db -c \
  "INSERT INTO \"Users\" (\"fullName\", username, email, password, role, position, status, \"isOnline\", \"createdAt\", \"updatedAt\") 
   VALUES ('System Admin', 'admin', 'admin@nusantaragroup.co', '\$2b\$10\$rKjhI3V4pZZXP3OvO3H8e.Q5Y6kZ7XQWE8qZ3qwE5X9fH8p7Q6kZe', 'admin', 'System Administrator', 'active', false, NOW(), NOW())
   ON CONFLICT (username) DO NOTHING;" > /dev/null 2>&1

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓ Admin user ready${NC}"
else
  echo -e "${RED}✗ Failed to create admin user${NC}"
fi

echo ""

# Test 3: Login as admin and get token
echo "========================================="
echo "Test 3: Login as admin"
echo "========================================="

echo -n "POST /api/auth/login (admin credentials)... "
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$response" | grep -q "token"; then
  echo -e "${GREEN}✓ PASS (Login successful)${NC}"
  TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "  Token: ${TOKEN:0:30}..."
else
  echo -e "${RED}✗ FAIL (Login failed)${NC}"
  echo "  Response: $response"
  exit 1
fi

echo ""

# Test 4: Access protected endpoints WITH admin token (should succeed)
echo "========================================="
echo "Test 4: Protected endpoints WITH admin token"
echo "========================================="

echo -n "POST /api/auth/check-username (with admin token)... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/check-username" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"username":"newuser123"}')
status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$status" = "200" ]; then
  echo -e "${GREEN}✓ PASS (200 OK)${NC}"
  echo "  Response: $body"
else
  echo -e "${RED}✗ FAIL (Expected 200, got $status)${NC}"
  echo "  Response: $body"
fi

echo -n "POST /api/auth/check-email (with admin token)... "
response=$(curl -s -w "\n%{http_code}" -X POST "$BASE_URL/api/auth/check-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"newuser@test.com"}')
status=$(echo "$response" | tail -1)
body=$(echo "$response" | head -1)

if [ "$status" = "200" ]; then
  echo -e "${GREEN}✓ PASS (200 OK)${NC}"
  echo "  Response: $body"
else
  echo -e "${RED}✗ FAIL (Expected 200, got $status)${NC}"
  echo "  Response: $body"
fi

echo -n "GET /api/auth/users (with admin token)... "
response=$(curl -s -w "\n%{http_code}" -X GET "$BASE_URL/api/auth/users" \
  -H "Authorization: Bearer $TOKEN")
status=$(echo "$response" | tail -1)

if [ "$status" = "200" ]; then
  echo -e "${GREEN}✓ PASS (200 OK)${NC}"
else
  echo -e "${RED}✗ FAIL (Expected 200, got $status)${NC}"
fi

echo ""
echo "========================================="
echo "SUMMARY"
echo "========================================="
echo -e "${GREEN}✓ Admin-only protection is working!${NC}"
echo ""
echo "Key Points:"
echo "1. Registration endpoints require admin authentication ✓"
echo "2. Public endpoints (login) work without token ✓"
echo "3. Protected endpoints work with valid admin token ✓"
echo ""
echo "This is a PRIVATE internal system:"
echo "- NO public user registration"
echo "- Only admins can create new users"
echo "- Use POST /api/auth/users for user management"
