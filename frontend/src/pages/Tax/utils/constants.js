import { FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';

/**
 * Status configuration for tax entries
 */
export const STATUS_CONFIG = {
  paid: { 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle, 
    text: 'Lunas' 
  },
  pending: { 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Clock, 
    text: 'Pending' 
  },
  overdue: { 
    color: 'bg-red-100 text-red-800', 
    icon: AlertCircle, 
    text: 'Terlambat' 
  }
};

/**
 * Sort options for tax listing
 */
export const SORT_OPTIONS = [
  { value: 'date:desc', label: 'Tanggal terbaru' },
  { value: 'date:asc', label: 'Tanggal terlama' },
  { value: 'amount:desc', label: 'Nominal terbesar' },
  { value: 'amount:asc', label: 'Nominal terkecil' },
];

/**
 * Status filter options for tax listing
 */
export const STATUS_FILTERS = [
  { value: '', label: 'Semua Status' },
  { value: 'paid', label: 'Lunas' },
  { value: 'pending', label: 'Pending' },
  { value: 'overdue', label: 'Terlambat' },
];