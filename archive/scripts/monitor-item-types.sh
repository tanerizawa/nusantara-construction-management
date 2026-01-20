#!/bin/bash
# ================================================================
# RAB Item Type Monitor
# Purpose: Monitor and report item type distribution in real-time
# Usage: ./scripts/monitor-item-types.sh
# ================================================================

set -e

echo "=========================================="
echo "RAB ITEM TYPE DISTRIBUTION MONITOR"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get database stats
echo -e "${BLUE}📊 Current Distribution:${NC}"
docker-compose exec -T postgres psql -U admin -d nusantara_construction << 'EOF'
SELECT 
  item_type,
  COUNT(*) as count,
  TO_CHAR(SUM(total_price), 'Rp FM999,999,999,999') as total_value,
  ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM project_rab), 1) as percentage,
  CASE 
    WHEN item_type = 'material' THEN '🔷 Purchase Orders'
    WHEN item_type = 'service' THEN '🟣 Work Orders (Service)'
    WHEN item_type = 'labor' THEN '🟢 Work Orders (Labor)'
    WHEN item_type = 'equipment' THEN '🟡 Work Orders (Equipment)'
    WHEN item_type = 'overhead' THEN '⚪ Work Orders (Overhead)'
    ELSE '❓ Unknown'
  END as workflow
FROM project_rab
GROUP BY item_type
ORDER BY count DESC;
EOF

echo ""
echo -e "${YELLOW}🔍 Checking for Potential Misclassifications:${NC}"
docker-compose exec -T postgres psql -U admin -d nusantara_construction << 'EOF'
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ No issues found'
    ELSE '⚠️  Found ' || COUNT(*) || ' potential issues'
  END as status
FROM project_rab
WHERE 
  (item_type = 'material' AND (
    description ILIKE '%borongan%' OR
    description ILIKE '%upah%' OR
    description ILIKE '%jasa%' OR
    description ILIKE '%sewa%' OR
    description ILIKE '%tukang%'
  ));

SELECT 
  id,
  SUBSTRING(description, 1, 40) as description,
  item_type,
  '❌ Should be: ' || 
    CASE 
      WHEN description ILIKE '%borongan%' OR description ILIKE '%tukang%' OR description ILIKE '%upah%' THEN 'labor'
      WHEN description ILIKE '%jasa%' THEN 'service'
      WHEN description ILIKE '%sewa%' THEN 'equipment'
      ELSE 'unknown'
    END as suggested_type
FROM project_rab
WHERE 
  (item_type = 'material' AND (
    description ILIKE '%borongan%' OR
    description ILIKE '%upah%' OR
    description ILIKE '%jasa%' OR
    description ILIKE '%sewa%' OR
    description ILIKE '%tukang%'
  ))
LIMIT 5;
EOF

echo ""
echo -e "${GREEN}📋 Recent Items (Last 5):${NC}"
docker-compose exec -T postgres psql -U admin -d nusantara_construction << 'EOF'
SELECT 
  SUBSTRING(description, 1, 35) as description,
  item_type,
  TO_CHAR(total_price, 'Rp FM999,999,999') as price,
  TO_CHAR(created_at, 'DD Mon HH24:MI') as created
FROM project_rab
ORDER BY created_at DESC
LIMIT 5;
EOF

echo ""
echo -e "${BLUE}💡 Quick Actions:${NC}"
echo "  • Fix all misclassifications: docker-compose exec -T postgres psql -U admin -d nusantara_construction -f /scripts/fix-rab-item-types.sql"
echo "  • View logs: docker-compose logs backend | grep 'RAB Create'"
echo "  • Restart frontend: docker-compose restart frontend"
echo ""
echo "=========================================="
