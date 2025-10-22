import React from 'react';

const CompactStatusBadge = ({ status, size = 'sm' }) => {
  const statusConfig = {
    active: {
      label: 'Aktif',
      bg: 'bg-[#0A84FF]/10',
      color: 'text-[#0A84FF]',
      dot: 'bg-[#0A84FF]'
    },
    pending: {
      label: 'Pending',
      bg: 'bg-[#FF9F0A]/10',
      color: 'text-[#FF9F0A]',
      dot: 'bg-[#FF9F0A]'
    },
    'in-progress': {
      label: 'Dalam Proses',
      bg: 'bg-[#0A84FF]/10',
      color: 'text-[#0A84FF]',
      dot: 'bg-[#0A84FF]'
    },
    completed: {
      label: 'Selesai',
      bg: 'bg-[#30D158]/10',
      color: 'text-[#30D158]',
      dot: 'bg-[#30D158]'
    },
    'on-hold': {
      label: 'Ditunda',
      bg: 'bg-[#8E8E93]/10',
      color: 'text-[#8E8E93]',
      dot: 'bg-[#8E8E93]'
    },
    'on_hold': {
      label: 'Ditunda',
      bg: 'bg-[#8E8E93]/10',
      color: 'text-[#8E8E93]',
      dot: 'bg-[#8E8E93]'
    },
    planning: {
      label: 'Perencanaan',
      bg: 'bg-[#5E5CE6]/10',
      color: 'text-[#5E5CE6]',
      dot: 'bg-[#5E5CE6]'
    },
    cancelled: {
      label: 'Dibatalkan',
      bg: 'bg-[#FF3B30]/10',
      color: 'text-[#FF3B30]',
      dot: 'bg-[#FF3B30]'
    }
  };

  const sizeClasses = {
    xs: 'text-[10px] px-1.5 py-0.5 gap-1',
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-sm px-2.5 py-1 gap-2'
  };

  // Normalize status: lowercase, trim, convert underscores to hyphens for consistency
  const normalizedStatus = status?.toLowerCase().trim().replace(/_/g, '-');
  // Prefer exact match, but also allow raw value (e.g., on_hold)
  const config = statusConfig[normalizedStatus] || statusConfig[status?.toLowerCase()] || statusConfig.pending;

  return (
    <div className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.bg} ${config.color} border border-current border-opacity-20`}>
      <div className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      {config.label}
    </div>
  );
};

export default CompactStatusBadge;
