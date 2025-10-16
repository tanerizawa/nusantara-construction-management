import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectAPI } from '../../../../services/api';
import { validateProjectForm, isFormValid } from '../utils/validation';
import { transformToAPIFormat } from '../utils/formHelpers';

/**
 * Custom hook for project submission logic
 * @param {Object} formData - Current form data
 * @param {Function} setErrors - Errors setter function
 * @returns {Object} Submit state and handlers
 */
const useProjectSubmit = (formData, setErrors) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  /**
   * Validate form before submission
   */
  const validateForm = useCallback(() => {
    const newErrors = validateProjectForm(formData);
    setErrors(newErrors);
    return isFormValid(newErrors);
  }, [formData, setErrors]);

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submit triggered');
    
    if (!validateForm()) {
      console.log('❌ Form validation failed, stopping submission');
      return;
    }
    
    console.log('✅ Validation passed, proceeding with API call');
    setLoading(true);
    
    try {
      // Transform form data to API format
      const projectData = transformToAPIFormat(formData);
      
      console.log('Creating project with data:', projectData);
      
      // Call API to create project
      const result = await projectAPI.create(projectData);
      console.log('API Response data:', result);
      
      if (result.success) {
        console.log('Project created successfully:', result.data);
        // Navigate back to projects list
        navigate('/admin/projects');
      } else {
        console.error('Failed to create project:', result.message);
        alert('Gagal membuat proyek: ' + result.message);
      }
      
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Terjadi kesalahan saat membuat proyek. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, navigate]);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    navigate('/admin/projects');
  }, [navigate]);

  return {
    loading,
    handleSubmit,
    handleBack
  };
};

export default useProjectSubmit;
