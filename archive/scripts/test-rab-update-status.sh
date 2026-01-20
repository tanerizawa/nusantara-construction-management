#!/bin/bash

echo "🔔 Testing RAB Status Update to trigger notification..."
echo ""

# Get token first
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"azmy","password":"Admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful!"
echo "🔑 Token: ${TOKEN:0:20}..."
echo ""

# Update RAB status to under_review to trigger notification
echo "📝 Updating RAB status to 'under_review'..."
UPDATE_RESPONSE=$(curl -s -X PUT http://localhost:5000/api/projects/2025PJK001/rab \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "id": "33950922-3372-4ec7-a24d-c0831e49c3bd",
    "status": "under_review",
    "description": "Besi dan paku ukuran 11"
  }')

echo "$UPDATE_RESPONSE" | jq '.' 2>/dev/null || echo "$UPDATE_RESPONSE"
echo ""

echo "Check:"
echo "1. HP notification muncul ✅"
echo "2. Backend logs:"
docker logs nusantara-backend --tail 30 | grep -i "notification\|fcm"
