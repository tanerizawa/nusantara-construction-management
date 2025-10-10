import React from 'react';
import { Building2 } from 'lucide-react';
import ProjectFinanceIntegrationDashboard from '../../../components/finance/ProjectFinanceIntegrationDashboard';

/**
 * ProjectFinanceView Component
 * 
 * Project-based financial view and integration
 * Shows project finance overview and integration with project data
 * 
 * @param {Object} props
 * @param {string} props.selectedSubsidiary - Currently selected subsidiary ID
 * @param {string} props.selectedProject - Currently selected project ID
 */
const ProjectFinanceView = ({
  selectedSubsidiary,
  selectedProject
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
          <Building2 className="w-7 h-7 mr-3 text-blue-600" />
          Project Finance Integration
        </h2>
      </div>

      {/* Project Finance Dashboard */}
      <div className="bg-white rounded-lg shadow p-6">
        <ProjectFinanceIntegrationDashboard
          selectedSubsidiary={selectedSubsidiary}
          selectedProject={selectedProject}
          compact={false}
        />
      </div>

      {/* Additional Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          About Project Finance Integration
        </h3>
        <p className="text-sm text-blue-800">
          This dashboard integrates financial data with project management, 
          providing real-time insights into project costs, budget utilization, 
          and financial performance across all construction projects.
        </p>
      </div>
    </div>
  );
};

export default ProjectFinanceView;
