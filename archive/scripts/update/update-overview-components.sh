#!/bin/bash

echo "🎨 Updating Overview Components..."

FILES=(
  "/root/APP-YK/frontend/src/pages/project-detail/components/FinancialSummary.js"
  "/root/APP-YK/frontend/src/pages/project-detail/components/QuickStats.js"
  "/root/APP-YK/frontend/src/pages/project-detail/components/RecentActivity.js"
  "/root/APP-YK/frontend/src/pages/project-detail/components/WorkflowStagesCard.js"
)

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "  Updating $(basename $FILE)..."
    cp "$FILE" "$FILE.backup"
    
    # Backgrounds
    sed -i 's/bg-white\b/bg-[#2C2C2E]/g' "$FILE"
    sed -i 's/bg-gray-50\b/bg-[#1C1C1E]/g' "$FILE"
    sed -i 's/bg-gray-100\b/bg-[#3A3A3C]/g' "$FILE"
    
    # Borders
    sed -i 's/border-gray-100\b/border-[#38383A]/g' "$FILE"
    sed -i 's/border-gray-200\b/border-[#38383A]/g' "$FILE"
    sed -i 's/border-gray-300\b/border-[#38383A]/g' "$FILE"
    
    # Text colors
    sed -i 's/text-gray-900\b/text-white/g' "$FILE"
    sed -i 's/text-gray-800\b/text-[#EBEBF5]/g' "$FILE"
    sed -i 's/text-gray-700\b/text-[#98989D]/g' "$FILE"
    sed -i 's/text-gray-600\b/text-[#8E8E93]/g' "$FILE"
    sed -i 's/text-gray-500\b/text-[#98989D]/g' "$FILE"
    sed -i 's/text-gray-400\b/text-[#636366]/g' "$FILE"
    
    # Status colors - text
    sed -i 's/text-blue-600\b/text-[#0A84FF]/g' "$FILE"
    sed -i 's/text-green-600\b/text-[#30D158]/g' "$FILE"
    sed -i 's/text-red-600\b/text-[#FF3B30]/g' "$FILE"
    sed -i 's/text-yellow-600\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-orange-600\b/text-[#FF9F0A]/g' "$FILE"
    
    # Status colors - backgrounds
    sed -i 's/bg-blue-100\b/bg-[#0A84FF]\/20/g' "$FILE"
    sed -i 's/bg-green-100\b/bg-[#30D158]\/20/g' "$FILE"
    sed -i 's/bg-red-100\b/bg-[#FF3B30]\/20/g' "$FILE"
    sed -i 's/bg-yellow-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    sed -i 's/bg-orange-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    
    # Badge text colors (old ones using -800)
    sed -i 's/text-blue-800\b/text-[#0A84FF]/g' "$FILE"
    sed -i 's/text-green-800\b/text-[#30D158]/g' "$FILE"
    sed -i 's/text-red-800\b/text-[#FF3B30]/g' "$FILE"
    sed -i 's/text-yellow-800\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-orange-800\b/text-[#FF9F0A]/g' "$FILE"
    
    # Remove shadows
    sed -i 's/\bshadow-sm\b//g' "$FILE"
    sed -i 's/\bshadow-md\b//g' "$FILE"
    sed -i 's/\bshadow-lg\b//g' "$FILE"
    sed -i 's/\bshadow\b//g' "$FILE"
    
    # Compact spacing
    sed -i 's/\brounded-xl\b/rounded-lg/g' "$FILE"
    sed -i 's/\bp-6\b/p-4/g' "$FILE"
    sed -i 's/\bpx-6\b/px-4/g' "$FILE"
    sed -i 's/\bpy-4\b/py-3/g' "$FILE"
    sed -i 's/\bspace-y-6\b/space-y-4/g' "$FILE"
    sed -i 's/\bgap-6\b/gap-4/g' "$FILE"
    
    # Text sizes compact
    sed -i 's/\btext-lg\b/text-base/g' "$FILE"
    sed -i 's/\btext-xl\b/text-lg/g' "$FILE"
    sed -i 's/\btext-2xl\b/text-xl/g' "$FILE"
    
  fi
done

echo "✅ Overview components updated"
