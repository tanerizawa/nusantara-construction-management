import React from 'react';

const CompactStatBadge = ({ icon: Icon, label, value, color = 'blue', muted = false }) => {
  const palette = {
    blue: 'from-[#0ea5e9]/30 to-[#2563eb]/20 text-[#93c5fd]',
    green: 'from-[#34d399]/30 to-[#10b981]/20 text-[#86efac]',
    orange: 'from-[#fb923c]/30 to-[#f97316]/20 text-[#fcd34d]',
    red: 'from-[#fb7185]/30 to-[#ef4444]/20 text-[#fecdd3]',
    purple: 'from-[#c084fc]/30 to-[#a855f7]/20 text-[#e9d5ff]',
    teal: 'from-[#22d3ee]/30 to-[#0ea5e9]/20 text-[#a5f3fc]'
  };

  return (
    <div className={`group flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 px-4 py-3 backdrop-blur ${muted ? 'opacity-40' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${palette[color] || palette.blue}`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{value}</p>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">{label}</p>
        </div>
      </div>
      <div className="h-8 w-px bg-white/10" />
      <div className="text-right text-xs text-white/50">Realtime</div>
    </div>
  );
};

export default CompactStatBadge;
