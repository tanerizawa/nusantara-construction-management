/**
 * Tanda Terima Form Configuration
 */

export const DELIVERY_METHODS = [
  { value: 'truck', label: 'Truck' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'van', label: 'Van' },
  { value: 'container', label: 'Container' },
  { value: 'other', label: 'Lainnya' }
];

export const RECEIPT_TYPES = [
  { value: 'full_delivery', label: 'Pengiriman Penuh' },
  { value: 'partial_delivery', label: 'Pengiriman Sebagian' }
];

export const ITEM_CONDITIONS = [
  { value: 'good', label: 'Baik', color: 'bg-green-100 text-green-800' },
  { value: 'damaged', label: 'Rusak', color: 'bg-red-100 text-red-800' },
  { value: 'incomplete', label: 'Tidak Lengkap', color: 'bg-yellow-100 text-yellow-800' }
];

export const getItemConditionLabel = (condition) => {
  const config = ITEM_CONDITIONS.find(item => item.value === condition);
  return config ? config.label : condition;
};

export const getItemConditionColor = (condition) => {
  const config = ITEM_CONDITIONS.find(item => item.value === condition);
  return config ? config.color : 'bg-gray-100 text-gray-800';
};
