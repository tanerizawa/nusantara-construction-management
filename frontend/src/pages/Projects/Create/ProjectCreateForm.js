import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import Button from '../../../components/ui/Button';
import useSubsidiaries from '../../../hooks/useSubsidiaries';
import { useProjectForm, useProjectCodePreview, useProjectSubmit } from './hooks';
import {
  BasicInfoSection,
  ClientInfoSection,
  LocationSection,
  TimelineBudgetSection
} from './components';

/**
 * Professional Project Create Form
 * Main orchestrator component for project creation
 * 
 * Responsibilities:
 * - Coordinate form state via custom hooks
 * - Manage subsidiary selection and code preview
 * - Orchestrate form submission
 * - Render form sections
 */
const ProjectCreateForm = () => {
  // Form state management
  const {
    formData,
    errors,
    setErrors,
    handleInputChange,
    updateSubsidiary,
    clearSubsidiary
  } = useProjectForm();

  // Project code preview
  const {
    projectCodePreview,
    loadingPreview,
    clearCodePreview
  } = useProjectCodePreview(formData.subsidiary.code);

  // Subsidiary data
  const { 
    subsidiaries, 
    loading: loadingSubsidiaries, 
    error: subsidiaryError,
    getSubsidiaryById,
    isEmpty: noSubsidiaries 
  } = useSubsidiaries({
    filterBy: { status: 'active' },
    includeStats: false
  });

  // Form submission
  const {
    loading,
    handleSubmit,
    handleBack
  } = useProjectSubmit(formData, setErrors);

  /**
   * Handle subsidiary selection
   * Update form data and fetch code preview
   */
  const handleSubsidiaryChange = async (subsidiaryId) => {
    const selectedSubsidiary = subsidiaries.find(sub => sub.id === subsidiaryId);
    
    if (selectedSubsidiary) {
      updateSubsidiary(selectedSubsidiary);
    } else {
      clearSubsidiary();
      clearCodePreview();
    }
  };

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Compact Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={handleBack}
            variant="ghost"
            size="sm"
            className="text-[#0A84FF] hover:text-[#0A84FF]/80 hover:bg-[#0A84FF]/10"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Kembali
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0A84FF]/10 rounded-lg">
              <Building2 className="h-5 w-5 text-[#0A84FF]" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              Buat Proyek Baru
            </h1>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <BasicInfoSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
            handleSubsidiaryChange={handleSubsidiaryChange}
            subsidiaries={subsidiaries}
            loadingSubsidiaries={loadingSubsidiaries}
            subsidiaryError={subsidiaryError}
            noSubsidiaries={noSubsidiaries}
            getSubsidiaryById={getSubsidiaryById}
            projectCodePreview={projectCodePreview}
            loadingPreview={loadingPreview}
          />

          {/* Client Information */}
          <ClientInfoSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Project Location */}
          <LocationSection
            formData={formData}
            handleInputChange={handleInputChange}
          />

          {/* Timeline & Budget */}
          <TimelineBudgetSection
            formData={formData}
            errors={errors}
            handleInputChange={handleInputChange}
          />

          {/* Submit Buttons */}
          <div className="flex items-center justify-end gap-4 pt-2">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              disabled={loading}
              className="px-6 py-2.5 border-[#38383A] text-[#98989D] hover:text-white hover:border-[#48484A]"
            >
              Batal
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-[#0A84FF] hover:bg-[#0A84FF]/90 text-white border border-[#0A84FF]/20"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Proyek'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProjectCreateForm;
