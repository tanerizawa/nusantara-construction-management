import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Edit,
  Trash2,
  Download,
  X,
  Save
} from 'lucide-react';

const ProjectRABWorkflow = ({ projectId, project, onDataChange }) => {
  console.log('=== ProjectRABWorkflow COMPONENT LOADED ===');
  console.log('Received projectId:', projectId);
  console.log('Received project:', project);
  console.log('onDataChange function:', typeof onDataChange);
  
  const [rabItems, setRABItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  
  // Form state for adding/editing RAB items
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    specifications: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRABData();
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchRABData = async () => {
    try {
      setLoading(true);
      
      if (!projectId) {
        setRABItems([]);
        return;
      }

      // Check authentication token
      const token = localStorage.getItem('token');

      if (!token) {
        setRABItems([]);
        return;
      }

      // Use correct RAB endpoint
      console.log('📡 Making API call to get RAB items...');
      console.log('📡 Project ID:', projectId);
      
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('� RAB Workflow Response status:', response.status);
      console.log('🚀 RAB Workflow Response ok:', response.ok);
      
      const result = await response.json();
      console.log('🚀 RAB Workflow Full result:', result);
      console.log('🚀 RAB Workflow Result data:', result.data);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${result.message || 'API Error'}`);
      }
      
      if (!result.success) {
        throw new Error(`Database Error: ${result.message}`);
      }
      
      const items = result.data || [];
      console.log('RAB Workflow Items found:', items.length, items);
      
      if (items.length === 0) {
        console.log('⚠️ No RAB items found for project:', projectId);
        setRABItems([]);
        setApprovalStatus(null);
        return;
      }
      
      // Transform data to match component expectations
      const transformedItems = items.map((item, index) => {
        console.log(`🔄 Transforming item ${index + 1}:`, item);
        
        const transformed = {
          id: item.id,
          category: item.category || 'Unknown',
          description: item.description || 'No description',
          unit: item.unit || 'Unit',
          quantity: parseFloat(item.quantity) || 0,
          unitPrice: parseFloat(item.unitPrice) || 0,
          total: parseFloat(item.totalPrice) || 0,
          totalPrice: parseFloat(item.totalPrice) || 0,
          specifications: item.notes || '',
          status: item.isApproved ? 'approved' : 'draft',
          isApproved: item.isApproved || false,
          approvedBy: item.approvedBy,
          approvedAt: item.approvedAt,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        };
        
        console.log(`✅ Transformed item ${index + 1}:`, transformed);
        return transformed;
      });

      console.log('🎯 Final transformed items count:', transformedItems.length);
      console.log('🎯 Setting state with items:', transformedItems);
      
      setRABItems(transformedItems);
      
      // Force re-render check
      setTimeout(() => {
        console.log('🔍 State check after update - rabItems.length:', transformedItems.length);
      }, 100);
      
      // Simplified approval status - only 'draft' or 'approved'
      const totalItems = transformedItems.length;
      
      // Check if RAB is approved from project data or first item status
      const isRabApproved = project?.rab_approved || 
                           (transformedItems.length > 0 && transformedItems[0].rab_approved);
      
      setApprovalStatus({
        status: isRabApproved ? 'approved' : 'draft',
        totalItems: totalItems,
        canAddItems: !isRabApproved && totalItems >= 0
      });

    } catch (error) {
      console.error('❌ RAB Workflow Error:', error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error response:', error.response);
      console.error('❌ Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      setRABItems([]);
      setApprovalStatus(null);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.category.trim()) {
      errors.category = 'Kategori harus dipilih';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Deskripsi pekerjaan harus diisi';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Deskripsi minimal 10 karakter';
    }
    
    if (!formData.unit.trim()) {
      errors.unit = 'Satuan harus dipilih';
    }
    
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'Quantity harus lebih dari 0';
    }
    
    if (!formData.unitPrice || parseFloat(formData.unitPrice) <= 0) {
      errors.unitPrice = 'Harga satuan harus lebih dari 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newItem = {
        category: formData.category,
        description: formData.description,
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
        notes: formData.specifications || ''
      };

      // API call to backend
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingItem ? { ...newItem, id: editingItem.id } : newItem)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ RAB item saved successfully:', result);
        
        // Refresh data from server
        await fetchRABData();
        
        // Show success notification
        if (editingItem) {
          showNotification('Item RAB berhasil diperbarui!', 'success');
        } else {
          showNotification('Item RAB berhasil ditambahkan!', 'success');
        }
        
        resetForm();
        if (onDataChange) onDataChange();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save RAB item');
      }
    } catch (error) {
      console.error('Error saving RAB item:', error);
      
      // For demo, still add to local state
      const newItem = {
        ...formData,
        id: editingItem ? editingItem.id : Date.now(),
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        total: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
        projectId: projectId,
        status: 'draft',
        isApproved: false,
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (editingItem) {
        setRABItems(rabItems.map(item => 
          item.id === editingItem.id ? newItem : item
        ));
        showNotification('Item RAB berhasil diperbarui! (Mode Demo)', 'success');
      } else {
        setRABItems([...rabItems, newItem]);
        showNotification('Item RAB berhasil ditambahkan! (Mode Demo)', 'success');
      }
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId) => {
    const item = rabItems.find(item => item.id === itemId);
    const confirmMessage = `Apakah Anda yakin ingin menghapus item:\n"${item?.description}"?\n\nTindakan ini tidak dapat dibatalkan.`;
    
    if (window.confirm(confirmMessage)) {
      try {
        await fetch(`/api/projects/${projectId}/rab/${itemId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        setRABItems(rabItems.filter(item => item.id !== itemId));
        showNotification('Item RAB berhasil dihapus!', 'success');
        if (onDataChange) onDataChange();
      } catch (error) {
        console.error('Error deleting RAB item:', error);
        // For demo, still remove from local state
        setRABItems(rabItems.filter(item => item.id !== itemId));
        showNotification('Item RAB berhasil dihapus! (Mode Demo)', 'success');
      }
    }
  };

  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      specifications: ''
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditingItem(null);
    setIsSubmitting(false);
  };

  // Simplified approval function
  const handleApproveRAB = async () => {
    if (rabItems.length === 0) {
      alert('Tidak ada item RAB untuk diapprove');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const response = await fetch(`/api/rab/${projectId}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          approved: true,
          approved_at: new Date().toISOString(),
          approved_by: 'current_user' // This should be actual user data
        })
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChange) onDataChange();
        alert('RAB berhasil diapprove!');
      } else {
        throw new Error('Failed to approve RAB');
      }
    } catch (error) {
      console.error('Error approving RAB:', error);
      alert('Gagal approve RAB. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return rabItems.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };

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
    <div className="space-y-6">
      {/* DEBUG INDICATOR */}
      <div className="bg-yellow-100 border border-yellow-400 p-4 rounded">
        <h3 className="font-bold text-yellow-800">🔧 DEBUG INFO</h3>
        <p>Component: ProjectRABWorkflow LOADED ✅</p>
        <p>Project ID: {projectId || 'NOT PROVIDED'}</p>
        <p>Project Name: {project?.name || 'NOT LOADED'}</p>
        <p>RAB Items Count: {rabItems.length}</p>
        <p>Loading State: {loading ? 'TRUE' : 'FALSE'}</p>
        <p>Show Add Form: {showAddForm ? 'TRUE' : 'FALSE'}</p>
      </div>
      {/* Notification */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg ${
          notification.type === 'success' 
            ? 'bg-green-100 border border-green-500 text-green-800' 
            : 'bg-red-100 border border-red-500 text-red-800'
        }`}>
          <div className="flex items-center">
            {notification.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertTriangle className="h-5 w-5 mr-2" />
            )}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">RAB Management</h2>
          <p className="text-gray-600">Rencana Anggaran Biaya untuk {project.name}</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Approval Status Indicator */}
          {approvalStatus && (
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              approvalStatus.status === 'approved' ? 'bg-green-100 text-green-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {approvalStatus.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'draft' && <Clock className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'approved' ? 'Disetujui' : 'Draft'}
            </div>
          )}

          {/* Add Item Button - Only show if not approved */}
          {approvalStatus?.canAddItems && (
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Item RAB
            </button>
          )}
          
          {/* Show message when RAB is approved */}
          {approvalStatus?.status === 'approved' && (
            <div className="text-sm text-gray-500 italic">
              RAB telah disetujui - tidak dapat menambah item baru
            </div>
          )}
        </div>
      </div>

      {/* RAB Summary Card */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{rabItems.length}</div>
            <div className="text-sm text-gray-600">Total Items</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{formatCurrency(calculateTotal())}</div>
            <div className="text-sm text-gray-600">Total RAB</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {approvalStatus?.currentStep || '-'}
            </div>
            <div className="text-sm text-gray-600">Current Step</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {approvalStatus?.progress || '0'}%
            </div>
            <div className="text-sm text-gray-600">Approval Progress</div>
          </div>
        </div>
      </div>

      {/* RAB Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Daftar Item RAB</h3>
        </div>
        
        {/* Inline Add Form - Show above table when showAddForm is true */}
        {showAddForm && (
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-medium text-blue-900">Tambah Item RAB Baru</h4>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setEditingItem(null);
                  setFormData({
                    category: '',
                    description: '',
                    unit: '',
                    quantity: 0,
                    unitPrice: 0,
                    specifications: ''
                  });
                  setFormErrors({});
                }}
                className="text-blue-600 hover:text-blue-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddItem} className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Pilih Kategori</option>
                  <option value="Pekerjaan Persiapan">Pekerjaan Persiapan</option>
                  <option value="Pekerjaan Tanah">Pekerjaan Tanah</option>
                  <option value="Pekerjaan Pondasi">Pekerjaan Pondasi</option>
                  <option value="Pekerjaan Struktur">Pekerjaan Struktur</option>
                  <option value="Pekerjaan Arsitektur">Pekerjaan Arsitektur</option>
                  <option value="Pekerjaan Atap">Pekerjaan Atap</option>
                  <option value="Pekerjaan MEP">Pekerjaan MEP</option>
                  <option value="Pekerjaan Finishing">Pekerjaan Finishing</option>
                </select>
                {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
              </div>

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Deskripsi item"
                  required
                />
                {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
              </div>

              {/* Satuan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="m², kg, unit"
                  required
                />
                {formErrors.unit && <p className="text-red-500 text-xs mt-1">{formErrors.unit}</p>}
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
                {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
              </div>

              {/* Harga Satuan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  required
                />
                {formErrors.unitPrice && <p className="text-red-500 text-xs mt-1">{formErrors.unitPrice}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Menyimpan...
                    </div>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2 inline" />
                      {editingItem ? 'Update' : 'Simpan'}
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {/* Total Preview */}
            {formData.quantity && formData.unitPrice && (
              <div className="mt-3 p-3 bg-white rounded border">
                <span className="text-sm text-gray-600">Total: </span>
                <span className="font-medium text-lg text-green-600">
                  {formatCurrency(parseFloat(formData.quantity || 0) * parseFloat(formData.unitPrice || 0))}
                </span>
              </div>
            )}
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Harga Satuan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rabItems.map((item, index) => (
                <tr key={item.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {item.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.quantity * item.unitPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      item.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {item.isApproved ? 'Approved' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={() => {
                          setEditingItem(item);
                          setFormData({
                            category: item.category,
                            description: item.description,
                            unit: item.unit,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                            specifications: item.specifications || ''
                          });
                          setFormErrors({}); // Clear any existing errors
                          setShowAddForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit item"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rabItems.length === 0 && !loading && (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Item RAB</h3>
            <p className="text-gray-600 mb-4">Silakan tambahkan item RAB untuk memulai</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              Tambah Item RAB
            </button>
          </div>
        )}
      </div>

      {/* RAB Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost Breakdown by Category */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Breakdown Biaya per Kategori</h3>
          <div className="space-y-3">
            {['Material', 'Tenaga Kerja', 'Peralatan', 'Subkontraktor', 'Overhead'].map(category => {
              const categoryItems = rabItems.filter(item => item.category === category);
              const categoryTotal = categoryItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
              const percentage = ((categoryTotal / calculateTotal()) * 100) || 0;
              
              return (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      category === 'Material' ? 'bg-blue-500' :
                      category === 'Tenaga Kerja' ? 'bg-green-500' :
                      category === 'Peralatan' ? 'bg-yellow-500' :
                      category === 'Subkontraktor' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {formatCurrency(categoryTotal)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RAB Statistics */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik RAB</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{rabItems.length}</div>
              <div className="text-sm text-gray-600">Total Item</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {approvalStatus?.status === 'approved' ? 'Disetujui' : 'Draft'}
              </div>
              <div className="text-sm text-gray-600">Status RAB</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {new Set(rabItems.map(item => item.category)).size}
              </div>
              <div className="text-sm text-gray-600">Kategori</div>
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Actions */}
      {rabItems.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Workflow Actions</h3>
          <div className="flex items-center space-x-4">
            
            {/* Simple Approve Button - Only show if not approved */}
            {approvalStatus?.status === 'draft' && (
              <button
                onClick={handleApproveRAB}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Mengapprove...' : 'Approve RAB'}
              </button>
            )}
            
            {/* Show approval status if already approved */}
            {approvalStatus?.status === 'approved' && (
              <div className="flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                RAB Sudah Disetujui
              </div>
            )}
            
            <button className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700">
              <Download className="h-4 w-4 mr-2" />
              Export RAB
            </button>

            <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
              <FileText className="h-4 w-4 mr-2" />
              Generate BOQ
            </button>
          </div>
        </div>
      )}

      {/* Approval Timeline */}
      {approvalStatus?.timeline && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Timeline</h3>
          <div className="space-y-4">
            {approvalStatus.timeline.map((step, index) => (
              <div key={index} className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-1 ${
                  step.completed ? 'bg-green-500' : 
                  step.active ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">{step.stepName}</p>
                    <p className="text-sm text-gray-500">{step.date}</p>
                  </div>
                  {step.approver && (
                    <p className="text-sm text-gray-600">by {step.approver}</p>
                  )}
                  {step.comments && (
                    <p className="text-sm text-gray-600 mt-1">{step.comments}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Form is now inline above the table */}
    </div>
  );
};

export default ProjectRABWorkflow;
