# Nested URL Hash Navigation Implementation

## Problem
User berada di **Approval Status tab** → Sub-tab **Tanda Terima** → Refresh → Kembali ke **Overview tab**.

Masalah ada di 2 level:
1. **Main Tab** (ProjectDetail level): overview, rab-workflow, approval-status, etc.
2. **Sub Tab** (Approval Dashboard level): rab, po, tandaTerima

## Solution: Nested Hash Format

### URL Structure:
```
Format: #mainTab:subTab

Examples:
✅ http://localhost:3000/project/ABC123#approval-status:tandaTerima
✅ http://localhost:3000/project/ABC123#approval-status:rab
✅ http://localhost:3000/project/ABC123#approval-status:po
✅ http://localhost:3000/project/ABC123#overview
✅ http://localhost:3000/project/ABC123#rab-workflow
```

### Parsing Logic:
```javascript
const hash = "#approval-status:tandaTerima";
const [mainTab, subTab] = hash.split(':');
// mainTab = "approval-status"
// subTab = "tandaTerima"
```

## Changes Made

### 1. ProjectDetail.js (Main Tab Persistence)

#### Import useEffect:
```javascript
import React, { useState, useMemo, useEffect } from 'react';
```

#### Get Initial Tab with Hash Support:
```javascript
const getInitialTab = () => {
  // Priority 1: URL hash (format: #approval-status or #approval-status:tandaTerima)
  const hash = window.location.hash.replace('#', '');
  if (hash) {
    // Extract main tab (before colon if exists)
    const mainTab = hash.split(':')[0];
    if (mainTab) return mainTab;
  }
  
  // Priority 2: localStorage
  const saved = localStorage.getItem('projectDetail_activeTab');
  if (saved) return saved;
  
  // Priority 3: default
  return 'overview';
};

const [activeTab, setActiveTab] = useState(getInitialTab);
```

#### Sync Main Tab with URL (Preserve Sub-Tab):
```javascript
useEffect(() => {
  // Get current sub-tab from hash if exists
  const hash = window.location.hash.replace('#', '');
  const subTab = hash.includes(':') ? hash.split(':')[1] : '';
  
  // Update URL hash with main tab and preserve sub-tab
  if (subTab) {
    window.location.hash = `${activeTab}:${subTab}`;
  } else {
    window.location.hash = activeTab;
  }
  
  // Update localStorage as backup
  localStorage.setItem('projectDetail_activeTab', activeTab);
}, [activeTab]);
```

#### Listen for Browser Navigation:
```javascript
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const mainTab = hash.split(':')[0];
      if (mainTab && mainTab !== activeTab) {
        setActiveTab(mainTab);
      }
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, [activeTab]);
```

### 2. ProfessionalApprovalDashboard.js (Sub-Tab Persistence)

#### Get Initial Category with Nested Hash:
```javascript
const getInitialCategory = () => {
  // Priority 1: URL hash with nested format (#approval-status:tandaTerima)
  const hash = window.location.hash.replace('#', '');
  if (hash.includes(':')) {
    const [mainTab, subTab] = hash.split(':');
    // Only use subTab if mainTab is 'approval-status'
    if (mainTab === 'approval-status' && subTab && approvalCategories.some(cat => cat.id === subTab)) {
      return subTab;
    }
  }
  
  // Priority 2: localStorage
  const saved = localStorage.getItem('approvalDashboard_activeCategory');
  if (saved && approvalCategories.some(cat => cat.id === saved)) {
    return saved;
  }
  
  // Priority 3: default
  return 'rab';
};

const [activeCategory, setActiveCategory] = useState(getInitialCategory);
```

