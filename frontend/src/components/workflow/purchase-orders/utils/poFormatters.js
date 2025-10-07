import { formatCurrency, formatDate } from '../../../../utils/formatters';

/**
 * Purchase Order Formatting Utilities
 * Handles display formatting for PO data
 */

/**
 * Format PO number with prefix
 */
export const formatPONumber = (poNumber) => {
  if (!poNumber) return '-';
  return `PO-${poNumber}`;
};

/**
 * Format PO status label for display
 */
export const formatPOStatusLabel = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'pending': 'Menunggu Persetujuan',
    'approved': 'Disetujui',
    'rejected': 'Ditolak',
    'cancelled': 'Dibatalkan',
    'completed': 'Selesai'
  };
  
  return statusMap[status?.toLowerCase()] || status || 'Unknown';
};

/**
 * Get status color class
 */
export const getPOStatusColor = (status) => {
  const statusColors = {
    'draft': 'bg-gray-100 text-gray-800 border-gray-300',
    'pending': 'bg-yellow-100 text-yellow-800 border-yellow-300',
    'approved': 'bg-green-100 text-green-800 border-green-300',
    'rejected': 'bg-red-100 text-red-800 border-red-300',
    'cancelled': 'bg-gray-100 text-gray-600 border-gray-300',
    'completed': 'bg-blue-100 text-blue-800 border-blue-300'
  };
  
  return statusColors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-300';
};

/**
 * Format PO for display with all necessary formatting
 */
export const formatPOForDisplay = (po) => {
  return {
    ...po,
    formattedNumber: formatPONumber(po.poNumber || po.po_number),
    formattedStatus: formatPOStatusLabel(po.status),
    statusColor: getPOStatusColor(po.status),
    formattedTotal: formatCurrency(po.totalAmount || po.total_amount),
    formattedDate: formatDate(po.createdAt || po.created_at),
    formattedDeliveryDate: formatDate(po.deliveryDate || po.delivery_date),
    formattedApprovedDate: po.approved_at ? formatDate(po.approved_at) : '-'
  };
};

/**
 * Format RAB item for PO display
 */
export const formatRABItemForPO = (rabItem) => {
  const totalQty = parseFloat(rabItem.quantity) || 0;
  const purchased = parseFloat(rabItem.totalPurchased) || 0;
  const remaining = totalQty - purchased;
  const unitPrice = parseFloat(rabItem.unitPrice || rabItem.unit_price) || 0;
  
  return {
    ...rabItem,
    formattedUnitPrice: formatCurrency(unitPrice),
    formattedTotalValue: formatCurrency(totalQty * unitPrice),
    formattedPurchasedValue: formatCurrency(purchased * unitPrice),
    formattedRemainingValue: formatCurrency(remaining * unitPrice),
    formattedQuantity: `${totalQty.toFixed(2)} ${rabItem.unit || 'unit'}`,
    formattedPurchased: `${purchased.toFixed(2)} ${rabItem.unit || 'unit'}`,
    formattedRemaining: `${remaining.toFixed(2)} ${rabItem.unit || 'unit'}`,
    progressPercentage: totalQty > 0 ? ((purchased / totalQty) * 100).toFixed(1) : 0
  };
};

/**
 * Format supplier info for display
 */
export const formatSupplierInfo = (supplier) => {
  if (!supplier) return null;
  
  return {
    name: supplier.name || supplier.supplierName || '-',
    contact: supplier.contact || supplier.supplierContact || '-',
    address: supplier.address || supplier.supplierAddress || '-',
    formattedDeliveryDate: formatDate(supplier.deliveryDate || supplier.delivery_date)
  };
};

/**
 * Format PO items summary
 */
export const formatPOItemsSummary = (items) => {
  if (!items || !Array.isArray(items) || items.length === 0) {
    return {
      totalItems: 0,
      totalQuantity: 0,
      totalAmount: 0,
      formattedTotalAmount: formatCurrency(0)
    };
  }
  
  const totalQuantity = items.reduce((sum, item) => 
    sum + (parseFloat(item.quantity) || 0), 0
  );
  
  const totalAmount = items.reduce((sum, item) => {
    const qty = parseFloat(item.quantity) || 0;
    const price = parseFloat(item.unitPrice || item.unit_price) || 0;
    return sum + (qty * price);
  }, 0);
  
  return {
    totalItems: items.length,
    totalQuantity,
    totalAmount,
    formattedTotalAmount: formatCurrency(totalAmount),
    formattedTotalQuantity: totalQuantity.toFixed(2)
  };
};

/**
 * Format progress percentage
 */
export const formatProgressPercentage = (purchased, total) => {
  const purchasedQty = parseFloat(purchased) || 0;
  const totalQty = parseFloat(total) || 0;
  
  if (totalQty === 0) return '0%';
  
  const percentage = (purchasedQty / totalQty) * 100;
  return `${Math.min(100, percentage).toFixed(1)}%`;
};

/**
 * Get progress color based on percentage
 */
export const getProgressColor = (purchased, total) => {
  const purchasedQty = parseFloat(purchased) || 0;
  const totalQty = parseFloat(total) || 0;
  
  if (totalQty === 0) return 'bg-gray-200';
  
  const percentage = (purchasedQty / totalQty) * 100;
  
  if (percentage < 30) return 'bg-red-500';
  if (percentage < 70) return 'bg-yellow-500';
  if (percentage < 100) return 'bg-blue-500';
  return 'bg-green-500';
};

/**
 * Format date range for filtering
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate && !endDate) return 'Semua Tanggal';
  if (startDate && !endDate) return `Dari ${formatDate(startDate)}`;
  if (!startDate && endDate) return `Sampai ${formatDate(endDate)}`;
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};
