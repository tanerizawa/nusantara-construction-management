import React, { useState } from 'react';
import { Edit, Trash2, Calendar, DollarSign, Package, TrendingUp, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { getStatusInfo, isOverdue } from '../config/statusConfig';
import MilestoneWorkflowProgress from '../MilestoneWorkflowProgress';
import MilestoneDetailInline from '../MilestoneDetailInline';

const MilestoneTimelineItem = ({ 
  milestone, 
  index, 
  isLast,
  onEdit, 
  onDelete,
  onApprove,
  onProgressUpdate 
}) => {
  const statusInfo = getStatusInfo(isOverdue(milestone) ? 'overdue' : milestone.status);
  const Icon = statusInfo.icon;
  const [showWorkflowProgress, setShowWorkflowProgress] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [localProgress, setLocalProgress] = useState(milestone.progress);
  
  // Sync local progress when milestone changes
  React.useEffect(() => {
    setLocalProgress(milestone.progress);
  }, [milestone.progress]);

  // Check if milestone has category link
  const hasCategoryLink = milestone.category_link && milestone.category_link.enabled;

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        {/* Status Icon - Proportional */}
        <div className="flex-shrink-0 mt-0.5">
          <div 
            className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ backgroundColor: statusInfo.bgOpacity }}
          >
            <Icon size={15} style={{ color: statusInfo.color }} />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Single Row: Title + Status + Date + Budget + Actions */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            {/* Left: Title + Status */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <h5 className="text-sm font-semibold text-white truncate">
                {milestone.name}
              </h5>
              <span 
                className="inline-flex px-2 py-0.5 rounded text-xs font-medium flex-shrink-0"
                style={{ 
                  backgroundColor: statusInfo.bgOpacity,
                  color: statusInfo.color
                }}
              >
                {statusInfo.text}
              </span>
            </div>
            
            {/* Center: Date + Budget - Compact */}
            <div className="flex items-center gap-4 text-xs text-[#98989D]">
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>{formatDate(milestone.targetDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <DollarSign size={13} />
                <span>{formatCurrency(milestone.budget)}</span>
              </div>
            </div>
            
            {/* Right: Actions */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {milestone.status === 'pending' && onApprove && (
                <button
                  onClick={onApprove}
                  className="p-1.5 text-[#30D158] hover:bg-[#30D158]/10 rounded transition-colors"
                  title="Approve Milestone"
                >
                  <CheckCircle size={14} />
                </button>
              )}
              <button
                onClick={() => setShowDetail(!showDetail)}
                className="p-1.5 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
                title={showDetail ? "Hide Detail" : "Show Detail"}
              >
                {showDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <button
                onClick={onEdit}
                className="p-1.5 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded transition-colors"
                title="Edit"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={onDelete}
                className="p-1.5 text-[#FF3B30] hover:bg-[#FF3B30]/10 rounded transition-colors"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>

          {/* Progress Bar - Compact with deliverables count */}
          <div className="flex items-center gap-3 mt-2">
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 bg-[#48484A] rounded-full h-1.5">
                <div 
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${milestone.progress}%`,
                    backgroundColor: statusInfo.bgColor
                  }}
                />
              </div>
              <span className="text-xs font-mono text-[#8E8E93] w-10 text-right">{milestone.progress}%</span>
            </div>
            
            {/* Deliverables count inline */}
            {milestone.deliverables && milestone.deliverables.length > 0 && (
              <span className="text-xs text-[#8E8E93] flex-shrink-0">
                {milestone.deliverables.length} item{milestone.deliverables.length > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Description - Only if exists, ultra compact */}
          {milestone.description && (
            <p className="text-xs text-[#98989D] mt-2 line-clamp-1">{milestone.description}</p>
          )}

          {/* RAB Category Link Badge */}
          {hasCategoryLink && (
            <div className="mt-2 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded text-xs">
                <Package className="h-3 w-3 text-[#0A84FF]" />
                <span className="text-[#0A84FF]">{milestone.category_link.category_name}</span>
              </div>
              <button
                onClick={() => setShowWorkflowProgress(true)}
                className="inline-flex items-center gap-1.5 px-2 py-1 bg-[#30D158]/10 border border-[#30D158]/30 rounded text-xs hover:bg-[#30D158]/20 transition-colors"
                title="View workflow progress"
              >
                <TrendingUp className="h-3 w-3 text-[#30D158]" />
                <span className="text-[#30D158]">View Progress</span>
              </button>
            </div>
          )}

          {/* Progress Update Slider - Inline, only for non-completed */}
          {milestone.status !== 'completed' && (
            <div className="mt-2.5 flex items-center gap-2">
              <span className="text-xs text-[#8E8E93] flex-shrink-0">Adjust:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={localProgress}
                onChange={(e) => {
                  const newProgress = parseInt(e.target.value);
                  setLocalProgress(newProgress); // ✅ Immediate UI update
                }}
                onMouseUp={(e) => {
                  const newProgress = parseInt(e.target.value);
                  onProgressUpdate(milestone.id, newProgress); // ✅ API call on release
                }}
                onTouchEnd={(e) => {
                  const newProgress = parseInt(e.target.value);
                  onProgressUpdate(milestone.id, newProgress); // ✅ Mobile support
                }}
                className="flex-1 h-1.5 accent-[#0A84FF] cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0A84FF 0%, #0A84FF ${localProgress}%, #48484A ${localProgress}%, #48484A 100%)`
                }}
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Connection Line - Proportional */}
      {!isLast && (
        <div className="ml-3.5 mt-2.5 h-5 w-px bg-[#38383A]" />
      )}

      {/* Inline Detail Section */}
      {showDetail && (
        <div className="ml-[50px] mt-4 mb-6 animate-fadeIn">
          <MilestoneDetailInline 
            milestone={milestone}
            projectId={milestone.project_id || milestone.projectId}
          />
        </div>
      )}

      {/* Workflow Progress Modal */}
      {showWorkflowProgress && hasCategoryLink && (
        <MilestoneWorkflowProgress
          milestoneId={milestone.id}
          projectId={milestone.project_id || milestone.projectId}
          onClose={() => setShowWorkflowProgress(false)}
        />
      )}
    </div>
  );
};

export default MilestoneTimelineItem;
