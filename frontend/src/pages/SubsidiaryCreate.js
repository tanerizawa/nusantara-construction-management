/**
 * SubsidiaryCreate - Thin Wrapper
 * Maintains backward compatibility while using modular architecture
 * 
 * Original 535-line monolithic file has been modularized into:
 * - 6 UI components
 * - 1 custom hook
 * - 2 utility files
 * - 1 orchestrator
 */
import React from 'react';
import SubsidiaryCreateForm from './SubsidiaryCreate/SubsidiaryCreateForm';

/**
 * SubsidiaryCreate component
 * @returns {JSX.Element} SubsidiaryCreate page
 */
const SubsidiaryCreate = () => {
  return <SubsidiaryCreateForm />;
};

export default SubsidiaryCreate;

// Re-export components for backward compatibility
export {
  PageHeader,
  BasicInfoSection,
  AddressSection,
  ContactSection,
  LegalSection,
  FinancialSection,
  FormActions
} from './SubsidiaryCreate/components';

// Re-export hooks for backward compatibility
export {
  useSubsidiaryForm
} from './SubsidiaryCreate/hooks';

// Re-export constants and utils for backward compatibility
export {
  SPECIALIZATIONS,
  DEFAULT_FORM_STATE,
  prepareFormData
} from './SubsidiaryCreate/utils';