#!/bin/bash

echo "=== Testing RAB Management API ==="

# Get token
echo "Getting authentication token..."
TOKEN=$(curl -s -X POST -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  https://nusantaragroup.co/api/auth/login | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get authentication token"
  exit 1
fi

echo "✅ Got token: ${TOKEN:0:20}..."

# Test GET RAB items
echo -e "\n=== Testing GET RAB items ==="
curl -s -H "Authorization: Bearer $TOKEN" \
  https://nusantaragroup.co/api/projects/PRJ-2025-001/rab | \
  head -c 500

echo -e "\n\n=== Testing POST new RAB item ==="
curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "category": "Pekerjaan Test",
    "description": "Test Item RAB dari Script", 
    "unit": "Unit",
    "quantity": 10,
    "unitPrice": 100000,
    "totalPrice": 1000000,
    "notes": "Test notes dari script"
  }' \
  https://nusantaragroup.co/api/projects/PRJ-2025-001/rab

echo -e "\n\n=== Testing GET RAB items again ==="
curl -s -H "Authorization: Bearer $TOKEN" \
  https://nusantaragroup.co/api/projects/PRJ-2025-001/rab | \
  head -c 500

echo -e "\n\n✅ RAB API test completed"