/**
 * RAB Form Validation Utilities
 */

export const validateRABForm = (formData) => {
  const errors = {};
  
  // Item Type validation (REQUIRED)
  const validItemTypes = ['material', 'service', 'labor', 'equipment', 'overhead'];
  if (!formData.itemType?.trim()) {
    errors.itemType = 'Tipe item harus dipilih';
  } else if (!validItemTypes.includes(formData.itemType)) {
    errors.itemType = 'Tipe item tidak valid';
  }
  
  if (!formData.category?.trim()) {
    errors.category = 'Kategori harus dipilih';
  }
  
  if (!formData.description?.trim()) {
    errors.description = 'Deskripsi pekerjaan harus diisi';
  } else if (formData.description.trim().length < 10) {
    errors.description = 'Deskripsi minimal 10 karakter';
  }
  
  if (!formData.unit?.trim()) {
    errors.unit = 'Satuan harus dipilih';
  }
  
  if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
    errors.quantity = 'Quantity harus lebih dari 0';
  }
  
  if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
    errors.unitPrice = 'Harga satuan harus lebih dari 0';
  }
  
  return errors;
};

export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
