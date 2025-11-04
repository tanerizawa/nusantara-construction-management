#!/bin/bash

# Phase 3 Cash Flow Endpoint Test Script
# Tests the real cash flow reporting with date filters and project filters

echo "======================================"
echo "Phase 3: Cash Flow Endpoint Tests"
echo "======================================"
echo ""

BASE_URL="http://localhost:5000/api/reports"
USERNAME="admin"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Testing cash flow endpoint..."
echo ""

# Test 1: Basic cash flow query (last year)
echo "Test 1: Get cash flow for last year"
echo "GET $BASE_URL/cash-flow"
RESPONSE=$(curl -s -X GET "$BASE_URL/cash-flow" \
  -H "x-user-id: $USERNAME" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Success${NC}"
  echo "Summary:"
  echo "$RESPONSE" | jq '.data.summary'
  echo ""
else
  echo -e "${RED}✗ Failed${NC}"
  echo "$RESPONSE" | jq '.'
  echo ""
fi

# Test 2: Cash flow with date range
echo "Test 2: Get cash flow for specific date range (2024)"
echo "GET $BASE_URL/cash-flow?start_date=2024-01-01&end_date=2024-12-31"
RESPONSE=$(curl -s -X GET "$BASE_URL/cash-flow?start_date=2024-01-01&end_date=2024-12-31" \
  -H "x-user-id: $USERNAME" \
  -H "Content-Type: application/json")

if echo "$RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Success${NC}"
  echo "Period:"
  echo "$RESPONSE" | jq '.data.period'
  echo "Operating Activities Total: $(echo "$RESPONSE" | jq '.data.operatingActivities.total')"
  echo "Investing Activities Total: $(echo "$RESPONSE" | jq '.data.investingActivities.total')"
  echo "Financing Activities Total: $(echo "$RESPONSE" | jq '.data.financingActivities.total')"
  echo "Net Cash Flow: $(echo "$RESPONSE" | jq '.data.summary.netCashFlow')"
  echo ""
else
  echo -e "${RED}✗ Failed${NC}"
  echo "$RESPONSE" | jq '.'
  echo ""
fi

# Test 3: Check if there are any finance transactions
echo "Test 3: Check finance_transactions count"
echo "Querying database for completed transactions..."

# Get count from database
TRANSACTION_COUNT=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c "SELECT COUNT(*) FROM finance_transactions WHERE status = 'completed';" 2>/dev/null | tr -d ' ')

if [ -z "$TRANSACTION_COUNT" ]; then
  echo -e "${YELLOW}⚠ Could not query database directly${NC}"
else
  echo "Completed transactions in database: $TRANSACTION_COUNT"
  
  if [ "$TRANSACTION_COUNT" -gt 0 ]; then
    echo -e "${GREEN}✓ Found $TRANSACTION_COUNT completed transactions${NC}"
    
    # Get sample transaction details
    echo ""
    echo "Sample transactions:"
    docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
      SELECT 
        id,
        type,
        category,
        amount,
        date,
        description
      FROM finance_transactions 
      WHERE status = 'completed'
      ORDER BY date DESC
      LIMIT 5;
    " 2>/dev/null
  else
    echo -e "${YELLOW}⚠ No completed transactions found${NC}"
    echo ""
    echo "To create test transactions:"
    echo "1. Approve a milestone cost via API"
    echo "2. Execute payment using: POST /costs/:id/execute-payment"
    echo ""
  fi
fi

echo ""
echo "======================================"
echo "Tests Complete"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. If no transactions: Create test data via Phase 2 payment execution"
echo "2. View in UI: https://nusantaragroup.co/finance"
echo "3. Check detailed report in 'Laporan Arus Kas' card"
echo ""
