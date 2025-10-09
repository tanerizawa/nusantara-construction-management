import React, { memo, useCallback } from 'react';
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
  // Prevent unnecessary re-renders by memoizing handlers
  const handleView = useCallback((project) => onView(project), [onView]);
  const handleEdit = useCallback((project) => onEdit(project), [onEdit]);
  const handleArchive = useCallback((project) => onArchive(project), [onArchive]);
  const handleDelete = useCallback((project) => onDelete(project), [onDelete]);
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
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-xl overflow-hidden shadow-lg">
      {/* Table Container with Horizontal Scroll */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-[#1C1C1E] border-b border-[#38383A]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Proyek
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Prioritas
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Timeline
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#38383A]">
            {projects.map((project) => (
              <tr 
                key={project.id}
                className="hover:bg-[#3A3A3C] transition-colors duration-150"
              >
                {/* Project Info */}
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="font-semibold text-white">
                      {project.name}
                    </div>
                    <div className="text-sm text-[#98989D]">
                      {project.client?.company || 'No Client'}
                    </div>
                    {project.location && (
                      <div className="text-xs text-[#636366]">
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
                    <div className="flex items-center gap-1 text-[#98989D]">
                      <Calendar className="h-3 w-3" />
                      <span>Mulai: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#98989D]">
                      <Calendar className="h-3 w-3" />
                      <span>Selesai: {formatDate(project.endDate)}</span>
                    </div>
                  </div>
                </td>

                {/* Budget */}
                <td className="px-6 py-4">
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-1 text-white font-medium">
                      <DollarSign className="h-3 w-3" />
                      {formatCurrency(project.budget)}
                    </div>
                    {project.actualBudget && (
                      <div className="text-xs text-[#636366]">
                        Aktual: {formatCurrency(project.actualBudget)}
                      </div>
                    )}
                  </div>
                </td>

                {/* Progress */}
                <td className="px-6 py-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-white">
                        {project.progress || 0}%
                      </span>
                      {project.teamSize && (
                        <div className="flex items-center gap-1 text-xs text-[#636366]">
                          <Users className="h-3 w-3" />
                          {project.teamSize}
                        </div>
                      )}
                    </div>
                    <div className="w-full bg-[#3A3A3C] rounded-full h-2">
                      <div 
                        className="bg-[#0A84FF] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(project.progress || 0, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => handleView(project)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-[#5AC8FA] bg-[#5AC8FA]/15 hover:bg-[#5AC8FA]/25 border border-[#5AC8FA]/30 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5AC8FA]/50"
                      aria-label={`Lihat detail proyek ${project.name}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      onClick={() => handleEdit(project)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-[#FF9500] bg-[#FF9500]/15 hover:bg-[#FF9500]/25 border border-[#FF9500]/30 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF9500]/50"
                      aria-label={`Edit proyek ${project.name}`}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    {project.status !== 'archived' && (
                      <Button
                        onClick={() => handleArchive(project)}
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 text-[#FF9F0A] bg-[#FF9F0A]/15 hover:bg-[#FF9F0A]/25 border border-[#FF9F0A]/30 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF9F0A]/50"
                        aria-label={`Arsipkan proyek ${project.name}`}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      onClick={() => handleDelete(project)}
                      variant="ghost"
                      size="sm"
                      className="h-8 px-3 text-[#FF3B30] bg-[#FF3B30]/15 hover:bg-[#FF3B30]/25 border border-[#FF3B30]/30 rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#FF3B30]/50"
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
          <div className="text-[#98989D]">
            Tidak ada proyek untuk ditampilkan
          </div>
        </div>
      )}
    </div>
  );
});

ProjectTable.displayName = 'ProjectTable';

export default ProjectTable;
