import React from 'react';
import { DollarSign, Users, FileText, MapPin, TrendingUp, Edit, ExternalLink } from 'lucide-react';
import { CalendarIconWhite } from '../../../components/ui/CalendarIcon';
import { formatCurrency, formatDate, calculateDaysDifference, calculateBudgetUtilization, calculateProjectProgress } from '../utils';
import FinancialSummary from './FinancialSummary';
import QuickStats from './QuickStats';
import RecentActivity from './RecentActivity';
import WorkflowStagesCard from './WorkflowStagesCard';

/**
 * ProjectOverview Component
 * Main overview display with project information, stats, and workflow stages
 * 
 * UPDATED (Oct 11, 2025):
 * - Fixed budget calculation to use correct field names
 * - Added debug logging for troubleshooting
 * - Enhanced null safety checks
 */
const ProjectOverview = ({ project, workflowData }) => {
  // Debug logging
  React.useEffect(() => {
    if (project && workflowData) {
      console.log('=== ProjectOverview Debug ===');
      console.log('Project Budget:', project.budget || project.totalBudget);
      console.log('Budget Summary:', workflowData.budgetSummary);
      console.log('RAP Items Count:', project.rabItems?.length);
      console.log('PO Count:', workflowData.purchaseOrders?.length);
      
      if (project.rabItems?.length > 0) {
        const sampleRAP = project.rabItems[0];
        console.log('Sample RAP Item:', {
          id: sampleRAP.id,
          description: sampleRAP.description,
          totalPrice: sampleRAP.totalPrice,
          amount: sampleRAP.amount,
          status: sampleRAP.status,
          isApproved: sampleRAP.isApproved
        });
      }
    }
  }, [project, workflowData]);

  // Safety check - if project is null/undefined, show loading or error state
  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-[#8E8E93]">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  const budgetUtilization = calculateBudgetUtilization(
    project.totalBudget,
    workflowData?.budgetSummary?.actualSpent || 0
  );

  const projectProgress = calculateProjectProgress(workflowData, project);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-br from-[#34d399]/30 to-[#22c55e]/20 p-2">
                <DollarSign className="h-5 w-5 text-[#bbf7d0]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Budget Utilization</p>
                <p className="text-lg font-semibold text-white">{budgetUtilization}%</p>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="mb-3">
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    budgetUtilization > 90 ? 'bg-[#FF453A]' :
                    budgetUtilization > 75 ? 'bg-[#FF9F0A]' :
                    'bg-[#30D158]'
                  }`}
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                />
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-white/60">
              <span>Terpakai</span>
              <span className="font-semibold text-white">
                {formatCurrency(workflowData?.budgetSummary?.actualSpent || 0)}
              </span>
            </div>
            <div className="flex justify-between text-xs text-white/60">
              <span>Total Budget</span>
              <span className="text-white/70">
                {formatCurrency(project.totalBudget || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-br from-[#60a5fa]/30 to-[#6366f1]/20 p-2">
                <TrendingUp className="h-5 w-5 text-[#c7d2fe]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Project Progress</p>
                <p className="text-lg font-semibold text-white">{projectProgress}%</p>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#60a5fa] to-[#a855f7] transition-all duration-500"
                style={{ width: `${projectProgress}%` }}
              />
            </div>
            <p className="text-xs text-white/60">Kelengkapan tahapan workflow</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-br from-[#c084fc]/30 to-[#a855f7]/20 p-2">
                <Users className="h-5 w-5 text-[#f3e8ff]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Anggota Tim</p>
                <p className="text-lg font-semibold text-white">{project.teamMembers?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-2">
            <p className="text-xs text-white/60">Tim aktif saat ini</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="rounded-2xl bg-gradient-to-br from-[#fbbf24]/30 to-[#f59e0b]/20 p-2">
                <FileText className="h-5 w-5 text-[#fef3c7]" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">Dokumen</p>
                <p className="text-lg font-semibold text-white">{project.documents?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 border-t border-white/10 pt-2">
            <p className="text-xs text-white/60">File terlampir</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <ProjectInformationCard project={project} />

          {project.description && (
            <div className="rounded-3xl border border-white/5 bg-white/5 p-5 shadow-[0_15px_35px_rgba(0,0,0,0.35)]">
              <h3 className="text-base font-semibold text-white">Deskripsi Proyek</h3>
              <p className="mt-3 text-sm leading-relaxed text-white/70 whitespace-pre-wrap break-words">
                {project.description}
              </p>
            </div>
          )}

          <div className="overflow-hidden rounded-3xl border border-white/5 bg-white/5">
            <div className="flex items-center border-b border-white/10 px-5 py-3 text-white">
              <CalendarIconWhite size={16} className="mr-2 text-[#30D158]" />
              <h3 className="text-base font-semibold">Alur Tahapan Proyek</h3>
            </div>
            <div className="p-5">
              <WorkflowStagesCard workflowData={workflowData} project={project} />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <FinancialSummary project={project} workflowData={workflowData} />
          <QuickStats project={project} workflowData={workflowData} />
          <RecentActivity project={project} workflowData={workflowData} />
        </div>
      </div>
    </div>
  );
};

/**
 * Project Information Card Component
 * Displays detailed project information with action buttons
 * 
 * UPDATED (Oct 11, 2025):
 * - Added Edit Project and View Contract action buttons
 * - Improved interactivity and navigation
 */
const ProjectInformationCard = ({ project }) => {
  const handleEditProject = () => {
    // Navigate to project edit page
    window.location.href = `/admin/projects/${project.id}/edit`;
  };

  const handleViewContract = () => {
    // Navigate to contracts page
    window.location.href = `/admin/contracts?project=${project.id}`;
  };

  return (
    <div className="rounded-3xl border border-white/5 bg-white/5 shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="flex items-center text-base font-semibold text-white">
          <CalendarIconWhite size={16} className="mr-2 text-[#60a5fa]" />
          Informasi Proyek
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleViewContract}
            className="inline-flex items-center rounded-2xl border border-white/10 px-3 py-1.5 text-xs font-semibold text-white/70 transition hover:border-white/30 hover:text-white"
            title="Lihat kontrak proyek"
          >
            <ExternalLink className="mr-1.5 h-3.5 w-3.5" />
            Kontrak
          </button>
          <button
            onClick={handleEditProject}
            className="inline-flex items-center rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-3 py-1.5 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.35)] transition hover:brightness-110"
            title="Edit informasi proyek"
          >
            <Edit className="mr-1.5 h-3.5 w-3.5" />
            Edit Proyek
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Nama Proyek</label>
            <h2 className="mt-1 text-lg font-semibold text-white break-words">
              {project.name || project.title || 'Nama proyek tidak tersedia'}
            </h2>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Kode Proyek</label>
            <p className="mt-1 rounded-2xl border border-white/10 bg-[#05070d] px-3 py-2 text-sm font-semibold text-white">
              {project.code || project.id || '-'}
            </p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Jenis Proyek</label>
            <p className="mt-1 text-sm text-white/80">
              {project.type || project.category || 'Konstruksi Umum'}
            </p>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Subsidiary</label>
            <div className="mt-1 rounded-2xl border border-white/10 bg-[#05070d] px-3 py-2">
              <p className="text-sm font-semibold text-white">
                {project.subsidiaryInfo?.name || project.subsidiary?.name || 'Tidak ada subsidiary'}
              </p>
              {(project.subsidiaryInfo?.code || project.subsidiary?.code) && (
                <p className="text-xs text-white/50">
                  Kode: {project.subsidiaryInfo?.code || project.subsidiary?.code}
                </p>
              )}
              {(project.subsidiaryInfo?.specialization || project.subsidiary?.specialization) && (
                <p className="text-xs text-white/60">{project.subsidiaryInfo?.specialization || project.subsidiary?.specialization}</p>
              )}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Klien</label>
            <div className="mt-1 text-sm text-white/80">
              {renderClientInfo(project.client, project.clientName)}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Lokasi</label>
            <div className="mt-1 flex items-start gap-2 text-sm text-white/80">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-white/50" />
              <p className="leading-relaxed">
                {renderLocationInfo(project.location)}
              </p>
            </div>
          </div>

          {(project.coordinates?.latitude && project.coordinates?.longitude) && (
            <div>
              <label className="text-xs uppercase tracking-[0.3em] text-white/60">Koordinat GPS</label>
              <div className="mt-1 rounded-2xl border border-white/10 bg-[#05070d] px-3 py-2 text-sm text-white">
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Latitude</span>
                  <span className="font-mono">{project.coordinates.latitude.toFixed(6)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-white/60">Longitude</span>
                  <span className="font-mono">{project.coordinates.longitude.toFixed(6)}</span>
                </div>
                {project.coordinates.radius && (
                  <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-2 text-white/70">
                    <span>Radius Area</span>
                    <span>{project.coordinates.radius}m</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Durasi</label>
            <div className="mt-1 flex items-center gap-2 text-sm text-white/80">
              <CalendarIconWhite size={16} className="text-white/50" />
              {project.startDate && project.endDate ? (
                <>
                  {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  <span className="text-xs text-white/50">
                    ({calculateDaysDifference(project.startDate, project.endDate)} hari)
                  </span>
                </>
              ) : 'Tanggal belum ditentukan'}
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-white/60">Status</label>
            <div className="mt-1">
              <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusColor(project.status)}`}>
                {getStatusText(project.status)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const renderClientInfo = (client, clientName) => {
  if (typeof client === 'object' && client) {
    if (client.company) {
      return (
        <div className="space-y-1">
          <p className="font-medium break-words">{client.company}</p>
          {client.pic && <p className="text-sm text-[#8E8E93]">PIC: {client.pic}</p>}
          {client.email && <p className="text-sm text-[#8E8E93]">Email: {client.email}</p>}
          {client.phone && <p className="text-sm text-[#8E8E93]">Telepon: {client.phone}</p>}
        </div>
      );
    }
    return client.name || 'Klien tidak diketahui';
  }
  return client || clientName || '-';
};

const renderLocationInfo = (location) => {
  if (typeof location === 'object' && location) {
    return [
      location.address,
      location.city,
      location.state,
      location.country
    ].filter(Boolean).join(', ') || 'Lokasi belum ditentukan';
  }
  return location || 'Lokasi belum ditentukan';
};

const getStatusColor = (rawStatus) => {
  // Normalize backend/legacy variants
  const status = (rawStatus || '').replace('-', '_');
  const colorMap = {
    active: 'bg-[#30D158]/20 text-[#30D158]',
    planning: 'bg-[#0A84FF]/20 text-[#0A84FF]',
    on_hold: 'bg-[#FF9F0A]/20 text-[#FF9F0A]',
    completed: 'bg-[#8E8E93]/20 text-[#8E8E93]'
  };
  return colorMap[status] || 'bg-[#8E8E93]/20 text-[#8E8E93]';
};

const getStatusText = (rawStatus) => {
  const status = (rawStatus || '').replace('-', '_');
  const textMap = {
    active: 'Aktif',
    planning: 'Perencanaan',
    on_hold: 'Ditunda',
    completed: 'Selesai'
  };
  return textMap[status] || 'Tidak Diketahui';
};

export default ProjectOverview;
