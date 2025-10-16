/**
 * RAB Status Configuration
 * Defines status states for RAB items and workflow
 */

export const RAB_STATUS = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    color: 'yellow',
    icon: 'Clock',
    bgColor: 'bg-[#FF9F0A]/20',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300'
  },
  approved: {
    label: 'Disetujui',
    color: 'green',
    icon: 'CheckCircle',
    bgColor: 'bg-[#30D158]/20',
    textColor: 'text-green-800',
    borderColor: 'border-green-300'
  },
  rejected: {
    label: 'Ditolak',
    color: 'red',
    icon: 'AlertTriangle',
    bgColor: 'bg-[#FF3B30]/20',
    textColor: 'text-red-800',
    borderColor: 'border-red-300'
  }
};

export const getStatusConfig = (status) => {
  return STATUS_CONFIG[status] || STATUS_CONFIG.draft;
};

export const canAddItems = (approvalStatus) => {
  return approvalStatus?.status !== RAB_STATUS.APPROVED;
};
