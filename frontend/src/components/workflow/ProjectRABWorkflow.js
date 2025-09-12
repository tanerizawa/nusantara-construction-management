import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Plus, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Send,
  Edit,
  Trash2,
  Download,
  X,
  Save
} from 'lucide-react';

const ProjectRABWorkflow = ({ projectId, project, onDataChange }) => {
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
      
      // Fetch RAB items and approval status
      const [rabResponse, approvalResponse] = await Promise.allSettled([
        fetch(`/api/projects/${projectId}/rab`),
        fetch(`/api/approval/rab/${projectId}/status`)
      ]);

      if (rabResponse.status === 'fulfilled') {
        const rabData = await rabResponse.value.json();
        setRABItems(rabData.data || []);
      } else {
        // Demo data if API not available
        setRABItems([
          {
            id: 1,
            category: 'Material',
            description: 'Semen Portland Type I',
            unit: 'zak',
            quantity: 100,
            unitPrice: 75000,
            total: 7500000,
            specifications: 'Semen Portland Type I, merk Tiga Roda atau setara',
            status: 'draft',
            isApproved: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            category: 'Material',
            description: 'Besi Beton Ulir 12mm',
            unit: 'kg',
            quantity: 500,
            unitPrice: 15000,
            total: 7500000,
            specifications: 'Besi beton ulir SNI, diameter 12mm',
            status: 'draft',
            isApproved: false,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            category: 'Tenaga Kerja',
            description: 'Mandor',
            unit: 'hari',
            quantity: 30,
            unitPrice: 150000,
            total: 4500000,
            specifications: 'Mandor berpengalaman min. 5 tahun',
            status: 'draft',
            isApproved: true,
            createdAt: new Date().toISOString()
          }
        ]);
      }

      if (approvalResponse.status === 'fulfilled') {
        const approvalData = await approvalResponse.value.json();
        setApprovalStatus(approvalData.data);
      }

    } catch (error) {
      console.error('Error fetching RAB data:', error);
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
        ...formData,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        total: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
        projectId: projectId,
        status: 'draft',
        isApproved: false,
        createdAt: new Date().toISOString()
      };

      // In a real app, this would be an API call
      const response = await fetch(`/api/projects/${projectId}/rab`, {
        method: editingItem ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(editingItem ? { ...newItem, id: editingItem.id } : newItem)
      });

      if (response.ok) {
        if (editingItem) {
          // Update existing item
          setRABItems(rabItems.map(item => 
            item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
          ));
          // Show success notification
          showNotification('Item RAB berhasil diperbarui!', 'success');
        } else {
          // Add new item
          setRABItems([...rabItems, { ...newItem, id: Date.now() }]);
          // Show success notification
          showNotification('Item RAB berhasil ditambahkan!', 'success');
        }
        resetForm();
        if (onDataChange) onDataChange();
      } else {
        throw new Error('Failed to save RAB item');
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

  const handleSubmitForApproval = async () => {
    try {
      const response = await fetch(`/api/approval/rab/${projectId}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        await fetchRABData();
        if (onDataChange) onDataChange();
        alert('RAB berhasil disubmit untuk approval');
      }
    } catch (error) {
      console.error('Error submitting RAB:', error);
      alert('Gagal submit RAB untuk approval');
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
              approvalStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              approvalStatus.status === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {approvalStatus.status === 'approved' && <CheckCircle className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'pending' && <Clock className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'rejected' && <AlertTriangle className="h-4 w-4 mr-1" />}
              {approvalStatus.status === 'approved' ? 'Disetujui' :
               approvalStatus.status === 'pending' ? 'Menunggu Approval' :
               approvalStatus.status === 'rejected' ? 'Ditolak' : 'Draft'}
            </div>
          )}

          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Item RAB
          </button>
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

        {rabItems.length === 0 && (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum ada item RAB</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan item RAB pertama</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
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
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {rabItems.filter(item => item.isApproved).length}
              </div>
              <div className="text-sm text-gray-600">Item Approved</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {rabItems.filter(item => !item.isApproved).length}
              </div>
              <div className="text-sm text-gray-600">Item Pending</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {((rabItems.filter(item => item.isApproved).length / rabItems.length) * 100 || 0).toFixed(0)}%
              </div>
              <div className="text-sm text-gray-600">Approval Rate</div>
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
            {!approvalStatus?.submitted && (
              <button
                onClick={handleSubmitForApproval}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit untuk Approval
              </button>
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

      {/* Add/Edit RAB Item Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {editingItem ? 'Edit Item RAB' : 'Tambah Item RAB'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Kategori *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      setFormData({...formData, category: e.target.value});
                      if (formErrors.category) {
                        setFormErrors({...formErrors, category: ''});
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.category ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih Kategori</option>
                    <option value="Material">Material</option>
                    <option value="Tenaga Kerja">Tenaga Kerja</option>
                    <option value="Peralatan">Peralatan</option>
                    <option value="Subkontraktor">Subkontraktor</option>
                    <option value="Overhead">Overhead</option>
                  </select>
                  {formErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.category}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Satuan *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => {
                      setFormData({...formData, unit: e.target.value});
                      if (formErrors.unit) {
                        setFormErrors({...formErrors, unit: ''});
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.unit ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Pilih Satuan</option>
                    <option value="m3">m³ (Meter Kubik)</option>
                    <option value="m2">m² (Meter Persegi)</option>
                    <option value="m">m (Meter)</option>
                    <option value="unit">Unit</option>
                    <option value="kg">Kg (Kilogram)</option>
                    <option value="ton">Ton</option>
                    <option value="ls">LS (Lump Sum)</option>
                    <option value="hari">Hari</option>
                    <option value="minggu">Minggu</option>
                    <option value="bulan">Bulan</option>
                  </select>
                  {formErrors.unit && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.unit}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Pekerjaan *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    setFormData({...formData, description: e.target.value});
                    if (formErrors.description) {
                      setFormErrors({...formErrors, description: ''});
                    }
                  }}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Masukkan deskripsi detail pekerjaan (minimal 10 karakter)..."
                />
                {formErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.description}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/10 karakter minimum
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spesifikasi (Opsional)
                </label>
                <textarea
                  value={formData.specifications}
                  onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Spesifikasi teknis, merek, kualitas, dll..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) => {
                      setFormData({...formData, quantity: e.target.value});
                      if (formErrors.quantity) {
                        setFormErrors({...formErrors, quantity: ''});
                      }
                    }}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.quantity ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.quantity && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.quantity}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Harga Satuan (Rp) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.unitPrice}
                    onChange={(e) => {
                      setFormData({...formData, unitPrice: e.target.value});
                      if (formErrors.unitPrice) {
                        setFormErrors({...formErrors, unitPrice: ''});
                      }
                    }}
                    min="0"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.unitPrice ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="0.00"
                  />
                  {formErrors.unitPrice && (
                    <p className="mt-1 text-sm text-red-600">{formErrors.unitPrice}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total
                  </label>
                  <input
                    type="text"
                    value={formatCurrency((parseFloat(formData.quantity) || 0) * (parseFloat(formData.unitPrice) || 0))}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 font-medium"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Otomatis dihitung dari quantity × harga satuan
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {editingItem ? 'Memperbarui...' : 'Menyimpan...'}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingItem ? 'Update' : 'Simpan'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRABWorkflow;
