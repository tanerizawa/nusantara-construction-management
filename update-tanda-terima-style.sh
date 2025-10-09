#!/bin/bash

# Update Tanda Terima components to Apple HIG Dark Theme
# This script updates all remaining components with consistent styling

COMPONENTS_DIR="/root/APP-YK/frontend/src/components/tanda-terima/tanda-terima-manager/components"

echo "🎨 Updating Tanda Terima components to Apple HIG dark theme..."

# Update ReceiptsTable.js
sed -i 's/bg-white/bg-[#2C2C2E]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/border-gray-200/border-[#38383A]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/text-gray-900/text-white/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/text-gray-700/text-[#98989D]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/text-gray-600/text-[#8E8E93]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/text-gray-500/text-[#636366]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/bg-blue-600/bg-[#0A84FF]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/hover:bg-blue-700/hover:bg-[#0A84FF]\/90/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/bg-green-600/bg-[#30D158]/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/hover:bg-green-700/hover:bg-[#30D158]\/90/g' "$COMPONENTS_DIR/ReceiptsTable.js"
sed -i 's/hover:bg-gray-50/hover:bg-[#3A3A3C]/g' "$COMPONENTS_DIR/ReceiptsTable.js"

# Update DetailModal.js
sed -i 's/bg-white/bg-[#2C2C2E]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/border-gray-200/border-[#38383A]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/text-gray-900/text-white/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/text-gray-700/text-[#98989D]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/text-gray-600/text-[#8E8E93]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/text-gray-500/text-[#636366]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/text-gray-400/text-[#636366]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/bg-gray-50/bg-[#1C1C1E]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/bg-gray-100/bg-[#3A3A3C]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/hover:bg-gray-200/hover:bg-[#3A3A3C]\/80/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/bg-blue-600/bg-[#0A84FF]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/hover:bg-blue-700/hover:bg-[#0A84FF]\/90/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/bg-green-600/bg-[#30D158]/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/hover:bg-green-700/hover:bg-[#30D158]\/90/g' "$COMPONENTS_DIR/DetailModal.js"
sed -i 's/bg-black\/50/bg-black\/80/g' "$COMPONENTS_DIR/DetailModal.js"

# Update CreateReceiptModal.js
sed -i 's/bg-white/bg-[#2C2C2E]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/border-gray-300/border-[#38383A]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/border-gray-200/border-[#38383A]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/text-gray-900/text-white/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/text-gray-700/text-[#98989D]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/text-gray-600/text-[#8E8E93]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/text-gray-500/text-[#636366]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/text-gray-400/text-[#636366]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/bg-gray-50/bg-[#1C1C1E]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/bg-gray-100/bg-[#3A3A3C]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/hover:bg-gray-200/hover:bg-[#3A3A3C]\/80/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/bg-blue-600/bg-[#0A84FF]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/hover:bg-blue-700/hover:bg-[#0A84FF]\/90/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/focus:ring-blue-500/focus:ring-[#0A84FF]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/focus:border-blue-500/focus:border-[#0A84FF]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/bg-black\/50/bg-black\/80/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/bg-red-600/bg-[#FF3B30]/g' "$COMPONENTS_DIR/CreateReceiptModal.js"
sed -i 's/hover:bg-red-700/hover:bg-[#FF3B30]\/90/g' "$COMPONENTS_DIR/CreateReceiptModal.js"

echo "✅ Tanda Terima components updated!"
echo "🔄 Now restart the container to apply changes..."
