import React from 'react';
import { TrendingUp, Clock, AlertTriangle, Building2 } from 'lucide-react';
import Button from '../../ui/Button';
import CompactStatBadge from './CompactStatBadge';

const CompactProjectHeader = ({ stats, onCreateProject, loading, error }) => {
  if (loading) {
    return (
      <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-[#3A3A3C] rounded w-48" />
          <div className="h-4 bg-[#3A3A3C] rounded w-32" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FF3B30]/10 border border-[#FF3B30]/30 rounded-lg p-4">
        <p className="text-[#FF3B30] text-sm">Failed to load project statistics</p>
      </div>
    );
  }

  const { total = 0, active = 0, completed = 0, overdue = 0 } = stats || {};

  return (
    <div className="space-y-4">
      {/* Compact Title Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building2 className="h-5 w-5 text-[#0A84FF]" />
          <h1 className="text-xl font-bold text-white">Proyek</h1>
          <span className="text-[#636366]">·</span>
          <span className="text-[#8E8E93] text-sm">{total} total</span>
        </div>
        
        <Button 
          onClick={onCreateProject}
          size="sm" 
          className="h-9 px-4 bg-[#0A84FF] text-white hover:bg-[#0A84FF]/90 border border-[#0A84FF]/20"
        >
          Buat Proyek Baru
        </Button>
      </div>

      {/* Compact Stats Row */}
      <div className="flex items-center gap-3 flex-wrap">
        <CompactStatBadge 
          icon={TrendingUp} 
          label="Aktif" 
          value={active} 
          color="blue" 
        />
        <CompactStatBadge 
          icon={Clock} 
          label="Selesai" 
          value={completed} 
          color="green" 
        />
        {overdue > 0 && (
          <CompactStatBadge 
            icon={AlertTriangle} 
            label="Terlambat" 
            value={overdue} 
            color="red" 
          />
        )}
      </div>
    </div>
  );
};

export default CompactProjectHeader;
