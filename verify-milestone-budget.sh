#!/bin/bash

# MILESTONE BUDGET DATA VERIFICATION SCRIPT
# Purpose: Verify milestone budget data flows correctly from DB to UI

echo "=================================="
echo "MILESTONE BUDGET VERIFICATION TEST"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Check database has budget values
echo -e "${YELLOW}[TEST 1]${NC} Checking database for milestone budget values..."
docker exec -it nusantara-postgres psql -U nusantara -d nusantara_db -c "
SELECT 
  id,
  name,
  budget,
  status,
  created_at
FROM project_milestones 
ORDER BY created_at DESC 
LIMIT 5;
"

echo ""
echo "---"
echo ""

# Test 2: Check backend API response
echo -e "${YELLOW}[TEST 2]${NC} Testing backend API /milestones endpoint..."
echo "Sample query: GET http://localhost:3001/api/projects/1/milestones"
echo ""
echo "Please check if response includes 'budget' field for each milestone"
echo "Run in browser or Postman to see actual values"

echo ""
echo "---"
echo ""

# Test 3: Check backend /costs/summary endpoint structure
echo -e "${YELLOW}[TEST 3]${NC} Testing backend API /costs/summary endpoint..."
echo "Sample query: GET http://localhost:3001/api/projects/1/milestones/1/costs/summary"
echo ""
echo "Expected response structure:"
cat << EOF
{
  "success": true,
  "data": {
    "budget": 50000000,           // ✅ Should have this
    "totalActual": 15000000,      // ✅ Should have this
    "totalAllCosts": 15000000,    // ✅ Should have this
    "variance": 35000000,          // ✅ Should have this
    "variancePercent": 70,         // ✅ Should have this
    "status": "under_budget",      // ✅ Should have this
    "breakdown": [...]             // ✅ Should have this
  }
}
EOF

echo ""
echo "---"
echo ""

# Test 4: Frontend display verification
echo -e "${YELLOW}[TEST 4]${NC} Frontend Display Verification Checklist"
echo ""
echo "Open browser console and navigate to milestone detail page"
echo ""
echo "Check these displays:"
echo "  1. ✅ Milestone Budget: Should show actual budget (e.g., Rp 50.000.000)"
echo "  2. ✅ Actual Cost: Should show sum of cost entries (e.g., Rp 15.000.000)"
echo "  3. ✅ Variance: Should show budget - actual (e.g., Rp 35.000.000)"
echo "  4. ✅ No duplicate 'Actual Cost' labels"
echo "  5. ✅ No 'Contingency: Rp 0' row (removed)"
echo ""

echo "---"
echo ""

# Test 5: Network tab verification
echo -e "${YELLOW}[TEST 5]${NC} Network Tab Verification Steps"
echo ""
echo "1. Open Chrome DevTools → Network tab"
echo "2. Navigate to milestone detail page"
echo "3. Look for these API calls:"
echo "   - GET /api/projects/{id}/milestones/{milestoneId}"
echo "   - GET /api/projects/{id}/milestones/{milestoneId}/costs/summary"
echo ""
echo "4. Check response data:"
echo "   - milestone.budget should have value (not 0)"
echo "   - summary.budget should equal milestone.budget"
echo "   - summary.totalActual should show sum of costs"
echo ""

echo "---"
echo ""

# Summary
echo -e "${GREEN}VERIFICATION COMPLETE${NC}"
echo ""
echo "If you see issues:"
echo "  1. Budget = 0 in database → Need to update milestone records"
echo "  2. Budget = 0 in API response → Check backend serialization"
echo "  3. Budget displays as Rp 0 in UI → Check OverviewTab component"
echo ""
echo "Recent fix applied:"
echo "  - Updated OverviewTab.js to use 'summary.budget' instead of 'summary.totalPlanned'"
echo "  - Removed 'Contingency' row (not calculated by backend)"
echo "  - Changed label from 'Planned Budget' to 'Milestone Budget'"
echo ""
echo "=================================="
