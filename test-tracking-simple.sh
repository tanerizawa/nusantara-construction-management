#!/bin/bash

# Simple test without jq
PROJECT_ID="2025PJK001"
BASE_URL="https://nusantaragroup.co/api"

echo "🧪 Testing RAB Quantity Tracking"
echo "=================================="
echo ""

echo "1️⃣ Current Purchase Summary:"
echo "----------------------------"
curl -s "${BASE_URL}/rab-tracking/projects/${PROJECT_ID}/purchase-summary" | python3 -m json.tool 2>/dev/null || curl -s "${BASE_URL}/rab-tracking/projects/${PROJECT_ID}/purchase-summary"
echo ""
echo ""

echo "2️⃣ Latest POs for project:"
echo "----------------------------"
curl -s "${BASE_URL}/purchase-orders?projectId=${PROJECT_ID}&limit=3&sort=orderDate&order=desc" | python3 -m json.tool 2>/dev/null | head -100 || curl -s "${BASE_URL}/purchase-orders?projectId=${PROJECT_ID}&limit=3"
echo ""
echo ""

echo "✅ Test Instructions:"
echo "-------------------"
echo "1. Cek item dengan rabItemId tertentu"
echo "2. Catat totalPurchased saat ini"
echo "3. Buat PO baru dengan quantity 500"
echo "4. Run script ini lagi"
echo "5. Verify totalPurchased bertambah 500"
echo ""
echo "Jika totalPurchased TIDAK bertambah, berarti ada masalah di:"
echo "  - Backend tidak save ke rab_purchase_tracking"
echo "  - Transaction rollback"
echo "  - inventoryId tidak match dengan rabItemId"
