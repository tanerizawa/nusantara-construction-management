import React, { useState } from 'react';
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
import SubmitBAModal from './components/SubmitBAModal';
import { projectAPI } from '../../services/api';

/**
 * Main component untuk Berita Acara Management
 * Modularized version - all business logic extracted to hooks
 */
const BeritaAcaraManager = ({ projectId, project, activeBA, onBAChange }) => {
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [baToSubmit, setBaToSubmit] = useState(null);

  // Custom hooks
  const {
    baList,
    loading,
    error,
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

  // Handle BA submission with signature
  const handleSubmitBA = (baId) => {
    console.log('🚀 handleSubmitBA called with baId:', baId);
    const ba = baList.find(b => b.id === baId);
    console.log('📄 Found BA:', ba);
    if (ba) {
      setBaToSubmit(ba);
      setShowSubmitModal(true);
      console.log('✅ Submit modal opened');
    } else {
      console.error('❌ BA not found in list');
    }
  };

  const handleConfirmSubmit = async (handoverData) => {
    console.log('🎯 handleConfirmSubmit called with data:', handoverData);
    console.log('📋 BA to submit:', baToSubmit);
    
    try {
      // First update BA with handover data
      console.log('1️⃣ Updating BA with handover data...');
      await projectAPI.updateBeritaAcara(projectId, baToSubmit.id, {
        clientRepresentative: handoverData.clientRepresentative,
        workLocation: handoverData.workLocation,
        contractReference: handoverData.contractReference,
        contractorSignature: handoverData.contractorSignature,
        notes: handoverData.notes
      });
      console.log('✅ BA updated successfully');

      // Then submit using projectAPI
      console.log('2️⃣ Submitting BA...');
      const submitResponse = await projectAPI.submitBeritaAcara(projectId, baToSubmit.id, {
        submittedBy: handoverData.submittedBy
      });
      console.log('✅ BA submitted successfully:', submitResponse);

      alert('Berita Acara berhasil disubmit dengan dokumen serah terima!');
      setShowSubmitModal(false);
      setBaToSubmit(null);
      refreshData();
      if (onBAChange) onBAChange();
    } catch (error) {
      console.error('❌ Error submitting BA:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        stack: error.stack
      });
      alert('Gagal submit Berita Acara: ' + (error.message || 'Unknown error'));
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
      
      {/* Submit BA Modal */}
      {showSubmitModal && baToSubmit && (
        <SubmitBAModal
          beritaAcara={baToSubmit}
          project={project}
          onSubmit={handleConfirmSubmit}
          onCancel={() => {
            setShowSubmitModal(false);
            setBaToSubmit(null);
          }}
        />
      )}
    </div>
  );
};

export default BeritaAcaraManager;
