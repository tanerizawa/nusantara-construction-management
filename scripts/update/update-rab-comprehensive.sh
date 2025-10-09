#!/bin/bash

echo "🎨 Updating RAB Workflow Components..."

# Main RAB file
FILE="/root/APP-YK/frontend/src/components/workflow/ProjectRABWorkflow.js"
if [ -f "$FILE" ]; then
  echo "  Updating ProjectRABWorkflow.js..."
  cp "$FILE" "$FILE.backup"
  
  # Remove debug section
  sed -i '/DEBUG INDICATOR/,/^[[:space:]]*<\/div>$/d' "$FILE"
  
  # Update header section colors
  sed -i 's/text-xl/text-lg/g' "$FILE"
  sed -i 's/space-y-6/space-y-4/g' "$FILE"
  
  # Update table card
  sed -i 's/bg-\[#2C2C2E\] rounded-lg shadow/bg-[#2C2C2E] rounded-lg border border-[#38383A]/g' "$FILE"
  sed -i 's/px-6 py-4/px-4 py-3/g' "$FILE"
  sed -i 's/text-lg font-medium/text-base font-semibold/g' "$FILE"
  
  # Update grid
  sed -i 's/gap-6/gap-4/g' "$FILE"
fi

# Update all RAB component files
RAB_COMPONENTS=(
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/RABSummaryCards.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/RABItemsTable.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/RABItemForm.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/RABBreakdownChart.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/RABStatistics.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/StatusBadge.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/WorkflowActions.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/EmptyState.js"
  "/root/APP-YK/frontend/src/components/workflow/rab-workflow/components/Notification.js"
)

