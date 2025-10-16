#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'r') as f:
    content = f.read()

# Fix 1: Fix mb-X" style={{ color: "#FFFFFF" }} to mb-X" style={{ color: "#FFFFFF" }}
# Pattern: mb" style={{ color: "#FFFFFF" }}-4
content = re.sub(
    r'mb"\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}-(\d+)',
    r'mb-\2" style={{ color: "\1" }}',
    content
)

# Fix 2: Fix style={{...}} flex items-center"> to style={{...}} className includes flex
# Pattern: style={{ color: "#FFFFFF" }} flex items-center">
content = re.sub(
    r'(className="[^"]*?)"?\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}\s+flex\s+items-center">',
    r'\1 flex items-center" style={{ color: "\2" }}>',
    content
)

# Write the file back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'w') as f:
    f.write(content)

print("Fixed heading issues in SubsidiaryDetail.js")
