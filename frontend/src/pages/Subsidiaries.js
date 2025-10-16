/**
 * Subsidiaries - Thin Wrapper
 * Maintains backward compatibility while using modular architecture
 * 
 * Original 392-line monolithic file has been modularized into:
 * - 5 UI components
 * - 2 custom hooks
 * - 2 utility files
 * - 1 orchestrator
 */
import React from 'react';
import SubsidiariesList from './Subsidiaries/SubsidiariesList';

/**
 * Subsidiaries component
 * @returns {JSX.Element} Subsidiaries page
 */
const Subsidiaries = () => {
  return <SubsidiariesList />;
};

export default Subsidiaries;

// Re-export components for backward compatibility
export {
  PageHeader,
  StatsCards,
  SearchAndFilters,
  SubsidiariesGrid,
  SubsidiaryCard
} from './Subsidiaries/components';

// Re-export hooks for backward compatibility
export {
  useSubsidiariesData,
  useSubsidiaryFilters
} from './Subsidiaries/hooks';

// Re-export constants and utils for backward compatibility
export {
  SPECIALIZATIONS,
  STATUS_OPTIONS,
  SPECIALIZATION_LABELS,
  formatYear,
  formatEmployeeCount,
  getStatusConfig
} from './Subsidiaries/utils';