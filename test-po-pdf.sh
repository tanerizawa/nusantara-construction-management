#!/bin/bash

echo "=========================================="
echo "   TEST PURCHASE ORDER PDF GENERATION"
echo "=========================================="
echo ""

# Get token from environment or use default
TOKEN="${1:-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJVU1ItSVQtSEFERVotMDAxIiwidXNlcm5hbWUiOiJoYWRleiIsInJvbGUiOiJJVCBTdXBlcnZpc29yIiwiaWF0IjoxNzI5NjA2MjA4LCJleHAiOjE3Mjk2OTI2MDh9.dummy}"

# Find PO number
echo "1. Finding existing Purchase Order..."
PO_NUMBER=$(docker exec -i nusantara-postgres psql -U admin -d nusantara_construction -t -c "SELECT po_number FROM purchase_orders ORDER BY created_at DESC LIMIT 1;" | xargs)

if [ -z "$PO_NUMBER" ]; then
  echo "   ❌ No Purchase Order found"
  exit 1
fi

echo "   ✓ Found PO: $PO_NUMBER"
echo ""

# Get project and subsidiary info
echo "2. Checking PO relationship..."
docker exec -i nusantara-postgres psql -U admin -d nusantara_construction << EOF
SELECT 
  po.po_number,
  po.project_id,
  p.subsidiary_id,
  s.name as subsidiary_name,
  s.board_of_directors->0->>'name' as director_name
FROM purchase_orders po
LEFT JOIN projects p ON po.project_id = p.id
LEFT JOIN subsidiaries s ON p.subsidiary_id = s.id
WHERE po.po_number = '$PO_NUMBER';
EOF
echo ""

# Test PDF generation endpoint
echo "3. Testing PDF Generation..."
echo "   Endpoint: GET /api/purchase-orders/$PO_NUMBER/pdf"
echo ""

# Make request and save to file
curl -X GET \
  "http://localhost:5000/api/purchase-orders/$PO_NUMBER/pdf" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/pdf" \
  --silent \
  --output "/tmp/test-po-$PO_NUMBER.pdf" \
  --write-out "\n   Status: %{http_code}\n   Size: %{size_download} bytes\n"

if [ -f "/tmp/test-po-$PO_NUMBER.pdf" ]; then
  FILE_SIZE=$(stat -f%z "/tmp/test-po-$PO_NUMBER.pdf" 2>/dev/null || stat -c%s "/tmp/test-po-$PO_NUMBER.pdf" 2>/dev/null)
  
  if [ "$FILE_SIZE" -gt 1000 ]; then
    echo "   ✓ PDF Generated successfully!"
    echo "   📄 Location: /tmp/test-po-$PO_NUMBER.pdf"
    echo "   📊 Size: $FILE_SIZE bytes"
  else
    echo "   ❌ PDF file too small (might be error response)"
    cat "/tmp/test-po-$PO_NUMBER.pdf"
  fi
else
  echo "   ❌ PDF file not created"
fi

echo ""
echo "4. Backend Logs (PDF Generation):"
docker-compose logs --tail=30 backend 2>&1 | grep -A 5 -B 2 "Generating PDF\|Subsidiary data\|Company info\|director"

echo ""
echo "=========================================="
echo "   TEST COMPLETE"
echo "=========================================="
