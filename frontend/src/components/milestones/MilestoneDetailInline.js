import React, { useState } from 'react';
import { Camera, DollarSign, Activity, Info } from 'lucide-react';

// Import tabs from correct path
import OverviewTab from './detail-tabs/OverviewTab';
import PhotosTab from './detail-tabs/PhotosTab';
import CostsTab from './detail-tabs/CostsTab';
import ActivityTab from './detail-tabs/ActivityTab';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'photos', label: 'Foto Dokumentasi', icon: Camera },
  { id: 'costs', label: 'Biaya & Overheat', icon: DollarSign },
  { id: 'activity', label: 'Timeline Kegiatan', icon: Activity }
];

const MilestoneDetailInline = ({ milestone, projectId }) => {
  const [activeTab, setActiveTab] = useState('overview');

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
    <div className="bg-[#1C1C1E] rounded-lg border border-[#38383A] overflow-hidden">
      {/* Tab Navigation */}
      <div className="flex border-b border-[#38383A] bg-[#2C2C2E]">
        {TABS.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium
                transition-colors relative
                ${isActive 
                  ? 'text-[#0A84FF] bg-[#1C1C1E]' 
                  : 'text-[#EBEBF5]/60 hover:text-[#EBEBF5] hover:bg-[#38383A]/30'
                }
              `}
            >
              <TabIcon size={16} />
              <span>{tab.label}</span>
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A84FF]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default MilestoneDetailInline;
