import React, { memo } from 'react';
import { 
  Building, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Edit2,
  Archive,
  Trash2,
  Users,
  Eye,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';
import Card from '../ui/Card';

/**
 * Professional Project Card Component
 * Clean, modern design following Material Design and Apple HIG principles
 */
const ProjectCard = memo(({ 
  project, 
  onEdit, 
  onArchive, 
  onDelete,
  onView,
  className = '',
  showActions = true
}) => {
  // Status configuration
  const getStatusConfig = (status) => {
    const configs = {
      planning: { 
        variant: 'secondary', 
        text: 'Perencanaan',
        color: 'bg-slate-100 text-slate-700 border-slate-200',
        dot: 'bg-slate-500'
      },
      in_progress: { 
        variant: 'primary', 
        text: 'Berlangsung',
        color: 'bg-blue-100 text-blue-700 border-blue-200',
        dot: 'bg-blue-500'
      },
      completed: { 
        variant: 'success', 
        text: 'Selesai',
        color: 'bg-green-100 text-green-700 border-green-200',
        dot: 'bg-green-500'
      },
      on_hold: { 
        variant: 'warning', 
        text: 'Ditunda',
        color: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500'
      },
      cancelled: { 
        variant: 'destructive', 
        text: 'Dibatalkan',
        color: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500'
      },
      archived: { 
        variant: 'secondary', 
        text: 'Diarsipkan',
        color: 'bg-gray-100 text-gray-600 border-gray-200',
        dot: 'bg-gray-400'
      }
    };
    return configs[status] || configs.planning;
  };

  // Priority configuration
  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50', label: 'Kritis' },
      high: { icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', label: 'Tinggi' },
      medium: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Sedang' },
      low: { icon: Users, color: 'text-green-600', bg: 'bg-green-50', label: 'Rendah' }
    };
    return configs[priority] || configs.medium;
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get progress color and status
  const getProgressConfig = (percentage) => {
    const progress = percentage || 0;
    if (progress >= 90) return { color: 'bg-green-500', status: 'Hampir Selesai' };
    if (progress >= 70) return { color: 'bg-blue-500', status: 'Sedang Berjalan' };
    if (progress >= 40) return { color: 'bg-yellow-500', status: 'Dalam Progress' };
    return { color: 'bg-red-500', status: 'Perlu Perhatian' };
  };

  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const progressConfig = getProgressConfig(project.progress?.percentage);

  return (
    <Card className={`group relative overflow-hidden bg-white dark:bg-slate-800 
                     border border-gray-200 dark:border-gray-700 
                     hover:border-blue-300 dark:hover:border-blue-600
                     hover:shadow-lg dark:hover:shadow-slate-900/25
                     transition-all duration-300 ease-in-out
                     transform hover:scale-[1.02] ${className}`}>
      
      {/* Status Indicator Bar */}
      <div className={`h-1 w-full ${progressConfig.color}`} />
      
      <div className="p-6 space-y-4">
        {/* Header Section */}
        <div className="space-y-3">
          {/* Title Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white 
                           line-clamp-2 leading-tight group-hover:text-blue-600 
                           dark:group-hover:text-blue-400 transition-colors duration-200">
                {project.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">
                {project.projectCode || 'No Project Code'}
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
              <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`} />
              {statusConfig.text}
            </div>
          </div>
          
          {/* Priority & Description */}
          <div className="space-y-2">
            {project.priority && (
              <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium ${priorityConfig.bg} ${priorityConfig.color}`}>
                <priorityConfig.icon className="w-3 h-3" />
                {priorityConfig.label}
              </div>
            )}
            
            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
              {project.description || 'Tidak ada deskripsi tersedia'}
            </p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 gap-3 py-3 border-t border-gray-100 dark:border-gray-700">
          
          {/* Client */}
          <div className="flex items-center gap-2 text-sm">
            <Building className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-400 font-medium min-w-0 flex-1">
              {project.client?.company || 'No Client'}
            </span>
          </div>
          
          {/* Location */}
          {project.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400 truncate">
                {project.location.city}, {project.location.province}
              </span>
            </div>
          )}
          
          {/* Timeline */}
          {project.timeline && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-600 dark:text-gray-400">
                {formatDate(project.timeline.startDate)} - {formatDate(project.timeline.endDate)}
              </span>
            </div>
          )}
          
          {/* Budget */}
          {project.budget?.contractValue && (
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 dark:text-white font-semibold">
                {formatCurrency(project.budget.contractValue)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Section */}
        <div className="space-y-2 py-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{progressConfig.status}</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {project.progress?.percentage || 0}%
              </span>
            </div>
          </div>
          
          <div className="relative">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-500 ease-out ${progressConfig.color}`}
                style={{ width: `${Math.min(project.progress?.percentage || 0, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Actions Section */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
            {/* View Details Button */}
            <Button
              onClick={() => onView?.(project)}
              variant="ghost"
              size="sm"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 
                       hover:bg-blue-50 dark:hover:bg-blue-900/20 font-medium"
            >
              <Eye className="w-4 h-4 mr-1.5" />
              Lihat Detail
            </Button>
            
            {/* Action Buttons */}
            <div className="flex items-center gap-1">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(project);
                }}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-gray-600 dark:text-gray-400 
                         hover:text-blue-600 dark:hover:text-blue-400 
                         hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                title="Edit Proyek"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              
              {project.status !== 'archived' && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArchive?.(project);
                  }}
                  variant="ghost"
                  size="sm"
                  className="w-8 h-8 p-0 text-gray-600 dark:text-gray-400 
                           hover:text-amber-600 dark:hover:text-amber-400 
                           hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-colors"
                  title="Arsipkan Proyek"
                >
                  <Archive className="w-4 h-4" />
                </Button>
              )}
              
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(project);
                }}
                variant="ghost"
                size="sm"
                className="w-8 h-8 p-0 text-gray-600 dark:text-gray-400 
                         hover:text-red-600 dark:hover:text-red-400 
                         hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                title="Hapus Proyek"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
});

ProjectCard.displayName = 'ProjectCard';

export default ProjectCard;
