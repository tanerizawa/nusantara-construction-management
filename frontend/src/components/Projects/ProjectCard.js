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

  // Ultra-Compact Currency Formatter
  const formatCurrency = (amount) => {
    if (!amount || amount === 0) return 'Rp 0';
    
    // Ultra compact format for card display
    if (amount >= 1000000000) {
      return `Rp ${(amount / 1000000000).toFixed(1)}B`;
    } else if (amount >= 1000000) {
      return `Rp ${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `Rp ${(amount / 1000).toFixed(0)}K`;
    }
    
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  // Ultra-Compact Date Formatter  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      // Ultra compact format for cards
      const month = date.toLocaleDateString('id-ID', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear().toString().slice(-2);
      
      // Show relative time for near dates
      if (diffDays < 0) {
        return `${day} ${month} (${Math.abs(diffDays)}d ago)`;
      } else if (diffDays <= 30) {
        return `${day} ${month} (${diffDays}d)`;
      }
      
      return `${day} ${month} '${year}`;
    } catch (error) {
      return dateString.slice(0, 10);
    }
  };

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
      
      {/* Ultra-Compact Content Layout */}
      <div className="p-3">
        {/* Header Row - Multi-line Layout for Long Project Names */}
        <div className="mb-2">
          {/* Status Badge - Top Right */}
          <div className="flex justify-end mb-1">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full 
                            text-xs font-medium border ${statusConfig.color} shrink-0`}>
              <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.badge}`} />
              <span className="text-xs">{statusConfig.text}</span>
            </div>
          </div>
          
          {/* Project Name - Full Width with Multi-line Support */}
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white 
                         leading-relaxed group-hover:text-blue-600 
                         dark:group-hover:text-blue-400 transition-colors duration-200
                         cursor-pointer break-words hyphens-auto"
              onClick={handleViewClick}
              title={project.name || 'Unnamed Project'}>
            {project.name || 'Unnamed Project'}
          </h3>
        </div>

        {/* Metadata Row - Enhanced with Subsidiary Info */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-2">
          <span className="font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-xs">
            {project.projectCode || project.id || 'NO-CODE'}
          </span>
          {project.client?.company && (
            <span className="truncate max-w-20 flex-shrink-0" title={project.client.company}>
              {project.client.company}
            </span>
          )}
          {(project.subsidiary?.code || project.subsidiaryInfo?.code) && (
            <span 
              className="text-blue-600 dark:text-blue-400 font-medium text-xs px-1.5 py-0.5 bg-blue-50 dark:bg-blue-900/30 rounded-md" 
              title={`Anak Perusahaan: ${project.subsidiary?.name || project.subsidiaryInfo?.name || ''}\nSpesialisasi: ${project.subsidiary?.specialization || project.subsidiaryInfo?.specialization || 'N/A'}`}
            >
              {project.subsidiary?.code || project.subsidiaryInfo?.code}
            </span>
          )}
        </div>

        {/* Enhanced Subsidiary Information */}
        {(project.subsidiary || project.subsidiaryInfo) && (
          <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md border border-blue-100 dark:border-blue-800">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3 h-3 text-blue-500" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-medium text-blue-700 dark:text-blue-300 truncate">
                  {project.subsidiary?.name || project.subsidiaryInfo?.name || 'Unknown Subsidiary'}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 capitalize">
                  {project.subsidiary?.specialization || project.subsidiaryInfo?.specialization || 'General'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dense Information Grid - 2 Rows Maximum */}
        <div className="space-y-1.5 mb-2">
          {/* Row 1: Location, Priority, Budget */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Location - Compact */}
            {project.location && (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <MapPin className="w-3 h-3 text-gray-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate text-xs">
                  {project.location.city}
                </span>
              </div>
            )}
            
            {/* Budget - Always visible, right aligned */}
            {(project.budget?.contractValue || project.budget?.total || project.budget) && (
              <div className="flex items-center gap-1 shrink-0">
                <DollarSign className="w-3 h-3 text-green-500" />
                <span className="font-semibold text-green-600 text-xs">
                  {formatCurrency(project.budget?.contractValue || project.budget?.total || project.budget)}
                </span>
              </div>
            )}
          </div>
          
          {/* Row 2: Timeline, Priority */}
          <div className="flex items-center justify-between gap-2 text-xs">
            {/* Timeline - Compact */}
            {(project.timeline || project.startDate) && (
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <CalendarDays className="w-3 h-3 text-blue-500 shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate text-xs">
                  {formatDate(project.timeline?.endDate || project.endDate)}
                </span>
              </div>
            )}
            
            {/* Priority - Compact Badge */}
            {project.priority && (
              <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs 
                              ${priorityConfig.bg} ${priorityConfig.color} shrink-0`}>
                <priorityConfig.icon className="w-3 h-3" />
                <span className="text-xs">{priorityConfig.label}</span>
              </div>
            )}
          </div>
        </div>

        {/* Ultra-Compact Progress - Single Line */}
        <div className="mb-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-600 dark:text-gray-300">Progress</span>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-1 py-0.5 rounded ${progressAnalytics.bgColor} ${progressAnalytics.textColor}`}>
                {progressAnalytics.trend}
              </span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {project.progress?.percentage || project.progress || 0}%
              </span>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full transition-all duration-500 ${progressAnalytics.color}`}
              style={{ width: `${Math.min(project.progress?.percentage || project.progress || 0, 100)}%` }}
            />
          </div>
        </div>

        {/* Ultra-Compact Action Row */}
        {showActions && (
          <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-600 gap-1">
            {/* Progress Status Text - Left */}
            <span className={`text-xs font-medium ${progressAnalytics.textColor} flex-1 truncate`}>
              {progressAnalytics.status}
            </span>
            
            {/* Action Icons - Right, Icon Only */}
            <div className="flex items-center gap-0.5 shrink-0">
              <Button
                onClick={handleViewClick}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-blue-600 dark:text-blue-400 
                         hover:text-blue-700 dark:hover:text-blue-300 
                         hover:bg-blue-50 dark:hover:bg-blue-900/20 
                         transition-all duration-200 rounded"
                title="Lihat Detail"
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              <Button
                onClick={handleEditClick}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-gray-600 dark:text-gray-400 
                         hover:text-blue-600 dark:hover:text-blue-400 
                         hover:bg-blue-50 dark:hover:bg-blue-900/20 
                         transition-all duration-200 rounded"
                title="Edit"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
              
              {project.status !== 'archived' && (
                <Button
                  onClick={handleArchiveClick}
                  variant="ghost"
                  size="sm"
                  className="w-6 h-6 p-0 text-gray-600 dark:text-gray-400 
                           hover:text-amber-600 dark:hover:text-amber-400 
                           hover:bg-amber-50 dark:hover:bg-amber-900/20 
                           transition-all duration-200 rounded"
                  title="Archive"
                >
                  <Archive className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                onClick={handleDeleteClick}
                variant="ghost"
                size="sm"
                className="w-6 h-6 p-0 text-gray-600 dark:text-gray-400 
                         hover:text-red-600 dark:hover:text-red-400 
                         hover:bg-red-50 dark:hover:bg-red-900/20 
                         transition-all duration-200 rounded"
                title="Delete"
              >
                <Trash2 className="w-3 h-3" />
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
