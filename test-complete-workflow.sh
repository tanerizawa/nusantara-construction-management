#!/bin/bash

# ===================================================================
# Complete RAB Quantity Tracking Test Workflow
# ===================================================================
# This script tests the entire workflow:
# 1. Setup sample data
# 2. Initialize database view
# 3. Test view queries
# 4. Create NEW test PO via API
# 5. Verify tracking updates
# ===================================================================

set -e  # Exit on error

BACKEND_URL="http://localhost:5000"
PROJECT_ID="2025PJK001"
COLOR_RESET="\033[0m"
COLOR_GREEN="\033[32m"
COLOR_YELLOW="\033[33m"
COLOR_BLUE="\033[34m"
COLOR_RED="\033[31m"

echo -e "${COLOR_BLUE}╔══════════════════════════════════════════════════════════════╗${COLOR_RESET}"
echo -e "${COLOR_BLUE}║       RAB QUANTITY TRACKING - COMPLETE TEST WORKFLOW        ║${COLOR_RESET}"
echo -e "${COLOR_BLUE}╚══════════════════════════════════════════════════════════════╝${COLOR_RESET}"
echo ""

# ===================================================================
# STEP 1: Restart Backend
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 1] Restarting Backend Container...${COLOR_RESET}"
docker-compose restart backend
sleep 5
echo -e "${COLOR_GREEN}✓ Backend restarted${COLOR_RESET}"
echo ""

# ===================================================================
# STEP 2: Load Sample Data
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 2] Loading Sample Data...${COLOR_RESET}"
docker exec -i nusantara-postgres psql -U admin -d nusantara_construction << 'EOF'
-- Clear existing test data
DELETE FROM rab_purchase_tracking WHERE "projectId" = '2025PJK001';
DELETE FROM purchase_orders WHERE project_id = '2025PJK001';
DELETE FROM project_rab WHERE "projectId" = '2025PJK001';

\i /sample-data-rab-tracking.sql
EOF

if [ $? -eq 0 ]; then
  echo -e "${COLOR_GREEN}✓ Sample data loaded${COLOR_RESET}"
else
  echo -e "${COLOR_RED}✗ Failed to load sample data${COLOR_RESET}"
  exit 1
fi
echo ""

# ===================================================================
# STEP 3: Initialize Database View
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 3] Initializing Database View...${COLOR_RESET}"
INIT_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/rab-view/init" \
  -H "Content-Type: application/json")

echo "$INIT_RESPONSE" | jq '.' 2>/dev/null || echo "$INIT_RESPONSE"

if echo "$INIT_RESPONSE" | grep -q "success.*true"; then
  echo -e "${COLOR_GREEN}✓ Database view initialized${COLOR_RESET}"
else
  echo -e "${COLOR_RED}✗ Failed to initialize view${COLOR_RESET}"
  exit 1
fi
echo ""

# ===================================================================
# STEP 4: Query Initial State (Before New PO)
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 4] Querying Initial State...${COLOR_RESET}"
echo -e "${COLOR_BLUE}Expected Results:${COLOR_RESET}"
echo "  - Semen: 0 available (1000/1000 purchased)"
echo "  - Pasir: 200 available (300/500 purchased)"
echo "  - Besi: 5000 available (0/5000 purchased)"
echo "  - Urugan: 1200 available (800/2000 purchased)"
echo ""

INITIAL_STATE=$(curl -s "${BACKEND_URL}/api/rab-view/projects/${PROJECT_ID}/items")
echo "$INITIAL_STATE" | jq '.data[] | {
  description,
  original_quantity,
  total_purchased,
  available_quantity,
  purchase_progress_percent
}' 2>/dev/null

if [ $? -eq 0 ]; then
  echo -e "${COLOR_GREEN}✓ Initial state retrieved${COLOR_RESET}"
else
  echo -e "${COLOR_RED}✗ Failed to get initial state${COLOR_RESET}"
  exit 1
fi
echo ""

# ===================================================================
# STEP 5: Create New Test PO (Partial Purchase of Besi)
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 5] Creating New Test PO...${COLOR_RESET}"
echo -e "${COLOR_BLUE}Test Case: Purchase 2000 Kg Besi from 5000 Kg available${COLOR_RESET}"
echo ""

# Generate unique PO number
TIMESTAMP=$(date +%Y%m%d%H%M%S)
PO_NUMBER="PO-TEST-${TIMESTAMP}"

