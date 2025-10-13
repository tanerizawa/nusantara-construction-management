// Milestone Detail Drawer - Main component with tabs
import React, { useState } from 'react';
import { X, FileText, ImageIcon, DollarSign, Activity } from 'lucide-react';
import OverviewTab from './detail-tabs/OverviewTab';
import PhotosTab from './detail-tabs/PhotosTab';
import CostsTab from './detail-tabs/CostsTab';
import ActivityTab from './detail-tabs/ActivityTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: FileText },
  { id: 'photos', label: 'Photos', icon: ImageIcon },
  { id: 'costs', label: 'Costs', icon: DollarSign },
  { id: 'activity', label: 'Activity', icon: Activity }
];

const MilestoneDetailDrawer = ({ milestone, projectId, onClose }) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!milestone) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab milestone={milestone} projectId={projectId} />;
      case 'photos':
        return <PhotosTab milestone={milestone} projectId={projectId} />;
      case 'costs':
        return <CostsTab milestone={milestone} projectId={projectId} />;
      case 'activity':
        return <ActivityTab milestone={milestone} projectId={projectId} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full md:w-2/3 lg:w-1/2 bg-[#1C1C1E] z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-[#38383A]">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-bold text-white truncate">
                {milestone.name}
              </h2>
              {milestone.description && (
                <p className="text-sm text-[#8E8E93] mt-1 line-clamp-2">
                  {milestone.description}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="ml-4 p-2 text-[#8E8E93] hover:text-white hover:bg-[#38383A] rounded-lg transition-colors"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex-shrink-0 px-6 border-b border-[#38383A] bg-[#2C2C2E]">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 font-medium text-sm
                    transition-colors border-b-2
                    ${isActive 
                      ? 'text-[#0A84FF] border-[#0A84FF]' 
                      : 'text-[#8E8E93] border-transparent hover:text-white'
                    }
                  `}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {renderTabContent()}
        </div>
      </div>
    </>
  );
};

export default MilestoneDetailDrawer;
