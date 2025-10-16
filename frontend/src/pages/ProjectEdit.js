/**
 * ProjectEdit
 * 
 * This file has been modularized into separate components
 * located at /src/pages/ProjectEdit/
 * 
 * This file now re-exports the modularized components to maintain backward compatibility
 */

export { default } from './ProjectEdit/ProjectEdit';

// Re-export subcomponents and hooks for backward compatibility
export {
  BasicInfoSection,
  ClientInfoSection,
  LocationSection,
  FinancialSection,
  TimelineSection,
  StatusSection,
  FormActions,
  useProjectEditForm
} from './ProjectEdit';