PO_PAYLOAD=$(cat <<EOF
{
  "poNumber": "${PO_NUMBER}",
  "projectId": "${PROJECT_ID}",
  "supplierId": "SUP-BESI-WIJAYA",
  "supplierName": "PT Besi Wijaya",
  "orderDate": "$(date +%Y-%m-%d)",
  "expectedDeliveryDate": "$(date -d '+5 days' +%Y-%m-%d)",
  "status": "draft",
  "items": [
    {
      "inventoryId": "rab-item-besi-001",
      "itemName": "Besi Beton D16",
      "quantity": 2000,
      "unitPrice": 15000,
      "totalPrice": 30000000,
      "description": "Besi Beton D16 (Kg)"
    }
  ],
  "subtotal": 30000000,
  "taxAmount": 0,
  "totalAmount": 30000000,
  "notes": "Test PO - Partial purchase of Besi"
}
EOF
)

echo -e "${COLOR_BLUE}PO Payload:${COLOR_RESET}"
echo "$PO_PAYLOAD" | jq '.'
echo ""

CREATE_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/purchase-orders" \
  -H "Content-Type: application/json" \
  -d "$PO_PAYLOAD")

echo -e "${COLOR_BLUE}Create Response:${COLOR_RESET}"
echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
echo ""

if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
  echo -e "${COLOR_GREEN}✓ PO created successfully${COLOR_RESET}"
  PO_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
  echo -e "  PO ID: ${PO_ID}"
else
  echo -e "${COLOR_RED}✗ Failed to create PO${COLOR_RESET}"
  exit 1
fi
echo ""

# ===================================================================
# STEP 6: Check Backend Logs for Debug Output
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 6] Checking Backend Logs...${COLOR_RESET}"
echo -e "${COLOR_BLUE}Looking for DEBUG markers (🔵, 🟢, ❌)...${COLOR_RESET}"
echo ""

docker logs nusantara-backend --tail 50 | grep -E "DEBUG|🔵|🟢|❌|bulkCreate|rab_purchase_tracking" || echo "No debug output found"
echo ""

# ===================================================================
# STEP 7: Query Updated State (After New PO)
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 7] Querying Updated State...${COLOR_RESET}"
echo -e "${COLOR_BLUE}Expected: Besi should now show 3000 available (2000/5000 purchased)${COLOR_RESET}"
echo ""

sleep 2  # Wait for DB update

UPDATED_STATE=$(curl -s "${BACKEND_URL}/api/rab-view/projects/${PROJECT_ID}/items")
echo "$UPDATED_STATE" | jq '.data[] | {
  description,
  original_quantity,
  total_purchased,
  available_quantity,
  purchase_progress_percent
}' 2>/dev/null

if [ $? -eq 0 ]; then
  echo -e "${COLOR_GREEN}✓ Updated state retrieved${COLOR_RESET}"
else
  echo -e "${COLOR_RED}✗ Failed to get updated state${COLOR_RESET}"
  exit 1
fi
echo ""

# ===================================================================
# STEP 8: Direct Database Verification
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 8] Direct Database Verification...${COLOR_RESET}"
echo ""

echo -e "${COLOR_BLUE}A. Check tracking records:${COLOR_RESET}"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT \"rabItemId\", \"poNumber\", quantity, status 
   FROM rab_purchase_tracking 
   WHERE \"projectId\" = '${PROJECT_ID}' 
   ORDER BY \"createdAt\";"
echo ""

echo -e "${COLOR_BLUE}B. Check view data for Besi:${COLOR_RESET}"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT description, original_quantity, total_purchased, available_quantity, purchase_progress_percent 
   FROM rab_items_availability 
   WHERE \"projectId\" = '${PROJECT_ID}' AND description LIKE '%Besi%';"
echo ""

echo -e "${COLOR_BLUE}C. Count total tracking records:${COLOR_RESET}"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT COUNT(*) as total_records FROM rab_purchase_tracking WHERE \"projectId\" = '${PROJECT_ID}';"
echo ""

# ===================================================================
# STEP 9: Compare Old vs New Endpoint
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 9] Comparing Old vs New Endpoint...${COLOR_RESET}"
echo ""

