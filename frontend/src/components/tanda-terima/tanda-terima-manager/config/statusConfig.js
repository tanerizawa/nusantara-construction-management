/**
 * Status Configuration for Tanda Terima
 */

import {
  Clock,
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  AlertCircle
} from 'lucide-react';

export const TT_STATUS = {
  PENDING_DELIVERY: 'pending_delivery',
  PARTIAL_DELIVERED: 'partial_delivered',
  FULLY_DELIVERED: 'fully_delivered',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  REJECTED: 'rejected'
};

export const STATUS_CONFIG = {
  pending_delivery: {
    label: 'Menunggu Pengiriman',
    color: 'bg-[#FF9F0A]/20 text-[#FF9F0A] border-[#FF9F0A]/30',
    icon: Clock
  },
  partial_delivered: {
    label: 'Pengiriman Sebagian',
    color: 'bg-[#0A84FF]/20 text-[#0A84FF] border-[#0A84FF]/30',
    icon: Package
  },
  fully_delivered: {
    label: 'Pengiriman Lengkap',
    color: 'bg-[#BF5AF2]/20 text-[#BF5AF2] border-[#BF5AF2]/30',
    icon: Truck
  },
  received: {
    label: 'Diterima',
    color: 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30',
    icon: CheckCircle
  },
  completed: {
    label: 'Selesai',
    color: 'bg-[#30D158]/20 text-[#30D158] border-[#30D158]/30',
    icon: CheckCircle
  },
  rejected: {
    label: 'Ditolak',
    color: 'bg-[#FF3B30]/20 text-[#FF3B30] border-[#FF3B30]/30',
    icon: AlertTriangle
  }
};

export const getStatusInfo = (status) => {
  return STATUS_CONFIG[status] || { 
    label: status, 
    color: 'bg-[#3A3A3C] text-[#98989D] border-[#38383A]', 
    icon: AlertCircle 
  };
};

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: 'pending_delivery', label: 'Menunggu Pengiriman' },
  { value: 'partial_delivered', label: 'Pengiriman Sebagian' },
  { value: 'fully_delivered', label: 'Pengiriman Lengkap' },
  { value: 'received', label: 'Diterima' },
  { value: 'completed', label: 'Selesai' },
  { value: 'rejected', label: 'Ditolak' }
];
