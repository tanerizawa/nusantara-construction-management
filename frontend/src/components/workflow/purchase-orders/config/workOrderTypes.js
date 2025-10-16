/**
 * Work Order Types and Definitions
 * Used to properly categorize service and labor items into work orders
 */

// Work Order Types
export const WORK_ORDER_TYPES = {
  SERVICE: 'service',
  LABOR: 'labor',
  EQUIPMENT: 'equipment'
};

// Type Icons for UI
export const WORK_ORDER_TYPE_ICONS = {
  [WORK_ORDER_TYPES.SERVICE]: 'FileText',
  [WORK_ORDER_TYPES.LABOR]: 'Users',
  [WORK_ORDER_TYPES.EQUIPMENT]: 'Truck'
};

// Type Colors for UI
export const WORK_ORDER_TYPE_COLORS = {
  [WORK_ORDER_TYPES.SERVICE]: 'purple',
  [WORK_ORDER_TYPES.LABOR]: 'green',
  [WORK_ORDER_TYPES.EQUIPMENT]: 'yellow'
};

// Category mappings
export const WORK_ORDER_CATEGORIES = [
  { value: 'service_contract', label: 'Kontrak Jasa', type: WORK_ORDER_TYPES.SERVICE },
  { value: 'labor_contract', label: 'Kontrak Tenaga Kerja', type: WORK_ORDER_TYPES.LABOR },
  { value: 'equipment_rental', label: 'Sewa Peralatan', type: WORK_ORDER_TYPES.EQUIPMENT }
];

/**
 * Determines the appropriate document type (PO or Work Order) based on item type
 * @param {string} itemType - The item type (material, labor, service, equipment)
 * @returns {string} - 'po' for Purchase Orders, 'wo' for Work Orders
 */
export const getDocumentTypeForItem = (itemType) => {
  if (itemType === 'material') {
    return 'po'; // Purchase Order
  }
  
  if (['service', 'labor', 'equipment'].includes(itemType)) {
    return 'wo'; // Work Order
  }
  
  // Default fallback
  return 'po';
};

/**
 * Detects the item type based on name, category, or other properties
 * @param {Object} item - The item to analyze
 * @returns {string} - The detected item type ('material', 'service', 'labor', 'equipment')
 */
export const detectItemType = (item) => {
  // If itemType is explicitly set, use it
  if (item.itemType) return item.itemType;
  
  // Check kategori/category field for clues
  const category = (item.kategori || item.category || '').toLowerCase();
  
  // Common words indicating service items
  const serviceKeywords = ['jasa', 'service', 'pekerjaan', 'persiapan', 'instalasi', 'pasang'];
  const laborKeywords = ['tenaga', 'labor', 'pekerja', 'tukang'];
  const equipmentKeywords = ['alat', 'equipment', 'sewa'];
  const materialKeywords = ['material', 'bahan', 'besi', 'kayu', 'beton', 'cat'];
  
  // Check category
  if (serviceKeywords.some(keyword => category.includes(keyword))) return 'service';
  if (laborKeywords.some(keyword => category.includes(keyword))) return 'labor';
  if (equipmentKeywords.some(keyword => category.includes(keyword))) return 'equipment';
  if (materialKeywords.some(keyword => category.includes(keyword))) return 'material';
  
  // Check item name
  const name = (item.name || item.item_name || item.description || '').toLowerCase();
  
  if (serviceKeywords.some(keyword => name.includes(keyword))) return 'service';
  if (laborKeywords.some(keyword => name.includes(keyword))) return 'labor';
  if (equipmentKeywords.some(keyword => name.includes(keyword))) return 'equipment';
  if (materialKeywords.some(keyword => name.includes(keyword))) return 'material';
  
  // Default: if it has unit 'ls' (lump sum) or includes 'jasa'/'pekerjaan', it's likely a service
  if ((item.unit || '').toLowerCase() === 'ls' || name.includes('jasa') || name.includes('pekerjaan')) {
    return 'service';
  }
  
  // Default fallback - assume material
  return 'material';
};

/**
 * Determines if a given item should be processed as a work order
 * @param {Object|string} item - The item to check or item type string
 * @returns {boolean} - True if item should be a work order
 */
export const isWorkOrderItem = (item) => {
  const itemType = typeof item === 'string' ? item : detectItemType(item);
  return ['service', 'labor', 'equipment'].includes(itemType);
};

/**
 * Determines if a given item should be processed as a purchase order
 * @param {Object|string} item - The item to check or item type string
 * @returns {boolean} - True if item should be a purchase order
 */
export const isPurchaseOrderItem = (item) => {
  const itemType = typeof item === 'string' ? item : detectItemType(item);
  return itemType === 'material' || itemType === 'material_with_installation';
};