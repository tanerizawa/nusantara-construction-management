// Form Utility Functions

// Generate unique ID for form elements
export const generateId = (prefix = 'form-element') => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

// Combine CSS classes
export const combineClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Get state classes based on error, success, disabled states
export const getStateClasses = (error, success, disabled, variant = 'default') => {
  if (disabled) return 'bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200';
  if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
  if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
  
  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    minimal: 'border-0 border-b-2 border-gray-300 focus:border-blue-500 rounded-none bg-transparent',
    filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500',
    outlined: 'border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500'
  };
  
  return variants[variant] || variants.default;
};

// Format file size for display
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if file is image
export const isImageFile = (file) => {
  return file && file.type && file.type.startsWith('image/');
};

// Check if file type is accepted
export const isFileTypeAccepted = (file, acceptedTypes) => {
  if (!acceptedTypes || acceptedTypes === '*/*') return true;
  
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  // Check MIME type
  if (acceptedTypes.includes(fileType)) return true;
  
  // Check file extensions
  const extensions = acceptedTypes.match(/\.\w+/g) || [];
  return extensions.some(ext => fileName.endsWith(ext.toLowerCase()));
};

// Validate file constraints
export const validateFile = (file, constraints = {}) => {
  const errors = [];
  
  if (constraints.maxSize && file.size > constraints.maxSize) {
    errors.push(`File terlalu besar. Maksimal ${formatFileSize(constraints.maxSize)}`);
  }
  
  if (constraints.minSize && file.size < constraints.minSize) {
    errors.push(`File terlalu kecil. Minimal ${formatFileSize(constraints.minSize)}`);
  }
  
  if (constraints.acceptedTypes && !isFileTypeAccepted(file, constraints.acceptedTypes)) {
    errors.push('Tipe file tidak didukung');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Debounce function for input validation
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function for frequent events
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Auto-resize textarea
export const autoResizeTextarea = (textarea, maxRows = 20) => {
  if (!textarea) return;
  
  // Reset height to auto to get the correct scrollHeight
  textarea.style.height = 'auto';
  
  // Calculate new height
  const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight);
  const rows = Math.ceil(textarea.scrollHeight / lineHeight);
  const newRows = Math.min(rows, maxRows);
  
  textarea.style.height = `${newRows * lineHeight}px`;
};

// Format input value based on type
export const formatInputValue = (value, type) => {
  if (!value) return value;
  
  switch (type) {
    case 'tel':
      // Format phone number (simple Indonesian format)
      return value.replace(/\D/g, '').replace(/(\d{4})(\d{4})(\d{4})/, '$1-$2-$3');
    
    case 'number':
      // Ensure numeric value
      return value.replace(/[^\d.-]/g, '');
    
    case 'currency':
      // Format currency (Indonesian Rupiah)
      const numericValue = value.replace(/[^\d]/g, '');
      return new Intl.NumberFormat('id-ID').format(numericValue);
    
    case 'uppercase':
      return value.toUpperCase();
    
    case 'lowercase':
      return value.toLowerCase();
    
    case 'capitalize':
      return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    
    default:
      return value;
  }
};

// Parse formatted value back to raw value
export const parseInputValue = (formattedValue, type) => {
  if (!formattedValue) return formattedValue;
  
  switch (type) {
    case 'tel':
      return formattedValue.replace(/\D/g, '');
    
    case 'currency':
      return formattedValue.replace(/[^\d]/g, '');
    
    default:
      return formattedValue;
  }
};

// Generate form data for API submission
export const prepareFormData = (formValues, fileFields = []) => {
  const formData = new FormData();
  
  Object.entries(formValues).forEach(([key, value]) => {
    if (fileFields.includes(key)) {
      // Handle file fields
      if (value instanceof FileList) {
        Array.from(value).forEach((file, index) => {
          formData.append(`${key}[${index}]`, file);
        });
      } else if (value instanceof File) {
        formData.append(key, value);
      }
    } else if (Array.isArray(value)) {
      // Handle array values
      value.forEach((item, index) => {
        formData.append(`${key}[${index}]`, item);
      });
    } else if (value !== null && value !== undefined) {
      // Handle regular values
      formData.append(key, value);
    }
  });
  
  return formData;
};

// Deep clone object (for form state management)
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (typeof obj === 'object') {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
};

// Get nested object value by path
export const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

// Set nested object value by path
export const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
};

// Check if value is empty (for validation)
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};