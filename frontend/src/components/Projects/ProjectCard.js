import React, { memo } from 'react';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  Edit3,
  Archive,
  Trash2,
  Users,
  Eye,
  Briefcase,
  CalendarDays,
  Target,
  ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { safeRender, formatLocation } from '../../utils/locationUtils';

/**
 * PROFESSIONAL PROJECT CARD 
 * Following Enterprise Design System Best Practices
 * Material Design 3.0 + Apple HIG Compliant
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
  // Enterprise Status System
  const getStatusConfig = (status) => {
    const statusMap = {
      planning: { 
        color: 'bg-slate-50 border-slate-200 text-slate-700',
        badge: 'bg-slate-500',
        text: 'Perencanaan',
        priority: 1
      },
      active: { 
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        badge: 'bg-blue-500',
        text: 'Berlangsung',
        priority: 2
      },
      in_progress: { 
        color: 'bg-blue-50 border-blue-200 text-blue-700',
        badge: 'bg-blue-500',
        text: 'Berlangsung',
        priority: 2
      },
      completed: { 
        color: 'bg-emerald-50 border-emerald-200 text-emerald-700',
        badge: 'bg-emerald-500',
        text: 'Selesai',
        priority: 3
      },
      on_hold: { 
        color: 'bg-amber-50 border-amber-200 text-amber-700',
        badge: 'bg-amber-500',
        text: 'Ditunda',
        priority: 0
      },
      cancelled: { 
        color: 'bg-red-50 border-red-200 text-red-700',
        badge: 'bg-red-500',
        text: 'Dibatalkan',
        priority: 0
      },
      archived: { 
        color: 'bg-gray-50 border-gray-200 text-gray-600',
        badge: 'bg-gray-400',
        text: 'Diarsipkan',
        priority: 0
      }
    };
    return statusMap[status] || statusMap.planning;
  };

  // Enterprise Priority System
  const getPriorityConfig = (priority) => {
    const priorityMap = {
      critical: { 
        icon: Target, 
        color: 'text-red-600', 
        bg: 'bg-red-50 border-red-200', 
        label: 'Kritis',
        weight: 4
      },
      high: { 
        icon: Briefcase, 
        color: 'text-orange-600', 
        bg: 'bg-orange-50 border-orange-200', 
        label: 'Tinggi',
        weight: 3
      },
      medium: { 
        icon: Clock, 
        color: 'text-blue-600', 
        bg: 'bg-blue-50 border-blue-200', 
        label: 'Sedang',
        weight: 2
      },
      low: { 
        icon: Users, 
        color: 'text-green-600', 
        bg: 'bg-green-50 border-green-200', 
        label: 'Rendah',
        weight: 1
      }
    };
    return priorityMap[priority] || priorityMap.medium;
  };

  // Full Currency Formatter - Show complete amount without abbreviation
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Rp 0';
    
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Enhanced Date Formatter - Clear start and end dates
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateString.slice(0, 10);
    }
  };

  // Format date range for project timeline
  const formatDateRange = (startDate, endDate) => {
    if (!startDate && !endDate) return '-';
    
    const start = startDate ? formatDate(startDate) : '-';
    const end = endDate ? formatDate(endDate) : '-';
    
    if (startDate && endDate) {
      return `${start} - ${end}`;
    } else if (startDate) {
      return `Mulai: ${start}`;
    } else if (endDate) {
      return `Berakhir: ${end}`;
    }
    
    return '-';
  };

  // Note: safeRender and formatLocation functions are now imported from utils

  // Enterprise Progress Analytics
  const getProgressAnalytics = (percentage) => {
    const progress = Math.max(0, Math.min(100, percentage || 0));
    
    if (progress >= 95) return { 
      color: 'bg-emerald-500', 
      status: 'Hampir Selesai', 
      trend: 'Excellent',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-700'
    };
    if (progress >= 80) return { 
      color: 'bg-blue-500', 
      status: 'Berjalan Baik', 
      trend: 'Good',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    };
    if (progress >= 60) return { 
      color: 'bg-indigo-500', 
      status: 'Dalam Progress', 
      trend: 'Normal',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-700'
    };
    if (progress >= 30) return { 
      color: 'bg-amber-500', 
      status: 'Perlu Perhatian', 
      trend: 'Warning',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-700'
    };
    
    return { 
      color: 'bg-red-500', 
      status: 'Butuh Tindakan', 
      trend: 'Critical',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    };
  };

  // Get configurations
  const statusConfig = getStatusConfig(project.status);
  const priorityConfig = getPriorityConfig(project.priority);
  const progressAnalytics = getProgressAnalytics(project.progress?.percentage || project.progress);

  // Professional Event Handlers with Error Boundaries
  const handleViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onView?.(project);
    } catch (error) {
      console.error('Error viewing project:', error);
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onEdit?.(project);
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  const handleArchiveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onArchive?.(project);
    } catch (error) {
      console.error('Error archiving project:', error);
    }
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      onDelete?.(project);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  return (
    <Card className={`group relative overflow-hidden
                     bg-white dark:bg-slate-800 
                     border border-gray-200 dark:border-gray-700
                     hover:border-blue-300 dark:hover:border-blue-500
                     hover:shadow-lg dark:hover:shadow-slate-900/25
                     transition-all duration-200 ease-out
                     transform hover:scale-[1.01]
                     ${className}`}>
      
      {/* Status Indicator */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
      
      {/* Optimized Content Layout - Compact but readable */}
      <div className="p-4">
        {/* Header Row - Enhanced layout for better readability */}
        <div className="mb-3">
          {/* Status Badge - Top Right */}
          <div className="flex justify-end mb-2">
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full 
                            text-xs font-medium border ${statusConfig.color} shrink-0 shadow-sm`}>
              <div className={`w-2 h-2 rounded-full ${statusConfig.badge}`} />
              <span className="text-xs font-medium">{statusConfig.text}</span>
            </div>
          </div>
          
          {/* Project Name - Enhanced typography */}
          <h3 className="text-base font-semibold text-gray-900 dark:text-white 
                         leading-snug group-hover:text-blue-600 
                         dark:group-hover:text-blue-400 transition-colors duration-200
                         cursor-pointer break-words hyphens-auto line-clamp-2"
              onClick={handleViewClick}
              title={safeRender(project.name, 'Unnamed Project')}>
            {safeRender(project.name, 'Unnamed Project')}
          </h3>
        </div>

        {/* Metadata Row - Enhanced with better spacing */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs font-medium">
            {safeRender(project.projectCode || project.id, 'NO-CODE')}
          </span>
          {project.client?.company && (
            <span className="truncate max-w-24 flex-shrink-0 text-xs" title={safeRender(project.client.company)}>
              {safeRender(project.client.company)}
            </span>
          )}
          {(project.subsidiary?.code || project.subsidiaryInfo?.code) && (
            <span 
              className="text-blue-600 dark:text-blue-400 font-medium text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md border border-blue-200" 
              title={`Anak Perusahaan: ${project.subsidiary?.name || project.subsidiaryInfo?.name || ''}\nSpesialisasi: ${project.subsidiary?.specialization || project.subsidiaryInfo?.specialization || 'N/A'}`}
            >
                            <span className="text-xs font-medium">
                {safeRender(project.subsidiary?.code || project.subsidiaryInfo?.code)}
              </span>
            </span>
          )}
        </div>

        {/* Budget Section - Moved above subsidiary for better space utilization */}
        {(project.budget?.contractValue || project.budget?.total || project.budget) && (
          <div className="mb-3 p-2.5 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-100 dark:border-green-800">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-600 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-green-600 dark:text-green-400 font-medium">Nilai Proyek</div>
                <div className="font-bold text-green-700 dark:text-green-300 text-sm truncate" 
                     title={formatCurrency(project.budget?.contractValue || project.budget?.total || project.budget)}>
                  {formatCurrency(project.budget?.contractValue || project.budget?.total || project.budget)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Subsidiary Information */}
        {(project.subsidiary || project.subsidiaryInfo) && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-blue-500" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate">
                  {safeRender(project.subsidiary?.name || project.subsidiaryInfo?.name, 'Unknown Subsidiary')}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                  {safeRender(project.subsidiary?.specialization || project.subsidiaryInfo?.specialization, 'General')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Grid - Enhanced spacing and readability */}
        <div className="space-y-2.5 mb-3">
          {/* Row 1: Location Only (Budget moved above) */}
          <div className="flex items-center gap-3 text-sm">
            {/* Location - Enhanced display with proper object handling */}
            {project.location && (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <MapPin className="w-4 h-4 text-gray-500 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 truncate text-sm font-medium">
                  {formatLocation(project.location, 'Lokasi belum ditentukan')}
                </span>
              </div>
            )}
          </div>
          
          {/* Row 2: Timeline and Priority */}
          <div className="flex items-center justify-between gap-3 text-sm">
            {/* Timeline - Enhanced date range display */}
            {(project.timeline || project.startDate || project.endDate) && (
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <CalendarDays className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-gray-700 dark:text-gray-300 truncate text-sm font-medium" 
                      title={formatDateRange(project.timeline?.startDate || project.startDate, project.timeline?.endDate || project.endDate)}>
                  {formatDateRange(project.timeline?.startDate || project.startDate, project.timeline?.endDate || project.endDate)}
                </span>
              </div>
            )}
            
            {/* Priority - Enhanced Badge */}
            {project.priority && (
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-sm font-medium border
                              ${priorityConfig.bg} ${priorityConfig.color} shrink-0 shadow-sm`}>
                <priorityConfig.icon className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">{priorityConfig.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Progress Section */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-md font-medium ${progressAnalytics.bgColor} ${progressAnalytics.textColor}`}>
                {progressAnalytics.trend}
              </span>
              <span className="text-base font-bold text-gray-900 dark:text-white">
                {Math.round(project.progress?.percentage || project.progress || 0)}%
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${progressAnalytics.color} shadow-sm`}
              style={{ width: `${Math.min(Number(project.progress?.percentage || project.progress || 0), 100)}%` }}
            />
          </div>
        </div>

        {/* Enhanced Action Row with Prominent Detail Button */}
        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600 gap-2">
            {/* Progress Status Text - Left */}
            <span className={`text-xs font-medium ${progressAnalytics.textColor} flex-1 truncate`}>
              {progressAnalytics.status}
            </span>
            
            {/* Enhanced Actions with Prominent Detail Button */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Prominent Detail Button with Glow Effect */}
              <Button
                onClick={handleViewClick}
                variant="default"
                size="sm"
                className="h-7 px-4 bg-blue-600 hover:bg-blue-700 text-white 
                         shadow-lg hover:shadow-xl hover:shadow-blue-500/50 
                         transition-all duration-300 ease-out
                         text-xs font-semibold rounded-md border-0 
                         focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                         hover:scale-105 active:scale-95
                         bg-gradient-to-r from-blue-600 to-blue-700
                         hover:from-blue-700 hover:to-blue-800"
                title="Lihat Detail Proyek"
              >
                <span>Detail</span>
              </Button>
              
              {/* Secondary Action Buttons - Smaller */}
              <Button
                onClick={handleEditClick}
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 text-gray-500 dark:text-gray-400 
                         hover:text-blue-600 dark:hover:text-blue-400 
                         hover:bg-blue-50 dark:hover:bg-blue-900/20 
                         transition-all duration-200 rounded-md border border-gray-200
                         hover:border-blue-300 hover:shadow-sm"
                title="Edit Proyek"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </Button>
              
              {project.status !== 'archived' && (
                <Button
                  onClick={handleArchiveClick}
                  variant="ghost"
                  size="sm"
                  className="w-7 h-7 p-0 text-gray-500 dark:text-gray-400 
                           hover:text-amber-600 dark:hover:text-amber-400 
                           hover:bg-amber-50 dark:hover:bg-amber-900/20 
                           transition-all duration-200 rounded-md border border-gray-200
                           hover:border-amber-300 hover:shadow-sm"
                  title="Arsipkan Proyek"
                >
                  <Archive className="w-3.5 h-3.5" />
                </Button>
              )}
              
              <Button
                onClick={handleDeleteClick}
                variant="ghost"
                size="sm"
                className="w-7 h-7 p-0 text-gray-500 dark:text-gray-400 
                         hover:text-red-600 dark:hover:text-red-400 
                         hover:bg-red-50 dark:hover:bg-red-900/20 
                         transition-all duration-200 rounded-md border border-gray-200
                         hover:border-red-300 hover:shadow-sm"
                title="Hapus Proyek"
              >
                <Trash2 className="w-3.5 h-3.5" />
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
