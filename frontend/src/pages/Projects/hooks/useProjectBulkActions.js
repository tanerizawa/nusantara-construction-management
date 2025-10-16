import { useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { exportToExcel, exportToPDF } from '../../../utils/exportUtils';

/**
 * Custom hook for managing bulk project actions
 * Handles bulk selection, bulk operations (archive, delete, export)
 */
export const useProjectBulkActions = (projects, deleteProject, archiveProject, refreshProjects) => {
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Selection Handlers
  const handleSelectProject = useCallback((projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  }, []);

  const handleSelectAll = useCallback((checked, currentPageProjects) => {
    if (checked) {
      const currentPageProjectIds = currentPageProjects.map(p => p.id);
      setSelectedProjects(currentPageProjectIds);
    } else {
      setSelectedProjects([]);
    }
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedProjects([]);
  }, []);

  // Bulk Action Handlers
  const handleBulkArchive = useCallback(async (onSuccess) => {
    if (selectedProjects.length === 0) return;
    
    setBulkActionLoading(true);
    try {
      const results = await Promise.allSettled(
        selectedProjects.map(id => archiveProject(id))
      );
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failCount = results.filter(r => r.status === 'rejected').length;
      
      if (failCount > 0) {
        throw new Error(`${successCount} berhasil, ${failCount} gagal`);
      }
      
      toast.success(`${selectedProjects.length} proyek berhasil diarsipkan`);
      setSelectedProjects([]);
      refreshProjects();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Gagal mengarsipkan beberapa proyek: ' + error.message);
    } finally {
      setBulkActionLoading(false);
    }
  }, [selectedProjects, archiveProject, refreshProjects]);

  const handleBulkDelete = useCallback(async (onSuccess) => {
    if (selectedProjects.length === 0) return;
    
    setBulkActionLoading(true);
    try {
      const results = await Promise.allSettled(
        selectedProjects.map(id => deleteProject(id))
      );
      const successCount = results.filter(r => r.status === 'fulfilled').length;
      const failCount = results.filter(r => r.status === 'rejected').length;
      
      if (failCount > 0) {
        throw new Error(`${successCount} berhasil, ${failCount} gagal`);
      }
      
      toast.success(`${selectedProjects.length} proyek berhasil dihapus`);
      setSelectedProjects([]);
      refreshProjects();
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error('Gagal menghapus beberapa proyek: ' + error.message);
    } finally {
      setBulkActionLoading(false);
    }
  }, [selectedProjects, deleteProject, refreshProjects]);

  const handleBulkExportExcel = useCallback(() => {
    if (selectedProjects.length === 0) {
      toast.error('Tidak ada proyek yang dipilih');
      return;
    }

    const projectsToExport = projects.filter(p => 
      selectedProjects.includes(p.id)
    );
    
    try {
      exportToExcel(projectsToExport);
      toast.success(`${projectsToExport.length} proyek berhasil di-export ke Excel`);
    } catch (error) {
      toast.error('Gagal export proyek: ' + error.message);
    }
  }, [projects, selectedProjects]);

  const handleBulkExportPDF = useCallback(() => {
    if (selectedProjects.length === 0) {
      toast.error('Tidak ada proyek yang dipilih');
      return;
    }

    const projectsToExport = projects.filter(p => 
      selectedProjects.includes(p.id)
    );
    
    try {
      exportToPDF(projectsToExport);
      toast.success(`${projectsToExport.length} proyek berhasil di-export ke PDF`);
    } catch (error) {
      toast.error('Gagal export proyek: ' + error.message);
    }
  }, [projects, selectedProjects]);

  return {
    // State
    selectedProjects,
    bulkActionLoading,
    
    // Selection handlers
    handleSelectProject,
    handleSelectAll,
    handleClearSelection,
    
    // Bulk action handlers
    handleBulkArchive,
    handleBulkDelete,
    handleBulkExportExcel,
    handleBulkExportPDF,
  };
};
