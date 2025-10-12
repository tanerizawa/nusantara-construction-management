# Workflow Redesign Analysis V2 - Hierarchical Tabs

**Date**: 12 Oktober 2025  
**Based On**: User screenshot reference

---

## 🎯 Design Pattern: Hierarchical Tabs (Bukan Dropdown)

### Current Design (Yang Baru Dibuat)
```
┌────────────────────────────────────────────────┐
│ [Logo] [Project]        [Notifications] [User] │ ← Header Row 1
├────────────────────────────────────────────────┤
│ [Overview] [Finance ▾] [Documents ▾] [Ops ▾]   │ ← Header Row 2 (Dropdown)
└────────────────────────────────────────────────┘
```
❌ **Problem**: 
- Dropdown navigation (user tidak mau dropdown)
- 2-row header (redundant dengan main header)
- Tidak match screenshot

---

### Target Design (Dari Screenshot)
```
┌────────────────────────────────────────────────┐
│ Quick Status Update: [Dropdown] [Input Notes]  │ ← Status Bar
├────────────────────────────────────────────────┤
│ ⓘ Overview  ⚙ Izin  ☰ Tugas  📄 Dokumen  💰 Financial │ ← Main Tabs (Pills)
├────────────────────────────────────────────────┤
│ [Content Area]                                 │
└────────────────────────────────────────────────┘

Ketika Financial diklik:
┌────────────────────────────────────────────────┐
│ Quick Status Update: [Dropdown] [Input Notes]  │
├────────────────────────────────────────────────┤
│ ⓘ Overview  ⚙ Izin  ☰ Tugas  📄 Dokumen  💰 Financial │ ← Main Tab (Financial active)
├────────────────────────────────────────────────┤
│   RAB  |  PO  |  Budget  |  Payments           │ ← Sub Tabs (Secondary)
├────────────────────────────────────────────────┤
│ [Content Area - RAB]                           │
└────────────────────────────────────────────────┘
```

✅ **Solution**:
- No dropdown, flat pills/tabs
- Secondary tabs muncul di bawah main tabs
- Quick Status Update bar
- Integrated ke content, bukan fixed header

---

## 🏗️ New Structure

### Component Hierarchy
```
ProjectDetail.js
└── WorkflowTabs (New Component)
    ├── QuickStatusBar
    ├── MainTabsBar (Pills style)
    └── SecondaryTabsBar (Conditional, hanya jika main tab punya children)
```

### Navigation Flow
```
Main Tabs (Level 1):
- Overview → No children, show content directly
- Finance → Has children, show secondary tabs
  - RAB → Show RAB content
  - PO → Show PO content
  - Budget → Show Budget content
  - Payments → Show Payments content
- Documents → Has children, show secondary tabs
  - Approvals → Show Approvals content
  - BA → Show BA content
  - Files → Show Files content
- Operations → Has children, show secondary tabs
  - Milestones → Show Milestones content
  - Team → Show Team content
- Analytics → No children (or has children later)
  - Reports → Show Reports content
```

---

## 🎨 Visual Design Specs (From Screenshot)

### Quick Status Update Bar
```css
Background: #2C2C2E (dark card)
Height: ~80px
Padding: 16px 24px
Border-radius: 12px
Margin-bottom: 16px

Elements:
- Label: "Quick Status Update:"
- Status Dropdown: Rounded dropdown (select)
- Notes Input: Placeholder "Catatan perubahan status (opsional)"
```

### Main Tabs (Pills)
```css
Display: Horizontal flex
Gap: 12px
Style: Rounded pill buttons

Each Tab:
- Border-radius: 9999px (fully rounded)
- Padding: 12px 24px
- Background: Transparent (inactive)
- Background: #3A3A3C (active)
- Border: 1px solid #48484A (inactive)
- Border: 1px solid #0A84FF (active)
- Icon + Label layout
- Transition: all 200ms

Icon:
- Size: 20px
- Margin-right: 8px
- Color: #8E8E93 (inactive)
- Color: #0A84FF (active)

Label:
- Font: 14px medium
- Color: #8E8E93 (inactive)
- Color: #FFFFFF (active)
```

### Secondary Tabs (Sub-tabs)
```css
Display: Horizontal flex
Gap: 0 (connected tabs)
Margin-top: 12px
Margin-bottom: 12px

Each Tab:
- Background: Transparent (inactive)
- Background: #2C2C2E (active)
- Border-bottom: 2px solid transparent (inactive)
- Border-bottom: 2px solid #0A84FF (active)
- Padding: 12px 20px
- No rounded corners (flat tabs)

Label:
- Font: 13px medium
- Color: #8E8E93 (inactive)
- Color: #FFFFFF (active)
```

