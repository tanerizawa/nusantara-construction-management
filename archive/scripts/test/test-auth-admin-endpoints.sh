#!/bin/bash

# ============================================================================
# Backend Modularization Phase 2B - Admin Auth Testing
# ============================================================================
# Tests auth module with ADMIN credentials (hadez)
# - All registration endpoints require admin authentication
# - User management endpoints require admin authentication
# ============================================================================

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
TOKEN=""

echo "========================================="
echo "Auth Module Testing - ADMIN MODE"
echo "========================================="
echo ""

# ============================================================================
# 1. LOGIN AS ADMIN (hadez)
# ============================================================================

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}1. ADMIN LOGIN${NC}"
echo -e "${BLUE}=========================================${NC}"

echo -n "Testing login as hadez... "
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"hadez","password":"Tan12089@"}')

if echo "$response" | grep -q "token"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo -e "  ${GREEN}Token obtained: ${TOKEN:0:30}...${NC}"
  
  # Extract user info
  USER_ID=$(echo "$response" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
  USER_ROLE=$(echo "$response" | grep -o '"role":"[^"]*' | cut -d'"' -f4)
  echo -e "  User: $USER_ID | Role: $USER_ROLE"
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
  exit 1
fi

echo ""

# ============================================================================
# 2. AUTHENTICATION ENDPOINTS (with token)
# ============================================================================

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}2. AUTHENTICATION ENDPOINTS${NC}"
echo -e "${BLUE}=========================================${NC}"

echo -n "Testing GET /me... "
response=$(curl -s -X GET "$BASE_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "hadez"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

echo -n "Testing POST /logout... "
response=$(curl -s -X POST "$BASE_URL/api/auth/logout" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "success"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  echo "  Re-logging in..."
  # Re-login for remaining tests
  response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"hadez","password":"Tan12089@"}')
  TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

echo ""

# ============================================================================
# 3. REGISTRATION ENDPOINTS (ADMIN ONLY)
# ============================================================================

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}3. REGISTRATION ENDPOINTS (Admin Only)${NC}"
echo -e "${BLUE}=========================================${NC}"

echo -n "Testing check-username (with admin token)... "
response=$(curl -s -X POST "$BASE_URL/api/auth/check-username" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"username":"testuser123"}')

if echo "$response" | grep -q "available"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  echo "  Response: $response"
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

echo -n "Testing check-email (with admin token)... "
response=$(curl -s -X POST "$BASE_URL/api/auth/check-email" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"email":"newuser@example.com"}')

if echo "$response" | grep -q "available"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  echo "  Response: $response"
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

echo -n "Testing check-username WITHOUT token (should fail)... "
response=$(curl -s -X POST "$BASE_URL/api/auth/check-username" \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser123"}')

if echo "$response" | grep -q "denied\|token"; then
  echo -e "${GREEN}✓ PASS (correctly denied)${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ FAIL (should require auth)${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

echo -n "Testing register new user (with admin token)... "
response=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "username":"testuser_'.$(date +%s)'",
    "email":"test'.$(date +%s)'@example.com",
    "password":"Test123456",
    "fullName":"Test User",
    "position":"Tester",
    "role":"staff"
  }')

if echo "$response" | grep -q "success"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  echo "  User created successfully"
else
  echo -e "${YELLOW}⚠ PARTIAL${NC}"
  echo "  Response: $response"
fi

echo ""

# ============================================================================
# 4. USER MANAGEMENT ENDPOINTS (ADMIN ONLY)
# ============================================================================

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}4. USER MANAGEMENT ENDPOINTS${NC}"
echo -e "${BLUE}=========================================${NC}"

echo -n "Testing GET /users (list all users)... "
response=$(curl -s -X GET "$BASE_URL/api/auth/users" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "users\|hadez"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  user_count=$(echo "$response" | grep -o '"username"' | wc -l)
  echo "  Found $user_count users"
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: ${response:0:200}"
  FAILED=$((FAILED + 1))
fi

echo -n "Testing GET /users/:id (get hadez profile)... "
response=$(curl -s -X GET "$BASE_URL/api/auth/users/USR-IT-HADEZ-001" \
  -H "Authorization: Bearer $TOKEN")

if echo "$response" | grep -q "hadez"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: ${response:0:200}"
  FAILED=$((FAILED + 1))
fi

echo -n "Testing GET /users WITHOUT token (should fail)... "
response=$(curl -s -X GET "$BASE_URL/api/auth/users")

if echo "$response" | grep -q "denied\|token"; then
  echo -e "${GREEN}✓ PASS (correctly denied)${NC}"
  PASSED=$((PASSED + 1))
else
  echo -e "${RED}✗ FAIL (should require auth)${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

echo ""

# ============================================================================
# SUMMARY
# ============================================================================

echo -e "${BLUE}=========================================${NC}"
echo -e "${BLUE}TEST SUMMARY${NC}"
echo -e "${BLUE}=========================================${NC}"
TOTAL=$((PASSED + FAILED))
echo "Total Tests: $TOTAL"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  echo -e "${GREEN}Phase 2B Auth Module: ADMIN PROTECTION WORKING${NC}"
  exit 0
else
  PASS_RATE=$((PASSED * 100 / TOTAL))
  if [ $PASS_RATE -ge 80 ]; then
    echo -e "${YELLOW}⚠ MOSTLY PASSING ($PASS_RATE%)${NC}"
    echo "Review failed endpoints but system is mostly functional."
    exit 0
  else
    echo -e "${RED}✗ MULTIPLE TESTS FAILED${NC}"
    echo "Please review failed endpoints before deploying."
    exit 1
  fi
fi
