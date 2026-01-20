# Style Guide - Nusantara Construction Management System

## 🎨 Design Philosophy

Sistem ini mengadopsi **Apple Human Interface Guidelines (HIG)** dengan pendekatan **compact design** dan **dark matte theme**. Fokus pada efisiensi ruang, kejelasan visual, dan pengalaman pengguna yang intuitif untuk aplikasi konstruksi.

### Core Principles

1. **Compact & Efficient** - Maksimalkan penggunaan ruang tanpa terasa cramped
2. **Visual Hierarchy** - Jelas dan mudah dipahami untuk data konstruksi yang kompleks
3. **Consistent** - Pola yang konsisten di seluruh aplikasi (React components)
4. **Responsive** - Adaptif untuk berbagai ukuran layar (mobile-first approach)
5. **Touch-Friendly** - Minimum 44px untuk interactive elements
6. **Fast & Smooth** - React transitions yang smooth dan loading yang cepat

## 🏗️ Technology Stack

- **Frontend**: React 18 + React Router
- **Styling**: Tailwind CSS 3.x
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect, useContext)
- **Build Tool**: Webpack / Vite
- **Components**: Functional Components dengan Hooks

---

## 🎭 Color Palette

### Dark Matte Theme - Apple HIG Colors

**⚠️ CRITICAL: ALWAYS USE HEX CODES WITH TAILWIND BRACKET NOTATION!**

Sistem ini menggunakan Apple Human Interface Guidelines color palette dengan hex codes eksplisit untuk memastikan konsistensi visual yang presisi. **JANGAN gunakan Tailwind generic classes** seperti `bg-gray-800` atau `text-gray-400` karena tidak match dengan Apple HIG colors.

```javascript
// Color Constants for React (Optional - dapat digunakan di JavaScript)
export const COLORS = {
  // Primary Backgrounds
  bgPrimary: '#1C1C1E',        // Main background - Dark Charcoal
  bgSecondary: '#2C2C2E',      // Cards, modals - Lighter Charcoal
  bgTertiary: '#3A3A3C',       // Elevated surfaces, hover states
  bgQuaternary: '#48484A',     // Active states, emphasized elements

  // Accent Colors
  accentBlue: '#0A84FF',       // Primary actions, links
  accentBlueHover: '#0970DD',  // Hover states for primary
  accentBlueLight: '#64D2FF',  // Light blue accents

  // Status Colors
  success: '#30D158',          // Success states, positive actions
  successHover: '#2FB350',     // Success hover state
  warning: '#FF9F0A',          // Warning states, pending
  error: '#FF453A',            // Error states, destructive actions
  errorHover: '#FF3B30',       // Error hover state
  info: '#64D2FF',             // Information, neutral

  // Text Colors
  textPrimary: '#FFFFFF',      // Primary text, headings
  textSecondary: '#98989D',    // Secondary text, labels, metadata
  textTertiary: '#636366',     // Disabled text, placeholders
  textQuaternary: '#48484A',   // Very subtle text

  // Border & Divider
  borderPrimary: '#38383A',    // Subtle borders, dividers
  borderSecondary: '#48484A',  // Emphasized borders, hover
  divider: '#2C2C2E',         // Divider lines
};
```

### ⚠️ CORRECT Usage - React + Tailwind

```jsx
// ✅ CORRECT - Using Apple HIG hex codes in React components

import React from 'react';

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 hover:border-[#48484A] transition-colors">
      {/* Header */}
      <h3 className="text-white text-lg font-semibold mb-3">
        {project.name}
      </h3>
      
      {/* Description */}
      <p className="text-[#98989D] text-sm mb-4">
        {project.description}
      </p>
      
      {/* Status Badge */}
      <span className="inline-flex px-2.5 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-medium">
        Active
      </span>
      
      {/* Action Button */}
      <button className="mt-4 w-full bg-[#0A84FF] hover:bg-[#0970DD] text-white py-2.5 rounded-lg transition-colors duration-150">
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
```

### ❌ INCORRECT Usage - DO NOT USE

```jsx
// ❌ WRONG - Generic Tailwind classes tidak match dengan Apple HIG

const WrongCard = () => {
  return (
    <div className="bg-gray-800">              {/* JANGAN! Gunakan bg-[#2C2C2E] */}
      <p className="text-gray-400">Text</p>    {/* JANGAN! Gunakan text-[#98989D] */}
      <div className="border-gray-700">       {/* JANGAN! Gunakan border-[#38383A] */}
        Content
      </div>
    </div>
  );
};
```

