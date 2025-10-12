import {
  Home,
  DollarSign,
  FileText,
  ShoppingCart,
  BarChart3,
  CheckCircle,
  ClipboardCheck,
  CreditCard,
  Calendar,
  Users,
  Briefcase
} from 'lucide-react';

/**
 * Navigation Configuration for Workflow Header
 * 
 * Struktur:
 * - 5 kategori utama (Overview, Finance, Documents, Operations, Analytics)
 * - Type: 'single' (direct page) atau 'dropdown' (sub-menu)
 * - Path: untuk routing (harus match dengan activeTab di ProjectDetail)
 */

export const navigationConfig = [
  // ========================================
  // 1. OVERVIEW - Single Page (Dashboard)
  // ========================================
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    type: 'single',
    path: 'overview',
    description: 'Project dashboard and summary',
    keywords: ['dashboard', 'summary', 'overview']
  },

  // ========================================
  // 2. FINANCE - Dropdown (4 items)
  // ========================================
  {
    id: 'finance',
    label: 'Finance',
    icon: DollarSign,
    type: 'dropdown',
    description: 'Financial management and tracking',
    items: [
      {
        id: 'rab-workflow',
        label: 'RAB Management',
        icon: DollarSign,
        path: 'rab-workflow',
        description: 'Rencana Anggaran Biaya - Budget planning',
        keywords: ['budget', 'anggaran', 'rab', 'planning']
      },
      {
        id: 'purchase-orders',
        label: 'Purchase Orders',
        icon: ShoppingCart,
        path: 'purchase-orders',
        description: 'Create and track procurement orders',
        badge: true, // Will show notification badge if there are pending POs
        keywords: ['po', 'procurement', 'purchasing', 'order']
      },
      {
        id: 'budget-monitoring',
        label: 'Budget Monitoring',
        icon: BarChart3,
        path: 'budget-monitoring',
        description: 'Track spending vs allocated budget',
        keywords: ['monitoring', 'tracking', 'spending', 'budget']
      },
      {
        id: 'progress-payments',
        label: 'Progress Payments',
        icon: CreditCard,
        path: 'progress-payments',
        description: 'Manage milestone-based payment progress',
        keywords: ['payment', 'termin', 'invoice', 'progress']
      }
    ]
  },

  // ========================================
  // 3. DOCUMENTS - Dropdown (3 items)
  // ========================================
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    type: 'dropdown',
    description: 'Document management and approvals',
    items: [
      {
        id: 'approval-status',
        label: 'Approval Status',
        icon: CheckCircle,
        path: 'approval-status',
        description: 'Track document approvals and workflows',
        keywords: ['approval', 'persetujuan', 'workflow', 'status']
      },
      {
        id: 'berita-acara',
        label: 'Berita Acara',
        icon: ClipboardCheck,
        path: 'berita-acara',
        description: 'Handover documentation and sign-off',
        keywords: ['ba', 'handover', 'serah terima', 'dokumentasi']
      },
      {
        id: 'documents',
        label: 'Project Documents',
        icon: FileText,
        path: 'documents',
        description: 'All project files and attachments',
        keywords: ['files', 'dokumen', 'attachments', 'upload']
      }
    ]
  },

  // ========================================
  // 4. OPERATIONS - Dropdown (2 items)
  // ========================================
  {
    id: 'operations',
    label: 'Operations',
    icon: Briefcase,
    type: 'dropdown',
    description: 'Project execution and resource management',
    items: [
      {
        id: 'milestones',
        label: 'Milestones',
        icon: Calendar,
        path: 'milestones',
        description: 'Project timeline and deliverables',
        keywords: ['milestone', 'timeline', 'deliverable', 'schedule']
      },
      {
        id: 'team',
        label: 'Team Management',
        icon: Users,
        path: 'team',
        description: 'Assign and manage project team members',
        keywords: ['team', 'members', 'resources', 'assignment']
      }
    ]
  },

  // ========================================
  // 5. ANALYTICS - Dropdown (1+ items)
  // ========================================
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    type: 'dropdown',
    description: 'Reports and business intelligence',
    items: [
      {
        id: 'reports',
        label: 'Reports',
        icon: FileText,
        path: 'reports',
        description: 'Generate project reports and exports',
        keywords: ['report', 'export', 'pdf', 'analytics']
      }
      // Future items:
      // {
      //   id: 'performance',
      //   label: 'Performance Dashboard',
      //   icon: TrendingUp,
      //   path: 'performance',
      //   description: 'View project performance metrics',
      //   keywords: ['performance', 'metrics', 'kpi']
      // },
      // {
      //   id: 'kpis',
      //   label: 'KPI Tracking',
      //   icon: Target,
      //   path: 'kpis',
      //   description: 'Track key performance indicators',
      //   keywords: ['kpi', 'metrics', 'goals']
      // }
    ]
  }
];

// ========================================
// Helper Functions
// ========================================

/**
 * Get all available paths from navigation config
 * @returns {string[]} Array of all paths
 */
export const getAllPaths = () => {
  const paths = [];
  
  navigationConfig.forEach(item => {
    if (item.type === 'single') {
      paths.push(item.path);
    } else if (item.type === 'dropdown' && item.items) {
      item.items.forEach(subItem => {
        if (subItem.path) {
          paths.push(subItem.path);
        }
      });
    }
  });
  
  return paths;
};

/**
 * Find navigation item by path
 * @param {string} path - The path to search for
 * @returns {object|null} Object with parent and item, or null if not found
 */
export const findItemByPath = (path) => {
  for (const item of navigationConfig) {
    // Check if single item matches
    if (item.type === 'single' && item.path === path) {
      return { parent: null, item };
    }
    
    // Check if any sub-item in dropdown matches
    if (item.type === 'dropdown' && item.items) {
      const subItem = item.items.find(sub => sub.path === path);
      if (subItem) {
        return { parent: item, item: subItem };
      }
    }
  }
  
  return null;
};

/**
 * Get parent category for a given path
 * @param {string} path - The path to get parent for
 * @returns {object|null} Parent item or null
 */
export const getParentCategory = (path) => {
  const result = findItemByPath(path);
  return result ? result.parent : null;
};

/**
 * Check if a category has an active child
 * @param {object} category - The category to check
 * @param {string} activePath - The currently active path
 * @returns {boolean} True if category has active child
 */
export const hasActiveChild = (category, activePath) => {
  if (category.type !== 'dropdown' || !category.items) {
    return false;
  }
  
  return category.items.some(item => item.path === activePath);
};

/**
 * Search navigation items by keyword
 * @param {string} query - Search query
 * @returns {object[]} Array of matching items with parent info
 */
export const searchNavigation = (query) => {
  const results = [];
  const lowerQuery = query.toLowerCase();
  
  navigationConfig.forEach(item => {
    // Search in single items
    if (item.type === 'single') {
      const matches = 
        item.label.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery) ||
        (item.keywords && item.keywords.some(k => k.includes(lowerQuery)));
      
      if (matches) {
        results.push({ parent: null, item });
      }
    }
    
    // Search in dropdown items
    if (item.type === 'dropdown' && item.items) {
      item.items.forEach(subItem => {
        const matches = 
          subItem.label.toLowerCase().includes(lowerQuery) ||
          subItem.description.toLowerCase().includes(lowerQuery) ||
          (subItem.keywords && subItem.keywords.some(k => k.includes(lowerQuery)));
        
        if (matches) {
          results.push({ parent: item, item: subItem });
        }
      });
    }
  });
  
  return results;
};

export default navigationConfig;
