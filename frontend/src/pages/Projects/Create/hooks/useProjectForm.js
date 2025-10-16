import { useState, useCallback } from 'react';
import { getInitialFormData, handleNestedFieldChange } from '../utils/formHelpers';

/**
 * Custom hook for project form state management
 * @returns {Object} Form state and handlers
 */
const useProjectForm = () => {
  const [formData, setFormData] = useState(getInitialFormData());
  const [errors, setErrors] = useState({});

  /**
   * Handle input change for any form field
   */
  const handleInputChange = useCallback((field, value) => {
    handleNestedFieldChange(field, value, setFormData, errors, setErrors);
  }, [errors]);

  /**
   * Update subsidiary information
   */
  const updateSubsidiary = useCallback((subsidiary) => {
    setFormData(prev => ({
      ...prev,
      subsidiary: {
        id: subsidiary.id,
        code: subsidiary.code,
        name: subsidiary.name
      }
    }));
    
    // Clear subsidiary error
    setErrors(prev => ({
      ...prev,
      subsidiary: ''
    }));
  }, []);

  /**
   * Clear subsidiary selection
   */
  const clearSubsidiary = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      subsidiary: { id: '', name: '', code: '' }
    }));
  }, []);

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setFormData(getInitialFormData());
    setErrors({});
  }, []);

  return {
    formData,
    errors,
    setErrors,
    handleInputChange,
    updateSubsidiary,
    clearSubsidiary,
    resetForm
  };
};

export default useProjectForm;
