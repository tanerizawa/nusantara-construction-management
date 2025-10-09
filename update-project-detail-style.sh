#!/bin/bash

FILE="/root/APP-YK/frontend/src/pages/project-detail/ProjectDetail.js"
cp "$FILE" "$FILE.backup"

# Main background
sed -i 's/bg-gray-50/bg-[#1C1C1E]/g' "$FILE"

# Sidebar
sed -i 's/bg-white shadow-sm/bg-[#2C2C2E]/g' "$FILE"
sed -i 's/border-gray-200/border-[#38383A]/g' "$FILE"

# Loading spinner
sed -i 's/border-blue-500/border-[#0A84FF]/g' "$FILE"
sed -i 's/text-gray-600/text-[#8E8E93]/g' "$FILE"

# Error/Not found states
sed -i 's/text-red-500/text-[#FF3B30]/g' "$FILE"
sed -i 's/text-gray-900/text-white/g' "$FILE"
sed -i 's/text-gray-400/text-[#636366]/g' "$FILE"

# Buttons
sed -i 's/bg-blue-500/bg-[#0A84FF]/g' "$FILE"
sed -i 's/hover:bg-blue-600/hover:bg-[#0A84FF]\/90/g' "$FILE"

echo "✅ ProjectDetail.js styling updated"
