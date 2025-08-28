import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Edit, Printer, MapPin, Calendar, DollarSign, Building, User, Users, FileText, AlertTriangle
} from 'lucide-react';
import { MilestoneChart, ProgressBudgetChart } from '../components/ui/Chart';
import ProjectBudgetManager from '../components/ProjectBudgetManager';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/projects/${id}`);
        setProject(res.data.data || res.data);
      } catch (e) {
        setError('Proyek tidak ditemukan atau terjadi kesalahan.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', {
    style: 'currency', currency: 'IDR', minimumFractionDigits: 0
  }).format(amount || 0);

  const formatDate = (date) => date ? new Date(date).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric'
  }) : '-';

  const getStatusBadge = (status) => {
    const map = {
      completed: { text: 'Selesai', cls: 'bg-green-100 text-green-800' },
      in_progress: { text: 'Progres', cls: 'bg-blue-100 text-blue-800' },
      planning: { text: 'Planning', cls: 'bg-yellow-100 text-yellow-800' },
      on_hold: { text: 'On Hold', cls: 'bg-red-100 text-red-800' }
    };
    const cfg = map[status] || map.planning;
    return <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${cfg.cls}`}>{cfg.text}</span>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{error || 'Proyek tidak ditemukan'}</p>
        <Link to="/admin/projects" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Kembali ke Daftar Proyek
        </Link>
      </div>
    );
  }

  const contractValue = project?.budget?.contractValue || project?.budget?.approvedBudget || project?.budget?.total || 0;
  const actualCost = project?.budget?.actualCost || 0;
  const remaining = project?.budget?.remaining ?? (contractValue && actualCost ? (contractValue - actualCost) : null);
  const percentage = typeof project?.progress === 'number' ? project.progress : (project?.progress?.percentage || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <Link to="/admin/projects" className="text-gray-500 hover:text-gray-700 inline-flex items-center">
              <ArrowLeft size={18} className="mr-1" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{project.name}</h1>
            {getStatusBadge(project.status)}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-600">
            <span className="inline-flex items-center"><Building size={16} className="mr-1" /> {project.client?.company || '-'}</span>
            <span className="inline-flex items-center"><MapPin size={16} className="mr-1" /> {project.location?.city}, {project.location?.province}</span>
            <span className="inline-flex items-center"><Calendar size={16} className="mr-1" /> {formatDate(project.timeline?.startDate)} — {formatDate(project.timeline?.endDate)}</span>
            {project.projectCode && (
              <span className="inline-flex items-center bg-gray-100 text-gray-700 px-2 py-0.5 rounded">{project.projectCode}</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 inline-flex items-center">
            <Printer size={16} className="mr-1.5" /> Cetak
          </button>
          <button className="bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 inline-flex items-center">
            <Edit size={16} className="mr-1.5" /> Edit
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: Building },
              { id: 'budget', name: 'Budget Management', icon: DollarSign },
              { id: 'team', name: 'Team & Resources', icon: Users },
              { id: 'documents', name: 'Documents', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Project Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Progress Overview */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Proyek</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Kemajuan Keseluruhan</span>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Budget Chart */}
                <ProgressBudgetChart
                  total={contractValue}
                  spent={actualCost}
                  timeline={project.timeline}
                />

                {/* Project Description */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi Proyek</h3>
                  <p className="text-gray-600">
                    {project.description || 'Proyek konstruksi di wilayah Karawang dengan standar kualitas tinggi dan tepat waktu.'}
                  </p>
                </div>

                {/* Milestones */}
                <MilestoneChart
                  milestones={project.milestones || []}
                  projectTimeline={project.timeline}
                />
              </div>

              {/* Right Column - Side Information */}
              <div className="space-y-6">
                {/* Client Information */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Klien</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Perusahaan</p>
                      <p className="text-sm font-medium">{project.client?.company || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Kontak Person</p>
                      <p className="text-sm font-medium">{project.client?.contactPerson || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Telepon</p>
                      <p className="text-sm font-medium">{project.client?.phone || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm font-medium">{project.client?.email || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Alamat</p>
                      <p className="text-sm font-medium">{project.client?.address || project.location?.address || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Budget Summary */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Ringkasan Budget</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Nilai Kontrak</span>
                      <span className="font-bold text-gray-900">{formatCurrency(contractValue)}</span>
                    </div>
                    {project.budget?.approvedBudget && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Budget Disetujui</span>
                        <span className="font-medium">{formatCurrency(project.budget.approvedBudget)}</span>
                      </div>
                    )}
                    {project.budget?.actualCost != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Biaya Aktual</span>
                        <span className="font-medium text-blue-600">{formatCurrency(actualCost)}</span>
                      </div>
                    )}
                    {remaining != null && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Sisa</span>
                        <span className={`font-bold ${remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(remaining)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'budget' && (
            <ProjectBudgetManager 
              projectId={project.id} 
              initialBudget={contractValue}
            />
          )}

          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tim Proyek</h3>
                <div className="space-y-4">
                  {project.team?.projectManager && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Project Manager</p>
                        <p className="text-sm text-gray-600">{project.team.projectManager}</p>
                      </div>
                    </div>
                  )}
                  {project.team?.siteSupervisor && (
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Site Supervisor</p>
                        <p className="text-sm text-gray-600">{project.team.siteSupervisor}</p>
                      </div>
                    </div>
                  )}
                  {Array.isArray(project.team?.teamMembers) && project.team.teamMembers.length > 0 && (
                    <div className="space-y-2">
                      <p className="font-medium text-gray-900">Team Members</p>
                      <div className="grid grid-cols-2 gap-2">
                        {project.team.teamMembers.map((member, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <span className="text-sm text-gray-700">{member}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Risks */}
              {Array.isArray(project.risks) && project.risks.length > 0 && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Risiko & Mitigasi</h3>
                  <div className="space-y-3">
                    {project.risks.map((r) => (
                      <div key={r.id || r.description} className="p-4 rounded-lg border border-gray-200 bg-white">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">{r.description}</div>
                            <div className="text-xs text-gray-500 capitalize mt-1">
                              Dampak: {r.impact} • Probabilitas: {r.probability}
                            </div>
                            {r.mitigation && (
                              <div className="text-sm text-gray-700 mt-2">
                                <span className="font-medium">Mitigasi:</span> {r.mitigation}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dokumen Proyek</h3>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Fitur manajemen dokumen akan segera hadir</p>
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Dokumen
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
