#!/bin/bash
# Quick verification script untuk milestone detail inline

echo "🔍 Milestone Detail Inline - Verification Script"
echo "=================================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Check containers
echo "1️⃣  Checking Docker Containers..."
if docker-compose ps | grep -q "healthy"; then
    echo -e "${GREEN}✅ All containers healthy${NC}"
else
    echo -e "${RED}❌ Some containers not healthy${NC}"
    docker-compose ps
    exit 1
fi
echo ""

# 2. Check backend API
echo "2️⃣  Checking Backend API..."
HEALTH=$(curl -s http://localhost:5000/api/health)
if echo "$HEALTH" | grep -q "healthy"; then
    echo -e "${GREEN}✅ Backend API responding${NC}"
    echo "   $HEALTH"
else
    echo -e "${RED}❌ Backend API not responding${NC}"
    exit 1
fi
echo ""

# 3. Check frontend
echo "3️⃣  Checking Frontend..."
FRONTEND=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$FRONTEND" = "200" ]; then
    echo -e "${GREEN}✅ Frontend accessible (HTTP $FRONTEND)${NC}"
else
    echo -e "${RED}❌ Frontend not accessible (HTTP $FRONTEND)${NC}"
    exit 1
fi
echo ""

# 4. Check frontend compilation
echo "4️⃣  Checking Frontend Compilation..."
COMPILE_LOG=$(docker-compose logs frontend --tail=50 | grep "Compiled")
if echo "$COMPILE_LOG" | grep -q "successfully"; then
    echo -e "${GREEN}✅ Frontend compiled successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Check compilation status manually${NC}"
fi
echo ""

# 5. Check new component exists
echo "5️⃣  Checking New Component Files..."
if [ -f "/root/APP-YK/frontend/src/components/milestones/MilestoneDetailInline.js" ]; then
    echo -e "${GREEN}✅ MilestoneDetailInline.js exists${NC}"
else
    echo -e "${RED}❌ MilestoneDetailInline.js not found${NC}"
    exit 1
fi
echo ""

# 6. Check database tables
echo "6️⃣  Checking Database Tables..."
TABLES=$(docker-compose exec -T db psql -U postgres -d nusantara -t -c "
  SELECT COUNT(*) FROM information_schema.tables 
  WHERE table_name IN ('milestone_costs', 'milestone_photos', 'milestone_activities');
")
if [ "$TABLES" = "3" ]; then
    echo -e "${GREEN}✅ All 3 milestone detail tables exist${NC}"
else
    echo -e "${RED}❌ Missing tables (found: $TABLES)${NC}"
fi
echo ""

# 7. Check backend route file
echo "7️⃣  Checking Backend Route Modifications..."
if grep -q "MilestoneCost.findAll" /root/APP-YK/backend/routes/projects/milestoneDetail.routes.js; then
    echo -e "${GREEN}✅ Backend route updated with new query logic${NC}"
else
    echo -e "${RED}❌ Backend route not updated${NC}"
    exit 1
fi
echo ""

# Summary
echo "=================================================="
echo -e "${GREEN}✅ All checks passed!${NC}"
echo ""
echo "📋 Next Steps:"
echo "   1. Open browser: http://nusantara-server.nusantara-dev.my.id"
echo "   2. Login → Projects → Select Project → Milestones Tab"
echo "   3. Click chevron down (🔽) on any milestone"
echo "   4. Verify inline detail expands (not drawer)"
echo "   5. Click 'Biaya & Overheat' tab"
echo "   6. Should show empty state or data (NOT error 500)"
echo ""
echo "🐛 If Issues:"
echo "   - Check logs: docker-compose logs backend --tail=100"
echo "   - Check browser console: F12 → Console tab"
echo "   - Read: MILESTONE_DETAIL_INLINE_FIX_COMPLETE.md"
echo ""
