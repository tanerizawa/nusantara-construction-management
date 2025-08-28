# UI/UX Guidelines - Apple HIG Compliance

## 🎨 Design Philosophy

Sistem YK Construction mengadopsi prinsip-prinsip Apple Human Interface Guidelines untuk menciptakan pengalaman pengguna yang intuitif, konsisten, dan accessible.

## 🎯 Core HIG Principles

### 1. Clarity
**"Content is king"**
- Interface mendukung content, bukan mengalihkan perhatian
- Typography yang jelas dan readable
- Spacing yang konsisten untuk hierarchy
- Warna yang meaningful dan purposeful

**Implementation**:
```css
/* Clear typography hierarchy */
.heading-primary {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
  color: var(--color-gray-900);
}

.body-text {
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-700);
}
```

### 2. Deference
**"UI defers to content"**
- Minimal decorative elements
- Subtle borders dan shadows
- Content-first layout decisions
- Progressive disclosure

**Implementation**:
```css
/* Subtle UI elements */
.card {
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-sm);
  background: white;
}

.card:hover {
  box-shadow: var(--shadow-md);
  border-color: var(--color-gray-300);
}
```

### 3. Depth
**"Visual layers and motion convey hierarchy"**
- Strategic use of shadows untuk elevation
- Motion yang purposeful dan subtle
- Z-index hierarchy yang logical
- Layered information architecture

**Implementation**:
```css
/* Elevation system */
.elevation-1 { box-shadow: var(--shadow-sm); }
.elevation-2 { box-shadow: var(--shadow-base); }
.elevation-3 { box-shadow: var(--shadow-md); }
.elevation-4 { box-shadow: var(--shadow-lg); }

/* Subtle motion */
.interactive {
  transition: all var(--duration-150) var(--ease-out);
}

.interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}
```

## 🎭 Visual Design Language

### Color Psychology

**Primary Blue (`#2563eb`)**:
- Trust dan professionalism
- Stability dalam konstruksi
- Technology leadership

**Supporting Colors**:
```css
/* Semantic color meanings */
.status-success { color: var(--color-success); } /* Progress, completion */
.status-warning { color: var(--color-warning); } /* Attention needed */
.status-error { color: var(--color-error); }     /* Issues, problems */
.status-info { color: var(--color-info); }       /* Information, tips */
```

### Typography Scale

**Font Choice: Inter**
- Highly legible pada semua sizes
- Excellent multilingual support
- Designed untuk UI interfaces
- Open source dan web-optimized

**Hierarchy**:
```css
/* Typography scale */
.text-display {    /* Hero headings */
  font-size: var(--text-4xl);
  font-weight: var(--font-bold);
  line-height: var(--leading-tight);
}

.text-heading {    /* Section headings */
  font-size: var(--text-2xl);
  font-weight: var(--font-semibold);
  line-height: var(--leading-snug);
}

.text-subheading { /* Subsection headings */
  font-size: var(--text-lg);
  font-weight: var(--font-medium);
  line-height: var(--leading-normal);
}

.text-body {       /* Body text */
  font-size: var(--text-base);
  font-weight: var(--font-normal);
  line-height: var(--leading-relaxed);
}

.text-caption {    /* Supporting text */
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  line-height: var(--leading-normal);
  color: var(--color-gray-600);
}
```

### Spacing System

**8-point Grid System**:
```css
/* Base spacing unit: 4px */
/* Follow 4px, 8px, 12px, 16px, 20px, 24px, 32px progression */

.spacing-xs { gap: var(--space-1); }  /* 4px - tight elements */
.spacing-sm { gap: var(--space-2); }  /* 8px - related elements */
.spacing-md { gap: var(--space-4); }  /* 16px - standard spacing */
.spacing-lg { gap: var(--space-6); }  /* 24px - section spacing */
.spacing-xl { gap: var(--space-8); }  /* 32px - major sections */
```

## 📱 Layout Principles

### Responsive Design

