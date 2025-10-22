import React from 'react';
import FinancialWorkspaceDashboard from '../../../components/workspace/FinancialWorkspaceDashboard';

/**
 * FinanceWorkspace Component
 * 
 * Main financial workspace dashboard
 * Integrates comprehensive financial overview and quick actions
 * 
 * @param {Object} props
 * @param {string} props.selectedSubsidiary - Currently selected subsidiary ID
 * @param {string} props.selectedProject - Currently selected project ID
 */
const FinanceWorkspace = ({
  selectedSubsidiary,
  selectedProject
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold" style={{ color: "#FFFFFF" }}>
          Dasbor Ruang Kerja Keuangan
        </h2>
      </div>

      {/* Main Dashboard Component */}
      <FinancialWorkspaceDashboard
        selectedSubsidiary={selectedSubsidiary}
        selectedProject={selectedProject}
      />
    </div>
  );
};

export default FinanceWorkspace;
