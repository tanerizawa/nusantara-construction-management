import { STATUS_CONFIG } from '../config/poConfig';

/**
 * Get status color class
 */
export const getStatusColor = (status) => {
  return STATUS_CONFIG[status]?.color || 'bg-gray-100 text-gray-800';
};

/**
 * Get status icon component
 */
export const getStatusIcon = (status) => {
  return STATUS_CONFIG[status]?.icon || STATUS_CONFIG.draft.icon;
};

/**
 * Format currency to Indonesian Rupiah
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};

/**
 * Format date to Indonesian format
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID');
};

/**
 * Format number with Indonesian locale
 */
export const formatNumber = (number) => {
  return parseFloat(number || 0).toLocaleString('id-ID');
};

/**
 * Calculate purchase order summary statistics
 */
export const calculatePOSummary = (purchaseOrders) => {
  const summary = {
    total: purchaseOrders.length,
    draft: 0,
    pending: 0,
    approved: 0,
    sent: 0,
    received: 0,
    completed: 0,
    cancelled: 0,
    totalValue: 0
  };

  purchaseOrders.forEach(po => {
    if (summary.hasOwnProperty(po.status)) {
      summary[po.status]++;
    }
    summary.totalValue += parseFloat(po.totalAmount || 0);
  });

  return summary;
};

/**
 * Filter purchase orders by status
 */
export const filterPOsByStatus = (purchaseOrders, statusFilter) => {
  if (statusFilter === 'all') {
    return purchaseOrders;
  }
  return purchaseOrders.filter(po => po.status === statusFilter);
};

/**
 * Validate purchase order form data
 */
export const validatePOForm = (supplierInfo, selectedItems) => {
  const errors = [];

  // Supplier validation
  if (!supplierInfo.name?.trim()) {
    errors.push('Nama supplier wajib diisi');
  }

  // Items validation
  if (!selectedItems || selectedItems.length === 0) {
    errors.push('Pilih minimal satu item untuk PO');
  }

  // Validate each selected item
  selectedItems.forEach((item, index) => {
    if (!item.orderQuantity || item.orderQuantity <= 0) {
      errors.push(`Item ${index + 1}: Jumlah pesanan harus lebih dari 0`);
    }
    if (!item.unitPrice || item.unitPrice <= 0) {
      errors.push(`Item ${index + 1}: Harga satuan harus lebih dari 0`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calculate total amount for selected items
 */
export const calculateTotalAmount = (selectedItems) => {
  return selectedItems.reduce((sum, item) => {
    return sum + ((item.orderQuantity || 0) * (item.unitPrice || 0));
  }, 0);
};

/**
 * Generate PO data from form inputs
 */
export const generatePOData = (project, supplierInfo, selectedItems) => {
  return {
    projectId: project.id,
    projectName: project.name,
    supplierName: supplierInfo.name,
    supplierContact: supplierInfo.contact,
    supplierAddress: supplierInfo.address,
    deliveryDate: supplierInfo.deliveryDate,
    items: selectedItems.map(item => ({
      rabItemId: item.id,
      itemName: item.itemName || item.material,
      description: item.description || '',
      quantity: item.orderQuantity,
      unit: item.unit || 'Unit',
      unitPrice: item.unitPrice,
      totalPrice: item.orderQuantity * item.unitPrice
    })),
    totalAmount: calculateTotalAmount(selectedItems),
    status: 'draft',
    orderDate: new Date().toISOString(),
    notes: supplierInfo.notes || ''
  };
};

/**
 * Get breadcrumb items for navigation
 */
export const getBreadcrumbItems = (currentView, selectedProject, selectedPO) => {
  const items = [
    { label: 'Purchase Orders', onClick: 'handleBackToList' }
  ];

  switch (currentView) {
    case 'project-selection':
      items.push({ label: 'Pilih Proyek' });
      break;
    case 'create-form':
      items.push(
        { label: 'Pilih Proyek', onClick: 'handleShowProjectSelection' },
        { label: `Buat PO - ${selectedProject?.name}` }
      );
      break;
    case 'po-detail':
      items.push({ label: `Detail PO - ${selectedPO?.poNumber}` });
      break;
    default:
      break;
  }

  return items;
};

/**
 * Check if item is selected in the list
 */
export const isItemSelected = (selectedItems, itemId) => {
  return selectedItems.find(item => item.id === itemId);
};

/**
 * Get safe item value with fallback
 */
export const getSafeItemValue = (item, key, fallback = '-') => {
  return item?.[key] || fallback;
};

/**
 * Validate delivery date
 */
export const validateDeliveryDate = (date) => {
  if (!date) return true; // Optional field
  
  const deliveryDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return deliveryDate >= today;
};

/**
 * Format PO number for display
 */
export const formatPONumber = (poNumber, prefix = 'PO') => {
  if (!poNumber) return `${prefix}-DRAFT`;
  return poNumber.startsWith(prefix) ? poNumber : `${prefix}-${poNumber}`;
};

/**
 * Get status badge props
 */
export const getStatusBadgeProps = (status) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return {
    className: config.color,
    label: config.label,
    icon: config.icon
  };
};