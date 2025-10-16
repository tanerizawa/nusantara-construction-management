// Main export for subsidiary edit module
export { default } from './SubsidiaryEdit';

// Export hooks for external use if needed
export { useSubsidiaryEdit } from './hooks/useSubsidiaryEdit';
export { useSubsidiaryForm } from './hooks/useSubsidiaryForm';
export { useSubsidiaryValidation } from './hooks/useSubsidiaryValidation';
export { useSubsidiaryTabs } from './hooks/useSubsidiaryTabs';

// Export components for external use if needed
export { default as SubsidiaryEditHeader } from './components/SubsidiaryEditHeader';
export { default as SubsidiaryEditTabs } from './components/SubsidiaryEditTabs';
export { default as BasicInfoForm } from './components/forms/BasicInfoForm';

// Export shared components
export { default as FormSection } from './components/shared/FormSection';
export { default as FieldGroup } from './components/shared/FieldGroup';
export { default as ValidationMessage } from './components/shared/ValidationMessage';

// Export utilities
export * from './utils/formHelpers';
export * from './config/formConfig';
export * from './config/validationRules';