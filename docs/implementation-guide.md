# Implementation Guide - Design Tokens Integration

## 🎯 Overview

Panduan implementasi untuk mengintegrasikan design tokens ke dalam sistem YK Construction, mengikuti Apple Human Interface Guidelines dan best practices modern.

## 🎨 CSS Custom Properties Setup

### 1. Create Design Tokens File

Buat file `src/styles/tokens.css`:

```css
:root {
  /* === Color System === */
  
  /* Primary Colors - Blue Scale */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;  /* Primary brand color */
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;
  
  /* Semantic Colors */
  --color-success: #10b981;
  --color-success-light: #6ee7b7;
  --color-success-dark: #059669;
  
  --color-warning: #f59e0b;
  --color-warning-light: #fcd34d;
  --color-warning-dark: #d97706;
  
  --color-error: #ef4444;
  --color-error-light: #fca5a5;
  --color-error-dark: #dc2626;
  
  --color-info: #3b82f6;
  --color-info-light: #93c5fd;
  --color-info-dark: #1d4ed8;
  
  /* Neutral Colors */
  --color-white: #ffffff;
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
  --color-black: #000000;
  
  /* === Typography === */
  
  /* Font Family */
  --font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  --font-mono: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Oxygen Mono', 'Ubuntu Monospace', 'Source Code Pro', 'Fira Mono', 'Droid Sans Mono', 'Courier New', monospace;
  
  /* Font Sizes */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  --text-6xl: 3.75rem;     /* 60px */
  
  /* Font Weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
  --font-extrabold: 800;
  
  /* Line Heights */
  --leading-tight: 1.25;
  --leading-snug: 1.375;
  --leading-normal: 1.5;
  --leading-relaxed: 1.625;
  --leading-loose: 2;
  
  /* === Spacing System === */
  
  /* Base unit: 4px */
  --space-0: 0;
  --space-px: 1px;
  --space-0-5: 0.125rem;   /* 2px */
  --space-1: 0.25rem;      /* 4px */
  --space-1-5: 0.375rem;   /* 6px */
  --space-2: 0.5rem;       /* 8px */
  --space-2-5: 0.625rem;   /* 10px */
  --space-3: 0.75rem;      /* 12px */
  --space-3-5: 0.875rem;   /* 14px */
  --space-4: 1rem;         /* 16px */
  --space-5: 1.25rem;      /* 20px */
  --space-6: 1.5rem;       /* 24px */
  --space-7: 1.75rem;      /* 28px */
  --space-8: 2rem;         /* 32px */
  --space-9: 2.25rem;      /* 36px */
  --space-10: 2.5rem;      /* 40px */
  --space-11: 2.75rem;     /* 44px */
  --space-12: 3rem;        /* 48px */
  --space-14: 3.5rem;      /* 56px */
  --space-16: 4rem;        /* 64px */
  --space-18: 4.5rem;      /* 72px */
  --space-20: 5rem;        /* 80px */
  --space-24: 6rem;        /* 96px */
  --space-28: 7rem;        /* 112px */
  --space-32: 8rem;        /* 128px */
  --space-36: 9rem;        /* 144px */
  --space-40: 10rem;       /* 160px */
  --space-44: 11rem;       /* 176px */
  --space-48: 12rem;       /* 192px */
  --space-52: 13rem;       /* 208px */
  --space-56: 14rem;       /* 224px */
  --space-60: 15rem;       /* 240px */
  --space-64: 16rem;       /* 256px */
  --space-72: 18rem;       /* 288px */
  --space-80: 20rem;       /* 320px */
  --space-96: 24rem;       /* 384px */
  
  /* === Border Radius === */
  
  --radius-none: 0;
  --radius-sm: 0.125rem;    /* 2px */
  --radius-base: 0.25rem;   /* 4px */
  --radius-md: 0.375rem;    /* 6px */
  --radius-lg: 0.5rem;      /* 8px */
  --radius-xl: 0.75rem;     /* 12px */
  --radius-2xl: 1rem;       /* 16px */
  --radius-3xl: 1.5rem;     /* 24px */
  --radius-full: 9999px;
  
  /* === Shadows (Elevation) === */
  
  --shadow-xs: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-base: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
  --shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
  --shadow-inner: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);
  
  /* === Animation === */
  
  /* Timing Functions */
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
  
  /* === Layout === */
  
  /* Breakpoints (for JavaScript usage) */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;
  
  /* Container widths */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;
  
  /* Z-index scale */
  --z-0: 0;
  --z-10: 10;
  --z-20: 20;
  --z-30: 30;
  --z-40: 40;
  --z-50: 50;
  --z-auto: auto;
  
  /* Component-specific z-index */
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-modal: 30;
  --z-popover: 40;
  --z-tooltip: 50;
  --z-toast: 60;
}

/* === Dark Mode Support === */
[data-theme="dark"] {
  /* Dark mode color overrides */
  --color-gray-50: #1f2937;
  --color-gray-100: #374151;
  --color-gray-200: #4b5563;
  --color-gray-300: #6b7280;
  --color-gray-400: #9ca3af;
  --color-gray-500: #d1d5db;
  --color-gray-600: #e5e7eb;
  --color-gray-700: #f3f4f6;
  --color-gray-800: #f9fafb;
  --color-gray-900: #ffffff;
  
  --color-white: #111827;
  --color-black: #ffffff;
}

/* === High Contrast Mode === */
@media (prefers-contrast: high) {
  :root {
    --color-primary-600: #0000ff;
    --color-success: #008000;
    --color-warning: #ff8c00;
    --color-error: #ff0000;
  }
}

/* === Reduced Motion === */
@media (prefers-reduced-motion: reduce) {
  :root {
    --duration-75: 0ms;
    --duration-100: 0ms;
    --duration-150: 0ms;
    --duration-200: 0ms;
    --duration-300: 0ms;
    --duration-500: 0ms;
    --duration-700: 0ms;
    --duration-1000: 0ms;
  }
}
```

