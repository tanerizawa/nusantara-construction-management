#!/bin/bash

# Test Script: RAB Real-time Availability with Database View
# This demonstrates the most reliable approach for quantity tracking

PROJECT_ID="2025PJK001"
BASE_URL="https://nusantaragroup.co/api"

echo "═══════════════════════════════════════════════════════════════"
echo "  🚀 RAB Real-time Availability Test (Database View Approach)"
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

# Function to extract value from JSON
get_json_value() {
    local json="$1"
    local key="$2"
    echo "$json" | grep -o "\"$key\":[^,}]*" | head -1 | cut -d':' -f2 | tr -d ' "'
}

echo "📊 Step 1: Initialize Database View"
echo "────────────────────────────────────────────────────────────────"
echo "Creating/updating rab_items_availability view..."
INIT_RESULT=$(curl -s -X POST "${BASE_URL}/rab-view/init")
echo "$INIT_RESULT" | format_json
echo ""

echo "📊 Step 2: Get RAB Items from View (Real-time Data)"
echo "────────────────────────────────────────────────────────────────"
VIEW_DATA=$(curl -s "${BASE_URL}/rab-view/projects/${PROJECT_ID}/items?approvedOnly=true")
echo "$VIEW_DATA" | format_json | head -80
echo ""

# Extract first item for testing
FIRST_ITEM_ID=$(echo "$VIEW_DATA" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -n "$FIRST_ITEM_ID" ]; then
    echo "✅ Found test item: $FIRST_ITEM_ID"
    
    # Get detailed view
    echo ""
    echo "📊 Step 3: Get Detailed Item View"
    echo "────────────────────────────────────────────────────────────────"
    ITEM_DETAIL=$(curl -s "${BASE_URL}/rab-view/projects/${PROJECT_ID}/items/${FIRST_ITEM_ID}")
    echo "$ITEM_DETAIL" | format_json
    echo ""
    
    # Extract key values
    ORIGINAL_QTY=$(echo "$ITEM_DETAIL" | grep -o '"original_quantity":"[^"]*"' | cut -d'"' -f4)
    TOTAL_PURCHASED=$(echo "$ITEM_DETAIL" | grep -o '"total_purchased":"[^"]*"' | cut -d'"' -f4)
    AVAILABLE_QTY=$(echo "$ITEM_DETAIL" | grep -o '"available_quantity":"[^"]*"' | cut -d'"' -f4)
    PROGRESS=$(echo "$ITEM_DETAIL" | grep -o '"purchase_progress_percent":"[^"]*"' | cut -d'"' -f4)
    
    echo "📈 Item Statistics:"
    echo "   Original Quantity    : ${ORIGINAL_QTY:-N/A}"
    echo "   Total Purchased      : ${TOTAL_PURCHASED:-N/A}"
    echo "   Available Quantity   : ${AVAILABLE_QTY:-N/A}"
    echo "   Progress             : ${PROGRESS:-N/A}%"
else
    echo "⚠️  No items found in project"
fi

echo ""
echo "📊 Step 4: Compare with Old Endpoint"
echo "────────────────────────────────────────────────────────────────"
echo "Old endpoint (requires manual calculation):"
OLD_DATA=$(curl -s "${BASE_URL}/projects/${PROJECT_ID}/rab")
echo "$OLD_DATA" | format_json | head -40
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ BENEFITS OF DATABASE VIEW APPROACH"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "✅ Real-time: Data always current (no cache issues)"
echo "✅ Consistent: Calculated at database level"
echo "✅ Simple: No frontend calculation needed"
echo "✅ Reliable: Single source of truth"
echo "✅ Efficient: Database optimized joins"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  🧪 TEST SCENARIO"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "1. Current state saved above"
echo ""
echo "2. CREATE A TEST PO:"
echo "   - Use item: $FIRST_ITEM_ID"
echo "   - Quantity: 100 (or any amount)"
echo "   - Submit PO"
echo ""
echo "3. RUN THIS SCRIPT AGAIN:"
echo "   bash /root/APP-YK/test-realtime-view.sh"
echo ""
echo "4. VERIFY RESULTS:"
echo "   ✅ total_purchased increased by 100"
echo "   ✅ available_quantity decreased by 100"
echo "   ✅ purchase_progress_percent updated"
echo "   ✅ NO FRONTEND REFRESH NEEDED!"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "  📝 FRONTEND INTEGRATION"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "Replace useRABItems.js fetch with:"
echo ""
echo "const response = await fetch("
echo "  \`/api/rab-view/projects/\${projectId}/items?approvedOnly=true\`"
echo ");"
echo "const result = await response.json();"
echo "const rabItems = result.data; // Already has available_quantity!"
echo ""
echo "No calculation needed - database view does everything!"
echo ""

echo "═══════════════════════════════════════════════════════════════"
