import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { 
  X, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Building2, 
  Users, 
  Target, 
  Clock,
  FileText,
  Edit3,
  Archive,
  Trash2,
  ExternalLink,
  Download,
  CheckCircle,
  AlertCircle,
  Activity
} from 'lucide-react';
import Button from './Button';
import Card from './Card';
import { formatLocation, formatAddress } from '../../utils/locationUtils';

/**
 * PROFESSIONAL PROJECT DETAIL MODAL
 * Comprehensive project view with all essential information
 */
const ProjectDetailModal = ({ 
  isOpen, 
  onClose, 
  project,
  onEdit,
  onArchive,
  onDelete,
  onViewFull
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!isOpen || !project) {
    return null;
  }

  // Helper functions
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Rp 0';
    const numericAmount = parseFloat(amount);
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numericAmount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',  
      day: 'numeric'
    });
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      planning: { 
        color: 'bg-slate-100 text-slate-800 border-slate-300',
        icon: Clock,
        text: 'Perencanaan'
      },
      active: { 
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Activity,
        text: 'Berlangsung'
      },
      in_progress: { 
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        icon: Activity,
        text: 'Berlangsung'
      },
      completed: { 
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: CheckCircle,
        text: 'Selesai'
      },
      on_hold: { 
        color: 'bg-amber-100 text-amber-800 border-amber-300',
        icon: AlertCircle,
        text: 'Ditunda'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800 border-red-300',
        icon: X,
        text: 'Dibatalkan'
      },
      archived: { 
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        icon: Archive,
        text: 'Diarsipkan'
      }
    };
    return statusMap[status] || statusMap.planning;
  };

  const getPriorityConfig = (priority) => {
    const priorityMap = {
      urgent: { 
        color: 'bg-red-100 text-red-800 border-red-300',
        text: 'Mendesak'
      },
      high: { 
        color: 'bg-orange-100 text-orange-800 border-orange-300',
        text: 'Tinggi'
      },
      medium: { 
        color: 'bg-blue-100 text-blue-800 border-blue-300',
        text: 'Sedang'
      },
      low: { 
        color: 'bg-green-100 text-green-800 border-green-300',
        text: 'Rendah'
      }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const StatusIcon = statusConfig.icon;

  const tabs = [
    { id: 'overview', label: 'Ringkasan', icon: FileText },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'team', label: 'Tim', icon: Users },
    { id: 'documents', label: 'Dokumen', icon: FileText }
  ];

  const modalContent = (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div 
        className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <StatusIcon className="w-6 h-6" />
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusConfig.color}`}>
                  {statusConfig.text}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${priorityConfig.color}`}>
                  {priorityConfig.text}
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-2 leading-tight">
                {project.name}
              </h2>
              <p className="text-blue-100 text-sm">
                {project.clientName} • {formatLocation(project.location, 'Lokasi belum ditentukan')}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <Button
                onClick={() => onViewFull?.(project)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                title="Lihat Detail Lengkap"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Description */}
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
                  Deskripsi Proyek
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {project.description || 'Tidak ada deskripsi tersedia.'}
                </p>
              </Card>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Budget</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatCurrency(project.budget)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Deadline</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatDate(project.endDate)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {project.progress || 0}%
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Location & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Lokasi
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p>{formatAddress(project.location, 'Alamat belum ditentukan')}</p>
                    {project.location?.postalCode?.trim() && (
                      <p>{project.location.postalCode}</p>
                    )}
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Kontak Klien
                  </h3>
                  <div className="space-y-2 text-gray-600 dark:text-gray-300">
                    <p className="font-medium">{project.clientContact?.name}</p>
                    <p>{project.clientContact?.position}</p>
                    <p>{project.clientContact?.email}</p>
                    <p>{project.clientContact?.phone}</p>
                  </div>
                </Card>
              </div>

              {/* Subsidiary Info */}
              {(project.subsidiary || project.subsidiaryInfo) && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    Anak Perusahaan
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {project.subsidiary?.name || project.subsidiaryInfo?.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        Spesialisasi: {project.subsidiary?.specialization || project.subsidiaryInfo?.specialization}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm font-medium">
                      {project.subsidiary?.code || project.subsidiaryInfo?.code}
                    </span>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-6">
              <Card className="p-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                  Jadwal Proyek
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tanggal Mulai</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatDate(project.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tanggal Selesai</p>
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      {formatDate(project.endDate)}
                    </p>
                  </div>
                </div>
              </Card>

              {/* Milestones */}
              {project.milestones && project.milestones.length > 0 && (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Milestone
                  </h3>
                  <div className="space-y-3">
                    {project.milestones.map((milestone, index) => (
                      <div key={milestone.id || index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {milestone.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Target: {formatDate(milestone.targetDate)}
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${milestone.status === 'completed' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                          {milestone.status === 'completed' ? 'Selesai' : 'Pending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* Team Tab */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              {project.team && project.team.length > 0 ? (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Tim Proyek
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {project.team.map((member, index) => (
                      <div key={member.id || index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center font-medium">
                          {member.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {member.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                            {member.role || member.position}
                          </p>
                          {member.isProjectManager && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                              Project Manager
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Belum Ada Tim
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Tim proyek belum ditentukan
                  </p>
                </Card>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="space-y-6">
              {project.documents && project.documents.length > 0 ? (
                <Card className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                    Dokumen Proyek
                  </h3>
                  <div className="space-y-3">
                    {project.documents.map((doc, index) => (
                      <div key={doc.id || index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {doc.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {doc.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${doc.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : doc.status === 'in_progress'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                            {doc.status}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-blue-600 dark:text-blue-400"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : (
                <Card className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    Belum Ada Dokumen
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Dokumen proyek belum diunggah
                  </p>
                </Card>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Dibuat: {formatDate(project.createdAt)}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onEdit?.(project)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </Button>
              {project.status !== 'archived' && (
                <Button
                  onClick={() => onArchive?.(project)}
                  variant="outline"
                  className="flex items-center gap-2 text-amber-600 border-amber-300 hover:bg-amber-50"
                >
                  <Archive className="w-4 h-4" />
                  Archive
                </Button>
              )}
              <Button
                onClick={() => onDelete?.(project)}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default ProjectDetailModal;