### 2. Update Tailwind Configuration

Update `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
        },
        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
        },
        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          dark: 'var(--color-error-dark)',
        },
        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          dark: 'var(--color-info-dark)',
        }
      },
      fontFamily: {
        sans: ['var(--font-primary)'],
        mono: ['var(--font-mono)']
      },
      fontSize: {
        xs: 'var(--text-xs)',
        sm: 'var(--text-sm)',
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
        xl: 'var(--text-xl)',
        '2xl': 'var(--text-2xl)',
        '3xl': 'var(--text-3xl)',
        '4xl': 'var(--text-4xl)',
        '5xl': 'var(--text-5xl)',
        '6xl': 'var(--text-6xl)',
      },
      fontWeight: {
        light: 'var(--font-light)',
        normal: 'var(--font-normal)',
        medium: 'var(--font-medium)',
        semibold: 'var(--font-semibold)',
        bold: 'var(--font-bold)',
        extrabold: 'var(--font-extrabold)',
      },
      lineHeight: {
        tight: 'var(--leading-tight)',
        snug: 'var(--leading-snug)',
        normal: 'var(--leading-normal)',
        relaxed: 'var(--leading-relaxed)',
        loose: 'var(--leading-loose)',
      },
      spacing: {
        'px': 'var(--space-px)',
        '0': 'var(--space-0)',
        '0.5': 'var(--space-0-5)',
        '1': 'var(--space-1)',
        '1.5': 'var(--space-1-5)',
        '2': 'var(--space-2)',
        '2.5': 'var(--space-2-5)',
        '3': 'var(--space-3)',
        '3.5': 'var(--space-3-5)',
        '4': 'var(--space-4)',
        '5': 'var(--space-5)',
        '6': 'var(--space-6)',
        '7': 'var(--space-7)',
        '8': 'var(--space-8)',
        '9': 'var(--space-9)',
        '10': 'var(--space-10)',
        '11': 'var(--space-11)',
        '12': 'var(--space-12)',
        '14': 'var(--space-14)',
        '16': 'var(--space-16)',
        '18': 'var(--space-18)',
        '20': 'var(--space-20)',
        '24': 'var(--space-24)',
        '28': 'var(--space-28)',
        '32': 'var(--space-32)',
        '36': 'var(--space-36)',
        '40': 'var(--space-40)',
        '44': 'var(--space-44)',
        '48': 'var(--space-48)',
        '52': 'var(--space-52)',
        '56': 'var(--space-56)',
        '60': 'var(--space-60)',
        '64': 'var(--space-64)',
        '72': 'var(--space-72)',
        '80': 'var(--space-80)',
        '96': 'var(--space-96)',
      },
      borderRadius: {
        'none': 'var(--radius-none)',
        'sm': 'var(--radius-sm)',
        'DEFAULT': 'var(--radius-base)',
        'md': 'var(--radius-md)',
        'lg': 'var(--radius-lg)',
        'xl': 'var(--radius-xl)',
        '2xl': 'var(--radius-2xl)',
        '3xl': 'var(--radius-3xl)',
        'full': 'var(--radius-full)',
      },
      boxShadow: {
        'xs': 'var(--shadow-xs)',
        'sm': 'var(--shadow-sm)',
        'DEFAULT': 'var(--shadow-base)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
        '2xl': 'var(--shadow-2xl)',
        'inner': 'var(--shadow-inner)',
      },
      transitionTimingFunction: {
        'linear': 'var(--ease-linear)',
        'in': 'var(--ease-in)',
        'out': 'var(--ease-out)',
        'in-out': 'var(--ease-in-out)',
      },
      transitionDuration: {
        '75': 'var(--duration-75)',
        '100': 'var(--duration-100)',
        '150': 'var(--duration-150)',
        '200': 'var(--duration-200)',
        '300': 'var(--duration-300)',
        '500': 'var(--duration-500)',
        '700': 'var(--duration-700)',
        '1000': 'var(--duration-1000)',
      },
      zIndex: {
        '0': 'var(--z-0)',
        '10': 'var(--z-10)',
        '20': 'var(--z-20)',
        '30': 'var(--z-30)',
        '40': 'var(--z-40)',
        '50': 'var(--z-50)',
        'auto': 'var(--z-auto)',
        'dropdown': 'var(--z-dropdown)',
        'sticky': 'var(--z-sticky)',
        'modal': 'var(--z-modal)',
        'popover': 'var(--z-popover)',
        'tooltip': 'var(--z-tooltip)',
        'toast': 'var(--z-toast)',
      }
    },
  },
  plugins: [],
}
```

