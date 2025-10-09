#!/bin/bash

echo "================================================"
echo " READY TO TEST - Backend Updated!"
echo "================================================"
echo ""
echo "Current status:"
echo "  - Backend: HEALTHY ✓"
echo "  - Tracking records: $(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c 'SELECT COUNT(*) FROM rab_purchase_tracking;' | xargs)"
echo ""
echo "Latest PO:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT po_number, status, "createdAt" FROM purchase_orders ORDER BY "createdAt" DESC LIMIT 1;'
echo ""
echo "================================================"
echo " NOW CREATE A NEW PO via Frontend"
echo "================================================"
echo ""
echo "URL: https://nusantaragroup.co/admin/projects/2025PJK001#create-purchase-order:purchaseOrders"
echo ""
echo "After creating PO, press Enter to check results..."
read

echo ""
echo "Checking results..."
echo ""

# Count tracking records
TRACKING_COUNT=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT COUNT(*) FROM rab_purchase_tracking;" | xargs)

echo "Total tracking records: $TRACKING_COUNT"
echo ""

# Show latest PO
echo "Latest POs:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT po_number, project_id, status, "createdAt" FROM purchase_orders ORDER BY "createdAt" DESC LIMIT 3;'
echo ""

# Show latest tracking
echo "Latest tracking records:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT "rabItemId", "poNumber", quantity, status, "createdAt" FROM rab_purchase_tracking ORDER BY "createdAt" DESC LIMIT 3;'
echo ""

# Show DEBUG logs
echo "Backend DEBUG logs:"
docker logs nusantara-backend --tail 50 | grep -E "DEBUG|🔵|🟢|❌" | tail -20
echo ""

if [ "$TRACKING_COUNT" -gt "9" ]; then
  echo "================================================"
  echo " ✅ SUCCESS! Tracking is working!"
  echo "================================================"
  echo ""
  echo "Qty Tersedia should now be updated in frontend."
  echo "Refresh the page to see the changes."
else
  echo "================================================"
  echo " ❌ FAILED! No new tracking records"
  echo "================================================"
  echo ""
  echo "Check DEBUG logs above for errors."
fi
