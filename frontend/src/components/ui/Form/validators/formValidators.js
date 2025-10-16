// Form Validators

import { VALIDATION_MESSAGES, PASSWORD_STRENGTH } from '../config/formConfig';

// Basic validation rules
export const validators = {
  // Required field validation
  required: (value) => {
    const isEmpty = value === null || value === undefined || 
                   (typeof value === 'string' && value.trim() === '') ||
                   (Array.isArray(value) && value.length === 0);
    
    return isEmpty ? VALIDATION_MESSAGES.required : null;
  },

  // Email validation
  email: (value) => {
    if (!value) return null;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value) ? null : VALIDATION_MESSAGES.email;
  },

  // Minimum length validation
  minLength: (min) => (value) => {
    if (!value) return null;
    return value.length >= min ? null : VALIDATION_MESSAGES.minLength(min);
  },

  // Maximum length validation
  maxLength: (max) => (value) => {
    if (!value) return null;
    return value.length <= max ? null : VALIDATION_MESSAGES.maxLength(max);
  },

  // Pattern matching validation
  pattern: (regex, message = VALIDATION_MESSAGES.pattern) => (value) => {
    if (!value) return null;
    return regex.test(value) ? null : message;
  },

  // Numeric validation
  number: (value) => {
    if (!value) return null;
    return !isNaN(value) && !isNaN(parseFloat(value)) ? null : VALIDATION_MESSAGES.number;
  },

  // Integer validation
  integer: (value) => {
    if (!value) return null;
    return Number.isInteger(Number(value)) ? null : VALIDATION_MESSAGES.integer;
  },

  // Minimum value validation
  min: (min) => (value) => {
    if (!value) return null;
    const numValue = Number(value);
    return numValue >= min ? null : VALIDATION_MESSAGES.min(min);
  },

  // Maximum value validation
  max: (max) => (value) => {
    if (!value) return null;
    const numValue = Number(value);
    return numValue <= max ? null : VALIDATION_MESSAGES.max(max);
  },

  // URL validation
  url: (value) => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return VALIDATION_MESSAGES.url;
    }
  },

  // Phone number validation (Indonesian format)
  phone: (value) => {
    if (!value) return null;
    const phoneRegex = /^(\+62|62|0)[2-9]\d{7,11}$/;
    const cleanValue = value.replace(/\D/g, '');
    return phoneRegex.test(cleanValue) ? null : VALIDATION_MESSAGES.phone;
  },

  // Date validation
  date: (value) => {
    if (!value) return null;
    const date = new Date(value);
    return !isNaN(date.getTime()) ? null : VALIDATION_MESSAGES.date;
  },

  // Time validation
  time: (value) => {
    if (!value) return null;
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value) ? null : VALIDATION_MESSAGES.time;
  },

  // Positive number validation
  positive: (value) => {
    if (!value) return null;
    const numValue = Number(value);
    return numValue > 0 ? null : VALIDATION_MESSAGES.positive;
  },

  // Negative number validation
  negative: (value) => {
    if (!value) return null;
    const numValue = Number(value);
    return numValue < 0 ? null : VALIDATION_MESSAGES.negative;
  },

  // Custom validation function
  custom: (validatorFn, message) => (value) => {
    return validatorFn(value) ? null : message;
  }
};

