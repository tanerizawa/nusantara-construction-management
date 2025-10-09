import React, { useState, useEffect } from 'react';
import { FileText } from 'lucide-react';

// Custom Hooks
import { usePurchaseOrders, useRABItems, usePOSync } from './hooks';

// Components
import { POSummary } from './components';

// Views (to be created)
import RABSelectionView from './views/RABSelectionView';
import CreatePOView from './views/CreatePOView';
import POListView from './views/POListView';

// Utils
import { validateCompletePO } from './utils/poValidation';

/**
 * ProjectPurchaseOrders - Main Container (Modularized)
 * Simplified main component that delegates logic to hooks and views
 */
const ProjectPurchaseOrders = ({ projectId, project, onDataChange }) => {
  // Destructure project props
  const { 
    id: projectIdValue = projectId, 
    name: projectName, 
    address: projectAddress 
  } = project || {};
  
  // View state
  const [currentView, setCurrentView] = useState('rab-selection'); // 'rab-selection', 'create-po', 'po-list'
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    contact: '',
    address: '',
    deliveryDate: ''
  });

  // Custom hooks for data management
  const { 
    purchaseOrders, 
    loading: poLoading, 
    createPurchaseOrder, 
    fetchPurchaseOrders 
  } = usePurchaseOrders(projectId);
  
  const { 
    rabItems, 
    filteredRABItems, 
    loading: rabLoading, 
    fetchRABItems 
  } = useRABItems(projectId);
  
  const { 
    broadcastPOChange, 
    setupPOListener 
  } = usePOSync(projectId, onDataChange);

  // Loading state
  const loading = poLoading || rabLoading;

  /**
   * Handle PO creation
   */
  const handleCreatePO = async (poData) => {
    try {
      // Validate PO data
      const validation = validateCompletePO(poData);
      if (!validation.isValid) {
        alert('Validasi gagal:\n' + validation.errors.join('\n'));
        return;
      }

      // Create PO via hook
      const result = await createPurchaseOrder(poData);
      
      if (result.success) {
        // Broadcast change to other components
        broadcastPOChange(result.data, 'create');
        
        // Refresh RAB items to update quantities
        await fetchRABItems();
        
        // Reset form
        setCurrentView('rab-selection');
        setSelectedRABItems([]);
        setSupplierInfo({ name: '', contact: '', address: '', deliveryDate: '' });
        
        // Notify parent
        if (onDataChange) onDataChange();
        
        // Success message
        alert(`✅ Purchase Order ${result.data.poNumber} berhasil dibuat!`);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Gagal membuat Purchase Order: ' + error.message);
    }
  };

  /**
   * Handle view navigation
   */
  const handleProceedToCreatePO = () => {
    if (selectedRABItems.length === 0) {
      alert('Pilih minimal 1 item RAB untuk membuat PO');
      return;
    }
    setCurrentView('create-po');
  };

  const handleBackToSelection = () => {
    setCurrentView('rab-selection');
  };

  const handleViewPOList = () => {
    setCurrentView('po-list');
  };

  // Listen for PO changes from approval dashboard
  useEffect(() => {
    const cleanup = setupPOListener((detail) => {
      console.log('[PO Container] Received PO change:', detail);
      fetchPurchaseOrders();
    });
    
    return cleanup;
  }, [setupPOListener, fetchPurchaseOrders]);

  // Auto-refresh data every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('[AUTO-REFRESH] Refreshing RAB and PO data...');
      fetchRABItems();
      fetchPurchaseOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchRABItems, fetchPurchaseOrders]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Purchase Order - Material Procurement
          </h2>
          <p className="text-gray-600">
            Pilih material dari RAB yang sudah disetujui untuk {projectName || 'proyek ini'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {currentView !== 'rab-selection' && (
            <button
              onClick={handleBackToSelection}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kembali ke Pilih Material
            </button>
          )}
          <button
            onClick={handleViewPOList}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Riwayat PO ({purchaseOrders.length})
          </button>
        </div>
      </div>

      {/* PO Summary (visible on po-list view) */}
      {currentView === 'po-list' && (
        <POSummary purchaseOrders={purchaseOrders} />
      )}

      {/* View Switching */}
      {currentView === 'rab-selection' && (
        <RABSelectionView 
          rabItems={filteredRABItems}
          selectedRABItems={selectedRABItems}
          setSelectedRABItems={setSelectedRABItems}
          onNext={handleProceedToCreatePO}
          loading={loading}
          projectId={projectId}
        />
      )}

      {currentView === 'create-po' && (
        <CreatePOView
          selectedRABItems={selectedRABItems}
          rabItems={rabItems}
          supplierInfo={supplierInfo}
          setSupplierInfo={setSupplierInfo}
          onSubmit={handleCreatePO}
          onBack={handleBackToSelection}
          projectId={projectId}
        />
      )}

      {currentView === 'po-list' && (
        <POListView
          purchaseOrders={purchaseOrders}
          onBack={handleBackToSelection}
          projectName={projectName}
          projectAddress={projectAddress}
          projectId={projectId}
          loading={loading}
        />
      )}
    </div>
  );
};

export default ProjectPurchaseOrders;
