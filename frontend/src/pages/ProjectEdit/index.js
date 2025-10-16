/**
 * ProjectEdit module exports
 * This file re-exports the main ProjectEdit component and its subcomponents
 */

// Main component
export { default } from './ProjectEdit';

// Component exports for reuse
export { default as BasicInfoSection } from './components/BasicInfoSection';
export { default as ClientInfoSection } from './components/ClientInfoSection';
export { default as LocationSection } from './components/LocationSection';
export { default as FinancialSection } from './components/FinancialSection';
export { default as TimelineSection } from './components/TimelineSection';
export { default as StatusSection } from './components/StatusSection';
export { default as FormActions } from './components/FormActions';

// Hook exports
export { useProjectEditForm } from './hooks/useProjectEditForm';