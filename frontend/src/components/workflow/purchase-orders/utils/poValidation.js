/**
 * Purchase Order Validation Utilities
 * Handles validation logic for PO creation and updates
 */

/**
 * Validate PO basic data
 */
export const validatePOData = (poData) => {
  const errors = [];
  
  // Validate supplier info
  if (!poData.supplierName || poData.supplierName.trim() === '') {
    errors.push('Nama supplier harus diisi');
  }
  
  // Note: supplierContact and supplierAddress are in notes field
  // Backend doesn't have separate fields for these
  
  // Validate delivery date
  if (!poData.expectedDeliveryDate) {
    errors.push('Tanggal pengiriman harus diisi');
  } else {
    const deliveryDate = new Date(poData.expectedDeliveryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (deliveryDate < today) {
      errors.push('Tanggal pengiriman tidak boleh di masa lalu');
    }
  }
  
  // Validate items
  if (!poData.items || !Array.isArray(poData.items) || poData.items.length === 0) {
    errors.push('Minimal harus ada 1 item dalam PO');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate RAB item quantity for ordering
 */
export const validateRABQuantity = (rabItem, requestedQuantity) => {
  const errors = [];
  
  const totalQty = parseFloat(rabItem.quantity) || 0;
  const totalPurchased = parseFloat(rabItem.totalPurchased) || 0;
  const requested = parseFloat(requestedQuantity) || 0;
  const availableQty = totalQty - totalPurchased;
  
  if (requested <= 0) {
    errors.push('Jumlah harus lebih dari 0');
  }
  
  if (requested > availableQty) {
    errors.push(`Jumlah melebihi yang tersedia (${availableQty} ${rabItem.unit || 'unit'})`);
  }
  
  // Check if item is approved
  if (!rabItem.isApproved && !rabItem.is_approved) {
    errors.push('Item RAB belum disetujui');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    availableQuantity: availableQty
  };
};

/**
 * Validate supplier contact format
 */
export const validateSupplierContact = (contact) => {
  const errors = [];
  
  if (!contact || contact.trim() === '') {
    errors.push('Kontak supplier harus diisi');
    return { isValid: false, errors };
  }
  
  // Check if it's a valid phone number (Indonesian format)
  const phoneRegex = /^(\+62|62|0)[0-9]{9,12}$/;
  const cleanContact = contact.replace(/[\s-]/g, '');
  
  if (!phoneRegex.test(cleanContact)) {
    errors.push('Format nomor telepon tidak valid');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate PO items array
 */
export const validatePOItems = (items) => {
  const errors = [];
  
  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Minimal harus ada 1 item dalam PO');
    return { isValid: false, errors };
  }
  
  items.forEach((item, index) => {
    const itemErrors = [];
    
    // Check inventoryId (required by backend)
    if (!item.inventoryId) {
      itemErrors.push(`Item ${index + 1}: Inventory ID tidak valid`);
    }
    
    const quantity = parseFloat(item.quantity);
    if (!quantity || quantity <= 0) {
      itemErrors.push(`Item ${index + 1}: Jumlah harus lebih dari 0`);
    }
    
    const unitPrice = parseFloat(item.unitPrice || item.unit_price);
    if (!unitPrice || unitPrice <= 0) {
      itemErrors.push(`Item ${index + 1}: Harga satuan harus lebih dari 0`);
    }
    
    if (itemErrors.length > 0) {
      errors.push(...itemErrors);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate delivery date
 */
export const validateDeliveryDate = (dateString) => {
  const errors = [];
  
  if (!dateString) {
    errors.push('Tanggal pengiriman harus diisi');
    return { isValid: false, errors };
  }
  
  const deliveryDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (isNaN(deliveryDate.getTime())) {
    errors.push('Format tanggal tidak valid');
  } else if (deliveryDate < today) {
    errors.push('Tanggal pengiriman tidak boleh di masa lalu');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validate complete PO before submission
 */
export const validateCompletePO = (poData) => {
  const allErrors = [];
  
  // Validate basic data
  const basicValidation = validatePOData(poData);
  if (!basicValidation.isValid) {
    allErrors.push(...basicValidation.errors);
  }
  
  // Validate items
  const itemsValidation = validatePOItems(poData.items);
  if (!itemsValidation.isValid) {
    allErrors.push(...itemsValidation.errors);
  }
  
  // Note: supplierContact is embedded in notes field, not a separate field
  // Backend schema doesn't have supplierContact field
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};

/**
 * Check if RAB item can be added to PO
 */
export const canAddItemToPO = (rabItem, currentPOItems = []) => {
  const errors = [];
  
  // Check if item is already in PO
  const existingItem = currentPOItems.find(item => 
    item.rabItemId === rabItem.id
  );
  
  if (existingItem) {
    errors.push('Item sudah ada dalam PO ini');
  }
  
  // Check if item is approved
  if (!rabItem.isApproved && !rabItem.is_approved) {
    errors.push('Item RAB belum disetujui');
  }
  
  // Check if item has available quantity
  const availableQty = parseFloat(rabItem.availableQuantity || rabItem.remainingQuantity) || 0;
  if (availableQty <= 0) {
    errors.push('Item tidak memiliki stok tersedia');
  }
  
  return {
    canAdd: errors.length === 0,
    errors
  };
};
