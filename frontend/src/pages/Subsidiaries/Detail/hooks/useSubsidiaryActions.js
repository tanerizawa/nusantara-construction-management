import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { subsidiaryAPI } from '../../../../services/api';
import { downloadFile } from '../utils';

/**
 * Custom hook for subsidiary actions
 * Handles delete, status toggle, and file download operations
 */
export const useSubsidiaryActions = (id, subsidiary, setSubsidiary) => {
  const navigate = useNavigate();

  /**
   * Handle delete subsidiary
   */
  const handleDelete = useCallback(async () => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus ${subsidiary.name}?`)) {
      return;
    }

    try {
      const response = await subsidiaryAPI.delete(id);
      if (response.success) {
        navigate('/subsidiaries', {
          state: { message: 'Anak usaha berhasil dihapus' }
        });
      }
    } catch (error) {
      console.error('Error deleting subsidiary:', error);
      alert('Gagal menghapus anak usaha');
    }
  }, [id, subsidiary, navigate]);

  /**
   * Handle toggle subsidiary status (active/inactive)
   */
  const handleToggleStatus = useCallback(async () => {
    const newStatus = subsidiary.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
    
    if (!window.confirm(`Apakah Anda yakin ingin ${action} ${subsidiary.name}?`)) {
      return;
    }

    try {
      const response = await subsidiaryAPI.update(id, { status: newStatus });
      if (response.success) {
        setSubsidiary(prev => ({ ...prev, status: newStatus }));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Gagal mengubah status');
    }
  }, [id, subsidiary, setSubsidiary]);

  /**
   * Handle download attachment
   */
  const downloadAttachment = useCallback(async (attachmentId, filename) => {
    try {
      const response = await fetch(`/api/subsidiaries/${id}/attachments/${attachmentId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const blob = await response.blob();
        downloadFile(blob, filename);
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Gagal mendownload file');
    }
  }, [id]);

  /**
   * Handle navigate to edit page
   */
  const handleEdit = useCallback(() => {
    navigate(`/admin/subsidiaries/${id}/edit`);
  }, [id, navigate]);

  /**
   * Handle navigate back to list
   */
  const handleBack = useCallback(() => {
    navigate('/subsidiaries');
  }, [navigate]);

  return {
    handleDelete,
    handleToggleStatus,
    downloadAttachment,
    handleEdit,
    handleBack
  };
};
