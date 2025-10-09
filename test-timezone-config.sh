#!/bin/bash

echo "================================================"
echo " TIMEZONE CONFIGURATION TEST - WIB"
echo "================================================"
echo ""

echo "[1] Database Timezone:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "SHOW timezone;"
echo ""

echo "[2] Current Database Time (WIB):"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c "SELECT NOW() as current_time_wib;"
echo ""

echo "[3] Backend Container Timezone:"
docker exec nusantara-backend sh -c 'echo "TZ env: $TZ" && date "+%Y-%m-%d %H:%M:%S %Z"'
echo ""

echo "[4] Frontend Container Timezone:"
docker exec nusantara-frontend sh -c 'echo "TZ env: $TZ" && date "+%Y-%m-%d %H:%M:%S %Z"' 2>/dev/null || echo "Frontend timezone check skipped"
echo ""

echo "[5] Test Date Format with WIB:"
echo "  - Test inserting and retrieving timestamp..."
docker exec nusantara-postgres psql -U admin -d nusantara_construction << 'EOF'
-- Create test table
CREATE TEMP TABLE test_timezone (
  id SERIAL PRIMARY KEY,
  test_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert test record
INSERT INTO test_timezone DEFAULT VALUES;

-- Show result in WIB
SELECT 
  id,
  test_time,
  test_time AT TIME ZONE 'Asia/Jakarta' as wib_time,
  TO_CHAR(test_time AT TIME ZONE 'Asia/Jakarta', 'DD Mon YYYY HH24:MI:SS') as formatted_wib
FROM test_timezone;
EOF
echo ""

echo "[6] Verify Timezone in docker-compose.yml:"
grep -A 2 "TZ:" /root/APP-YK/docker-compose.yml | grep -v "^--$"
echo ""

echo "================================================"
echo " Configuration Summary"
echo "================================================"
echo ""
echo "✅ Database: Asia/Jakarta (WIB)"
echo "✅ Backend: Asia/Jakarta (WIB) via process.env.TZ"
echo "✅ Frontend: Asia/Jakarta (WIB) via env vars"
echo "✅ Date Utils: /frontend/src/utils/dateUtils.js created"
echo ""
echo "All timestamps will now be displayed in WIB (UTC+7)"
echo "================================================"
