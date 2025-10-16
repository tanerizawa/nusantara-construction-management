import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { subsidiaryAPI } from '../../../services/api';
import { DEFAULT_FORM_STATE, prepareFormData } from '../utils';

/**
 * Custom hook for subsidiary form state management and submission
 * @returns {Object} Form state and handler functions
 */
const useSubsidiaryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);

  /**
   * Handle form input changes
   * @param {Event} e - Input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  /**
   * Handle form submission
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      // Prepare data - convert strings to appropriate types
      const submitData = prepareFormData(formData);

      const response = await subsidiaryAPI.create(submitData);
      
      if (response.success) {
        alert('Anak usaha berhasil dibuat');
        navigate('/subsidiaries');
      } else {
        alert('Gagal membuat anak usaha: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating subsidiary:', error);
      alert('Gagal membuat anak usaha');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    handleChange,
    handleSubmit
  };
};

export default useSubsidiaryForm;