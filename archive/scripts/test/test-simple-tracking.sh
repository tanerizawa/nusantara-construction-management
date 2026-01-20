#!/bin/bash

# ===================================================================
# Simple RAB Tracking Test - Using Existing Data or Create Minimal
# ===================================================================

set -e

BACKEND_URL="http://localhost:5000"
COLOR_RESET="\033[0m"
COLOR_GREEN="\033[32m"
COLOR_YELLOW="\033[33m"
COLOR_BLUE="\033[34m"
COLOR_RED="\033[31m"

echo -e "${COLOR_BLUE}╔══════════════════════════════════════════════════════════════╗${COLOR_RESET}"
echo -e "${COLOR_BLUE}║         SIMPLE RAB TRACKING TEST - REAL DATA               ║${COLOR_RESET}"
echo -e "${COLOR_BLUE}╚══════════════════════════════════════════════════════════════╝${COLOR_RESET}"
echo ""

# ===================================================================
# STEP 1: Initialize Database View
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 1] Initializing Database View...${COLOR_RESET}"
INIT_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/rab-view/init" \
  -H "Content-Type: application/json")

echo "$INIT_RESPONSE" | jq '.' 2>/dev/null || echo "$INIT_RESPONSE"

if echo "$INIT_RESPONSE" | grep -q "success.*true"; then
  echo -e "${COLOR_GREEN}✓ Database view initialized${COLOR_RESET}"
else
  echo -e "${COLOR_YELLOW}⚠ View might already exist (continuing...)${COLOR_RESET}"
fi
echo ""

# ===================================================================
# STEP 2: Find Existing Project with RAB Items
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 2] Looking for existing projects with RAB...${COLOR_RESET}"

PROJECTS=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT DISTINCT r.\"projectId\", COUNT(*) as item_count 
   FROM project_rab r 
   GROUP BY r.\"projectId\" 
   LIMIT 1;")

if [ -z "$PROJECTS" ] || [ "$PROJECTS" == "" ]; then
  echo -e "${COLOR_RED}✗ No projects with RAB found${COLOR_RESET}"
  echo -e "${COLOR_YELLOW}Creating test project and RAB items...${COLOR_RESET}"
  
  # Create test project
  PROJECT_ID=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
    "INSERT INTO projects (
      id, name, description, location, status, 
      \"startDate\", \"endDate\", \"createdAt\", \"updatedAt\"
    ) VALUES (
      'TEST-PROJECT-001',
      'Test Construction Project',
      'For RAB tracking testing',
      'Test Site',
      'approved',
      NOW(),
      NOW() + INTERVAL '6 months',
      NOW(),
      NOW()
    ) RETURNING id;" | xargs)
  
  echo "Created project: $PROJECT_ID"
  
  # Create RAB items
  RAB_ID_1=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
    "INSERT INTO project_rab (
      id, \"projectId\", category, description, unit, quantity, 
      \"unitPrice\", \"totalPrice\", status, \"isApproved\", \"createdAt\", \"updatedAt\"
    ) VALUES (
      gen_random_uuid(),
      'TEST-PROJECT-001',
      'Material',
      'Semen Portland Type I',
      'Sak',
      1000,
      75000,
      75000000,
      'approved',
      true,
      NOW(),
      NOW()
    ) RETURNING id;" | xargs)
  
  RAB_ID_2=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
    "INSERT INTO project_rab (
      id, \"projectId\", category, description, unit, quantity, 
      \"unitPrice\", \"totalPrice\", status, \"isApproved\", \"createdAt\", \"updatedAt\"
    ) VALUES (
      gen_random_uuid(),
      'TEST-PROJECT-001',
      'Material',
      'Pasir Beton',
      'M3',
      500,
      250000,
      125000000,
      'approved',
      true,
      NOW(),
      NOW()
    ) RETURNING id;" | xargs)
  
  echo "Created RAB items: $RAB_ID_1, $RAB_ID_2"
else
  PROJECT_ID=$(echo "$PROJECTS" | awk '{print $1}' | xargs)
  ITEM_COUNT=$(echo "$PROJECTS" | awk '{print $3}' | xargs)
  echo -e "${COLOR_GREEN}✓ Found project: ${PROJECT_ID} with ${ITEM_COUNT} RAB items${COLOR_RESET}"
