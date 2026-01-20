#!/bin/bash
FILE="/root/APP-YK/frontend/src/pages/Inventory.js"

# Fix all remaining gray dividers
sed -i 's/divide-gray-200/divide-[#38383A]/g' "$FILE"

# Fix any remaining text colors
sed -i 's/text-green-800/text-[#30D158]/g' "$FILE"
sed -i 's/text-yellow-800/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-red-800/text-[#FF3B30]/g' "$FILE"
sed -i 's/text-blue-900/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-yellow-900/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-green-900/text-[#30D158]/g' "$FILE"
sed -i 's/text-red-900/text-[#FF3B30]/g' "$FILE"

# Fix hover states
sed -i 's/hover:text-blue-900/hover:text-[#0A84FF]\/80/g' "$FILE"
sed -i 's/hover:text-yellow-900/hover:text-[#FF9F0A]\/80/g' "$FILE"
sed -i 's/hover:text-green-900/hover:text-[#30D158]\/80/g' "$FILE"
sed -i 's/hover:text-red-900/hover:text-[#FF3B30]\/80/g' "$FILE"

# Fix shadow (remove or replace with border)
sed -i 's/rounded-lg shadow/rounded-lg/g' "$FILE"

echo "✅ All matte colors applied"