### 3. Update Main CSS File

Update `src/index.css`:

```css
/* Import design tokens */
@import './styles/tokens.css';

/* Import Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* === Base Styles === */
@layer base {
  html {
    font-family: var(--font-primary);
    line-height: var(--leading-normal);
    -webkit-text-size-adjust: 100%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  body {
    color: var(--color-gray-900);
    background-color: var(--color-gray-50);
    margin: 0;
    font-size: var(--text-base);
  }
  
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
  
  /* Focus styles for accessibility */
  *:focus {
    outline: 2px solid var(--color-primary-600);
    outline-offset: 2px;
  }
  
  *:focus:not(:focus-visible) {
    outline: none;
  }
  
  *:focus-visible {
    outline: 2px solid var(--color-primary-600);
    outline-offset: 2px;
  }
}

/* === Component Layer === */
@layer components {
  /* Button base styles */
  .btn {
    @apply inline-flex items-center justify-center;
    @apply px-4 py-2;
    @apply text-sm font-medium;
    @apply border border-transparent;
    @apply rounded-lg;
    @apply transition-all duration-150 ease-out;
    @apply focus:outline-none focus:ring-2 focus:ring-offset-2;
    @apply disabled:opacity-50 disabled:cursor-not-allowed;
    min-height: var(--space-11); /* 44px for touch targets */
  }
  
  .btn-primary {
    @apply bg-primary-600 text-white;
    @apply hover:bg-primary-700 hover:shadow-md hover:-translate-y-0.5;
    @apply focus:ring-primary-500;
    @apply active:bg-primary-800 active:translate-y-0;
  }
  
  .btn-secondary {
    @apply bg-white text-primary-600;
    @apply border-primary-600;
    @apply hover:bg-primary-50 hover:shadow-md hover:-translate-y-0.5;
    @apply focus:ring-primary-500;
    @apply active:bg-primary-100 active:translate-y-0;
  }
  
  .btn-danger {
    @apply bg-error text-white;
    @apply hover:bg-error-dark hover:shadow-md hover:-translate-y-0.5;
    @apply focus:ring-red-500;
    @apply active:bg-red-800 active:translate-y-0;
  }
  
  .btn-ghost {
    @apply text-primary-600;
    @apply hover:bg-primary-50 hover:text-primary-700;
    @apply focus:ring-primary-500;
  }
  
  /* Form elements */
  .form-input {
    @apply block w-full;
    @apply px-4 py-3;
    @apply text-base;
    @apply border border-gray-300;
    @apply rounded-lg;
    @apply bg-white;
    @apply transition-all duration-150 ease-out;
    @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-600;
    @apply disabled:bg-gray-100 disabled:cursor-not-allowed;
    min-height: var(--space-11); /* 44px for touch targets */
  }
  
  .form-input:invalid {
    @apply border-error focus:ring-red-500 focus:border-error;
  }
  
  .form-label {
    @apply block text-sm font-medium text-gray-700 mb-2;
  }
  
  .form-error {
    @apply text-sm text-error mt-1;
  }
  
  .form-help {
    @apply text-sm text-gray-500 mt-1;
  }
  
  /* Card component */
  .card {
    @apply bg-white border border-gray-200 rounded-xl shadow-sm;
    @apply transition-all duration-150 ease-out;
  }
  
  .card:hover {
    @apply shadow-md border-gray-300;
  }
  
  .card-header {
    @apply px-6 py-4 border-b border-gray-200;
  }
  
  .card-body {
    @apply px-6 py-4;
  }
  
  .card-footer {
    @apply px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl;
  }
  
  /* Data table */
  .data-table {
    @apply w-full bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm;
  }
  
  .data-table th {
    @apply px-6 py-4 text-left text-sm font-semibold text-gray-700 bg-gray-50 border-b border-gray-200;
  }
  
  .data-table td {
    @apply px-6 py-4 text-sm text-gray-900 border-b border-gray-100;
  }
  
  .data-table tr:hover td {
    @apply bg-gray-50;
  }
  
  /* Loading states */
  .loading-skeleton {
    @apply bg-gray-200 animate-pulse rounded;
  }
  
  .loading-spinner {
    @apply animate-spin rounded-full border-2 border-gray-300 border-t-primary-600;
  }
}

/* === Utility Layer === */
@layer utilities {
  /* Screen reader only */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  .sr-only.focusable:active,
  .sr-only.focusable:focus {
    position: static;
    width: auto;
    height: auto;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
  
  /* Truncate text */
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  
  /* Container utilities */
  .container-fluid {
    width: 100%;
    padding-left: var(--space-4);
    padding-right: var(--space-4);
    margin-left: auto;
    margin-right: auto;
  }
  
  @media (min-width: 640px) {
    .container-fluid {
      padding-left: var(--space-6);
      padding-right: var(--space-6);
    }
  }
  
  @media (min-width: 1024px) {
    .container-fluid {
      padding-left: var(--space-8);
      padding-right: var(--space-8);
    }
  }
  
  /* Aspect ratio utilities */
  .aspect-square {
    aspect-ratio: 1 / 1;
  }
  
  .aspect-video {
    aspect-ratio: 16 / 9;
  }
  
  /* Glass effect */
  .glass-effect {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  /* Elevation utilities */
  .elevation-1 { box-shadow: var(--shadow-sm); }
  .elevation-2 { box-shadow: var(--shadow-base); }
  .elevation-3 { box-shadow: var(--shadow-md); }
  .elevation-4 { box-shadow: var(--shadow-lg); }
  .elevation-5 { box-shadow: var(--shadow-xl); }
  
  /* Interactive hover effects */
  .hover-lift {
    @apply transition-transform duration-150 ease-out;
  }
  
  .hover-lift:hover {
    @apply -translate-y-1;
  }
  
  /* Safe area utilities for mobile */
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
  
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .safe-left {
    padding-left: env(safe-area-inset-left);
  }
  
  .safe-right {
    padding-right: env(safe-area-inset-right);
  }
}

/* === Responsive Utilities === */
@media (max-width: 639px) {
  .mobile-hidden {
    display: none;
  }
}

@media (min-width: 640px) {
  .mobile-only {
    display: none;
  }
}

/* === Print Styles === */
@media print {
  .print-hidden {
    display: none !important;
  }
  
  .print-only {
    display: block !important;
  }
  
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }
  
  body {
    background: white !important;
    color: black !important;
  }
}
```

