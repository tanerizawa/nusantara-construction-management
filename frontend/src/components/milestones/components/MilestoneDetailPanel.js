import React, { useState } from 'react';
import { Edit, Trash2, CheckCircle, Info, Camera, DollarSign, Activity, Calendar, Package, TrendingUp, ChevronDown } from 'lucide-react';
import { formatCurrency, formatDate } from '../../../utils/formatters';
import { getStatusInfo, isOverdue } from '../config/statusConfig';

// Import tab components
import OverviewTab from '../detail-tabs/OverviewTab';
import PhotosTab from '../detail-tabs/PhotosTab';
import CostsTab from '../detail-tabs/CostsTab';
import ActivityTab from '../detail-tabs/ActivityTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'photos', label: 'Foto Dokumentasi', icon: Camera },
  { id: 'costs', label: 'Biaya & Kasbon', icon: DollarSign },
  { id: 'activity', label: 'Timeline Kegiatan', icon: Activity }
];

/**
 * Milestone Detail Panel - Full width panel with milestone selector
 * Includes dropdown to switch between milestones
 */
const MilestoneDetailPanel = ({ 
  milestone,
  milestones = [],
  onMilestoneChange,
  projectId,
  onEdit,
  onDelete,
  onApprove,
  onProgressUpdate
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showMilestoneDropdown, setShowMilestoneDropdown] = useState(false);
  const [localProgress, setLocalProgress] = useState(milestone.progress);
  
  // Sync local progress when milestone changes
  React.useEffect(() => {
    setLocalProgress(milestone.progress);
  }, [milestone.progress]);
  
  const statusInfo = getStatusInfo(isOverdue(milestone) ? 'overdue' : milestone.status);
  const StatusIcon = statusInfo.icon;

  // Check if milestone has category link
  const hasCategoryLink = milestone.category_link && milestone.category_link.enabled;

  return (
    <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] h-full flex flex-col">
      {/* Milestone Selector Dropdown */}
      {milestones.length > 1 && (
        <div className="flex-shrink-0 p-4 border-b border-[#38383A] relative">
          <button
            onClick={() => setShowMilestoneDropdown(!showMilestoneDropdown)}
            className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-[#1C1C1E] hover:bg-[#38383A] border border-[#38383A] rounded-lg text-white transition-colors"
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: statusInfo.bgOpacity }}
              >
                <StatusIcon size={14} style={{ color: statusInfo.color }} />
              </div>
              <span className="font-semibold truncate">{milestone.name}</span>
              <span 
                className="px-2 py-0.5 rounded text-xs font-medium"
                style={{ 
                  backgroundColor: statusInfo.bgOpacity,
                  color: statusInfo.color
                }}
              >
                {statusInfo.text}
              </span>
            </div>
            <ChevronDown 
              size={16} 
              className={`text-[#8E8E93] transition-transform ${showMilestoneDropdown ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {showMilestoneDropdown && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowMilestoneDropdown(false)}
              />
              <div className="absolute top-full left-4 right-4 mt-1 bg-[#1C1C1E] border border-[#38383A] rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
                {milestones.map((m) => {
                  const mStatus = getStatusInfo(isOverdue(m) ? 'overdue' : m.status);
                  const MIcon = mStatus.icon;
                  const isSelected = m.id === milestone.id;
                  
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        onMilestoneChange(m);
                        setShowMilestoneDropdown(false);
                      }}
                      className={`
                        w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-[#38383A] last:border-b-0
                        ${isSelected ? 'bg-[#0A84FF]/20 border-l-2 border-l-[#0A84FF]' : 'hover:bg-[#2C2C2E]'}
                      `}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: mStatus.bgOpacity }}
                      >
                        <MIcon size={14} style={{ color: mStatus.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-white truncate">{m.name}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span 
                            className="px-2 py-0.5 rounded text-xs font-medium"
                            style={{ 
                              backgroundColor: mStatus.bgOpacity,
                              color: mStatus.color
                            }}
                          >
                            {mStatus.text}
                          </span>
                          <span className="text-xs text-[#8E8E93]">
                            {m.progress}% complete
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* Header with Milestone Info */}
      <div className="flex-shrink-0 p-6 border-b border-[#38383A]">
        <div className="flex items-start justify-between mb-4">
          {/* Left: Title Only (Status shown in dropdown) */}
          <div className="flex-1 min-w-0">
            {milestones.length <= 1 && (
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: statusInfo.bgOpacity }}
                >
                  <StatusIcon size={20} style={{ color: statusInfo.color }} />
                </div>
                <h2 className="text-2xl font-bold text-white truncate">
                  {milestone.name}
                </h2>
                <span 
                  className="px-3 py-1 rounded-lg text-sm font-medium"
                  style={{ 
                    backgroundColor: statusInfo.bgOpacity,
                    color: statusInfo.color
                  }}
                >
                  {statusInfo.text}
                </span>
              </div>
            )}
            
            {milestone.description && (
              <p className="text-[#8E8E93] text-sm line-clamp-2">
                {milestone.description}
              </p>
            )}
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
            {milestone.status === 'pending' && onApprove && (
              <button
                onClick={onApprove}
                className="p-2 text-[#30D158] hover:bg-[#30D158]/10 rounded-lg transition-colors"
                title="Approve Milestone"
              >
                <CheckCircle size={20} />
              </button>
            )}
            <button
              onClick={onEdit}
              className="p-2 text-[#0A84FF] hover:bg-[#0A84FF]/10 rounded-lg transition-colors"
              title="Edit Milestone"
            >
              <Edit size={20} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-[#FF453A] hover:bg-[#FF453A]/10 rounded-lg transition-colors"
              title="Delete Milestone"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Target Date */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A84FF]/20 flex items-center justify-center">
              <Calendar size={16} className="text-[#0A84FF]" />
            </div>
            <div>
              <p className="text-xs text-[#8E8E93]">Target Date</p>
              <p className="text-sm font-semibold text-white">{formatDate(milestone.targetDate)}</p>
            </div>
          </div>

          {/* Budget */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#30D158]/20 flex items-center justify-center">
              <DollarSign size={16} className="text-[#30D158]" />
            </div>
            <div>
              <p className="text-xs text-[#8E8E93]">Budget</p>
              <p className="text-sm font-semibold text-white">{formatCurrency(milestone.budget)}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#BF5AF2]/20 flex items-center justify-center">
              <TrendingUp size={16} className="text-[#BF5AF2]" />
            </div>
            <div>
              <p className="text-xs text-[#8E8E93]">Progress</p>
              <p className="text-sm font-semibold text-white">{milestone.progress}%</p>
            </div>
          </div>

          {/* Deliverables */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FF9F0A]/20 flex items-center justify-center">
              <Package size={16} className="text-[#FF9F0A]" />
            </div>
            <div>
              <p className="text-xs text-[#8E8E93]">Deliverables</p>
              <p className="text-sm font-semibold text-white">
                {milestone.deliverables?.length || 0} items
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar with Slider */}
        {milestone.status !== 'completed' && onProgressUpdate && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#8E8E93]">Adjust Progress</span>
              <span className="font-mono font-medium text-white">{localProgress}%</span>
            </div>
            <div className="flex items-center gap-3">
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
                className="flex-1 h-2 accent-[#0A84FF] cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #0A84FF 0%, #0A84FF ${localProgress}%, #48484A ${localProgress}%, #48484A 100%)`
                }}
              />
            </div>
          </div>
        )}

        {/* RAB Category Link (if exists) */}
        {hasCategoryLink && (
          <div className="mt-4 flex items-center gap-2 p-3 bg-[#0A84FF]/10 border border-[#0A84FF]/30 rounded-lg">
            <Package className="h-4 w-4 text-[#0A84FF]" />
            <span className="text-sm text-[#0A84FF] font-medium">
              Linked to RAB Category: {milestone.category_link.category_name}
            </span>
          </div>
        )}
      </div>

      {/* Tab Navigation - Horizontal Pills Style */}
      <div className="flex-shrink-0 px-6 py-3 border-b border-[#38383A] bg-[#1C1C1E]">
        <div className="flex gap-2">
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-[#0A84FF] text-white shadow-lg' 
                    : 'bg-[#2C2C2E] text-[#8E8E93] hover:bg-[#38383A] hover:text-white'
                  }
                `}
              >
                <TabIcon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content - Full Width with Scroll */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab milestone={milestone} projectId={projectId} />
          )}
          {activeTab === 'photos' && (
            <PhotosTab milestone={milestone} projectId={projectId} />
          )}
          {activeTab === 'costs' && (
            <CostsTab milestone={milestone} projectId={projectId} />
          )}
          {activeTab === 'activity' && (
            <ActivityTab milestone={milestone} projectId={projectId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default MilestoneDetailPanel;
