import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// Professional Component Imports
import Button from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import { LoadingState, EmptyState, ErrorState } from '../components/ui/StateComponents';
import ProjectHeader from '../components/projects/ProjectHeader';
import ProjectCard from '../components/projects/ProjectCard';
import ProjectTable from '../components/projects/ProjectTable';
import ProjectCategories from '../components/projects/ProjectCategories';
import ProjectControls from '../components/projects/ProjectControls';

// Custom Hook Imports
import useProjects from '../hooks/useProjects';
import useSubsidiaries from '../hooks/useSubsidiaries';

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
    subsidiaries, 
    loading: loadingSubsidiaries, 
    error: subsidiaryError 
  } = useSubsidiaries({
    filterBy: { status: 'active' },
    includeStats: true
  });
  
  // UI State management
  const [deleteDialog, setDeleteDialog] = useState({ show: false, project: null });
  const [archiveDialog, setArchiveDialog] = useState({ show: false, project: null });
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

  // Professional filtering logic with comprehensive subsidiary matching
  const filteredProjects = projects.filter(project => {
    // Category filtering
    if (category && category !== 'all') {
      const now = new Date();
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      const oneMonth = 30 * 24 * 60 * 60 * 1000;

      switch (category) {
        case 'critical':
          // Advanced critical project detection based on project management best practices
          let criticalScore = 0;
          
          // High priority projects get base score
          if (project.priority === 'high') {
            criticalScore += 3;
          }
          
          // Active projects (in progress) are more critical
          if (project.status === 'active' || project.status === 'in_progress') {
            criticalScore += 2;
          }
          
          // Projects with upcoming deadlines (within 6 months) are critical
          if (project.endDate) {
            const endDate = new Date(project.endDate);
            const daysToDeadline = Math.floor((endDate - now) / (24 * 60 * 60 * 1000));
            
            if (daysToDeadline <= 0) {
              // Overdue projects are extremely critical
              criticalScore += 5;
            } else if (daysToDeadline <= 180) {
              // Projects within 6 months are critical
              criticalScore += 2;
            }
          }
          
          // A project is critical if score >= 5 (combination of factors)
          const isCritical = criticalScore >= 5;
          if (!isCritical) return false;
          break;
        case 'recent':
          const createdDate = new Date(project.createdAt);
          const isRecent = (now - createdDate) <= oneWeek;
          if (!isRecent) return false;
          break;
        case 'deadline':
          if (!project.endDate) return false;
          const endDate = new Date(project.endDate);
          const isNearDeadline = (endDate - now) <= oneMonth && endDate > now;
          if (!isNearDeadline) return false;
          break;
        case 'in_progress':
          if (project.status !== 'in_progress') return false;
          break;
        case 'completed':
          if (project.status !== 'completed') return false;
          break;
        case 'planning':
          if (project.status !== 'planning') return false;
          break;
        case 'on_hold':
          if (project.status !== 'on_hold') return false;
          break;
        default:
          break;
      }
    }

    // Subsidiary filtering
    const subsidiaryMatch = !filters.subsidiary || 
      project.subsidiaryId === filters.subsidiary ||
      project.subsidiary?.id === filters.subsidiary ||
      project.subsidiary?.code === filters.subsidiary ||
      (project.subsidiaryInfo && (
        project.subsidiaryInfo.id === filters.subsidiary ||
        project.subsidiaryInfo.code === filters.subsidiary
      ));
    
    return subsidiaryMatch;
  });

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
      </div>
    </div>
  );
};

export default Projects;
