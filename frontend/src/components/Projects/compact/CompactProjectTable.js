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
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-8 text-center">
        <p className="text-[#8E8E93]">Tidak ada proyek ditemukan</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#1C1C1E]">
            <tr className="border-b border-[#38383A]">
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
                    className="w-4 h-4 rounded border-[#636366] bg-[#2C2C2E] text-[#0A84FF] 
                               focus:ring-2 focus:ring-[#0A84FF] focus:ring-offset-0
                               cursor-pointer"
                    aria-label="Pilih semua proyek"
                  />
                </th>
              )}
              <th className="px-4 py-2.5 text-left text-xs font-medium text-[#636366] w-[30%]">
                Proyek
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-[#636366] w-[15%]">
                Subsidiary
              </th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-[#636366] w-[15%]">
                Klien / Lokasi
              </th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-[#636366] w-[18%]">
                Budget / Jadwal
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-medium text-[#636366] w-[20%]">
                Progress
              </th>
              <th className="px-4 py-2.5 text-center text-xs font-medium text-[#636366] w-[12%]">
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
                className={`border-b border-[#38383A] hover:bg-[#3A3A3C] transition-colors duration-150
                           ${isSelected ? 'bg-[#0A84FF]/10' : ''}`}
              >
                {/* Checkbox Column */}
                {onSelectProject && (
                  <td className="px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onSelectProject(project.id)}
                      className="w-4 h-4 rounded border-[#636366] bg-[#2C2C2E] text-[#0A84FF] 
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
                        className="font-medium text-white truncate cursor-pointer hover:text-[#0A84FF] transition-colors duration-150"
                        onClick={() => onView?.(project)}
                      >
                        {project.name}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <CompactStatusBadge status={project.status} size="xs" />
                        <span className="text-xs font-mono text-[#636366]">
                          #{project.projectCode || project.code || project.id}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Subsidiary Column */}
                <td className="px-4 py-3">
                  <div className="text-sm text-white truncate">
                    {project.subsidiaryInfo?.name || project.subsidiary?.name || '-'}
                  </div>
                  <div className="text-xs text-[#636366] truncate">
                    {project.subsidiaryInfo?.code || project.subsidiary?.code || 'Tidak ada'}
                  </div>
                </td>

                {/* Client / Location Column */}
                <td className="px-4 py-3">
                  <div className="text-sm text-[#98989D] truncate">
                    {project.client?.company || project.client?.name || project.client || project.clientName || 'Tidak ada klien'}
                  </div>
                  <div className="text-xs text-[#636366] truncate">
                    {formatLocation(project.location)}
                  </div>
                </td>

                {/* Budget / Timeline Column */}
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1 font-medium text-white text-sm">
                    <DollarSign className="h-3 w-3 text-[#30D158]" />
                    {formatCurrency(project.budget)}
                  </div>
                  <div className="flex items-center justify-end gap-1 text-xs text-[#636366] mt-0.5">
                    <Calendar className="h-3 w-3" />
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </div>
                </td>

                {/* Progress Column */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-[#3A3A3C] rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${getProgressColor(project.progress || 0)} rounded-full transition-all duration-300`}
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
                  <div className="flex items-center justify-center gap-0.5">
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
