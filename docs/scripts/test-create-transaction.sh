#!/bin/bash

TOKEN=$(grep -oP '"token":"\K[^"]+' ~/.nusantara-auth 2>/dev/null || echo "")

echo "Testing Transaction Creation..."
echo "=============================="

# Test data matching frontend form
TEST_DATA='{
  "type": "expense",
  "category": "Materials",
  "amount": 100000,
  "description": "Test transaction from curl",
  "date": "2025-10-14",
  "paymentMethod": "bank_transfer",
  "referenceNumber": "TEST-001",
  "notes": "Testing transaction creation"
}'

echo ""
echo "📤 Sending POST request to /api/finance"
echo "Data:"
echo "$TEST_DATA" | python3 -m json.tool

echo ""
echo "Response:"
curl -X POST "http://localhost:5000/api/finance" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d "$TEST_DATA" \
  -s | python3 -m json.tool

