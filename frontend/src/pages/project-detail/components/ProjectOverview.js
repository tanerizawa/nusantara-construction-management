import React from 'react';
import { DollarSign, Users, FileText, Calendar, Location } from 'lucide-react';
import { formatCurrency, formatDate, calculateDaysDifference, calculateBudgetUtilization } from '../utils';
import FinancialSummary from './FinancialSummary';
import QuickStats from './QuickStats';
import RecentActivity from './RecentActivity';
import WorkflowStagesCard from './WorkflowStagesCard';

/**
 * ProjectOverview Component
 * Main overview display with project information, stats, and workflow stages
 */
const ProjectOverview = ({ project, workflowData }) => {
  // Safety check - if project is null/undefined, show loading or error state
  if (!project) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat data proyek...</p>
        </div>
      </div>
    );
  }

  const budgetUtilization = calculateBudgetUtilization(
    project.totalBudget,
    workflowData.budgetSummary?.actualSpent
  );

  return (
    <div className="space-y-6">
      {/* Project Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Budget Card */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-lg md:text-xl font-bold">{budgetUtilization}%</span>
          </div>
          <h3 className="text-sm md:text-base font-medium">Budget Terpakai</h3>
          <p className="text-xs md:text-sm opacity-90 mt-1 truncate">
            {formatCurrency(workflowData.budgetSummary?.actualSpent || 0)}
          </p>
        </div>

        {/* Team Card */}
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Users className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-2xl md:text-3xl font-bold">{project.teamMembers?.length || 0}</span>
          </div>
          <h3 className="text-sm md:text-base font-medium">Anggota Tim</h3>
          <p className="text-xs md:text-sm opacity-90 mt-1">Tim Aktif</p>
        </div>

        {/* Documents Card */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 md:p-6 text-white shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <FileText className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <span className="text-2xl md:text-3xl font-bold">{project.documents?.length || 0}</span>
          </div>
          <h3 className="text-sm md:text-base font-medium">Dokumen</h3>
          <p className="text-xs md:text-sm opacity-90 mt-1">File Terlampir</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Project Information */}
          <ProjectInformationCard project={project} />

          {/* Project Description */}
          {project.description && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Deskripsi Proyek</h3>
              </div>
              <div className="p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                  {project.description}
                </p>
              </div>
            </div>
          )}

          {/* Workflow Stages - Project Flow Route */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-green-600" />
                Alur Tahapan Proyek
              </h3>
            </div>
            <div className="p-6">
              <WorkflowStagesCard workflowData={workflowData} project={project} />
            </div>
          </div>
        </div>

        {/* Right Column - Summary Cards */}
        <div className="space-y-6">
          <FinancialSummary project={project} workflowData={workflowData} />
          <QuickStats project={project} workflowData={workflowData} />
          <RecentActivity project={project} />
        </div>
      </div>
    </div>
  );
};

/**
 * Project Information Card Component
 * Displays detailed project information
 */
const ProjectInformationCard = ({ project }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-blue-600" />
          Informasi Proyek
        </h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nama Proyek</label>
              <h2 className="text-xl font-bold text-gray-900 break-words word-wrap">
                {project.name || project.title || 'Nama proyek tidak tersedia'}
              </h2>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Kode Proyek</label>
              <p className="text-base font-semibold text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                {project.code || project.id || '-'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Jenis Proyek</label>
              <p className="text-base text-gray-900">
                {project.type || project.category || 'Konstruksi Umum'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Klien</label>
              <div className="text-base text-gray-900">
                {renderClientInfo(project.client, project.clientName)}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Lokasi Proyek</label>
              <div className="flex items-start space-x-2">
                <Location className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-base text-gray-900 break-words word-wrap leading-relaxed">
                  {renderLocationInfo(project.location)}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Durasi Proyek</label>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p className="text-base text-gray-900">
                  {project.startDate && project.endDate ? (
                    <>
                      {formatDate(project.startDate)} - {formatDate(project.endDate)}
                      <span className="ml-2 text-sm text-gray-500">
                        ({calculateDaysDifference(project.startDate, project.endDate)} hari)
                      </span>
                    </>
                  ) : 'Tanggal belum ditentukan'}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status Saat Ini</label>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
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
          {client.pic && <p className="text-sm text-gray-600">PIC: {client.pic}</p>}
          {client.email && <p className="text-sm text-gray-600">Email: {client.email}</p>}
          {client.phone && <p className="text-sm text-gray-600">Telepon: {client.phone}</p>}
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
    active: 'bg-green-100 text-green-800',
    planning: 'bg-blue-100 text-blue-800',
    'on-hold': 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800'
  };
  return colorMap[status] || 'bg-gray-100 text-gray-800';
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
