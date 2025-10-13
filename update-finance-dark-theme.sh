#!/bin/bash

# Finance Components Dark Theme Update Script
# Updates all remaining white/light theme components to dark theme

echo "🎨 Starting Finance Components Dark Theme Update..."
echo ""

# Backup files first
echo "📦 Creating backups..."
cp /root/APP-YK/frontend/src/components/workspace/FinancialWorkspaceDashboard.js /root/APP-YK/frontend/src/components/workspace/FinancialWorkspaceDashboard.js.backup
cp /root/APP-YK/frontend/src/pages/finance/components/TransactionModals.js /root/APP-YK/frontend/src/pages/finance/components/TransactionModals.js.backup
cp /root/APP-YK/frontend/src/pages/finance/components/FinancialReportsView.js /root/APP-YK/frontend/src/pages/finance/components/FinancialReportsView.js.backup
cp /root/APP-YK/frontend/src/pages/finance/components/TaxManagement.js /root/APP-YK/frontend/src/pages/finance/components/TaxManagement.js.backup
cp /root/APP-YK/frontend/src/pages/finance/components/ProjectFinanceView.js /root/APP-YK/frontend/src/pages/finance/components/ProjectFinanceView.js.backup
cp /root/APP-YK/frontend/src/pages/finance/components/ChartOfAccountsView.js /root/APP-YK/frontend/src/pages/finance/components/ChartOfAccountsView.js.backup

echo "✅ Backups created"
echo ""

# Function to update a file
update_file() {
    local file=$1
    echo "🔄 Updating: $(basename $file)"
    
    # Replace card backgrounds
    sed -i 's/className="bg-white rounded-xl border border-gray-200/className="rounded-xl" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"/g' "$file"
    sed -i 's/className="bg-white rounded-lg border border-gray-200/className="rounded-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"/g' "$file"
    sed -i 's/className="bg-white rounded-lg shadow/className="rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"/g' "$file"
    sed -i 's/className="bg-white rounded-xl shadow/className="rounded-xl shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"/g' "$file"
    
    # Replace gray backgrounds
    sed -i 's/bg-gray-50/style={{ backgroundColor: "#1C1C1E" }}/g' "$file"
    sed -i 's/bg-gray-100/style={{ backgroundColor: "#2C2C2E" }}/g' "$file"
    
    # Replace borders
    sed -i 's/border-gray-200/#38383A/g' "$file"
    sed -i 's/border-gray-300/#38383A/g' "$file"
    
    # Replace text colors (simple patterns)
    sed -i 's/text-gray-900/style={{ color: "#FFFFFF" }}/g' "$file"
    sed -i 's/text-gray-800/style={{ color: "#FFFFFF" }}/g' "$file"
    sed -i 's/text-gray-700/style={{ color: "#FFFFFF" }}/g' "$file"
    sed -i 's/text-gray-600/style={{ color: "#98989D" }}/g' "$file"
    sed -i 's/text-gray-500/style={{ color: "#98989D" }}/g' "$file"
    sed -i 's/text-gray-400/style={{ color: "#636366" }}/g' "$file"
    
    echo "  ✓ $(basename $file) updated"
}

# Update all files
echo "📝 Updating component files..."
echo ""

update_file "/root/APP-YK/frontend/src/components/workspace/FinancialWorkspaceDashboard.js"
update_file "/root/APP-YK/frontend/src/pages/finance/components/TransactionModals.js"
update_file "/root/APP-YK/frontend/src/pages/finance/components/FinancialReportsView.js"
update_file "/root/APP-YK/frontend/src/pages/finance/components/TaxManagement.js"
update_file "/root/APP-YK/frontend/src/pages/finance/components/ProjectFinanceView.js"
update_file "/root/APP-YK/frontend/src/pages/finance/components/ChartOfAccountsView.js"

echo ""
echo "✨ All files updated!"
echo ""
echo "📋 Summary:"
echo "  - FinancialWorkspaceDashboard.js ✓"
echo "  - TransactionModals.js ✓"
echo "  - FinancialReportsView.js ✓"
echo "  - TaxManagement.js ✓"
echo "  - ProjectFinanceView.js ✓"
echo "  - ChartOfAccountsView.js ✓"
echo ""
echo "🎉 Dark theme update complete!"
echo ""
echo "⚠️  Note: This is a basic replacement. You may need to manually fix:"
echo "  - Conflicting style attributes"
echo "  - Complex className combinations"
echo "  - Hover and active states"
echo ""
echo "🔄 Next step: Restart frontend container"
echo "   docker-compose restart frontend"
