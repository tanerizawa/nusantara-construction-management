import React from 'react';
import { useBeritaAcara, useBAViewMode, useBAStatistics } from './hooks';
import {
  BAHeader,
  BASummaryCards,
  BAList,
  BALoadingState,
  BAErrorState,
  BeritaAcaraForm,
  BeritaAcaraViewer
} from './components';

/**
 * Main component untuk Berita Acara Management
 * Modularized version - all business logic extracted to hooks
 */
const BeritaAcaraManager = ({ projectId, project, activeBA, onBAChange }) => {
  // Custom hooks
  const {
    baList,
    loading,
    error,
    submitBA,
    deleteBA,
    refreshData
  } = useBeritaAcara(projectId, onBAChange);

  const {
    viewMode,
    selectedBA,
    handleCreateBA,
    handleEditBA,
    handleViewBA,
    resetToList,
    switchToEdit
  } = useBAViewMode();

  const statistics = useBAStatistics(baList);

  // Handle BA submission
  const handleSubmitBA = async (baId) => {
    const result = await submitBA(baId);
    if (result.success) {
      alert(result.message);
    } else {
      alert(result.message);
    }
  };

  // Handle BA deletion
  const handleDeleteBA = async (baId) => {
    const result = await deleteBA(baId);
    if (!result.cancelled) {
      alert(result.message);
    }
  };

  // Handle form save
  const handleFormSave = () => {
    refreshData();
    resetToList();
  };

  // Loading state
  if (loading) {
    return <BALoadingState />;
  }

  // Error state
  if (error) {
    return <BAErrorState error={error} />;
  }

  // Form view mode
  if (viewMode === 'form') {
    return (
      <BeritaAcaraForm
        projectId={projectId}
        project={project}
        beritaAcara={selectedBA}
        onSave={handleFormSave}
        onCancel={resetToList}
      />
    );
  }

  // Detail view mode
  if (viewMode === 'view') {
    return (
      <BeritaAcaraViewer
        beritaAcara={selectedBA}
        project={project}
        onEdit={switchToEdit}
        onBack={resetToList}
      />
    );
  }

  // Main list view
  return (
    <div className="space-y-6">
      <BAHeader onCreateBA={handleCreateBA} />
      <BASummaryCards statistics={statistics} />
      <BAList
        baList={baList}
        onView={handleViewBA}
        onEdit={handleEditBA}
        onSubmit={handleSubmitBA}
        onDelete={handleDeleteBA}
        onCreateBA={handleCreateBA}
      />
    </div>
  );
};

export default BeritaAcaraManager;
