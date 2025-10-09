#!/bin/bash

echo "🎨 Updating Approval Dashboard Components..."

# Main Approval file
FILE="/root/APP-YK/frontend/src/components/workflow/approval/ProfessionalApprovalDashboard.js"
if [ -f "$FILE" ]; then
  echo "  Updating ProfessionalApprovalDashboard.js..."
  cp "$FILE" "$FILE.backup"
  
  # Compact spacing
  sed -i 's/space-y-6/space-y-4/g' "$FILE"
  sed -i 's/p-12/p-8/g' "$FILE"
fi

# Update all Approval component files
APPROVAL_COMPONENTS=(
  "/root/APP-YK/frontend/src/components/workflow/approval/components/ApprovalActions.js"
  "/root/APP-YK/frontend/src/components/workflow/approval/components/ApprovalStatusBadge.js"
  "/root/APP-YK/frontend/src/components/workflow/approval/components/index.js"
)

for FILE in "${APPROVAL_COMPONENTS[@]}"; do
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
    
    # Text colors
    sed -i 's/text-gray-900\b/text-white/g' "$FILE"
    sed -i 's/text-gray-800\b/text-[#EBEBF5]/g' "$FILE"
    sed -i 's/text-gray-700\b/text-[#98989D]/g' "$FILE"
    sed -i 's/text-gray-600\b/text-[#8E8E93]/g' "$FILE"
    sed -i 's/text-gray-500\b/text-[#98989D]/g' "$FILE"
    sed -i 's/text-gray-400\b/text-[#636366]/g' "$FILE"
    
    # Status colors
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
    
    # Status backgrounds
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
    sed -i 's/bg-orange-50\b/bg-[#FF9F0A]\/10/g' "$FILE"
    sed -i 's/bg-orange-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    
    # Border colors
    sed -i 's/border-blue-200\b/border-[#0A84FF]\/30/g' "$FILE"
    sed -i 's/border-green-200\b/border-[#30D158]\/30/g' "$FILE"
    sed -i 's/border-red-200\b/border-[#FF3B30]\/30/g' "$FILE"
    sed -i 's/border-yellow-200\b/border-[#FF9F0A]\/30/g' "$FILE"
    
    # Hover states
    sed -i 's/hover:bg-gray-50\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-gray-100\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-blue-600\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
    sed -i 's/hover:bg-blue-700\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
    sed -i 's/hover:bg-green-600\b/hover:bg-[#30D158]\/90/g' "$FILE"
    sed -i 's/hover:bg-green-700\b/hover:bg-[#30D158]\/90/g' "$FILE"
    sed -i 's/hover:bg-red-600\b/hover:bg-[#FF3B30]\/90/g' "$FILE"
    sed -i 's/hover:bg-red-700\b/hover:bg-[#FF3B30]\/90/g' "$FILE"
    
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
    
    # Text sizes
    sed -i 's/\btext-2xl\b/text-xl/g' "$FILE"
    sed -i 's/\btext-xl\b/text-lg/g' "$FILE"
    
  fi
done

echo "✅ Approval Dashboard components updated"
