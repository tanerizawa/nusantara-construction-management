import {
  FileText,
  Calendar,
  CheckCircle,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';

/**
 * Konfigurasi status untuk Berita Acara
 */
export const BA_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  CLIENT_REVIEW: 'client_review',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

/**
 * Konfigurasi tampilan untuk setiap status BA
 * Dark theme with iOS/macOS colors
 */
export const getStatusConfig = (status) => {
  const configs = {
    [BA_STATUS.DRAFT]: { 
      label: 'Draft', 
      color: '#8E8E93',
      bgColor: 'rgba(142, 142, 147, 0.1)',
      icon: FileText,
      description: 'Masih dalam tahap penyusunan'
    },
    [BA_STATUS.SUBMITTED]: { 
      label: 'Diajukan', 
      color: '#0A84FF',
      bgColor: 'rgba(10, 132, 255, 0.1)',
      icon: Clock,
      description: 'Menunggu review dari klien'
    },
    [BA_STATUS.CLIENT_REVIEW]: { 
      label: 'Review Klien', 
      color: '#FF9F0A',
      bgColor: 'rgba(255, 159, 10, 0.1)',
      icon: User,
      description: 'Sedang direview oleh klien'
    },
    [BA_STATUS.APPROVED]: { 
      label: 'Disetujui', 
      color: '#30D158',
      bgColor: 'rgba(48, 209, 88, 0.1)',
      icon: CheckCircle,
      description: 'BA telah disetujui, siap untuk pembayaran'
    },
    [BA_STATUS.REJECTED]: { 
      label: 'Ditolak', 
      color: '#FF3B30',
      bgColor: 'rgba(255, 59, 48, 0.1)',
      icon: AlertTriangle,
      description: 'BA ditolak, perlu revisi'
    }
  };
  
  return configs[status] || configs[BA_STATUS.DRAFT];
};

/**
 * Tipe Berita Acara
 */
export const BA_TYPES = {
  PARTIAL: 'partial',
  PROVISIONAL: 'provisional',
  FINAL: 'final'
};

/**
 * Konfigurasi tampilan untuk setiap tipe BA
 */
export const getBATypeConfig = (type) => {
  const types = {
    [BA_TYPES.PARTIAL]: { 
      label: 'Sebagian', 
      description: 'BA untuk pekerjaan sebagian' 
    },
    [BA_TYPES.PROVISIONAL]: { 
      label: 'Sementara', 
      description: 'BA sementara untuk handover awal' 
    },
    [BA_TYPES.FINAL]: { 
      label: 'Final', 
      description: 'BA final untuk serah terima proyek' 
    }
  };
  
  return types[type] || types[BA_TYPES.PARTIAL];
};

/**
 * Helper untuk cek apakah BA bisa diedit
 */
export const canEditBA = (status) => {
  return status === BA_STATUS.DRAFT;
};

/**
 * Helper untuk cek apakah BA bisa disubmit
 */
export const canSubmitBA = (status) => {
  return status === BA_STATUS.DRAFT;
};

/**
 * Helper untuk cek apakah BA siap untuk pembayaran
 */
export const isPaymentReady = (ba) => {
  return ba.status === BA_STATUS.APPROVED && ba.paymentAuthorized;
};
