#!/bin/bash
# Test Milestone Detail API Endpoints

echo "🧪 Testing Milestone Detail Feature API Endpoints"
echo "=================================================="
echo ""

# Configuration
BASE_URL="http://localhost:5000/api"
PROJECT_ID="550e8400-e29b-41d4-a716-446655440000" # Replace with actual project ID
MILESTONE_ID="650e8400-e29b-41d4-a716-446655440000" # Replace with actual milestone ID

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "📝 Note: You need to replace PROJECT_ID and MILESTONE_ID with actual values"
echo "    and add Authorization header with valid JWT token"
echo ""

# Test 1: Get Photos
echo "1️⃣  Testing GET Photos Endpoint"
echo "   URL: ${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/photos"
echo "   Command: curl -X GET '${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/photos' -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""

# Test 2: Get Cost Summary
echo "2️⃣  Testing GET Cost Summary Endpoint"
echo "   URL: ${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/costs/summary"
echo "   Command: curl -X GET '${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/costs/summary' -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""

# Test 3: Get Costs
echo "3️⃣  Testing GET Costs Endpoint"
echo "   URL: ${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/costs"
echo "   Command: curl -X GET '${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/costs' -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""

# Test 4: Get Activities
echo "4️⃣  Testing GET Activities Endpoint"
echo "   URL: ${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/activities"
echo "   Command: curl -X GET '${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/activities' -H 'Authorization: Bearer YOUR_TOKEN'"
echo ""

# Test 5: Add Cost (POST)
echo "5️⃣  Testing POST Cost Endpoint"
echo "   URL: ${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/costs"
echo "   Command: curl -X POST '${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/costs' \\"
echo "     -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{\"costCategory\":\"materials\",\"costType\":\"actual\",\"amount\":5000000,\"description\":\"Test cost entry\"}'"
echo ""

# Test 6: Upload Photo (POST)
echo "6️⃣  Testing POST Photo Upload Endpoint"
echo "   URL: ${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/photos"
echo "   Command: curl -X POST '${BASE_URL}/projects/${PROJECT_ID}/milestones/${MILESTONE_ID}/photos' \\"
echo "     -H 'Authorization: Bearer YOUR_TOKEN' \\"
echo "     -F 'photos=@test-image.jpg' \\"
echo "     -F 'title=Test Photo' \\"
echo "     -F 'photoType=progress'"
echo ""

echo "=================================================="
echo "✅ All endpoint URLs generated!"
echo ""
echo "📋 Next Steps:"
echo "   1. Get a valid JWT token from login"
echo "   2. Get actual PROJECT_ID from database"
echo "   3. Get actual MILESTONE_ID from database"
echo "   4. Replace placeholders in commands above"
echo "   5. Run the curl commands to test each endpoint"
echo ""
echo "💡 Tip: To get token, login and check browser DevTools > Application > Local Storage"
echo ""
