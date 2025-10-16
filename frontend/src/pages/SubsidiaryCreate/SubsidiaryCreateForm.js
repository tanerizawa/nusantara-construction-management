import React from 'react';
import { useSubsidiaryForm } from './hooks';
import {
  PageHeader,
  BasicInfoSection,
  AddressSection,
  ContactSection,
  LegalSection,
  FinancialSection,
  FormActions
} from './components';

/**
 * SubsidiaryCreate page component
 * Form untuk menambahkan anak usaha baru
 * 
 * @returns {JSX.Element} SubsidiaryCreate page
 */
const SubsidiaryCreateForm = () => {
  const {
    formData,
    loading,
    handleChange,
    handleSubmit
  } = useSubsidiaryForm();

  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: "#1C1C1E" }}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <PageHeader />

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <BasicInfoSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          {/* Address */}
          <AddressSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          {/* Contact Information */}
          <ContactSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          {/* Legal Information */}
          <LegalSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          {/* Financial Information */}
          <FinancialSection 
            formData={formData} 
            handleChange={handleChange} 
          />
          
          {/* Actions */}
          <FormActions loading={loading} />
        </form>
      </div>
    </div>
  );
};

export default SubsidiaryCreateForm;