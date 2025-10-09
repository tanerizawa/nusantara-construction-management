import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Professional Component Imports
import Button from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import ProjectDetailModal from '../components/ui/ProjectDetailModal';
import { LoadingState, EmptyState, ErrorState } from '../components/ui/StateComponents';

// Compact Components - New Information-Dense UI
import {
  CompactProjectHeader,
  CompactProjectTable
} from '../components/Projects/compact';

// Custom Hook Imports
import useProjects from '../hooks/useProjects';

/**
 * Professional Project Management Page
 * Implements React best practices with proper separation of concerns
 */
const Projects = () => {
  const navigate = useNavigate();
  
  // Professional state management with custom hooks
  const {
    projects,
    loading,
    error,
    stats,
    page,
    pageSize,
    totalPages,
    deleteProject,
    archiveProject,
    refreshProjects,
    setPage,
    setPageSize
  } = useProjects();

  // UI State management
  const [deleteDialog, setDeleteDialog] = useState({ show: false, project: null });
  const [archiveDialog, setArchiveDialog] = useState({ show: false, project: null });
  const [detailModal, setDetailModal] = useState({ show: false, project: null });
  
  // Use projects directly (already filtered by hook)
  const filteredProjects = projects;

  // Professional Event Handlers
  const handleCreateProject = useCallback(() => {
    navigate('/admin/projects/create');
  }, [navigate]);

  const handleEditProject = useCallback((project) => {
    navigate(`/admin/projects/${project.id}/edit`);
  }, [navigate]);

  const handleViewProject = useCallback((project) => {
    navigate(`/admin/projects/${project.id}`);
  }, [navigate]);

  const handleDeleteProject = useCallback((project) => {
    setDeleteDialog({ show: true, project });
  }, []);

  const handleArchiveProject = useCallback((project) => {
    setArchiveDialog({ show: true, project });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog.project) return;
    
    try {
      await deleteProject(deleteDialog.project.id);
      setDeleteDialog({ show: false, project: null });
    } catch (error) {
      console.error('Delete failed:', error);
    }
  }, [deleteDialog.project, deleteProject]);

  const confirmArchive = useCallback(async () => {
    if (!archiveDialog.project) return;
    
    try {
      await archiveProject(archiveDialog.project.id);
      setArchiveDialog({ show: false, project: null });
    } catch (error) {
      console.error('Archive failed:', error);
    }
  }, [archiveDialog.project, archiveProject]);

  // Detail Modal Action Handlers
  const handleDetailModalEdit = useCallback((project) => {
    setDetailModal({ show: false, project: null });
    navigate(`/admin/projects/${project.id}/edit`);
  }, [navigate]);

  const handleDetailModalArchive = useCallback((project) => {
    setDetailModal({ show: false, project: null });
    setArchiveDialog({ show: true, project });
  }, []);

  const handleDetailModalDelete = useCallback((project) => {
    setDetailModal({ show: false, project: null });
    setDeleteDialog({ show: true, project });
  }, []);

  const handleDetailModalViewFull = useCallback((project) => {
    setDetailModal({ show: false, project: null });
    navigate(`/admin/projects/${project.id}`);
  }, [navigate]);

  const closeDetailModal = useCallback(() => {
    setDetailModal({ show: false, project: null });
  }, []);

  // Handle pagination
  const handlePageChange = useCallback((newPage) => {
    setPage(newPage);
  }, [setPage]);

  const handlePageSizeChange = useCallback((newPageSize) => {
    setPageSize(newPageSize);
  }, [setPageSize]);

  // Professional Error Boundary Effect
  const handleRetry = useCallback(() => {
    refreshProjects();
  }, [refreshProjects]);

  // Professional Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1C1C1E]">
        <div className="container mx-auto px-4 py-8">
          <LoadingState message="Memuat proyek..." />
        </div>
      </div>
    );
  }

  // Professional Error State
  if (error) {
    return (
      <div className="min-h-screen bg-[#1C1C1E]">
        <div className="container mx-auto px-4 py-8">
          <ErrorState 
            error={error}
            onRetry={handleRetry}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <div className="container mx-auto px-4 py-6 space-y-5">
        {/* Compact Header with Statistics */}
        <CompactProjectHeader 
          stats={stats}
          onCreateProject={handleCreateProject}
        />

        {/* Professional Content Area */}
        <div className="space-y-5">
          {/* Empty State */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              title="Belum ada proyek"
              description="Mulai dengan membuat proyek pertama Anda"
              action={
                <Button onClick={handleCreateProject}>
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Proyek Baru
                </Button>
              }
            />
          ) : (
            /* Compact Project Table - Always use table view for compact design */
            <CompactProjectTable
              projects={filteredProjects}
              onView={handleViewProject}
              onEdit={handleEditProject}
              onArchive={handleArchiveProject}
              onDelete={handleDeleteProject}
            />
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={filteredProjects.length}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showInfo={true}
              size="md"
            />
          )}
        </div>

        {/* Professional Confirmation Dialogs */}
        <ConfirmationDialog
          isOpen={deleteDialog.show}
          title="Hapus Proyek"
          message={deleteDialog.project ? `Apakah Anda yakin ingin menghapus proyek "${deleteDialog.project.name}"? Tindakan ini tidak dapat dibatalkan.` : ''}
          confirmText="Hapus"
          confirmVariant="destructive"
          onConfirm={confirmDelete}
          onCancel={() => setDeleteDialog({ show: false, project: null })}
        />

        <ConfirmationDialog
          isOpen={archiveDialog.show}
          title="Arsipkan Proyek"
          message={archiveDialog.project ? `Apakah Anda yakin ingin mengarsipkan proyek "${archiveDialog.project.name}"? Proyek yang diarsipkan masih dapat dikembalikan.` : ''}
          confirmText="Arsipkan"
          confirmVariant="secondary"
          onConfirm={confirmArchive}
          onCancel={() => setArchiveDialog({ show: false, project: null })}
        />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          isOpen={detailModal.show}
          project={detailModal.project}
          onClose={closeDetailModal}
          onEdit={handleDetailModalEdit}
          onArchive={handleDetailModalArchive}
          onDelete={handleDetailModalDelete}
          onViewFull={handleDetailModalViewFull}
        />
      </div>
    </div>
  );
};

export default Projects;
