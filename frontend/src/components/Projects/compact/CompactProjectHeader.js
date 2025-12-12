import React from 'react';
import { TrendingUp, Clock, AlertTriangle, Building2 } from 'lucide-react';
import Button from '../../ui/Button';
import CompactStatBadge from './CompactStatBadge';
import { useTranslation } from '../../../i18n';

const CompactProjectHeader = ({ stats, onCreateProject, loading, error }) => {
  const { projects: projectsTranslations, common, status } = useTranslation();
  
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
        <p className="text-[#FF3B30] text-sm">{common.error}</p>
      </div>
    );
  }

  const { total = 0, active = 0, completed = 0, overdue = 0 } = stats || {};

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-[#0b0f19]/90 px-6 py-6 shadow-[0_25px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[#0ea5e9]/40 to-[#8b5cf6]/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 top-1/2 h-36 w-36 -translate-y-1/2 rounded-full bg-[#34d399]/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-white/70">
            <Building2 className="h-5 w-5 text-[#60a5fa]" />
            <p className="eyebrow-label">Workspace Projects</p>
          </div>
          <div className="flex flex-wrap items-end gap-x-4 gap-y-1">
            <h1 className="text-3xl font-semibold text-white">{projectsTranslations.title}</h1>
            <span className="text-sm text-white/60">{total} total proyek aktif</span>
          </div>
          <p className="text-sm text-white/60">
            Pantau pipeline proyek, status eksekusi, dan tugas kritikal secara real-time.
          </p>
        </div>

        <Button 
          onClick={onCreateProject}
          size="sm" 
          className="h-11 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-6 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(37,99,235,0.35)] hover:brightness-110"
        >
          {projectsTranslations.newProject}
        </Button>
      </div>

      <div className="relative mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CompactStatBadge 
          icon={TrendingUp} 
          label={status.active} 
          value={active} 
          color="blue" 
        />
        <CompactStatBadge 
          icon={Clock} 
          label={status.completed} 
          value={completed} 
          color="green" 
        />
        <CompactStatBadge 
          icon={AlertTriangle} 
          label={status.overdue} 
          value={overdue} 
          color="red" 
          muted={overdue === 0}
        />
      </div>
    </section>
  );
};

export default CompactProjectHeader;
