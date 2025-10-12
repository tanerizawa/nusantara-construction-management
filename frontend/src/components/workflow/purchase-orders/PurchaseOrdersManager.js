import React, { useState, useEffect } from 'react';
import { Plus, List, ShoppingCart } from 'lucide-react';
import ProjectPurchaseOrders from './ProjectPurchaseOrders';

/**
 * PurchaseOrdersManager - Wrapper with sub-tabs
 * Manages "Buat PO" and "Riwayat PO" tabs
 */
const PurchaseOrdersManager = ({ projectId, project, onDataChange }) => {
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
    const mainTab = currentHash.split(':')[0] || 'purchase-orders';
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

  // Callback when PO created successfully
  const handlePOCreated = () => {
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
          <div className="p-2 bg-[#0A84FF]/10 rounded-lg">
            <ShoppingCart size={24} className="text-[#0A84FF]" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-white">Purchase Orders</h2>
            <p className="text-sm text-[#8E8E93] mt-1">
              Manajemen Purchase Order dan procurement
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
                ? 'bg-[#0A84FF] text-white shadow-lg'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E]'
              }
            `}
          >
            <List size={16} />
            Riwayat PO
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
              text-sm font-medium transition-all
              ${activeSubTab === 'create'
                ? 'bg-[#0A84FF] text-white shadow-lg'
                : 'text-[#8E8E93] hover:text-white hover:bg-[#2C2C2E]'
              }
            `}
          >
            <Plus size={16} />
            Buat PO
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="transition-all duration-300">
        {activeSubTab === 'history' && (
          <ProjectPurchaseOrders
            projectId={projectId}
            project={project}
            onDataChange={onDataChange}
            mode="history"
            onCreateNew={handleCreateNew}
          />
        )}

        {activeSubTab === 'create' && (
          <ProjectPurchaseOrders
            projectId={projectId}
            project={project}
            onDataChange={onDataChange}
            mode="create"
            onComplete={handlePOCreated}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseOrdersManager;
