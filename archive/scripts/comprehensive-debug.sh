#!/bin/bash

echo "🔍 COMPREHENSIVE ANALYSIS - RAB Notification System"
echo "=================================================="
echo ""

# STEP 1: Check if FCM Service is initialized
echo "1️⃣ CHECK: FCM Service Initialization"
echo "-----------------------------------"
docker logs nusantara-backend 2>&1 | grep -i "firebase.*initialized\|fcm.*ready" | tail -5
echo ""

# STEP 2: Check notification tokens in database
echo "2️⃣ CHECK: Notification Tokens in Database"
echo "---------------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  user_id, 
  LEFT(token, 50) as token_preview,
  device_type, 
  is_active,
  created_at
FROM notification_tokens 
WHERE is_active = true
ORDER BY created_at DESC;
"
echo ""

# STEP 3: Check recent RAB items created
echo "3️⃣ CHECK: Recent RAB Items"
echo "------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  project_id,
  LEFT(description, 40) as description,
  status,
  created_by,
  created_at
FROM project_rab 
ORDER BY created_at DESC 
LIMIT 5;
"
echo ""

# STEP 4: Check user who owns the token
echo "4️⃣ CHECK: User with Token vs RAB Creator"
echo "--------------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  u.id as user_id,
  u.username,
  u.role,
  CASE WHEN nt.token IS NOT NULL THEN '✅ HAS TOKEN' ELSE '❌ NO TOKEN' END as has_fcm_token
FROM users u
LEFT JOIN notification_tokens nt ON u.id = nt.user_id AND nt.is_active = true
WHERE u.username IN ('azmy', 'hadez', 'yonokurniawan')
ORDER BY u.username;
"
echo ""

# STEP 5: Check backend route registration
echo "5️⃣ CHECK: Backend RAB Routes"
echo "--------------------------"
docker exec nusantara-backend cat /app/routes/projects/rab.routes.js | grep -n "router.post\|router.put" | head -10
echo ""

# STEP 6: Test backend health
echo "6️⃣ CHECK: Backend Health"
echo "----------------------"
curl -s http://localhost:5000/health | head -3
echo ""
echo ""

# STEP 7: Check FCM notification function
echo "7️⃣ CHECK: FCM Notification Service"
echo "--------------------------------"
docker exec nusantara-backend cat /app/services/FCMNotificationService.js | grep -A3 "sendToUser\|sendToMultiple" | head -20
echo ""

# STEP 8: Get approvers for project
echo "8️⃣ CHECK: Who Should Receive Notifications"
echo "-----------------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  ptm.project_id,
  ptm.employee_id,
  ptm.role,
  ptm.name,
  ptm.status
FROM project_team_members ptm
WHERE ptm.project_id = '2025PJK001'
  AND ptm.status = 'active';
"
echo ""

# STEP 9: Check if there are any admin users
echo "9️⃣ CHECK: Admin Users (Fallback Approvers)"
echo "----------------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  username,
  role,
  is_active
FROM users 
WHERE role = 'admin' 
  AND is_active = true;
"
echo ""

# STEP 10: Simulation - Create RAB and watch logs
echo "🔟 SIMULATION: Create RAB with Live Logging"
echo "-----------------------------------------"
echo "Starting backend log monitoring..."
echo ""

# Start log monitoring in background
docker logs -f nusantara-backend 2>&1 | grep -i "rab\|notification\|fcm" &
LOG_PID=$!

sleep 2

# Try to create RAB
echo "Attempting to create RAB..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"azmy","password":"Admin123"}' | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
else
  echo "✅ Login successful, creating RAB..."
  
  RESPONSE=$(curl -s -X POST http://localhost:5000/api/projects/2025PJK001/rab \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{
      "category": "Material",
      "description": "DEBUG TEST - Besi 12mm",
      "unit": "kg",
      "quantity": 100,
      "unitPrice": 15000,
      "itemType": "material",
      "notes": "Test notification system"
    }')
  
  echo "Response:"
  echo "$RESPONSE"
  echo ""
fi

sleep 5

# Stop log monitoring
kill $LOG_PID 2>/dev/null

echo ""
echo "=================================================="
echo "📊 ANALYSIS COMPLETE"
echo "=================================================="