fi
echo ""

# ===================================================================
# STEP 3: Query Initial RAB State
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 3] Querying Initial RAB State...${COLOR_RESET}"

echo -e "${COLOR_BLUE}RAB Items for project ${PROJECT_ID}:${COLOR_RESET}"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT id, description, unit, quantity 
   FROM project_rab 
   WHERE \"projectId\" = '${PROJECT_ID}' 
   ORDER BY description 
   LIMIT 5;"
echo ""

# Get first RAB item for testing
RAB_ITEM=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT id, description, unit, quantity, \"unitPrice\" 
   FROM project_rab 
   WHERE \"projectId\" = '${PROJECT_ID}' 
   ORDER BY description 
   LIMIT 1;")

RAB_ID=$(echo "$RAB_ITEM" | awk -F'|' '{print $1}' | xargs)
RAB_DESC=$(echo "$RAB_ITEM" | awk -F'|' '{print $2}' | xargs)
RAB_UNIT=$(echo "$RAB_ITEM" | awk -F'|' '{print $3}' | xargs)
RAB_QTY=$(echo "$RAB_ITEM" | awk -F'|' '{print $4}' | xargs)
RAB_PRICE=$(echo "$RAB_ITEM" | awk -F'|' '{print $5}' | xargs)

echo -e "${COLOR_BLUE}Selected for testing:${COLOR_RESET}"
echo "  ID: $RAB_ID"
echo "  Description: $RAB_DESC"
echo "  Quantity: $RAB_QTY $RAB_UNIT"
echo "  Unit Price: Rp $RAB_PRICE"
echo ""

# Calculate test quantity (50% of available)
TEST_QTY=$(echo "$RAB_QTY / 2" | bc)
TEST_TOTAL=$(echo "$TEST_QTY * $RAB_PRICE" | bc)

echo -e "${COLOR_BLUE}Will create PO for: ${TEST_QTY} ${RAB_UNIT} (50% of ${RAB_QTY})${COLOR_RESET}"
echo ""

# ===================================================================
# STEP 4: Check Existing Tracking
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 4] Checking Existing Tracking Records...${COLOR_RESET}"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT \"rabItemId\", \"poNumber\", quantity, status 
   FROM rab_purchase_tracking 
   WHERE \"rabItemId\" = '${RAB_ID}';"
echo ""

# ===================================================================
# STEP 5: Create PO via API
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 5] Creating Purchase Order via API...${COLOR_RESET}"

TIMESTAMP=$(date +%Y%m%d%H%M%S)
PO_NUMBER="PO-TEST-${TIMESTAMP}"

PO_PAYLOAD=$(cat <<EOF
{
  "poNumber": "${PO_NUMBER}",
  "projectId": "${PROJECT_ID}",
  "supplierId": "SUP-TEST-001",
  "supplierName": "PT Test Supplier",
  "orderDate": "$(date +%Y-%m-%d)",
  "expectedDeliveryDate": "$(date -d '+7 days' +%Y-%m-%d)",
  "status": "draft",
  "items": [
    {
      "inventoryId": "${RAB_ID}",
      "itemName": "${RAB_DESC}",
      "quantity": ${TEST_QTY},
      "unitPrice": ${RAB_PRICE},
      "totalPrice": ${TEST_TOTAL},
      "description": "${RAB_DESC} (${RAB_UNIT})"
    }
  ],
  "subtotal": ${TEST_TOTAL},
  "taxAmount": 0,
  "totalAmount": ${TEST_TOTAL},
  "notes": "Test PO - Automated test"
}
EOF
)

echo -e "${COLOR_BLUE}PO Payload:${COLOR_RESET}"
echo "$PO_PAYLOAD" | jq '.'
echo ""

echo -e "${COLOR_BLUE}Sending request...${COLOR_RESET}"
CREATE_RESPONSE=$(curl -s -X POST "${BACKEND_URL}/api/purchase-orders" \
  -H "Content-Type: application/json" \
  -d "$PO_PAYLOAD")

echo -e "${COLOR_BLUE}Response:${COLOR_RESET}"
echo "$CREATE_RESPONSE" | jq '.' 2>/dev/null || echo "$CREATE_RESPONSE"
echo ""

