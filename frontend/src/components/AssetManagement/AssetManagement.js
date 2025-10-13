import React, { useState } from 'react';
import { Package, TrendingDown, Wrench, PieChart } from 'lucide-react';

// Import existing components
import AssetRegistry from './AssetRegistry';
import DepreciationTracker from './DepreciationTracker';
import MaintenanceScheduler from './MaintenanceScheduler';
import AssetAnalytics from './AssetAnalytics';

const AssetManagement = () => {
  const [activeTab, setActiveTab] = useState('registry');

  const tabs = [
    {
      id: 'registry',
      label: 'Asset Registry',
      icon: Package,
      component: AssetRegistry
    },
    {
      id: 'depreciation',
      label: 'Depreciation',
      icon: TrendingDown,
      component: DepreciationTracker
    },
    {
      id: 'maintenance',
      label: 'Maintenance',
      icon: Wrench,
      component: MaintenanceScheduler
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: PieChart,
      component: AssetAnalytics
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-[#1C1C1E]">
      {/* Header */}
      <div className="bg-[#2C2C2E] border-b border-[#38383A]">
        <div className="px-6 py-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Asset Management</h1>
            <p className="text-[#98989D] mt-2">Kelola aset konstruksi dan peralatan proyek</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <nav className="flex space-x-2" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-[#0A84FF] text-white'
                      : 'text-[#98989D] hover:text-white hover:bg-[#38383A]/30'
                  } inline-flex items-center px-4 py-2.5 font-medium text-sm rounded-t-lg transition-all duration-200`}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {ActiveComponent && <ActiveComponent />}
      </div>
    </div>
  );
};

export default AssetManagement;