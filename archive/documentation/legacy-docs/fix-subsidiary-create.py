#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryCreate.js', 'r') as f:
    content = f.read()

# Fix 1: Fix className with style embedded
content = re.sub(
    r'className="([^"]*?)\s*style=\{\{\s*color:\s*"([^"]+)"\s*\}\}\s*([^"]*?)"',
    r'className="\1 \3" style={{ color: "\2" }}',
    content
)

# Fix 2: Fix className="style={{ backgroundColor...
content = re.sub(
    r'className="style=\{\{\s*backgroundColor:\s*"([^"]+)",\s*border:\s*"([^"]+)"\s*\}\}\s*([^"]*?)"',
    r'className="\3" style={{ backgroundColor: "\1", border: "\2" }}',
    content
)

# Fix 3: Fix triple braces
content = content.replace('style={{ color: "#FFFFFF" }}}', 'style={{ color: "#FFFFFF" }}')
content = content.replace('style={{ color: "#98989D" }}}', 'style={{ color: "#98989D" }}')

# Fix 4: Fix }}">
content = content.replace('}}">','}}>').replace('}}">', '}}>')

# Write the file back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryCreate.js', 'w') as f:
    f.write(content)

print("Fixed SubsidiaryCreate.js")
