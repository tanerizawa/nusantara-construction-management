import React from 'react';
import { Target, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * Project status overview component
 * @param {Object} props Component props
 * @param {Object} props.projectData Project data
 * @returns {JSX.Element} Project status UI
 */
const ProjectStatusOverview = ({ projectData }) => {
  if (!projectData) return null;
  
  const { total = 0, active = 0, completed = 0 } = projectData;
  const planning = Math.max(total - active - completed, 0);
  const issues = projectData?.issues || 0;

  const statuses = [
    {
      title: 'Proyek Aktif',
      value: active,
      icon: Target,
      gradient: 'from-[#0ea5e9] to-[#2563eb]',
      progress: total ? (active / total) * 100 : 0
    },
    {
      title: 'Dalam Perencanaan',
      value: planning,
      icon: Clock,
      gradient: 'from-[#f97316] to-[#facc15]',
      progress: total ? (planning / total) * 100 : 0
    },
    {
      title: 'Selesai',
      value: completed,
      icon: CheckCircle,
      gradient: 'from-[#34d399] to-[#22c55e]',
      progress: total ? (completed / total) * 100 : 0
    },
    {
      title: 'Bermasalah',
      value: issues,
      icon: AlertTriangle,
      gradient: 'from-[#fb7185] to-[#ef4444]',
      progress: total ? (issues / total) * 100 : 0
    }
  ];
  
  return (
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Status Proyek</h3>
          <p className="text-xs text-white/50">Total {total} proyek dimonitor</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/60">
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#34d399]" />
            On Track
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-[#fb7185]" />
            Attention
          </span>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((status) => (
          <div key={status.title} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 p-4 transition hover:-translate-y-0.5 hover:border-white/20">
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${status.gradient} opacity-0 transition duration-300 group-hover:opacity-30`} />
            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50 break-words">{status.title}</p>
                <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                  {Math.round(status.progress)}%
                </span>
              </div>
              <div className="mt-3 flex items-end justify-between">
                <status.icon className="h-6 w-6 text-white/80" />
                <p className="text-3xl font-semibold text-white break-words">{status.value}</p>
              </div>
              <div className="mt-4 h-1.5 w-full rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-white/70 to-white"
                  style={{ width: `${Math.min(status.progress, 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectStatusOverview;
