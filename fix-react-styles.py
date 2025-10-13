#!/usr/bin/env python3
"""
Fix broken style={{ }} patterns in React files
"""

import re
import sys

def fix_style_patterns(content):
    """Fix style={{ ... }} className patterns that got broken by sed"""
    
    # Pattern 1: style={{...}} p-6"> → style={{...}} className="p-6">
    content = re.sub(
        r'style=\{\{([^}]+)\}\}\s+p-(\d+)">',
        r'style={{\1}} className="p-\2">',
        content
    )
    
    # Pattern 2: border: "..." p-6 → border: "..." }} className="p-6
    content = re.sub(
        r'border:\s*"([^"]+)"\s+p-(\d+)>',
        r'border: "\1" }} className="p-\2">',
        content
    )
    
    # Pattern 3: Fix unterminated style={{...}} p-X
    content = re.sub(
        r'style=\{\{\s*backgroundColor:\s*"([^"]+)",\s*border:\s*"([^"]+)"\s+p-(\d+)>',
        r'style={{ backgroundColor: "\1", border: "\2" }} className="p-\3">',
        content
    )
    
    return content

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 fix-react-styles.py <file>")
        sys.exit(1)
    
    filepath = sys.argv[1]
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        fixed_content = fix_style_patterns(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f"✅ Fixed: {filepath}")
    except Exception as e:
        print(f"❌ Error fixing {filepath}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
