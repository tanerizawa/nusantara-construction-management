#!/bin/bash

echo "================================================"
echo " MONITORING: Waiting for New PO Creation..."
echo "================================================"
echo ""
echo "Current tracking records count:"
BEFORE=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT COUNT(*) FROM rab_purchase_tracking;")
echo "  Total: $BEFORE"
echo ""
echo "Latest PO:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT po_number, "createdAt" FROM purchase_orders ORDER BY "createdAt" DESC LIMIT 1;'
echo ""
echo "================================================"
echo " CREATE A NEW PO NOW via Frontend!"
echo "================================================"
echo ""
echo "Press Enter after creating the PO..."
read

echo ""
echo "Checking results..."
echo ""

# Check tracking records
AFTER=$(docker exec nusantara-postgres psql -U admin -d nusantara_construction -t -c \
  "SELECT COUNT(*) FROM rab_purchase_tracking;")
echo "Tracking records count:"
echo "  Before: $BEFORE"
echo "  After:  $AFTER"

if [ "$AFTER" -gt "$BEFORE" ]; then
  echo "  ✅ SUCCESS! New tracking record(s) created!"
else
  echo "  ❌ FAILED! No new tracking records."
fi
echo ""

# Check latest POs
echo "Latest POs:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT po_number, project_id, status, "createdAt" FROM purchase_orders ORDER BY "createdAt" DESC LIMIT 3;'
echo ""

# Check latest tracking records
echo "Latest tracking records:"
docker exec nusantara-postgres psql -U admin -d nusantara_construction -c \
  'SELECT "rabItemId", "poNumber", quantity, status, "createdAt" FROM rab_purchase_tracking ORDER BY "createdAt" DESC LIMIT 3;'
echo ""

# Check backend logs
echo "Backend logs (last 30 lines with DEBUG):"
docker logs nusantara-backend --tail 100 | grep -E "DEBUG|🔵|🟢|❌" | tail -30
echo ""
echo "================================================"
