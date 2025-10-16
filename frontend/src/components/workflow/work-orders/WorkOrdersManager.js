import React, { useState, useEffect } from 'react';
import { Plus, List, Clipboard } from 'lucide-react';
import ProjectWorkOrders from './ProjectWorkOrders';

/**
 * WorkOrdersManager - Wrapper with sub-tabs
 * Manages "Buat WO" and "Riwayat WO" tabs
 */
const WorkOrdersManager = ({ projectId, project, onDataChange }) => {
  // Sub-tab state (dari URL hash jika ada)
  const getInitialSubTab = () => {
    const hash = window.location.hash.replace('#', '');
    if (hash.includes(':')) {
      const subTab = hash.split(':')[1];
      if (subTab === 'create' || subTab === 'history') {
        return subTab;
      }
    }
    return 'history'; // Default to history (list view)
  };

  const [activeSubTab, setActiveSubTab] = useState(getInitialSubTab);

  // Update URL hash when sub-tab changes
  useEffect(() => {
    const currentHash = window.location.hash.replace('#', '');
    const mainTab = currentHash.split(':')[0] || 'work-orders';
    window.location.hash = `${mainTab}:${activeSubTab}`;
  }, [activeSubTab]);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash.includes(':')) {
        const subTab = hash.split(':')[1];
        if ((subTab === 'create' || subTab === 'history') && subTab !== activeSubTab) {
          setActiveSubTab(subTab);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activeSubTab]);

  // Callback when WO created successfully
  const handleWOCreated = () => {
    setActiveSubTab('history'); // Switch to history tab
    onDataChange?.(); // Refresh parent data
  };

  // Callback to switch to create mode
  const handleCreateNew = () => {
    setActiveSubTab('create');
  };

  return (
    <div className="space-y-6">
      {/* Sub-tabs Header */}
      <div className="bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] border border-[#38383A] rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#AF52DE]/10 rounded-lg">
            <Clipboard size={24} className="text-[#AF52DE]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">Work Orders</h2>
            <p className="text-sm text-[#8E8E93] mt-1">
              Manajemen Work Order untuk jasa, tenaga kerja, dan peralatan
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex gap-2 mt-4 p-1 bg-[#1C1C1E] rounded-lg">
          <button
            onClick={() => setActiveSubTab('history')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all
              ${activeSubTab === 'history'
                ? 'bg-[#AF52DE] text-white shadow-lg'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E]'
              }
            `}
          >
            <List size={16} />
            Riwayat WO
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all
              ${activeSubTab === 'create'
                ? 'bg-[#AF52DE] text-white shadow-lg'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E]'
              }
            `}
          >
            <Plus size={16} />
            Buat WO
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300">
        {activeSubTab === 'history' && (
          <ProjectWorkOrders
            projectId={projectId}
            project={project}
            onDataChange={onDataChange}
            mode="history"
            onCreateNew={handleCreateNew}
          />
        )}

        {activeSubTab === 'create' && (
          <ProjectWorkOrders
            projectId={projectId}
            project={project}
            onDataChange={onDataChange}
            mode="create"
            onComplete={handleWOCreated}
          />
        )}
      </div>
    </div>
  );
};

export default WorkOrdersManager;
