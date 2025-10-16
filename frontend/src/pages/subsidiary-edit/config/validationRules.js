// Validation rules for subsidiary edit form
export const validationRules = {
  required: {
    name: 'Nama perusahaan wajib diisi',
    code: 'Kode perusahaan wajib diisi'
  },
  
  format: {
    email: 'Format email tidak valid',
    website: 'Format website tidak valid (harus dimulai dengan http:// atau https://)',
    phone: 'Format nomor telepon tidak valid'
  },
  
  length: {
    code: {
      min: 2,
      max: 10,
      message: 'Kode harus antara 2-10 karakter'
    },
    name: {
      max: 100,
      message: 'Nama tidak boleh lebih dari 100 karakter'
    }
  },
  
  range: {
    establishedYear: {
      min: 1900,
      max: new Date().getFullYear(),
      message: `Tahun harus antara 1900-${new Date().getFullYear()}`
    },
    employeeCount: {
      min: 0,
      message: 'Jumlah karyawan tidak boleh negatif'
    }
  }
};

export const validateField = (fieldPath, value, formData = {}) => {
  const [section, field] = fieldPath.includes('.') ? fieldPath.split('.') : [null, fieldPath];
  
  // Required field validation
  if (validationRules.required[field] && !value?.toString().trim()) {
    return validationRules.required[field];
  }
  
  // Skip validation if value is empty (optional fields)
  if (!value?.toString().trim()) {
    return null;
  }
  
  // Format validations
  switch (field) {
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return validationRules.format.email;
      }
      break;
      
    case 'website':
      if (!/^https?:\/\/.+\..+/.test(value)) {
        return validationRules.format.website;
      }
      break;
      
    case 'phone':
      if (!/^[\d\s\-\+\(\)]+$/.test(value)) {
        return validationRules.format.phone;
      }
      break;
  }
  
  // Length validations
  if (validationRules.length[field]) {
    const rule = validationRules.length[field];
    if (rule.min && value.length < rule.min) {
      return rule.message;
    }
    if (rule.max && value.length > rule.max) {
      return rule.message;
    }
  }
  
  // Range validations
  if (validationRules.range[field]) {
    const rule = validationRules.range[field];
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) {
      return `${field} harus berupa angka`;
    }
    
    if (rule.min !== undefined && numValue < rule.min) {
      return rule.message;
    }
    if (rule.max !== undefined && numValue > rule.max) {
      return rule.message;
    }
  }
  
  return null;
};

export const validateFormData = (formData) => {
  const errors = {};
  
  // Validate required fields
  Object.keys(validationRules.required).forEach(field => {
    const error = validateField(field, formData[field], formData);
    if (error) {
      errors[field] = error;
    }
  });
  
  // Validate optional fields if they have values
  if (formData.contactInfo?.email) {
    const error = validateField('email', formData.contactInfo.email, formData);
    if (error) {
      errors.email = error;
    }
  }
  
  if (formData.profileInfo?.website) {
    const error = validateField('website', formData.profileInfo.website, formData);
    if (error) {
      errors.website = error;
    }
  }
  
  if (formData.establishedYear) {
    const error = validateField('establishedYear', formData.establishedYear, formData);
    if (error) {
      errors.establishedYear = error;
    }
  }
  
  if (formData.employeeCount) {
    const error = validateField('employeeCount', formData.employeeCount, formData);
    if (error) {
      errors.employeeCount = error;
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};