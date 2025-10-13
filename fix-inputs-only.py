#!/usr/bin/env python3
import re

filename = '/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js'

with open(filename, 'r') as f:
    content = f.read()

# HANYA tambahkan inline style ke input, select, dan textarea
# Mencari pattern: <input atau <select atau <textarea yang punya className tapi belum punya style

def add_input_style(match):
    tag_name = match.group(1)  # input, select, atau textarea
    tag_content = match.group(2)
    closing = match.group(3)
    
    # Skip jika sudah ada style
    if 'style={{' in tag_content:
        return match.group(0)
    
    # Tambahkan style sebelum closing
    if closing == '/>':
        return f'<{tag_name}{tag_content} style={{{{ backgroundColor: "#1C1C1E", color: "#FFFFFF" }}}} />'
    else:  # closing == '>'
        return f'<{tag_name}{tag_content} style={{{{ backgroundColor: "#1C1C1E", color: "#FFFFFF" }}}}>'

# Pattern untuk input/select/textarea
pattern = r'<(input|select|textarea)([^>]*?)(/>|>)'
content = re.sub(pattern, add_input_style, content)

with open(filename, 'w') as f:
    f.write(content)

print("✅ Added dark theme to input/select/textarea fields ONLY")
print("   Background sections NOT changed")
