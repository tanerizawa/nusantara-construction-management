import React from 'react';

const CompactStatBadge = ({ icon: Icon, label, value, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-[#0A84FF]',
    green: 'text-[#30D158]',
    orange: 'text-[#FF9F0A]',
    red: 'text-[#FF3B30]',
    purple: 'text-[#BF5AF2]',
    teal: 'text-[#5AC8FA]'
  };

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2C2C2E] rounded-lg border border-[#38383A] hover:border-[#48484A] transition-colors duration-150">
      <Icon className={`h-3.5 w-3.5 shrink-0 ${colorClasses[color]}`} />
      <div className="flex items-baseline gap-1">
        <span className="text-sm font-semibold text-white">{value}</span>
        <span className="text-xs text-[#636366]">{label}</span>
      </div>
    </div>
  );
};

export default CompactStatBadge;