## 🔧 JavaScript Integration

### 1. Theme Management Hook

Create `src/hooks/useTheme.js`:

```javascript
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme
    root.removeAttribute('data-theme');
    
    // Apply new theme
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, setTheme, toggleTheme };
};
```

### 2. Design Token Hook

Create `src/hooks/useDesignTokens.js`:

```javascript
import { useMemo } from 'react';

export const useDesignTokens = () => {
  const tokens = useMemo(() => {
    const getToken = (name) => {
      return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
    };

    return {
      colors: {
        primary: {
          50: getToken('--color-primary-50'),
          100: getToken('--color-primary-100'),
          200: getToken('--color-primary-200'),
          300: getToken('--color-primary-300'),
          400: getToken('--color-primary-400'),
          500: getToken('--color-primary-500'),
          600: getToken('--color-primary-600'),
          700: getToken('--color-primary-700'),
          800: getToken('--color-primary-800'),
          900: getToken('--color-primary-900'),
        },
        success: getToken('--color-success'),
        warning: getToken('--color-warning'),
        error: getToken('--color-error'),
        info: getToken('--color-info'),
      },
      spacing: {
        xs: getToken('--space-1'),
        sm: getToken('--space-2'),
        md: getToken('--space-4'),
        lg: getToken('--space-6'),
        xl: getToken('--space-8'),
      },
      borderRadius: {
        sm: getToken('--radius-sm'),
        base: getToken('--radius-base'),
        md: getToken('--radius-md'),
        lg: getToken('--radius-lg'),
        xl: getToken('--radius-xl'),
      },
      shadows: {
        sm: getToken('--shadow-sm'),
        base: getToken('--shadow-base'),
        md: getToken('--shadow-md'),
        lg: getToken('--shadow-lg'),
        xl: getToken('--shadow-xl'),
      }
    };
  }, []);

  return tokens;
};
```

