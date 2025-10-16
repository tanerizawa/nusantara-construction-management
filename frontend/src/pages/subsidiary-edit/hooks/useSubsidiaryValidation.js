import { useState } from 'react';
import { validateFormData, validateField } from '../config/validationRules';

export const useSubsidiaryValidation = (formData) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateForm = () => {
    const validation = validateFormData(formData);
    setErrors(validation.errors);
    return validation.isValid;
  };

  const validateSingleField = (fieldPath, value) => {
    const error = validateField(fieldPath, value, formData);
    
    setErrors(prev => ({
      ...prev,
      [fieldPath]: error
    }));

    return !error;
  };

  const clearFieldError = (fieldPath) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldPath];
      return newErrors;
    });
  };

  const clearAllErrors = () => {
    setErrors({});
    setTouched({});
  };

  const markFieldAsTouched = (fieldPath) => {
    setTouched(prev => ({
      ...prev,
      [fieldPath]: true
    }));
  };

  const getFieldError = (fieldPath) => {
    return errors[fieldPath];
  };

  const hasFieldError = (fieldPath) => {
    return Boolean(errors[fieldPath]);
  };

  const isFieldTouched = (fieldPath) => {
    return Boolean(touched[fieldPath]);
  };

  const hasErrors = () => {
    return Object.keys(errors).length > 0;
  };

  return {
    errors,
    touched,
    validateForm,
    validateSingleField,
    clearFieldError,
    clearAllErrors,
    markFieldAsTouched,
    getFieldError,
    hasFieldError,
    isFieldTouched,
    hasErrors
  };
};