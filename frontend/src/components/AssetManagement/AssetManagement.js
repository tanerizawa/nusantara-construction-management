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
    <div className="min-h-screen bg-[#0b0f19] bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_50%)]">
      {/* Header */}
      <div className="bg-[#0b0f19]/90 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Asset Management</h1>
            <p className="text-white/50 mt-2">Kelola aset konstruksi dan peralatan proyek</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <nav className="flex space-x-1" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'bg-[#0ea5e9] text-white shadow-lg shadow-[#0ea5e9]/20'
                      : 'text-white/60 hover:text-white hover:bg-white/5'
                  } inline-flex items-center px-5 py-3 font-medium text-sm rounded-xl transition-all duration-300`}
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