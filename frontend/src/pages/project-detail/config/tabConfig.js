import { 
  Building, 
  Users, 
  FileText, 
  CheckCircle,
  Calendar, 
  DollarSign, 
  Calculator,
  ShoppingCart,
  BarChart3,
  PlayCircle,
  Activity
} from 'lucide-react';

/**
 * Tab configuration for project detail
 * Defines all available tabs with icons, descriptions, and badges
 */
export const createTabConfig = (workflowData) => [
  {
    id: 'overview',
    label: 'Ringkasan Proyek',
    icon: Building,
    description: 'Informasi umum dan status proyek'
  },
  {
    id: 'rab-workflow',
    label: 'RAB & BOQ',
    icon: Calculator,
    description: 'Rencana Anggaran Biaya dan Bill of Quantity',
    badge: workflowData.rabStatus?.pendingApproval || 0
  },
  {
    id: 'approval-status',
    label: 'Status Approval',
    icon: CheckCircle,
    description: 'Tracking dan manajemen approval workflow',
    badge: workflowData.approvalStatus?.pending || 0
  },
  {
    id: 'purchase-orders',
    label: 'Purchase Orders',
    icon: ShoppingCart,
    description: 'Manajemen Purchase Order dan procurement',
    badge: workflowData.purchaseOrders?.filter(po => po.status === 'pending').length || 0
  },
  {
    id: 'budget-monitoring',
    label: 'Budget Monitoring',
    icon: BarChart3,
    description: 'Real-time budget tracking dan cost control'
  },
  {
    id: 'team',
    label: 'Tim Proyek',
    icon: Users,
    description: 'Manajemen tim dan manpower'
  },
  {
    id: 'documents',
    label: 'Dokumen',
    icon: FileText,
    description: 'File dan dokumen proyek'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
    description: 'Generate laporan proyek'
  },
  {
    id: 'milestones',
    label: 'Milestone',
    icon: Calendar,
    description: 'Project milestones dan timeline',
    badge: workflowData.milestones?.pending || 0
  },
  {
    id: 'berita-acara',
    label: 'Berita Acara',
    icon: FileText,
    description: 'Manajemen Berita Acara dan handover',
    badge: workflowData.beritaAcara?.pending || 0
  },
  {
    id: 'progress-payments',
    label: 'Progress Payments',
    icon: DollarSign,
    description: 'Pembayaran bertahap berdasarkan BA',
    badge: workflowData.progressPayments?.pending || 0
  }
];

/**
 * Workflow stages configuration
 * Defines the sequential stages of project workflow
 */
export const workflowStages = [
  { 
    id: 'planning', 
    label: 'Perencanaan', 
    icon: PlayCircle,
    description: 'Setup awal proyek dan persiapan dokumen'
  },
  { 
    id: 'rab-approval', 
    label: 'Approval RAB', 
    icon: Calculator,
    description: 'Persetujuan Rencana Anggaran Biaya'
  },
  { 
    id: 'procurement', 
    label: 'Pengadaan', 
    icon: ShoppingCart,
    description: 'Proses pembelian dan pengadaan material'
  },
  { 
    id: 'execution', 
    label: 'Eksekusi', 
    icon: Activity,
    description: 'Pelaksanaan pekerjaan konstruksi'
  },
  { 
    id: 'completion', 
    label: 'Selesai', 
    icon: CheckCircle,
    description: 'Penyelesaian dan serah terima proyek'
  }
];
