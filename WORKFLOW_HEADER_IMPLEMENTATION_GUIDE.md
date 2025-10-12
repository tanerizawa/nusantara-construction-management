# Workflow Horizontal Header - Implementation Guide

**Date**: 12 Oktober 2025  
**Based on**: Comprehensive Analysis Document  
**Status**: 📋 **IMPLEMENTATION READY**

---

## 🎯 Executive Summary

### Recommended Menu Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  Overview    Finance ▾    Documents ▾    Operations ▾    Analytics ▾  │
└─────────────────────────────────────────────────────────────────┘
```

**5 Main Categories** organizing **10 existing features**:

1. **Overview** → Direct access (Dashboard)
2. **Finance** → 4 items (RAB, PO, Budget, Payments)
3. **Documents** → 3 items (Approvals, BA, Documents)
4. **Operations** → 2 items (Milestones, Team)
5. **Analytics** → 1+ items (Reports, future KPIs)

**Key Benefits**:
- ✅ +26% more content space (~328px gained)
- ✅ Cleaner navigation (5 vs 10 visible items)
- ✅ Better organization by domain
- ✅ Modern, industry-standard UX

---

## 📐 Component Architecture

### File Structure

```
frontend/src/components/workflow/
├── header/
│   ├── WorkflowHeader.js                    ← Main component
│   ├── components/
│   │   ├── HeaderBrand.js                   ← Logo + Project selector
│   │   ├── MainNavigation.js                ← Nav items container
│   │   ├── NavItem.js                       ← Single nav button
│   │   ├── NavDropdown.js                   ← Dropdown megamenu
│   │   ├── DropdownItem.js                  ← Individual dropdown link
│   │   ├── MobileMenu.js                    ← Hamburger menu
│   │   ├── MobileMenuDrawer.js              ← Mobile drawer
│   │   └── UserMenu.js                      ← User profile dropdown
│   ├── config/
│   │   └── navigationConfig.js              ← Menu structure
│   ├── hooks/
│   │   ├── useNavigation.js                 ← Navigation state
│   │   ├── useDropdown.js                   ← Dropdown interactions
│   │   └── useMobileMenu.js                 ← Mobile menu state
│   └── utils/
│       └── navigationHelpers.js             ← Helper functions
└── ProjectWorkflowSidebar.js                ← TO BE DEPRECATED
```

---

## 🎨 Component Specifications

### 1. WorkflowHeader.js (Main Container)

**Purpose**: Main header wrapper  
**Layout**: Fixed top, full width  
**Height**: 128px (2 rows: Brand row 64px + Nav row 64px)

```javascript
// WorkflowHeader.js
import React from 'react';
import { HeaderBrand, MainNavigation, UserMenu } from './components';
import { useNavigation } from './hooks';

