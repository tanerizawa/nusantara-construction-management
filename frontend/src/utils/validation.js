import React, { useState } from 'react';

// Validation utilities
export const validators = {
  required: (value) => value ? '' : 'This field is required',
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value) ? '' : 'Please enter a valid email address';
  },
  
  phone: (value) => {
    const phoneRegex = /^(\+62|62|0)8[1-9][0-9]{6,9}$/;
    return phoneRegex.test(value) ? '' : 'Please enter a valid Indonesian phone number';
  },
  
  currency: (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0 ? '' : 'Please enter a valid amount';
  },
  
  percentage: (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= 0 && numValue <= 100 
      ? '' : 'Please enter a percentage between 0 and 100';
  },
  
  minLength: (min) => (value) => 
    value && value.length >= min ? '' : `Minimum ${min} characters required`,
  
  maxLength: (max) => (value) => 
    value && value.length <= max ? '' : `Maximum ${max} characters allowed`,
  
  minValue: (min) => (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue >= min ? '' : `Minimum value is ${min}`;
  },
  
  maxValue: (max) => (value) => {
    const numValue = parseFloat(value);
    return !isNaN(numValue) && numValue <= max ? '' : `Maximum value is ${max}`;
  }
};

// Form validation hook
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
    const rules = validationRules[name];
    if (!rules) return '';

    for (const rule of rules) {
      const error = rule(value);
      if (error) return error;
    }
    return '';
  };

  const validateAll = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    isValid: Object.keys(errors).length === 0
  };
};

// Error boundary dan error handling utilities
export const ErrorTypes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const getErrorType = (error) => {
  if (error.response) {
    const status = error.response.status;
    if (status === 401 || status === 403) return ErrorTypes.AUTH_ERROR;
    if (status >= 400 && status < 500) return ErrorTypes.VALIDATION_ERROR;
    if (status >= 500) return ErrorTypes.SERVER_ERROR;
  }
  if (error.request) return ErrorTypes.NETWORK_ERROR;
  return ErrorTypes.UNKNOWN_ERROR;
};

export const getErrorMessage = (error) => {
  const errorType = getErrorType(error);
  
  switch (errorType) {
    case ErrorTypes.NETWORK_ERROR:
      return 'Network error. Please check your internet connection.';
    case ErrorTypes.AUTH_ERROR:
      return 'Authentication failed. Please login again.';
    case ErrorTypes.VALIDATION_ERROR:
      return error.response?.data?.message || 'Invalid data provided.';
    case ErrorTypes.SERVER_ERROR:
      return 'Server error. Please try again later.';
    default:
      return 'An unexpected error occurred.';
  }
};

// Notification utilities
export const NotificationTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const showNotification = (type, message, options = {}) => {
  const defaultOptions = {
    duration: 4000,
    position: 'top-right',
    ...options
  };

  // Menggunakan react-hot-toast untuk notifikasi
  const toast = require('react-hot-toast').toast;
  
  switch (type) {
    case NotificationTypes.SUCCESS:
      return toast.success(message, defaultOptions);
    case NotificationTypes.ERROR:
      return toast.error(message, defaultOptions);
    case NotificationTypes.WARNING:
      return toast(message, { 
        icon: '⚠️',
        ...defaultOptions 
      });
    case NotificationTypes.INFO:
      return toast(message, { 
        icon: 'ℹ️',
        ...defaultOptions 
      });
    default:
      return toast(message, defaultOptions);
  }
};

// Async error handler
export const handleAsyncError = async (asyncFn, fallback = null) => {
  try {
    return await asyncFn();
  } catch (error) {
    console.error('Async Error:', error);
    const message = getErrorMessage(error);
    showNotification(NotificationTypes.ERROR, message);
    return fallback;
  }
};

// Input validation component
export const ValidatedInput = ({ 
  name, 
  value, 
  error, 
  touched, 
  onChange, 
  onBlur, 
  label, 
  type = 'text',
  placeholder,
  required = false,
  ...props 
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={(e) => onChange(name, e.target.value)}
        onBlur={() => onBlur(name)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          touched && error 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300'
        }`}
        {...props}
      />
      {touched && error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

const validationUtils = {
  validators,
  useFormValidation,
  ErrorTypes,
  getErrorType,
  getErrorMessage,
  NotificationTypes,
  showNotification,
  handleAsyncError,
  ValidatedInput
};

export default validationUtils;
