import { 
  FileText, 
  Eye, 
  Clock, 
  CheckCircle, 
  XCircle 
} from 'lucide-react';

/**
 * Status Configuration
 * Defines approval workflow statuses and their properties
 */
export const statusConfig = {
  'draft': { 
    label: 'Draft', 
    color: 'bg-[#3A3A3C] text-[#98989D]', 
    icon: FileText,
    description: 'Dokumen belum submit',
    canReview: true,
    canApprove: false
  },
  'under_review': { 
    label: 'Diperiksa', 
    color: 'bg-[#0A84FF]/20 text-[#0A84FF]', 
    icon: Eye,
    description: 'Sedang dalam pemeriksaan',
    canReview: false,
    canApprove: true
  },
  'pending': { 
    label: 'Menunggu Approval', 
    color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]', 
    icon: Clock,
    description: 'Menunggu persetujuan',
    canReview: false,
    canApprove: true
  },
  'approved': { 
    label: 'Disetujui', 
    color: 'bg-[#30D158]/20 text-[#30D158]', 
    icon: CheckCircle,
    description: 'Telah disetujui',
    canReview: false,
    canApprove: false
  },
  'rejected': { 
    label: 'Ditolak', 
    color: 'bg-[#FF3B30]/20 text-[#FF3B30]', 
    icon: XCircle,
    description: 'Ditolak',
    canReview: true,
    canApprove: false
  }
};

/**
 * Get status configuration for a given status
 */
export const getStatusConfig = (status) => {
  return statusConfig[status] || statusConfig['draft'];
};

/**
 * Status to backend mapping
 * Maps frontend status values to backend-compatible values
 */
export const statusMapping = {
  'under_review': 'pending',
  'approved': 'approved',
  'rejected': 'cancelled',
  'draft': 'draft',
  'pending': 'pending'
};

/**
 * Map frontend status to backend status
 */
export const mapStatusToBackend = (status) => {
  return statusMapping[status] || status;
};
