#!/bin/bash

# Create Test Milestone Cost for End-to-End Testing
# This will create a milestone cost, submit it, approve it, then execute payment

echo "======================================"
echo "Creating Test Milestone Cost"
echo "======================================"
echo ""

BASE_URL="http://localhost:5000/api/projects"
USERNAME="admin"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Use TEST project only - "uji coba" project
PROJECT_ID="2025BSR002"

echo "======================================"
echo "SAFE TEST MODE: Using 'uji coba' Project ONLY"
echo "======================================"
echo ""
echo "Project ID: $PROJECT_ID (uji coba)"
echo ""

# First, check if milestone exists, if not create one
echo "Checking for test milestone..."
MILESTONE_CHECK=$(curl -s "$BASE_URL/$PROJECT_ID/milestones" \
  -H "x-user-id: $USERNAME")

MILESTONE_ID=$(echo "$MILESTONE_CHECK" | jq -r '.data[0].id // empty')

if [ -z "$MILESTONE_ID" ]; then
  echo "Creating test milestone..."
  MILESTONE_CREATE=$(curl -s -X POST "$BASE_URL/$PROJECT_ID/milestones" \
    -H "Content-Type: application/json" \
    -H "x-user-id: $USERNAME" \
    -d '{
      "title": "Test Milestone - Cash Flow Testing",
      "description": "Milestone untuk testing cash flow report",
      "target_date": "2024-12-31",
      "budget": 10000000,
      "status": "in_progress"
    }')
  
  MILESTONE_ID=$(echo "$MILESTONE_CREATE" | jq -r '.data.id // .milestone.id // empty')
  
  if [ -z "$MILESTONE_ID" ]; then
    echo -e "${RED}✗ Failed to create milestone${NC}"
    echo "$MILESTONE_CREATE" | jq '.'
    exit 1
  fi
  
  echo -e "${GREEN}✓ Test milestone created${NC}"
fi

echo "Using Milestone ID: $MILESTONE_ID"
echo ""

# Step 1: Create milestone cost
echo "Step 1: Creating milestone cost..."
CREATE_RESPONSE=$(curl -s -X POST "$BASE_URL/$PROJECT_ID/milestones/$MILESTONE_ID/costs" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USERNAME" \
  -d '{
    "cost_category": "operational",
    "cost_type": "actual",
    "amount": 5000000,
    "description": "Test Payment - Material Beton untuk Makam",
    "reference_number": "TEST-COST-001"
  }')

if echo "$CREATE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  COST_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
  echo -e "${GREEN}✓ Milestone cost created${NC}"
  echo "Cost ID: $COST_ID"
  echo ""
else
  echo -e "${RED}✗ Failed to create milestone cost${NC}"
  echo "$CREATE_RESPONSE" | jq '.'
  exit 1
fi

# Step 2: Submit for approval
echo "Step 2: Submitting for approval..."
SUBMIT_RESPONSE=$(curl -s -X POST "$BASE_URL/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/submit" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USERNAME")

if echo "$SUBMIT_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Cost submitted${NC}"
  echo ""
else
  echo -e "${RED}✗ Failed to submit${NC}"
  echo "$SUBMIT_RESPONSE" | jq '.'
  exit 1
fi

# Step 3: Approve
echo "Step 3: Approving cost..."
APPROVE_RESPONSE=$(curl -s -X POST "$BASE_URL/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/approve" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USERNAME")

if echo "$APPROVE_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Cost approved${NC}"
  echo ""
else
  echo -e "${RED}✗ Failed to approve${NC}"
  echo "$APPROVE_RESPONSE" | jq '.'
  exit 1
fi

# Step 4: Execute payment
echo "Step 4: Executing payment..."
PAYMENT_RESPONSE=$(curl -s -X POST "$BASE_URL/$PROJECT_ID/milestones/$MILESTONE_ID/costs/$COST_ID/execute-payment" \
  -H "Content-Type: application/json" \
  -H "x-user-id: $USERNAME" \
  -d '{
    "paymentMethod": "bank_transfer",
    "referenceNumber": "TEST-PAY-001",
    "paymentDate": "2024-10-20",
    "notes": "Test payment for cash flow end-to-end testing"
  }')

if echo "$PAYMENT_RESPONSE" | jq -e '.success' > /dev/null 2>&1; then
  TRANSACTION_ID=$(echo "$PAYMENT_RESPONSE" | jq -r '.data.transactionId')
  echo -e "${GREEN}✓ Payment executed${NC}"
  echo "Transaction ID: $TRANSACTION_ID"
  echo ""
else
  echo -e "${RED}✗ Failed to execute payment${NC}"
  echo "$PAYMENT_RESPONSE" | jq '.'
  exit 1
fi

# Step 5: Verify transaction in database
echo "Step 5: Verifying transaction in database..."
echo ""
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  type,
  category,
  subcategory,
  amount,
  date,
  status,
  description
FROM finance_transactions 
WHERE id = '$TRANSACTION_ID';
"

echo ""
echo "======================================"
echo "Test Data Created Successfully!"
echo "======================================"
echo ""
echo "Summary:"
echo "- Cost ID: $COST_ID"
echo "- Transaction ID: $TRANSACTION_ID"
echo "- Amount: Rp 5,000,000"
echo "- Category: operational"
echo "- Date: 2024-10-20"
echo ""
echo "Next: Run cash flow test"
echo "  bash /root/APP-YK/test_phase3_cashflow.sh"
echo ""
