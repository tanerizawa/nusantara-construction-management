#!/bin/bash
FILE="/root/APP-YK/frontend/src/pages/Inventory.js"

# Update all select elements
sed -i 's/className="px-3 py-2 border border-\[#38383A\] rounded-lg focus:ring-2 focus:ring-\[#0A84FF\] focus:border-transparent"/className="px-3 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white"/g' "$FILE"

sed -i 's/className="px-4 py-2 border border-\[#38383A\] rounded-lg focus:ring-2 focus:ring-\[#0A84FF\] focus:border-transparent"/className="px-4 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white"/g' "$FILE"

# Update input fields that don't have bg class yet
sed -i 's/className="pl-10 pr-4 py-2 border border-\[#38383A\] rounded-lg focus:ring-2 focus:ring-\[#0A84FF\] focus:border-transparent"/className="pl-10 pr-4 py-2 border border-[#38383A] rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent bg-[#1C1C1E] text-white placeholder-[#636366]"/g' "$FILE"

echo "✅ All select and input fields updated"
