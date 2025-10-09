import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Milestone status configuration
export const MILESTONE_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  OVERDUE: 'overdue'
};

export const STATUS_INFO = {
  completed: { color: 'green', icon: CheckCircle, text: 'Selesai' },
  in_progress: { color: 'blue', icon: Clock, text: 'Berlangsung' },
  pending: { color: 'gray', icon: AlertCircle, text: 'Pending' },
  overdue: { color: 'red', icon: AlertCircle, text: 'Terlambat' }
};

export const getStatusInfo = (status) => {
  return STATUS_INFO[status] || STATUS_INFO.pending;
};

export const isOverdue = (milestone) => {
  if (milestone.status === 'completed') return false;
  return new Date(milestone.targetDate) < new Date();
};
