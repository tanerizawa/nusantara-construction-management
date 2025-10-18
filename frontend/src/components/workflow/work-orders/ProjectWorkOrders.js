import React, { useState, useEffect, useCallback } from 'react';
import { Clipboard } from 'lucide-react';

// Import RAB hook from purchase-orders (shared)
import { useRABItems } from '../purchase-orders/hooks';
import useApprovalActions from '../../../hooks/useApprovalActions';

// Components
import WOSummary from './components/WOSummary';

// Views
import RABSelectionView from '../purchase-orders/views/RABSelectionView';
import CreateWOView from './views/CreateWOView';
import WOListView from './views/WOListView';

// Hooks
import { useWorkOrders } from './hooks/useWorkOrders';

/**
 * ProjectWorkOrders - Main Container for Work Orders
 * Manages service, labor, and equipment work orders
 * Mode: 'create' = Create new WO flow (RAB Selection → Form)
 * Mode: 'history' = View all WOs (Table with summary)
 */
const ProjectWorkOrders = ({ 
  projectId, 
  project, 
  onDataChange,
  mode = 'history', // 'create' or 'history'
  onComplete, // Callback when WO created successfully
  onCreateNew // Callback to switch to create mode
}) => {
  // Destructure project props
  const { 
    id: projectIdValue = projectId, 
    name: projectName, 
    address: projectAddress 
  } = project || {};
  
  // Create WO flow state (only used when mode='create')
  const [createWOStep, setCreateWOStep] = useState('rab-selection'); // 'rab-selection', 'create-wo'
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [contractorInfo, setContractorInfo] = useState({
    name: '',
    contact: '',
    address: '',
    startDate: '',
    endDate: ''
  });

  // Custom hooks for data management
  const { 
    workOrders, 
    loading: woLoading, 
    createWorkOrder, 
    fetchWorkOrders 
  } = useWorkOrders(projectId);
  
  // Approval actions hook
  const { 
    approveItem, 
    rejectItem,
    isLoading: approvalLoading,
    error: approvalError
  } = useApprovalActions('work-orders', projectId, onDataChange);

  // Notification helper (MOVED UP - must be before fetchAvailableRAB)
  const showNotification = useCallback((message, type = 'info') => {
    window.dispatchEvent(new CustomEvent('show-notification', {
      detail: { type, message, duration: 3000 }
    }));
  }, []);
  
  // State for available RAB items
  const [availableRABItems, setAvailableRABItems] = useState([]);
  const [rabLoading, setRabLoading] = useState(false);

  // Fetch available RAB items for WO
  const fetchAvailableRAB = useCallback(async () => {
    try {
      setRabLoading(true);
      console.log('[ProjectWorkOrders] Fetching available RAB items...');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}/work-orders/available-rab`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch available RAB items');
      }

      const result = await response.json();
      console.log('[ProjectWorkOrders] Available RAB items:', result.data);
      
      setAvailableRABItems(result.data || []);
    } catch (error) {
      console.error('[ProjectWorkOrders] Error fetching available RAB:', error);
      showNotification('Gagal memuat item RAB tersedia', 'error');
      setAvailableRABItems([]);
    } finally {
      setRabLoading(false);
    }
  }, [projectId, showNotification]);

  // Fetch available RAB when in create mode
  useEffect(() => {
    if (mode === 'create' && projectId) {
      fetchAvailableRAB();
    }
  }, [mode, projectId, fetchAvailableRAB]);

  // Loading state
  const loading = woLoading || rabLoading;

  // Debug logging
  useEffect(() => {
    console.log('========================================');
    console.log('[ProjectWorkOrders] MODE:', mode);
    console.log('[ProjectWorkOrders] createWOStep:', createWOStep);
    console.log('[ProjectWorkOrders] Available RAB Items:', availableRABItems?.length);
    console.log('[ProjectWorkOrders] Work Orders:', workOrders?.length);
    console.log('========================================');
  }, [mode, createWOStep, availableRABItems, workOrders]);

  /**
   * Handle WO creation
   */
  const handleCreateWO = async (woData) => {
    try {
      console.log('🚀 [CREATE WO] Starting WO creation...');
      console.log('📦 [CREATE WO] WO Data:', woData);
      
      // Create WO via hook
      console.log('📡 [CREATE WO] Calling createWorkOrder API...');
      const result = await createWorkOrder(woData);
      console.log('📨 [CREATE WO] API Response:', result);
      
      if (result.success) {
        console.log('✅ [CREATE WO] WO created successfully:', result.data);
        
        // Wait a moment for tracking records to be created
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Refresh RAB items to update quantities
        console.log('🔄 [CREATE WO] Refreshing RAB items...');
        await fetchAvailableRAB();
        console.log('✅ [CREATE WO] RAB items refreshed');
        
        // Reset form
        setCreateWOStep('rab-selection');
        setSelectedRABItems([]);
        setContractorInfo({ name: '', contact: '', address: '', startDate: '', endDate: '' });
        
        // Notify parent
        if (onDataChange) onDataChange();
        
        // Success message
        showNotification(`✅ Work Order ${result.data.woNumber} berhasil dibuat!`, 'success');
        
        // Switch to history mode (via parent)
        if (onComplete) onComplete();
      } else {
        console.error('❌ [CREATE WO] API returned error:', result.error);
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('💥 [CREATE WO] Exception caught:', error);
      showNotification('Gagal membuat Work Order: ' + error.message, 'error');
    }
  };

  /**
   * Handle view navigation within create mode
   */
  const handleProceedToCreateWO = () => {
    if (selectedRABItems.length === 0) {
      showNotification('Pilih minimal 1 item RAB untuk membuat WO', 'warning');
      return;
    }
    setCreateWOStep('create-wo');
  };

  const handleBackToRABSelection = () => {
    setCreateWOStep('rab-selection');
  };

  /**
   * Approval Handlers
   */
  const handleApproveWO = async (wo) => {
    try {
      console.log('🔍 [APPROVE WO] Starting approval for:', wo);
      
      const approvalItem = {
        id: wo.id,
        code: wo.woNumber || wo.wo_number,
        name: `WO - ${wo.contractorName || wo.contractor_name}`,
        type: 'work-orders',
        total_amount: wo.totalAmount || wo.total_amount || 0,
        approval_status: wo.status,
        metadata: wo
      };

      const result = await approveItem(approvalItem, 'work-orders');
      
      if (result.success) {
        showNotification(`WO ${wo.woNumber || wo.wo_number} berhasil diapprove!`, 'success');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await Promise.all([
          fetchWorkOrders(),
          fetchAvailableRAB()
        ]);
        
        if (onDataChange) onDataChange();
      } else {
        showNotification(`Gagal approve WO: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('❌ [APPROVE WO] Error:', error);
      showNotification('Terjadi kesalahan saat approve WO', 'error');
    }
  };

  const handleRejectWO = async (wo) => {
    try {
      console.log('🔍 [REJECT WO] Starting rejection for:', wo);
      
      const reason = prompt('Alasan penolakan WO:');
      if (!reason || !reason.trim()) {
        showNotification('Alasan penolakan wajib diisi', 'warning');
        return;
      }

      const approvalItem = {
        id: wo.id,
        code: wo.woNumber || wo.wo_number,
        name: `WO - ${wo.contractorName || wo.contractor_name}`,
        type: 'work-orders',
        total_amount: wo.totalAmount || wo.total_amount || 0,
        approval_status: wo.status,
        metadata: wo
      };

      const result = await rejectItem(approvalItem, reason, 'work-orders');
      
      if (result.success) {
        showNotification(`WO ${wo.woNumber || wo.wo_number} ditolak`, 'warning');
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        await Promise.all([
          fetchWorkOrders(),
          fetchAvailableRAB()
        ]);
        
        if (onDataChange) onDataChange();
      } else {
        showNotification(`Gagal reject WO: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('❌ [REJECT WO] Error:', error);
      showNotification('Terjadi kesalahan saat reject WO', 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* MODE: CREATE - Buat WO Baru */}
      {mode === 'create' ? (
        <>
          {/* Header for Create Mode */}
          <div>
            <h2 className="text-2xl font-bold text-white">
              {createWOStep === 'rab-selection' ? 'Pilih Item dari RAB' : 'Buat Work Order Baru'}
            </h2>
            <p className="text-[#8E8E93] mt-1">
              {createWOStep === 'rab-selection' 
                ? `Pilih jasa, tenaga kerja, atau peralatan dari RAB untuk ${projectName || 'proyek ini'}`
                : 'Lengkapi informasi kontraktor dan detail pekerjaan'
              }
            </p>
          </div>

          {/* Step 1: RAB Selection */}
          {createWOStep === 'rab-selection' && (
            <RABSelectionView 
              rabItems={availableRABItems}
              selectedRABItems={selectedRABItems}
              setSelectedRABItems={setSelectedRABItems}
              onNext={handleProceedToCreateWO}
              loading={rabLoading}
              projectId={projectId}
              mode="wo"  // Work Order mode - shows service, labor, equipment
            />
          )}

          {/* Step 2: Create WO Form */}
          {createWOStep === 'create-wo' && (
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
                ← Kembali ke Pilih Item
              </button>

                            <CreateWOView
                selectedRABItems={selectedRABItems}
                rabItems={availableRABItems}
                projectId={projectId}
                project={project}
                contractorInfo={contractorInfo}
                setContractorInfo={setContractorInfo}
                onSubmit={handleCreateWO}
                onBack={() => setCreateWOStep('rab-selection')}
                loading={woLoading}
              />
            </div>
          )}
        </>
      ) : mode === 'history' ? (
        <>
          {console.log('🟢 [RENDER] HISTORY MODE - Showing WO List')}
          <WOListView
            workOrders={workOrders}
            onCreateNew={onCreateNew}
            projectName={projectName}
            projectAddress={projectAddress}
            projectId={projectId}
            loading={loading}
            onApproveWO={handleApproveWO}
            onRejectWO={handleRejectWO}
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

export default ProjectWorkOrders;
