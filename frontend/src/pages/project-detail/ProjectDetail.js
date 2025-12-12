import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertTriangle, Building, ChevronRight, Home, MapPin, Calendar, DollarSign } from 'lucide-react';

// Hooks
import { useProjectDetail, useWorkflowData } from './hooks';
import { formatCurrency, formatDate } from './utils';

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
  ProjectBudgetMonitoring,
  ProfessionalApprovalDashboard
} from '../../components/workflow';
import { ReportGenerator } from '../../components/workflow/reports';
import RealizationTracker from '../../components/workflow/rab-workflow/components/RealizationTracker';
import PurchaseOrdersManager from '../../components/workflow/purchase-orders/PurchaseOrdersManager';
import WorkOrdersManager from '../../components/workflow/work-orders/WorkOrdersManager';

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

  // Sync main tab from URL hash (supports nested formats like #approval-status:tandaTerima)
  React.useEffect(() => {
    const hash = window.location.hash?.replace('#', '');
    if (hash) {
      const mainTab = hash.split(':')[0];
      const allowed = [
        'overview', 'rab-workflow', 'purchase-orders', 'work-orders',
        'budget-monitoring', 'milestones', 'berita-acara', 'progress-payments',
        'team', 'documents', 'reports', 'approval-status'
      ];
      if (allowed.includes(mainTab)) {
        setActiveTab(mainTab);
      }
    }
  }, []);

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

  const statusMap = {
    planning: { label: 'Perencanaan', className: 'border-[#fbbf24]/50 bg-[#fbbf24]/15 text-[#fde68a]' },
    active: { label: 'Aktif', className: 'border-[#60a5fa]/50 bg-[#60a5fa]/15 text-[#bae6fd]' },
    on_hold: { label: 'Terhenti', className: 'border-[#fb7185]/40 bg-[#fb7185]/15 text-[#fecdd3]' },
    completed: { label: 'Selesai', className: 'border-[#34d399]/40 bg-[#34d399]/15 text-[#bbf7d0]' },
    cancelled: { label: 'Dibatalkan', className: 'border-white/20 bg-white/10 text-white/70' }
  };

  const activeStatus = statusMap[project.status] || statusMap.active;
  const projectCode = project.projectCode || project.code || id;
  const clientName = project.client?.company || project.client?.name || project.clientName || '-';
  const locationText = project.location?.city || project.location?.province || project.location?.address || '-';
  const startDate = project.timeline?.startDate || project.startDate;
  const endDate = project.timeline?.endDate || project.endDate;
  const timelineRange = startDate || endDate
    ? `${formatDate(startDate) || '?'} — ${formatDate(endDate) || '?'}`
    : 'Belum ditentukan';
  const totalBudget = formatCurrency(project.totalBudget || workflowData?.budgetSummary?.totalBudget || 0);

  return (
    <div className="relative isolate min-h-screen bg-[#03050b] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-80" aria-hidden="true">
        <div className="h-full w-full bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_45%),_radial-gradient(circle_at_20%_20%,rgba(147,51,234,0.15),transparent_35%)]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10 space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-sm text-white/60">
          <Link to="/" className="transition hover:text-white">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-4 w-4 text-white/30" />
          <Link to="/projects" className="transition hover:text-white">
            Proyek
          </Link>
          <ChevronRight className="h-4 w-4 text-white/30" />
          <span className="line-clamp-1 font-medium text-white">{project?.name || 'Detail Proyek'}</span>
        </div>

        <section className="rounded-3xl border border-white/5 bg-[#080b13]/80 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="eyebrow-label text-white/60">Project #{projectCode}</p>
              <h1 className="text-3xl font-semibold text-white">{project.name}</h1>
              {project.description && (
                <p className="mt-2 max-w-3xl text-sm text-white/60 line-clamp-2">{project.description}</p>
              )}
            </div>
            <span className={`inline-flex items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${activeStatus.className}`}>
              {activeStatus.label}
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Klien</p>
              <p className="mt-1 text-sm font-semibold text-white">{clientName}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Lokasi</p>
              <p className="mt-1 inline-flex items-center gap-1 text-sm text-white">
                <MapPin className="h-4 w-4 text-white/50" />
                {locationText}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Budget</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-semibold text-white">
                <DollarSign className="h-4 w-4 text-[#34d399]" />
                {totalBudget}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.3em] text-white/60">Timeline</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm text-white">
                <Calendar className="h-4 w-4 text-white/50" />
                {timelineRange}
              </p>
            </div>
          </div>

          <div className="mt-6">
            <QuickStatusBar 
              project={project}
              onStatusUpdate={async (update) => {
                console.log('Status update:', update);
                const response = await projectAPI.updateStatus(id, {
                  status: update.status,
                  status_notes: update.notes
                });

                if (response.success) {
                  await fetchProject();
                }
                
                return response;
              }}
            />
          </div>
        </section>

        <section className="rounded-3xl border border-white/5 bg-[#080b13]/70 px-4 py-3 shadow-[0_25px_60px_rgba(0,0,0,0.35)] backdrop-blur">
          <WorkflowTabsNavigation 
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </section>

        <div className="space-y-6">
          {activeTab === 'overview' && project && (
            <ProjectOverview project={project} workflowData={workflowData} />
          )}
          
          {activeTab === 'rab-workflow' && project && (
            <ProjectRABWorkflow projectId={id} project={project} onDataChange={fetchProject} />
          )}
          
          {activeTab === 'rab-realization' && project && (
            <RealizationTracker projectId={id} project={project} />
          )}
          
          {activeTab === 'purchase-orders' && project && (
            <PurchaseOrdersManager 
              projectId={id} 
              project={project} 
              onDataChange={fetchProject}
            />
          )}
          
          {activeTab === 'work-orders' && project && (
            <WorkOrdersManager 
              projectId={id} 
              project={project} 
              onDataChange={fetchProject}
            />
          )}
          
          {activeTab === 'budget-monitoring' && project && (
            <ProjectBudgetMonitoring projectId={id} project={project} onDataChange={fetchProject} />
          )}

          {activeTab === 'approval-status' && project && (
            <ProfessionalApprovalDashboard 
              projectId={id} 
              project={project} 
              onDataChange={fetchProject}
            />
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
