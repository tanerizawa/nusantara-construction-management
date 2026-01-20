#!/bin/bash

# Test Budget Validation API Endpoints
# Usage: ./test-budget-validation-api.sh

PROJECT_ID="2025BSR001"
BASE_URL="http://localhost:5000/api/projects/${PROJECT_ID}/budget-validation"

echo "🧪 Testing Budget Validation API Endpoints"
echo "=========================================="
echo ""

# Test 1: Get Budget Summary
echo "📊 Test 1: GET Budget Summary"
echo "URL: ${BASE_URL}/summary"
curl -s -X GET "${BASE_URL}/summary" \
  -H "Content-Type: application/json" \
  | head -30
echo ""
echo "---"
echo ""

# Test 2: Get Comprehensive Budget Data
echo "📊 Test 2: GET Comprehensive Budget Data"
echo "URL: ${BASE_URL}"
curl -s -X GET "${BASE_URL}" \
  -H "Content-Type: application/json" \
  | head -50
echo ""
echo "---"
echo ""

# Test 3: Get Additional Expenses
echo "📊 Test 3: GET Additional Expenses"
echo "URL: ${BASE_URL}/additional-expenses"
curl -s -X GET "${BASE_URL}/additional-expenses" \
  -H "Content-Type: application/json"
echo ""
echo "---"
echo ""

# Test 4: Get Variance Analysis
echo "📊 Test 4: GET Variance Analysis"
echo "URL: ${BASE_URL}/variance-analysis"
curl -s -X GET "${BASE_URL}/variance-analysis" \
  -H "Content-Type: application/json" \
  | head -50
echo ""
echo "---"
echo ""

echo "✅ API Tests Complete!"
echo ""
echo "📝 Notes:"
echo "  - If you see 401 errors, authentication is required"
echo "  - If you see 404, the project may not exist"
echo "  - If you see 500, check backend logs: docker-compose logs backend"
