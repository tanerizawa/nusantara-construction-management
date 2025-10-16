#!/usr/bin/env python3
"""
Comprehensive dark theme fix for SubsidiaryEdit.js
This script will:
1. Fix page backgrounds
2. Fix loading state  
3. Fix header
4. Fix tab navigation
5. Fix all input/select/textarea with dark styles
6. Fix all labels
7. Fix action buttons
"""

import re

print("📖 Reading SubsidiaryEdit.js...")
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'r') as f:
    content = f.read()

print("🔧 Step 1: Fix loading state...")
content = content.replace(
    '''  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }''',
    '''  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#1C1C1E" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: "#0A84FF" }}></div>
          <p style={{ color: "#98989D" }}>Memuat data...</p>
        </div>
      </div>
    );
  }'''
)

print("🔧 Step 2: Fix page background...")
content = content.replace(
    '<div className="min-h-screen bg-gray-50 py-8">',
    '<div className="min-h-screen py-8" style={{ backgroundColor: "#1C1C1E" }}>'
)

print("🔧 Step 3: Fix header back button...")
content = content.replace(
    '''          <button
            onClick={() => navigate('/admin/subsidiaries')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </button>''',
    '''          <button
            onClick={() => navigate('/admin/subsidiaries')}
            className="flex items-center mb-4 transition-colors"
            style={{ color: "#98989D" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#FFFFFF"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#98989D"}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar
          </button>'''
)

print("🔧 Step 4: Fix header icon and text...")
content = content.replace(
    '''              <div className="p-3 bg-blue-50 rounded-lg">
                <Building className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing ? 'Edit Anak Usaha' : 'Tambah Anak Usaha'}
                </h1>
                <p className="text-gray-600">
                  {isEditing ? 'Perbarui informasi lengkap anak usaha' : 'Tambahkan anak usaha baru dengan informasi lengkap'}
                </p>
              </div>''',
    '''              <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(10, 132, 255, 0.1)" }}>
                <Building className="h-8 w-8" style={{ color: "#0A84FF" }} />
              </div>
              <div>
                <h1 className="text-3xl font-bold" style={{ color: "#FFFFFF" }}>
                  {isEditing ? 'Edit Anak Usaha' : 'Tambah Anak Usaha'}
                </h1>
                <p style={{ color: "#98989D" }}>
                  {isEditing ? 'Perbarui informasi lengkap anak usaha' : 'Tambahkan anak usaha baru dengan informasi lengkap'}
                </p>
              </div>'''
)

print("🔧 Step 5: Fix tab container...")
content = content.replace(
    '<div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">',
    '<div className="rounded-lg shadow-sm mb-8" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>'
)

content = content.replace(
    '<div className="border-b border-gray-200">',
    '<div style={{ borderBottom: "1px solid #38383A" }}>'
)

print("🔧 Step 6: Fix tab buttons...")
# This is complex, need to handle multiline
old_tab_button = '''                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>'''

new_tab_button = '''                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                      style={{ 
                        color: activeTab === tab.id ? '#0A84FF' : '#98989D'
                      }}
                      onMouseEnter={(e) => {
                        if (activeTab !== tab.id) e.currentTarget.style.color = '#FFFFFF';
                      }}
                      onMouseLeave={(e) => {
                        if (activeTab !== tab.id) e.currentTarget.style.color = '#98989D';
                      }}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </button>'''

content = content.replace(old_tab_button, new_tab_button)

print("🔧 Step 7: Fix all labels...")
# Replace label text-gray-700 with style
content = re.sub(
    r'<label className="([^"]*) text-gray-700([^"]*)"',
    r'<label className="\1\2" style={{ color: "#98989D" }}"',
    content
)

print("🔧 Step 8: Fix all inputs/selects/textareas...")
# Add dark style to all form inputs that don't already have it
input_style = ''' style={{
                          backgroundColor: "#1C1C1E",
                          border: "1px solid #38383A",
                          color: "#FFFFFF"
                        }}'''

def add_input_style(match):
    full = match.group(0)
    if 'style={{' in full:
        return full  # Already has style
    # Add style before closing /> or >
    if full.endswith('/>'):
        return full[:-2] + input_style + ' />'
    else:
        return full[:-1] + input_style + '>'

# Fix input tags
content = re.sub(
    r'<input\s+[^>]*className="w-full[^>]*/?>',
    add_input_style,
    content
)

# Fix textarea tags  
content = re.sub(
    r'<textarea\s+[^>]*className="w-full[^>]*/?>',
    add_input_style,
    content
)

# Fix select tags
content = re.sub(
    r'<select\s+[^>]*className="w-full[^>]*>',
    add_input_style,
    content
)

print("🔧 Step 9: Fix action buttons...")
# Fix Batal button
content = re.sub(
    r'<button\s+type="button"\s+onClick=\{[^}]+navigate\([^)]+\)\}\s+className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50[^"]*"',
    '<button type="button" onClick={() => navigate(\'/admin/subsidiaries\')} className="px-6 py-2 rounded-lg transition-colors" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A", color: "#FFFFFF" }}',
    content
)

# Fix Perbarui button - this one is trickier, let's be more specific
old_submit_btn = '''              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >'''

new_submit_btn = '''              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 text-white rounded-lg disabled:cursor-not-allowed transition-all"
                style={{
                  background: loading ? '#38383A' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  opacity: loading ? 0.5 : 1
                }}
              >'''

content = content.replace(old_submit_btn, new_submit_btn)

print("💾 Writing changes...")
with open('/root/APP-YK/frontend/src/pages/SubsidiaryEdit.js', 'w') as f:
    f.write(content)

print("✅ All dark theme fixes applied successfully!")
print("📝 Summary:")
print("  - Loading state: ✅")
print("  - Page background: ✅")  
print("  - Header: ✅")
print("  - Tab navigation: ✅")
print("  - Labels: ✅")
print("  - Input fields: ✅")
print("  - Action buttons: ✅")
