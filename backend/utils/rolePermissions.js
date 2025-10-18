// Role Permissions Configuration - Backend
// Note: Icons are referenced as strings, not imported from lucide-react (frontend only)

const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    label: 'Super Admin',
    color: '#FF453A',
    icon: 'ShieldCheck',
    description: 'Full system access',
    permissions: ['*'], // All permissions
    canManageUsers: true,
    canManageRoles: true
  },
  ADMIN: {
    id: 'admin',
    label: 'Administrator',
    color: '#FF9F0A',
    icon: 'Shield',
    description: 'Administrative access',
    permissions: [
      'users.view', 'users.create', 'users.edit',
      'projects.*', 'finance.*', 'inventory.*', 'reports.*'
    ],
    canManageUsers: true,
    canManageRoles: false
  },
  PROJECT_MANAGER: {
    id: 'project_manager',
    label: 'Project Manager',
    color: '#0A84FF',
    icon: 'Briefcase',
    description: 'Manage projects and teams',
    permissions: [
      'projects.*', 'teams.*', 'milestones.*',
      'rab.view', 'rab.edit', 'berita_acara.*',
      'reports.projects'
    ],
    canManageUsers: false
  },
  FINANCE_MANAGER: {
    id: 'finance_manager',
    label: 'Finance Manager',
    color: '#30D158',
    icon: 'DollarSign',
    description: 'Manage financial operations',
    permissions: [
      'finance.*', 'budgets.*', 'invoices.*',
      'payments.*', 'reports.finance'
    ],
    canManageUsers: false
  },
  INVENTORY_MANAGER: {
    id: 'inventory_manager',
    label: 'Inventory Manager',
    color: '#5E5CE6',
    icon: 'Package',
    description: 'Manage inventory and assets',
    permissions: [
      'inventory.*', 'assets.*', 'purchase_orders.*',
      'suppliers.*', 'reports.inventory'
    ],
    canManageUsers: false
  },
  HR_MANAGER: {
    id: 'hr_manager',
    label: 'HR Manager',
    color: '#BF5AF2',
    icon: 'Users',
    description: 'Manage human resources',
    permissions: [
      'users.view', 'teams.*', 'attendance.*',
      'payroll.*', 'employees.*', 'reports.hr'
    ],
    canManageUsers: true,
    canManageRoles: false
  },
  SUPERVISOR: {
    id: 'supervisor',
    label: 'Supervisor',
    color: '#64D2FF',
    icon: 'Eye',
    description: 'Monitor and supervise',
    permissions: [
      'projects.view', 'teams.view', 'reports.view',
      'milestones.view', 'budgets.view'
    ],
    canManageUsers: false
  },
  STAFF: {
    id: 'staff',
    label: 'Staff',
    color: '#98989D',
    icon: 'User',
    description: 'Basic access',
    permissions: [
      'projects.view', 'profile.edit', 'tasks.own'
    ],
    canManageUsers: false
  }
};

const PERMISSION_CATEGORIES = {
  USERS: {
    label: 'User Management',
    icon: 'Users',
    permissions: [
      { id: 'users.view', label: 'View Users', description: 'View user list and details' },
      { id: 'users.create', label: 'Create Users', description: 'Add new users to system' },
      { id: 'users.edit', label: 'Edit Users', description: 'Modify user information' },
      { id: 'users.delete', label: 'Delete Users', description: 'Remove users from system' },
      { id: 'users.manage_roles', label: 'Manage Roles', description: 'Assign and modify user roles' }
    ]
  },
  PROJECTS: {
    label: 'Project Management',
    icon: 'Briefcase',
    permissions: [
      { id: 'projects.view', label: 'View Projects', description: 'View project list and details' },
      { id: 'projects.create', label: 'Create Projects', description: 'Create new projects' },
      { id: 'projects.edit', label: 'Edit Projects', description: 'Modify project information' },
      { id: 'projects.delete', label: 'Delete Projects', description: 'Remove projects' },
      { id: 'projects.assign_team', label: 'Assign Team', description: 'Assign team members to projects' }
    ]
  },
  FINANCE: {
    label: 'Finance & Accounting',
    icon: 'DollarSign',
    permissions: [
      { id: 'finance.view', label: 'View Finance', description: 'View financial data' },
      { id: 'finance.create_transaction', label: 'Create Transaction', description: 'Create financial transactions' },
      { id: 'finance.approve_transaction', label: 'Approve Transaction', description: 'Approve financial transactions' },
      { id: 'finance.reports', label: 'Financial Reports', description: 'Access financial reports' },
      { id: 'budgets.manage', label: 'Manage Budgets', description: 'Create and modify budgets' }
    ]
  },
  INVENTORY: {
    label: 'Inventory & Assets',
    icon: 'Package',
    permissions: [
      { id: 'inventory.view', label: 'View Inventory', description: 'View inventory items' },
      { id: 'inventory.add', label: 'Add Inventory', description: 'Add new inventory items' },
      { id: 'inventory.transfer', label: 'Transfer Inventory', description: 'Transfer items between locations' },
      { id: 'assets.manage', label: 'Manage Assets', description: 'Manage company assets' }
    ]
  },
  TEAMS: {
    label: 'Team Management',
    icon: 'Users',
    permissions: [
      { id: 'teams.view', label: 'View Teams', description: 'View team information' },
      { id: 'teams.create', label: 'Create Teams', description: 'Create new teams' },
      { id: 'teams.edit', label: 'Edit Teams', description: 'Modify team information' },
      { id: 'teams.assign', label: 'Assign Members', description: 'Assign members to teams' }
    ]
  },
  REPORTS: {
    label: 'Reports & Analytics',
    icon: 'BarChart3',
    permissions: [
      { id: 'reports.view', label: 'View Reports', description: 'View all reports' },
      { id: 'reports.export', label: 'Export Reports', description: 'Export reports to file' },
      { id: 'reports.finance', label: 'Financial Reports', description: 'Access financial reports' },
      { id: 'reports.projects', label: 'Project Reports', description: 'Access project reports' }
    ]
  }
};

// Helper function to check permission
const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || userPermissions.length === 0) return false;
  
  // Check for wildcard (*)
  if (userPermissions.includes('*')) return true;
  
  // Check exact match
  if (userPermissions.includes(requiredPermission)) return true;
  
  // Check wildcard pattern (e.g., 'projects.*' matches 'projects.view')
  const parts = requiredPermission.split('.');
  if (parts.length > 1) {
    const wildcardPerm = `${parts[0]}.*`;
    if (userPermissions.includes(wildcardPerm)) return true;
  }
  
  return false;
};

// Helper function to get role object by ID
const getRoleById = (roleId) => {
  return Object.values(ROLES).find(role => role.id === roleId);
};

// Helper function to get all permissions for a role
const getRolePermissions = (roleId) => {
  const role = getRoleById(roleId);
  return role ? role.permissions : [];
};

module.exports = {
  ROLES,
  PERMISSION_CATEGORIES,
  hasPermission,
  getRoleById,
  getRolePermissions
};
