import React, { useEffect, useState } from 'react';
import { useSubsidiaryEdit } from './hooks/useSubsidiaryEdit';
import { useSubsidiaryForm } from './hooks/useSubsidiaryForm';
import { useSubsidiaryValidation } from './hooks/useSubsidiaryValidation';
import { useSubsidiaryTabs } from './hooks/useSubsidiaryTabs';

import SubsidiaryEditHeader from './components/SubsidiaryEditHeader';
import SubsidiaryEditTabs from './components/SubsidiaryEditTabs';
import BasicInfoForm from './components/forms/BasicInfoForm';
import LegalInfoForm from './components/forms/LegalInfoForm';
import FinancialInfoForm from './components/forms/FinancialInfoForm';
import GovernanceForm from './components/forms/GovernanceForm';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
      <p className="text-[#8E8E93]">Memuat data anak usaha...</p>
    </div>
  </div>
);

const SubsidiaryEdit = () => {
  const {
    isEditing,
    loading,
    saving,
    error,
    fetchSubsidiary,
    saveSubsidiary,
    navigateToList,
    clearError
  } = useSubsidiaryEdit();

  const {
    formData,
    updateField,
    loadFormData
  } = useSubsidiaryForm();

  const {
    errors,
    validateForm,
    validateSingleField,
    markFieldAsTouched,
    clearAllErrors
  } = useSubsidiaryValidation(formData);

  const {
    activeTab,
    setActiveTab
  } = useSubsidiaryTabs();

  const [hasChanges, setHasChanges] = useState(false);

  // Load subsidiary data if editing
  useEffect(() => {
    const loadData = async () => {
      if (isEditing) {
        try {
          const data = await fetchSubsidiary();
          if (data) {
            loadFormData(data);
          }
        } catch (err) {
          // Error is handled in the hook
          console.error('Failed to load subsidiary data:', err);
        }
      }
    };

    loadData();
  }, [isEditing]);

  // Track form changes
  useEffect(() => {
    setHasChanges(true);
  }, [formData]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [formData]);

  const handleSave = async () => {
    if (!validateForm()) {
      // Find first tab with errors and switch to it
      const errorFields = Object.keys(errors);
      if (errorFields.includes('name') || errorFields.includes('code') || 
          errorFields.includes('email') || errorFields.includes('phone')) {
        setActiveTab('basic');
      } else if (errorFields.some(field => field.includes('legal'))) {
        setActiveTab('legal');
      } else if (errorFields.some(field => field.includes('financial'))) {
        setActiveTab('financial');
      }
      return;
    }

    try {
      await saveSubsidiary(formData);
      navigateToList();
    } catch (err) {
      // Error is handled in the hook
      console.error('Failed to save subsidiary:', err);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Ada perubahan yang belum disimpan. Yakin ingin keluar?')) {
        navigateToList();
      }
    } else {
      navigateToList();
    }
  };

  const handleFieldBlur = (fieldPath) => {
    markFieldAsTouched(fieldPath);
    validateSingleField(fieldPath, formData[fieldPath] || '');
  };

  const renderTabContent = () => {
    const commonProps = {
      formData,
      updateField,
      errors,
      onFieldBlur: handleFieldBlur
    };

    switch (activeTab) {
      case 'basic':
        return <BasicInfoForm {...commonProps} />;
      case 'legal':
        return <LegalInfoForm {...commonProps} />;
      case 'financial':
        return <FinancialInfoForm {...commonProps} />;
      case 'governance':
        return <GovernanceForm {...commonProps} />;
      default:
        return <BasicInfoForm {...commonProps} />;
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <SubsidiaryEditHeader
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={handleCancel}
        saving={saving}
        hasChanges={hasChanges}
        subsidiaryName={formData.name}
      />

      {error && (
        <div className="bg-[#FF453A]/10 border border-[#FF453A]/30 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-[#FF453A]" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-[#FF453A]">Error</h3>
              <div className="mt-2 text-sm text-[#FF453A]">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <SubsidiaryEditTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        hasErrors={errors}
      />

      {renderTabContent()}
    </div>
  );
};

export default SubsidiaryEdit;