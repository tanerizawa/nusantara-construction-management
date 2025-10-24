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
  Users,
  Clipboard,
  ClipboardCheck
} from 'lucide-react';

/**
 * Hierarchical navigation configuration for workflow tabs
 * Main tabs with optional children (sub-tabs)
 */
export const workflowTabsConfig = [
  {
    id: 'overview',
    label: 'Ringkasan',
    icon: Info,
    path: 'overview',
    description: 'Ringkasan proyek',
    hasChildren: false
  },
  {
    id: 'budget',
    label: 'Anggaran (RAP/PO/WO)',
    icon: Calculator,
    description: 'Manajemen anggaran dan pembelian',
    hasChildren: true,
    children: [
      {
        id: 'rab-workflow',
        label: 'RAP',
        path: 'rab-workflow',
        icon: Calculator,
        description: 'Rencana Anggaran Biaya'
      },
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        path: 'purchase-orders',
        icon: ShoppingCart,
        description: 'Manajemen Purchase Order'
      },
      {
        id: 'work-orders',
        label: 'Work Orders',
        path: 'work-orders',
        icon: Clipboard,
        description: 'Manajemen Work Order (Jasa & Tenaga Kerja)'
      }
    ]
  },
  {
    id: 'milestones',
    label: 'Progres',
    icon: Target,
    path: 'milestones',
    description: 'Target dan pencapaian proyek',
    hasChildren: false
  },
  {
    id: 'ba-payments',
    label: 'BA & Pembayaran',
    icon: Clipboard,
    description: 'Berita Acara dan Progress Payment',
    hasChildren: true,
    children: [
      {
        id: 'berita-acara',
        label: 'Berita Acara',
        path: 'berita-acara',
        icon: FileCheck,
        description: 'Berita Acara Pekerjaan'
      },
      {
        id: 'progress-payments',
        label: 'Progress Payment',
        path: 'progress-payments',
        icon: CreditCard,
        description: 'Pembayaran Progres'
      }
    ]
  },
  {
    id: 'approval-status',
    label: 'Approval',
    icon: ClipboardCheck,
    path: 'approval-status',
    description: 'Status & aksi approval',
    hasChildren: false
  },
  {
    id: 'documents',
    label: 'Dokumen',
    icon: FolderOpen,
    path: 'documents',
    description: 'Dokumen dan file proyek',
    hasChildren: false
  },
  {
    id: 'operations',
    label: 'Tim',
    icon: Users,
    path: 'team',
    description: 'Tim dan personel proyek',
    hasChildren: false
  },
  {
    id: 'analytics',
    label: 'Laporan',
    icon: BarChart3,
    description: 'Laporan dan analisis proyek',
    hasChildren: true,
    children: [
      {
        id: 'budget-monitoring',
        label: 'Monitoring Anggaran',
        path: 'budget-monitoring',
        icon: TrendingUp,
        description: 'Monitoring Anggaran Proyek'
      },
      {
        id: 'reports',
        label: 'Laporan',
        path: 'reports',
        icon: BarChart3,
        description: 'Laporan & Analisis'
      }
    ]
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
