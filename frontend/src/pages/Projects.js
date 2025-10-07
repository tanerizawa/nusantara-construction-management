import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Professional Component Imports
import Button from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import ProjectDetailModal from '../components/ui/ProjectDetailModal';
import { LoadingState, EmptyState, ErrorState } from '../components/ui/StateComponents';
import ProjectHeader from '../components/Projects/ProjectHeader';
import ProjectCard from '../components/Projects/ProjectCard';
import ProjectTable from '../components/Projects/ProjectTable';
import ProjectCategories from '../components/Projects/ProjectCategories';
import ProjectControls from '../components/Projects/ProjectControls';

// Custom Hook Imports
import useProjects from '../hooks/useProjects';
import useSubsidiaries from '../hooks/useSubsidiaries';

// Utility Imports
import { applyFilters } from '../utils/projectFilters';

/**
 * Professional Project Management Page
 * Implements React best practices with proper separation of concerns
 */
const Projects = () => {
  const navigate = useNavigate();
  
  // Professional state management with custom hooks
  const {
    projects,
    allProjects,
    loading,
    error,
    stats,
    page,
    pageSize,
    serverPagination,
    category,
    filters,
    totalPages,
    deleteProject,
    archiveProject,
    refreshProjects,
    setPage,
    setPageSize,
    setCategory,
    setSorting,
    updateFilters
  } = useProjects();

  // Subsidiary data management with dedicated hook
  const { 
    subsidiaries 
    // loadingSubsidiaries, 
    // subsidiaryError 
  } = useSubsidiaries({
    filterBy: { status: 'active' },
    includeStats: true
  });
  
  // UI State management
  const [deleteDialog, setDeleteDialog] = useState({ show: false, project: null });
  const [archiveDialog, setArchiveDialog] = useState({ show: false, project: null });
  const [detailModal, setDetailModal] = useState({ show: false, project: null });
  const [viewMode, setViewMode] = useState('grid');

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

  // Professional filtering logic using centralized utility functions
  const filteredProjects = useMemo(() => {
    return projects.filter(project => 
      applyFilters(project, { category, subsidiary: filters.subsidiary })
    );
  }, [projects, category, filters.subsidiary]);

  // Check if filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.status || filters.priority || filters.subsidiary || (category && category !== 'all');
  }, [filters, category]);

  // Handle filter reset
  const handleResetFilters = useCallback(() => {
    updateFilters({
      status: '',
      priority: '',
      sortBy: 'created_at',
      sortOrder: 'desc'
    });
    setCategory('all'); // Reset category to 'all'
  }, [updateFilters, setCategory]);

  // Handle category selection
  const handleCategorySelect = useCallback((selectedCategory) => {
    setCategory(selectedCategory);
  }, [setCategory]);

  // Handle sorting change
  const handleSortingChange = useCallback((sortBy, sortOrder) => {
    setSorting(sortBy, sortOrder);
  }, [setSorting]);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <LoadingState />
        </div>
      </div>
    );
  }

  // Professional Error State
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Professional Header with Statistics */}
        <ProjectHeader 
          stats={stats}
          onCreateProject={handleCreateProject}
        />

        {/* Compact Category Selection with Integrated Info */}
        <ProjectCategories
          projects={allProjects}
          selectedCategory={category}
          onCategorySelect={handleCategorySelect}
        />

        {/* Unified Controls - Sorting, Filtering, View Mode */}
        <ProjectControls
          filters={filters}
          onFiltersChange={updateFilters}
          currentSort={filters.sortBy}
          currentOrder={filters.sortOrder}
          onSortChange={handleSortingChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          subsidiaries={subsidiaries}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />

        {/* Professional Content Area */}
        <div className="space-y-6">
          {/* Empty State */}
          {filteredProjects.length === 0 ? (
            <EmptyState
              title={hasActiveFilters ? "Tidak ada proyek yang sesuai filter" : "Belum ada proyek"}
              description={
                hasActiveFilters 
                  ? "Coba ubah filter atau reset untuk melihat semua proyek"
                  : "Mulai dengan membuat proyek pertama Anda"
              }
              action={
                hasActiveFilters ? (
                  <Button onClick={handleResetFilters} variant="outline">
                    Reset Filter
                  </Button>
                ) : (
                  <Button onClick={handleCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Proyek Baru
                  </Button>
                )
              }
            />
          ) : (
            /* Professional Project Grid/Table */
            <div>
              {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProjects.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      viewMode={viewMode}
                      onView={handleViewProject}
                      onEdit={handleEditProject}
                      onArchive={handleArchiveProject}
                      onDelete={handleDeleteProject}
                    />
                  ))}
                </div>
              ) : (
                <ProjectTable
                  projects={filteredProjects}
                  onView={handleViewProject}
                  onEdit={handleEditProject}
                  onArchive={handleArchiveProject}
                  onDelete={handleDeleteProject}
                />
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={serverPagination.count}
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