const WorkflowHeader = ({ project, activeTab, onTabChange }) => {
  const { navigationItems } = useNavigation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#2C2C2E] border-b border-[#38383A]">
      {/* Row 1: Brand + Project + User */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[#38383A]">
        <HeaderBrand project={project} />
        <UserMenu />
      </div>

      {/* Row 2: Main Navigation */}
      <div className="h-16 px-6">
        <MainNavigation
          items={navigationItems}
          activeTab={activeTab}
          onTabChange={onTabChange}
        />
      </div>
    </header>
  );
};

export default WorkflowHeader;
```

**Styling**:
```css
- Background: #2C2C2E (Dark mode)
- Border: #38383A
- Shadow: Subtle elevation
- z-index: 50 (above content, below modals)
```

---

### 2. navigationConfig.js (Menu Structure)

```javascript
// config/navigationConfig.js
import {
  Home,
  DollarSign,
  FileText,
  ShoppingCart,
  BarChart3,
  CheckCircle,
  ClipboardCheck,
  CreditCard,
  Calendar,
  Users,
  Briefcase
} from 'lucide-react';

export const navigationConfig = [
  // 1. Overview - Single page, no dropdown
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    type: 'single',
    path: 'overview',
    description: 'Project dashboard and summary'
  },

  // 2. Finance - Dropdown with 4 items
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    type: 'dropdown',
    items: [
      {
        id: 'rab-workflow',
        label: 'RAB Management',
        icon: DollarSign,
        path: 'rab-workflow',
        description: 'Rencana Anggaran Biaya - Budget planning',
        keywords: ['budget', 'anggaran', 'rab']
      },
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        icon: ShoppingCart,
        path: 'purchase-orders',
        description: 'Create and track procurement orders',
        badge: true, // Show notification badge
        keywords: ['po', 'procurement', 'purchasing']
      },
      {
        id: 'budget-monitoring',
        label: 'Budget Monitoring',
        icon: BarChart3,
        path: 'budget-monitoring',
        description: 'Track spending vs allocated budget',
        keywords: ['monitoring', 'tracking', 'spending']
      },
      {
        id: 'progress-payments',
        label: 'Progress Payments',
        icon: CreditCard,
        path: 'progress-payments',
        description: 'Manage milestone-based payments',
        keywords: ['payment', 'termin', 'invoice']
      }
    ]
  },

  // 3. Documents - Dropdown with 3 items
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    type: 'dropdown',
    items: [
      {
        id: 'approval-status',
        label: 'Approval Status',
        icon: CheckCircle,
        path: 'approval-status',
        description: 'Track document approvals and workflows',
        keywords: ['approval', 'persetujuan', 'workflow']
      },
      {
        id: 'berita-acara',
        label: 'Berita Acara',
        icon: ClipboardCheck,
        path: 'berita-acara',
        description: 'Handover documentation and sign-off',
        keywords: ['ba', 'handover', 'serah terima']
      },
      {
        id: 'documents',
        label: 'Project Documents',
        icon: FileText,
        path: 'documents',
        description: 'All project files and attachments',
        keywords: ['files', 'dokumen', 'attachments']
      }
    ]
  },

  // 4. Operations - Dropdown with 2 items
  {
    id: 'operations',
    label: 'Operations',
    icon: Briefcase,
    type: 'dropdown',
    items: [
      {
        id: 'milestones',
        label: 'Milestones',
        icon: Calendar,
        path: 'milestones',
        description: 'Project timeline and deliverables',
        keywords: ['milestone', 'timeline', 'deliverable']
      },
      {
        id: 'team',
        label: 'Team Management',
        icon: Users,
        path: 'team',
        description: 'Assign and manage project team',
        keywords: ['team', 'members', 'resources']
      }
    ]
  },

  // 5. Analytics - Dropdown with 1+ items (expandable)
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    type: 'dropdown',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        icon: FileText,
        path: 'reports',
        description: 'Generate project reports and exports',
        keywords: ['report', 'export', 'pdf']
      }
      // Future items:
      // - Performance Dashboard
      // - KPI Tracking
      // - Custom Analytics
    ]
  }
];

// Helper function to get all paths
export const getAllPaths = () => {
  const paths = [];
  navigationConfig.forEach(item => {
    if (item.type === 'single') {
      paths.push(item.path);
    } else if (item.type === 'dropdown') {
      item.items.forEach(subItem => paths.push(subItem.path));
    }
  });
  return paths;
};

// Helper function to find item by path
export const findItemByPath = (path) => {
  for (const item of navigationConfig) {
    if (item.type === 'single' && item.path === path) {
      return { parent: null, item };
    }
    if (item.type === 'dropdown') {
      const subItem = item.items.find(sub => sub.path === path);
      if (subItem) {
        return { parent: item, item: subItem };
      }
    }
  }
  return null;
};
```

---

### 3. MainNavigation.js (Nav Container)

```javascript
// components/MainNavigation.js
import React from 'react';
import { NavItem } from './NavItem';
import { NavDropdown } from './NavDropdown';