### 📋 Quick Reference - React Component Colors

| Element Type | Tailwind Class | Purpose |
|--------------|----------------|---------|
| Page background | `bg-[#1C1C1E]` | Main page/app background |
| Card background | `bg-[#2C2C2E]` | Cards, modals, panels |
| Input background | `bg-[#1C1C1E]` | Form inputs, textareas |
| Hover state | `hover:bg-[#3A3A3C]` | Interactive hover |
| Active/Focus | `bg-[#48484A]` | Active/pressed state |
| Primary text | `text-white` | Headings, labels |
| Secondary text | `text-[#98989D]` | Metadata, descriptions |
| Disabled text | `text-[#636366]` | Placeholders, disabled |
| Subtle border | `border-[#38383A]` | Card borders, dividers |
| Emphasized border | `border-[#48484A]` | Hover borders |
| Primary action | `bg-[#0A84FF] hover:bg-[#0970DD]` | Primary buttons |
| Success | `bg-[#30D158] hover:bg-[#2FB350]` | Success buttons |
| Danger | `bg-[#FF453A] hover:bg-[#FF3B30]` | Delete actions |
| Warning | `bg-[#FF9F0A]` | Warning states |

---

## 📏 Spacing System

Menggunakan base unit **4px** untuk spacing yang konsisten (Tailwind default).

```javascript
// Spacing Scale (Tailwind)
const SPACING = {
  xs: 'px-1',     // 4px   - Extra tight
  sm: 'px-2',     // 8px   - Tight
  md: 'px-3',     // 12px  - Compact
  base: 'px-4',   // 16px  - Standard
  lg: 'px-5',     // 20px  - Comfortable
  xl: 'px-6',     // 24px  - Spacious
  '2xl': 'px-8',  // 32px  - Large
  '3xl': 'px-10', // 40px  - Extra large
  '4xl': 'px-12', // 48px  - Huge
  '5xl': 'px-16', // 64px  - Section spacing
};

// Component-specific spacing
const COMPONENT_SPACING = {
  cardPadding: 'p-4',          // 16px - Internal card padding
  sectionSpacing: 'space-y-6', // 24px - Between sections
  pagePadding: 'p-5',          // 20px - Page container padding
};
```

### React Component Spacing Examples

```jsx
// Compact Card Component
const CompactCard = ({ title, description }) => (
  <div className="p-4 space-y-3 bg-[#2C2C2E] rounded-xl">
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="text-sm text-[#98989D]">{description}</p>
  </div>
);

// Form Component with Spacing
const ProjectForm = () => (
  <form className="space-y-4">
    <input className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#38383A] rounded-lg" />
    <input className="w-full px-4 py-3 bg-[#1C1C1E] border border-[#38383A] rounded-lg" />
    <button className="px-5 py-2.5 bg-[#0A84FF] text-white rounded-lg">Submit</button>
  </form>
);

// Page Layout with Sections
const DashboardPage = () => (
  <main className="p-5 space-y-6">
    <section>Stats Section</section>
    <section>Projects Section</section>
    <section>Activities Section</section>
  </main>
);
```

---

## 🔤 Typography

### Font Family

```css
/* Tailwind Config - tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'SF Pro Display',
          '-apple-system',
          'BlinkMacSystemFont',
          'Inter',
          'Segoe UI',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
    },
  },
};
```

### Font Sizes & Usage in React

```jsx
// Typography Components

// Page Title (H1)
const PageTitle = ({ children }) => (
  <h1 className="text-3xl font-bold text-white mb-6">
    {children}
  </h1>
);

// Section Title (H2)
const SectionTitle = ({ children }) => (
  <h2 className="text-2xl font-semibold text-white mb-4">
    {children}
  </h2>
);

// Card Title (H3)
const CardTitle = ({ children }) => (
  <h3 className="text-lg font-semibold text-white mb-3">
    {children}
  </h3>
);

// Body Text
const BodyText = ({ children }) => (
  <p className="text-base text-[#98989D] leading-relaxed">
    {children}
  </p>
);

// Label
const Label = ({ children, required }) => (
  <label className="text-sm font-medium text-[#98989D]">
    {children}
    {required && <span className="text-[#FF453A] ml-1">*</span>}
  </label>
);

// Helper Text
const HelperText = ({ children }) => (
  <span className="text-xs text-[#636366]">
    {children}
  </span>
);
```

