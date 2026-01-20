#!/bin/bash

echo "🎨 Updating Sidebar Components..."

# Array of sidebar component files
FILES=(
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/SidebarHeader.js"
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/ProjectInfo.js"
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/UrgentNotifications.js"
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/NavigationTabs.js"
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/TabItem.js"
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/QuickActions.js"
  "/root/APP-YK/frontend/src/components/workflow/sidebar/components/SidebarLoading.js"
)

for FILE in "${FILES[@]}"; do
  if [ -f "$FILE" ]; then
    echo "  Updating $(basename $FILE)..."
    cp "$FILE" "$FILE.backup"
    
    # Background colors
    sed -i 's/bg-white\b/bg-[#2C2C2E]/g' "$FILE"
    sed -i 's/bg-gray-50\b/bg-[#1C1C1E]/g' "$FILE"
    sed -i 's/bg-gray-100\b/bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/bg-gray-800\b/bg-[#2C2C2E]/g' "$FILE"
    sed -i 's/bg-gray-900\b/bg-[#1C1C1E]/g' "$FILE"
    
    # Hover backgrounds
    sed -i 's/hover:bg-gray-50\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-gray-100\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-gray-700\b/hover:bg-[#3A3A3C]/g' "$FILE"
    sed -i 's/hover:bg-gray-800\b/hover:bg-[#3A3A3C]/g' "$FILE"
    
    # Border colors
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
    
    # Status colors
    sed -i 's/text-blue-600\b/text-[#0A84FF]/g' "$FILE"
    sed -i 's/text-green-600\b/text-[#30D158]/g' "$FILE"
    sed -i 's/text-red-600\b/text-[#FF3B30]/g' "$FILE"
    sed -i 's/text-yellow-600\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-orange-600\b/text-[#FF9F0A]/g' "$FILE"
    sed -i 's/text-purple-600\b/text-[#BF5AF2]/g' "$FILE"
    
    # Badge backgrounds
    sed -i 's/bg-blue-100\b/bg-[#0A84FF]\/20/g' "$FILE"
    sed -i 's/bg-green-100\b/bg-[#30D158]\/20/g' "$FILE"
    sed -i 's/bg-red-100\b/bg-[#FF3B30]\/20/g' "$FILE"
    sed -i 's/bg-yellow-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    sed -i 's/bg-orange-100\b/bg-[#FF9F0A]\/20/g' "$FILE"
    sed -i 's/bg-purple-100\b/bg-[#BF5AF2]\/20/g' "$FILE"
    
    # Button colors
    sed -i 's/bg-blue-500\b/bg-[#0A84FF]/g' "$FILE"
    sed -i 's/bg-blue-600\b/bg-[#0A84FF]/g' "$FILE"
    sed -i 's/hover:bg-blue-600\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
    sed -i 's/hover:bg-blue-700\b/hover:bg-[#0A84FF]\/90/g' "$FILE"
    
    # Remove shadows
    sed -i 's/\bshadow-sm\b//g' "$FILE"
    sed -i 's/\bshadow-md\b//g' "$FILE"
    sed -i 's/\bshadow-lg\b//g' "$FILE"
    sed -i 's/\bshadow\b//g' "$FILE"
    
  fi
done

echo "✅ Sidebar components updated"
