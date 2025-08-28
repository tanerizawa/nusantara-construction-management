# Component Library Documentation

## 📚 Overview

Dokumentasi lengkap untuk semua komponen UI yang digunakan dalam sistem YK Construction, mengikuti prinsip Apple Human Interface Guidelines (HIG).

## 🏗️ Layout Components

### Header Component

**Purpose**: Navigation bar utama dengan branding dan user actions

**Props**:
```typescript
interface HeaderProps {
  onMenuClick: () => void;
  user?: User;
  onLogout?: () => void;
}
```

**Usage**:
```jsx
<Header 
  onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
  user={currentUser}
  onLogout={handleLogout}
/>
```

**States**:
- Default: Translucent background dengan blur effect
- Mobile: Collapsed dengan hamburger menu
- Hover: Subtle highlight pada interactive elements

**Accessibility**:
- ARIA labels untuk semua buttons
- Keyboard navigation support
- Screen reader friendly

---

### Sidebar Component

**Purpose**: Primary navigation dengan menu structure

**Props**:
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath?: string;
}
```

**Usage**:
```jsx
<Sidebar 
  isOpen={sidebarOpen} 
  onClose={() => setSidebarOpen(false)}
  currentPath={location.pathname}
/>
```

**Features**:
- Active state indication
- Collapsible menu groups
- Role-based menu visibility
- Responsive behavior

**Design Tokens**:
- Width: `--sidebar-width: 256px`
- Background: `--color-white` with `--shadow-lg`
- Active state: `--color-primary-50` background

---

### Breadcrumbs Component

**Purpose**: Navigation hierarchy indicator

**Props**:
```typescript
interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  maxItems?: number;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}
```

**Usage**:
```jsx
<Breadcrumbs 
  items={[
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Projects', href: '/projects' },
    { label: 'Project Detail', isActive: true }
  ]}
/>
```

**Behavior**:
- Auto-collapse pada mobile
- Separator dengan chevron icons
- Last item tidak clickable (current page)

## 📊 Data Display Components

### DataTable Component

**Purpose**: Structured data display dengan sorting dan pagination

**Props**:
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  error?: string;
  pagination?: PaginationConfig;
  onSort?: (field: string, direction: 'asc' | 'desc') => void;
  onRowClick?: (item: T) => void;
}
```

**Usage**:
```jsx
<DataTable
  data={projects}
  columns={projectColumns}
  loading={isLoading}
  pagination={{
    current: 1,
    pageSize: 10,
    total: 100
  }}
  onSort={handleSort}
  onRowClick={handleRowClick}
/>
```

**Features**:
- Responsive table layout
- Column sorting indicators
- Row hover states
- Loading skeleton
- Empty state handling
- Sticky header pada scroll

---

### DataCard Component

**Purpose**: Card layout untuk data items

**Props**:
```typescript
interface DataCardProps {
  title: string;
  subtitle?: string;
  status?: 'active' | 'inactive' | 'pending' | 'completed';
  actions?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```jsx
<DataCard
  title="Proyek KIIC Phase 1"
  subtitle="Industrial Construction"
  status="active"
  actions={<Button size="sm">View Details</Button>}
  onClick={() => navigate(`/projects/${project.id}`)}
>
  <div className="space-y-2">
    <p>Budget: Rp 15.5M</p>
    <p>Progress: 65%</p>
  </div>
</DataCard>
```

**States**:
- Default: Subtle border dan shadow
- Hover: Elevated shadow dan border highlight
- Active: Primary border color
- Disabled: Reduced opacity

---

### DataEmpty Component

**Purpose**: Empty state indicator dengan call-to-action

**Props**:
```typescript
interface DataEmptyProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

**Usage**:
```jsx
<DataEmpty
  title="Belum ada proyek"
  description="Mulai dengan membuat proyek konstruksi pertama Anda"
  icon={<PlusIcon />}
  action={{
    label: "Buat Proyek Baru",
    onClick: () => setShowCreateModal(true)
  }}
/>
```

**Design Guidelines**:
- Center-aligned content
- Subtle illustration atau icon
- Clear call-to-action
- Friendly, encouraging tone

---

### DataLoader Component

**Purpose**: Loading state indicator

**Props**:
```typescript
interface DataLoaderProps {
  type?: 'skeleton' | 'spinner' | 'pulse';
  rows?: number;
  className?: string;
}
```

**Usage**:
```jsx
<DataLoader type="skeleton" rows={5} />
```

**Types**:
- **Skeleton**: Content-aware loading placeholders
- **Spinner**: Simple rotating indicator
- **Pulse**: Subtle pulsing animation

## 🎛️ Form Components

### Input Component

**Purpose**: Text input dengan validation support

**Props**:
```typescript
interface InputProps {
  label: string;
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
}
```

**Usage**:
```jsx
<Input
  label="Nama Proyek"
  type="text"
  placeholder="Masukkan nama proyek"
  value={projectName}
  onChange={setProjectName}
  error={validation.projectName}
  required
  icon={<ProjectIcon />}
/>
```

**States**:
- Default: Border `--color-gray-300`
- Focus: Border `--color-primary-600` dengan focus ring
- Error: Border `--color-error` dengan error message
- Disabled: Background `--color-gray-100`

---

### Select Component

**Purpose**: Dropdown selection dengan search capability

**Props**:
```typescript
interface SelectProps<T> {
  label: string;
  options: Option<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  error?: string;
  disabled?: boolean;
}
```

**Usage**:
```jsx
<Select
  label="Status Proyek"
  options={statusOptions}
  value={selectedStatus}
  onChange={setSelectedStatus}
  placeholder="Pilih status"
  searchable
/>
```

