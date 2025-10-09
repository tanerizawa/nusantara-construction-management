#!/bin/bash

# Script to update ProjectCreate.js styling to Apple HIG dark theme

FILE="/root/APP-YK/frontend/src/pages/ProjectCreate.js"

echo "🎨 Updating ProjectCreate.js styling to Apple HIG..."

# Backup original file
cp "$FILE" "$FILE.backup"

# Update label styling
sed -i 's/text-gray-700 dark:text-gray-300/text-[#98989D]/g' "$FILE"
sed -i 's/text-sm font-medium text-gray-700/text-sm font-medium text-[#98989D]/g' "$FILE"

# Update input fields - border colors
sed -i 's/border-gray-300 dark:border-gray-600/border-[#38383A]/g' "$FILE"
sed -i 's/border-red-500/border-[#FF3B30]/g' "$FILE"
sed -i 's/border-red-300/border-[#FF3B30]\/50/g' "$FILE"
sed -i 's/border-amber-300/border-[#FF9F0A]\/50/g' "$FILE"

# Update input fields - background colors
sed -i 's/bg-white dark:bg-slate-800/bg-[#1C1C1E]/g' "$FILE"
sed -i 's/bg-gray-50 dark:bg-slate-700/bg-[#2C2C2E]/g' "$FILE"
sed -i 's/bg-red-50 dark:bg-red-900\/20/bg-[#FF3B30]\/10/g' "$FILE"
sed -i 's/bg-amber-50 dark:bg-amber-900\/20/bg-[#FF9F0A]\/10/g' "$FILE"
sed -i 's/bg-green-100/bg-[#30D158]\/20/g' "$FILE"

# Update input fields - text colors
sed -i 's/text-gray-900 dark:text-white/text-white/g' "$FILE"
sed -i 's/text-gray-700 dark:text-gray-300/text-[#98989D]/g' "$FILE"
sed -i 's/text-gray-600 dark:text-gray-400/text-[#8E8E93]/g' "$FILE"
sed -i 's/text-gray-500 dark:text-gray-400/text-[#8E8E93]/g' "$FILE"
sed -i 's/text-gray-400/text-[#636366]/g' "$FILE"

# Update focus ring
sed -i 's/focus:ring-blue-500/focus:ring-[#0A84FF]/g' "$FILE"
sed -i 's/focus:ring-2 focus:ring-blue-500 focus:border-transparent/focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF]/g' "$FILE"

# Update error text
sed -i 's/text-red-600/text-[#FF3B30]/g' "$FILE"
sed -i 's/text-red-700 dark:text-red-400/text-[#FF3B30]/g' "$FILE"
sed -i 's/text-amber-700 dark:text-amber-400/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-amber-800 dark:text-amber-200/text-[#FF9F0A]/g' "$FILE"
sed -i 's/text-green-800/text-[#30D158]/g' "$FILE"

# Update border colors for alerts
sed -i 's/border-amber-200 dark:border-amber-700/border-[#FF9F0A]\/30/g' "$FILE"

# Update spacing
sed -i 's/py-3/py-2.5/g' "$FILE"
sed -i 's/gap-6/gap-4/g' "$FILE"

# Update placeholder
sed -i 's/placeholder="Masukkan/placeholder="Masukkan/g' "$FILE"

# Add placeholder color class if not exists (manual check needed)
echo "✅ Styling updates applied"
echo "📝 Backup created at: $FILE.backup"
echo "🔍 Please review the changes and test the form"
