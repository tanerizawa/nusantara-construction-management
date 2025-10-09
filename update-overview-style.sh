#!/bin/bash

FILE="/root/APP-YK/frontend/src/pages/project-detail/components/ProjectOverview.js"
cp "$FILE" "$FILE.backup"

# Backgrounds
sed -i 's/bg-white/bg-[#2C2C2E]/g' "$FILE"
sed -i 's/bg-gray-50/bg-[#1C1C1E]/g' "$FILE"
sed -i 's/bg-gray-100/bg-[#3A3A3C]/g' "$FILE"

# Borders
sed -i 's/border-gray-200/border-[#38383A]/g' "$FILE"
sed -i 's/border-gray-300/border-[#38383A]/g' "$FILE"
sed -i 's/divide-gray-200/divide-[#38383A]/g' "$FILE"

# Text colors
sed -i 's/text-gray-900/text-white/g' "$FILE"
sed -i 's/text-gray-800/text-[#EBEBF5]/g' "$FILE"
sed -i 's/text-gray-700/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-600/text-[#8E8E93]/g' "$FILE"
sed -i 's/text-gray-500/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-400/text-[#636366]/g' "$FILE"

# Status colors
sed -i 's/text-blue-600/text-[#0A84FF]/g' "$FILE"
sed -i 's/text-green-600/text-[#30D158]/g' "$FILE"
sed -i 's/text-yellow-600/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-red-600/text-[#FF3B30]/g' "$FILE"

sed -i 's/bg-blue-100/bg-[#0A84FF]\/20/g' "$FILE"
sed -i 's/bg-green-100/bg-[#30D158]\/20/g' "$FILE"
sed -i 's/bg-yellow-100/bg-[#FF9F0A]\/20/g' "$FILE"
sed -i 's/bg-red-100/bg-[#FF3B30]\/20/g' "$FILE"

# Buttons
sed -i 's/bg-blue-500/bg-[#0A84FF]/g' "$FILE"
sed -i 's/hover:bg-blue-600/hover:bg-[#0A84FF]\/90/g' "$FILE"

# Remove shadows
sed -i 's/shadow-sm//g' "$FILE"
sed -i 's/shadow-md//g' "$FILE"
sed -i 's/shadow-lg//g' "$FILE"

echo "✅ ProjectOverview.js styling updated"
