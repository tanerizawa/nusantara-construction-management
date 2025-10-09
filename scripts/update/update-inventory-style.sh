#!/bin/bash
FILE="/root/APP-YK/frontend/src/pages/Inventory.js"
cp "$FILE" "$FILE.backup"

# Background colors
sed -i 's/bg-gray-50\|bg-white/bg-[#1C1C1E]/g' "$FILE"
sed -i 's/bg-gray-100/bg-[#2C2C2E]/g' "$FILE"
sed -i 's/bg-blue-50/bg-[#0A84FF]\/10/g' "$FILE"
sed -i 's/bg-blue-100/bg-[#0A84FF]\/20/g' "$FILE"
sed -i 's/bg-green-100/bg-[#30D158]\/20/g' "$FILE"
sed -i 's/bg-yellow-100/bg-[#FF9F0A]\/20/g' "$FILE"
sed -i 's/bg-purple-100/bg-[#BF5AF2]\/20/g' "$FILE"
sed -i 's/bg-red-100/bg-[#FF3B30]\/20/g' "$FILE"

# Card backgrounds
sed -i 's/"bg-white rounded-lg shadow/"bg-[#2C2C2E] border border-[#38383A] rounded-lg/g' "$FILE"

# Text colors
sed -i 's/text-gray-900/text-white/g' "$FILE"
sed -i 's/text-gray-800/text-[#EBEBF5]/g' "$FILE"
sed -i 's/text-gray-700/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-600/text-[#8E8E93]/g' "$FILE"
sed -i 's/text-gray-500/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-400/text-[#636366]/g' "$FILE"

# Button colors
sed -i 's/bg-blue-600/bg-[#0A84FF]/g' "$FILE"
sed -i 's/hover:bg-blue-700/hover:bg-[#0A84FF]\/90/g' "$FILE"
sed -i 's/bg-green-600/bg-[#30D158]/g' "$FILE"
sed -i 's/hover:bg-green-700/hover:bg-[#30D158]\/90/g' "$FILE"
sed -i 's/bg-red-600/bg-[#FF3B30]/g' "$FILE"
sed -i 's/hover:bg-red-700/hover:bg-[#FF3B30]\/90/g' "$FILE"

# Icon colors
sed -i 's/text-blue-600/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-blue-800/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-blue-700/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-green-600/text-[#30D158]/g' "$FILE"
sed -i 's/text-yellow-600/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-purple-600/text-[#BF5AF2]/g' "$FILE"
sed -i 's/text-red-600/text-[#FF3B30]/g' "$FILE"

# Border colors
sed -i 's/border-gray-300/border-[#38383A]/g' "$FILE"
sed -i 's/border-gray-200/border-[#38383A]/g' "$FILE"

# Focus states
sed -i 's/focus:ring-blue-500/focus:ring-[#0A84FF]/g' "$FILE"

echo "✅ Inventory styling updated"
