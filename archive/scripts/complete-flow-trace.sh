#!/bin/bash

echo "🔍 COMPLETE FLOW TRACE - RAB Notification System"
echo "=================================================="
echo ""

# STEP 1: Check FCM initialization
echo "1️⃣ FCM SERVICE INITIALIZATION"
echo "----------------------------"
docker logs nusantara-backend 2>&1 | grep -E "FCM.*initialized|Failed to initialize" | tail -3
echo ""

# STEP 2: Check notification tokens
echo "2️⃣ NOTIFICATION TOKENS IN DATABASE"
echo "--------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  user_id,
  LEFT(token, 60) as token_preview,
  device_type,
  is_active,
  created_at
FROM notification_tokens 
WHERE is_active = true
ORDER BY created_at DESC;
"
echo ""

# STEP 3: Check project team members
echo "3️⃣ PROJECT TEAM MEMBERS (Who should get notifications?)"
echo "-------------------------------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  employee_id,
  name,
  role,
  status
FROM project_team_members
WHERE project_id = '2025PJK001' AND status = 'active';
"
echo ""

# STEP 4: Check admin users (fallback approvers)
echo "4️⃣ ADMIN USERS (Fallback approvers)"
echo "---------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT id, username, role, is_active 
FROM users 
WHERE role = 'admin' AND is_active = true;
"
echo ""

# STEP 5: Test create RAB and monitor logs
echo "5️⃣ CREATING TEST RAB & MONITORING LOGS"
echo "-------------------------------------"
echo "Starting log monitor..."
echo ""

# Start log monitoring in background
(docker logs -f nusantara-backend 2>&1 | grep --line-buffered -E "🔔|📤|📬|🔑|📨|✅|⚠️|❌|RAB Bulk") &
LOG_PID=$!

sleep 2

echo "Logging in as azmy..."
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"azmy","password":"Admin123"}' | grep -o '"token":"[^"]*' | sed 's/"token":"//')

if [ -z "$TOKEN" ]; then
  echo "❌ Login failed!"
  kill $LOG_PID 2>/dev/null
  exit 1
fi

echo "✅ Login successful!"
echo "🔑 Token: ${TOKEN:0:30}..."
echo ""

echo "Creating RAB via BULK endpoint..."
RESPONSE=$(curl -s -X POST http://localhost:5000/api/projects/2025PJK001/rab/bulk \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "items": [{
      "category": "Material",
      "description": "TEST NOTIFICATION - Besi 12mm",
      "unit": "kg",
      "quantity": 100,
      "unitPrice": 15000,
      "itemType": "material",
      "notes": "Test complete flow"
    }]
  }')

echo ""
echo "📨 Response from backend:"
echo "$RESPONSE" | head -20
echo ""

sleep 3

# Stop log monitoring
kill $LOG_PID 2>/dev/null

echo ""
echo "6️⃣ CHECK RESULTS"
echo "--------------"
echo ""

# Check if RAB was created
echo "Last RAB created:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  LEFT(description, 40) as description,
  status,
  created_at
FROM project_rab 
ORDER BY created_at DESC 
LIMIT 1;
"
echo ""

# Check backend logs for notification attempts
echo "Backend notification logs:"
docker logs nusantara-backend --tail 50 2>&1 | grep -E "🔔|📤|✅|⚠️|❌" | tail -20
echo ""

echo "=================================================="
echo "📊 ANALYSIS"
echo "=================================================="
echo ""
echo "Check the logs above for:"
echo "  1. '🔔 [RAB Bulk] Created items: X, Requiring approval: X'"
echo "  2. '🔔 [RAB Bulk] Approver IDs: [...]'"
echo "  3. '📤 [FCM] sendToMultipleUsers called'"
echo "  4. '✅ [FCM] Response: X/Y delivered'"
echo ""
echo "If you see '0/1 delivered', check FCM error messages!"
