import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Building, ChevronRight, Home } from 'lucide-react';

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
  
  // Get initial tab from URL hash or localStorage
  const getInitialTab = () => {
    // Priority 1: URL hash (format: #approval-status or #approval-status:tandaTerima)
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Extract main tab (before colon if exists)
      const mainTab = hash.split(':')[0];
      if (mainTab) return mainTab;
    }
    
    // Priority 2: localStorage
    const saved = localStorage.getItem('projectDetail_activeTab');
    if (saved) return saved;
    
    // Priority 3: default
    return 'overview';
  };
  
  const [activeTab, setActiveTab] = useState(getInitialTab);

  // Sync activeTab with URL hash and localStorage
  useEffect(() => {
    // Get current sub-tab from hash if exists
    const hash = window.location.hash.replace('#', '');
    const subTab = hash.includes(':') ? hash.split(':')[1] : '';
    
    // Update URL hash with main tab and preserve sub-tab
    if (subTab) {
      window.location.hash = `${activeTab}:${subTab}`;
    } else {
      window.location.hash = activeTab;
    }
    
    // Update localStorage as backup
    localStorage.setItem('projectDetail_activeTab', activeTab);
  }, [activeTab]);

  // Listen for browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        const mainTab = hash.split(':')[0];
        if (mainTab && mainTab !== activeTab) {
          setActiveTab(mainTab);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeTab]);

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
    <div className="min-h-screen bg-[#1C1C1E] flex">
      {/* Workflow Sidebar - Fixed width */}
      <div className="w-72 flex-shrink-0 border-r border-[#38383A] bg-[#2C2C2E]">
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
                setActiveTab('create-purchase-order');
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
        {/* Breadcrumbs */}
        <div className="border-b border-[#38383A] bg-[#2C2C2E]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-3">
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
          
          {activeTab === 'create-purchase-order' && project && (
            <ProjectPurchaseOrders 
              projectId={id} 
              project={project} 
              onDataChange={fetchProject}
              mode="create"
              onComplete={() => setActiveTab('purchase-orders-history')}
            />
          )}
          
          {activeTab === 'purchase-orders-history' && project && (
            <ProjectPurchaseOrders 
              projectId={id} 
              project={project} 
              onDataChange={fetchProject}
              mode="history"
              onCreateNew={() => setActiveTab('create-purchase-order')}
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
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