**Mobile-First Approach**:
```css
/* Mobile-first responsive design */
.container {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .container {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .container {
    padding: var(--space-8);
  }
}
```

**Breakpoint Strategy**:
- **320px+**: Mobile portrait
- **640px+**: Mobile landscape / Small tablet
- **768px+**: Tablet portrait
- **1024px+**: Tablet landscape / Small desktop
- **1280px+**: Desktop
- **1536px+**: Large desktop

### Grid System

**12-Column Grid**:
```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: var(--space-6);
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

/* Common layout patterns */
.layout-sidebar {
  grid-template-columns: 256px 1fr;
}

.layout-two-column {
  grid-template-columns: 1fr 1fr;
}

.layout-three-column {
  grid-template-columns: 1fr 1fr 1fr;
}
```

### Information Hierarchy

**Z-Index Stack**:
```css
/* Z-index system */
.z-base { z-index: 0; }        /* Base content */
.z-dropdown { z-index: 10; }   /* Dropdowns */
.z-sticky { z-index: 20; }     /* Sticky headers */
.z-modal { z-index: 30; }      /* Modals */
.z-popover { z-index: 40; }    /* Popovers */
.z-tooltip { z-index: 50; }    /* Tooltips */
.z-toast { z-index: 60; }      /* Toast notifications */
```

## 🎛️ Interface Components

### Navigation Patterns

**Primary Navigation (Sidebar)**:
```jsx
const navigationStructure = {
  primary: [
    { label: 'Dashboard', icon: DashboardIcon, href: '/dashboard' },
    { label: 'Proyek', icon: ProjectIcon, href: '/projects' },
    { label: 'Inventory', icon: InventoryIcon, href: '/inventory' },
    { label: 'Manpower', icon: UsersIcon, href: '/manpower' },
    { label: 'Keuangan', icon: FinanceIcon, href: '/finance' },
    { label: 'Pajak', icon: TaxIcon, href: '/tax' },
  ],
  secondary: [
    { label: 'Users', icon: UserManageIcon, href: '/users' },
    { label: 'Settings', icon: SettingsIcon, href: '/settings' },
  ]
};
```

**Breadcrumb Navigation**:
- Level 1: Section (Dashboard, Projects, etc.)
- Level 2: Sub-section (Project List, Project Detail)
- Level 3: Specific item (Project Name)
- Maximum 4 levels deep

### Button Hierarchy

**Button Variants**:
```css
/* Primary action - most important */
.btn-primary {
  background: var(--color-primary-600);
  color: white;
  font-weight: var(--font-medium);
}

/* Secondary action - supporting */
.btn-secondary {
  background: white;
  color: var(--color-primary-600);
  border: 1px solid var(--color-primary-600);
}

/* Tertiary action - minimal emphasis */
.btn-tertiary {
  background: transparent;
  color: var(--color-primary-600);
  text-decoration: underline;
}

/* Danger action - destructive */
.btn-danger {
  background: var(--color-error);
  color: white;
}
```

**Button States**:
```css
/* Interactive states */
.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
  box-shadow: var(--shadow-sm);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}
```

### Form Design

**Input Field Patterns**:
```css
.form-field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-label {
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--color-gray-700);
}

.form-input {
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  font-size: var(--text-base);
  transition: all var(--duration-150) var(--ease-out);
}

.form-input:focus {
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  outline: none;
}

.form-input:invalid {
  border-color: var(--color-error);
}

.form-help {
  font-size: var(--text-xs);
  color: var(--color-gray-500);
}

.form-error {
  font-size: var(--text-xs);
  color: var(--color-error);
}
```

## 🎬 Motion Design

### Animation Principles

**Purposeful Motion**:
- Animations harus memiliki functional purpose
- Durasi: 150-300ms untuk most interactions
- Easing: ease-out untuk natural feel
- Maintain 60fps performance

