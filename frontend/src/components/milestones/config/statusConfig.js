import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

// Milestone status configuration
export const MILESTONE_STATUS = {
  COMPLETED: 'completed',
  IN_PROGRESS: 'in_progress',
  PENDING: 'pending',
  OVERDUE: 'overdue'
};

export const STATUS_INFO = {
  completed: { 
    color: '#30D158', 
    bgColor: '#30D158',
    bgOpacity: 'rgba(48, 209, 88, 0.1)',
    icon: CheckCircle, 
    text: 'Selesai' 
  },
  in_progress: { 
    color: '#0A84FF', 
    bgColor: '#0A84FF',
    bgOpacity: 'rgba(10, 132, 255, 0.1)',
    icon: Clock, 
    text: 'Berlangsung' 
  },
  pending: { 
    color: '#8E8E93', 
    bgColor: '#8E8E93',
    bgOpacity: 'rgba(142, 142, 147, 0.1)',
    icon: AlertCircle, 
    text: 'Pending' 
  },
  overdue: { 
    color: '#FF3B30', 
    bgColor: '#FF3B30',
    bgOpacity: 'rgba(255, 59, 48, 0.1)',
    icon: AlertCircle, 
    text: 'Terlambat' 
  }
};

export const getStatusInfo = (status) => {
  return STATUS_INFO[status] || STATUS_INFO.pending;
};

export const isOverdue = (milestone) => {
  if (milestone.status === 'completed') return false;
  return new Date(milestone.targetDate) < new Date();
};
