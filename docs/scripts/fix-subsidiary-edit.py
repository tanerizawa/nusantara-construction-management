#!/usr/bin/env python3
import re

# Read the file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

# Fix 1: className="style={{...}} other-classes" → className="other-classes" style={{...}}
content = re.sub(
    r'className="style=\{\{\s*backgroundColor:\s*"([^"]+)",\s*border:\s*"([^"]+)"\s*\}\}\s*([^"]*?)"',
    r'className="\3" style={{ backgroundColor: "\1", border: "\2" }}',
    content
)

# Fix 2: Fix any remaining embedded styles in className
content = re.sub(
    r'className="([^"]*?)\s*style=\{\{([^}]+)\}\}\s*([^"]*?)"',
    r'className="\1 \3" style={{\2}}',
    content
)

# Write the file back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("Fixed SubsidiaryEdit.js")