### Typography Scale

| Component | Size | Weight | Class |
|-----------|------|--------|-------|
| Page Title (H1) | 32px | Bold (700) | `text-3xl font-bold` |
| Section Title (H2) | 28px | Semibold (600) | `text-2xl font-semibold` |
| Subsection (H3) | 24px | Semibold (600) | `text-xl font-semibold` |
| Card Title (H4) | 20px | Semibold (600) | `text-lg font-semibold` |
| Small Heading (H5) | 16px | Medium (500) | `text-base font-medium` |
| Body Text | 16px | Regular (400) | `text-base` |
| Secondary Text | 14px | Regular (400) | `text-sm` |
| Captions | 12px | Regular (400) | `text-xs` |
| Tiny Labels | 11px | Regular (400) | `text-[11px]` |

---

## 🧩 React Component Library

### 1. Buttons

```jsx
import React from 'react';

// Primary Button
export const PrimaryButton = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-5 py-2.5 
      bg-[#0A84FF] hover:bg-[#0970DD] active:bg-[#0970DD]
      text-white text-sm font-medium
      rounded-lg
      transition-colors duration-150
      focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-2 focus:ring-offset-[#1C1C1E]
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {children}
  </button>
);

// Secondary Button
export const SecondaryButton = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-5 py-2.5
      bg-[#3A3A3C] hover:bg-[#48484A] active:bg-[#48484A]
      text-white text-sm font-medium
      rounded-lg
      transition-colors duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {children}
  </button>
);

// Destructive Button
export const DestructiveButton = ({ children, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      px-5 py-2.5
      bg-[#FF453A] hover:bg-[#FF3B30] active:bg-[#FF3B30]
      text-white text-sm font-medium
      rounded-lg
      transition-colors duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    {children}
  </button>
);

// Icon Button
export const IconButton = ({ icon: Icon, onClick, disabled, className = '' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      p-2.5
      bg-[#3A3A3C] hover:bg-[#48484A]
      text-[#98989D] hover:text-white
      rounded-lg
      transition-all duration-150
      disabled:opacity-50 disabled:cursor-not-allowed
      ${className}
    `}
  >
    <Icon className="w-5 h-5" />
  </button>
);

// Button Group
export const ButtonGroup = ({ children }) => (
  <div className="inline-flex rounded-lg overflow-hidden">
    {children}
  </div>
);

