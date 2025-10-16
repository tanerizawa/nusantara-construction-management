import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { subsidiaryAPI } from '../../../services/api';
import { transformAPIDataForForm, transformFormDataForAPI } from '../utils/formHelpers';

export const useSubsidiaryEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const fetchSubsidiary = async () => {
    if (!isEditing) return null;
    
    try {
      setLoading(true);
      setError(null);
      
      const response = await subsidiaryAPI.getById(id);
      
      if (response.success) {
        return transformAPIDataForForm(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch subsidiary');
      }
    } catch (err) {
      console.error('Error fetching subsidiary:', err);
      setError('Gagal memuat data anak usaha');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveSubsidiary = async (formData) => {
    try {
      setSaving(true);
      setError(null);
      
      const apiData = transformFormDataForAPI(formData);
      
      let response;
      if (isEditing) {
        response = await subsidiaryAPI.update(id, apiData);
      } else {
        response = await subsidiaryAPI.create(apiData);
      }
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to save subsidiary');
      }
    } catch (err) {
      console.error('Error saving subsidiary:', err);
      setError(isEditing ? 'Gagal memperbarui data anak usaha' : 'Gagal membuat anak usaha baru');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const deleteSubsidiary = async () => {
    if (!isEditing) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await subsidiaryAPI.delete(id);
      
      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to delete subsidiary');
      }
    } catch (err) {
      console.error('Error deleting subsidiary:', err);
      setError('Gagal menghapus anak usaha');
      throw err;
    } finally {
      setSaving(false);
    }
  };

  const navigateToList = () => {
    navigate('/subsidiaries');
  };

  const navigateToDetail = (subsidiaryId) => {
    navigate(`/subsidiaries/${subsidiaryId}`);
  };

  return {
    isEditing,
    loading,
    saving,
    error,
    fetchSubsidiary,
    saveSubsidiary,
    deleteSubsidiary,
    navigateToList,
    navigateToDetail,
    clearError: () => setError(null)
  };
};