// Password strength validation
export const validatePasswordStrength = (password) => {
  if (!password) return { strength: 0, errors: [], passed: [] };

  const rules = PASSWORD_STRENGTH.rules;
  const errors = [];
  const passed = [];
  let strength = 0;

  // Check minimum length
  if (password.length >= PASSWORD_STRENGTH.minLength) {
    strength += rules.minLength.weight;
    passed.push('minLength');
  } else {
    errors.push(rules.minLength.message);
  }

  // Check for lowercase letters
  if (/[a-z]/.test(password)) {
    strength += rules.hasLower.weight;
    passed.push('hasLower');
  } else {
    errors.push(rules.hasLower.message);
  }

  // Check for uppercase letters
  if (/[A-Z]/.test(password)) {
    strength += rules.hasUpper.weight;
    passed.push('hasUpper');
  } else {
    errors.push(rules.hasUpper.message);
  }

  // Check for numbers
  if (/\d/.test(password)) {
    strength += rules.hasNumber.weight;
    passed.push('hasNumber');
  } else {
    errors.push(rules.hasNumber.message);
  }

  // Check for symbols
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
    strength += rules.hasSymbol.weight;
    passed.push('hasSymbol');
  } else {
    errors.push(rules.hasSymbol.message);
  }

  return {
    strength,
    errors,
    passed,
    level: PASSWORD_STRENGTH.levels[strength]
  };
};

// File validation
export const validateFile = (file, constraints = {}) => {
  const errors = [];

  if (!file) {
    if (constraints.required) {
      errors.push('File wajib dipilih');
    }
    return { isValid: errors.length === 0, errors };
  }

  // Check file size
  if (constraints.maxSize && file.size > constraints.maxSize) {
    errors.push(`File terlalu besar. Maksimal ${formatFileSize(constraints.maxSize)}`);
  }

  if (constraints.minSize && file.size < constraints.minSize) {
    errors.push(`File terlalu kecil. Minimal ${formatFileSize(constraints.minSize)}`);
  }

  // Check file type
  if (constraints.acceptedTypes && !isFileTypeAccepted(file, constraints.acceptedTypes)) {
    errors.push('Tipe file tidak didukung');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Composite validation (multiple rules)
export const validateField = (value, rules = []) => {
  for (const rule of rules) {
    const error = rule(value);
    if (error) return error;
  }
  return null;
};

// Form-level validation
export const validateForm = (formData, validationSchema) => {
  const errors = {};
  let isValid = true;

  Object.entries(validationSchema).forEach(([fieldName, fieldRules]) => {
    const fieldValue = getNestedValue(formData, fieldName);
    const fieldError = validateField(fieldValue, fieldRules);
    
    if (fieldError) {
      setNestedValue(errors, fieldName, fieldError);
      isValid = false;
    }
  });

  return { isValid, errors };
};

// Async validation wrapper
export const asyncValidator = (validatorFn) => {
  return async (value) => {
    try {
      const result = await validatorFn(value);
      return result;
    } catch (error) {
      return error.message || 'Validation error';
    }
  };
};

// Common validation schemas
export const commonSchemas = {
  // User registration schema
  userRegistration: {
    name: [validators.required, validators.minLength(2), validators.maxLength(50)],
    email: [validators.required, validators.email],
    password: [validators.required, validators.minLength(8)],
    confirmPassword: [validators.required],
    phone: [validators.phone],
    birthDate: [validators.date],
    terms: [validators.required]
  },

  // User login schema
  userLogin: {
    email: [validators.required, validators.email],
    password: [validators.required]
  },

  // Contact form schema
  contactForm: {
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    subject: [validators.required, validators.minLength(5)],
    message: [validators.required, validators.minLength(10)]
  },

  // Profile update schema
  profileUpdate: {
    name: [validators.required, validators.minLength(2)],
    email: [validators.required, validators.email],
    phone: [validators.phone],
    bio: [validators.maxLength(500)]
  },

  // Password change schema
  passwordChange: {
    currentPassword: [validators.required],
    newPassword: [validators.required, validators.minLength(8)],
    confirmNewPassword: [validators.required]
  }
};

// Helper functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isFileTypeAccepted = (file, acceptedTypes) => {
  if (!acceptedTypes || acceptedTypes === '*/*') return true;
  
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  if (acceptedTypes.includes(fileType)) return true;
  
  const extensions = acceptedTypes.match(/\.\w+/g) || [];
  return extensions.some(ext => fileName.endsWith(ext.toLowerCase()));
};

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const setNestedValue = (obj, path, value) => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
  return obj;
};