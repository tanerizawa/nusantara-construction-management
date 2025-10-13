#!/usr/bin/env python3
"""Safe fix for labels and inputs"""
import re

with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

# Fix labels - more careful regex
# Pattern: className="... text-gray-700 ..."
content = re.sub(
    r'className="([^"]*\s)?text-gray-700(\s[^"]*)?">',
    lambda m: 'className="' + (m.group(1) or '') + (m.group(2) or '') + '" style={{ color: "#98989D" }}>',
    content
)

# Add style to input/select/textarea
input_style = ' style={{ backgroundColor: "#1C1C1E", border: "1px solid #38383A", color: "#FFFFFF" }}'

def add_style_to_input(match):
    tag = match.group(0)
    # Skip if already has style
    if 'style={{' in tag:
        return tag
    # Add before /> or >
    if tag.endswith('/>'):
        return tag[:-2] + input_style + ' />'
    elif tag.endswith('>'):
        return tag[:-1] + input_style + '>'
    return tag

# Fix inputs with w-full class
content = re.sub(
    r'<input\s+(?:[^>]*\s)?className="[^"]*w-full[^"]*"[^>]*/?>', 
    add_style_to_input,
    content,
    flags=re.DOTALL
)

# Fix textareas
content = re.sub(
    r'<textarea\s+(?:[^>]*\s)?className="[^"]*w-full[^"]*"[^>]*/?>',
    add_style_to_input,
    content,
    flags=re.DOTALL
)

# Fix selects
content = re.sub(
    r'<select\s+(?:[^>]*\s)?className="[^"]*w-full[^"]*"[^>]*>',
    add_style_to_input,
    content,
    flags=re.DOTALL
)

with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("✅ Labels and inputs fixed!")
