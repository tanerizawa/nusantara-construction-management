#!/usr/bin/env python3
"""
Finance Components Dark Theme Batch Update
Updates all remaining white cards to dark theme
"""

import re
import os

def update_card_styling(content):
    """Update card styling from light to dark theme"""
    
    # Pattern 1: bg-white rounded-xl border border-gray-200
    content = re.sub(
        r'className="bg-white rounded-xl border border-gray-200',
        'className="rounded-xl" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"',
        content
    )
    
    # Pattern 2: bg-white rounded-lg border border-gray-200
    content = re.sub(
        r'className="bg-white rounded-lg border border-gray-200',
        'className="rounded-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"',
        content
    )
    
    # Pattern 3: bg-white rounded-lg shadow
    content = re.sub(
        r'className="bg-white rounded-lg shadow',
        'className="rounded-lg shadow-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"',
        content
    )
    
    # Pattern 4: bg-white rounded-xl shadow
    content = re.sub(
        r'className="bg-white rounded-xl',
        'className="rounded-xl" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A"',
        content
    )
    
    return content

def update_file(filepath):
    """Update a single file"""
    print(f"📝 Updating: {os.path.basename(filepath)}")
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        content = update_card_styling(content)
        
        if content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"  ✅ Updated successfully")
            return True
        else:
            print(f"  ℹ️  No changes needed")
            return False
    except Exception as e:
        print(f"  ❌ Error: {e}")
        return False

def main():
    print("🎨 Starting Finance Components Dark Theme Batch Update\n")
    
    base_path = "/root/APP-YK/frontend/src"
    
    files_to_update = [
        f"{base_path}/components/workspace/FinancialWorkspaceDashboard.js",
        f"{base_path}/pages/finance/components/TransactionModals.js",
        f"{base_path}/pages/finance/components/FinancialReportsView.js",
        f"{base_path}/pages/finance/components/TaxManagement.js",
        f"{base_path}/pages/finance/components/ProjectFinanceView.js",
        f"{base_path}/pages/finance/components/ChartOfAccountsView.js",
    ]
    
    updated_count = 0
    for filepath in files_to_update:
        if os.path.exists(filepath):
            if update_file(filepath):
                updated_count += 1
        else:
            print(f"⚠️  File not found: {os.path.basename(filepath)}")
    
    print(f"\n✨ Batch update complete!")
    print(f"📊 {updated_count}/{len(files_to_update)} files updated")
    print(f"\n🔄 Next step: docker-compose restart frontend")

if __name__ == "__main__":
    main()
