import { useState, useCallback } from 'react';
import { INITIAL_ACCOUNT_FORM } from '../config/accountFormConfig';
import { createAccount } from '../services/accountService';
import { isAccountCodeUnique } from '../utils/accountHelpers';

export const useAccountForm = (accounts, onSuccess) => {
  const [formData, setFormData] = useState(INITIAL_ACCOUNT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Handle form field changes
  const handleFormChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  }, [errors]);

  // Validate form data
  const validateForm = useCallback(() => {
    const newErrors = {};

    // Required field validations
    if (!formData.accountCode.trim()) {
      newErrors.accountCode = 'Account code is required';
    } else if (!isAccountCodeUnique(accounts, formData.accountCode)) {
      newErrors.accountCode = 'Account code already exists';
    }

    if (!formData.accountName.trim()) {
      newErrors.accountName = 'Account name is required';
    }

    if (!formData.accountType) {
      newErrors.accountType = 'Account type is required';
    }

    if (!formData.normalBalance) {
      newErrors.normalBalance = 'Normal balance is required';
    }

    if (!formData.level || formData.level < 1 || formData.level > 4) {
      newErrors.level = 'Level must be between 1 and 4';
    }

    // Parent account validation
    if (formData.parentAccountId && formData.level <= 1) {
      newErrors.parentAccountId = 'Parent account not allowed for level 1 accounts';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [accounts, formData]);

  // Submit form
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await createAccount(formData);
      
      if (result.success) {
        // Reset form
        setFormData(INITIAL_ACCOUNT_FORM);
        setErrors({});
        
        // Call success callback
        if (onSuccess) {
          onSuccess(result);
        }
      } else {
        setErrors({ submit: result.error });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to create account. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, onSuccess]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_ACCOUNT_FORM);
    setErrors({});
  }, []);

  // Update form data programmatically
  const updateFormData = useCallback((updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  return {
    formData,
    errors,
    isSubmitting,
    handleFormChange,
    handleSubmit,
    resetForm,
    updateFormData,
    validateForm
  };
};