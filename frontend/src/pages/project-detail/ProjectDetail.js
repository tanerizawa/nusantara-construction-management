import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Building, ChevronRight, Home } from 'lucide-react';

// Hooks
import { useProjectDetail, useWorkflowData } from './hooks';

// Components
import { ProjectOverview } from './components';
import { createTabConfig } from './config';

// API Service
import { projectAPI } from '../../services/api';

// Workflow components
import {
  QuickStatusBar,
  WorkflowTabsNavigation,
  ProjectRABWorkflow,
  ProjectBudgetMonitoring
} from '../../components/workflow';
import { ReportGenerator } from '../../components/workflow/reports';
import PurchaseOrdersManager from '../../components/workflow/purchase-orders/PurchaseOrdersManager';

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0A84FF]"></div>
          <p className="text-[#8E8E93]">Memuat detail proyek...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-[#FF3B30] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Error</h2>
          <p className="text-[#8E8E93] mb-4">{error}</p>
          <button
            onClick={() => fetchProject()}
            className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90"
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
          <Building className="h-12 w-12 text-[#636366] mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Proyek Tidak Ditemukan</h2>
          <p className="text-[#8E8E93] mb-4">Proyek dengan ID {id} tidak ditemukan.</p>
          <Link
            to="/projects"
            className="bg-[#0A84FF] text-white px-4 py-2 rounded-lg hover:bg-[#0A84FF]/90"
          >
            Kembali ke Daftar Proyek
          </Link>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      {/* Breadcrumbs */}
      <div className="border-b border-[#38383A] bg-[#2C2C2E]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3">
          <div className="flex items-center space-x-2 text-sm">
            <Link 
              to="/" 
              className="text-[#8E8E93] hover:text-[#0A84FF] flex items-center transition-colors"
            >
              <Home className="w-4 h-4" />
            </Link>
            <ChevronRight className="w-4 h-4 text-[#636366]" />
            <Link 
              to="/projects" 
              className="text-[#8E8E93] hover:text-[#0A84FF] transition-colors"
            >
              Proyek
            </Link>
            <ChevronRight className="w-4 h-4 text-[#636366]" />
            <span className="text-white font-medium truncate max-w-md">
              {project?.name || 'Detail Proyek'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {/* Quick Status Update Bar */}
        <QuickStatusBar 
          project={project}
          onStatusUpdate={async (update) => {
            try {
              console.log('Status update:', update);
              
              // Use projectAPI.updateStatus with dedicated endpoint
              const response = await projectAPI.updateStatus(id, {
                status: update.status,
                status_notes: update.notes
              });

              if (!response.success) {
                throw new Error(response.error || 'Failed to update status');
              }

              // Show success notification
              window.dispatchEvent(new CustomEvent('show-notification', {
                detail: {
                  type: 'success',
                  message: 'Status proyek berhasil diupdate',
                  duration: 3000
                }
              }));

              // Refresh project data
              await fetchProject();
            } catch (error) {
              console.error('Failed to update status:', error);
              // Show error notification
              window.dispatchEvent(new CustomEvent('show-notification', {
                detail: {
                  type: 'error',
                  message: error.message || 'Gagal mengupdate status proyek',
                  duration: 5000
                }
              }));
            }
          }}
        />

        {/* Workflow Tabs Navigation */}
        <WorkflowTabsNavigation 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && project && (
            <ProjectOverview project={project} workflowData={workflowData} />
          )}
          
          {activeTab === 'rab-workflow' && project && (
            <ProjectRABWorkflow projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'purchase-orders' && project && (
            <PurchaseOrdersManager 
              projectId={id} 
              project={project} 
              onDataChange={fetchProject}
            />
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

          {activeTab === 'reports' && project && (
            <ReportGenerator 
              projectId={id} 
              project={project}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
