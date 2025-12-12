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
      <div className="rounded-3xl border border-white/5 bg-[#05070d]/90 p-5 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-gradient-to-br from-[#c084fc]/30 to-[#a855f7]/20 p-3 text-white">
              <Clipboard size={24} />
            </div>
            <div>
              <p className="eyebrow-label text-white/60">Execution</p>
              <h2 className="text-xl font-semibold text-white">Work Orders</h2>
              <p className="text-sm text-white/60">
                Manajemen Work Order untuk jasa, tenaga kerja, dan peralatan
              </p>
            </div>
          </div>
          <div className="flex gap-2 rounded-2xl border border-white/10 bg-[#05070d] p-1">
            {[
              { key: 'history', label: 'Riwayat WO', icon: List },
              { key: 'create', label: 'Buat WO', icon: Plus }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveSubTab(key)}
                className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
                  activeSubTab === key
                    ? 'bg-gradient-to-r from-[#c084fc] to-[#ec4899] text-white shadow-[0_12px_24px_rgba(236,72,153,0.35)]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
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
