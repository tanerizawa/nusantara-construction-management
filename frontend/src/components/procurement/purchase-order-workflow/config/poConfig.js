import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Send,
  Package,
  ShoppingCart,
  DollarSign,
  Truck,
  Building
} from 'lucide-react';

/**
 * Purchase Order Status Configuration
 */
export const PO_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  SENT: 'sent',
  RECEIVED: 'received',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

/**
 * Purchase Order Status Display Configuration
 */
export const STATUS_CONFIG = {
  [PO_STATUS.DRAFT]: {
    color: 'bg-gray-100 text-gray-800',
    icon: FileText,
    label: 'Draft'
  },
  [PO_STATUS.PENDING]: {
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
    label: 'Pending'
  },
  [PO_STATUS.APPROVED]: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Approved'
  },
  [PO_STATUS.REJECTED]: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    label: 'Rejected'
  },
  [PO_STATUS.SENT]: {
    color: 'bg-blue-100 text-blue-800',
    icon: Send,
    label: 'Sent'
  },
  [PO_STATUS.RECEIVED]: {
    color: 'bg-purple-100 text-purple-800',
    icon: Package,
    label: 'Received'
  },
  [PO_STATUS.COMPLETED]: {
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
    label: 'Completed'
  },
  [PO_STATUS.CANCELLED]: {
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
    label: 'Cancelled'
  }
};

/**
 * Filter Options for Purchase Order Status
 */
export const FILTER_OPTIONS = [
  { value: 'all', label: 'Semua' },
  { value: PO_STATUS.DRAFT, label: 'Draft' },
  { value: PO_STATUS.PENDING, label: 'Pending' },
  { value: PO_STATUS.APPROVED, label: 'Approved' },
  { value: PO_STATUS.SENT, label: 'Sent' },
  { value: PO_STATUS.RECEIVED, label: 'Received' },
  { value: PO_STATUS.COMPLETED, label: 'Completed' }
];

/**
 * Views Configuration
 */
export const VIEWS = {
  LIST: 'list',
  PROJECT_SELECTION: 'project-selection',
  CREATE_FORM: 'create-form',
  PO_DETAIL: 'po-detail'
};

/**
 * Summary Statistics Configuration
 */
export const SUMMARY_CONFIG = [
  {
    key: 'total',
    label: 'Total PO',
    icon: ShoppingCart,
    color: 'text-blue-500'
  },
  {
    key: 'pending',
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-500'
  },
  {
    key: 'approved',
    label: 'Approved',
    icon: CheckCircle,
    color: 'text-green-500'
  },
  {
    key: 'totalValue',
    label: 'Total Value',
    icon: DollarSign,
    color: 'text-green-500',
    isAmount: true
  }
];

/**
 * Company Information for PO Documents
 */
export const COMPANY_INFO = {
  name: 'NUSANTARA GROUP',
  subtitle: 'KONSTRUKSI & DEVELOPMENT',
  address: 'Jl. Raya Industri No. 123, Karawang, Jawa Barat 41361',
  phone: '(0267) 123-4567',
  fax: '(0267) 123-4568',
  email: 'procurement@nusantagroup.co.id',
  website: 'www.nusantaragroup.co.id',
  npwp: '01.234.567.8-901.000'
};

/**
 * Default Form Values
 */
export const DEFAULT_SUPPLIER_INFO = {
  name: '',
  contact: '',
  address: '',
  deliveryDate: ''
};

/**
 * PO Terms and Conditions
 */
export const PO_TERMS = [
  'Barang harus dikirim sesuai spesifikasi dan dalam kondisi baik',
  'Pengiriman dilakukan ke lokasi proyek yang telah ditentukan',
  'Pembayaran dilakukan 30 hari setelah penerimaan barang dan invoice',
  'Supplier bertanggung jawab atas kualitas barang yang dikirim',
  'Segala perubahan harus mendapat persetujuan tertulis dari PT Nusantara Group'
];

/**
 * Approval Roles Configuration
 */
export const APPROVAL_ROLES = [
  {
    role: 'DIBUAT OLEH',
    title: 'Staff Procurement',
    color: 'gray'
  },
  {
    role: 'DIPERIKSA OLEH',
    title: 'Manager Proyek',
    color: 'blue'
  },
  {
    role: 'DISETUJUI OLEH',
    title: 'General Manager',
    color: 'green'
  }
];

/**
 * Table Headers for PO Items
 */
export const PO_ITEM_HEADERS = [
  { key: 'no', label: 'No', align: 'left' },
  { key: 'itemName', label: 'Nama Item', align: 'left' },
  { key: 'description', label: 'Deskripsi', align: 'left' },
  { key: 'quantity', label: 'Qty', align: 'center' },
  { key: 'unit', label: 'Satuan', align: 'center' },
  { key: 'unitPrice', label: 'Harga Satuan', align: 'right' },
  { key: 'totalPrice', label: 'Total Harga', align: 'right' }
];