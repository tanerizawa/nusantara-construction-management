# Accessibility Guidelines

## ♿ Overview

Panduan aksesibilitas untuk memastikan aplikasi YK Construction dapat digunakan oleh semua pengguna, termasuk pengguna dengan disabilitas. Mengikuti standar WCAG 2.1 Level AA dan Apple Human Interface Guidelines.

## 🎯 Accessibility Principles

### 1. Perceivable
Informasi dan komponen UI harus dapat dipersepsi oleh pengguna

### 2. Operable
Komponen UI dan navigasi harus dapat dioperasikan

### 3. Understandable
Informasi dan operasi UI harus dapat dipahami

### 4. Robust
Konten harus cukup kuat untuk dapat diinterpretasi oleh berbagai user agent

## 🎨 Visual Accessibility

### Color & Contrast

**Requirements**:
- Normal text: Minimum contrast ratio 4.5:1
- Large text (18px+ atau bold 14px+): Minimum contrast ratio 3:1
- UI components: Minimum contrast ratio 3:1
- Non-text elements: Minimum contrast ratio 3:1

**Color Palette Compliance**:
```css
/* High contrast combinations */
.text-on-white {
  color: var(--color-gray-900); /* 21:1 ratio */
}

.text-on-primary {
  color: white; /* 4.5:1 ratio */
}

.text-secondary {
  color: var(--color-gray-600); /* 7:1 ratio */
}

.error-text {
  color: var(--color-error); /* 5.5:1 ratio */
}
```

**Color-blind Friendly**:
- Jangan hanya mengandalkan warna untuk menyampaikan informasi
- Gunakan kombinasi warna, icon, dan text
- Test dengan simulasi color blindness

### Typography

**Font Requirements**:
```css
/* Minimum readable sizes */
.text-body {
  font-size: 16px; /* Minimum untuk body text */
  line-height: 1.5; /* Minimum line height */
}

.text-small {
  font-size: 14px; /* Minimum untuk secondary text */
  line-height: 1.4;
}

/* Font weight for clarity */
.text-normal {
  font-weight: 400; /* Minimum weight */
}

.text-medium {
  font-weight: 500; /* For emphasis */
}
```

**Line Height & Spacing**:
- Line height: Minimum 1.5x font size
- Paragraph spacing: Minimum 2x font size
- Letter spacing: 0.12x font size untuk small text

### Focus Indicators

**Visible Focus States**:
```css
/* Standard focus ring */
.focus-visible {
  outline: 2px solid var(--color-primary-600);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}

/* High contrast focus for better visibility */
.focus-high-contrast {
  outline: 3px solid var(--color-primary-600);
  outline-offset: 2px;
  box-shadow: 0 0 0 1px white;
}

/* Custom focus for interactive elements */
.btn:focus-visible {
  box-shadow: 
    0 0 0 2px white,
    0 0 0 4px var(--color-primary-600);
}
```

## ⌨️ Keyboard Navigation

### Tab Order

**Navigation Flow**:
1. Skip links (jika ada)
2. Main navigation
3. Page content (logical reading order)
4. Secondary navigation
5. Footer

**Implementation**:
```jsx
// Skip to main content
<a 
  href="#main-content" 
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50"
>
  Skip to main content
</a>

// Main content area
<main id="main-content" tabIndex="-1">
  {/* Page content */}
</main>
```

### Keyboard Shortcuts

**Global Shortcuts**:
- `Alt + M`: Focus main navigation
- `Alt + S`: Focus search
- `Alt + H`: Go to homepage
- `Escape`: Close modals/dropdowns

**Component-specific**:
```jsx
// Table navigation
const handleKeyDown = (e) => {
  switch (e.key) {
    case 'ArrowDown':
      // Move to next row
      break;
    case 'ArrowUp':
      // Move to previous row
      break;
    case 'Enter':
    case ' ':
      // Activate/select row
      break;
    case 'Home':
      // Go to first row
      break;
    case 'End':
      // Go to last row
      break;
  }
};
```

### Focus Management

**Modal Focus Trap**:
```jsx
const FocusTrap = ({ children, isActive }) => {
  const trapRef = useRef();

  useEffect(() => {
    if (!isActive) return;

    const focusableElements = trapRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };

    firstElement?.focus();
    document.addEventListener('keydown', handleTabKey);

    return () => {
      document.removeEventListener('keydown', handleTabKey);
    };
  }, [isActive]);

  return <div ref={trapRef}>{children}</div>;
};
```

## 🔊 Screen Reader Support

### ARIA Labels & Roles

**Form Labels**:
```jsx
// Explicit labels
<label htmlFor="project-name">Nama Proyek</label>
<input id="project-name" type="text" />

// ARIA labels for complex forms
<input 
  type="text" 
  aria-label="Masukkan nama proyek konstruksi"
  aria-describedby="project-help"
/>
<div id="project-help">
  Nama proyek akan digunakan dalam laporan dan dokumen
</div>
```

**Interactive Elements**:
```jsx
// Buttons with clear purposes
<button aria-label="Hapus proyek KIIC Phase 1">
  <TrashIcon />
</button>

// Toggle buttons
<button 
  aria-pressed={isActive}
  aria-label={isActive ? "Nonaktifkan notifikasi" : "Aktifkan notifikasi"}
>
  <BellIcon />
</button>

// Loading states
<button aria-describedby="loading-text" disabled>
  <Spinner />
  Menyimpan...
</button>
<div id="loading-text" className="sr-only">
  Sedang menyimpan data proyek
</div>
```