**Features**:
- Keyboard navigation
- Search filtering
- Multi-select support
- Custom option rendering
- Portal rendering untuk dropdown

---

### Button Component

**Purpose**: Interactive action triggers

**Props**:
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}
```

**Usage**:
```jsx
<Button
  variant="primary"
  size="md"
  loading={isSubmitting}
  icon={<SaveIcon />}
  onClick={handleSave}
>
  Simpan Proyek
</Button>
```

**Variants**:
- **Primary**: Main action button
- **Secondary**: Secondary actions
- **Danger**: Destructive actions
- **Ghost**: Minimal style button

**States**:
- Default: Solid background
- Hover: Subtle elevation dan color shift
- Active: Pressed state
- Loading: Spinner dengan disabled state
- Disabled: Reduced opacity

## 💬 Feedback Components

### Toast Component

**Purpose**: Temporary feedback messages

**Props**:
```typescript
interface ToastProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
  onClose?: () => void;
}
```

**Usage**:
```jsx
// Using react-hot-toast
toast.success('Proyek berhasil disimpan');
toast.error('Gagal menyimpan data');
```

**Behavior**:
- Auto-dismiss after 4 seconds
- Swipe to dismiss on mobile
- Stack multiple toasts
- Pause on hover

---

### Modal Component

**Purpose**: Dialog untuk complex interactions

**Props**:
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnBackdrop?: boolean;
}
```

**Usage**:
```jsx
<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Buat Proyek Baru"
  size="lg"
  footer={
    <div className="flex gap-3">
      <Button variant="secondary" onClick={() => setShowModal(false)}>
        Batal
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Simpan
      </Button>
    </div>
  }
>
  <ProjectForm onSubmit={handleSubmit} />
</Modal>
```

**Features**:
- Focus trap
- Escape key to close
- Backdrop click to close
- Scrollable content
- Portal rendering

---

### Alert Component

**Purpose**: Important status messages

**Props**:
```typescript
interface AlertProps {
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}
```

**Usage**:
```jsx
<Alert
  type="warning"
  title="Stok Rendah"
  description="Beberapa item inventory memiliki stok di bawah batas minimum"
  dismissible
  onDismiss={handleDismiss}
/>
```

## 🎨 Component Composition

### PageActions Component

**Purpose**: Standardized page header dengan actions

**Props**:
```typescript
interface PageActionsProps {
  title: string;
  subtitle?: string;
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  searchProps?: SearchInputProps;
  filterProps?: FilterProps;
  viewToggle?: ViewToggleProps;
  densityToggle?: boolean;
}
```

**Usage**:
```jsx
<PageActions
  title="Daftar Proyek"
  subtitle="Kelola semua proyek konstruksi"
  primaryAction={{
    label: "Buat Proyek",
    icon: <PlusIcon />,
    onClick: () => setShowCreateModal(true)
  }}
  searchProps={{
    placeholder: "Cari proyek...",
    value: searchQuery,
    onChange: setSearchQuery
  }}
  filterProps={{
    options: filterOptions,
    value: activeFilters,
    onChange: setActiveFilters
  }}
  densityToggle
/>
```

## 🎯 Design Patterns

### Consistent Spacing

```css
/* Component spacing */
.component-spacing {
  padding: var(--space-6);
  gap: var(--space-4);
}

.component-spacing > * + * {
  margin-top: var(--space-4);
}
```

### Interactive States

```css
/* Standard interaction pattern */
.interactive-element {
  transition: all var(--duration-150) var(--ease-in-out);
}

.interactive-element:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.interactive-element:active {
  transform: translateY(0);
}
```

### Responsive Behavior

```css
/* Mobile-first responsive */
.responsive-component {
  padding: var(--space-4);
}

@media (min-width: 768px) {
  .responsive-component {
    padding: var(--space-6);
  }
}

@media (min-width: 1024px) {
  .responsive-component {
    padding: var(--space-8);
  }
}
```

## 🔧 Implementation Guidelines

### Component Structure

```jsx
// Standard component structure
const ComponentName = ({ 
  children, 
  className, 
  ...props 
}) => {
  const baseClasses = "component-base-classes";
  const classes = clsx(baseClasses, className);

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

ComponentName.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

ComponentName.defaultProps = {
  className: "",
};

export default ComponentName;
```

### Accessibility Requirements

1. **Semantic HTML**: Gunakan elemen HTML yang sesuai
2. **ARIA Labels**: Provide accessible names
3. **Keyboard Navigation**: Support tab order dan keyboard shortcuts
4. **Focus Management**: Manage focus states dengan jelas
5. **Screen Reader**: Compatible dengan assistive technology

### Testing Guidelines

```javascript
// Component testing template
describe('ComponentName', () => {
  test('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });

  test('handles user interactions', () => {
    const mockHandler = jest.fn();
    render(<ComponentName onClick={mockHandler} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockHandler).toHaveBeenCalled();
  });

  test('supports keyboard navigation', () => {
    render(<ComponentName />);
    
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    // Assert expected behavior
  });
});
```

## 📝 Maintenance

### Version Control

- Setiap component harus memiliki version number
- Breaking changes harus documented dengan migration guide
- Backward compatibility dipertahankan minimal 2 major versions

### Performance Optimization

- Lazy loading untuk large components
- Memoization untuk expensive computations
- Bundle size monitoring
- Tree shaking support

### Documentation Updates

- Update documentation setiap ada perubahan API
- Include visual examples dan code snippets
- Maintain changelog untuk tracking perubahan

---

**Version**: 1.0.0  
**Last Updated**: August 14, 2025  
**Maintained by**: Frontend Team
