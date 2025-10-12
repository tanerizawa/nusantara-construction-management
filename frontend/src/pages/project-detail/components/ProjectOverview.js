import React from 'react';
import { DollarSign, Users, FileText, Calendar, MapPin, TrendingUp, Edit, ExternalLink } from 'lucide-react';
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
      console.log('RAB Items Count:', project.rabItems?.length);
      console.log('PO Count:', workflowData.purchaseOrders?.length);
      
      if (project.rabItems?.length > 0) {
        const sampleRAB = project.rabItems[0];
        console.log('Sample RAB Item:', {
          id: sampleRAB.id,
          description: sampleRAB.description,
          totalPrice: sampleRAB.totalPrice,
          amount: sampleRAB.amount,
          status: sampleRAB.status,
          isApproved: sampleRAB.isApproved
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
    <div className="space-y-4">
      {/* Project Stats Cards - Responsive Grid - Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Budget Card */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#30D158]/20 rounded-lg">
                <DollarSign className="h-5 w-5 text-[#30D158]" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E93]">Budget Utilization</p>
                <p className="text-lg font-semibold text-white">{budgetUtilization}%</p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#38383A]">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-[#38383A] rounded-full h-2 overflow-hidden">
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
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-[#98989D]">Terpakai:</span>
              <span className="text-xs text-white font-medium">
                {formatCurrency(workflowData?.budgetSummary?.actualSpent || 0)}
              </span>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-xs text-[#98989D]">Total Budget:</span>
              <span className="text-xs text-[#8E8E93]">
                {formatCurrency(project.totalBudget || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Project Progress Card */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#0A84FF]/20 rounded-lg">
                <TrendingUp className="h-5 w-5 text-[#0A84FF]" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E93]">Project Progress</p>
                <p className="text-lg font-semibold text-white">{projectProgress}%</p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#38383A]">
            {/* Progress Bar */}
            <div className="w-full bg-[#38383A] rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-[#0A84FF] rounded-full transition-all duration-500"
                style={{ width: `${projectProgress}%` }}
              />
            </div>
            <p className="text-xs text-[#98989D] mt-2">Kelengkapan tahapan workflow</p>
          </div>
        </div>

        {/* Team Card */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#BF5AF2]/20 rounded-lg">
                <Users className="h-5 w-5 text-[#BF5AF2]" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E93]">Anggota Tim</p>
                <p className="text-lg font-semibold text-white">{project.teamMembers?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#38383A]">
            <p className="text-xs text-[#98989D]">Tim Aktif</p>
          </div>
        </div>

        {/* Documents Card */}
        <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-[#FF9F0A]/20 rounded-lg">
                <FileText className="h-5 w-5 text-[#FF9F0A]" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E93]">Dokumen</p>
                <p className="text-lg font-semibold text-white">{project.documents?.length || 0}</p>
              </div>
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-[#38383A]">
            <p className="text-xs text-[#98989D]">File Terlampir</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-4">
          {/* Project Information */}
          <ProjectInformationCard project={project} />

          {/* Project Description */}
          {project.description && (
            <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
              <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
                <h3 className="text-base font-semibold text-white">Deskripsi Proyek</h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-[#98989D] leading-relaxed whitespace-pre-wrap break-words">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* Workflow Stages - Project Flow Route */}
          <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
            <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
              <h3 className="text-base font-semibold text-white flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-[#30D158]" />
                Alur Tahapan Proyek
              </h3>
            </div>
            <div className="p-4">
              <WorkflowStagesCard workflowData={workflowData} project={project} />
            </div>
          </div>
        </div>

        {/* Right Column - Summary Cards */}
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
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
      <div className="px-4 py-3 bg-[#1C1C1E] border-b border-[#38383A]">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-[#0A84FF]" />
            Informasi Proyek
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleViewContract}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-[#8E8E93] bg-[#2C2C2E] border border-[#38383A] rounded-lg hover:bg-[#38383A] hover:text-white transition-colors"
              title="Lihat kontrak proyek"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Kontrak
            </button>
            <button
              onClick={handleEditProject}
              className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-white bg-[#0A84FF] rounded-lg hover:bg-[#0A84FF]/80 transition-colors"
              title="Edit informasi proyek"
            >
              <Edit className="h-3.5 w-3.5 mr-1.5" />
              Edit Proyek
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Nama Proyek</label>
              <h2 className="text-lg font-bold text-white break-words word-wrap">
                {project.name || project.title || 'Nama proyek tidak tersedia'}
              </h2>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Kode Proyek</label>
              <p className="text-sm font-semibold text-white bg-[#1C1C1E] px-3 py-2 rounded-lg border border-[#38383A]">
                {project.code || project.id || '-'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Jenis Proyek</label>
              <p className="text-sm text-white">
                {project.type || project.category || 'Konstruksi Umum'}
              </p>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Klien</label>
              <div className="text-sm text-white">
                {renderClientInfo(project.client, project.clientName)}
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Lokasi Proyek</label>
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-[#8E8E93] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-white break-words word-wrap leading-relaxed">
                  {renderLocationInfo(project.location)}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Durasi Proyek</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-[#8E8E93]" />
                <p className="text-sm text-white">
                  {project.startDate && project.endDate ? (
                    <>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      <span className="ml-2 text-xs text-[#636366]">
                        ({calculateDaysDifference(project.startDate, project.endDate)} hari)
                      </span>
                    </>
                  ) : 'Tanggal belum ditentukan'}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-[#8E8E93] mb-1">Status Saat Ini</label>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                  {getStatusText(project.status)}
                </span>
              </div>
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

const getStatusColor = (status) => {
  const colorMap = {
    active: 'bg-[#30D158]/20 text-[#30D158]',
    planning: 'bg-[#0A84FF]/20 text-[#0A84FF]',
    'on-hold': 'bg-[#FF9F0A]/20 text-[#FF9F0A]',
    completed: 'bg-[#8E8E93]/20 text-[#8E8E93]'
  };
  return colorMap[status] || 'bg-[#8E8E93]/20 text-[#8E8E93]';
};

const getStatusText = (status) => {
  const textMap = {
    active: 'Aktif',
    planning: 'Perencanaan',
    'on-hold': 'Ditunda',
    completed: 'Selesai'
  };
  return textMap[status] || 'Tidak Diketahui';
};

export default ProjectOverview;
