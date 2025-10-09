#!/bin/bash

echo "🎨 Updating all workflow component styles..."

# Find all JS files in workflow directory
find /root/APP-YK/frontend/src/components/workflow -name "*.js" -type f | while read file; do
    # Skip backup files
    if [[ "$file" == *.backup ]]; then
        continue
    fi
    
    # Create backup
    cp "$file" "$file.backup.$(date +%s)" 2>/dev/null
    
    # Apply comprehensive styling
    sed -i 's/bg-white\b/bg-[#2C2C2E]/g' "$file"
    sed -i 's/bg-gray-50\b/bg-[#1C1C1E]/g' "$file"
    sed -i 's/bg-gray-100\b/bg-[#3A3A3C]/g' "$file"
    sed -i 's/bg-gray-200\b/bg-[#48484A]/g' "$file"
    
    sed -i 's/border-gray-200\b/border-[#38383A]/g' "$file"
    sed -i 's/border-gray-300\b/border-[#38383A]/g' "$file"
    sed -i 's/divide-gray-200\b/divide-[#38383A]/g' "$file"
    
    sed -i 's/text-gray-900\b/text-white/g' "$file"
    sed -i 's/text-gray-800\b/text-[#EBEBF5]/g' "$file"
    sed -i 's/text-gray-700\b/text-[#98989D]/g' "$file"
    sed -i 's/text-gray-600\b/text-[#8E8E93]/g' "$file"
    sed -i 's/text-gray-500\b/text-[#98989D]/g' "$file"
    sed -i 's/text-gray-400\b/text-[#636366]/g' "$file"
    
    sed -i 's/text-blue-600\b/text-[#0A84FF]/g' "$file"
    sed -i 's/text-blue-500\b/text-[#0A84FF]/g' "$file"
    sed -i 's/text-green-600\b/text-[#30D158]/g' "$file"
    sed -i 's/text-green-500\b/text-[#30D158]/g' "$file"
    sed -i 's/text-yellow-600\b/text-[#FF9F0A]/g' "$file"
    sed -i 's/text-red-600\b/text-[#FF3B30]/g' "$file"
    sed -i 's/text-red-500\b/text-[#FF3B30]/g' "$file"
    
    sed -i 's/bg-blue-100\b/bg-[#0A84FF]\/20/g' "$file"
    sed -i 's/bg-blue-50\b/bg-[#0A84FF]\/10/g' "$file"
    sed -i 's/bg-green-100\b/bg-[#30D158]\/20/g' "$file"
    sed -i 's/bg-green-50\b/bg-[#30D158]\/10/g' "$file"
    sed -i 's/bg-yellow-100\b/bg-[#FF9F0A]\/20/g' "$file"
    sed -i 's/bg-yellow-50\b/bg-[#FF9F0A]\/10/g' "$file"
    sed -i 's/bg-red-100\b/bg-[#FF3B30]\/20/g' "$file"
    sed -i 's/bg-red-50\b/bg-[#FF3B30]\/10/g' "$file"
    
    sed -i 's/bg-blue-500\b/bg-[#0A84FF]/g' "$file"
    sed -i 's/bg-blue-600\b/bg-[#0A84FF]/g' "$file"
    sed -i 's/hover:bg-blue-600\b/hover:bg-[#0A84FF]\/90/g' "$file"
    sed -i 's/hover:bg-blue-700\b/hover:bg-[#0A84FF]\/90/g' "$file"
    
    sed -i 's/\bshadow-sm\b//g' "$file"
    sed -i 's/\bshadow-md\b//g' "$file"
    sed -i 's/\bshadow-lg\b//g' "$file"
    
    echo "  ✓ Updated: $(basename $file)"
done

echo "✅ All workflow components updated"
