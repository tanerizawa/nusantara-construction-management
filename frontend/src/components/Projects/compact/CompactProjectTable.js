import React, { memo, useCallback } from 'react';
import { Eye, Edit2, Archive, Trash2, DollarSign, Calendar } from 'lucide-react';
import CompactStatusBadge from './CompactStatusBadge';
import CompactIconButton from './CompactIconButton';

const CompactProjectTable = memo(({ 
  projects = [], 
  selectedProjects = [],
  onSelectProject,
  onSelectAll,
  onView, 
  onEdit, 
  onArchive, 
  onDelete 
}) => {
  const isAllSelected = projects.length > 0 && selectedProjects.length === projects.length;
  const isSomeSelected = selectedProjects.length > 0 && selectedProjects.length < projects.length;

  const formatCurrency = useCallback((amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1
    }).format(amount);
  }, []);

  const formatDate = useCallback((date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  }, []);
  
  const formatLocation = useCallback((location) => {
    if (!location) return 'Lokasi tidak tersedia';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.province) parts.push(location.province);
      return parts.length > 0 ? parts.join(', ') : 'Lokasi tidak tersedia';
    }
    return 'Lokasi tidak tersedia';
  }, []);

  const getProgressColor = useCallback((progress) => {
    if (progress >= 80) return 'bg-[#30D158]';
    if (progress >= 50) return 'bg-[#0A84FF]';
    if (progress >= 25) return 'bg-[#FF9F0A]';
    return 'bg-[#FF3B30]';
  }, []);

  if (!projects?.length) {
    return (
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-center text-white/70">
        <p>Tidak ada proyek ditemukan</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-white/5 bg-[#070b13]/85 shadow-[0_25px_60px_rgba(0,0,0,0.45)]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10 text-white/60">
              {/* Checkbox Column */}
              {onSelectAll && (
                <th className="px-4 py-2.5 text-center w-[50px]">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) {
                        input.indeterminate = isSomeSelected;
                      }
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    className="h-4 w-4 rounded border-white/30 bg-transparent text-[#0A84FF] 
                               focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-0
                               cursor-pointer"
                    aria-label="Pilih semua proyek"
                  />
                </th>
              )}
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-[30%]">
                Proyek
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-[15%]">
                Subsidiary
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-[15%]">
                Klien / Lokasi
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-[18%]">
                Budget / Jadwal
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-[20%]">
                Progress
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-medium uppercase tracking-[0.2em] text-white/50 w-[12%]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const isSelected = selectedProjects.includes(project.id);
              
              return (
              <tr 
                key={project.id} 
                className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/5
                           ${isSelected ? 'bg-[#0ea5e9]/10' : ''}`}
              >
                {/* Checkbox Column */}
                {onSelectProject && (
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectProject(project.id)}
                      className="h-4 w-4 rounded border-white/30 bg-transparent text-[#0A84FF] 
                                 focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-0
                                 cursor-pointer"
                      aria-label={`Pilih proyek ${project.name}`}
                    />
                  </td>
                )}
                {/* Project Column */}
                <td className="px-4 py-3">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <div 
                        className="line-clamp-2 break-words font-medium text-white transition-colors duration-150 hover:text-[#60a5fa]"
                        onClick={() => onView?.(project)}
                      >
                        {project.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CompactStatusBadge status={project.status} size="xs" />
                        <span className="font-mono text-xs text-white/40">
                          #{project.projectCode || project.code || project.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Subsidiary Column */}
                <td className="px-4 py-3">
                  <div className="truncate text-sm text-white">
                    {project.subsidiaryInfo?.name || project.subsidiary?.name || '-'}
                  </div>
                  <div className="truncate text-xs text-white/50">
                    {project.subsidiaryInfo?.code || project.subsidiary?.code || 'Tidak ada'}
                  </div>
                </td>

                {/* Client / Location Column */}
                <td className="px-4 py-3">
                  <div className="line-clamp-2 break-words text-sm text-white/70">
                    {project.client?.company || project.client?.name || project.client || project.clientName || 'Tidak ada klien'}
                  </div>
                  <div className="line-clamp-2 break-words text-xs text-white/50">
                    {formatLocation(project.location)}
                  </div>
                </td>

                {/* Budget / Timeline Column */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 text-sm font-medium text-white">
                    <DollarSign className="h-3 w-3 text-[#34d399]" />
                    {formatCurrency(project.budget)}
                  </div>
                  <div className="mt-0.5 flex items-center justify-end gap-1 text-xs text-white/50">
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </div>
                </td>

                {/* Progress Column */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div 
                        className={`h-full rounded-full ${getProgressColor(project.progress || 0)} transition-all duration-300`}
                        style={{ width: `${project.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-white w-10 text-right">
                      {project.progress || 0}%
                    </span>
                  </div>
                </td>

                {/* Actions Column */}
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-1">
                    <CompactIconButton 
                      icon={Eye} 
                      size="xs" 
                      color="teal" 
                      onClick={() => onView?.(project)}
                    />
                    <CompactIconButton 
                      icon={Edit2} 
                      size="xs" 
                      color="orange" 
                      onClick={() => onEdit?.(project)}
                    />
                    <CompactIconButton 
                      icon={Archive} 
                      size="xs" 
                      color="amber" 
                      onClick={() => onArchive?.(project)}
                    />
                    <CompactIconButton 
                      icon={Trash2} 
                      size="xs" 
                      color="red" 
                      onClick={() => onDelete?.(project)}
                    />
                  </div>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
});

CompactProjectTable.displayName = 'CompactProjectTable';

export default CompactProjectTable;