**Data Tables**:
```jsx
<table role="table" aria-label="Daftar proyek konstruksi">
  <thead>
    <tr>
      <th scope="col">Nama Proyek</th>
      <th scope="col">Status</th>
      <th scope="col">Budget</th>
      <th scope="col">Progress</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Proyek KIIC Phase 1</td>
      <td>
        <span aria-label="Status aktif">
          <ActiveIcon /> Aktif
        </span>
      </td>
      <td>Rp 15.500.000.000</td>
      <td>
        <div aria-label="Progress 65 persen">
          <ProgressBar value={65} />
        </div>
      </td>
    </tr>
  </tbody>
</table>
```

### Live Regions

**Status Updates**:
```jsx
// Success messages
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {successMessage}
</div>

// Error messages (urgent)
<div aria-live="assertive" aria-atomic="true" className="sr-only">
  {errorMessage}
</div>

// Loading states
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? "Memuat data..." : "Data berhasil dimuat"}
</div>
```

### Screen Reader Only Content

```css
/* Screen reader only utility class */
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
```

## 📱 Mobile Accessibility

### Touch Targets

**Minimum Sizes**:
```css
/* Minimum touch target size */
.touch-target {
  min-height: 44px; /* iOS minimum */
  min-width: 44px;
  padding: var(--space-3);
}

/* Spacing between touch targets */
.touch-targets > * + * {
  margin-left: var(--space-2); /* 8px minimum */
}
```

**Touch Gestures**:
- Swipe untuk navigate antar pages
- Pinch untuk zoom pada charts/images
- Long press untuk context menus
- Pull-to-refresh untuk data updates

### Voice Control

**Voice Navigation Support**:
```jsx
// Clear voice commands
<button aria-label="Simpan proyek baru">
  Simpan
</button>

// Avoid ambiguous labels
<button aria-label="Edit proyek KIIC Phase 1">
  Edit
</button>
```

## 🧪 Testing Guidelines

### Automated Testing

**ESLint Rules**:
```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/click-events-have-key-events': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/label-has-associated-control': 'error',
    'jsx-a11y/no-aria-hidden-on-focusable': 'error',
    'jsx-a11y/no-autofocus': 'error',
    'jsx-a11y/no-redundant-roles': 'error',
    'jsx-a11y/role-has-required-aria-props': 'error',
    'jsx-a11y/role-supports-aria-props': 'error'
  }
};
```

**Jest-Axe Testing**:
```javascript
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should not have accessibility violations', async () => {
  const { container } = render(<ProjectForm />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

**Keyboard Testing Checklist**:
- [ ] Tab through all interactive elements
- [ ] All focusable elements have visible focus indicators
- [ ] Tab order follows logical sequence
- [ ] Escape key closes modals/dropdowns
- [ ] Enter/Space activates buttons
- [ ] Arrow keys navigate lists/tables

**Screen Reader Testing**:
- [ ] All content is announced correctly
- [ ] Form fields have clear labels
- [ ] Error messages are announced
- [ ] Loading states are communicated
- [ ] Table headers are properly associated

**Color/Contrast Testing**:
- [ ] All text meets contrast requirements
- [ ] Information is not conveyed by color alone
- [ ] Test with color blindness simulators
- [ ] UI remains usable in high contrast mode

### Testing Tools

**Browser Extensions**:
- axe DevTools
- WAVE Web Accessibility Evaluator
- Colour Contrast Analyser
- HeadingsMap

**Screen Readers**:
- NVDA (Windows)
- JAWS (Windows)
- VoiceOver (macOS/iOS)
- TalkBack (Android)

## 📋 Accessibility Checklist

### Development Phase

**Code Review Checklist**:
- [ ] Semantic HTML elements used correctly
- [ ] All images have alt text
- [ ] Form labels are properly associated
- [ ] ARIA attributes used appropriately
- [ ] Color contrast meets requirements
- [ ] Focus indicators are visible
- [ ] Keyboard navigation works
- [ ] No accessibility lint errors

### Pre-deployment

**QA Testing Checklist**:
- [ ] Automated accessibility tests pass
- [ ] Manual keyboard testing completed
- [ ] Screen reader testing completed
- [ ] Mobile accessibility verified
- [ ] High contrast mode tested
- [ ] Performance with assistive technology acceptable

### Post-deployment

**Monitoring**:
- [ ] User feedback on accessibility
- [ ] Analytics on assistive technology usage
- [ ] Regular accessibility audits
- [ ] Training updates for team

## 🎓 Training & Resources

### Team Training

**Required Knowledge**:
- WCAG 2.1 Guidelines
- ARIA specifications
- Keyboard navigation patterns
- Screen reader usage
- Color contrast requirements

**Training Resources**:
- WebAIM accessibility courses
- A11y Project resources
- MDN Accessibility docs
- ARIA Authoring Practices Guide

### Documentation

**Accessibility Documentation**:
- Component accessibility requirements
- Testing procedures dan tools
- Common accessibility patterns
- Troubleshooting guide

---

**Compliance Level**: WCAG 2.1 Level AA  
**Last Updated**: August 14, 2025  
**Maintained by**: Accessibility Team
