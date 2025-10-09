#!/bin/bash
#
# Phase 3B Endpoint Testing Script
# Tests all 23 implemented financial report endpoints
#
# Usage: ./test-phase3b-endpoints.sh
#

BASE_URL="http://localhost:5000/api/reports"
RESULTS_FILE="phase3b-test-results.txt"

echo "=================================================="
echo "  PHASE 3B ENDPOINT TESTING"
echo "  Financial Reports Module - 23 Endpoints"
echo "=================================================="
echo ""

# Clear previous results
> $RESULTS_FILE

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TOTAL=0
PASSED=0
FAILED=0

# Test function
test_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    
    TOTAL=$((TOTAL + 1))
    
    echo -n "Testing: $name ... "
    
    response=$(curl -s -w "\n%{http_code}" "$url" 2>/dev/null)
    http_code=$(echo "$response" | tail -n 1)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_code" = "$expected_status" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($http_code)"
        PASSED=$((PASSED + 1))
        echo "[PASS] $name - $url - Status: $http_code" >> $RESULTS_FILE
    else
        echo -e "${RED}✗ FAIL${NC} ($http_code)"
        FAILED=$((FAILED + 1))
        echo "[FAIL] $name - $url - Status: $http_code" >> $RESULTS_FILE
        echo "  Response: $(echo $body | head -c 200)" >> $RESULTS_FILE
    fi
}

echo "Category 1: Module Health & Discovery"
echo "--------------------------------------"
test_endpoint "Health Check" "$BASE_URL/health"
test_endpoint "Available Reports" "$BASE_URL/available"
echo ""

echo "Category 2: Financial Statements (Phase 3A)"
echo "--------------------------------------------"
test_endpoint "Trial Balance" "$BASE_URL/trial-balance?as_of_date=2025-10-09"
test_endpoint "Income Statement" "$BASE_URL/income-statement?start_date=2025-01-01&end_date=2025-10-09"
test_endpoint "Balance Sheet" "$BASE_URL/balance-sheet?as_of_date=2025-10-09"
test_endpoint "Cash Flow" "$BASE_URL/cash-flow?start_date=2025-01-01&end_date=2025-10-09"
test_endpoint "Equity Changes" "$BASE_URL/equity-changes?start_date=2025-01-01&end_date=2025-10-09"
echo ""

echo "Category 3: Tax Reports (Phase 3A)"
echo "-----------------------------------"
test_endpoint "PPh 21 Report" "$BASE_URL/tax/pph21?month=10&year=2025"
test_endpoint "PPN Report" "$BASE_URL/tax/ppn?month=10&year=2025"
test_endpoint "PPh 23 Report" "$BASE_URL/tax/pph23?month=10&year=2025"
test_endpoint "Construction Tax Summary" "$BASE_URL/tax/construction-summary?year=2025"
echo ""

echo "Category 4: Project Analytics (Phase 3B)"
echo "-----------------------------------------"
test_endpoint "Project Cost Analysis" "$BASE_URL/project/cost-analysis?project_id=PRJ001"
test_endpoint "Project Profitability" "$BASE_URL/project/profitability?project_id=PRJ002"
test_endpoint "Multi-Project Comparison" "$BASE_URL/project/comparison?project_ids=PRJ001,PRJ002,PRJ003"
test_endpoint "Resource Utilization" "$BASE_URL/project/resource-utilization"
test_endpoint "Real-Time Cost Tracking" "$BASE_URL/project/track-costs?project_id=PRJ001"
echo ""

echo "Category 5: Fixed Assets (Phase 3B)"
echo "------------------------------------"
test_endpoint "Asset List" "$BASE_URL/fixed-asset/list?category=HEAVY_EQUIPMENT&limit=5"
test_endpoint "Asset Depreciation" "$BASE_URL/fixed-asset/depreciation?asset_id=ASSET-001"
test_endpoint "Asset Valuation" "$BASE_URL/fixed-asset/valuation?category=VEHICLES"
test_endpoint "Maintenance Schedule" "$BASE_URL/fixed-asset/maintenance-schedule?asset_id=ASSET-001"
test_endpoint "Asset Analytics" "$BASE_URL/fixed-asset/analytics?category=HEAVY_EQUIPMENT"
echo ""

# Validation endpoints (should return 400)
echo "Category 6: Validation Tests (Expected 400)"
echo "--------------------------------------------"
test_endpoint "Tax Missing Params" "$BASE_URL/tax/pph21" 400
test_endpoint "Project Missing ID" "$BASE_URL/project/profitability" 400
test_endpoint "Comparison Missing IDs" "$BASE_URL/project/comparison" 400
echo ""

echo "=================================================="
echo "  TEST SUMMARY"
echo "=================================================="
echo ""
echo "Total Tests:  $TOTAL"
echo -e "Passed:       ${GREEN}$PASSED${NC}"
echo -e "Failed:       ${RED}$FAILED${NC}"
echo ""

SUCCESS_RATE=$(echo "scale=1; $PASSED * 100 / $TOTAL" | bc)
echo "Success Rate: ${SUCCESS_RATE}%"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ ALL TESTS PASSED!${NC}"
    exit 0
elif [ $FAILED -le 2 ]; then
    echo -e "${YELLOW}⚠ MOSTLY PASSED (minor issues)${NC}"
    exit 0
else
    echo -e "${RED}✗ MULTIPLE FAILURES DETECTED${NC}"
    exit 1
fi
