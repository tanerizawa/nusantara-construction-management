#!/usr/bin/env python3
"""Fix remaining bg-gray-800 and other styling issues"""
import re

with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

print("🔧 Fixing bg-gray-800 to inline styles...")
# Replace bg-gray-800 with inline style
content = re.sub(
    r'className="([^"]*?)bg-gray-800([^"]*?)"',
    r'className="\1\2" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}',
    content
)

print("🔧 Fixing text-blue-600 icons to #0A84FF...")
content = re.sub(
    r'text-blue-600',
    '',  # Remove the class
    content
)

# Add blue color to Award icons
content = re.sub(
    r'<Award className="h-4 w-4 mr-2"',
    r'<Award className="h-4 w-4 mr-2" style={{ color: "#0A84FF" }}',
    content
)

# Add blue color to FileText icons
content = re.sub(
    r'<FileText className="h-4 w-4"',
    r'<FileText className="h-4 w-4" style={{ color: "#0A84FF" }}',
    content
)

print("🔧 Fixing hover colors...")
# Fix text-red-600 hover:text-red-800
content = re.sub(
    r'className="text-red-600 hover:text-red-800"',
    r'className="transition-colors" style={{ color: "#EF4444" }} onMouseEnter={(e) => e.currentTarget.style.color = "#DC2626"} onMouseLeave={(e) => e.currentTarget.style.color = "#EF4444"}',
    content
)

print("🔧 Fixing remaining border classes...")
# Fix any remaining border-gray classes
content = re.sub(
    r'border-gray-300',
    'border-gray-700',
    content
)

print("💾 Writing changes...")
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("✅ All remaining styles fixed!")