---

## 📝 Implementation Plan

### Phase 1: Create New Components (2 hours)

**1. QuickStatusBar.js**
- Status dropdown (Dalam Pengerjaan, Selesai, Terhenti, etc.)
- Notes input field
- Save button (optional)

**2. WorkflowTabsNavigation.js**
- Main tabs bar (pills style)
- Secondary tabs bar (conditional)
- Active state management
- Click handlers

**3. Update navigationConfig.js**
- Flatten structure (remove dropdown type)
- Add category metadata for grouping

### Phase 2: Integration (1 hour)

**4. Update ProjectDetail.js**
- Remove WorkflowHeader
- Add WorkflowTabsNavigation after breadcrumbs
- Add QuickStatusBar above tabs
- Update activeTab logic to handle parent/child

### Phase 3: Styling (1 hour)

**5. Add CSS for Pills**
- Rounded pill styles
- Hover states
- Active states
- Transitions

**6. Responsive Behavior**
- Desktop: Horizontal pills
- Tablet: Scrollable horizontal
- Mobile: Vertical stack or drawer (keep existing mobile menu)

---

## 🔄 Navigation State Logic

### State Structure
```javascript
{
  activeMainTab: 'finance',        // Main tab selected
  activeSubTab: 'rab-workflow',    // Sub tab selected (if any)
  activePath: 'rab-workflow'       // Final path for content rendering
}
```

### Click Behavior

**Main Tab Click**:
```javascript
// If tab has children
if (tab.children) {
  setActiveMainTab(tab.id);
  setActiveSubTab(tab.children[0].path); // Auto-select first child
  setActivePath(tab.children[0].path);
} else {
  // If tab has no children
  setActiveMainTab(tab.id);
  setActiveSubTab(null);
  setActivePath(tab.path);
}
```

**Sub Tab Click**:
```javascript
setActiveSubTab(subTab.path);
setActivePath(subTab.path);
// Keep activeMainTab unchanged
```

---

## 📊 Menu Mapping

### From Original 10 Items → New Structure

**Main Tabs (5)**:
1. **Overview** (single)
   - Path: `overview`
   - Icon: Info
   - Children: None

2. **Finance** (parent)
   - Path: N/A (parent only)
   - Icon: Calculator/DollarSign
   - Children:
     - RAB Management (`rab-workflow`)
     - Purchase Orders (`purchase-orders`)
     - Budget Monitoring (`budget-monitoring`)
     - Progress Payments (`progress-payments`)

3. **Documents** (parent)
   - Path: N/A
   - Icon: FileText
   - Children:
     - Approval Status (`approval-status`)
     - Berita Acara (`berita-acara`)
     - Project Documents (`documents`)

4. **Operations** (parent)
   - Path: N/A
   - Icon: Settings
   - Children:
     - Milestones (`milestones`)
     - Team (`team`)

5. **Analytics** (single or parent)
   - Path: `reports` (if single)
   - Icon: BarChart
   - Children: (future: Dashboard, Reports, Insights)

---

## 🎯 Key Differences dari Previous Design

| Aspect | Previous (Dropdown) | New (Hierarchical Tabs) |
|--------|---------------------|------------------------|
| **Main Navigation** | Dropdown menu | Flat pills/tabs |
| **Submenu Display** | Inside dropdown panel | Secondary tabs below |
| **Interaction** | Hover/click dropdown | Click to reveal sub-tabs |
| **Visual Style** | Rectangular with chevron | Rounded pills |
| **Header Position** | Fixed at top | Integrated in content area |
| **Mobile** | Hamburger → Drawer | Keep drawer (proven pattern) |

---

## ✅ Advantages of Hierarchical Tabs

1. **Clearer hierarchy** - Visual separation of main/sub tabs
2. **No hidden menus** - All options visible (no dropdown)
3. **Faster navigation** - One click to main, one click to sub
4. **Better context** - See where you are in hierarchy
5. **Cleaner design** - Matches screenshot reference
6. **No redundancy** - No duplicate header needed

---

## 🚀 Next Steps

1. Create new components (QuickStatusBar, WorkflowTabsNavigation)
2. Update navigationConfig.js (flatten structure)
3. Update ProjectDetail.js (remove old header, add new tabs)
4. Style pills and secondary tabs
5. Test navigation flow
6. Mobile responsive adjustments

**Estimated Time**: 4 hours total

Ready to implement? 🚀

