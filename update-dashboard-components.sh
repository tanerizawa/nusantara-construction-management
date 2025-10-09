#!/bin/bash

FILE="/root/APP-YK/frontend/src/components/common/DashboardComponents.js"
cp "$FILE" "$FILE.backup"

echo "🎨 Updating DashboardComponents..."

sed -i 's/bg-white\b/bg-[#2C2C2E]/g' "$FILE"
sed -i 's/bg-gray-50\b/bg-[#1C1C1E]/g' "$FILE"
sed -i 's/bg-gray-100\b/bg-[#3A3A3C]/g' "$FILE"

sed -i 's/border-gray-200\b/border-[#38383A]/g' "$FILE"
sed -i 's/border-gray-300\b/border-[#38383A]/g' "$FILE"

sed -i 's/text-gray-900\b/text-white/g' "$FILE"
sed -i 's/text-gray-800\b/text-[#EBEBF5]/g' "$FILE"
sed -i 's/text-gray-700\b/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-600\b/text-[#8E8E93]/g' "$FILE"
sed -i 's/text-gray-500\b/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-400\b/text-[#636366]/g' "$FILE"

sed -i 's/text-blue-600\b/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-green-600\b/text-[#30D158]/g' "$FILE"
sed -i 's/text-red-600\b/text-[#FF3B30]/g' "$FILE"

sed -i 's/bg-blue-100\b/bg-[#0A84FF]\/20/g' "$FILE"
sed -i 's/bg-green-100\b/bg-[#30D158]\/20/g' "$FILE"
sed -i 's/bg-red-100\b/bg-[#FF3B30]\/20/g' "$FILE"

sed -i 's/border-blue-500\b/border-[#0A84FF]/g' "$FILE"

sed -i 's/\bshadow-sm\b//g' "$FILE"
sed -i 's/\bshadow-md\b//g' "$FILE"
sed -i 's/\bshadow\b//g' "$FILE"

echo "✅ DashboardComponents.js updated"
