#!/bin/bash

FILE="/root/APP-YK/frontend/src/pages/Dashboard.js"
cp "$FILE" "$FILE.backup"

echo "🎨 Updating Dashboard styling..."

# Main backgrounds
sed -i 's/bg-gray-50\b/bg-[#1C1C1E]/g' "$FILE"
sed -i 's/bg-white\b/bg-[#2C2C2E]/g' "$FILE"
sed -i 's/bg-gray-100\b/bg-[#3A3A3C]/g' "$FILE"

# Borders
sed -i 's/border-gray-200\b/border-[#38383A]/g' "$FILE"
sed -i 's/border-gray-300\b/border-[#38383A]/g' "$FILE"
sed -i 's/divide-gray-200\b/divide-[#38383A]/g' "$FILE"

# Text colors
sed -i 's/text-gray-900\b/text-white/g' "$FILE"
sed -i 's/text-gray-800\b/text-[#EBEBF5]/g' "$FILE"
sed -i 's/text-gray-700\b/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-600\b/text-[#8E8E93]/g' "$FILE"
sed -i 's/text-gray-500\b/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-400\b/text-[#636366]/g' "$FILE"

# Status colors
sed -i 's/text-blue-600\b/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-blue-500\b/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-green-600\b/text-[#30D158]/g' "$FILE"
sed -i 's/text-green-500\b/text-[#30D158]/g' "$FILE"
sed -i 's/text-yellow-600\b/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-yellow-500\b/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-red-600\b/text-[#FF3B30]/g' "$FILE"
sed -i 's/text-red-500\b/text-[#FF3B30]/g' "$FILE"
sed -i 's/text-purple-600\b/text-[#BF5AF2]/g' "$FILE"

# Background colors for badges/alerts
sed -i 's/bg-blue-100\b/bg-[#0A84FF]\/20/g' "$FILE"
sed -i 's/bg-blue-50\b/bg-[#0A84FF]\/10/g' "$FILE"
sed -i 's/bg-green-100\b/bg-[#30D158]\/20/g' "$FILE"
sed -i 's/bg-green-50\b/bg-[#30D158]\/10/g' "$FILE"
sed -i 's/bg-yellow-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
sed -i 's/bg-yellow-50\b/bg-[#FF9F0A]\/10/g' "$FILE"
sed -i 's/bg-red-100\b/bg-[#FF3B30]\/20/g' "$FILE"
sed -i 's/bg-red-50\b/bg-[#FF3B30]\/10/g' "$FILE"
sed -i 's/bg-purple-100\b/bg-[#BF5AF2]\/20/g' "$FILE"

# Buttons
sed -i 's/bg-blue-500\b/bg-[#0A84FF]/g' "$FILE"
sed -i 's/bg-blue-600\b/bg-[#0A84FF]/g' "$FILE"
sed -i 's/hover:bg-blue-600\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
sed -i 's/hover:bg-blue-700\b/hover:bg-[#0A84FF]\/90/g' "$FILE"

# Loading/spinner colors
sed -i 's/border-blue-500\b/border-[#0A84FF]/g' "$FILE"

# Remove shadows for matte design
sed -i 's/\bshadow-sm\b//g' "$FILE"
sed -i 's/\bshadow-md\b//g' "$FILE"
sed -i 's/\bshadow-lg\b//g' "$FILE"
sed -i 's/\bshadow\b//g' "$FILE"

echo "✅ Dashboard.js updated"