### 3. Responsive Hook

Create `src/hooks/useResponsive.js`:

```javascript
import { useState, useEffect } from 'react';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState(() => {
    if (typeof window === 'undefined') return 'lg';
    
    const width = window.innerWidth;
    if (width < breakpoints.sm) return 'xs';
    if (width < breakpoints.md) return 'sm';
    if (width < breakpoints.lg) return 'md';
    if (width < breakpoints.xl) return 'lg';
    if (width < breakpoints['2xl']) return 'xl';
    return '2xl';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < breakpoints.sm) setScreenSize('xs');
      else if (width < breakpoints.md) setScreenSize('sm');
      else if (width < breakpoints.lg) setScreenSize('md');
      else if (width < breakpoints.xl) setScreenSize('lg');
      else if (width < breakpoints['2xl']) setScreenSize('xl');
      else setScreenSize('2xl');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = screenSize === 'xs' || screenSize === 'sm';
  const isTablet = screenSize === 'md';
  const isDesktop = screenSize === 'lg' || screenSize === 'xl' || screenSize === '2xl';

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    breakpoints,
  };
};
```

## 📱 Component Examples

### 1. Button Component with Design Tokens

```jsx
// src/components/Button.jsx
import React from 'react';
import { clsx } from 'clsx';

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon,
  children,
  className,
  ...props 
}) => {
  const baseClasses = 'btn';
  
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const classes = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    {
      'opacity-50 cursor-not-allowed': disabled || loading,
    },
    className
  );

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="loading-spinner w-4 h-4 mr-2" />
      )}
      {icon && !loading && (
        <span className="mr-2">{icon}</span>
      )}
      {children}
    </button>
  );
};

export default Button;
```

