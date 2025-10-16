import { Receipt, Send, CheckCircle, Calendar, XCircle, Mail, Truck, Package, DollarSign } from 'lucide-react';

/**
 * Invoice Status Configuration
 */
export const INVOICE_STATUS = {
  DRAFT: 'draft',
  GENERATED: 'generated',
  APPROVED: 'approved',
  INVOICE_SENT: 'invoice_sent',
  SENT: 'sent',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled'
};

/**
 * Invoice Status Display Configuration
 */
export const STATUS_CONFIG = {
  [INVOICE_STATUS.DRAFT]: {
    color: 'bg-[#8E8E93]/20 text-[#8E8E93]',
    label: 'Draft',
    icon: Receipt
  },
  [INVOICE_STATUS.GENERATED]: {
    color: 'bg-[#0A84FF]/20 text-[#0A84FF]',
    label: 'Generated',
    icon: Receipt
  },
  [INVOICE_STATUS.APPROVED]: {
    color: 'bg-[#0A84FF]/20 text-[#0A84FF]',
    label: 'Approved',
    icon: CheckCircle
  },
  [INVOICE_STATUS.INVOICE_SENT]: {
    color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]',
    label: 'Sent',
    icon: Send
  },
  [INVOICE_STATUS.SENT]: {
    color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]',
    label: 'Sent',
    icon: Send
  },
  [INVOICE_STATUS.PAID]: {
    color: 'bg-[#30D158]/20 text-[#30D158]',
    label: 'Paid',
    icon: CheckCircle
  },
  [INVOICE_STATUS.OVERDUE]: {
    color: 'bg-[#FF3B30]/20 text-[#FF3B30]',
    label: 'Overdue',
    icon: Calendar
  },
  [INVOICE_STATUS.CANCELLED]: {
    color: 'bg-[#8E8E93]/20 text-[#8E8E93]',
    label: 'Cancelled',
    icon: XCircle
  }
};

/**
 * Filter Options for Invoice Status
 */
export const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua Status' },
  { value: INVOICE_STATUS.DRAFT, label: 'Draft' },
  { value: INVOICE_STATUS.GENERATED, label: 'Generated' },
  { value: INVOICE_STATUS.SENT, label: 'Sent' },
  { value: INVOICE_STATUS.PAID, label: 'Paid' },
  { value: INVOICE_STATUS.OVERDUE, label: 'Overdue' }
];

/**
 * Delivery Method Configuration
 */
export const DELIVERY_METHODS = [
  { 
    value: 'courier', 
    label: 'Kurir', 
    icon: Truck,
    requiresService: true,
    requiresTracking: false
  },
  { 
    value: 'post', 
    label: 'Pos', 
    icon: Mail,
    requiresService: false,
    requiresTracking: false
  },
  { 
    value: 'hand_delivery', 
    label: 'Hand Delivery', 
    icon: Package,
    requiresService: false,
    requiresTracking: false
  },
  { 
    value: 'other', 
    label: 'Lainnya', 
    icon: Package,
    requiresService: false,
    requiresTracking: false
  }
];

/**
 * Default Bank Accounts (Fallback)
 */
export const DEFAULT_BANKS = [
  { id: 'default-bca', accountCode: '1101.01', accountName: 'Bank BCA' },
  { id: 'default-mandiri', accountCode: '1101.02', accountName: 'Bank Mandiri' },
  { id: 'default-bri', accountCode: '1101.03', accountName: 'Bank BRI' },
  { id: 'default-bni', accountCode: '1101.04', accountName: 'Bank BNI' },
  { id: 'default-cimb', accountCode: '1101.05', accountName: 'CIMB Niaga' },
  { id: 'default-permata', accountCode: '1101.06', accountName: 'Permata' },
  { id: 'default-danamon', accountCode: '1101.07', accountName: 'Danamon' },
  { id: 'default-btn', accountCode: '1101.08', accountName: 'BTN' }
];

/**
 * Fallback Bank Options (when COA not available)
 */
export const FALLBACK_BANK_OPTIONS = [
  'BCA',
  'Mandiri', 
  'BRI',
  'BNI',
  'CIMB Niaga',
  'Permata',
  'Danamon',
  'BTN',
  'Other'
];

/**
 * Form Validation Rules
 */
export const VALIDATION_RULES = {
  markSent: {
    recipientName: {
      required: true,
      minLength: 3,
      message: 'Nama penerima minimal 3 karakter'
    },
    sentDate: {
      required: true,
      maxDate: 'today',
      message: 'Tanggal kirim tidak boleh lebih dari hari ini'
    },
    courierService: {
      requiredIf: 'deliveryMethod === "courier"',
      message: 'Nama kurir wajib diisi'
    }
  },
  paymentConfirmation: {
    paidAmount: {
      required: true,
      min: 0.01,
      type: 'number',
      message: 'Jumlah pembayaran harus lebih dari 0'
    },
    paidDate: {
      required: true,
      maxDate: 'today',
      message: 'Tanggal pembayaran tidak boleh lebih dari hari ini'
    },
    bankName: {
      required: true,
      message: 'Bank penerima wajib dipilih'
    },
    evidenceFile: {
      required: true,
      accept: 'image/*,.pdf',
      message: 'Bukti transfer wajib diupload'
    }
  }
};

/**
 * Statistics Configuration
 */
export const STATS_CONFIG = [
  {
    key: 'total',
    label: 'Total Invoice',
    icon: Receipt,
    color: 'bg-[#0A84FF]/20 text-[#0A84FF]',
    amountKey: 'totalAmount'
  },
  {
    key: 'draft', 
    label: 'Draft',
    icon: Receipt,
    color: 'bg-[#8E8E93]/20 text-[#8E8E93]',
    amountKey: 'draftAmount'
  },
  {
    key: 'sent',
    label: 'Sent / Awaiting',
    icon: Send,
    color: 'bg-[#FF9F0A]/20 text-[#FF9F0A]',
    amountKey: 'sentAmount'
  },
  {
    key: 'paid',
    label: 'Paid',
    icon: CheckCircle,
    color: 'bg-[#30D158]/20 text-[#30D158]',
    amountKey: 'paidAmount'
  },
  {
    key: 'overdue',
    label: 'Overdue',
    icon: Calendar,
    color: 'bg-[#FF3B30]/20 text-[#FF3B30]',
    amountKey: 'overdueAmount'
  }
];