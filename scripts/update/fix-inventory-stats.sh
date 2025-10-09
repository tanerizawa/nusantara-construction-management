#!/bin/bash
FILE="/root/APP-YK/frontend/src/pages/Inventory.js"

# Update all stat card styling
sed -i 's/bg-\[#1C1C1E\] rounded-lg shadow p-6/bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4/g' "$FILE"
sed -i 's/"h-6 w-6/"h-5 w-5/g' "$FILE"
sed -i 's/"ml-4/"ml-3/g' "$FILE"
sed -i 's/"text-2xl font-semibold/"text-xl font-semibold/g' "$FILE"
sed -i 's/"text-lg font-semibold/"text-base font-semibold/g' "$FILE"
sed -i 's/"text-sm text-\[#98989D\]/"text-xs text-[#98989D]/g' "$FILE"
sed -i 's/gap-6/gap-4/g' "$FILE"
sed -i 's/space-y-6/space-y-4/g' "$FILE"

echo "✅ Stat cards updated to compact style"
