import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Professional Component Imports
import Button from '../components/ui/Button';
import { Pagination } from '../components/ui/Pagination';
import ConfirmationDialog from '../components/ui/ConfirmationDialog';
import ProjectDetailModal from '../components/ui/ProjectDetailModal';
import { LoadingState, EmptyState, ErrorState } from '../components/ui/StateComponents';
import Breadcrumb from '../components/ui/Breadcrumb';

// Compact Components - New Information-Dense UI
import {
  CompactProjectHeader,
  CompactProjectTable
} from '../components/Projects/compact';

// New Toolbar Components
import ProjectToolbar from '../components/Projects/ProjectToolbar';
import BulkActionToolbar from '../components/Projects/BulkActionToolbar';

// Export utilities
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

// Custom Hook Imports
import useProjects from '../hooks/useProjects';
import { useDebouncedValue } from '../hooks/useDebounce';

/**
 * Professional Project Management Page - ENHANCED VERSION
 * 
 * Features:
 * - Search functionality with debouncing
 * - Filter by status and priority
 * - Sorting by multiple fields
 * - Breadcrumb navigation
 * - Consistent Indonesian language
 * - Toast notifications
 * - Improved UX with loading states
 * 
 * Updated: October 12, 2025
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

  // Search and Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    priority: ''
  });
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Debounced search term untuk performance optimization
  const { debouncedValue: debouncedSearchTerm, isDebouncing } = useDebouncedValue(searchTerm, 300);

  // Bulk Selection State
  const [selectedProjects, setSelectedProjects] = useState([]);
  
  // Bulk Action Loading State
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  // Consolidated Dialog State (reduces redundancy)
  const [dialog, setDialog] = useState({ 
    type: null, // 'delete' | 'archive' | 'detail' | 'bulkDelete' | 'bulkArchive'
    show: false, 
    project: null 
  });

  // Filter and Sort Projects (menggunakan debouncedSearchTerm)
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // Apply search dengan debounced term
    if (debouncedSearchTerm) {
      const search = debouncedSearchTerm.toLowerCase();
      result = result.filter(project =>
        project.name?.toLowerCase().includes(search) ||
        project.projectCode?.toLowerCase().includes(search) ||
        project.client?.toLowerCase().includes(search) ||
        project.clientName?.toLowerCase().includes(search)
      );
    }

    // Apply filters
    if (filters.status) {
      result = result.filter(project => project.status === filters.status);
    }
    if (filters.priority) {
      result = result.filter(project => project.priority === filters.priority);
    }

    // Apply sorting
    result.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (sortBy === 'budget' || sortBy === 'progress') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (sortBy === 'startDate' || sortBy === 'endDate' || sortBy === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      } else {
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return result;
  }, [projects, debouncedSearchTerm, filters, sortBy, sortOrder]); // Updated dependency

  const hasActiveFilters = filters.status || filters.priority;

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

  // Consolidated Dialog Handler (reduces redundancy)
  const handleAction = useCallback((type, project) => {
    setDialog({ type, show: true, project });
  }, []);

  const handleDeleteProject = useCallback((project) => {
    handleAction('delete', project);
  }, [handleAction]);

  const handleArchiveProject = useCallback((project) => {
    handleAction('archive', project);
  }, [handleAction]);

  // Consolidated Confirm Action (reduces redundancy)
  const confirmAction = useCallback(async () => {
    if (!dialog.project) return;
    
    const isBulkAction = dialog.type === 'bulkDelete' || dialog.type === 'bulkArchive';
    
    // Set loading state untuk bulk actions
    if (isBulkAction) {
      setBulkActionLoading(true);
    }
    
    const actions = {
      delete: {
        fn: deleteProject,
        successMsg: 'Proyek berhasil dihapus',
        errorMsg: 'Gagal menghapus proyek'
      },
      archive: {
        fn: archiveProject,
        successMsg: 'Proyek berhasil diarsipkan',
        errorMsg: 'Gagal mengarsipkan proyek'
      },
      bulkDelete: {
        fn: async () => {
          const results = await Promise.allSettled(
            selectedProjects.map(id => deleteProject(id))
          );
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          const failCount = results.filter(r => r.status === 'rejected').length;
          
          if (failCount > 0) {
            throw new Error(`${successCount} berhasil, ${failCount} gagal`);
          }
          return successCount;
        },
        successMsg: `${selectedProjects.length} proyek berhasil dihapus`,
        errorMsg: 'Gagal menghapus beberapa proyek'
      },
      bulkArchive: {
        fn: async () => {
          const results = await Promise.allSettled(
            selectedProjects.map(id => archiveProject(id))
          );
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          const failCount = results.filter(r => r.status === 'rejected').length;
          
          if (failCount > 0) {
            throw new Error(`${successCount} berhasil, ${failCount} gagal`);
          }
          return successCount;
        },
        successMsg: `${selectedProjects.length} proyek berhasil diarsipkan`,
        errorMsg: 'Gagal mengarsipkan beberapa proyek'
      }
    };

    const action = actions[dialog.type];
    if (!action) return;

    try {
      if (isBulkAction) {
        await action.fn();
        setSelectedProjects([]);
      } else {
        await action.fn(dialog.project.id);
      }
      
      toast.success(action.successMsg);
      setDialog({ type: null, show: false, project: null });
      refreshProjects();
    } catch (error) {
      console.error(`${dialog.type} failed:`, error);
      toast.error(action.errorMsg + ': ' + error.message);
    } finally {
      // Clear loading state
      if (isBulkAction) {
        setBulkActionLoading(false);
      }
    }
  }, [dialog, deleteProject, archiveProject, selectedProjects, refreshProjects]);

  // Detail Modal Action Handlers
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

  const closeDetailModal = useCallback(() => {
    setDialog({ type: null, show: false, project: null });
  }, []);

  // Bulk Selection Handlers
  const handleSelectProject = useCallback((projectId) => {
    setSelectedProjects(prev => 
      prev.includes(projectId)
        ? prev.filter(id => id !== projectId)
        : [...prev, projectId]
    );
  }, []);

  const handleSelectAll = useCallback((checked) => {
    if (checked) {
      const currentPageProjectIds = filteredAndSortedProjects
        .slice((page - 1) * pageSize, page * pageSize)
        .map(p => p.id);
      setSelectedProjects(currentPageProjectIds);
    } else {
      setSelectedProjects([]);
    }
  }, [filteredAndSortedProjects, page, pageSize]);

  const handleClearSelection = useCallback(() => {
    setSelectedProjects([]);
  }, []);

  // Bulk Action Handlers
  const handleBulkArchive = useCallback(async () => {
    if (selectedProjects.length === 0) return;
    
    setDialog({ 
      type: 'bulkArchive', 
      show: true, 
      project: { count: selectedProjects.length } 
    });
  }, [selectedProjects]);

  const handleBulkDelete = useCallback(async () => {
    if (selectedProjects.length === 0) return;
    
    setDialog({ 
      type: 'bulkDelete', 
      show: true, 
      project: { count: selectedProjects.length } 
    });
  }, [selectedProjects]);

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

  // Search, Filter, and Sort Handlers
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  }, [setPage]);

  const handleSearchClear = useCallback(() => {
    setSearchTerm('');
    setPage(1);
  }, [setPage]);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1); // Reset to first page on filter change
  }, [setPage]);

  const handleSortChange = useCallback((field, order) => {
    setSortBy(field);
    setSortOrder(order);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchTerm('');
    setFilters({ status: '', priority: '' });
    setSortBy('createdAt');
    setSortOrder('desc');
    setPage(1);
  }, [setPage]);

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

  // Render helper untuk loading/error states (reduces redundancy)
  const renderState = (Component, props) => (
    <div className="min-h-screen bg-[#1C1C1E]">
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb items={[{ label: 'Proyek' }]} />
        <Component {...props} />
      </div>
    </div>
  );

  // Professional Loading State
  if (loading) {
    return renderState(LoadingState, { message: "Memuat proyek..." });
  }

  // Professional Error State
  if (error) {
    return renderState(ErrorState, { error, onRetry: handleRetry });
  }

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <div className="container mx-auto px-4 py-6 space-y-5">
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={[{ label: 'Proyek' }]} />

        {/* Compact Header with Statistics */}
        <CompactProjectHeader 
          stats={stats}
          onCreateProject={handleCreateProject}
        />

        {/* Search, Filter, and Sort Toolbar */}
        <ProjectToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          onSearchClear={handleSearchClear}
          filters={filters}
          onFilterChange={handleFilterChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          disabled={loading}
          isSearching={isDebouncing}
        />

        {/* Bulk Action Toolbar - Shows when projects are selected */}
        {selectedProjects.length > 0 && (
          <BulkActionToolbar
            selectedCount={selectedProjects.length}
            onBulkArchive={handleBulkArchive}
            onBulkExportExcel={handleBulkExportExcel}
            onBulkExportPDF={handleBulkExportPDF}
            onBulkDelete={handleBulkDelete}
            onClearSelection={handleClearSelection}
            disabled={loading || bulkActionLoading}
            isLoading={bulkActionLoading}
          />
        )}

        {/* Professional Content Area */}
        <div className="space-y-5">
          {/* Empty State */}
          {filteredAndSortedProjects.length === 0 ? (
            <EmptyState
              title={searchTerm || hasActiveFilters ? "Tidak ada hasil" : "Belum ada proyek"}
              description={
                searchTerm || hasActiveFilters
                  ? `Tidak ditemukan proyek yang sesuai dengan pencarian atau filter Anda`
                  : "Mulai dengan membuat proyek pertama Anda"
              }
              action={
                !searchTerm && !hasActiveFilters ? (
                  <Button onClick={handleCreateProject}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Proyek Baru
                  </Button>
                ) : (
                  <Button onClick={handleClearFilters} variant="secondary">
                    Hapus Filter
                  </Button>
                )
              }
            />
          ) : (
            /* Compact Project Table - Always use table view for compact design */
            <>
              <CompactProjectTable
                projects={filteredAndSortedProjects}
                selectedProjects={selectedProjects}
                onSelectProject={handleSelectProject}
                onSelectAll={handleSelectAll}
                onView={handleViewProject}
                onEdit={handleEditProject}
                onArchive={handleArchiveProject}
                onDelete={handleDeleteProject}
              />

              {/* Results Info */}
              <div className="flex items-center justify-between text-sm">
                <div className="text-[#8E8E93]">
                  Menampilkan <span className="text-white font-medium">{filteredAndSortedProjects.length}</span> dari{' '}
                  <span className="text-white font-medium">{stats.total || projects.length}</span> proyek
                  {(searchTerm || hasActiveFilters) && (
                    <span className="text-[#0A84FF]"> (difilter)</span>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={stats.total || projects.length}
              itemsPerPage={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              showInfo={true}
              size="md"
            />
          )}
        </div>

        {/* Professional Confirmation Dialog - Consolidated */}
        <ConfirmationDialog
          isOpen={dialog.show && (dialog.type === 'delete' || dialog.type === 'archive' || dialog.type === 'bulkDelete' || dialog.type === 'bulkArchive')}
          title={
            dialog.type === 'bulkDelete' ? "Hapus Beberapa Proyek" :
            dialog.type === 'bulkArchive' ? "Arsipkan Beberapa Proyek" :
            dialog.type === 'delete' ? "Hapus Proyek" : 
            "Arsipkan Proyek"
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
            dialog.type === 'bulkDelete' || dialog.type === 'delete' ? "Hapus" : "Arsipkan"
          }
          confirmVariant={
            dialog.type === 'bulkDelete' || dialog.type === 'delete' ? "destructive" : "secondary"
          }
          onConfirm={confirmAction}
          onCancel={() => setDialog({ type: null, show: false, project: null })}
        />

        {/* Project Detail Modal */}
        <ProjectDetailModal
          isOpen={dialog.show && dialog.type === 'detail'}
          project={dialog.project}
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
