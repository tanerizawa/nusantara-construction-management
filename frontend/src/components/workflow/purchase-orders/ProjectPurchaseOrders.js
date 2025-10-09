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
 * ProjectPurchaseOrders - Main Container (Best Practice: Mode-based)
 * Mode: 'create' = Create new PO flow (RAB Selection → Form)
 * Mode: 'history' = View all POs (Table with summary)
 */
const ProjectPurchaseOrders = ({ 
  projectId, 
  project, 
  onDataChange,
  mode = 'history', // 'create' or 'history'
  onComplete, // Callback when PO created successfully
  onCreateNew // Callback to switch to create mode
}) => {
  // Destructure project props
  const { 
    id: projectIdValue = projectId, 
    name: projectName, 
    address: projectAddress 
  } = project || {};
  
  // Create PO flow state (only used when mode='create')
  const [createPOStep, setCreatePOStep] = useState('rab-selection'); // 'rab-selection', 'create-po'
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

  // Debug logging
  useEffect(() => {
    console.log('========================================');
    console.log('[ProjectPurchaseOrders] MODE:', mode);
    console.log('[ProjectPurchaseOrders] createPOStep:', createPOStep);
    console.log('[ProjectPurchaseOrders] RAB Items:', filteredRABItems?.length);
    console.log('[ProjectPurchaseOrders] Purchase Orders:', purchaseOrders?.length);
    console.log('========================================');
  }, [mode, createPOStep, filteredRABItems, purchaseOrders]);

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
        setCreatePOStep('rab-selection');
        setSelectedRABItems([]);
        setSupplierInfo({ name: '', contact: '', address: '', deliveryDate: '' });
        
        // Notify parent
        if (onDataChange) onDataChange();
        
        // Success message
        alert(`✅ Purchase Order ${result.data.poNumber} berhasil dibuat!`);
        
        // Switch to history mode (via parent)
        if (onComplete) onComplete();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Gagal membuat Purchase Order: ' + error.message);
    }
  };

  /**
   * Handle view navigation within create mode
   */
  const handleProceedToCreatePO = () => {
    if (selectedRABItems.length === 0) {
      alert('Pilih minimal 1 item RAB untuk membuat PO');
      return;
    }
    setCreatePOStep('create-po');
  };

  const handleBackToRABSelection = () => {
    setCreatePOStep('rab-selection');
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
      {/* MODE: CREATE - Buat PO Baru */}
      {mode === 'create' ? (
        <>
          {console.log('🔵 [RENDER] CREATE MODE - Showing RAB Selection')}
          {/* Header for Create Mode */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              {createPOStep === 'rab-selection' ? 'Pilih Material dari RAB' : 'Buat Purchase Order Baru'}
            </h2>
            <p className="text-[#8E8E93] mt-1">
              {createPOStep === 'rab-selection' 
                ? `Pilih material dari RAB yang sudah disetujui untuk ${projectName || 'proyek ini'}`
                : 'Lengkapi informasi supplier dan detail pemesanan material'
              }
            </p>
          </div>

          {/* Step 1: RAB Selection */}
          {createPOStep === 'rab-selection' && (
            <RABSelectionView 
              rabItems={filteredRABItems}
              selectedRABItems={selectedRABItems}
              setSelectedRABItems={setSelectedRABItems}
              onNext={handleProceedToCreatePO}
              loading={loading}
              projectId={projectId}
            />
          )}

          {/* Step 2: Create PO Form */}
          {createPOStep === 'create-po' && (
            <div className="space-y-4">
              {/* Back button */}
              <button
                onClick={handleBackToRABSelection}
                style={{
                  backgroundColor: '#2C2C2E',
                  border: '1px solid #38383A'
                }}
                className="flex items-center px-4 py-2 text-white rounded-lg hover:bg-[#3A3A3C] transition-colors"
              >
                ← Kembali ke Pilih Material
              </button>

              <CreatePOView
                selectedRABItems={selectedRABItems}
                rabItems={rabItems}
                supplierInfo={supplierInfo}
                setSupplierInfo={setSupplierInfo}
                onSubmit={handleCreatePO}
                onBack={handleBackToRABSelection}
                projectId={projectId}
              />
            </div>
          )}
        </>
      ) : mode === 'history' ? (
        <>
          {console.log('🟢 [RENDER] HISTORY MODE - Showing PO List')}
          <POListView
            purchaseOrders={purchaseOrders}
            onCreateNew={onCreateNew}
            projectName={projectName}
            projectAddress={projectAddress}
            projectId={projectId}
            loading={loading}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#8E8E93]">Invalid mode: {mode}</p>
        </div>
      )}
    </div>
  );
};

export default ProjectPurchaseOrders;
