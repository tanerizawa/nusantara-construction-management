import React, { memo } from 'react';
import { MapPin, DollarSign, Calendar, Clock, Eye, Edit2, Archive, Trash2 } from 'lucide-react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import CompactStatusBadge from './CompactStatusBadge';
import CompactIconButton from './CompactIconButton';

const CompactProjectCard = memo(({ 
  project, 
  onView, 
  onEdit, 
  onArchive, 
  onDelete 
}) => {
  const {
    name,
    projectCode,
    client,
    location,
    budget,
    startDate,
    status,
    progress = 0,
    daysRemaining
  } = project;

  const formatCurrency = (amount) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  const formatLocation = (location) => {
    if (!location) return 'No location';
    if (typeof location === 'string') return location;
    if (typeof location === 'object') {
      const parts = [];
      if (location.city) parts.push(location.city);
      if (location.province) parts.push(location.province);
      return parts.length > 0 ? parts.join(', ') : 'No location';
    }
    return 'No location';
  };
  
  const formatClient = (client) => {
    if (!client) return 'No client';
    if (typeof client === 'string') return client;
    if (typeof client === 'object') {
      return client.company || client.name || 'No client';
    }
    return 'No client';
  };

  const getProgressColor = () => {
    if (progress >= 80) return 'bg-[#30D158]';
    if (progress >= 50) return 'bg-[#0A84FF]';
    if (progress >= 25) return 'bg-[#FF9F0A]';
    return 'bg-[#FF3B30]';
  };

  const getDaysRemainingColor = () => {
    if (!daysRemaining) return 'text-[#8E8E93]';
    if (daysRemaining < 0) return 'text-[#FF3B30]';
    if (daysRemaining < 7) return 'text-[#FF9F0A]';
    if (daysRemaining < 30) return 'text-[#0A84FF]';
    return 'text-[#30D158]';
  };

  return (
    <Card className="group hover:border-[#0A84FF]/50 transition-all duration-150 overflow-hidden">
      {/* Compact Top Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-[#0A84FF] via-[#5AC8FA] to-[#0A84FF]" />
      
      <div className="p-3">
        {/* Header Row - Everything Inline */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-sm font-semibold text-white truncate group-hover:text-[#0A84FF] cursor-pointer transition-colors duration-150"
              onClick={() => onView?.(project)}
            >
              {name}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-mono text-[#636366]">
                #{projectCode}
              </span>
              <span className="text-[#636366]">·</span>
              <span className="text-xs text-[#636366] truncate">
                {formatClient(client)}
              </span>
            </div>
          </div>
          <CompactStatusBadge status={status} size="xs" />
        </div>

        {/* Info Grid - Compact 2-Column */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs mb-3">
          <div className="flex items-center gap-1.5 text-[#98989D]">
            <MapPin className="h-3 w-3 shrink-0" />
            <span className="truncate">{formatLocation(location)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#98989D]">
            <DollarSign className="h-3 w-3 shrink-0" />
            <span className="truncate">{formatCurrency(budget)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#98989D]">
            <Calendar className="h-3 w-3 shrink-0" />
            <span className="truncate">{formatDate(startDate)}</span>
          </div>
          <div className={`flex items-center gap-1.5 ${getDaysRemainingColor()}`}>
            <Clock className="h-3 w-3 shrink-0" />
            <span className="truncate">
              {daysRemaining !== undefined ? (
                daysRemaining < 0 ? (
                  `${Math.abs(daysRemaining)}d overdue`
                ) : (
                  `${daysRemaining}d left`
                )
              ) : (
                'No deadline'
              )}
            </span>
          </div>
        </div>

        {/* Progress Bar - Minimal */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[#636366]">Progress</span>
            <span className="font-medium text-white">{progress}%</span>
          </div>
          <div className="h-1.5 bg-[#3A3A3C] rounded-full overflow-hidden">
            <div 
              className={`h-full ${getProgressColor()} rounded-full transition-all duration-300`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Actions Row - Compact */}
        <div className="flex items-center gap-1 pt-2 border-t border-[#38383A]">
          <Button 
            size="xs" 
            variant="ghost" 
            className="flex-1 h-7 text-xs text-[#0A84FF] hover:bg-[#0A84FF]/10"
            onClick={() => onView?.(project)}
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <div className="flex items-center gap-0.5">
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
        </div>
      </div>
    </Card>
  );
});

CompactProjectCard.displayName = 'CompactProjectCard';

export default CompactProjectCard;
