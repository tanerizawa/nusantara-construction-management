import React, { useState } from 'react';
import { HardHat, Package, TrendingDown, Wrench, PieChart } from 'lucide-react';

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
      label: 'Depreciation Tracker',
      icon: TrendingDown,
      component: DepreciationTracker
    },
    {
      id: 'maintenance',
      label: 'Maintenance Schedule',
      icon: Wrench,
      component: MaintenanceScheduler
    },
    {
      id: 'analytics',
      label: 'Asset Analytics',
      icon: PieChart,
      component: AssetAnalytics
    }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <HardHat className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Asset Management</h1>
              <p className="text-sm text-gray-600">Manage your construction assets and equipment</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 bg-blue-50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } group inline-flex items-center px-4 py-3 border-b-2 font-medium text-sm rounded-t-lg transition-all duration-200`}
                >
                  <Icon
                    className={`${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    } -ml-0.5 mr-2 h-4 w-4`}
                  />
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