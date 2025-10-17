import React from 'react';
import { getStatusInfo, isOverdue } from '../config/statusConfig';

/**
 * Milestone List Card - Minimal compact card for left panel timeline list
 * Used in master-detail layout (30% width)
 */
const MilestoneListCard = ({ milestone, isSelected, onClick }) => {
  const statusInfo = getStatusInfo(isOverdue(milestone) ? 'overdue' : milestone.status);
  const Icon = statusInfo.icon;

  return (
    <div
      onClick={onClick}
      className={`
        relative p-3 rounded-lg border cursor-pointer transition-all
        ${isSelected 
          ? 'bg-[#0A84FF]/20 border-[#0A84FF] shadow-lg' 
          : 'bg-[#2C2C2E] border-[#38383A] hover:border-[#48484A] hover:bg-[#38383A]/30'
        }
      `}
    >
      {/* Selection Indicator */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#0A84FF] rounded-l-lg" />
      )}

      {/* Minimal Header: Icon + Name */}
      <div className="flex items-center gap-2 mb-2">
        <div 
          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center"
          style={{ backgroundColor: statusInfo.bgOpacity }}
        >
          <Icon size={14} style={{ color: statusInfo.color }} />
        </div>
        
        <h4 className="font-semibold text-sm truncate text-white flex-1">
          {milestone.name}
        </h4>
      </div>

      {/* Minimal Progress Bar */}
      <div className="w-full bg-[#48484A] rounded-full h-1">
        <div 
          className="h-1 rounded-full transition-all duration-300"
          style={{ 
            width: `${Math.min(milestone.progress, 100)}%`,
            backgroundColor: milestone.progress >= 100 ? '#30D158' : statusInfo.color
          }}
        />
      </div>
    </div>
  );
};

export default MilestoneListCard;
