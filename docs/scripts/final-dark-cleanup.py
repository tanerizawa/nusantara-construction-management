#!/usr/bin/env python3
"""Final cleanup for remaining dark theme elements"""
import re

with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

# Fix text-gray-900 (headings and text) to white
content = re.sub(
    r'text-gray-900',
    '',  # Remove it, we'll add inline style
    content
)

# Add white color to h3, h4, p tags that don't have style
content = re.sub(
    r'<(h3|h4) className="([^"]*)"',
    r'<\1 className="\2" style={{ color: "#FFFFFF" }}',
    content
)

# Fix specific p tags with explicit style
content = re.sub(
    r'<p className="([^"]*)"(?!.*style)',
    r'<p className="\1" style={{ color: "#FFFFFF" }}',
    content
)

# Fix span tags
content = re.sub(
    r'<span className="([^"]*)"(?!.*style)',
    r'<span className="\1" style={{ color: "#FFFFFF" }}',
    content
)

# Fix bg-gray-50 to dark backgrounds
content = re.sub(
    r'bg-gray-50',
    '',  # Remove class
    content
)

# Add dark background to divs that had bg-gray-50
content = re.sub(
    r'className="([^"]*)\s*rounded-lg"',
    r'className="\1rounded-lg" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}',
    content
)

# Fix modal background
content = re.sub(
    r'<div className="bg-white rounded-lg p-6',
    r'<div className="rounded-lg p-6" style={{ backgroundColor: "#2C2C2E"',
    content
)

with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("✅ Final cleanup complete!")
