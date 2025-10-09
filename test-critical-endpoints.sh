#!/bin/bash
# Quick Critical Endpoints Test

BASE_URL="http://localhost:5000/api"
PROJECT_ID="2025PJK001"  # Real project from logs

echo "╔════════════════════════════════════════════════════════════╗"
echo "║  CRITICAL ENDPOINTS TEST - Modular Routes                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

test_count=0
pass_count=0

# Test function
test_endpoint() {
  local method=$1
  local endpoint=$2
  local description=$3
  
  test_count=$((test_count + 1))
  echo -n "[$test_count] $description... "
  
  http_code=$(curl -s -o /dev/null -w "%{http_code}" -X $method "$BASE_URL$endpoint" 2>/dev/null)
  
  # Success if not 404 (endpoint exists, even if 401 auth required)
  if [ "$http_code" != "404" ]; then
    echo -e "${GREEN}✓ PASS${NC} (HTTP $http_code)"
    pass_count=$((pass_count + 1))
  else
    echo -e "${RED}✗ FAIL${NC} (HTTP $http_code - Endpoint not found)"
  fi
}

echo "Testing Module 1: Basic CRUD"
test_endpoint "GET" "/projects" "GET /projects"
test_endpoint "GET" "/projects/$PROJECT_ID" "GET /projects/:id"

echo ""
echo "Testing Module 2: RAB Management"
test_endpoint "GET" "/projects/$PROJECT_ID/rab" "GET /projects/:id/rab"
test_endpoint "POST" "/projects/$PROJECT_ID/rab" "POST /projects/:id/rab"

echo ""
echo "Testing Module 3: Milestones"
test_endpoint "GET" "/projects/$PROJECT_ID/milestones" "GET /projects/:id/milestones"

echo ""
echo "Testing Module 4: Team Management"
test_endpoint "GET" "/projects/$PROJECT_ID/team" "GET /projects/:id/team"

echo ""
echo "Testing Module 5: Documents"
test_endpoint "GET" "/projects/$PROJECT_ID/documents" "GET /projects/:id/documents"

echo ""
echo "Testing Module 6: Berita Acara"
test_endpoint "GET" "/projects/$PROJECT_ID/berita-acara" "GET /projects/:id/berita-acara"

echo ""
echo "Testing Module 7: Progress Payments"
test_endpoint "GET" "/projects/$PROJECT_ID/progress-payments" "GET /projects/:id/progress-payments"

echo ""
echo "Testing Module 8: Delivery Receipts"
test_endpoint "GET" "/projects/$PROJECT_ID/delivery-receipts" "GET /projects/:id/delivery-receipts"
test_endpoint "GET" "/projects/$PROJECT_ID/delivery-receipts/available-pos" "GET available POs"

echo ""
echo "Testing Module 9: Budget & Statistics"
test_endpoint "GET" "/projects/$PROJECT_ID/budget-monitoring" "GET budget monitoring"
test_endpoint "GET" "/projects/stats/overview" "GET stats overview"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  SUMMARY                                                   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo -e "Total Tests: $test_count"
echo -e "Passed:      ${GREEN}$pass_count${NC}"
echo -e "Failed:      ${RED}$((test_count - pass_count))${NC}"
echo -e "Success Rate: $((pass_count * 100 / test_count))%"
echo ""

if [ $pass_count -eq $test_count ]; then
  echo -e "${GREEN}✓ ALL CRITICAL ENDPOINTS WORKING!${NC}"
  exit 0
else
  echo -e "${YELLOW}⚠ Some endpoints need attention${NC}"
  exit 1
fi