echo -e "${COLOR_BLUE}A. Old Endpoint (/api/rab/${PROJECT_ID}):${COLOR_RESET}"
OLD_RESPONSE=$(curl -s "${BACKEND_URL}/api/rab/${PROJECT_ID}")
echo "$OLD_RESPONSE" | jq '.data[] | select(.description | contains("Besi")) | {
  description,
  quantity,
  totalPurchased: .totalPurchased // 0,
  availableQty: (.quantity - (.totalPurchased // 0))
}' 2>/dev/null || echo "Failed to parse"
echo ""

echo -e "${COLOR_BLUE}B. New Endpoint (/api/rab-view/projects/${PROJECT_ID}/items):${COLOR_RESET}"
NEW_RESPONSE=$(curl -s "${BACKEND_URL}/api/rab-view/projects/${PROJECT_ID}/items")
echo "$NEW_RESPONSE" | jq '.data[] | select(.description | contains("Besi")) | {
  description,
  original_quantity,
  total_purchased,
  available_quantity
}' 2>/dev/null || echo "Failed to parse"
echo ""

# ===================================================================
# STEP 10: Summary and Diagnosis
# ===================================================================
echo -e "${COLOR_BLUE}╔══════════════════════════════════════════════════════════════╗${COLOR_RESET}"
echo -e "${COLOR_BLUE}║                        TEST SUMMARY                          ║${COLOR_RESET}"
echo -e "${COLOR_BLUE}╚══════════════════════════════════════════════════════════════╝${COLOR_RESET}"
echo ""

BESI_PURCHASED=$(echo "$NEW_RESPONSE" | jq -r '.data[] | select(.description | contains("Besi")) | .total_purchased' 2>/dev/null)
BESI_AVAILABLE=$(echo "$NEW_RESPONSE" | jq -r '.data[] | select(.description | contains("Besi")) | .available_quantity' 2>/dev/null)

echo "Test PO Number: ${PO_NUMBER}"
echo "Test PO ID: ${PO_ID}"
echo ""
echo "Besi Beton Status:"
echo "  - Total Purchased: ${BESI_PURCHASED} Kg"
echo "  - Available: ${BESI_AVAILABLE} Kg"
echo ""

if [ "$BESI_PURCHASED" == "2000" ] && [ "$BESI_AVAILABLE" == "3000" ]; then
  echo -e "${COLOR_GREEN}✓✓✓ SUCCESS! Tracking is working correctly! ✓✓✓${COLOR_RESET}"
  echo ""
  echo "Next Steps:"
  echo "  1. Update frontend to use new endpoint: /api/rab-view/projects/:id/items"
  echo "  2. Remove manual calculation logic from useRABItems.js"
  echo "  3. Test in production environment"
elif [ "$BESI_PURCHASED" == "0" ]; then
  echo -e "${COLOR_RED}✗✗✗ FAILED: Tracking record NOT created! ✗✗✗${COLOR_RESET}"
  echo ""
  echo "Diagnosis Required:"
  echo "  1. Check backend logs above for DEBUG markers"
  echo "  2. Verify RABPurchaseTracking model imported correctly"
  echo "  3. Check if transaction committed successfully"
  echo "  4. Verify bulkCreate code path executed"
  echo ""
  echo "Manual Debug Commands:"
  echo "  docker logs nusantara-backend --tail 100 | grep -i debug"
  echo "  docker logs nusantara-backend --tail 100 | grep -i tracking"
  echo "  docker logs nusantara-backend --tail 100 | grep -i bulkcreate"
else
  echo -e "${COLOR_YELLOW}⚠ PARTIAL: Unexpected values${COLOR_RESET}"
  echo "  Expected: 2000 purchased, 3000 available"
  echo "  Got: ${BESI_PURCHASED} purchased, ${BESI_AVAILABLE} available"
fi
echo ""

# ===================================================================
# Additional Debug Info
# ===================================================================
echo -e "${COLOR_BLUE}Additional Debug Information:${COLOR_RESET}"
echo ""
echo "To manually test frontend update:"
echo "  1. Update useRABItems.js to fetch from: ${BACKEND_URL}/api/rab-view/projects/{projectId}/items"
echo "  2. Change 'availableQty' to 'available_quantity' in response"
echo "  3. Remove manual calculation: totalQty - totalPurchased"
echo ""
echo "To view all tracking records:"
echo "  docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \\"
echo "    \"SELECT * FROM rab_purchase_tracking WHERE \\\"projectId\\\" = '${PROJECT_ID}';\""
echo ""
echo "To view all RAB items with availability:"
echo "  docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \\"
echo "    \"SELECT * FROM rab_items_availability WHERE \\\"projectId\\\" = '${PROJECT_ID}';\""
echo ""
