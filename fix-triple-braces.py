#!/usr/bin/env python3
import re

# Read the current broken file
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'r') as f:
    lines = f.readlines()

# Process line by line to fix issues
fixed_lines = []
for i, line in enumerate(lines, 1):
    original_line = line
    
    # Fix triple closing braces }}} to }}
    line = line.replace('style={{ color: "#FFFFFF" }}}', 'style={{ color: "#FFFFFF" }}')
    line = line.replace('style={{ color: "#98989D" }}}', 'style={{ color: "#98989D" }}')
    line = line.replace('style={{ backgroundColor: "#1C1C1E" }}}', 'style={{ backgroundColor: "#1C1C1E" }}')
    line = line.replace('style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}}', 'style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}')
    
    # Report if line was changed
    if line != original_line:
        print(f"Line {i}: Fixed triple braces")
    
    fixed_lines.append(line)

# Write back
with open('/root/APP-YK/frontend/src/pages/SubsidiaryDetail.js', 'w') as f:
    f.writelines(fixed_lines)

print("\\n✅ Fixed all triple closing braces in SubsidiaryDetail.js")
