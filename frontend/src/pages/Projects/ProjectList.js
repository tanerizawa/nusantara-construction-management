import React from 'react';
import { Plus } from 'lucide-react';

// Professional Component Imports
import Button from '../../components/ui/Button';
import { Pagination } from '../../components/ui/Pagination';
import ConfirmationDialog from '../../components/ui/ConfirmationDialog';
import ProjectDetailModal from '../../components/ui/ProjectDetailModal';
import { LoadingState, EmptyState, ErrorState } from '../../components/ui/StateComponents';
import Breadcrumb from '../../components/ui/Breadcrumb';
import { useTranslation } from '../../i18n';

// Compact Components
import {
  CompactProjectHeader,
  CompactProjectTable
} from '../../components/Projects/compact';

// Toolbar Components
import ProjectToolbar from '../../components/Projects/ProjectToolbar';
import BulkActionToolbar from '../../components/Projects/BulkActionToolbar';

// Custom Hook Imports
import useProjects from '../../hooks/useProjects';
import { useDebouncedValue } from '../../hooks/useDebounce';

// Local Hooks
import { 
  useProjectFilters, 
  useProjectBulkActions, 
  useProjectActions 
} from './hooks';

/**
 * Professional Project Management Page - MODULAR VERSION
 * 
 * Features:
 * - Search functionality with debouncing
 * - Filter by status and priority
 * - Sorting by multiple fields
 * - Bulk operations (archive, delete, export)
 * - Breadcrumb navigation
 * - Consistent Indonesian language
 * - Toast notifications
 * - Improved UX with loading states
 * 
 * Modularized: October 15, 2025
 */
