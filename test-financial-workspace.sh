#!/bin/bash

echo "======================================"
echo "Financial Workspace Diagnostic Test"
echo "======================================"
echo ""

echo "1. Testing Backend API..."
echo "---"
BACKEND_TEST=$(curl -s http://localhost:5000/api/financial/dashboard/overview)
if echo "$BACKEND_TEST" | grep -q '"success":true'; then
    echo "✅ Backend API: WORKING"
    echo "   Revenue: $(echo $BACKEND_TEST | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['totalRevenue'])" 2>/dev/null || echo 'Unable to parse')"
    echo "   Expenses: $(echo $BACKEND_TEST | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['totalExpenses'])" 2>/dev/null || echo 'Unable to parse')"
else
    echo "❌ Backend API: FAILED"
    echo "   Response: $BACKEND_TEST"
fi
echo ""

echo "2. Testing Docker Containers..."
echo "---"
BACKEND_STATUS=$(docker inspect -f '{{.State.Status}}' nusantara-backend 2>/dev/null)
FRONTEND_STATUS=$(docker inspect -f '{{.State.Status}}' nusantara-frontend 2>/dev/null)

if [ "$BACKEND_STATUS" = "running" ]; then
    echo "✅ Backend Container: RUNNING"
else
    echo "❌ Backend Container: $BACKEND_STATUS"
fi

if [ "$FRONTEND_STATUS" = "running" ]; then
    echo "✅ Frontend Container: RUNNING"
else
    echo "❌ Frontend Container: $FRONTEND_STATUS"
fi
echo ""

echo "3. Testing Trends API..."
echo "---"
TRENDS_TEST=$(curl -s "http://localhost:5000/api/financial/dashboard/trends?periodType=monthly")
if echo "$TRENDS_TEST" | grep -q '"success":true'; then
    echo "✅ Trends API: WORKING"
    echo "   Data Points: $(echo $TRENDS_TEST | python3 -c "import sys, json; print(json.load(sys.stdin)['data']['dataPoints'])" 2>/dev/null || echo 'Unable to parse')"
else
    echo "❌ Trends API: FAILED"
fi
echo ""

echo "4. Checking Frontend Logs for Errors..."
echo "---"
FRONTEND_ERRORS=$(docker logs nusantara-frontend 2>&1 | grep -i "error" | tail -3)
if [ -z "$FRONTEND_ERRORS" ]; then
    echo "✅ No recent errors in frontend logs"
else
    echo "⚠️  Recent errors found:"
    echo "$FRONTEND_ERRORS"
fi
echo ""

echo "5. Checking Backend Logs for Errors..."
echo "---"
BACKEND_ERRORS=$(docker logs nusantara-backend 2>&1 | grep -i "error" | tail -3)
if [ -z "$BACKEND_ERRORS" ]; then
    echo "✅ No recent errors in backend logs"
else
    echo "⚠️  Recent errors found:"
    echo "$BACKEND_ERRORS"
fi
echo ""

echo "======================================"
echo "Diagnostic Complete"
echo "======================================"
echo ""
echo "Next Steps:"
echo "1. Open browser to: http://your-domain:3000/workspace/financial"
echo "2. Press F12 to open DevTools"
echo "3. Check Console tab for errors"
echo "4. Check Network tab for failed requests"
echo ""
echo "If dashboard still shows empty:"
echo "- Check browser console for '❌ [FINANCIAL WORKSPACE] Error' messages"
echo "- Look for 'AXIOS REQUEST DEBUG' logs"
echo "- Verify token in localStorage"
echo ""