if echo "$CREATE_RESPONSE" | grep -q '"id"'; then
  PO_ID=$(echo "$CREATE_RESPONSE" | jq -r '.id')
  echo -e "${COLOR_GREEN}✓ PO created successfully: ${PO_ID}${COLOR_RESET}"
else
  echo -e "${COLOR_RED}✗ Failed to create PO${COLOR_RESET}"
  exit 1
fi
echo ""

# ===================================================================
# STEP 6: Check Backend Logs
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 6] Checking Backend Debug Logs...${COLOR_RESET}"
echo -e "${COLOR_BLUE}Looking for DEBUG markers...${COLOR_RESET}"
echo ""

docker logs nusantara-backend --tail 100 | grep -E "DEBUG|🔵|🟢|❌|bulkCreate|tracking" | tail -20 || echo "No debug logs found"
echo ""

# ===================================================================
# STEP 7: Verify Tracking Record Created
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 7] Verifying Tracking Record...${COLOR_RESET}"
sleep 2

echo -e "${COLOR_BLUE}Tracking records for RAB item ${RAB_ID}:${COLOR_RESET}"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  "SELECT \"rabItemId\", \"poNumber\", quantity, status, \"createdAt\" 
   FROM rab_purchase_tracking 
   WHERE \"rabItemId\" = '${RAB_ID}' 
   ORDER BY \"createdAt\" DESC;"
echo ""

TRACKING_COUNT=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT COUNT(*) 
   FROM rab_purchase_tracking 
   WHERE \"rabItemId\" = '${RAB_ID}' AND \"poNumber\" = '${PO_NUMBER}';")

TRACKING_COUNT=$(echo "$TRACKING_COUNT" | xargs)

# ===================================================================
# STEP 8: Query View Data
# ===================================================================
echo -e "${COLOR_YELLOW}[STEP 8] Querying Database View...${COLOR_RESET}"

VIEW_DATA=$(curl -s "${BACKEND_URL}/api/rab-view/projects/${PROJECT_ID}/items")
echo "$VIEW_DATA" | jq ".data[] | select(.id == \"${RAB_ID}\") | {
  description,
  original_quantity,
  total_purchased,
  available_quantity,
  purchase_progress_percent
}" 2>/dev/null

echo ""

# ===================================================================
# STEP 9: Final Verdict
# ===================================================================
echo -e "${COLOR_BLUE}╔══════════════════════════════════════════════════════════════╗${COLOR_RESET}"
echo -e "${COLOR_BLUE}║                         VERDICT                              ║${COLOR_RESET}"
echo -e "${COLOR_BLUE}╚══════════════════════════════════════════════════════════════╝${COLOR_RESET}"
echo ""

echo "Test Details:"
echo "  - Project ID: ${PROJECT_ID}"
echo "  - RAB Item: ${RAB_DESC}"
echo "  - Original Quantity: ${RAB_QTY} ${RAB_UNIT}"
echo "  - PO Number: ${PO_NUMBER}"
echo "  - Ordered Quantity: ${TEST_QTY} ${RAB_UNIT}"
echo "  - Tracking Records Found: ${TRACKING_COUNT}"
echo ""

if [ "$TRACKING_COUNT" -gt "0" ]; then
  echo -e "${COLOR_GREEN}✓✓✓ SUCCESS! Tracking record was created! ✓✓✓${COLOR_RESET}"
  echo ""
  echo "The fix is working! The tracking system is recording PO quantities."
  echo ""
  echo "Next steps:"
  echo "  1. Update frontend to use /api/rab-view endpoint"
  echo "  2. Test with actual production data"
  echo "  3. Monitor for edge cases"
else
  echo -e "${COLOR_RED}✗✗✗ FAILED! No tracking record created! ✗✗✗${COLOR_RESET}"
  echo ""
  echo "Diagnosis needed:"
  echo "  1. Check backend logs above for error messages"
  echo "  2. Verify RABPurchaseTracking model is loaded"
  echo "  3. Check if transaction is committing"
  echo "  4. Review bulkCreate execution path"
  echo ""
  echo "Manual check command:"
  echo "  docker logs nusantara-backend --tail 200 | grep -i tracking"
fi
echo ""