const ProjectList = () => {
  // Translation hook for localization
  const { projects: projectsTranslations, common, ui } = useTranslation();
  
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

  // Filters Hook (search, filter, sort)
  const {
    searchTerm,
    filters,
    sortBy,
    sortOrder,
    hasActiveFilters,
    filteredAndSortedProjects,
    handleSearchChange: onSearchChange,
    handleSearchClear,
    handleFilterChange,
    handleSortChange,
    handleClearFilters,
  } = useProjectFilters(projects);

  // Debounced search term untuk performance optimization
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebouncedValue(searchTerm, 300);

  // Actions Hook (view, edit, delete, archive)
  const {
    dialog,
    handleCreateProject,
    handleEditProject,
    handleViewProject,
    handleDeleteProject,
    handleArchiveProject,
    handleBulkArchiveDialog,
    handleBulkDeleteDialog,
    confirmAction,
    closeDialog,
    handleDetailModalEdit,
    handleDetailModalArchive,
    handleDetailModalDelete,
    handleDetailModalViewFull,
  } = useProjectActions(deleteProject, archiveProject, refreshProjects);

  // Bulk Actions Hook (selection, bulk operations)
  const {
    selectedProjects,
    bulkActionLoading,
    handleSelectProject,
    handleSelectAll,
    handleClearSelection,
    handleBulkArchive,
    handleBulkDelete,
    handleBulkExportExcel,
    handleBulkExportPDF,
  } = useProjectBulkActions(projects, deleteProject, archiveProject, refreshProjects);

  // Wrapper untuk search change dengan page reset
  const handleSearchChange = (value) => {
    onSearchChange(value);
    setPage(1);
  };

  // Wrapper untuk filter change dengan page reset
  const handleFilterChangeWithReset = (key, value) => {
    handleFilterChange(key, value);
    setPage(1);
  };

  // Wrapper untuk clear filters dengan page reset
  const handleClearFiltersWithReset = () => {
    handleClearFilters();
    setPage(1);
  };

  // Wrapper untuk selectAll dengan current page projects
  const handleSelectAllWrapper = (checked) => {
    const currentPageProjects = filteredAndSortedProjects.slice(
      (page - 1) * pageSize, 
      page * pageSize
    );
    handleSelectAll(checked, currentPageProjects);
  };

  // Wrapper untuk bulk actions dengan dialog
  const handleBulkArchiveWrapper = () => {
    if (selectedProjects.length === 0) return;
    handleBulkArchiveDialog(selectedProjects.length);
  };

  const handleBulkDeleteWrapper = () => {
    if (selectedProjects.length === 0) return;
    handleBulkDeleteDialog(selectedProjects.length);
  };

  // Confirm action dengan bulk support
  const handleConfirmAction = async () => {
    if (dialog.type === 'bulkArchive') {
      await handleBulkArchive(() => closeDialog());
    } else if (dialog.type === 'bulkDelete') {
      await handleBulkDelete(() => closeDialog());
    } else {
      await confirmAction(() => closeDialog());
    }
  };

  // Professional Error Boundary Effect
  const handleRetry = () => {
    refreshProjects();
  };

  // Render helper untuk loading/error states
  const renderState = (Component, props) => (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%)]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8">
        <Breadcrumb items={[{ label: 'Proyek' }]} />
        <Component {...props} />
      </div>
    </div>
  );

  // Professional Loading State
  if (loading) {
    return renderState(LoadingState, { message: common.loading });
  }

  // Professional Error State
  if (error) {
    return renderState(ErrorState, { error, onRetry: handleRetry });
  }

  return (
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_45%)]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 space-y-6">
        <Breadcrumb items={[{ label: projectsTranslations.title }]} />

        <CompactProjectHeader 
          stats={stats}
          onCreateProject={handleCreateProject}
        />

        <ProjectToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchClear={() => {
            handleSearchClear();
            setPage(1);
          }}
          filters={filters}
          onFilterChange={handleFilterChangeWithReset}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFiltersWithReset}
          disabled={loading}
          isSearching={isDebouncing}
        />

        {selectedProjects.length > 0 && (
          <BulkActionToolbar
            selectedCount={selectedProjects.length}
            onBulkArchive={handleBulkArchiveWrapper}
            onBulkExportExcel={handleBulkExportExcel}
            onBulkExportPDF={handleBulkExportPDF}
            onBulkDelete={handleBulkDeleteWrapper}
            onClearSelection={handleClearSelection}
            disabled={loading || bulkActionLoading}
            isLoading={bulkActionLoading}
          />
        )}

        <div className="space-y-5">
          {filteredAndSortedProjects.length === 0 ? (
            <EmptyState
              title={searchTerm || hasActiveFilters ? ui.emptyState.noResults : ui.emptyState.noData}
              description={
                searchTerm || hasActiveFilters
                  ? ui.emptyState.noResultsDesc
                  : ui.emptyState.noDataDesc
              }
              action={
                !searchTerm && !hasActiveFilters ? (
                  <Button onClick={handleCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    {projectsTranslations.newProject}
                  </Button>
                ) : (
                  <Button onClick={handleClearFiltersWithReset} variant="secondary">
                    {ui.emptyState.resetFilter}
                  </Button>
                )
              }
            />
          ) : (
            <>
              <CompactProjectTable
                projects={filteredAndSortedProjects}
                selectedProjects={selectedProjects}
                onSelectProject={handleSelectProject}
                onSelectAll={handleSelectAllWrapper}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onArchive={handleArchiveProject}
                onDelete={handleDeleteProject}
              />

              <div className="flex flex-col gap-2 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  {ui.pagination.showing} <span className="font-semibold text-white">{filteredAndSortedProjects.length}</span> {ui.pagination.of}{' '}
                  <span className="font-semibold text-white">{stats.total || projects.length}</span> {projectsTranslations.title.toLowerCase()}
                  {(searchTerm || hasActiveFilters) && (
                    <span className="text-[#0A84FF]"> (difilter)</span>
                  )}
                </div>
              </div>
            </>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={stats.total || projects.length}
              itemsPerPage={pageSize}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              showInfo={true}
              size="md"
            />
          )}
        </div>

        {/* Professional Confirmation Dialog - Consolidated */}
        <ConfirmationDialog
          isOpen={dialog.show && (dialog.type === 'delete' || dialog.type === 'archive' || dialog.type === 'bulkDelete' || dialog.type === 'bulkArchive')}
          title={
            dialog.type === 'bulkDelete' ? `${common.delete} ${projectsTranslations.title}` :
            dialog.type === 'bulkArchive' ? `${common.archive} ${projectsTranslations.title}` :
            dialog.type === 'delete' ? `${common.delete} ${projectsTranslations.title}` : 
            `${common.archive} ${projectsTranslations.title}`
          }
          message={
            dialog.project
              ? dialog.type === 'bulkDelete'
                ? `Apakah Anda yakin ingin menghapus ${dialog.project.count} proyek? Tindakan ini tidak dapat dibatalkan.`
                : dialog.type === 'bulkArchive'
                ? `Apakah Anda yakin ingin mengarsipkan ${dialog.project.count} proyek? Proyek yang diarsipkan masih dapat dikembalikan.`
                : dialog.type === 'delete'
                ? `Apakah Anda yakin ingin menghapus proyek "${dialog.project.name}"? Tindakan ini tidak dapat dibatalkan.`
                : `Apakah Anda yakin ingin mengarsipkan proyek "${dialog.project.name}"? Proyek yang diarsipkan masih dapat dikembalikan.`
              : ''
          }
          confirmText={
            dialog.type === 'bulkDelete' || dialog.type === 'delete' ? common.delete : common.archive
          }
          confirmVariant={
            dialog.type === 'bulkDelete' || dialog.type === 'delete' ? "destructive" : "secondary"
          }
          onConfirm={handleConfirmAction}
          onCancel={closeDialog}
        />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          isOpen={dialog.show && dialog.type === 'detail'}
          project={dialog.project}
          onClose={closeDialog}
          onEdit={handleDetailModalEdit}
          onArchive={handleDetailModalArchive}
          onDelete={handleDetailModalDelete}
          onViewFull={handleDetailModalViewFull}
        />
      </div>
    </div>
  );
};

export default ProjectList;
