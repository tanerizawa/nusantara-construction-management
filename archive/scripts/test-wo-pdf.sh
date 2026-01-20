#!/bin/bash

# Script untuk test Work Order PDF generation
# Usage: ./test-wo-pdf.sh

WO_ID="WO-1760638408861-2956senjj"

echo "🔍 Testing Work Order PDF generation..."
echo "📋 WO ID: $WO_ID"
echo ""

# Make API request
curl -X GET "http://localhost:5000/api/work-orders/${WO_ID}/pdf" \
  -H "Accept: application/pdf" \
  -o "/tmp/test-wo-${WO_ID}.pdf" \
  -w "\nHTTP Status: %{http_code}\n" \
  -v 2>&1

echo ""
echo "✅ PDF saved to: /tmp/test-wo-${WO_ID}.pdf"
echo ""
echo "📊 Checking backend logs for director info..."
echo ""

# Show relevant logs
docker-compose logs --tail=50 backend | grep -E "director|Director|_getDirectorInfo|Company info for PDF|board_of_directors" --color=always

echo ""
echo "✅ Test complete!"
