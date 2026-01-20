/**
 * Purchase Order Calculation Utilities
 * Handles all financial calculations for PO system
 */

/**
 * Calculate total PO amount
 */
export const calculatePOTotal = (items) => {
  if (!items || !Array.isArray(items)) return 0;
  
  return items.reduce((total, item) => {
    const quantity = parseFloat(item.quantity) || 0;
    const unitPrice = parseFloat(item.unitPrice || item.unit_price) || 0;
    return total + (quantity * unitPrice);
  }, 0);
};

/**
 * Calculate PO breakdown with tax and additional costs
 */
export const calculatePOBreakdown = (items, tax = 0, shippingCost = 0, otherCosts = 0) => {
  const subtotal = calculatePOTotal(items);
  const taxAmount = (subtotal * tax) / 100;
  const total = subtotal + taxAmount + shippingCost + otherCosts;
  
  return {
    subtotal,
    tax: taxAmount,
    shippingCost,
    otherCosts,
    total
  };
};

/**
 * Calculate remaining value for a RAB item
 */
export const calculateRemainingValue = (rabItem) => {
  const totalQty = parseFloat(rabItem.quantity) || 0;
  const totalPurchased = parseFloat(rabItem.totalPurchased) || 0;
  const unitPrice = parseFloat(rabItem.unitPrice || rabItem.unit_price) || 0;
  
  const remainingQuantity = Math.max(0, totalQty - totalPurchased);
  const remainingValue = remainingQuantity * unitPrice;
  
  return {
    remainingQuantity,
    remainingValue,
    totalValue: totalQty * unitPrice,
    purchasedValue: totalPurchased * unitPrice,
    percentage: totalQty > 0 ? (totalPurchased / totalQty) * 100 : 0
  };
};

/**
 * Calculate PO item total
 */
export const calculateItemTotal = (quantity, unitPrice) => {
  const qty = parseFloat(quantity) || 0;
  const price = parseFloat(unitPrice) || 0;
  return qty * price;
};

/**
 * Calculate purchase progress for a RAB item
 */
export const calculatePurchaseProgress = (totalQuantity, purchasedQuantity) => {
  const total = parseFloat(totalQuantity) || 0;
  const purchased = parseFloat(purchasedQuantity) || 0;
  
  if (total === 0) return 0;
  
  const percentage = (purchased / total) * 100;
  return Math.min(100, Math.max(0, percentage));
};

/**
 * Calculate available quantity for ordering
 */
export const calculateAvailableQuantity = (rabItem) => {
  const totalQty = parseFloat(rabItem.quantity) || 0;
  const totalPurchased = parseFloat(rabItem.totalPurchased) || 0;
  const pendingOrders = parseFloat(rabItem.pendingOrders) || 0;
  
  return Math.max(0, totalQty - totalPurchased - pendingOrders);
};

/**
 * Validate if quantity can be ordered
 */
export const canOrderQuantity = (rabItem, requestedQuantity) => {
  const available = calculateAvailableQuantity(rabItem);
  const requested = parseFloat(requestedQuantity) || 0;
  
  return requested > 0 && requested <= available;
};

/**
 * Calculate PO summary statistics
 */
export const calculatePOSummary = (purchaseOrders) => {
  if (!purchaseOrders || !Array.isArray(purchaseOrders)) {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      totalValue: 0,
      pendingValue: 0,
      approvedValue: 0
    };
  }
  
  return purchaseOrders.reduce((acc, po) => {
    const value = parseFloat(po.totalAmount || po.total_amount) || 0;
    const status = po.status?.toLowerCase() || 'pending';
    
    acc.total++;
    acc.totalValue += value;
    
    if (status === 'pending' || status === 'draft') {
      acc.pending++;
      acc.pendingValue += value;
    } else if (status === 'approved') {
      acc.approved++;
      acc.approvedValue += value;
    } else if (status === 'rejected') {
      acc.rejected++;
    }
    
    return acc;
  }, {
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalValue: 0,
    pendingValue: 0,
    approvedValue: 0
  });
};

/**
 * Calculate discount amount
 */
export const calculateDiscount = (subtotal, discountPercent = 0) => {
  const amount = parseFloat(subtotal) || 0;
  const discount = parseFloat(discountPercent) || 0;
  
  return (amount * discount) / 100;
};

/**
 * Calculate final amount with discount
 */
export const calculateFinalAmount = (subtotal, discountPercent = 0, tax = 0) => {
  const amount = parseFloat(subtotal) || 0;
  const discount = calculateDiscount(amount, discountPercent);
  const afterDiscount = amount - discount;
  const taxAmount = (afterDiscount * tax) / 100;
  
  return afterDiscount + taxAmount;
};
