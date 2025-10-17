/**
 * Budget validation utilities
 * Form validation and data validation helpers
 */

/**
 * Validate actual cost input
 */
export const validateActualCost = (data) => {
  const errors = {};

  if (!data.rabItemId) {
    errors.rabItemId = 'Pilih item RAB terlebih dahulu';
  }

  if (!data.quantity || data.quantity <= 0) {
    errors.quantity = 'Kuantitas harus lebih dari 0';
  }

  if (!data.unitPrice || data.unitPrice <= 0) {
    errors.unitPrice = 'Harga satuan harus lebih dari 0';
  }

  if (!data.totalAmount || data.totalAmount <= 0) {
    errors.totalAmount = 'Total biaya harus lebih dari 0';
  }

  // Validate calculation
  const calculatedTotal = (parseFloat(data.quantity) || 0) * (parseFloat(data.unitPrice) || 0);
  if (data.totalAmount && Math.abs(parseFloat(data.totalAmount) - calculatedTotal) > 0.01) {
    errors.totalAmount = 'Total tidak sesuai dengan kuantitas × harga satuan';
  }

  if (!data.purchaseDate) {
    errors.purchaseDate = 'Tanggal pembelian harus diisi';
  } else {
    const purchaseDate = new Date(data.purchaseDate);
    const today = new Date();
    if (purchaseDate > today) {
      errors.purchaseDate = 'Tanggal pembelian tidak boleh di masa depan';
    }
  }

  if (data.poNumber && data.poNumber.length > 50) {
    errors.poNumber = 'Nomor PO terlalu panjang (maksimal 50 karakter)';
  }

  if (data.notes && data.notes.length > 500) {
    errors.notes = 'Catatan terlalu panjang (maksimal 500 karakter)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate additional expense input
 */
export const validateAdditionalExpense = (data) => {
  const errors = {};

  if (!data.expenseType) {
    errors.expenseType = 'Pilih jenis pengeluaran';
  }

  const validExpenseTypes = [
    'kasbon', 'overtime', 'emergency', 'transportation',
    'accommodation', 'meals', 'equipment_rental', 'repair',
    'miscellaneous', 'other'
  ];

  if (data.expenseType && !validExpenseTypes.includes(data.expenseType)) {
    errors.expenseType = 'Jenis pengeluaran tidak valid';
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Deskripsi harus diisi';
  }

  if (data.description && data.description.length > 500) {
    errors.description = 'Deskripsi terlalu panjang (maksimal 500 karakter)';
  }

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Jumlah harus lebih dari 0';
  }

  if (data.amount && data.amount > 1000000000) {
    errors.amount = 'Jumlah terlalu besar (maksimal Rp 1 Miliar)';
  }

  if (!data.recipientName || data.recipientName.trim() === '') {
    errors.recipientName = 'Nama penerima harus diisi';
  }

  if (data.recipientName && data.recipientName.length > 255) {
    errors.recipientName = 'Nama penerima terlalu panjang (maksimal 255 karakter)';
  }

  if (!data.expenseDate) {
    errors.expenseDate = 'Tanggal pengeluaran harus diisi';
  } else {
    const expenseDate = new Date(data.expenseDate);
    const today = new Date();
    if (expenseDate > today) {
      errors.expenseDate = 'Tanggal pengeluaran tidak boleh di masa depan';
    }
  }

  if (data.receiptUrl && !isValidUrl(data.receiptUrl)) {
    errors.receiptUrl = 'URL bukti tidak valid';
  }

  if (data.paymentMethod) {
    const validPaymentMethods = ['cash', 'transfer', 'check', 'credit_card', 'other'];
    if (!validPaymentMethods.includes(data.paymentMethod)) {
      errors.paymentMethod = 'Metode pembayaran tidak valid';
    }
  }

  if (data.notes && data.notes.length > 1000) {
    errors.notes = 'Catatan terlalu panjang (maksimal 1000 karakter)';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate URL format
 */
const isValidUrl = (string) => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Sanitize input data
 */
export const sanitizeActualCostData = (data) => {
  return {
    rabItemId: data.rabItemId?.trim(),
    quantity: parseFloat(data.quantity) || 0,
    unitPrice: parseFloat(data.unitPrice) || 0,
    totalAmount: parseFloat(data.totalAmount) || 0,
    poNumber: data.poNumber?.trim() || null,
    purchaseDate: data.purchaseDate,
    notes: data.notes?.trim() || null
  };
};

/**
 * Sanitize expense data
 */
export const sanitizeExpenseData = (data) => {
  return {
    expenseType: data.expenseType,
    description: data.description?.trim(),
    amount: parseFloat(data.amount) || 0,
    recipientName: data.recipientName?.trim(),
    paymentMethod: data.paymentMethod || null,
    expenseDate: data.expenseDate,
    receiptUrl: data.receiptUrl?.trim() || null,
    notes: data.notes?.trim() || null,
    milestoneId: data.milestoneId || null,
    rabItemId: data.rabItemId || null
  };
};

/**
 * Check if amount requires approval
 */
export const requiresApproval = (amount, threshold = 10000000) => {
  return parseFloat(amount) >= threshold;
};

/**
 * Format form errors for display
 */
export const formatFormErrors = (errors) => {
  return Object.entries(errors).map(([field, message]) => ({
    field,
    message
  }));
};

/**
 * Validate date range
 */
export const validateDateRange = (startDate, endDate) => {
  const errors = {};

  if (!startDate) {
    errors.startDate = 'Tanggal mulai harus diisi';
  }

  if (!endDate) {
    errors.endDate = 'Tanggal akhir harus diisi';
  }

  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      errors.dateRange = 'Tanggal mulai tidak boleh lebih besar dari tanggal akhir';
    }

    // Check if range is too large (> 1 year)
    const oneYear = 365 * 24 * 60 * 60 * 1000;
    if (end - start > oneYear) {
      errors.dateRange = 'Rentang tanggal maksimal 1 tahun';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validate search/filter input
 */
export const validateSearchFilter = (filters) => {
  const errors = {};

  if (filters.minAmount && filters.maxAmount) {
    if (parseFloat(filters.minAmount) > parseFloat(filters.maxAmount)) {
      errors.amount = 'Jumlah minimum tidak boleh lebih besar dari maksimum';
    }
  }

  if (filters.startDate && filters.endDate) {
    const dateValidation = validateDateRange(filters.startDate, filters.endDate);
    if (!dateValidation.isValid) {
      Object.assign(errors, dateValidation.errors);
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Check if user can edit expense
 */
export const canEditExpense = (expense, currentUser) => {
  // Can't edit approved expenses (unless admin)
  if (expense.approvalStatus === 'approved' && !currentUser.isAdmin) {
    return false;
  }

  // Can't edit rejected/cancelled expenses
  if (['rejected', 'cancelled'].includes(expense.approvalStatus)) {
    return false;
  }

  // Can edit own pending expenses
  if (expense.approvalStatus === 'pending' && expense.createdBy === currentUser.id) {
    return true;
  }

  // Admin can edit anything
  if (currentUser.isAdmin) {
    return true;
  }

  return false;
};

/**
 * Check if user can delete expense
 */
export const canDeleteExpense = (expense, currentUser) => {
  // Same rules as edit
  return canEditExpense(expense, currentUser);
};

/**
 * Check if user can approve expense
 */
export const canApproveExpense = (expense, currentUser) => {
  // Only pending expenses can be approved
  if (expense.approvalStatus !== 'pending') {
    return false;
  }

  // User must have approval permission
  return currentUser.canApprove || currentUser.isAdmin;
};
