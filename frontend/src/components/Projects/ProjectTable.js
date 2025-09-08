import React, { memo } from 'react';
import { Edit2, Archive, Trash2, Eye, Calendar, DollarSign, Users } from 'lucide-react';
import Button from '../ui/Button';
import { Badge } from '../ui/Badge';

/**
 * Professional Project Table Component
 * Optimized table view for project management
 */
const ProjectTable = memo(({ 
  projects = [], 
  onView, 
  onEdit, 
  onArchive, 
  onDelete 
}) => {
  // Format currency for display
  const formatCurrency = (amount) => {
    if (!amount) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'in_progress': return 'primary';
      case 'planning': return 'secondary';
      case 'on_hold': return 'warning';
      case 'cancelled': return 'destructive';
      case 'archived': return 'outline';
      default: return 'secondary';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'planning': return 'Perencanaan';
      case 'in_progress': return 'Berlangsung';
      case 'completed': return 'Selesai';
      case 'on_hold': return 'Ditunda';
      case 'cancelled': return 'Dibatalkan';
      case 'archived': return 'Diarsipkan';
      default: return status;
    }
  };

  // Get priority badge variant
  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'warning';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  // Get priority label
  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return 'Kritis';
      case 'high': return 'Tinggi';
      case 'medium': return 'Sedang';
      case 'low': return 'Rendah';
      default: return priority;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 dark:bg-slate-900 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Proyek
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Prioritas
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {projects.map((project) => (
              <tr 
                key={project.id}
                className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors duration-150"
              >
                {/* Project Info */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {project.client?.company || 'No Client'}
                    </div>
                    {project.location && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        📍 {project.location.city}, {project.location.province}
                      </div>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <Badge variant={getStatusVariant(project.status)}>
                    {getStatusLabel(project.status)}
                  </Badge>
                </td>

                {/* Priority */}
                <td className="px-6 py-4">
                  <Badge variant={getPriorityVariant(project.priority)}>
                    {getPriorityLabel(project.priority)}
                  </Badge>
                </td>

                {/* Timeline */}
                <td className="px-6 py-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Mulai: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-3 w-3" />
                      <span>Selesai: {formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </td>

                {/* Budget */}
                <td className="px-6 py-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-gray-900 dark:text-white font-medium">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(project.budget)}
                    </div>
                    {project.actualBudget && (
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Aktual: {formatCurrency(project.actualBudget)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Progress */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.progress || 0}%
                      </span>
                      {project.teamSize && (
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-500">
                          <Users className="h-3 w-3" />
                          {project.teamSize}
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(project.progress || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => onView(project)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={`Lihat detail proyek ${project.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => onEdit(project)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300"
                      aria-label={`Edit proyek ${project.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    {project.status !== 'archived' && (
                      <Button
                        onClick={() => onArchive(project)}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:text-yellow-300"
                        aria-label={`Arsipkan proyek ${project.name}`}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => onDelete(project)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300"
                      aria-label={`Hapus proyek ${project.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State for Table */}
      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Tidak ada proyek untuk ditampilkan
          </div>
        </div>
      )}
    </div>
  );
});

ProjectTable.displayName = 'ProjectTable';

export default ProjectTable;
