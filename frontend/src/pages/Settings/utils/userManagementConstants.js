import { Shield, ShieldCheck, Briefcase, DollarSign, Package, Users, Eye, User, BarChart3 } from 'lucide-react';

export const ROLES = {
  SUPER_ADMIN: {
    id: 'super_admin',
    label: 'Super Admin',
    color: '#FF453A',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    icon: ShieldCheck,
    description: 'Full system access',
    permissions: ['*'],
    canManageUsers: true,
    canManageRoles: true
  },
  ADMIN: {
    id: 'admin',
    label: 'Administrator',
    color: '#FF9F0A',
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    icon: Shield,
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
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    icon: Briefcase,
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
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400',
    icon: DollarSign,
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
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
    icon: Package,
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
    bgColor: 'bg-pink-500/10',
    textColor: 'text-pink-400',
    icon: Users,
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
    bgColor: 'bg-cyan-500/10',
    textColor: 'text-cyan-400',
    icon: Eye,
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
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400',
    icon: User,
    description: 'Basic access',
    permissions: [
      'projects.view', 'profile.edit', 'tasks.own'
    ],
    canManageUsers: false
  }
};

export const PERMISSION_CATEGORIES = {
  USERS: {
    label: 'User Management',
    icon: Users,
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
    icon: Briefcase,
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
    icon: DollarSign,
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
    icon: Package,
    permissions: [
      { id: 'inventory.view', label: 'View Inventory', description: 'View inventory items' },
      { id: 'inventory.add', label: 'Add Inventory', description: 'Add new inventory items' },
      { id: 'inventory.transfer', label: 'Transfer Inventory', description: 'Transfer items between locations' },
      { id: 'assets.manage', label: 'Manage Assets', description: 'Manage company assets' }
    ]
  },
  TEAMS: {
    label: 'Team Management',
    icon: Users,
    permissions: [
      { id: 'teams.view', label: 'View Teams', description: 'View team information' },
      { id: 'teams.create', label: 'Create Teams', description: 'Create new teams' },
      { id: 'teams.edit', label: 'Edit Teams', description: 'Modify team information' },
      { id: 'teams.assign', label: 'Assign Members', description: 'Assign members to teams' }
    ]
  },
  REPORTS: {
    label: 'Reports & Analytics',
    icon: BarChart3,
    permissions: [
      { id: 'reports.view', label: 'View Reports', description: 'View all reports' },
      { id: 'reports.export', label: 'Export Reports', description: 'Export reports to file' },
      { id: 'reports.finance', label: 'Financial Reports', description: 'Access financial reports' },
      { id: 'reports.projects', label: 'Project Reports', description: 'Access project reports' }
    ]
  }
};

export const USER_STATUS = {
  ACTIVE: {
    id: 'active',
    label: 'Active',
    color: '#30D158',
    bgColor: 'bg-green-500/10',
    textColor: 'text-green-400'
  },
  INACTIVE: {
    id: 'inactive',
    label: 'Inactive',
    color: '#98989D',
    bgColor: 'bg-gray-500/10',
    textColor: 'text-gray-400'
  },
  LOCKED: {
    id: 'locked',
    label: 'Locked',
    color: '#FF453A',
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400'
  }
};

export const NOTIFICATION_CATEGORIES = {
  APPROVAL_REQUESTS: {
    id: 'approval_requests',
    label: 'Approval Requests',
    icon: '📋',
    description: 'Notifications for pending approvals'
  },
  PROJECT_UPDATES: {
    id: 'project_updates',
    label: 'Project Updates',
    icon: '📊',
    description: 'Updates about project progress and changes'
  },
  BUDGET_ALERTS: {
    id: 'budget_alerts',
    label: 'Budget Alerts',
    icon: '💰',
    description: 'Alerts about budget usage and limits'
  },
  TEAM_ASSIGNMENTS: {
    id: 'team_assignments',
    label: 'Team Assignments',
    icon: '👥',
    description: 'Notifications about team assignments'
  },
  SYSTEM_ANNOUNCEMENTS: {
    id: 'system_announcements',
    label: 'System Announcements',
    icon: '🔔',
    description: 'Important system announcements'
  },
  PAYMENT_REMINDERS: {
    id: 'payment_reminders',
    label: 'Payment Reminders',
    icon: '💸',
    description: 'Reminders for upcoming payments'
  }
};

// Helper functions
export const getRoleById = (roleId) => {
  return Object.values(ROLES).find(role => role.id === roleId);
};

export const getRoleColor = (roleId) => {
  const role = getRoleById(roleId);
  return role ? role.color : '#98989D';
};

export const getRoleBadgeClasses = (roleId) => {
  const role = getRoleById(roleId);
  return role ? `${role.bgColor} ${role.textColor}` : 'bg-gray-500/10 text-gray-400';
};

export const getUserStatusBadgeClasses = (isActive, isLocked) => {
  if (isLocked) return `${USER_STATUS.LOCKED.bgColor} ${USER_STATUS.LOCKED.textColor}`;
  if (isActive) return `${USER_STATUS.ACTIVE.bgColor} ${USER_STATUS.ACTIVE.textColor}`;
  return `${USER_STATUS.INACTIVE.bgColor} ${USER_STATUS.INACTIVE.textColor}`;
};

export const getUserStatusLabel = (isActive, isLocked) => {
  if (isLocked) return USER_STATUS.LOCKED.label;
  if (isActive) return USER_STATUS.ACTIVE.label;
  return USER_STATUS.INACTIVE.label;
};
