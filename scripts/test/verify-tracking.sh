#!/bin/bash

# Test Script: RAB Quantity Tracking Verification
# This script helps verify that PO creation correctly updates RAB quantity tracking

PROJECT_ID="2025PJK001"
BASE_URL="https://nusantaragroup.co/api"

echo "═══════════════════════════════════════════════════════════════"
echo "  RAB Quantity Tracking - Verification Test"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Function to format JSON
format_json() {
    if command -v python3 &> /dev/null; then
        python3 -m json.tool 2>/dev/null || cat
    else
        cat
    fi
}

# Step 1: Check current purchase summary
echo "📊 Step 1: Current Purchase Summary"
echo "────────────────────────────────────────────────────────────────"
SUMMARY=$(curl -s "${BASE_URL}/rab-tracking/projects/${PROJECT_ID}/purchase-summary")
echo "$SUMMARY" | format_json | head -50
echo ""

# Extract one rabItemId for testing
RAB_ITEM_ID=$(echo "$SUMMARY" | grep -o '"rabItemId":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$RAB_ITEM_ID" ]; then
    echo "✅ Found RAB Item ID: $RAB_ITEM_ID"
    CURRENT_PURCHASED=$(echo "$SUMMARY" | grep -A 5 "\"$RAB_ITEM_ID\"" | grep "totalPurchased" | grep -o '[0-9]\+' | head -1)
    echo "   Current totalPurchased: $CURRENT_PURCHASED"
else
    echo "⚠️  No tracking records found yet"
fi
echo ""

# Step 2: Check latest PO
echo "📦 Step 2: Latest Purchase Order"
echo "────────────────────────────────────────────────────────────────"
PO_DATA=$(curl -s "${BASE_URL}/purchase-orders?projectId=${PROJECT_ID}&limit=1&sort=orderDate&order=desc")
echo "$PO_DATA" | format_json | head -60
echo ""

LATEST_PO=$(echo "$PO_DATA" | grep -o '"poNumber":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$LATEST_PO" ]; then
    echo "✅ Latest PO: $LATEST_PO"
    PO_ITEM_ID=$(echo "$PO_DATA" | grep -o '"inventoryId":"[^"]*"' | head -1 | cut -d'"' -f4)
    PO_QTY=$(echo "$PO_DATA" | grep -o '"quantity":[0-9]\+' | head -1 | cut -d':' -f2)
    echo "   Item ID: $PO_ITEM_ID"
    echo "   Quantity: $PO_QTY"
else
    echo "⚠️  No POs found yet"
fi
echo ""

# Step 3: Backend logs check
echo "🔍 Step 3: Recent Backend Activity (Last 20 lines)"
echo "────────────────────────────────────────────────────────────────"
docker logs nusantara-backend --tail 20 2>&1 | grep -E "POST.*purchase-orders|✅ PO|bulkCreate|rab_purchase_tracking" || echo "No recent PO activity found"
echo ""

# Step 4: Instructions
echo "═══════════════════════════════════════════════════════════════"
echo "  🧪 TESTING INSTRUCTIONS"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "To verify tracking is working:"
echo ""
echo "1️⃣  CREATE A NEW PO:"
echo "   - Go to Purchase Orders → Create New"
echo "   - Select any RAB item"
echo "   - Enter quantity (e.g., 500)"
echo "   - Complete and submit"
echo ""
echo "2️⃣  RUN THIS SCRIPT AGAIN:"
echo "   bash /root/APP-YK/verify-tracking.sh"
echo ""
echo "3️⃣  VERIFY THESE CHANGES:"
echo "   ✅ totalPurchased increased by your PO quantity"
echo "   ✅ Backend log shows: '✅ PO PO-xxx created with X items tracked'"
echo "   ✅ UI shows reduced 'Qty Tersedia'"
echo ""
echo "4️⃣  IF NOT WORKING:"
echo "   - Check backend logs: docker logs nusantara-backend --tail 100"
echo "   - Restart backend: docker-compose restart backend"
echo "   - Verify inventoryId matches rabItemId"
echo ""
echo "═══════════════════════════════════════════════════════════════"
