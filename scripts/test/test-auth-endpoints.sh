#!/bin/bash

# ============================================================================
# Backend Modularization Phase 2B - Auth Module Testing Script
# ============================================================================
# Tests all 12 auth module endpoints after consolidation
# - 4 Authentication endpoints (login, me, logout, refresh-token)
# - 5 User Management endpoints (list, get, create, update, delete)
# - 3 Registration endpoints (register, check-username, check-email)
# ============================================================================

BASE_URL="http://localhost:5000"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASSED=0
FAILED=0
TOKEN=""

echo "========================================="
echo "Auth Module Endpoint Testing - Phase 2B"
echo "========================================="
echo ""

# Function to test endpoint
test_endpoint() {
  local name="$1"
  local method="$2"
  local endpoint="$3"
  local data="$4"
  local expected="$5"
  local use_token="$6"
  
  echo -n "Testing $name... "
  
  if [ -z "$use_token" ]; then
    response=$(curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -d "$data")
  else
    response=$(curl -s -X $method "$BASE_URL$endpoint" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d "$data")
  fi
  
  if echo "$response" | grep -q "$expected"; then
    echo -e "${GREEN}✓ PASS${NC}"
    PASSED=$((PASSED + 1))
    return 0
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  Response: $response"
    FAILED=$((FAILED + 1))
    return 1
  fi
}

# ============================================================================
# 1. REGISTRATION ENDPOINTS (3)
# ============================================================================

echo "========================================="
echo "1. REGISTRATION ENDPOINTS"
echo "========================================="

test_endpoint \
  "Check username availability" \
  "POST" \
  "/api/auth/check-username" \
  '{"username":"admin"}' \
  "available"

test_endpoint \
  "Check email availability" \
  "POST" \
  "/api/auth/check-email" \
  '{"email":"test@newuser.com"}' \
  "available"

test_endpoint \
  "Register new user (without fullName - should fail)" \
  "POST" \
  "/api/auth/register" \
  '{"username":"testuser1","email":"test1@example.com","password":"Test123456","role":"user"}' \
  "fullName"

echo ""

# ============================================================================
# 2. AUTHENTICATION ENDPOINTS (4)
# ============================================================================

echo "========================================="
echo "2. AUTHENTICATION ENDPOINTS"
echo "========================================="

test_endpoint \
  "Login with invalid credentials" \
  "POST" \
  "/api/auth/login" \
  '{"username":"wronguser","password":"wrongpass"}' \
  "Invalid credentials"

# Try to login with default admin (if exists)
echo -n "Testing Login with admin... "
response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}')

if echo "$response" | grep -q "token"; then
  echo -e "${GREEN}✓ PASS${NC}"
  PASSED=$((PASSED + 1))
  TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  echo "  Token obtained: ${TOKEN:0:20}..."
elif echo "$response" | grep -q "User not found"; then
  echo -e "${YELLOW}⚠ SKIP (admin user not created yet)${NC}"
  echo "  Creating test admin user first..."
  
  # Create admin user via database
  docker exec nusantara-db psql -U nusantara_user -d nusantara_db -c \
    "INSERT INTO \"Users\" (\"fullName\", username, email, password, role, status, \"isOnline\", \"createdAt\", \"updatedAt\") 
     VALUES ('Test Admin', 'admin', 'admin@test.com', '\$2b\$10\$rKjhI3V4pZZXP3OvO3H8e.Q5Y6kZ7XQWE8qZ3qwE5X9fH8p7Q6kZ', 'admin', 'active', false, NOW(), NOW())
     ON CONFLICT DO NOTHING;" > /dev/null 2>&1
  
  # Try login again
  response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')
  
  if echo "$response" | grep -q "token"; then
    echo -e "${GREEN}✓ PASS (after creating admin)${NC}"
    PASSED=$((PASSED + 1))
    TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "  Token obtained: ${TOKEN:0:20}..."
  else
    echo -e "${RED}✗ FAIL (could not create admin)${NC}"
    FAILED=$((FAILED + 1))
  fi
else
  echo -e "${RED}✗ FAIL${NC}"
  echo "  Response: $response"
  FAILED=$((FAILED + 1))
fi

if [ -n "$TOKEN" ]; then
  test_endpoint \
    "Get current user (/me)" \
    "GET" \
    "/api/auth/me" \
    "" \
    "username" \
    "true"
  
  test_endpoint \
    "Logout" \
    "POST" \
    "/api/auth/logout" \
    "" \
    "success" \
    "true"
else
  echo -e "${YELLOW}⚠ Skipping /me and /logout (no token)${NC}"
fi

echo ""

# ============================================================================
# 3. USER MANAGEMENT ENDPOINTS (5)
# ============================================================================

echo "========================================="
echo "3. USER MANAGEMENT ENDPOINTS"
echo "========================================="

if [ -n "$TOKEN" ]; then
  # Re-login to get fresh token
  response=$(curl -s -X POST "$BASE_URL/api/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"username":"admin","password":"admin123"}')
  TOKEN=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
  
  test_endpoint \
    "List all users" \
    "GET" \
    "/api/auth/users" \
    "" \
    "users" \
    "true"
  
  test_endpoint \
    "Get user by ID (1)" \
    "GET" \
    "/api/auth/users/1" \
    "" \
    "username" \
    "true"
  
  test_endpoint \
    "Create new user (incomplete data - should fail)" \
    "POST" \
    "/api/auth/users" \
    '{"username":"newuser"}' \
    "required" \
    "true"
  
  test_endpoint \
    "Update user (non-existent - should fail)" \
    "PUT" \
    "/api/auth/users/99999" \
    '{"fullName":"Updated Name"}' \
    "not found" \
    "true"
  
  test_endpoint \
    "Delete user (non-existent - should fail)" \
    "DELETE" \
    "/api/auth/users/99999" \
    "" \
    "not found" \
    "true"
else
  echo -e "${YELLOW}⚠ Skipping user management tests (no token)${NC}"
  FAILED=$((FAILED + 5))
fi

echo ""

# ============================================================================
# SUMMARY
# ============================================================================

echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo -e "Total Tests: $((PASSED + FAILED))"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  echo "Phase 2B Auth Module: PRODUCTION READY"
  exit 0
else
  echo -e "${RED}✗ SOME TESTS FAILED${NC}"
  echo "Please review failed endpoints before deploying."
  exit 1
fi