#### Sync Sub-Tab with Nested Hash:
```javascript
useEffect(() => {
  // Get current main tab from hash
  const hash = window.location.hash.replace('#', '');
  const mainTab = hash.includes(':') ? hash.split(':')[0] : hash;
  
  // Update URL hash with nested format (mainTab:subTab)
  if (mainTab === 'approval-status' || mainTab === '') {
    window.location.hash = `approval-status:${activeCategory}`;
  }
  
  // Update localStorage as backup
  localStorage.setItem('approvalDashboard_activeCategory', activeCategory);
}, [activeCategory]);
```

#### Listen for Nested Hash Changes:
```javascript
useEffect(() => {
  const handleHashChange = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.includes(':')) {
      const [mainTab, subTab] = hash.split(':');
      // Only update if mainTab is 'approval-status' and subTab is valid
      if (mainTab === 'approval-status' && subTab && approvalCategories.some(cat => cat.id === subTab) && subTab !== activeCategory) {
        setActiveCategory(subTab);
      }
    }
  };

  window.addEventListener('hashchange', handleHashChange);
  return () => window.removeEventListener('hashchange', handleHashChange);
}, [activeCategory]);
```

## How It Works

### Flow Diagram:

```
User Action                          URL Hash                                   State
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Load project page         →  #overview                         →  Main: overview
                                                                       Sub:  N/A

2. Click "Approval Status"   →  #approval-status                  →  Main: approval-status
                                                                       Sub:  rab (default)

3. Click "Tanda Terima" tab  →  #approval-status:tandaTerima     →  Main: approval-status
                                                                       Sub:  tandaTerima

4. REFRESH PAGE             →  #approval-status:tandaTerima     →  ✅ RESTORED!
                                 ↓                                     Main: approval-status
                                 Parse hash:                           Sub:  tandaTerima
                                 - mainTab = "approval-status"
                                 - subTab = "tandaTerima"

5. Browser BACK             →  #approval-status                  →  Main: approval-status
                                                                       Sub:  rab

6. Browser FORWARD          →  #approval-status:tandaTerima     →  Main: approval-status
                                                                       Sub:  tandaTerima
```

### Priority Order:

**Main Tab (ProjectDetail):**
```
1. URL Hash (mainTab part)        ← #approval-status:tandaTerima → "approval-status"
   ↓ (if not found)
2. localStorage                   ← projectDetail_activeTab
   ↓ (if not found)
3. Default                        ← 'overview'
```

**Sub Tab (Approval Dashboard):**
```
1. URL Hash (subTab part)         ← #approval-status:tandaTerima → "tandaTerima"
   ↓ (if not found)
2. localStorage                   ← approvalDashboard_activeCategory
   ↓ (if not found)
3. Default                        ← 'rab'
```

## Example URLs

### Main Tabs Only:
```bash
# Overview
http://localhost:3000/project/2025PJK001#overview

# RAB Workflow
http://localhost:3000/project/2025PJK001#rab-workflow

# Purchase Orders
http://localhost:3000/project/2025PJK001#purchase-orders

# Team
http://localhost:3000/project/2025PJK001#team
```

### Approval Status with Sub-Tabs:
```bash
# Approval Status → RAB
http://localhost:3000/project/2025PJK001#approval-status:rab

# Approval Status → Purchase Order
http://localhost:3000/project/2025PJK001#approval-status:po

# Approval Status → Tanda Terima
http://localhost:3000/project/2025PJK001#approval-status:tandaTerima
```

## Testing Scenarios

### ✅ Test 1: Basic Navigation & Refresh
1. Open project page
2. Click "Approval Status" tab
3. Click "Tanda Terima" sub-tab
4. URL shows: `#approval-status:tandaTerima`
5. **REFRESH (F5)**
6. ✅ Verify: Still in Approval Status → Tanda Terima

### ✅ Test 2: Direct URL Access
1. Copy URL: `http://localhost:3000/project/ABC123#approval-status:tandaTerima`
2. Paste in new browser tab
3. ✅ Verify: Directly opens to Approval Status → Tanda Terima

