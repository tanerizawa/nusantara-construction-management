import { 
  Info, 
  DollarSign, 
  FileText, 
  Settings, 
  BarChart3,
  Calculator,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  CheckSquare,
  FileCheck,
  FolderOpen,
  Target,
  Users
} from 'lucide-react';

/**
 * Hierarchical navigation configuration for workflow tabs
 * Main tabs with optional children (sub-tabs)
 */
export const workflowTabsConfig = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Info,
    path: 'overview',
    description: 'Ringkasan proyek',
    hasChildren: false
  },
  {
    id: 'finance',
    label: 'Financial',
    icon: Calculator,
    description: 'Manajemen keuangan',
    hasChildren: true,
    children: [
      {
        id: 'rab-workflow',
        label: 'RAB',
        path: 'rab-workflow',
        icon: Calculator,
        description: 'Rencana Anggaran Biaya'
      },
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        path: 'purchase-orders',
        icon: ShoppingCart,
        description: 'Purchase Order Management'
      },
      {
        id: 'budget-monitoring',
        label: 'Budget',
        path: 'budget-monitoring',
        icon: TrendingUp,
        description: 'Budget Monitoring'
      },
      {
        id: 'progress-payments',
        label: 'Payments',
        path: 'progress-payments',
        icon: CreditCard,
        description: 'Progress Payments'
      }
    ]
  },
  {
    id: 'documents',
    label: 'Dokumen',
    icon: FileText,
    description: 'Dokumen proyek',
    hasChildren: true,
    children: [
      {
        id: 'approval-status',
        label: 'Approvals',
        path: 'approval-status',
        icon: CheckSquare,
        description: 'Status Persetujuan'
      },
      {
        id: 'berita-acara',
        label: 'Berita Acara',
        path: 'berita-acara',
        icon: FileCheck,
        description: 'Berita Acara'
      },
      {
        id: 'documents',
        label: 'Files',
        path: 'documents',
        icon: FolderOpen,
        description: 'Project Documents'
      }
    ]
  },
  {
    id: 'operations',
    label: 'Tugas',
    icon: Settings,
    description: 'Operasional proyek',
    hasChildren: true,
    children: [
      {
        id: 'milestones',
        label: 'Milestones',
        path: 'milestones',
        icon: Target,
        description: 'Project Milestones'
      },
      {
        id: 'team',
        label: 'Team',
        path: 'team',
        icon: Users,
        description: 'Team Members'
      }
    ]
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: 'reports',
    description: 'Laporan dan analisis',
    hasChildren: false
  }
];

/**
 * Helper: Get all available paths
 */
export const getAllPaths = () => {
  const paths = [];
  workflowTabsConfig.forEach(tab => {
    if (tab.hasChildren) {
      tab.children.forEach(child => paths.push(child.path));
    } else {
      paths.push(tab.path);
    }
  });
  return paths;
};

/**
 * Helper: Find tab by path
 */
export const findTabByPath = (path) => {
  for (const tab of workflowTabsConfig) {
    if (tab.path === path) {
      return { mainTab: tab, subTab: null };
    }
    if (tab.hasChildren) {
      const child = tab.children.find(c => c.path === path);
      if (child) {
        return { mainTab: tab, subTab: child };
      }
    }
  }
  return { mainTab: null, subTab: null };
};

/**
 * Helper: Get parent tab for a path
 */
export const getParentTab = (path) => {
  for (const tab of workflowTabsConfig) {
    if (tab.hasChildren) {
      const hasChild = tab.children.some(c => c.path === path);
      if (hasChild) return tab;
    }
  }
  return null;
};

/**
 * Helper: Check if path is active
 */
export const isPathActive = (currentPath, checkPath) => {
  return currentPath === checkPath;
};

/**
 * Helper: Check if main tab has active child
 */
export const hasActiveChild = (tab, currentPath) => {
  if (!tab.hasChildren) return false;
  return tab.children.some(child => child.path === currentPath);
};

export default workflowTabsConfig;
