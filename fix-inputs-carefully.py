#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

# Dark theme input style
input_style = '''style={{
                          backgroundColor: "#1C1C1E",
                          border: "1px solid #38383A",
                          color: "#FFFFFF"
                        }}
                        '''

# Pattern 1: Fix <input> tags
# Find: <input ... className="w-full px-3 py-2 ... />
# Add style BEFORE the closing />
def fix_input(match):
    full_match = match.group(0)
    # If already has style attribute, skip it
    if 'style={{' in full_match:
        return full_match
    # Add style before />
    return full_match.replace('/>', input_style + '/>')

# Pattern 2: Fix <textarea> tags  
def fix_textarea(match):
    full_match = match.group(0)
    if 'style={{' in full_match:
        return full_match
    # Add style before >
    if full_match.endswith('/>'):
        return full_match.replace('/>', input_style + '/>')
    else:
        return full_match.replace('>', input_style + '>')

# Pattern 3: Fix <select> tags
def fix_select(match):
    full_match = match.group(0)
    if 'style={{' in full_match:
        return full_match
    # Add style before >
    return full_match.replace('>', input_style + '>')

# Fix input tags (self-closing)
content = re.sub(
    r'<input\s+[^>]*className="w-full[^>]*/>',
    fix_input,
    content,
    flags=re.MULTILINE
)

# Fix textarea tags
content = re.sub(
    r'<textarea\s+[^>]*className="w-full[^>]*/?>', 
    fix_textarea,
    content,
    flags=re.MULTILINE
)

# Fix select tags (not self-closing)
content = re.sub(
    r'<select\s+[^>]*className="w-full[^>]*>',
    fix_select,
    content,
    flags=re.MULTILINE
)

# Write back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("✅ All input/select/textarea fields styled successfully!")
