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
    <div className="relative isolate min-h-screen">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.12),_transparent_50%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex flex-col gap-4 rounded-3xl border border-white/5 bg-[#0b0f19]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>

            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-[#0ea5e9]/30 to-[#6366f1]/30 p-3 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <p className="eyebrow-label text-white/60">Project Creation</p>
                <h1 className="text-3xl font-semibold text-white">Buat Proyek Baru</h1>
              </div>
            </div>
          </div>
          <div className="text-sm text-white/60">
            Isi detail proyek dan pastikan data subsidiari, klien, dan timeline lengkap sebelum disimpan.
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              onClick={handleBack}
              variant="outline"
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 px-6 py-3 text-white/70 hover:border-white/40 hover:text-white sm:w-auto"
            >
              Batal
            </Button>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-6 py-3 font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] hover:brightness-110 sm:w-auto"
            >
              {loading ? (
                <>
                  <div className="mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
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