### 2. Card Component

```jsx
// src/components/Card.jsx
import React from 'react';
import { clsx } from 'clsx';

const Card = ({ 
  children, 
  className,
  interactive = false,
  ...props 
}) => {
  const classes = clsx(
    'card',
    {
      'hover-lift cursor-pointer': interactive,
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className, ...props }) => (
  <div className={clsx('card-header', className)} {...props}>
    {children}
  </div>
);

const CardBody = ({ children, className, ...props }) => (
  <div className={clsx('card-body', className)} {...props}>
    {children}
  </div>
);

const CardFooter = ({ children, className, ...props }) => (
  <div className={clsx('card-footer', className)} {...props}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
```

## 🧪 Testing Design Tokens

### 1. Visual Regression Testing

```javascript
// src/tests/designTokens.test.js
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Design Tokens', () => {
  test('CSS custom properties are defined', () => {
    // Mount a test element
    const { container } = render(<div data-testid="test-element" />);
    const element = container.querySelector('[data-testid="test-element"]');
    
    // Get computed styles
    const styles = getComputedStyle(element);
    
    // Test color tokens
    expect(styles.getPropertyValue('--color-primary-600')).toBe('#2563eb');
    expect(styles.getPropertyValue('--color-success')).toBe('#10b981');
    expect(styles.getPropertyValue('--color-error')).toBe('#ef4444');
    
    // Test spacing tokens
    expect(styles.getPropertyValue('--space-4')).toBe('1rem');
    expect(styles.getPropertyValue('--space-8')).toBe('2rem');
    
    // Test typography tokens
    expect(styles.getPropertyValue('--text-base')).toBe('1rem');
    expect(styles.getPropertyValue('--font-medium')).toBe('500');
  });
  
  test('dark mode tokens are applied', () => {
    // Add dark mode attribute
    document.documentElement.setAttribute('data-theme', 'dark');
    
    const { container } = render(<div data-testid="test-element" />);
    const element = container.querySelector('[data-testid="test-element"]');
    const styles = getComputedStyle(element);
    
    // Test dark mode overrides
    expect(styles.getPropertyValue('--color-gray-900')).toBe('#ffffff');
    expect(styles.getPropertyValue('--color-white')).toBe('#111827');
    
    // Cleanup
    document.documentElement.removeAttribute('data-theme');
  });
});
```

### 2. Component Token Usage

```javascript
// src/tests/Button.test.js
import { render, screen } from '@testing-library/react';
import Button from '../components/Button';

describe('Button Component', () => {
  test('applies correct design tokens', () => {
    render(<Button variant="primary">Test Button</Button>);
    const button = screen.getByRole('button');
    
    // Check CSS classes that use design tokens
    expect(button).toHaveClass('btn-primary');
    
    // Check computed styles
    const styles = getComputedStyle(button);
    expect(styles.borderRadius).toBe('0.5rem'); // --radius-lg
    expect(styles.transitionDuration).toBe('0.15s'); // --duration-150
  });
});
```

## 🚀 Migration Steps

### Phase 1: Setup Foundation
1. ✅ Create `tokens.css` file
2. ✅ Update `tailwind.config.js`
3. ✅ Update `index.css`
4. ✅ Test basic token integration

### Phase 2: Component Migration
1. ✅ Update Button component
2. ✅ Update Form components  
3. ✅ Update Card component
4. ✅ Update Table component

### Phase 3: Advanced Features
1. ✅ Implement theme switching
2. ✅ Add responsive utilities
3. ✅ Setup dark mode
4. ✅ Performance optimization

### Phase 4: Testing & Documentation
1. ✅ Write component tests
2. ✅ Visual regression tests
3. ✅ Update documentation
4. ✅ Team training

---

**Implementation Status**: Ready for Development  
**Estimated Timeline**: 2-3 sprints  
**Dependencies**: Tailwind CSS, React 18+  
**Testing Requirements**: Jest, React Testing Library
