#!/bin/bash

echo "🔔 Testing RAB Creation with under_review status..."
echo ""

# Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"azmy","password":"Admin123"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  echo "$LOGIN_RESPONSE"
  exit 1
fi

echo "✅ Login successful as azmy"
echo "🔑 Token: ${TOKEN:0:20}..."
echo ""

# Create RAB with under_review status
echo "📝 Creating RAB with status 'under_review'..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/projects/2025PJK001/rab \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "Material",
    "description": "Test Notification - Besi 12mm", 
    "unit": "kg",
    "quantity": 500,
    "unitPrice": 15000,
    "status": "under_review",
    "itemType": "material",
    "notes": "RAB untuk test notifikasi FCM"
  }')

echo "Response:"
echo "$RESPONSE"
echo ""

sleep 2

echo "📱 CHECK HP SEKARANG - Notifikasi seharusnya muncul!"
echo ""

echo "🔍 Backend logs (last 30 lines):"
docker logs nusantara-backend --tail 30 | grep -i "notification\|fcm\|rab.*created"