export const MainNavigation = ({ items, activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center space-x-1 h-full">
      {items.map(item => {
        if (item.type === 'single') {
          return (
            <NavItem
              key={item.id}
              item={item}
              isActive={activeTab === item.path}
              onClick={() => onTabChange(item.path)}
            />
          );
        }

        if (item.type === 'dropdown') {
          // Check if any sub-item is active
          const isActive = item.items.some(sub => sub.path === activeTab);
          
          return (
            <NavDropdown
              key={item.id}
              item={item}
              isActive={isActive}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          );
        }

        return null;
      })}
    </nav>
  );
};
```

---

### 4. NavItem.js (Single Nav Button)

```javascript
// components/NavItem.js
import React from 'react';

export const NavItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        flex items-center space-x-2 px-4 h-10 rounded-lg
        transition-all duration-200
        ${isActive 
          ? 'bg-[#0A84FF] text-white' 
          : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
        }
      `}
      title={item.description}
    >
      <Icon size={18} />
      <span className="font-medium text-sm">{item.label}</span>
    </button>
  );
};
```

**Visual States**:
- **Default**: Gray text (#8E8E93)
- **Hover**: Dark background (#3A3A3C), white text
- **Active**: Blue background (#0A84FF), white text

---

### 5. NavDropdown.js (Dropdown Menu)

```javascript
// components/NavDropdown.js
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownItem } from './DropdownItem';

export const NavDropdown = ({ item, isActive, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const Icon = item.icon;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleItemClick = (path) => {
    onTabChange(path);
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className="relative">
      {/* Dropdown Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        className={`
          flex items-center space-x-2 px-4 h-10 rounded-lg
          transition-all duration-200
          ${isActive 
            ? 'bg-[#0A84FF] text-white' 
            : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
          }
        `}
      >
        <Icon size={18} />
        <span className="font-medium text-sm">{item.label}</span>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 w-80 bg-[#2C2C2E] border border-[#38383A] rounded-lg shadow-xl z-50 overflow-hidden"
          onMouseLeave={() => setIsOpen(false)}
        >
          <div className="py-2">
            {item.items.map((subItem, index) => (
              <React.Fragment key={subItem.id}>
                {index > 0 && <div className="h-px bg-[#38383A] mx-2" />}
                <DropdownItem
                  item={subItem}
                  isActive={activeTab === subItem.path}
                  onClick={() => handleItemClick(subItem.path)}
                />
              </React.Fragment>
            ))}
          </div>

          {/* Optional: Footer with "View All" link */}
          {item.items.length > 3 && (
            <>
              <div className="h-px bg-[#38383A]" />
              <div className="p-2">
                <button className="w-full text-center text-sm text-[#0A84FF] hover:text-[#0A84FF]/80 py-2">
                  View All {item.label} →
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};
```

**Interaction**:
- **Hover**: Opens dropdown (desktop)
- **Click**: Toggles dropdown (all devices)
- **Mouse leave**: Closes dropdown
- **Click outside**: Closes dropdown

---

### 6. DropdownItem.js (Dropdown Link)

```javascript
// components/DropdownItem.js
import React from 'react';

export const DropdownItem = ({ item, isActive, onClick }) => {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-start space-x-3 px-4 py-3
        transition-colors duration-150
        ${isActive 
          ? 'bg-[#0A84FF]/10 text-[#0A84FF]' 
          : 'text-white hover:bg-[#3A3A3C]'
        }
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0 mt-0.5">
        <Icon size={20} className={isActive ? 'text-[#0A84FF]' : 'text-[#8E8E93]'} />
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{item.label}</span>
          {item.badge && (
            <span className="ml-2 px-2 py-0.5 bg-[#FF3B30] text-white text-xs font-semibold rounded-full">
              3
            </span>
          )}
        </div>
        <p className="text-xs text-[#8E8E93] mt-0.5">{item.description}</p>
      </div>
    </button>
  );
};
```

**Layout**:
```
┌────────────────────────────────────────┐
│ [Icon]  Label                    [Badge]│
│         Description text...            │
└────────────────────────────────────────┘
```

---

### 7. MobileMenu.js (Hamburger for Mobile)

```javascript
// components/MobileMenu.js
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MobileMenuDrawer } from './MobileMenuDrawer';

export const MobileMenu = ({ items, activeTab, onTabChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemClick = (path) => {
    onTabChange(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button (visible on mobile only) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden flex items-center justify-center w-10 h-10 text-white hover:bg-[#3A3A3C] rounded-lg transition-colors"
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Drawer */}
      <MobileMenuDrawer
        isOpen={isOpen}
        items={items}
        activeTab={activeTab}
        onItemClick={handleItemClick}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
};
```

---

### 8. MobileMenuDrawer.js (Mobile Drawer)

```javascript
// components/MobileMenuDrawer.js
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export const MobileMenuDrawer = ({ isOpen, items, activeTab, onItemClick, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-[#2C2C2E] border-r border-[#38383A] z-50 overflow-y-auto lg:hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#38383A]">
          <h2 className="text-white font-semibold text-lg">Navigation</h2>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          {items.map(item => {
            const Icon = item.icon;
            const isItemActive = item.type === 'single' 
              ? activeTab === item.path 
              : item.items.some(sub => sub.path === activeTab);

            if (item.type === 'single') {
              return (
                <button
                  key={item.id}
                  onClick={() => onItemClick(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 text-left
                    transition-colors
                    ${isItemActive 
                      ? 'bg-[#0A84FF] text-white' 
                      : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                    }
                  `}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            }

            if (item.type === 'dropdown') {
              const isDropdownOpen = openDropdown === item.id;

              return (
                <div key={item.id}>
                  {/* Dropdown Header */}
                  <button
                    onClick={() => setOpenDropdown(isDropdownOpen ? null : item.id)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3
                      transition-colors
                      ${isItemActive 
                        ? 'bg-[#0A84FF]/10 text-[#0A84FF]' 
                        : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon size={20} />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <ChevronRight
                      size={16}
                      className={`transition-transform ${isDropdownOpen ? 'rotate-90' : ''}`}
                    />
                  </button>

                  {/* Dropdown Items */}
                  {isDropdownOpen && (
                    <div className="bg-[#1C1C1E]">
                      {item.items.map(subItem => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeTab === subItem.path;

                        return (
                          <button
                            key={subItem.id}
                            onClick={() => onItemClick(subItem.path)}
                            className={`
                              w-full flex items-center space-x-3 pl-12 pr-4 py-3 text-left
                              transition-colors
                              ${isSubActive 
                                ? 'bg-[#0A84FF] text-white' 
                                : 'text-[#8E8E93] hover:bg-[#3A3A3C] hover:text-white'
                              }
                            `}
                          >
                            <SubIcon size={18} />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{subItem.label}</div>
                              <div className="text-xs text-[#8E8E93] mt-0.5">
                                {subItem.description}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </>
  );
};
```

---

## 🔌 Integration with ProjectDetail.js

### Updated Layout Structure

```javascript
// ProjectDetail.js
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// NEW: Import WorkflowHeader instead of Sidebar
import { WorkflowHeader } from '../../components/workflow/header';

const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(getInitialTab);
  
  const { project, loading, error, fetchProject } = useProjectDetail(id);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState error={error} />;
  if (!project) return <NotFoundState />;

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      {/* NEW: Horizontal Header (replaces sidebar) */}
      <WorkflowHeader
        project={project}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content - Now full width with top padding */}
      <div className="pt-32"> {/* 128px header + padding */}
        {/* Breadcrumbs */}
        <div className="border-b border-[#38383A] bg-[#2C2C2E]">
          <div className="max-w-7xl mx-auto px-6 py-3">
            {/* Breadcrumb content */}
          </div>
        </div>

        {/* Content Area - Now wider! */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          {/* Render active tab content */}
          {activeTab === 'overview' && <ProjectOverview project={project} />}
          {activeTab === 'rab-workflow' && <ProjectRABWorkflow projectId={id} />}
          {/* ... other tabs */}
        </div>
      </div>
    </div>
  );
};
```

**Key Changes**:
- ✅ Removed sidebar (`<div className="w-72">`)
- ✅ Added header (`<WorkflowHeader>`)
- ✅ Content now full width with `max-w-7xl` (was `max-w-6xl`)
- ✅ Added `pt-32` for fixed header clearance

---

## 📱 Responsive Breakpoints

```javascript
// Tailwind breakpoints
const breakpoints = {
  sm: '640px',   // Mobile landscape
  md: '768px',   // Tablet
  lg: '1024px',  // Desktop (dropdown becomes hamburger below this)
  xl: '1280px',  // Large desktop
  '2xl': '1536px' // Extra large
};
```

**Behavior**:
- **< 1024px**: Hamburger menu
- **≥ 1024px**: Full horizontal menu with dropdowns

---

## 🎨 Color Palette

```javascript
const colors = {
  background: {
    primary: '#1C1C1E',   // Page background
    secondary: '#2C2C2E', // Header, cards
    tertiary: '#3A3A3C',  // Hover states
  },
  border: {
    primary: '#38383A',   // Default borders
    secondary: '#48484A', // Subtle dividers
  },
  text: {
    primary: '#FFFFFF',   // Headings
    secondary: '#8E8E93', // Body text
    tertiary: '#636366',  // Disabled/muted
  },
  accent: {
    primary: '#0A84FF',   // Active, links
    danger: '#FF3B30',    // Errors, badges
    success: '#34C759',   // Success states
    warning: '#FF9500',   // Warnings
  }
};
```

---

## ⚡ Performance Optimizations

### 1. Lazy Loading Dropdown Content
```javascript
const NavDropdown = ({ item, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}>
        {item.label}
      </button>
      {isOpen && (
        <DropdownContent items={item.items} />
      )}
    </div>
  );
};
```

### 2. Debounced Search (Future)
```javascript
const [searchTerm, setSearchTerm] = useState('');
const debouncedSearch = useDebounce(searchTerm, 300);
```

### 3. Memoized Navigation
```javascript
const navigationItems = useMemo(() => navigationConfig, []);
```

---

## ✅ Accessibility Checklist

- [ ] ARIA labels on all buttons
- [ ] Keyboard navigation (Tab, Arrow keys)
- [ ] Focus indicators visible
- [ ] Screen reader support
- [ ] Color contrast ratios (WCAG AA)
- [ ] Touch target sizes ≥ 44x44px
- [ ] Skip to content link

---

## 🧪 Testing Checklist

### Desktop
- [ ] Hover interactions smooth
- [ ] Dropdown opens/closes correctly
- [ ] Active states highlight properly
- [ ] Navigation preserves state on refresh
- [ ] All menu items accessible

### Mobile
- [ ] Hamburger menu opens/closes
- [ ] Touch targets comfortable
- [ ] Drawer scrolls if needed
- [ ] Sub-menus expand/collapse
- [ ] Close on item selection

### Cross-browser
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS, Android)

---

## 📊 Success Criteria

**Must Have**:
- ✅ All 10 menus accessible
- ✅ Active tab highlights correctly
- ✅ Responsive on all screen sizes
- ✅ No visual bugs or overlaps

**Should Have**:
- ✅ Smooth animations
- ✅ Hover states on desktop
- ✅ Badge notifications work
- ✅ Keyboard accessible

**Nice to Have**:
- ✅ Search in dropdown
- ✅ Recent items quick access
- ✅ Customizable menu order

---

**Guide Status**: ✅ **READY FOR DEVELOPMENT**  
**Next Step**: Implement WorkflowHeader.js component  
**Estimated Time**: 11-15 hours total

