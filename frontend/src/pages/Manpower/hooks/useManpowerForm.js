import { useState, useCallback } from 'react';
import { employeeAPI } from '../../../services/api';
import { INITIAL_FORM_DATA } from '../utils';

/**
 * Custom hook for managing employee form state and submission
 * @param {Function} onSuccess - Callback after successful employee creation
 * @returns {Object} Form state and handler functions
 */
const useManpowerForm = (onSuccess) => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingInline, setIsAddingInline] = useState(false);

  /**
   * Reset form to initial values
   */
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA);
  }, []);

  /**
   * Handle input changes
   * @param {Event} e - Form event
   */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Handle form submission
   * @param {Event} e - Form event
   */
  const handleSubmitEmployee = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    try {
      const payload = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : undefined
      };

      const result = await employeeAPI.create(payload);

      if (result.success) {
        if (onSuccess) onSuccess();
        resetForm();
        setIsAddingInline(false);
        setError(null);
      } else {
        throw new Error(result.error || 'Failed to create employee');
      }
    } catch (error) {
      console.error('Error creating employee:', error);
      setError(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    submitLoading,
    error,
    setError,
    isAddingInline,
    setIsAddingInline,
    resetForm,
    handleInputChange,
    handleSubmitEmployee,
  };
};

export default useManpowerForm;