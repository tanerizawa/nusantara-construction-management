#!/bin/bash

echo "🔍 COMPLETE FLOW TRACE - RAB Notification System"
echo "=================================================="
echo ""

# STEP 1: Check FCM Service Status
echo "1️⃣ FCM SERVICE STATUS"
echo "-------------------"
docker logs nusantara-backend 2>&1 | grep "Firebase Cloud Messaging initialized" | tail -1
echo ""

# STEP 2: Check Active Tokens
echo "2️⃣ ACTIVE NOTIFICATION TOKENS"
echo "----------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  user_id, 
  LEFT(token, 30) as token_preview,
  device_type, 
  is_active,
  created_at
FROM notification_tokens 
WHERE is_active = true;"
echo ""

# STEP 3: Check getRABApprovers function
echo "3️⃣ PROJECT TEAM MEMBERS (Who will receive notification)"
echo "------------------------------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  project_id,
  employee_id,
  name,
  role,
  status
FROM project_team_members
WHERE project_id = '2025PJK001' 
  AND status = 'active';"
echo ""

# STEP 4: Check Admin Users (Fallback)
echo "4️⃣ ADMIN USERS (Fallback approvers)"
echo "----------------------------------"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "
SELECT 
  id,
  username,
  role,
  is_active
FROM users 
WHERE role = 'admin' 
  AND is_active = true;"
echo ""

# STEP 5: Watch logs in real-time
echo "5️⃣ STARTING REAL-TIME LOG MONITORING"
echo "-----------------------------------"
echo "Creating RAB now and watching logs..."
echo ""
echo "Logs will show:"
echo "- RAB creation"
echo "- Approver lookup"
echo "- FCM notification send"
echo ""
echo "Press Ctrl+C to stop"
echo ""

# Monitor logs
docker logs -f nusantara-backend 2>&1 | grep --line-buffered -E "POST.*rab|🔔|📤|📬|🔑|📨|✅|⚠️|❌|RAB Bulk|FCM|approver|notification"
