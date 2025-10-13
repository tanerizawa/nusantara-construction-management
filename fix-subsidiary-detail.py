#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'r') as f:
    content = f.read()

# Fix 1: Fix className with style embedded (e.g., className="block text-sm font-medium style={{ color: "#98989D" }} mb-1")
# This should be: className="block text-sm font-medium mb-1" style={{ color: "#98989D" }}
content = re.sub(
    r'className="([^"]*?)\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}\s*([^"]*?)"',
    r'className="\1 \3" style={{ color: "\2" }}',
    content
)

# Fix 2: Fix className with only style (e.g., className="style={{ color: "#FFFFFF" }} flex items-center")
content = re.sub(
    r'className="style=\{\{\s*color:\s*"([^"]+)"\s*\}\}\s*([^"]*?)"',
    r'className="\2" style={{ color: "\1" }}',
    content
)

# Fix 3: Fix any remaining malformed className with style
content = re.sub(
    r'className="([^"]*?)"\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}\s+(\w+)',
    r'className="\1 \3" style={{ color: "\2" }}',
    content
)

# Write the file back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'w') as f:
    f.write(content)

print("Fixed SubsidiaryDetail.js")
