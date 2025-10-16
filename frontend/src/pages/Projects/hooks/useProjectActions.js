import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * Custom hook for managing project actions
 * Handles individual project operations (view, edit, delete, archive)
 */
export const useProjectActions = (deleteProject, archiveProject, refreshProjects) => {
  const navigate = useNavigate();
  
  // Dialog state for confirmations and modals
  const [dialog, setDialog] = useState({ 
    type: null, // 'delete' | 'archive' | 'detail' | 'bulkDelete' | 'bulkArchive'
    show: false, 
    project: null 
  });

  // Navigation Handlers
  const handleCreateProject = useCallback(() => {
    navigate('/admin/projects/create');
  }, [navigate]);

  const handleEditProject = useCallback((project) => {
    navigate(`/admin/projects/${project.id}/edit`);
  }, [navigate]);

  const handleViewProject = useCallback((project) => {
    navigate(`/admin/projects/${project.id}`);
  }, [navigate]);

  // Dialog Handlers
  const handleAction = useCallback((type, project) => {
    setDialog({ type, show: true, project });
  }, []);

  const handleDeleteProject = useCallback((project) => {
    handleAction('delete', project);
  }, [handleAction]);

  const handleArchiveProject = useCallback((project) => {
    handleAction('archive', project);
  }, [handleAction]);

  const handleBulkArchiveDialog = useCallback((count) => {
    setDialog({ 
      type: 'bulkArchive', 
      show: true, 
      project: { count } 
    });
  }, []);

  const handleBulkDeleteDialog = useCallback((count) => {
    setDialog({ 
      type: 'bulkDelete', 
      show: true, 
      project: { count } 
    });
  }, []);

  // Confirm Action
  const confirmAction = useCallback(async (onSuccess) => {
    if (!dialog.project) return;
    
    const actions = {
      delete: {
        fn: () => deleteProject(dialog.project.id),
        successMsg: 'Proyek berhasil dihapus',
        errorMsg: 'Gagal menghapus proyek'
      },
      archive: {
        fn: () => archiveProject(dialog.project.id),
        successMsg: 'Proyek berhasil diarsipkan',
        errorMsg: 'Gagal mengarsipkan proyek'
      }
    };

    const action = actions[dialog.type];
    if (!action) return;

    try {
      await action.fn();
      toast.success(action.successMsg);
      setDialog({ type: null, show: false, project: null });
      refreshProjects();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(`${dialog.type} failed:`, error);
      toast.error(action.errorMsg + ': ' + error.message);
    }
  }, [dialog, deleteProject, archiveProject, refreshProjects]);

  const closeDialog = useCallback(() => {
    setDialog({ type: null, show: false, project: null });
  }, []);

  // Detail Modal Handlers
  const handleDetailModalEdit = useCallback((project) => {
    setDialog({ type: null, show: false, project: null });
    navigate(`/admin/projects/${project.id}/edit`);
  }, [navigate]);

  const handleDetailModalArchive = useCallback((project) => {
    setDialog({ type: null, show: false, project: null });
    handleAction('archive', project);
  }, [handleAction]);

  const handleDetailModalDelete = useCallback((project) => {
    setDialog({ type: null, show: false, project: null });
    handleAction('delete', project);
  }, [handleAction]);

  const handleDetailModalViewFull = useCallback((project) => {
    setDialog({ type: null, show: false, project: null });
    navigate(`/admin/projects/${project.id}`);
  }, [navigate]);

  return {
    // State
    dialog,
    
    // Navigation handlers
    handleCreateProject,
    handleEditProject,
    handleViewProject,
    
    // Action handlers
    handleDeleteProject,
    handleArchiveProject,
    handleBulkArchiveDialog,
    handleBulkDeleteDialog,
    confirmAction,
    closeDialog,
    
    // Detail modal handlers
    handleDetailModalEdit,
    handleDetailModalArchive,
    handleDetailModalDelete,
    handleDetailModalViewFull,
  };
};
