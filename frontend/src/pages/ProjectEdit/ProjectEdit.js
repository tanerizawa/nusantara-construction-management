import React from 'react';
import { useParams } from 'react-router-dom';

// Custom hook
import { useProjectEditForm } from './hooks/useProjectEditForm';

// Components
import LoadingState from './components/LoadingState';
import PageHeader from './components/PageHeader';
import AlertMessage from './components/AlertMessage';
import BasicInfoSection from './components/BasicInfoSection';
import ClientInfoSection from './components/ClientInfoSection';
import LocationSection from './components/LocationSection';
import FinancialSection from './components/FinancialSection';
import TimelineSection from './components/TimelineSection';
import StatusSection from './components/StatusSection';
import FormActions from './components/FormActions';

/**
 * ProjectEdit component for editing project details
 * 
 * @returns {JSX.Element} ProjectEdit component
 */
const ProjectEdit = () => {
  const { id } = useParams();
  const { 
    project,
    loading,
    saving,
    error,
    successMessage,
    subsidiaries,
    loadingSubsidiaries,
    formData,
    handleInputChange,
    handleSubsidiaryChange,
    handleSubmit,
  } = useProjectEditForm(id);

  // Show loading or error states
  if (loading || (error && !project)) {
    return <LoadingState loading={loading} error={error} />;
  }

  return (
    <div className="min-h-screen bg-[#000000]">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <PageHeader projectId={id} projectName={project?.name} />

        {/* Success Message */}
        <AlertMessage type="success" message={successMessage} />

        {/* Error Message */}
        <AlertMessage type="error" message={error} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <BasicInfoSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            handleSubsidiaryChange={handleSubsidiaryChange}
            subsidiaries={subsidiaries}
            loadingSubsidiaries={loadingSubsidiaries}
            saving={saving}
          />
          
          {/* Client Information */}
          <ClientInfoSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            saving={saving}
          />
          
          {/* Location Information */}
          <LocationSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            saving={saving}
            projectId={id}
          />
          
          {/* Financial Information */}
          <FinancialSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            saving={saving}
          />
          
          {/* Timeline Information */}
          <TimelineSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            saving={saving}
          />
          
          {/* Status and Progress */}
          <StatusSection 
            formData={formData} 
            handleInputChange={handleInputChange} 
            saving={saving}
          />
          
          {/* Form Actions */}
          <FormActions saving={saving} />
        </form>
      </div>
    </div>
  );
};

export default ProjectEdit;