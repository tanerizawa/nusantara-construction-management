import {
  CheckCircle,
  DollarSign,
  FileText,
  ShoppingCart,
  Calendar,
  BarChart3,
  Users,
  Home,
  CreditCard,
  ClipboardCheck
} from 'lucide-react';

/**
 * Configuration untuk workflow tabs
 */
export const workflowTabs = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Home,
    description: 'Project Overview & Summary'
  },
  {
    id: 'approval-status',
    label: 'Approval Status',
    icon: CheckCircle,
    description: 'Document Approvals'
  },
  {
    id: 'rab-workflow',
    label: 'RAB Management',
    icon: DollarSign,
    description: 'Rencana Anggaran Biaya'
  },
  {
    id: 'create-purchase-order',
    label: 'Buat PO',
    icon: ShoppingCart,
    description: 'Create New Purchase Order',
    badge: 'create'
  },
  {
    id: 'purchase-orders-history',
    label: 'Riwayat PO',
    icon: FileText,
    description: 'Purchase Order History',
    showBadge: true
  },
  {
    id: 'budget-monitoring',
    label: 'Budget Monitoring',
    icon: BarChart3,
    description: 'Financial Tracking'
  },
  {
    id: 'milestones',
    label: 'Milestones',
    icon: Calendar,
    description: 'Project Timeline & Deliverables'
  },
  {
    id: 'berita-acara',
    label: 'Berita Acara',
    icon: ClipboardCheck,
    description: 'Handover Documentation & Approval'
  },
  {
    id: 'progress-payments',
    label: 'Progress Payments',
    icon: CreditCard,
    description: 'Payment Management Based on BA'
  },
  {
    id: 'team',
    label: 'Team Management',
    icon: Users,
    description: 'Human Resources'
  },
  {
    id: 'documents',
    label: 'Documents',
    icon: FileText,
    description: 'Project Documents'
  }
];
