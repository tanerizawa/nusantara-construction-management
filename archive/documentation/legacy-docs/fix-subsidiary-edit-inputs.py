#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

# Fix input/select/textarea yang belum punya style attribute
# Pattern: mencari input/select/textarea dengan className tapi tanpa style
patterns = [
    # Input fields
    (
        r'(<(?:input|select|textarea)[^>]*className="[^"]*w-full[^"]*"[^>]*)(\s*(?:placeholder|rows|maxLength|disabled|type|value|onChange|onBlur|id|name)[^>]*)>',
        r'\1 style={{ backgroundColor: "#1C1C1E", color: "#FFFFFF", borderColor: "#38383A" }}\2>'
    ),
]

for pattern, replacement in patterns:
    # Hanya replace jika belum ada style attribute
    def replace_if_no_style(match):
        full_match = match.group(0)
        if 'style={{' not in full_match:
            return re.sub(pattern, replacement, full_match)
        return full_match
    
    content = re.sub(pattern, replace_if_no_style, content)

# Write the file back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("Added dark theme styles to input fields in SubsidiaryEdit.js")
