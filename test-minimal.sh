#!/bin/bash

# ===================================================================
# MINIMAL TRACKING TEST - Just Initialize View & Check Current Data
# ===================================================================

BACKEND_URL="http://localhost:5000"

echo "=========================================="
echo " RAB Tracking Test - Minimal Version"
echo "=========================================="
echo ""

# Step 1: Initialize View
echo "[1] Initializing database view..."
curl -s -X POST "${BACKEND_URL}/api/rab-view/init" -H "Content-Type: application/json"
echo ""
echo ""

# Step 2: Check if there are any projects
echo "[2] Checking existing projects..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT id, name FROM projects LIMIT 5;"
echo ""

# Step 3: Check if there are any RAB items
echo "[3] Checking existing RAB items..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT \"projectId\", COUNT(*) FROM project_rab GROUP BY \"projectId\" LIMIT 5;"
echo ""

# Step 4: Check tracking table
echo "[4] Checking tracking records..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT COUNT(*) as total_tracking_records FROM rab_purchase_tracking;"
echo ""

# Step 5: Check if view exists
echo "[5] Checking if view exists..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT table_name FROM information_schema.views WHERE table_name = 'rab_items_availability';"
echo ""

# Step 6: Test backend logs for tracking code
echo "[6] Checking recent backend logs..."
docker logs nusantara-backend --tail 50 | grep -E "purchase-orders|DEBUG|tracking" | tail -10
echo ""

echo "=========================================="
echo " Test Analysis"
echo "=========================================="
echo ""
echo "Now you can:"
echo "1. Create a project via frontend"
echo "2. Add RAB items to that project"
echo "3. Create a PO for those RAB items"
echo "4. Check if tracking record is created"
echo ""
echo "Or use this curl command to test PO creation:"
echo ""
echo 'curl -X POST http://localhost:5000/api/purchase-orders \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '\''{'
echo '    "poNumber": "PO-TEST-'$(date +%Y%m%d%H%M%S)'",'
echo '    "projectId": "YOUR_PROJECT_ID",'
echo '    "supplierId": "SUP-001",'
echo '    "supplierName": "Test Supplier",'
echo '    "orderDate": "'$(date +%Y-%m-%d)'",'
echo '    "expectedDeliveryDate": "'$(date -d '+7 days' +%Y-%m-%d)'",'
echo '    "status": "draft",'
echo '    "items": [{'
echo '      "inventoryId": "YOUR_RAB_ITEM_ID",'
echo '      "itemName": "Test Item",'
echo '      "quantity": 100,'
echo '      "unitPrice": 50000,'
echo '      "totalPrice": 5000000,'
echo '      "description": "Test Item (Unit)"'
echo '    }],'
echo '    "subtotal": 5000000,'
echo '    "taxAmount": 0,'
echo '    "totalAmount": 5000000'
echo '  }'\'''
echo ""
