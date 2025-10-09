/**
 * Summary calculations for Tanda Terima
 */

export const calculateSummary = (receipts) => {
  return {
    total: receipts.length,
    pending: receipts.filter(r => r.status === 'pending_delivery').length,
    received: receipts.filter(r => r.status === 'received' || r.status === 'completed').length,
    rejected: receipts.filter(r => r.status === 'rejected').length
  };
};

export const filterReceipts = (receipts, searchTerm, statusFilter) => {
  return receipts.filter(receipt => {
    const matchesSearch = !searchTerm || 
      receipt.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.purchaseOrder?.poNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      receipt.purchaseOrder?.supplierName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
};
