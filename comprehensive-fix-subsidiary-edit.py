#!/usr/bin/env python3
import re

filename = '/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js'

with open(filename, 'r') as f:
    content = f.read()

# 1. Fix loading state
content = content.replace(
    'className="min-h-screen flex items-center justify-center"',
    'className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1C1C1E" }}'
)
content = content.replace(
    'border-b-2 border-blue-600',
    'border-b-2" style={{ borderColor: "#0A84FF" }}'
)

# 2. Fix main page background
content = content.replace(
    'className="min-h-screen bg-gray-800 py-8"',
    'className="min-h-screen py-8" style={{ backgroundColor: "#1C1C1E" }}'
)

# 3. Fix bg-gray-800 yang sudah diganti tapi perlu inline style
content = re.sub(
    r'className="([^"]*?)bg-gray-800([^"]*?)"',
    r'className="\1\2" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}',
    content
)

# 4. Add dark style to ALL input/select/textarea elements
# Pattern: elemen dengan className yang contain "w-full" dan "px-" tapi tidak punya style
def add_style_to_input(match):
    full_tag = match.group(0)
    if 'style={{' in full_tag:
        return full_tag  # Already has style
    
    # Find the closing > or />
    if '/>' in full_tag:
        return full_tag.replace('/>', 'style={{ backgroundColor: "#1C1C1E", color: "#FFFFFF" }} />')
    elif '>' in full_tag:
        # Insert style before the >
        parts = full_tag.rsplit('>', 1)
        return parts[0] + ' style={{ backgroundColor: "#1C1C1E", color: "#FFFFFF" }}>' + parts[1]
    return full_tag

# Match input/select/textarea tags with w-full in className
pattern = r'<(input|select|textarea)([^>]*className=[^>]*w-full[^>]*)(/?>)'
content = re.sub(pattern, add_style_to_input, content, flags=re.DOTALL)

# Write back
with open(filename, 'w') as f:
    f.write(content)

print("✅ Applied all dark theme fixes to SubsidiaryEdit.js")
print("   - Loading state")
print("   - Page background")  
print("   - Cards and containers")
print("   - Input/select/textarea fields")