**Common Animation Patterns**:
```css
/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateY(var(--space-4));
}

.page-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: all var(--duration-300) var(--ease-out);
}

/* Modal animations */
.modal-enter {
  opacity: 0;
  transform: scale(0.95);
}

.modal-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: all var(--duration-200) var(--ease-out);
}

/* Loading states */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.loading-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Micro-interactions */
.hover-lift:hover {
  transform: translateY(-2px);
  transition: transform var(--duration-150) var(--ease-out);
}
```

### Performance Guidelines

**Animation Performance**:
- Use `transform` dan `opacity` untuk animations
- Avoid animating `width`, `height`, `top`, `left`
- Use `will-change` property sparingly
- Prefer CSS animations over JavaScript untuk simple animations

## 📊 Data Visualization

### Chart Design Principles

**Color Usage in Charts**:
```css
/* Chart color palette */
.chart-colors {
  --chart-primary: var(--color-primary-600);
  --chart-secondary: var(--color-gray-400);
  --chart-success: var(--color-success);
  --chart-warning: var(--color-warning);
  --chart-error: var(--color-error);
}

/* Accessible color combinations */
.chart-series-1 { color: #2563eb; } /* Blue */
.chart-series-2 { color: #10b981; } /* Green */
.chart-series-3 { color: #f59e0b; } /* Yellow */
.chart-series-4 { color: #ef4444; } /* Red */
.chart-series-5 { color: #8b5cf6; } /* Purple */
```

**Chart Typography**:
```css
.chart-title {
  font-size: var(--text-lg);
  font-weight: var(--font-semibold);
  color: var(--color-gray-900);
}

.chart-label {
  font-size: var(--text-sm);
  font-weight: var(--font-normal);
  color: var(--color-gray-600);
}

.chart-value {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-gray-900);
}
```

### Table Design

**Data Table Styling**:
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: var(--radius-xl);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.table-header {
  background: var(--color-gray-50);
  border-bottom: 1px solid var(--color-gray-200);
}

.table-header th {
  padding: var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--font-semibold);
  color: var(--color-gray-700);
}

.table-row {
  border-bottom: 1px solid var(--color-gray-100);
  transition: background-color var(--duration-150) var(--ease-out);
}

.table-row:hover {
  background: var(--color-gray-50);
}

.table-cell {
  padding: var(--space-4);
  font-size: var(--text-sm);
  color: var(--color-gray-900);
}
```

## 🌍 Localization Considerations

### Indonesian Language Support

**Typography Adjustments**:
- Longer words require flexible layouts
- Consider text expansion (English to Indonesian ~30% longer)
- Right-to-left support for Arabic numerals

**Cultural Considerations**:
- Indonesian business context
- Local construction industry terms
- Regional preferences (Karawang area)
- Currency formatting (Rupiah)
- Date formats (DD/MM/YYYY)

### Number Formatting

```javascript
// Indonesian locale formatting
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (date) => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};
```

## 🔧 Implementation Checklist

### Design Review Checklist

**Visual Design**:
- [ ] Follows HIG color guidelines
- [ ] Typography scale is consistent
- [ ] Spacing follows 8-point grid
- [ ] Elevation is purposeful
- [ ] Brand consistency maintained

**Interaction Design**:
- [ ] Touch targets are minimum 44px
- [ ] Hover states are consistent
- [ ] Focus indicators are visible
- [ ] Loading states are clear
- [ ] Error states are helpful

**Responsive Design**:
- [ ] Mobile-first approach
- [ ] Breakpoints are logical
- [ ] Content reflows properly
- [ ] Touch interactions work
- [ ] Performance is acceptable

### Quality Assurance

**Cross-browser Testing**:
- Safari (primary HIG compliance)
- Chrome
- Firefox
- Edge

**Device Testing**:
- iPhone (various sizes)
- iPad
- Android devices
- Desktop screens (various resolutions)

**Performance Metrics**:
- First Contentful Paint < 2s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- First Input Delay < 100ms

---

**Compliance**: Apple Human Interface Guidelines  
**Version**: 1.0.0  
**Last Updated**: August 14, 2025  
**Maintained by**: Design Team
