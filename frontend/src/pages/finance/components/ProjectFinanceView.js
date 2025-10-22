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
        <h2 className="text-2xl font-semibold flex items-center" style={{ color: "#FFFFFF" }}>
          <Building2 className="w-7 h-7 mr-3" style={{ color: "#0A84FF" }} />
          Integrasi Keuangan Proyek
        </h2>
      </div>

      {/* Project Finance Dashboard */}
      <div className="rounded-lg shadow-lg p-6" style={{ backgroundColor: "#2C2C2E", border: "1px solid #38383A" }}>
        <ProjectFinanceIntegrationDashboard
          selectedSubsidiary={selectedSubsidiary}
          selectedProject={selectedProject}
          compact={false}
        />
      </div>

      {/* Additional Info */}
      <div className="rounded-lg p-4" style={{ background: "linear-gradient(135deg, rgba(10, 132, 255, 0.2) 0%, rgba(10, 132, 255, 0.1) 100%)", border: "1px solid rgba(10, 132, 255, 0.3)" }}>
        <h3 className="text-sm font-medium mb-2" style={{ color: "#0A84FF" }}>
          Tentang Integrasi Keuangan Proyek
        </h3>
        <p className="text-sm" style={{ color: "#98989D" }}>
          Dasbor ini mengintegrasikan data keuangan dengan manajemen proyek,
          memberikan insight real-time terkait biaya proyek, pemakaian anggaran,
          dan kinerja keuangan di seluruh proyek konstruksi.
        </p>
      </div>
    </div>
  );
};

export default ProjectFinanceView;