export const ButtonGroupItem = ({ children, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      px-4 py-2 text-sm font-medium
      transition-colors duration-150
      ${active 
        ? 'bg-[#0A84FF] text-white' 
        : 'bg-[#3A3A3C] hover:bg-[#48484A] text-[#98989D]'
      }
    `}
  >
    {children}
  </button>
);
```

### 2. Form Elements

```jsx
import React from 'react';

// Text Input
export const TextInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  required, 
  error,
  helperText,
  ...props 
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-[#FF453A] ml-1">*</span>}
      </label>
    )}
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`
        w-full px-4 py-3
        bg-[#1C1C1E] border 
        ${error ? 'border-[#FF453A]' : 'border-[#38383A]'}
        text-white text-sm
        rounded-lg
        focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
        placeholder-[#636366]
        transition-colors duration-150
      `}
      {...props}
    />
    {error && (
      <p className="text-xs text-[#FF453A]">{error}</p>
    )}
    {helperText && !error && (
      <p className="text-xs text-[#636366]">{helperText}</p>
    )}
  </div>
);

// Select Dropdown
export const Select = ({ label, value, onChange, options, required, error }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-[#FF453A] ml-1">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={onChange}
      className={`
        w-full px-4 py-3
        bg-[#1C1C1E] border
        ${error ? 'border-[#FF453A]' : 'border-[#38383A]'}
        text-white text-sm
        rounded-lg
        focus:outline-none focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
        transition-colors duration-150
      `}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    {error && (
      <p className="text-xs text-[#FF453A]">{error}</p>
    )}
  </div>
);

// Textarea
export const Textarea = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  rows = 4, 
  required,
  error 
}) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-white">
        {label}
        {required && <span className="text-[#FF453A] ml-1">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className={`
        w-full px-4 py-3
        bg-[#1C1C1E] border
        ${error ? 'border-[#FF453A]' : 'border-[#38383A]'}
        text-white text-sm
        rounded-lg
        focus:outline-none focus:ring-2 focus:ring-[#0A84FF]
        placeholder-[#636366]
        resize-none
        transition-colors duration-150
      `}
    />
    {error && (
      <p className="text-xs text-[#FF453A]">{error}</p>
    )}
  </div>
);

// Checkbox
export const Checkbox = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="
        w-5 h-5
        bg-[#1C1C1E] border-[#38383A]
        text-[#0A84FF]
        rounded
        focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-[#1C1C1E]
        transition-colors duration-150
      "
    />
    <span className="text-sm text-[#98989D]">{label}</span>
  </label>
);

// Toggle Switch
export const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center space-x-3 cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className="
        w-11 h-6
        bg-[#3A3A3C]
        peer-checked:bg-[#0A84FF]
        rounded-full
        peer
        transition-colors duration-200
      " />
      <div className="
        absolute left-1 top-1
        w-4 h-4
        bg-white
        rounded-full
        transition-transform duration-200
        peer-checked:translate-x-5
      " />
    </div>
    <span className="text-sm text-[#98989D]">{label}</span>
  </label>
);
```

### 3. Cards

```jsx
import React from 'react';

// Basic Card
export const Card = ({ children, className = '', hover = true }) => (
  <div className={`
    bg-[#2C2C2E]
    border border-[#38383A]
    rounded-xl
    p-4
    ${hover ? 'hover:border-[#48484A]' : ''}
    transition-colors duration-150
    ${className}
  `}>
    {children}
  </div>
);

// Card with Header
export const CardWithHeader = ({ title, actions, children }) => (
  <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl overflow-hidden">
    <div className="px-5 py-4 border-b border-[#38383A] flex items-center justify-between">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {actions && <div>{actions}</div>}
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);

// Stat Card
export const StatCard = ({ title, value, change, trend, description }) => (
  <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl p-5 hover:border-[#48484A] transition-colors">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-[#98989D]">{title}</span>
      {change && (
        <span className={`text-xs flex items-center ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
      )}
    </div>
    <div className="text-2xl font-bold text-white mb-1">
      {value}
    </div>
    {description && (
      <p className="text-xs text-[#636366]">{description}</p>
    )}
  </div>
);
```

### 4. Status Badges

```jsx
import React from 'react';

const STATUS_STYLES = {
  success: 'bg-green-500/10 text-green-400 border-green-500/20',
  warning: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  error: 'bg-red-500/10 text-red-400 border-red-500/20',
  info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  default: 'bg-[#3A3A3C] text-[#98989D] border-[#48484A]',
};

export const Badge = ({ children, status = 'default', className = '' }) => (
  <span className={`
    inline-flex px-2.5 py-1
    text-xs font-medium
    border rounded-full
    ${STATUS_STYLES[status]}
    ${className}
  `}>
    {children}
  </span>
);

// Count Badge (for notifications)
export const CountBadge = ({ count }) => (
  <span className="
    flex items-center justify-center
    min-w-[20px] h-5 px-1.5
    bg-[#FF453A] text-white
    text-xs font-medium
    rounded-full
  ">
    {count > 99 ? '99+' : count}
  </span>
);
```

### 5. Modal

```jsx
import React from 'react';
import { X } from 'lucide-react';

export const Modal = ({ isOpen, onClose, title, children, footer }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="
        bg-[#2C2C2E]
        border border-[#38383A]
        rounded-2xl
        shadow-2xl
        max-w-lg w-full
        max-h-[90vh]
        overflow-hidden
        animate-fadeIn
      ">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#38383A] flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#3A3A3C] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#98989D]" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 bg-[#1C1C1E] border-t border-[#38383A] flex justify-end space-x-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 6. Loading States

```jsx
import React from 'react';

// Spinner
export const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <svg 
      className={`animate-spin ${sizeClasses[size]} text-[#0A84FF]`}
      xmlns="http://www.w3.org/2000/svg" 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

// Skeleton Loader
export const Skeleton = ({ className = '' }) => (
  <div className={`bg-[#3A3A3C] rounded animate-pulse ${className}`} />
);

export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-3">
    {[...Array(lines)].map((_, i) => (
      <Skeleton 
        key={i}
        className={`h-4 ${i === lines - 1 ? 'w-4/6' : 'w-full'}`}
      />
    ))}
  </div>
);

// Progress Bar
export const ProgressBar = ({ value = 0, max = 100, className = '' }) => (
  <div className={`w-full bg-[#3A3A3C] rounded-full h-2 ${className}`}>
    <div 
      className="bg-[#0A84FF] h-2 rounded-full transition-all duration-300"
      style={{ width: `${(value / max) * 100}%` }}
    />
  </div>
);
```

### 7. Alerts & Toasts

```jsx
import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ALERT_STYLES = {
  success: {
    bg: 'bg-green-500/10',
    border: 'border-green-500/20',
    text: 'text-green-400',
    icon: CheckCircle,
  },
  error: {
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
    text: 'text-red-400',
    icon: XCircle,
  },
  warning: {
    bg: 'bg-yellow-500/10',
    border: 'border-yellow-500/20',
    text: 'text-yellow-400',
    icon: AlertTriangle,
  },
  info: {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20',
    text: 'text-blue-400',
    icon: Info,
  },
};

export const Alert = ({ type = 'info', title, message, onClose }) => {
  const style = ALERT_STYLES[type];
  const Icon = style.icon;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${style.text} mt-0.5 flex-shrink-0`} />
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-semibold ${style.text}`}>{title}</h4>
          {message && (
            <p className={`text-sm ${style.text} opacity-80 mt-1`}>{message}</p>
          )}
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className={`${style.text} hover:opacity-80 flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Notification (use with toast library like react-hot-toast)
export const Toast = ({ type = 'info', title, message }) => {
  const style = ALERT_STYLES[type];
  const Icon = style.icon;

  return (
    <div className="
      bg-[#2C2C2E] border border-[#38383A]
      rounded-lg shadow-2xl
      p-4 min-w-[300px]
      animate-slideUp
    ">
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${style.text} flex-shrink-0`} />
        <div className="flex-1">
          <p className="text-sm font-medium text-white">{title}</p>
          {message && (
            <p className="text-xs text-[#98989D] mt-1">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
```

---

## 📱 Responsive Design

### Breakpoints (Tailwind Default)

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'sm': '640px',   // Small devices (tablets)
      'md': '768px',   // Medium devices (landscape tablets)
      'lg': '1024px',  // Large devices (laptops/desktops)
      'xl': '1280px',  // Extra large devices (large desktops)
      '2xl': '1536px', // 2X large devices (larger desktops)
    },
  },
};
```

### Responsive React Components

```jsx
// Responsive Grid
const ProjectGrid = ({ projects }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {projects.map(project => (
      <ProjectCard key={project.id} project={project} />
    ))}
  </div>
);

// Responsive Padding
const ResponsiveContainer = ({ children }) => (
  <div className="px-4 md:px-6 lg:px-8">
    {children}
  </div>
);

// Responsive Text
const ResponsiveHeading = ({ children }) => (
  <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
    {children}
  </h1>
);

// Hide/Show on Different Screens
const MobileMenu = () => (
  <div className="block lg:hidden">
    {/* Mobile menu content */}
  </div>
);

const DesktopNav = () => (
  <nav className="hidden lg:block">
    {/* Desktop navigation */}
  </nav>
);
```

---

## ✨ Animations & Transitions

### Tailwind Animation Classes

```css
/* Add to tailwind.config.js */
module.exports = {
  theme: {
    extend: {
      animation: {
        'fadeIn': 'fadeIn 200ms ease-in',
        'slideUp': 'slideUp 200ms ease-out',
        'scaleIn': 'scaleIn 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { 
            opacity: '0',
            transform: 'translateY(10px)'
          },
          '100%': { 
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        scaleIn: {
          '0%': { 
            opacity: '0',
            transform: 'scale(0.95)'
          },
          '100%': { 
            opacity: '1',
            transform: 'scale(1)'
          },
        },
      },
    },
  },
};
```

### React Animation Examples

```jsx
import React, { useState } from 'react';

// Fade In Component
const FadeIn = ({ children, delay = 0 }) => (
  <div 
    className="animate-fadeIn"
    style={{ animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
);

// Animated Button
const AnimatedButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="
      px-5 py-2.5
      bg-[#0A84FF] hover:bg-[#0970DD]
      text-white text-sm font-medium
      rounded-lg
      transition-all duration-150
      hover:scale-105 active:scale-95
    "
  >
    {children}
  </button>
);

// Collapsible Section
const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-[#38383A] rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-[#2C2C2E] hover:bg-[#3A3A3C] text-left transition-colors"
      >
        <span className="text-white font-medium">{title}</span>
      </button>
      <div className={`
        overflow-hidden transition-all duration-300 ease-in-out
        ${isOpen ? 'max-h-96' : 'max-h-0'}
      `}>
        <div className="p-4 bg-[#1C1C1E]">
          {children}
        </div>
      </div>
    </div>
  );
};
```

---

## 🎯 Interactive States

### React Component State Examples

```jsx
// Focus State Example
const FocusableInput = () => (
  <input
    className="
      px-4 py-3
      bg-[#1C1C1E] border border-[#38383A]
      text-white
      rounded-lg
      focus:outline-none
      focus:ring-2
      focus:ring-[#0A84FF]
      focus:border-transparent
      transition-all duration-150
    "
  />
);

// Hover State Example
const HoverCard = ({ children }) => (
  <div className="
    bg-[#2C2C2E]
    border border-[#38383A]
    hover:border-[#48484A]
    hover:bg-[#3A3A3C]
    rounded-xl p-4
    transition-all duration-150
    cursor-pointer
  ">
    {children}
  </div>
);

// Active/Pressed State Example
const PressableButton = ({ children }) => (
  <button className="
    px-5 py-2.5
    bg-[#0A84FF]
    hover:bg-[#0970DD]
    active:bg-[#0970DD]
    active:scale-95
    text-white
    rounded-lg
    transition-all duration-150
  ">
    {children}
  </button>
);

// Disabled State Example
const DisabledButton = ({ disabled, children }) => (
  <button
    disabled={disabled}
    className="
      px-5 py-2.5
      bg-[#0A84FF]
      text-white
      rounded-lg
      disabled:opacity-50
      disabled:cursor-not-allowed
      transition-opacity duration-150
    "
  >
    {children}
  </button>
);
```

---

## 📐 Layout Patterns

### React Layout Components

```jsx
// Container
export const Container = ({ children, className = '' }) => (
  <div className={`container mx-auto px-5 max-w-7xl ${className}`}>
    {children}
  </div>
);

// Two-Column Layout
export const TwoColumnLayout = ({ sidebar, main }) => (
  <div className="flex gap-6">
    <aside className="w-64 flex-shrink-0">
      {sidebar}
    </aside>
    <main className="flex-1 min-w-0">
      {main}
    </main>
  </div>
);

// Dashboard Grid
export const DashboardGrid = ({ children }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
    {children}
  </div>
);

// Page Layout
export const PageLayout = ({ children }) => (
  <div className="min-h-screen bg-[#1C1C1E]">
    {children}
  </div>
);
```

---

## ⚠️ Common Mistakes & Fixes

### Mistake #1: Using Generic Tailwind Colors

```jsx
// ❌ WRONG
<div className="bg-gray-800 text-gray-400">

// ✅ CORRECT
<div className="bg-[#2C2C2E] text-[#98989D]">
```

### Mistake #2: Missing Transitions

```jsx
// ❌ WRONG
<button className="bg-[#0A84FF] hover:bg-[#0970DD]">

// ✅ CORRECT
<button className="bg-[#0A84FF] hover:bg-[#0970DD] transition-colors duration-150">
```

### Mistake #3: Inconsistent Border Radius

```jsx
// ❌ WRONG - Mix of rounded values
<div className="rounded-lg">    {/* 8px */}
<div className="rounded-xl">    {/* 12px */}
<div className="rounded-2xl">   {/* 16px */}

// ✅ CORRECT - Consistent usage
<div className="rounded-xl">    {/* Cards: 12px */}
<button className="rounded-lg"> {/* Buttons: 8px */}
<input className="rounded-lg">  {/* Inputs: 8px */}
```

### Mistake #4: Missing Focus States

```jsx
// ❌ WRONG
<button className="bg-[#0A84FF] hover:bg-[#0970DD]">

// ✅ CORRECT
<button className="
  bg-[#0A84FF] hover:bg-[#0970DD]
  focus:outline-none focus:ring-2 focus:ring-[#0A84FF]
">
```

---

## 🔍 Code Review Checklist

Before committing React components:

- [ ] ✅ All colors use Apple HIG hex codes (`bg-[#2C2C2E]`)
- [ ] ✅ Transitions added (`transition-colors duration-150`)
- [ ] ✅ Focus states implemented for accessibility
- [ ] ✅ Border radius consistent (`rounded-xl` for cards, `rounded-lg` for buttons)
- [ ] ✅ Text hierarchy clear (white headings, `#98989D` secondary)
- [ ] ✅ Responsive classes added (`sm:`, `md:`, `lg:`)
- [ ] ✅ PropTypes or TypeScript types defined
- [ ] ✅ Accessibility attributes (aria-labels) added
- [ ] ✅ Component is reusable and composable
- [ ] ✅ Loading and error states handled

---

## 📚 File Structure Recommendation

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── Button.js
│   │   ├── Card.js
│   │   ├── Input.js
│   │   ├── Modal.js
│   │   ├── Badge.js
│   │   ├── Alert.js
│   │   └── index.js
│   ├── layout/                # Layout components
│   │   ├── Header.js
│   │   ├── Sidebar.js
│   │   ├── Container.js
│   │   └── index.js
│   └── features/              # Feature-specific components
│       ├── projects/
│       ├── workflow/
│       └── ...
├── styles/
│   └── tailwind.css
├── utils/
│   └── constants.js           # Color constants, etc.
└── App.js
```

---

## 🎯 Example: Complete React Page

```jsx
import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { 
  Container, 
  Card, 
  PrimaryButton, 
  TextInput,
  StatCard,
  Badge 
} from './components/ui';

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      {/* Header */}
      <header className="bg-[#2C2C2E] border-b border-[#38383A]">
        <Container>
          <div className="py-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Construction Dashboard
              </h1>
              <p className="text-sm text-[#98989D]">
                Manage your construction projects
              </p>
            </div>
            <PrimaryButton>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </PrimaryButton>
          </div>
        </Container>
      </header>

      {/* Main Content */}
      <main className="py-6">
        <Container>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
            <StatCard
              title="Total Projects"
              value="24"
              change="+12%"
              trend="up"
              description="Last 30 days"
            />
            <StatCard
              title="Active"
              value="15"
              change="+8%"
              trend="up"
              description="Currently running"
            />
            <StatCard
              title="Completed"
              value="9"
              change="-3%"
              trend="down"
              description="This month"
            />
            <StatCard
              title="Budget Used"
              value="Rp 2.4M"
              change="+15%"
              trend="up"
              description="Of total budget"
            />
          </div>

          {/* Search & Filters */}
          <div className="mb-6">
            <TextInput
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Projects List */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} hover>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      Office Building Construction
                    </h3>
                    <p className="text-sm text-[#98989D] mb-3">
                      Jakarta Pusat, DKI Jakarta
                    </p>
                    <Badge status="success">Active</Badge>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white mb-1">
                      65%
                    </div>
                    <div className="text-xs text-[#636366]">
                      Progress
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Container>
      </main>
    </div>
  );
};

export default DashboardPage;
```

---

## 📖 Additional Resources

### Tailwind CSS Documentation
- Official Docs: https://tailwindcss.com/docs
- Customization: https://tailwindcss.com/docs/configuration

### React Best Practices
- Component Composition
- Custom Hooks for Logic Separation
- PropTypes or TypeScript for Type Safety

### Lucide React Icons
- Icons Library: https://lucide.dev/
- React Package: `npm install lucide-react`

---

**Document Version**: 1.0 (React Edition)  
**Last Updated**: October 8, 2025  
**Design System**: Apple HIG Inspired  
**Tech Stack**: React 18 + Tailwind CSS 3.x  
**Project**: Nusantara Construction Management System

---

## 🎓 Summary

Style guide ini dirancang khusus untuk aplikasi React dengan Tailwind CSS. Poin penting:

1. **Selalu gunakan hex codes** (`bg-[#2C2C2E]`) bukan generic Tailwind classes
2. **Component-based architecture** - Buat reusable UI components
3. **Consistent patterns** - Spacing, colors, typography, animations
4. **Accessibility first** - Focus states, ARIA labels, keyboard navigation
5. **Responsive design** - Mobile-first approach dengan breakpoints
6. **Performance** - Optimal bundle size, lazy loading, memoization

Dengan mengikuti guide ini, aplikasi akan memiliki design system yang konsisten, maintainable, dan scalable! 🚀
