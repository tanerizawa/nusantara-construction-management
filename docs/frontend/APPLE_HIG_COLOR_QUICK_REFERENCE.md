# 🎨 Apple HIG Color Quick Reference

## One-Page Cheat Sheet for Developers

### 🎯 Core Rule: ALWAYS USE HEX CODES WITH BRACKET NOTATION!

---

## 📦 Backgrounds

```jsx
// Page/App Background
className="bg-[#1C1C1E]"

// Cards, Modals, Panels
className="bg-[#2C2C2E]"

// Hover State
className="hover:bg-[#3A3A3C]"

// Active/Pressed State
className="bg-[#48484A]"
```

---

## 📝 Text Colors

```jsx
// Primary Text (Headings, Important)
className="text-white"

// Secondary Text (Descriptions, Labels)
className="text-[#98989D]"

// Tertiary Text (Disabled, Placeholders)
className="text-[#636366]"

// Quaternary Text (Very Subtle)
className="text-[#48484A]"
```

---

## 🖼️ Borders

```jsx
// Subtle Border (Default)
className="border border-[#38383A]"

// Emphasized Border (Hover, Focus)
className="border border-[#48484A]"

// Hover Border
className="hover:border-[#48484A]"
```

---

## 🔵 Primary Actions (Buttons, Links)

```jsx
// Primary Button
className="bg-[#0A84FF] hover:bg-[#0970DD] text-white"

// With Focus Ring
className="bg-[#0A84FF] hover:bg-[#0970DD] focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"

// Active State
className="active:bg-[#0970DD]"
```

---

## 🎨 Status Colors

```jsx
// Success (Green)
className="text-[#30D158]"          // Text
className="bg-[#30D158]"            // Background
className="bg-[#30D158]/10"         // Subtle background (10% opacity)
className="border-[#30D158]/20"     // Subtle border (20% opacity)

// Warning (Yellow/Orange)
className="text-[#FF9F0A]"
className="bg-[#FF9F0A]"
className="bg-[#FF9F0A]/10"

// Error/Danger (Red)
className="text-[#FF453A]"
className="bg-[#FF453A]"
className="bg-[#FF453A]/10"

// Info (Blue)
className="text-[#0A84FF]"
className="bg-[#0A84FF]"
className="bg-[#0A84FF]/10"
```

---

## 📛 Status Badges

```jsx
// Success Badge
<span className="inline-flex px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
  Active
</span>

// Warning Badge
<span className="inline-flex px-2.5 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-medium">
  Pending
</span>

// Error Badge
<span className="inline-flex px-2.5 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-full text-xs font-medium">
  Failed
</span>

// Info Badge
<span className="inline-flex px-2.5 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-xs font-medium">
  Info
</span>
```

---

## 🃏 Card Pattern

```jsx
<div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 hover:border-[#48484A] transition-colors duration-150">
  <h3 className="text-white text-lg font-semibold mb-3">Card Title</h3>
  <p className="text-[#98989D] text-sm">Card description goes here</p>
</div>
```

---

## 🔘 Button Patterns

```jsx
// Primary Button
<button className="px-5 py-2.5 bg-[#0A84FF] hover:bg-[#0970DD] text-white rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#0A84FF]">
  Primary Action
</button>

// Secondary Button
<button className="px-5 py-2.5 bg-[#3A3A3C] hover:bg-[#48484A] text-white rounded-lg transition-colors duration-150">
  Secondary Action
</button>

// Destructive Button
<button className="px-5 py-2.5 bg-[#FF453A] hover:bg-[#FF3B30] text-white rounded-lg transition-colors duration-150">
  Delete
</button>

// Icon Button
<button className="p-2.5 bg-[#3A3A3C] hover:bg-[#48484A] text-[#98989D] hover:text-white rounded-lg transition-all duration-150">
  <Icon className="w-5 h-5" />
</button>
```

---

## 📥 Input Pattern

```jsx
<input 
  type="text"
  className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#38383A] text-white placeholder-[#636366] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent transition-colors duration-150"
  placeholder="Enter text..."
/>
```

---

## 🎭 Interactive States

