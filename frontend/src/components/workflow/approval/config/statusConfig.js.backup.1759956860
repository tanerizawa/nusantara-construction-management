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
    color: 'bg-gray-100 text-gray-800', 
    icon: FileText,
    description: 'Dokumen belum submit',
    canReview: true,
    canApprove: false
  },
  'under_review': { 
    label: 'Diperiksa', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Eye,
    description: 'Sedang dalam pemeriksaan',
    canReview: false,
    canApprove: true
  },
  'pending': { 
    label: 'Menunggu Approval', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock,
    description: 'Menunggu persetujuan',
    canReview: false,
    canApprove: true
  },
  'approved': { 
    label: 'Disetujui', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    description: 'Telah disetujui',
    canReview: false,
    canApprove: false
  },
  'rejected': { 
    label: 'Ditolak', 
    color: 'bg-red-100 text-red-800', 
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
