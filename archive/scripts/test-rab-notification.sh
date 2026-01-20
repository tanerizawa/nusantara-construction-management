#!/bin/bash

# Test RAB Notification
# Creates RAB via API to trigger notification

echo "🔔 Testing RAB Notification..."
echo ""

# Get project ID
PROJECT_ID=1

# Create RAB with approval status
curl -X POST http://localhost:5000/api/projects/rab \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_AUTH_TOKEN" \
  -d '{
    "project_id": '${PROJECT_ID}',
    "description": "Test Notification - Pekerjaan Struktur",
    "quantity": 100,
    "unit": "m3",
    "unit_price": 500000,
    "total_price": 50000000,
    "status": "under_review",
    "notes": "Test notification to mobile device"
  }'

echo ""
echo ""
echo "Check:"
echo "1. HP notification muncul"
echo "2. Backend logs:"
docker logs nusantara-backend --tail 20 | grep -i notification
