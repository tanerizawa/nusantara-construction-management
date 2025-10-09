#!/bin/bash
# Backend Modular Routes Testing Script
# Tests all 54 endpoints across 9 modules

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  BACKEND MODULAR ROUTES - INTEGRATION TEST                ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Configuration
BASE_URL="http://localhost:5000/api"
AUTH_TOKEN="your-jwt-token-here"  # Update with actual token
TEST_PROJECT_ID="test-project-id"  # Update with actual project ID

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Test function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  
  TOTAL_TESTS=$((TOTAL_TESTS + 1))
  
  echo -n "Testing $description... "
  
  # Make request (without auth for now)
  response=$(curl -s -w "\n%{http_code}" -X $method "$BASE_URL$endpoint" 2>/dev/null)
  http_code=$(echo "$response" | tail -n 1)
  
  # Check if endpoint exists (not 404)
  if [ "$http_code" != "404" ]; then
    echo -e "${GREEN}✓ OK${NC} (HTTP $http_code)"
    PASSED_TESTS=$((PASSED_TESTS + 1))
  else
    echo -e "${RED}✗ FAILED${NC} (HTTP $http_code - Not Found)"
    FAILED_TESTS=$((FAILED_TESTS + 1))
  fi
}

echo "═══════════════════════════════════════════════════════════"
echo "MODULE 1: BASIC CRUD (5 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects" "GET /projects - List projects"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID" "GET /projects/:id - Get project"
test_endpoint "POST" "/projects" "POST /projects - Create project"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID" "PUT /projects/:id - Update project"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID" "DELETE /projects/:id - Delete project"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 2: RAB MANAGEMENT (10 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/rab" "GET /rab - List RAB items"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/rab/test-rab-id" "GET /rab/:id - Get RAB item"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/rab" "POST /rab - Create RAB"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/rab/bulk" "POST /rab/bulk - Bulk create"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/rab/test-rab-id" "PUT /rab/:id - Update RAB"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/rab/test-rab-id/approve" "PUT /rab/:id/approve"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/rab/test-rab-id/reject" "PUT /rab/:id/reject"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/rab/approve-all" "POST /rab/approve-all"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/rab/test-rab-id" "DELETE /rab/:id"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/rab" "DELETE /rab - Bulk delete"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 3: MILESTONES (6 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/milestones" "GET /milestones - List"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/milestones/test-id" "GET /milestones/:id"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/milestones" "POST /milestones - Create"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/milestones/test-id" "PUT /milestones/:id"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/milestones/test-id/complete" "PUT /milestones/:id/complete"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/milestones/test-id" "DELETE /milestones/:id"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 4: TEAM MANAGEMENT (6 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/team" "GET /team - List"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/team/test-id" "GET /team/:id"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/team" "POST /team - Add member"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/team/test-id" "PUT /team/:id"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/team/test-id/deactivate" "PUT /team/:id/deactivate"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/team/test-id" "DELETE /team/:id"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 5: DOCUMENTS (6 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/documents" "GET /documents - List"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/documents/test-id" "GET /documents/:id"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/documents" "POST /documents - Upload"
test_endpoint "PUT" "/projects/$TEST_PROJECT_ID/documents/test-id" "PUT /documents/:id"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/documents/test-id/download" "GET /documents/:id/download"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/documents/test-id" "DELETE /documents/:id"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 6: BERITA ACARA (6 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/berita-acara" "GET /berita-acara - List"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/berita-acara/test-id" "GET /berita-acara/:id"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/berita-acara" "POST /berita-acara - Create"
test_endpoint "PATCH" "/projects/$TEST_PROJECT_ID/berita-acara/test-id" "PATCH /berita-acara/:id"
test_endpoint "PATCH" "/projects/$TEST_PROJECT_ID/berita-acara/test-id/approve" "PATCH /berita-acara/:id/approve"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/berita-acara/test-id" "DELETE /berita-acara/:id"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 7: PROGRESS PAYMENTS (5 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/progress-payments" "GET /progress-payments - List"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/progress-payments/test-id" "GET /progress-payments/:id"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/progress-payments" "POST /progress-payments - Create"
test_endpoint "PATCH" "/projects/$TEST_PROJECT_ID/progress-payments/test-id" "PATCH /progress-payments/:id"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/progress-payments/test-id" "DELETE /progress-payments/:id"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 8: DELIVERY RECEIPTS (8 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/delivery-receipts" "GET /delivery-receipts - List"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/delivery-receipts/available-pos" "GET /available-pos"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/delivery-receipts/test-id" "GET /delivery-receipts/:id"
test_endpoint "POST" "/projects/$TEST_PROJECT_ID/delivery-receipts" "POST /delivery-receipts - Create"
test_endpoint "PATCH" "/projects/$TEST_PROJECT_ID/delivery-receipts/test-id" "PATCH /delivery-receipts/:id"
test_endpoint "PATCH" "/projects/$TEST_PROJECT_ID/delivery-receipts/test-id/approve" "PATCH /approve"
test_endpoint "PATCH" "/projects/$TEST_PROJECT_ID/delivery-receipts/test-id/reject" "PATCH /reject"
test_endpoint "DELETE" "/projects/$TEST_PROJECT_ID/delivery-receipts/test-id" "DELETE /delivery-receipts/:id"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MODULE 9: BUDGET & STATISTICS (2 endpoints)"
echo "═══════════════════════════════════════════════════════════"
test_endpoint "GET" "/projects/$TEST_PROJECT_ID/budget-monitoring" "GET /budget-monitoring"
test_endpoint "GET" "/projects/stats/overview" "GET /stats/overview"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  TEST SUMMARY                                             ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "Total Tests:   $TOTAL_TESTS"
echo -e "Passed:        ${GREEN}$PASSED_TESTS${NC}"
echo -e "Failed:        ${RED}$FAILED_TESTS${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
  echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠ Some tests failed. Check endpoints above.${NC}"
  exit 1
fi
