/**
 * Form Validation
 * Comprehensive validation rules for project creation
 */

/**
 * Validate project creation form
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation errors object
 */
export const validateProjectForm = (formData) => {
  const newErrors = {};
  
  console.log('Validating form data:', {
    name: formData.name,
    company: formData.client.company,
    startDate: formData.timeline.startDate,
    endDate: formData.timeline.endDate,
    budget: formData.budget.contractValue,
    subsidiary: formData.subsidiary.id
  });
  
  // Required field: Project name
  if (!formData.name.trim()) {
    newErrors.name = 'Nama proyek harus diisi';
    console.log('❌ Name validation failed');
  }
  
  // Required field: Client company
  if (!formData.client.company.trim()) {
    newErrors['client.company'] = 'Nama perusahaan klien harus diisi';
    console.log('❌ Client company validation failed');
  }
  
  // Required field: Start date
  if (!formData.timeline.startDate) {
    newErrors['timeline.startDate'] = 'Tanggal mulai harus diisi';
    console.log('❌ Start date validation failed');
  }
  
  // Required field: End date
  if (!formData.timeline.endDate) {
    newErrors['timeline.endDate'] = 'Tanggal selesai harus diisi';
    console.log('❌ End date validation failed');
  }
  
  // Date range validation
  if (formData.timeline.startDate && formData.timeline.endDate) {
    if (new Date(formData.timeline.startDate) >= new Date(formData.timeline.endDate)) {
      newErrors['timeline.endDate'] = 'Tanggal selesai harus setelah tanggal mulai';
      console.log('❌ Date range validation failed');
    }
  }
  
  // Budget validation
  if (!formData.budget.contractValue || formData.budget.contractValue <= 0) {
    newErrors['budget.contractValue'] = 'Nilai kontrak harus lebih dari 0';
    console.log('❌ Budget validation failed:', formData.budget.contractValue);
  }
  
  // Required field: Subsidiary
  if (!formData.subsidiary.id) {
    newErrors.subsidiary = 'Anak perusahaan yang menjalankan proyek harus dipilih';
    console.log('❌ Subsidiary validation failed');
  }
  
  console.log('Validation errors found:', newErrors);
  
  const isValid = Object.keys(newErrors).length === 0;
  console.log('Form validation result:', isValid ? '✅ VALID' : '❌ INVALID');
  
  return newErrors;
};

/**
 * Check if form has validation errors
 * @param {Object} errors - Errors object from validation
 * @returns {boolean} True if form is valid
 */
export const isFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};
