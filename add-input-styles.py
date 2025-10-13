#!/usr/bin/env python3
import re

def add_dark_style_to_inputs(filename):
    with open(filename, 'r') as f:
        content = f.read()
    
    # Pattern untuk input/select/textarea yang BELUM punya style attribute
    # Mencari elemen dengan className="w-full px-3 py-2..." tapi tanpa style
    
    # Split content by lines untuk processing lebih mudah
    lines = content.split('\n')
    new_lines = []
    i = 0
    
    while i < len(lines):
        line = lines[i]
        
        # Check if line contains input/select/textarea dengan w-full px-3 py-2
        if ('className="w-full px-3 py-2' in line or 
            'className={`w-full px-3 py-2' in line):
            
            # Check apakah sudah ada style attribute dalam 2 baris ke depan
            has_style = False
            for j in range(i, min(i+3, len(lines))):
                if 'style={{' in lines[j]:
                    has_style = True
                    break
            
            # Jika belum ada style, tambahkan
            if not has_style:
                new_lines.append(line)
                # Tambahkan style di line berikutnya
                indent = len(line) - len(line.lstrip())
                style_line = ' ' * indent + 'style={{ backgroundColor: "#1C1C1E", color: "#FFFFFF" }}'
                new_lines.append(style_line)
                i += 1
                continue
        
        new_lines.append(line)
        i += 1
    
    # Write back
    with open(filename, 'w') as f:
        f.write('\n'.join(new_lines))
    
    print(f"Added dark theme styles to input fields in {filename}")

if __name__ == '__main__':
    add_dark_style_to_inputs('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js')
