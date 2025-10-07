import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Building } from 'lucide-react';

// Hooks
import { useProjectDetail, useWorkflowData } from './hooks';

// Components
import { ProjectOverview } from './components';
import { createTabConfig } from './config';

// Workflow components
import {
  ProjectRABWorkflow,
  ProjectBudgetMonitoring,
  ProjectWorkflowSidebar,
  ProjectPurchaseOrders,
  ProfessionalApprovalDashboard
} from '../../components/workflow';

// Other components
import ProjectMilestones from '../../components/ProjectMilestones';
import ProjectTeam from '../../components/ProjectTeam';
import ProjectDocuments from '../../components/ProjectDocuments';
import BeritaAcaraManager from '../../components/berita-acara/BeritaAcaraManager';
import ProgressPaymentManager from '../../components/progress-payment/ProgressPaymentManager';

/**
 * ProjectDetail - Main page component
 * Simplified using custom hooks and modular components
 */
const ProjectDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // Custom hooks
  const { project, loading, error, fetchProject } = useProjectDetail(id);
  const { workflowData } = useWorkflowData(project);

  // Tab configuration with workflow data
  const tabConfig = useMemo(() => createTabConfig(workflowData), [workflowData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600">Memuat detail proyek...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchProject()}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Not found state
  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Proyek Tidak Ditemukan</h2>
          <p className="text-gray-600 mb-4">Proyek dengan ID {id} tidak ditemukan.</p>
          <Link
            to="/projects"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Workflow Sidebar - Fixed width */}
      <div className="w-72 flex-shrink-0 border-r border-gray-200 bg-white shadow-sm">
        <ProjectWorkflowSidebar 
          projectId={id}
          project={project} 
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onActionTrigger={(actionType) => {
            switch(actionType) {
              case 'create-rab':
                setActiveTab('rab-workflow');
                break;
              case 'create-po':
                setActiveTab('purchase-orders');
                break;
              case 'add-approval':
                setActiveTab('approval-status');
                break;
              case 'assign-team':
                setActiveTab('team');
                break;
              default:
                break;
            }
          }}
        />
      </div>

      {/* Main Content - Constrained width */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {/* Content Area */}
        <div className="h-full overflow-y-auto p-4 md:p-6 max-w-6xl mx-auto">
          {activeTab === 'overview' && project && (
            <ProjectOverview project={project} workflowData={workflowData} />
          )}
          
          {activeTab === 'rab-workflow' && project && (
            <>
              {console.log('=== PROJECT DETAIL RAB TAB RENDERED ===')}
              {console.log('Project ID:', id)}
              {console.log('Project Object:', project)}
              {console.log('Project ID from object:', project?.id)}
              {console.log('Project name:', project?.name)}
              {console.log('RAB Items:', project?.rabItems)}
              <ProjectRABWorkflow projectId={id} project={project} onDataChange={fetchProject} />
            </>
          )}
          
          {activeTab === 'approval-status' && project && (
            <ProfessionalApprovalDashboard projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'purchase-orders' && project && (
            <ProjectPurchaseOrders projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'budget-monitoring' && project && (
            <ProjectBudgetMonitoring projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'milestones' && project && (
            <ProjectMilestones 
              projectId={id} 
              project={project} 
              onUpdate={fetchProject}
              onMilestoneComplete={(milestone) => {
                // eslint-disable-next-line no-restricted-globals
                if (milestone.status === 'completed') {
                  // eslint-disable-next-line no-restricted-globals
                  const shouldCreateBA = confirm(
                    `Milestone "${milestone.title}" telah selesai. Apakah Anda ingin membuat Berita Acara untuk milestone ini?`
                  );
                  if (shouldCreateBA) {
                    setActiveTab('berita-acara');
                  }
                }
              }}
            />
          )}
          
          {activeTab === 'berita-acara' && project && (
            <BeritaAcaraManager
              projectId={id}
              project={project}
              onBAChange={() => {
                console.log('BA changed, refreshing workflow data');
                fetchProject();
              }}
            />
          )}

          {activeTab === 'progress-payments' && project && (
            <ProgressPaymentManager
              projectId={id}
              project={project}
              onPaymentChange={() => {
                console.log('Payment changed, refreshing project data');
                fetchProject();
              }}
            />
          )}
          
          {activeTab === 'team' && project && (
            <ProjectTeam projectId={id} project={project} onUpdate={fetchProject} />
          )}
          
          {activeTab === 'documents' && project && (
            <ProjectDocuments projectId={id} project={project} onUpdate={fetchProject} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
