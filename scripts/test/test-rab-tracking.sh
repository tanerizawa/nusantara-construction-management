#!/bin/bash

# Test RAB Purchase Tracking Integration
# This script tests if PO creation correctly updates RAB quantity tracking

PROJECT_ID="2025PJK001"
BASE_URL="https://nusantaragroup.co/api"

echo "🔍 Testing RAB Purchase Tracking Integration"
echo "============================================="
echo ""

# Step 1: Get RAB items before PO
echo "📊 Step 1: Fetching RAB items for project $PROJECT_ID..."
curl -s "${BASE_URL}/projects/${PROJECT_ID}/rab" | jq '.data[0] | {id, description, quantity, unit}' || echo "Failed to fetch RAB items"
echo ""

# Step 2: Get purchase summary before PO
echo "📊 Step 2: Fetching purchase summary..."
SUMMARY_BEFORE=$(curl -s "${BASE_URL}/rab-tracking/projects/${PROJECT_ID}/purchase-summary")
echo "$SUMMARY_BEFORE" | jq '.' || echo "$SUMMARY_BEFORE"
echo ""

# Step 3: Check PO tracking records
echo "📊 Step 3: Checking latest PO in database..."
curl -s "${BASE_URL}/purchase-orders?projectId=${PROJECT_ID}&limit=1" | jq '.data[0] | {poNumber, status, items: .items | length, totalAmount}' || echo "Failed to fetch POs"
echo ""

# Step 4: Check RAB Purchase Tracking table
echo "📊 Step 4: Checking RAB Purchase Tracking records..."
echo "Query: SELECT * FROM rab_purchase_tracking WHERE projectId='${PROJECT_ID}' ORDER BY purchaseDate DESC LIMIT 5"
echo ""
echo "⚠️  Note: This requires direct database access. Checking via API..."
curl -s "${BASE_URL}/rab-tracking/projects/${PROJECT_ID}/purchase-summary" | jq '.data[] | select(.recordCount > 0)' || echo "No tracking records found"
echo ""

echo "============================================="
echo "✅ Test completed!"
echo ""
echo "Expected behavior after creating a PO with 500 qty from 1000 total:"
echo "  - totalPurchased should be 500"
echo "  - availableQuantity should be 500 (1000 - 500)"
echo "  - recordCount should be > 0"
echo ""
echo "If values are still 0, check:"
echo "  1. Backend logs: docker logs nusantara-backend --tail 100"
echo "  2. Database: Check rab_purchase_tracking table"
echo "  3. Frontend refresh: Check if fetchRABItems() is called after PO creation"
