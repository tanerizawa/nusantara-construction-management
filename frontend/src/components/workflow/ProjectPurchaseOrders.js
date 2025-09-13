import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle,
  Truck,
  Package,
  DollarSign,
  Calendar,
  User,
  Building,
  AlertTriangle,
  Send,
  Download,
  Filter
} from 'lucide-react';

const ProjectPurchaseOrders = ({ projectId, project, onDataChange }) => {
  // Destructure props to ensure they're in scope
  const { id: projectIdValue = projectId, name: projectName, address: projectAddress } = project || {};
  
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [currentView, setCurrentView] = useState('rab-selection'); // 'rab-selection', 'create-po', 'po-list'
  const [selectedRABItems, setSelectedRABItems] = useState([]);
  const [rabItems, setRABItems] = useState([]);
  const [filteredRABItems, setFilteredRABItems] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    contact: '',
    address: '',
    deliveryDate: ''
  });

  const fetchPurchaseOrderData = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/purchase-orders?projectId=${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPurchaseOrders(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRABItems = useCallback(async () => {
    try {
      setLoading(true);
      
      // First, get RAB items for this project
      const response = await fetch(`/api/projects/${projectId}/rab`);
      if (!response.ok) {
        throw new Error('Failed to fetch RAB items');
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        const rabItems = result.data;
        
        // Then get purchase summary for all RAB items in this project
        const summaryResponse = await fetch(`/api/rab-tracking/projects/${projectId}/purchase-summary`);
        let purchaseSummary = {};
        
        if (summaryResponse.ok) {
          const summaryResult = await summaryResponse.json();
          if (summaryResult.success && summaryResult.data) {
            // Convert array to object with rabItemId as key
            purchaseSummary = summaryResult.data.reduce((acc, item) => {
              acc[item.rabItemId] = item;
              return acc;
            }, {});
          }
        }
        
        // Combine RAB items with purchase tracking data
        const enhancedRABItems = rabItems.map(item => {
          const purchaseData = purchaseSummary[item.id] || {
            totalPurchased: 0,
            totalAmount: 0,
            activePOCount: 0,
            lastPurchaseDate: null,
            recordCount: 0
          };
          
          return {
            ...item,
            // Calculate remaining quantity
            remainingQuantity: (parseFloat(item.quantity) || 0) - (parseFloat(purchaseData.totalPurchased) || 0),
            // Ensure non-negative remaining quantity
            availableQuantity: Math.max(0, (parseFloat(item.quantity) || 0) - (parseFloat(purchaseData.totalPurchased) || 0)),
            // Add purchase tracking data
            totalPurchased: parseFloat(purchaseData.totalPurchased) || 0,
            totalPurchaseAmount: parseFloat(purchaseData.totalAmount) || 0,
            activePOCount: parseInt(purchaseData.activePOCount) || 0,
            lastPurchaseDate: purchaseData.lastPurchaseDate,
            purchaseRecordCount: parseInt(purchaseData.recordCount) || 0,
            // Calculate purchase progress percentage
            purchaseProgress: parseFloat(item.quantity) > 0 ? 
              ((parseFloat(purchaseData.totalPurchased) || 0) / parseFloat(item.quantity)) * 100 : 0
          };
        });
        
        setRABItems(enhancedRABItems);
        setFilteredRABItems(enhancedRABItems.filter(item => item.is_approved || item.isApproved));
      } else {
        setErrorMessage('Failed to load RAB items');
      }
    } catch (error) {
      console.error('Error fetching RAB items:', error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const handleCreatePO = async (poData) => {
    try {
      // Extract API-compliant data and tracking data separately
      const { partialPurchase, supplierContact, isPartialPurchase, partialPurchaseNote, id, projectId, ...apiData } = poData;
      
      // Only send fields that are in backend validation schema
      const finalAPIData = {
        poNumber: apiData.poNumber,
        supplierId: apiData.supplierId,
        supplierName: apiData.supplierName,
        orderDate: apiData.orderDate,
        expectedDeliveryDate: apiData.expectedDeliveryDate,
        status: apiData.status,
        items: apiData.items,
        subtotal: apiData.subtotal,
        taxAmount: apiData.taxAmount,
        totalAmount: apiData.totalAmount,
        notes: apiData.notes || '',
        deliveryAddress: apiData.deliveryAddress || '',
        terms: apiData.terms || '',
        projectId: projectId // Now included in backend schema
      };

      console.log('Sending PO data to backend:', JSON.stringify(finalAPIData, null, 2));

      const response = await fetch('/api/purchase-orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(finalAPIData)
      });

      if (response.ok) {
        const result = await response.json();
        
        // Create tracking data for partial purchase
        const trackingItems = finalAPIData.items.map(item => {
          const rabItem = rabItems.find(rab => rab.id.toString() === item.inventoryId);
          return {
            rabItemId: item.inventoryId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalAmount: item.totalPrice,
            totalRABQuantity: rabItem?.quantity || 0,
            previouslyPurchased: rabItem?.totalPurchased || 0,
            availableBeforePO: rabItem?.availableQuantity || 0,
            remainingAfterPO: (rabItem?.availableQuantity || 0) - item.quantity
          };
        });
        
        // Update RAB item purchase tracking
        await updateRABPurchaseTracking(trackingItems);
        
        // Refresh data
        await fetchPurchaseOrderData();
        await fetchRABItems(); // Refresh RAB items to show updated quantities
        
        if (onDataChange) onDataChange();
        
        // Reset form
        setCurrentView('rab-selection');
        setSelectedRABItems([]);
        setSupplierInfo({ name: '', contact: '', address: '', deliveryDate: '' });
        
        // Success notification with partial purchase details
        const totalItems = finalAPIData.items.length;
        const hasRemainingItems = trackingItems.some(item => item.remainingAfterPO > 0);
        
        let message = `Purchase Order berhasil dibuat dengan ${totalItems} item.`;
        if (hasRemainingItems) {
          message += ' Beberapa item masih memiliki sisa quantity yang dapat dipesan di PO berikutnya.';
        }
        
        alert(message);
      } else {
        const errorResponse = await response.json();
        console.error('Backend validation error:', errorResponse);
        console.error('Validation details:', errorResponse.details);
        console.error('Sent data:', finalAPIData);
        throw new Error(errorResponse.message || errorResponse.error || 'Failed to create purchase order');
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      alert('Gagal membuat Purchase Order: ' + error.message);
    }
  };

  const updateRABPurchaseTracking = async (poItems) => {
    try {
      // Update each RAB item's purchase tracking
      const updatePromises = poItems.map(async (item) => {
        const response = await fetch(
          `/api/database/projects/${projectId}/rab-items/${item.rabItemId}/purchase-tracking`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalAmount: item.totalAmount,
              poReference: 'PENDING', // Will be updated with actual PO number
              purchaseDate: new Date().toISOString(),
              status: 'pending'
            })
          }
        );
        
        if (!response.ok) {
          console.error(`Failed to update purchase tracking for RAB item ${item.rabItemId}`);
        }
      });
      
      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error updating RAB purchase tracking:', error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const fetchUserDetails = async () => {
    try {
      // Get current user from localStorage or context
      const token = localStorage.getItem('token');
      if (token) {
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          // Store user details for signatures and display
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Fetch data when component mounts or projectId changes
  useEffect(() => {
    fetchRABItems();
    fetchPurchaseOrderData();
    fetchUserDetails();
  }, [projectId, fetchRABItems]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Purchase Order - Material Procurement</h2>
          <p className="text-gray-600">Pilih material dari RAB yang sudah disetujui untuk {project.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          {currentView !== 'rab-selection' && (
            <button
              onClick={() => setCurrentView('rab-selection')}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kembali ke Pilih Material
            </button>
          )}
          <button
            onClick={() => setCurrentView('po-list')}
            className="flex items-center px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
          >
            <FileText className="h-4 w-4 mr-2" />
            Riwayat PO ({purchaseOrders.length})
          </button>
        </div>
      </div>

      {/* Different Views */}
      {currentView === 'rab-selection' && (
        <RABSelectionView 
          rabItems={rabItems}
          selectedRABItems={selectedRABItems}
          setSelectedRABItems={setSelectedRABItems}
          onNext={() => setCurrentView('create-po')}
          loading={loading}
        />
      )}

      {currentView === 'create-po' && (
        <CreatePOFromRABView
          selectedRABItems={selectedRABItems}
          rabItems={rabItems}
          supplierInfo={supplierInfo}
          setSupplierInfo={setSupplierInfo}
          onSubmit={handleCreatePO}
          onBack={() => setCurrentView('rab-selection')}
          projectId={projectId}
        />
      )}

      {currentView === 'po-list' && (
        <POHistoryView
          purchaseOrders={purchaseOrders}
          onBack={() => setCurrentView('rab-selection')}
          projectName={projectName}
          projectAddress={projectAddress}
          projectId={projectId}
        />
      )}
    </div>
  );
};

// RAB Selection View - Main view for selecting materials
const RABSelectionView = ({ rabItems, selectedRABItems, setSelectedRABItems, onNext, loading }) => {
  const toggleRABItem = (itemId) => {
    // Semua item yang ditampilkan sudah approved, jadi langsung toggle
    const updatedSelection = selectedRABItems.includes(itemId)
      ? selectedRABItems.filter(id => id !== itemId)
      : [...selectedRABItems, itemId];
    setSelectedRABItems(updatedSelection);
  };

  const selectedItems = rabItems.filter(item => selectedRABItems.includes(item.id));
  const approvedItems = rabItems; // Semua item sudah approved
  const totalValue = selectedItems.reduce((sum, item) => {
    const unitPrice = item.unitPrice || item.unit_price || 0;
    return sum + (item.quantity * unitPrice);
  }, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Summary Cards - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center">
            <Package className="h-6 w-6 text-blue-600" />
            <div className="ml-2">
              <p className="text-lg font-bold text-gray-900">{rabItems.length}</p>
              <p className="text-xs text-gray-600">Material Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <div className="ml-2">
              <p className="text-lg font-bold text-green-600">{selectedRABItems.length}</p>
              <p className="text-xs text-gray-600">Material Dipilih</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center">
            <DollarSign className="h-6 w-6 text-purple-600" />
            <div className="ml-2">
              <p className="text-sm font-bold text-purple-600">{formatCurrency(totalValue)}</p>
              <p className="text-xs text-gray-600">Total Dipilih</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white border rounded-lg p-3">
          <div className="flex items-center justify-center">
            <button
              onClick={onNext}
              disabled={selectedRABItems.length === 0}
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Lanjut ke PO ({selectedRABItems.length})
            </button>
          </div>
        </div>
      </div>

      {/* RAB Items List */}
      <div className="bg-white border rounded-lg">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-base font-medium text-gray-900">Material RAB yang Disetujui</h3>
          <p className="text-xs text-gray-600">Pilih material untuk Purchase Order</p>
        </div>

        {rabItems.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-10 w-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-900 mb-1">Belum ada Material Approved</h3>
            <p className="text-sm text-gray-600">Material yang sudah disetujui akan muncul di sini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {rabItems.map((item) => {
              const isSelected = selectedRABItems.includes(item.id);
              const unitPrice = item.unitPrice || item.unit_price || 0;
              const totalQuantity = item.quantity || 0;
              const purchasedQuantity = item.totalPurchased || 0;
              const availableQuantity = item.availableQuantity || totalQuantity;
              const purchaseProgress = totalQuantity > 0 ? (purchasedQuantity / totalQuantity) * 100 : 0;
              const isFullyPurchased = availableQuantity <= 0;
              
              return (
                <div
                  key={item.id}
                  className={`p-4 transition-colors ${
                    isFullyPurchased 
                      ? 'bg-gray-50 opacity-75' 
                      : isSelected 
                        ? 'bg-blue-50 border-l-4 border-blue-600' 
                        : 'hover:bg-gray-50 cursor-pointer'
                  }`}
                  onClick={() => !isFullyPurchased && toggleRABItem(item.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={isFullyPurchased}
                        onChange={() => !isFullyPurchased && toggleRABItem(item.id)}
                        className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {item.description || item.item_name || 'Material'}
                          </h4>
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Approved
                          </span>
                          {isFullyPurchased && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                              Fully Purchased
                            </span>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2">{item.category}</p>
                        
                        {/* Purchase Progress Bar */}
                        {purchasedQuantity > 0 && (
                          <div className="mb-3">
                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                              <span>Progress Pembelian</span>
                              <span>{purchaseProgress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  purchaseProgress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(purchaseProgress, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                          <div>
                            <p className="text-xs text-gray-500">Total RAB</p>
                            <p className="text-sm font-medium">{totalQuantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Sudah Dibeli</p>
                            <p className="text-sm font-medium text-blue-600">{purchasedQuantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Tersedia</p>
                            <p className={`text-sm font-medium ${
                              availableQuantity > 0 ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {availableQuantity} {item.unit}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Harga Satuan</p>
                            <p className="text-sm font-medium">{formatCurrency(unitPrice)}</p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Total Tersedia</p>
                            <p className="text-sm font-medium text-green-600">
                              {formatCurrency(availableQuantity * unitPrice)}
                            </p>
                          </div>
                        </div>
                        
                        {/* Purchase History Summary */}
                        {item.purchaseHistory && item.purchaseHistory.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-600">
                                <FileText className="h-3 w-3 mr-1" />
                                <span>{item.purchaseHistory.length} PO sebelumnya</span>
                                {item.activePOCount > 0 && (
                                  <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                    {item.activePOCount} PO aktif
                                  </span>
                                )}
                              </div>
                              {item.lastPurchaseDate && (
                                <span className="text-xs text-gray-500">
                                  Terakhir: {new Date(item.lastPurchaseDate).toLocaleDateString('id-ID')}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Items Summary */}
      {selectedRABItems.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-blue-900">Material Terpilih</h3>
              <p className="text-sm text-blue-700">
                {selectedRABItems.length} material terpilih dengan total estimasi {formatCurrency(totalValue)}
              </p>
            </div>
            <button
              onClick={onNext}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Buat Purchase Order
            </button>
          </div>
        </div>
      )}
    </>
  );
};

// Create PO from selected RAB items
const CreatePOFromRABView = ({ selectedRABItems, rabItems, supplierInfo, setSupplierInfo, onSubmit, onBack, projectId }) => {
  const selectedItems = useMemo(() => 
    rabItems.filter(item => selectedRABItems.includes(item.id)),
    [rabItems, selectedRABItems]
  );
  const [itemQuantities, setItemQuantities] = useState({});

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Initialize quantities with RAB quantities
  useEffect(() => {
    // Only initialize if itemQuantities is empty or selectedItems changed
    if (selectedItems.length > 0 && Object.keys(itemQuantities).length === 0) {
      const initialQuantities = {};
      selectedItems.forEach(item => {
        // Initialize dengan quantity default 1, tapi bisa disesuaikan sampai available quantity
        const availableQuantity = item.availableQuantity || item.quantity || 1;
        initialQuantities[item.id] = Math.min(availableQuantity, 1);
      });
      setItemQuantities(initialQuantities);
    }
  }, [selectedItems, itemQuantities]); // Include selectedItems to satisfy eslint

  const updateQuantity = (itemId, quantity) => {
    // Pastikan quantity tidak kurang dari 1
    const validQuantity = Math.max(1, quantity);
    setItemQuantities(prev => ({
      ...prev,
      [itemId]: validQuantity
    }));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((sum, item) => {
      const quantity = itemQuantities[item.id] || item.quantity;
      const unitPrice = item.unitPrice || item.unit_price || 0;
      return sum + (quantity * unitPrice);
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate partial purchase quantities
    const validationErrors = [];
    const validatedItems = [];
    
    selectedItems.forEach(item => {
      const orderQuantity = itemQuantities[item.id] || Math.min(item.availableQuantity || item.quantity || 0, 1);
      const availableQuantity = item.availableQuantity || item.quantity || 0;
      const unitPrice = item.unitPrice || item.unit_price || 0;
      
      // Validation checks
      if (orderQuantity <= 0) {
        validationErrors.push(`${item.description || item.item_name}: Quantity harus lebih dari 0`);
      } else if (orderQuantity > availableQuantity) {
        validationErrors.push(
          `${item.description || item.item_name}: Quantity melebihi yang tersedia (max: ${availableQuantity})`
        );
      } else {
        validatedItems.push({
          rabItemId: item.id,
          description: item.description || item.item_name || 'Material',
          category: item.category,
          quantity: orderQuantity,
          unit: item.unit,
          unitPrice: unitPrice,
          totalAmount: orderQuantity * unitPrice,
          // Partial purchase tracking
          totalRABQuantity: item.quantity || 0,
          previouslyPurchased: item.totalPurchased || 0,
          remainingAfterPO: availableQuantity - orderQuantity
        });
      }
    });
    
    // Show validation errors
    if (validationErrors.length > 0) {
      alert('Validation Error:\n' + validationErrors.join('\n'));
      return;
    }
    
    // Check if supplier info is complete
    if (!supplierInfo.name.trim()) {
      alert('Nama supplier harus diisi');
      return;
    }
    
    // Confirm partial purchase if applicable
    const hasPartialItems = validatedItems.some(item => item.remainingAfterPO > 0);
    if (hasPartialItems) {
      const partialItems = validatedItems.filter(item => item.remainingAfterPO > 0);
      const partialSummary = partialItems.map(item => 
        `- ${item.description}: Order ${item.quantity}, Sisa ${item.remainingAfterPO} ${item.unit}`
      ).join('\n');
      
      const confirmed = window.confirm(
        `Partial Purchase Detected:\n\n${partialSummary}\n\n` +
        'Item dengan sisa quantity dapat dipesan di PO berikutnya. Lanjutkan?'
      );
      
      if (!confirmed) return;
    }

    const poData = {
      id: `PO-${projectId}-${Date.now()}`, // Required primary key
      poNumber: `PO-${projectId}-${Date.now()}`,
      supplierId: `SUPPLIER-${Date.now()}`, // Generate supplier ID if not exists
      supplierName: supplierInfo.name,
      orderDate: new Date().toISOString(),
      expectedDeliveryDate: supplierInfo.deliveryDate ? new Date(supplierInfo.deliveryDate).toISOString() : null,
      status: 'draft',
      items: validatedItems.map(item => ({
        inventoryId: item.rabItemId.toString(),
        itemName: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        totalPrice: item.totalAmount,
        description: item.description
      })),
      subtotal: calculateTotal(),
      taxAmount: 0,
      totalAmount: calculateTotal(),
      notes: hasPartialItems ? 
        `Partial purchase - beberapa item memiliki sisa quantity yang dapat dipesan kemudian` : '',
      deliveryAddress: supplierInfo.address || '',
      terms: '',
      projectId: projectId // Add projectId
    };

    // Add additional metadata for partial purchase tracking (not sent to API)
    const enhancedPOData = {
      ...poData,
      // Remove fields that are not in backend schema
      partialPurchase: true,
      supplierContact: supplierInfo.contact,
      isPartialPurchase: hasPartialItems,
      partialPurchaseNote: hasPartialItems ? 
        `Partial purchase - beberapa item memiliki sisa quantity yang dapat dipesan kemudian` : null
    };

    onSubmit(enhancedPOData);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Information */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">Informasi Supplier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Supplier *
              </label>
              <input
                type="text"
                value={supplierInfo.name}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kontak Supplier
              </label>
              <input
                type="text"
                value={supplierInfo.contact}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, contact: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Supplier
              </label>
              <textarea
                value={supplierInfo.address}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, address: e.target.value })}
                rows={2}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Pengiriman
              </label>
              <input
                type="date"
                value={supplierInfo.deliveryDate}
                onChange={(e) => setSupplierInfo({ ...supplierInfo, deliveryDate: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Selected Items with Quantity Adjustment */}
        <div className="bg-white border rounded-lg p-4">
          <h3 className="text-base font-medium mb-3">Material yang Dipesan (Partial Purchase)</h3>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 text-blue-600 mr-2" />
              <div className="text-sm text-blue-800">
                <strong>Partial Purchase:</strong> Anda dapat memesan jumlah yang lebih kecil dari total RAB. 
                Sisa quantity akan tetap tersedia untuk PO berikutnya.
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Material</th>
                  <th className="text-center py-2">Total RAB</th>
                  <th className="text-center py-2">Sudah Dibeli</th>
                  <th className="text-center py-2">Tersedia</th>
                  <th className="text-center py-2">Qty Order</th>
                  <th className="text-left py-2">Unit</th>
                  <th className="text-right py-2">Harga Satuan</th>
                  <th className="text-right py-2">Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => {
                  const totalQuantity = item.quantity || 0;
                  const purchasedQuantity = item.totalPurchased || 0;
                  const availableQuantity = item.availableQuantity || totalQuantity;
                  const orderQuantity = itemQuantities[item.id] || Math.min(availableQuantity, 1);
                  const unitPrice = item.unitPrice || item.unit_price || 0;
                  const isValidQuantity = orderQuantity > 0 && orderQuantity <= availableQuantity;
                  
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="py-2">
                        <div>
                          <div className="font-medium">{item.description || item.item_name || 'Material'}</div>
                          <div className="text-xs text-gray-500">{item.category}</div>
                        </div>
                      </td>
                      <td className="py-2 text-center">
                        <span className="text-gray-700 font-medium">{totalQuantity}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className="text-blue-600 font-medium">{purchasedQuantity}</span>
                      </td>
                      <td className="py-2 text-center">
                        <span className={`font-medium ${
                          availableQuantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {availableQuantity}
                        </span>
                      </td>
                      <td className="py-2 text-center">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center space-x-1 mb-1">
                            <button
                              type="button"
                              onClick={() => {
                                const currentQuantity = itemQuantities[item.id] || 1;
                                const newQuantity = Math.max(1, currentQuantity - 1);
                                updateQuantity(item.id, newQuantity);
                              }}
                              disabled={orderQuantity <= 1}
                              className="w-6 h-6 flex items-center justify-center text-xs border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={availableQuantity}
                              value={orderQuantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className={`w-16 border rounded px-2 py-1 text-center text-sm ${
                                isValidQuantity 
                                  ? 'border-gray-300 focus:border-blue-500' 
                                  : 'border-red-300 bg-red-50'
                              }`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const currentQuantity = itemQuantities[item.id] || 1;
                                const newQuantity = Math.min(availableQuantity, currentQuantity + 1);
                                updateQuantity(item.id, newQuantity);
                              }}
                              disabled={orderQuantity >= availableQuantity}
                              className="w-6 h-6 flex items-center justify-center text-xs border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              +
                            </button>
                          </div>
                          {!isValidQuantity && (
                            <span className="text-xs text-red-600 mt-1">
                              Max: {availableQuantity}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2">{item.unit}</td>
                      <td className="py-2 text-right">{formatCurrency(unitPrice)}</td>
                      <td className="py-2 text-right">
                        <div className="font-medium">
                          {formatCurrency(orderQuantity * unitPrice)}
                        </div>
                        {orderQuantity < availableQuantity && (
                          <div className="text-xs text-gray-500">
                            Sisa: {formatCurrency((availableQuantity - orderQuantity) * unitPrice)}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-300">
                  <td colSpan="7" className="py-2 text-right font-medium">Total Purchase Order:</td>
                  <td className="py-2 text-right font-bold text-base">{formatCurrency(calculateTotal())}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          {/* Partial Purchase Summary */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Ringkasan Partial Purchase</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total item dipilih:</span>
                <span className="ml-2 font-medium">{selectedItems.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Total quantity order:</span>
                <span className="ml-2 font-medium">
                  {selectedItems.reduce((sum, item) => sum + (itemQuantities[item.id] || item.availableQuantity || item.quantity || 0), 0)}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Sisa setelah PO:</span>
                <span className="ml-2 font-medium text-green-600">
                  {selectedItems.reduce((sum, item) => {
                    const available = item.availableQuantity || item.quantity || 0;
                    const ordering = itemQuantities[item.id] || Math.min(available, 1);
                    return sum + (available - ordering);
                  }, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Kembali
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            Buat Purchase Order
          </button>
        </div>
      </form>
    </>
  );
};

// PO History View
const POHistoryView = ({ purchaseOrders, onBack, projectName, projectAddress, projectId }) => {
  const [selectedPO, setSelectedPO] = useState(null);
  const [showConfirmCancel, setShowConfirmCancel] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const getUserName = (userId) => {
    // Map of known users - in real app this would come from user service
    const userMap = {
      'USR-DIR-BSR-002': {
        name: 'Maya Sari, S.E., Ak., M.M.',
        position: 'General Manager'
      },
      'USR-DIR-CUE14-002': {
        name: 'Ahmad Sutanto, S.T.',
        position: 'Project Manager'  
      },
      'System': {
        name: 'System',
        position: 'Auto Generated'
      }
    };
    
    return userMap[userId] || { name: userId || 'Unknown User', position: 'Staff' };
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'draft': return 'text-gray-600 bg-gray-100';
      case 'sent': return 'text-blue-600 bg-blue-100';
      case 'received': return 'text-purple-600 bg-purple-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const canEdit = (status) => {
    return ['draft', 'pending'].includes(status);
  };

  const canCancel = (status) => {
    return ['draft', 'pending', 'sent'].includes(status);
  };

  const handleCancelPO = async (poId) => {
    try {
      const response = await fetch(`/api/purchase-orders/${poId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'cancelled'
        })
      });

      if (response.ok) {
        alert('Purchase Order berhasil dibatalkan');
        window.location.reload(); // Refresh untuk update data
      } else {
        const errorData = await response.json();
        alert(`Gagal membatalkan Purchase Order: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error cancelling PO:', error);
      alert('Gagal membatalkan Purchase Order');
    }
    setShowConfirmCancel(null);
  };

  const handlePrint = () => {
    // Add specific styles for printing
    const printStyles = `
      <style>
        @media print {
          body * { visibility: hidden; }
          #po-document, #po-document * { visibility: visible; }
          #po-document { position: absolute; left: 0; top: 0; width: 100%; }
          nav, header, aside, .sidebar, .navigation, .navbar, .menu, .breadcrumb { display: none !important; }
        }
      </style>
    `;
    
    // Add styles to head temporarily
    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.innerHTML = printStyles;
    head.appendChild(style);
    
    // Print the page
    window.print();
    
    // Remove the temporary styles after printing
    setTimeout(() => {
      head.removeChild(style);
    }, 1000);
  };

  if (selectedPO) {
    return (
      <div className="max-w-6xl mx-auto">
        {/* Header Actions - Hide on print */}
        <div className="flex items-center justify-between mb-6 print:hidden">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Purchase Order Official</h3>
            <p className="text-gray-600">PO Number: {selectedPO.poNumber || selectedPO.po_number}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Print/Download
            </button>
            <button
              onClick={() => setSelectedPO(null)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Kembali ke List
            </button>
          </div>
        </div>

        {/* Official PO Document */}
        <div className="bg-white border rounded-lg shadow-lg print:shadow-none print:border-none print-container" id="po-document">
          {/* Compact Company Letterhead */}
          <div className="border-b-2 border-blue-600 p-4 print:p-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-xl font-bold text-blue-600 mb-1 print:text-lg print:mb-0">NUSANTARA GROUP</h1>
                <p className="text-sm font-semibold text-gray-800 mb-1 print:text-xs print:mb-0">KONSTRUKSI & DEVELOPMENT</p>
                <div className="text-xs text-gray-600 space-y-0 print:text-[10px]">
                  <p>Jl. Raya Industri No. 123, Karawang, Jawa Barat 41361 | Telp: (0267) 123-4567</p>
                  <p>Email: procurement@nusantagroup.co.id | NPWP: 01.234.567.8-901.000</p>
                </div>
              </div>
              <div className="text-right ml-4">
                <div className="bg-blue-50 border border-blue-200 rounded p-3 print:p-2">
                  <h2 className="text-lg font-bold text-blue-600 mb-1 print:text-base print:mb-0">PURCHASE ORDER</h2>
                  <div className="text-xs space-y-0 print:text-[10px]">
                    <p><span className="font-medium">No. PO:</span> {selectedPO.poNumber || selectedPO.po_number}</p>
                    <p><span className="font-medium">Tanggal:</span> {formatDate(selectedPO.orderDate || selectedPO.order_date || selectedPO.createdAt)}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-1 py-0 text-[10px] font-semibold rounded ${getStatusColor(selectedPO.status)}`}>
                        {selectedPO.status?.toUpperCase()}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compact Vendor and Project Information */}
          <div className="p-4 print:p-3">
            <div className="grid grid-cols-1 md:grid-cols-2 print:grid-cols-2 gap-4 mb-4 print:gap-3 print:mb-3">
              {/* Vendor Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 print:text-xs print:mb-1">
                  KEPADA SUPPLIER:
                </h3>
                <div className="bg-gray-50 p-3 rounded print:p-2 print:bg-gray-100">
                  <p className="font-semibold text-sm text-gray-800 mb-1 print:text-xs print:mb-0">{selectedPO.supplierName || selectedPO.supplier_name}</p>
                  <div className="text-xs text-gray-600 space-y-0 print:text-[10px]">
                    <p>ID: {selectedPO.supplierId || selectedPO.supplier_id || '-'}</p>
                    <p>Alamat: [Alamat Supplier] | Telp: [No. Telepon]</p>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 print:text-xs print:mb-1">
                  INFORMASI PROYEK:
                </h3>
                <div className="bg-blue-50 p-3 rounded print:p-2 print:bg-blue-100">
                  <p className="font-semibold text-sm text-blue-800 mb-1 print:text-xs print:mb-0">{projectName || 'Nama Proyek'}</p>
                  <div className="text-xs text-gray-700 space-y-0 print:text-[10px]">
                    <p><span className="font-medium">Kode:</span> {projectId} | <span className="font-medium">Lokasi:</span> {selectedPO.deliveryAddress || selectedPO.delivery_address || projectAddress || 'Karawang, Jawa Barat'}</p>
                    <p><span className="font-medium">Target Kirim:</span> {
                      selectedPO.expectedDeliveryDate || selectedPO.expected_delivery_date 
                        ? formatDate(selectedPO.expectedDeliveryDate || selectedPO.expected_delivery_date) 
                        : 'Belum ditentukan'
                    }</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Items Table */}
            <div className="mb-4 print:mb-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 print:text-xs print:mb-1">
                DETAIL ITEM PEMESANAN:
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-xs print:text-[10px]">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold print:px-1">No</th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold print:px-1">Nama Item</th>
                      <th className="border border-gray-300 px-2 py-1 text-left font-semibold print:px-1">Deskripsi</th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-semibold print:px-1">Qty</th>
                      <th className="border border-gray-300 px-2 py-1 text-center font-semibold print:px-1">Satuan</th>
                      <th className="border border-gray-300 px-2 py-1 text-right font-semibold print:px-1">Harga Satuan</th>
                      <th className="border border-gray-300 px-2 py-1 text-right font-semibold print:px-1">Total Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedPO.items || []).map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-2 py-1 text-center print:px-1">{index + 1}</td>
                        <td className="border border-gray-300 px-2 py-1 font-medium print:px-1">{item.itemName || item.item_name}</td>
                        <td className="border border-gray-300 px-2 py-1 text-gray-600 print:px-1">
                          {item.description || '-'}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center print:px-1">
                          {parseFloat(item.quantity).toLocaleString('id-ID')}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-center print:px-1">Unit</td>
                        <td className="border border-gray-300 px-2 py-1 text-right print:px-1">
                          {formatCurrency(item.unitPrice || item.unit_price)}
                        </td>
                        <td className="border border-gray-300 px-2 py-1 text-right font-medium print:px-1">
                          {formatCurrency(item.totalPrice || item.total_price)}
                        </td>
                      </tr>
                    ))}
                    {/* Summary Row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan="6" className="border border-gray-300 px-2 py-1 text-right print:px-1">
                        TOTAL KESELURUHAN:
                      </td>
                      <td className="border border-gray-300 px-2 py-1 text-right text-sm text-blue-600 print:px-1 print:text-xs">
                        {formatCurrency(selectedPO.totalAmount || selectedPO.total_amount)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compact Terms and Conditions */}
            <div className="mb-4 print:mb-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1 print:text-xs print:mb-1">
                SYARAT DAN KETENTUAN:
              </h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3 print:p-2 print:bg-yellow-100">
                <div className="text-xs text-gray-700 space-y-1 print:text-[10px] print:space-y-0">
                  <p>• Barang dikirim sesuai spesifikasi dalam kondisi baik • Pengiriman ke lokasi proyek yang ditentukan</p>
                  <p>• Pembayaran 30 hari setelah penerimaan barang dan invoice • Supplier bertanggung jawab atas kualitas</p>
                  <p>• Perubahan harus mendapat persetujuan tertulis dari PT Nusantara Group</p>
                  {selectedPO.notes && (
                    <p className="mt-1 font-medium print:mt-0">• Catatan Khusus: {selectedPO.notes}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Compact Approval Signatures */}
            <div className="border-t border-gray-200 pt-4 print:pt-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center print:text-xs print:mb-2">
                PERSETUJUAN PURCHASE ORDER
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 print:grid-cols-3 gap-4 print:gap-3">
                {/* Dibuat */}
                <div className="text-center">
                  <div className="border border-dashed border-gray-300 rounded p-3 h-16 flex flex-col justify-between print:h-12 print:p-2">
                    <div>
                      <p className="font-semibold text-gray-800 text-xs print:text-[10px]">DIBUAT OLEH</p>
                      <p className="text-[10px] text-gray-600 print:text-[8px]">Staff Procurement</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs print:mt-1 print:text-[10px]">
                    <p className="font-medium">
                      {selectedPO.createdBy ? getUserName(selectedPO.createdBy).name : getUserName(userDetails.id)?.name || 'Staff Procurement'}
                    </p>
                    <p className="text-gray-600">Tgl: {formatDate(selectedPO.createdAt).split(' ')[0]}</p>
                  </div>
                </div>

                {/* Diperiksa */}
                <div className="text-center">
                  <div className="border border-dashed border-blue-300 rounded p-3 h-16 flex flex-col justify-between bg-blue-50 print:h-12 print:p-2 print:bg-blue-100">
                    <div>
                      <p className="font-semibold text-blue-800 text-xs print:text-[10px]">DIPERIKSA OLEH</p>
                      <p className="text-[10px] text-blue-600 print:text-[8px]">Manager Proyek</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs print:mt-1 print:text-[10px]">
                    <p className="font-medium">
                      {selectedPO.status === 'approved' || selectedPO.status === 'received' ? 
                        getUserName('USR-DIR-CUE14-002').name : 
                        '[Menunggu Pemeriksaan]'
                      }
                    </p>
                    <p className="text-gray-600">
                      Tgl: {selectedPO.status === 'approved' || selectedPO.status === 'received' ? 
                        formatDate(selectedPO.approvedAt || selectedPO.approved_at || selectedPO.createdAt).split(' ')[0] : 
                        '_______'
                      }
                    </p>
                  </div>
                </div>

                {/* Disetujui */}
                <div className="text-center">
                  <div className={`border border-dashed rounded p-3 h-16 flex flex-col justify-between print:h-12 print:p-2 ${
                    selectedPO.status === 'approved' || selectedPO.status === 'received' ? 
                    'border-green-300 bg-green-50 print:bg-green-100' : 
                    'border-gray-300'
                  }`}>
                    <div>
                      <p className={`font-semibold text-xs print:text-[10px] ${
                        selectedPO.status === 'approved' || selectedPO.status === 'received' ? 
                        'text-green-800' : 
                        'text-gray-600'
                      }`}>DISETUJUI OLEH</p>
                      <p className={`text-[10px] print:text-[8px] ${
                        selectedPO.status === 'approved' || selectedPO.status === 'received' ? 
                        'text-green-600' : 
                        'text-gray-500'
                      }`}>General Manager</p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs print:mt-1 print:text-[10px]">
                    <p className="font-medium">
                      {selectedPO.status === 'approved' || selectedPO.status === 'received' ? 
                        getUserName(selectedPO.approvedBy || selectedPO.approved_by || 'USR-DIR-BSR-002').name : 
                        '[Menunggu Persetujuan]'
                      }
                    </p>
                    <p className="text-gray-600">
                      Tgl: {selectedPO.approvedAt || selectedPO.approved_at ? 
                        formatDate(selectedPO.approvedAt || selectedPO.approved_at).split(' ')[0] : 
                        '_______'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Footer */}
            <div className="text-center text-[10px] text-gray-500 mt-4 pt-2 border-t border-gray-200 print:mt-2 print:pt-1 print:text-[8px]">
              <p>Dokumen elektronik sah tanpa tanda tangan basah | PT Nusantara Group v1.0</p>
              <p>Dicetak: {new Date().toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Konfirmasi Pembatalan</h3>
            <p className="text-gray-600 mb-6">
              Apakah Anda yakin ingin membatalkan Purchase Order ini? 
              Material yang dibatalkan akan dikembalikan ke RAB dan dapat dipilih kembali.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmCancel(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => handleCancelPO(showConfirmCancel)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Ya, Batalkan PO
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Riwayat Purchase Order</h3>
          <p className="text-sm text-gray-600">Kelola dan pantau status Purchase Order proyek</p>
        </div>
        <button
          onClick={onBack}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Kembali
        </button>
      </div>

      <div className="bg-white border rounded-lg">
        {purchaseOrders.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada Purchase Order</h3>
            <p className="text-gray-600">Purchase Order yang dibuat akan muncul di sini.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {purchaseOrders.map((po) => (
              <div key={po.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900">{po.poNumber || po.po_number || `PO-${po.id?.slice(-8)}`}</h4>
                        <p className="text-sm text-gray-600">{po.supplierName || po.supplier_name || 'Supplier tidak tersedia'}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {po.items?.length || 0} items • Dibuat {formatDate(po.createdAt)}
                        </p>
                      </div>
                      <div className="ml-auto text-right">
                        <p className="font-medium">{formatCurrency(po.totalAmount || po.total_amount || 0)}</p>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(po.status)}`}>
                          {po.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-6">
                    <button
                      onClick={() => setSelectedPO(po)}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="Lihat Detail"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    {canEdit(po.status) && (
                      <button
                        className="p-2 text-gray-400 hover:text-green-600 rounded-lg hover:bg-green-50"
                        title="Edit PO"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {canCancel(po.status) && (
                      <button
                        onClick={() => setShowConfirmCancel(po.id)}
                        className="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Cancel PO"
                      >
                        <XCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectPurchaseOrders;
