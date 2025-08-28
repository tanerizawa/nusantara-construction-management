# YK Construction - Design System Documentation

## 🎨 Design Principles

Sistem desain YK Construction mengikuti prinsip-prinsip Apple Human Interface Guidelines (HIG) untuk memastikan konsistensi, aksesibilitas, dan pengalaman pengguna yang optimal.

### Core Design Principles

1. **Clarity** - Interface yang jelas dan mudah dipahami
2. **Deference** - UI yang mendukung konten, bukan mengalihkan perhatian
3. **Depth** - Hierarki visual yang memandu pengguna

## 🎯 Design Tokens

### Color System

```css
/* Primary Colors - Blue Scale */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6; /* Primary */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;

/* Semantic Colors */
--color-success: #10b981;
--color-warning: #f59e0b;
--color-error: #ef4444;
--color-info: #3b82f6;

/* Neutral Colors */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
```

### Typography Scale

```css
/* Font Family */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;     /* 12px */
--text-sm: 0.875rem;    /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg: 1.125rem;    /* 18px */
--text-xl: 1.25rem;     /* 20px */
--text-2xl: 1.5rem;     /* 24px */
--text-3xl: 1.875rem;   /* 30px */
--text-4xl: 2.25rem;    /* 36px */

/* Font Weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
```

### Spacing Scale

```css
/* Spacing System (4px base unit) */
--space-0: 0;
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-5: 1.25rem;  /* 20px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-10: 2.5rem;  /* 40px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-20: 5rem;    /* 80px */
--space-24: 6rem;    /* 96px */
```

### Border Radius

```css
/* Border Radius */
--radius-none: 0;
--radius-sm: 0.125rem;   /* 2px */
--radius-base: 0.25rem;  /* 4px */
--radius-md: 0.375rem;   /* 6px */
--radius-lg: 0.5rem;     /* 8px */
--radius-xl: 0.75rem;    /* 12px */
--radius-2xl: 1rem;      /* 16px */
--radius-full: 9999px;
```

### Shadows

```css
/* Elevation System */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

## 🎭 Animation & Motion

### Timing Functions

```css
/* Easing Curves */
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Duration */
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Motion Principles

1. **Purposeful**: Animasi harus memiliki tujuan yang jelas
2. **Quick**: Durasi 150-300ms untuk interaksi standar
3. **Subtle**: Gerakan yang halus dan tidak mengganggu
4. **Consistent**: Timing dan easing yang konsisten

## 📱 Layout System

### Breakpoints

```css
/* Responsive Breakpoints */
--breakpoint-sm: 640px;   /* Mobile */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large Desktop */
--breakpoint-2xl: 1536px; /* Extra Large */
```

### Grid System

```css
/* Container Widths */
--container-sm: 100%;
--container-md: 768px;
--container-lg: 1024px;
--container-xl: 1280px;

/* Grid Columns */
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
.grid-cols-12 { grid-template-columns: repeat(12, 1fr); }
```

## 🎨 Component Guidelines

### Button States

```css
/* Primary Button */
.btn-primary {
  background: var(--color-primary-600);
  color: white;
  border-radius: var(--radius-lg);
  transition: all var(--duration-150) var(--ease-in-out);
}

.btn-primary:hover {
  background: var(--color-primary-700);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  background: var(--color-primary-800);
  transform: translateY(0);
}

.btn-primary:disabled {
  background: var(--color-gray-300);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
```

### Form Elements

```css
/* Input Fields */
.form-input {
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-4);
  transition: all var(--duration-150) var(--ease-in-out);
}

.form-input:focus {
  border-color: var(--color-primary-600);
  box-shadow: 0 0 0 3px rgb(59 130 246 / 0.1);
  outline: none;
}
```

## 🌐 Accessibility

### Color Contrast

- **Normal Text**: Minimum 4.5:1 contrast ratio
- **Large Text**: Minimum 3:1 contrast ratio
- **UI Components**: Minimum 3:1 contrast ratio

### Focus States

```css
/* Focus Ring */
.focus-ring:focus {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
}

/* Focus Visible (keyboard only) */
.focus-visible:focus-visible {
  box-shadow: 0 0 0 2px var(--color-primary-600);
}
```

### ARIA Labels

- Semua interactive elements harus memiliki accessible names
- Form inputs harus memiliki labels yang jelas
- Status pesan harus menggunakan ARIA live regions

## 🔧 Implementation

### CSS Custom Properties

```css
:root {
  /* Apply all design tokens here */
  color-scheme: light;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode token overrides */
  }
}
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          // ... other primary colors
        }
      },
      fontFamily: {
        sans: ['var(--font-primary)']
      },
      spacing: {
        1: 'var(--space-1)',
        // ... other spacing values
      }
    }
  }
}
```

## 📚 Component Library

### Available Components

1. **Layout Components**
   - Header
   - Sidebar
   - Breadcrumbs
   - PageActions

2. **Data Display**
   - DataTable
   - DataCard
   - DataEmpty
   - DataLoader

3. **Forms**
   - Input
   - Select
   - Checkbox
   - Radio
   - Button

4. **Feedback**
   - Toast
   - Modal
   - Alert
   - Loading

### Usage Guidelines

Setiap komponen harus:
- Mengikuti design tokens yang telah ditetapkan
- Memiliki states yang konsisten (default, hover, active, disabled)
- Mendukung accessibility requirements
- Responsive di semua breakpoints
- Menggunakan semantic HTML

## 🔄 Maintenance

### Review Process

1. **Design Token Updates**: Review quarterly
2. **Component Updates**: Review setiap release
3. **Accessibility Audit**: Review bulanan
4. **Performance Check**: Review setiap sprint

### Documentation Updates

- Update dokumentasi setiap ada perubahan design tokens
- Maintain changelog untuk tracking perubahan
- Provide migration guides untuk breaking changes

---

**Version**: 1.0.0  
**Last Updated**: August 14, 2025  
**Maintained by**: UI/UX Team
