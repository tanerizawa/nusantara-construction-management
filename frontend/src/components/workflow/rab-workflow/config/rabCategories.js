/**
 * RAB Categories Configuration
 * Defines work categories for construction RAB items with item types
 */

// Item Types untuk menentukan workflow yang tepat
export const RAB_ITEM_TYPES = [
  { 
    value: 'material', 
    label: 'Material/Barang', 
    color: 'blue',
    description: 'Item yang bisa dibeli melalui PO',
    workflow: 'purchase_order',
    paymentMethod: 'po_payment'
  },
  { 
    value: 'labor', 
    label: 'Tenaga Kerja/Upah', 
    color: 'green',
    description: 'Upah pekerja dan jasa tenaga kerja',
    workflow: 'direct_payment',
    paymentMethod: 'payroll'
  },
  { 
    value: 'service', 
    label: 'Jasa/Subkontraktor', 
    color: 'purple',
    description: 'Jasa subkontraktor dan vendor',
    workflow: 'service_contract',
    paymentMethod: 'contract_payment'
  },
  { 
    value: 'equipment', 
    label: 'Sewa Peralatan', 
    color: 'yellow',
    description: 'Sewa alat berat dan equipment',
    workflow: 'rental_agreement',
    paymentMethod: 'rental_payment'
  },
  { 
    value: 'overhead', 
    label: 'Overhead/Operasional', 
    color: 'gray',
    description: 'Biaya overhead dan operasional',
    workflow: 'direct_payment',
    paymentMethod: 'expense_payment'
  }
];

export const RAB_CATEGORIES = [
  { value: 'Pekerjaan Persiapan', label: 'Pekerjaan Persiapan', color: 'blue' },
  { value: 'Pekerjaan Tanah', label: 'Pekerjaan Tanah', color: 'orange' },
  { value: 'Pekerjaan Pondasi', label: 'Pekerjaan Pondasi', color: 'green' },
  { value: 'Pekerjaan Struktur', label: 'Pekerjaan Struktur', color: 'blue' },
  { value: 'Pekerjaan Arsitektur', label: 'Pekerjaan Arsitektur', color: 'purple' },
  { value: 'Pekerjaan Atap', label: 'Pekerjaan Atap', color: 'red' },
  { value: 'Pekerjaan MEP', label: 'Pekerjaan MEP', color: 'yellow' },
  { value: 'Pekerjaan Finishing', label: 'Pekerjaan Finishing', color: 'pink' }
];

// Mapping kategori ke tipe item yang paling umum
export const CATEGORY_TO_ITEM_TYPE_MAPPING = {
  'Pekerjaan Persiapan': ['labor', 'service', 'equipment'],
  'Pekerjaan Tanah': ['labor', 'equipment', 'material'],
  'Pekerjaan Pondasi': ['material', 'labor'],
  'Pekerjaan Struktur': ['material', 'labor'],
  'Pekerjaan Arsitektur': ['material', 'labor'],
  'Pekerjaan Atap': ['material', 'labor'],
  'Pekerjaan MEP': ['material', 'labor', 'service'],
  'Pekerjaan Finishing': ['material', 'labor']
};

export const CATEGORY_COLORS = {
  'Material': 'blue',
  'Tenaga Kerja': 'green',
  'Peralatan': 'yellow',
  'Subkontraktor': 'purple',
  'Overhead': 'gray'
};

export const getCategoryColor = (category) => {
  const categoryConfig = RAB_CATEGORIES.find(cat => cat.value === category);
  return categoryConfig ? categoryConfig.color : 'gray';
};

export const getItemTypeConfig = (itemType) => {
  return RAB_ITEM_TYPES.find(type => type.value === itemType);
};

// Helper untuk menentukan workflow berdasarkan item type
export const getWorkflowForItemType = (itemType) => {
  const config = getItemTypeConfig(itemType);
  return config ? config.workflow : 'direct_payment';
};

// Helper untuk menentukan payment method berdasarkan item type
export const getPaymentMethodForItemType = (itemType) => {
  const config = getItemTypeConfig(itemType);
  return config ? config.paymentMethod : 'expense_payment';
};