```jsx
// Hover
className="hover:bg-[#3A3A3C] hover:border-[#48484A] hover:text-white"

// Focus
className="focus:outline-none focus:ring-2 focus:ring-[#0A84FF]"

// Active/Pressed
className="active:bg-[#0970DD] active:scale-95"

// Disabled
className="disabled:opacity-50 disabled:cursor-not-allowed"

// Transition (Always add!)
className="transition-colors duration-150"
```

---

## 📐 Complete Component Examples

### Stats Card

```jsx
<div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 hover:border-[#48484A] transition-colors">
  <div className="flex items-center justify-between">
    <div className="flex-1">
      <p className="text-sm text-[#98989D] mb-2">Total Projects</p>
      <p className="text-2xl font-bold text-white mb-1">24</p>
      <p className="text-xs text-[#636366]">Last 30 days</p>
    </div>
    <div className="w-12 h-12 bg-[#0A84FF]/10 rounded-lg flex items-center justify-center">
      <Building className="w-6 h-6 text-[#0A84FF]" />
    </div>
  </div>
</div>
```

### Modal

```jsx
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
  <div className="bg-[#2C2C2E] border border-[#38383A] rounded-2xl max-w-lg w-full">
    {/* Header */}
    <div className="px-6 py-4 border-b border-[#38383A] flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">Modal Title</h3>
      <button className="p-1 hover:bg-[#3A3A3C] rounded-lg transition-colors">
        <X className="w-5 h-5 text-[#98989D]" />
      </button>
    </div>
    
    {/* Body */}
    <div className="px-6 py-5">
      <p className="text-[#98989D]">Modal content goes here...</p>
    </div>
    
    {/* Footer */}
    <div className="px-6 py-4 bg-[#1C1C1E] border-t border-[#38383A] flex justify-end gap-3">
      <button className="px-5 py-2.5 bg-[#3A3A3C] hover:bg-[#48484A] text-white rounded-lg">
        Cancel
      </button>
      <button className="px-5 py-2.5 bg-[#0A84FF] hover:bg-[#0970DD] text-white rounded-lg">
        Confirm
      </button>
    </div>
  </div>
</div>
```

### Alert

```jsx
// Success Alert
<div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-green-400">Success!</h4>
      <p className="text-sm text-green-400/80 mt-1">Your changes have been saved.</p>
    </div>
  </div>
</div>

// Error Alert
<div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
  <div className="flex items-start gap-3">
    <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
    <div className="flex-1">
      <h4 className="text-sm font-semibold text-red-400">Error!</h4>
      <p className="text-sm text-red-400/80 mt-1">Something went wrong.</p>
    </div>
  </div>
</div>
```

---

## ❌ Common Mistakes to Avoid

```jsx
// ❌ WRONG - Generic Tailwind colors
<div className="bg-gray-800">
<p className="text-gray-400">
<button className="bg-blue-600">

// ✅ CORRECT - Apple HIG hex codes
<div className="bg-[#2C2C2E]">
<p className="text-[#98989D]">
<button className="bg-[#0A84FF]">
```

---

## ✅ Quick Checklist Before Commit

- [ ] All backgrounds use hex codes (`bg-[#2C2C2E]`)
- [ ] All text uses hex codes or `text-white`
- [ ] All borders use hex codes (`border-[#38383A]`)
- [ ] Transitions added (`transition-colors duration-150`)
- [ ] Focus states for interactive elements
- [ ] Hover states defined
- [ ] Border radius consistent (`rounded-xl` cards, `rounded-lg` buttons)
- [ ] No generic Tailwind colors (`gray-800`, `blue-600`, etc.)

---

## 🔗 Resources

- **Full Style Guide**: `/root/APP-YK/STYLE_GUIDE.md`
- **Implementation Report**: `/root/APP-YK/DESIGN_SYSTEM_IMPLEMENTATION_PHASE1_COMPLETE.md`
- **Summary**: `/root/APP-YK/DESIGN_IMPLEMENTATION_SUMMARY.txt`

---

## 💡 Pro Tips

1. **Use VS Code snippets** for common patterns
2. **Copy from existing components** that follow the guide
3. **When in doubt**, check STYLE_GUIDE.md
4. **Test hover/focus states** in browser
5. **Verify color contrast** for accessibility

---

**Last Updated**: October 8, 2025  
**Version**: 1.0  
**Design System**: Apple HIG Dark Matte Theme
