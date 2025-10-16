#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'r') as f:
    content = f.read()

# Fix 1: className with style inside quotes - pattern like: className="... style={{ ... }} ..."
# Should be: className="..." style={{ ... }}
content = re.sub(
    r'className="([^"]*?)\s+style=\{\{\s*backgroundColor:\s*"([^"]+)"\s*\}\}\s*([^"]*?)"',
    r'className="\1 \3" style={{ backgroundColor: "\2" }}',
    content
)

# Fix 2: onMouseEnter in className position
content = re.sub(
    r'className="([^"]*?)"\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}=\{([^}]+)\}',
    r'className="\1" style={{ color: "\2" }} onMouseEnter={\3}',
    content
)

# Fix 3: Fix mb-6 split issue: mb" style={{ color: "#FFFFFF" }}-6
content = re.sub(
    r'(\s+className="[^"]*?)mb"\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}-(\d+)\s+',
    r'\1mb-\3" style={{ color: "\2" }} ',
    content
)

# Fix 4: Fix remaining style inside className for rounded-lg
content = re.sub(
    r'(rounded-lg)\s+style=\{\{\s*backgroundColor:\s*"([^"]+)"\s*\}\}">',
    r'\1" style={{ backgroundColor: "\2" }}>',
    content
)

# Write the file back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'w') as f:
    f.write(content)

print("Comprehensive fix applied to SubsidiaryDetail.js")