for FILE in "${RAB_COMPONENTS[@]}"; do
  if [ -f "$FILE" ]; then
    echo "  Updating $(basename $FILE)..."
    cp "$FILE" "$FILE.backup"
    
    # Backgrounds
    sed -i 's/bg-white\b/bg-[#2C2C2E]/g' "$FILE"
    sed -i 's/bg-gray-50\b/bg-[#1C1C1E]/g' "$FILE"
    sed -i 's/bg-gray-100\b/bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/bg-gray-800\b/bg-[#2C2C2E]/g' "$FILE"
    sed -i 's/bg-gray-900\b/bg-[#1C1C1E]/g' "$FILE"
    
    # Borders
    sed -i 's/border-gray-100\b/border-[#38383A]/g' "$FILE"
    sed -i 's/border-gray-200\b/border-[#38383A]/g' "$FILE"
    sed -i 's/border-gray-300\b/border-[#38383A]/g' "$FILE"
    sed -i 's/border-gray-600\b/border-[#38383A]/g' "$FILE"
    sed -i 's/border-gray-700\b/border-[#38383A]/g' "$FILE"
    
    # Text colors
    sed -i 's/text-gray-900\b/text-white/g' "$FILE"
    sed -i 's/text-gray-800\b/text-[#EBEBF5]/g' "$FILE"
    sed -i 's/text-gray-700\b/text-[#98989D]/g' "$FILE"
    sed -i 's/text-gray-600\b/text-[#8E8E93]/g' "$FILE"
    sed -i 's/text-gray-500\b/text-[#98989D]/g' "$FILE"
    sed -i 's/text-gray-400\b/text-[#636366]/g' "$FILE"
    sed -i 's/text-gray-300\b/text-[#98989D]/g' "$FILE"
    
    # Status colors - text
    sed -i 's/text-blue-600\b/text-[#0A84FF]/g' "$FILE"
    sed -i 's/text-blue-700\b/text-[#0A84FF]/g' "$FILE"
    sed -i 's/text-blue-800\b/text-[#0A84FF]/g' "$FILE"
    sed -i 's/text-green-600\b/text-[#30D158]/g' "$FILE"
    sed -i 's/text-green-700\b/text-[#30D158]/g' "$FILE"
    sed -i 's/text-green-800\b/text-[#30D158]/g' "$FILE"
    sed -i 's/text-red-600\b/text-[#FF3B30]/g' "$FILE"
    sed -i 's/text-red-700\b/text-[#FF3B30]/g' "$FILE"
    sed -i 's/text-red-800\b/text-[#FF3B30]/g' "$FILE"
    sed -i 's/text-yellow-600\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-yellow-700\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-yellow-800\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-orange-600\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-orange-700\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-orange-800\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-purple-600\b/text-[#BF5AF2]/g' "$FILE"
    sed -i 's/text-purple-700\b/text-[#BF5AF2]/g' "$FILE"
    
    # Status colors - backgrounds
    sed -i 's/bg-blue-50\b/bg-[#0A84FF]\/10/g' "$FILE"
    sed -i 's/bg-blue-100\b/bg-[#0A84FF]\/20/g' "$FILE"
    sed -i 's/bg-blue-500\b/bg-[#0A84FF]/g' "$FILE"
    sed -i 's/bg-blue-600\b/bg-[#0A84FF]/g' "$FILE"
    sed -i 's/bg-green-50\b/bg-[#30D158]\/10/g' "$FILE"
    sed -i 's/bg-green-100\b/bg-[#30D158]\/20/g' "$FILE"
    sed -i 's/bg-green-500\b/bg-[#30D158]/g' "$FILE"
    sed -i 's/bg-green-600\b/bg-[#30D158]/g' "$FILE"
    sed -i 's/bg-red-50\b/bg-[#FF3B30]\/10/g' "$FILE"
    sed -i 's/bg-red-100\b/bg-[#FF3B30]\/20/g' "$FILE"
    sed -i 's/bg-red-500\b/bg-[#FF3B30]/g' "$FILE"
    sed -i 's/bg-red-600\b/bg-[#FF3B30]/g' "$FILE"
    sed -i 's/bg-yellow-50\b/bg-[#FF9F0A]\/10/g' "$FILE"
    sed -i 's/bg-yellow-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    sed -i 's/bg-yellow-500\b/bg-[#FF9F0A]/g' "$FILE"
    sed -i 's/bg-orange-50\b/bg-[#FF9F0A]\/10/g' "$FILE"
    sed -i 's/bg-orange-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    sed -i 's/bg-purple-50\b/bg-[#BF5AF2]\/10/g' "$FILE"
    sed -i 's/bg-purple-100\b/bg-[#BF5AF2]\/20/g' "$FILE"
    
    # Border colors for status
    sed -i 's/border-blue-200\b/border-[#0A84FF]\/30/g' "$FILE"
    sed -i 's/border-blue-300\b/border-[#0A84FF]\/30/g' "$FILE"
    sed -i 's/border-green-200\b/border-[#30D158]\/30/g' "$FILE"
    sed -i 's/border-green-300\b/border-[#30D158]\/30/g' "$FILE"
    sed -i 's/border-red-200\b/border-[#FF3B30]\/30/g' "$FILE"
    sed -i 's/border-red-300\b/border-[#FF3B30]\/30/g' "$FILE"
    sed -i 's/border-yellow-200\b/border-[#FF9F0A]\/30/g' "$FILE"
    sed -i 's/border-yellow-300\b/border-[#FF9F0A]\/30/g' "$FILE"
    sed -i 's/border-yellow-400\b/border-[#FF9F0A]\/30/g' "$FILE"
    
    # Hover states
    sed -i 's/hover:bg-gray-50\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-gray-100\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-blue-600\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
    sed -i 's/hover:bg-blue-700\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
    sed -i 's/hover:bg-green-600\b/hover:bg-[#30D158]\/90/g' "$FILE"
    sed -i 's/hover:bg-red-600\b/hover:bg-[#FF3B30]\/90/g' "$FILE"
    
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
    sed -i 's/\bpy-6\b/py-4/g' "$FILE"
    sed -i 's/\bspace-y-6\b/space-y-4/g' "$FILE"
    sed -i 's/\bgap-6\b/gap-4/g' "$FILE"
    
    # Text sizes compact
    sed -i 's/\btext-2xl\b/text-xl/g' "$FILE"
    sed -i 's/\btext-xl\b/text-lg/g' "$FILE"
    
  fi
done

echo "✅ RAB Workflow components updated"