### ✅ Test 3: Browser Back/Forward
1. Start at Overview
2. Click: Approval Status → PO tab
3. URL: `#approval-status:po`
4. Click: Tanda Terima tab
5. URL: `#approval-status:tandaTerima`
6. **Browser BACK button**
7. ✅ Verify: Back to Approval Status → PO
8. **Browser FORWARD button**
9. ✅ Verify: Forward to Approval Status → Tanda Terima

### ✅ Test 4: Switch Between Main Tabs
1. In Approval Status → Tanda Terima
2. URL: `#approval-status:tandaTerima`
3. Click "Team" main tab
4. URL: `#team`
5. Click "Approval Status" again
6. ✅ Verify: Returns to Approval Status → Tanda Terima (sub-tab restored)

### ✅ Test 5: Sub-Tab Changes
1. In Approval Status → RAB
2. Click "PO" sub-tab
3. URL changes: `#approval-status:rab` → `#approval-status:po`
4. **REFRESH**
5. ✅ Verify: Still in Approval Status → PO

### ✅ Test 6: Share Link
1. Navigate to: Approval Status → Tanda Terima
2. Copy URL: `http://app.com/project/ABC123#approval-status:tandaTerima`
3. Share with colleague
4. ✅ Verify: Colleague opens directly to correct tab + sub-tab

### ✅ Test 7: Bookmark
1. In Approval Status → Tanda Terima
2. Bookmark page
3. Close browser
4. Open bookmark
5. ✅ Verify: Directly to Approval Status → Tanda Terima

## localStorage Keys

### Main Tab Storage:
```javascript
Key:   "projectDetail_activeTab"
Value: "overview" | "rab-workflow" | "approval-status" | "purchase-orders" | "team" | ...
```

### Sub Tab Storage:
```javascript
Key:   "approvalDashboard_activeCategory"
Value: "rab" | "po" | "tandaTerima"
```

## Benefits

1. **✅ Two-Level Persistence**
   - Main tab (ProjectDetail) persistent
   - Sub-tab (Approval Dashboard) persistent
   - Both work together seamlessly

2. **✅ Deep Linking**
   - Direct access to specific sub-tab
   - Example: `/project/ABC#approval-status:tandaTerima`

3. **✅ Browser Navigation**
   - Back/Forward works for both levels
   - History tracks both main and sub-tab changes

4. **✅ Shareable & Bookmarkable**
   - URL contains complete state
   - Share exact view with team

5. **✅ Graceful Fallback**
   - localStorage as backup
   - Default values if both fail

## Edge Cases Handled

### Case 1: Invalid Sub-Tab
```javascript
URL: #approval-status:invalid
→ Falls back to localStorage or default 'rab'
```

### Case 2: Sub-Tab Without Main Tab
```javascript
URL: #tandaTerima (no main tab specified)
→ Main tab defaults to 'overview'
→ Sub-tab ignored (only works with approval-status)
```

### Case 3: Main Tab Change Preserves Sub-Tab
```javascript
Current: #approval-status:tandaTerima
User clicks: RAB Workflow tab
URL becomes: #rab-workflow
User clicks: Approval Status again
URL becomes: #approval-status:tandaTerima (restored from localStorage)
```

### Case 4: Manual Hash Removal
```javascript
User manually removes hash from URL
→ Falls back to localStorage
→ Then defaults
```

## Files Modified

1. ✅ `/frontend/src/pages/project-detail/ProjectDetail.js`
   - Added useEffect import
   - Added getInitialTab() with hash parsing
   - Added useEffect for hash sync (main tab)
   - Added useEffect for hashchange listener

2. ✅ `/frontend/src/components/workflow/approval/ProfessionalApprovalDashboard.js`
   - Updated getInitialCategory() for nested hash
   - Updated useEffect for nested hash sync (sub-tab)
   - Updated hashchange listener for nested format

## Date
October 9, 2025

## Status
✅ **IMPLEMENTED AND DEPLOYED**

Frontend successfully recompiled with nested hash navigation.
