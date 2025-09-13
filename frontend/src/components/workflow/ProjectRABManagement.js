import React, { useState, useEffect, useCallback } from 'react';
import { 
  Calculator, 
  Plus, 
  Edit,
  Trash2,
  CheckCircle, 
  XCircle,
  Clock, 
  AlertTriangle,
  DollarSign,
  Save,
  X,
  MessageSquare,
  Package,
  FileText,
  Tag,
  BookOpen,
  Hash,
  MessageCircle
} from 'lucide-react';

const ProjectRABManagement = ({ projectId, project, onDataChange }) => {
  const [rabItems, setRABItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // State for form visibility and debugging
  const [showAddForm, setShowAddForm] = useState(false);
  console.log('=== COMPONENT RENDER ===');
  console.log('Current showAddForm state:', showAddForm);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [currentNotesItem, setCurrentNotesItem] = useState(null);
  
  // Filters and search
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    description: '',
    unit: '',
    quantity: '',
    unit_price: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Categories list - sesuai dengan data yang ada di database
  const categories = [
    'Pekerjaan Persiapan',
    'Pekerjaan Tanah', 
    'Pekerjaan Pondasi',
    'Pekerjaan Struktur',
    'Pekerjaan Arsitektur',
    'Pekerjaan Atap',
    'Pekerjaan MEP',
    'Pekerjaan Finishing'
  ];

  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  // Fetch RAB items from database
  const fetchRABItems = useCallback(async () => {
    try {
      setLoading(true);
      
      // Direct database query untuk development
      const response = await fetch(`/api/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            SELECT 
              id, "projectId" as project_id, category, description as item_name, 
              description, unit, quantity, "unitPrice" as unit_price, 
              "totalPrice" as subtotal, notes, "isApproved" as is_approved, 
              "approvedBy" as approved_by, "approvedAt" as approved_date, 
              "createdAt" as created_at, "updatedAt" as updated_at
            FROM project_rab 
            WHERE "projectId" = $1 
            ORDER BY category, description
          `,
          params: [projectId]
        })
      });

      if (response.ok) {
        const result = await response.json();
        const items = result.data || [];
        
        // Transform data to match frontend expectations
        const transformedItems = items.map(item => ({
          ...item,
          totalPrice: item.subtotal,
          isApproved: item.is_approved,
          approvedBy: item.approved_by,
          approvedDate: item.approved_date,
          createdAt: item.created_at,
          updatedAt: item.updated_at,
          status: item.is_approved ? 'approved' : 'pending'
        }));

        setRABItems(transformedItems);
        setFilteredItems(transformedItems);
      } else {
        throw new Error('Failed to fetch RAB items');
      }
    } catch (error) {
      console.error('Error fetching RAB items:', error);
      showNotification('Gagal memuat data RAB: ' + error.message, 'error');
      
      // Fallback: use empty array
      setRABItems([]);
      setFilteredItems([]);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (projectId) {
      fetchRABItems();
    }
  }, [projectId, fetchRABItems]);

  // Debug: Track showAddForm state changes
  useEffect(() => {
    console.log('=== showAddForm STATE CHANGED ===');
    console.log('New showAddForm value:', showAddForm);
  }, [showAddForm]);

  // Filter and search RAB items
  useEffect(() => {
    let filtered = rabItems;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (statusFilter === 'approved') return item.isApproved;
        if (statusFilter === 'pending') return !item.isApproved;
        return true;
      });
    }

    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.item_name?.toLowerCase().includes(searchLower) ||
        item.description?.toLowerCase().includes(searchLower) ||
        item.category?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredItems(filtered);
  }, [rabItems, categoryFilter, statusFilter, searchTerm]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.category) errors.category = 'Kategori harus dipilih';
    if (!formData.item_name) errors.item_name = 'Nama item harus diisi';
    if (!formData.unit) errors.unit = 'Satuan harus diisi';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'Jumlah harus lebih dari 0';
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) <= 0) {
      errors.unit_price = 'Harga satuan harus lebih dari 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit form (create or update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const quantity = parseFloat(formData.quantity);
      const unit_price = parseFloat(formData.unit_price);
      const subtotal = quantity * unit_price;

      const rabData = {
        category: formData.category,
        item_name: formData.item_name,
        description: formData.description || '',
        unit: formData.unit,
        quantity: quantity,
        unit_price: unit_price,
        subtotal: subtotal,
        notes: formData.notes || ''
      };

      if (editingItem) {
        // Update existing item
        const response = await fetch(`/api/database/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              UPDATE project_rab 
              SET category = $1, description = $2, unit = $3, 
                  quantity = $4, "unitPrice" = $5, "totalPrice" = $6, notes = $7, "updatedAt" = NOW()
              WHERE id = $8 AND "projectId" = $9
              RETURNING *
            `,
            params: [
              rabData.category, rabData.description, rabData.unit,
              rabData.quantity, rabData.unit_price, rabData.subtotal, rabData.notes,
              editingItem.id, projectId
            ]
          })
        });

        if (response.ok) {
          showNotification('Item RAB berhasil diperbarui!');
          await fetchRABItems();
        } else {
          throw new Error('Gagal memperbarui item RAB');
        }
      } else {
        // Create new item
        const response = await fetch(`/api/database/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              INSERT INTO project_rab 
              (id, "projectId", category, description, unit, quantity, "unitPrice", "totalPrice", notes, "createdAt", "updatedAt")
              VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
              RETURNING *
            `,
            params: [
              projectId, rabData.category, rabData.description, 
              rabData.unit, rabData.quantity, rabData.unit_price, rabData.subtotal, rabData.notes
            ]
          })
        });

        if (response.ok) {
          showNotification('Item RAB berhasil ditambahkan!');
          await fetchRABItems();
        } else {
          throw new Error('Gagal menambahkan item RAB');
        }
      }

      resetForm();
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error submitting RAB item:', error);
      showNotification('Error: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      category: '',
      item_name: '',
      description: '',
      unit: '',
      quantity: '',
      unit_price: '',
      notes: ''
    });
    setFormErrors({});
    setShowAddForm(false);
    setEditingItem(null);
  };

  // Edit item
  const handleEdit = (item) => {
    setFormData({
      category: item.category,
      item_name: item.item_name,
      description: item.description || '',
      unit: item.unit,
      quantity: item.quantity.toString(),
      unit_price: item.unit_price.toString(),
      notes: item.notes || ''
    });
    setEditingItem(item);
    setShowAddForm(true);
  };

  // Delete item
  const handleDelete = async (itemId) => {
    // eslint-disable-next-line no-restricted-globals
    if (!confirm('Apakah Anda yakin ingin menghapus item RAB ini?')) return;

    try {
      const response = await fetch(`/api/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: 'DELETE FROM project_rab WHERE id = $1 AND "projectId" = $2',
          params: [itemId, projectId]
        })
      });

      if (response.ok) {
        showNotification('Item RAB berhasil dihapus!');
        await fetchRABItems();
        if (onDataChange) onDataChange();
      } else {
        throw new Error('Gagal menghapus item RAB');
      }
    } catch (error) {
      console.error('Error deleting RAB item:', error);
      showNotification('Error: ' + error.message, 'error');
    }
  };

  // Approve/Reject items
  const handleApprove = async (itemIds) => {
    try {
      const ids = Array.isArray(itemIds) ? itemIds : [itemIds];
      
      for (const itemId of ids) {
        await fetch(`/api/database/query`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: `
              UPDATE project_rab 
              SET "isApproved" = true, "approvedBy" = $1, "approvedAt" = NOW(), "updatedAt" = NOW()
              WHERE id = $2 AND "projectId" = $3
            `,
            params: ['current_user', itemId, projectId]
          })
        });
      }

      showNotification(`${ids.length} item RAB berhasil disetujui!`);
      await fetchRABItems();
      setSelectedItems(new Set());
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error approving RAB items:', error);
      showNotification('Error: ' + error.message, 'error');
    }
  };

  const handleReject = async (itemId, reason = '') => {
    try {
      await fetch(`/api/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            UPDATE project_rab 
            SET "isApproved" = false, "approvedBy" = null, "approvedAt" = null, 
                notes = COALESCE(notes, '') || $1, "updatedAt" = NOW()
            WHERE id = $2 AND "projectId" = $3
          `,
          params: [
            reason ? `\nDitolak: ${reason}` : '\nDitolak tanpa alasan',
            itemId, 
            projectId
          ]
        })
      });

      showNotification('Item RAB berhasil ditolak!');
      await fetchRABItems();
      if (onDataChange) onDataChange();
    } catch (error) {
      console.error('Error rejecting RAB item:', error);
      showNotification('Error: ' + error.message, 'error');
    }
  };

  // Add notes to item
  const handleAddNotes = async (itemId, notes) => {
    try {
      await fetch(`/api/database/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: `
            UPDATE project_rab 
            SET notes = COALESCE(notes, '') || $1, "updatedAt" = NOW()
            WHERE id = $2 AND "projectId" = $3
          `,
          params: [`\n[${new Date().toLocaleString()}] ${notes}`, itemId, projectId]
        })
      });

      showNotification('Catatan berhasil ditambahkan!');
      await fetchRABItems();
      setShowNotesModal(false);
      setCurrentNotesItem(null);
    } catch (error) {
      console.error('Error adding notes:', error);
      showNotification('Error: ' + error.message, 'error');
    }
  };

  // Selection handlers
  const handleSelectItem = (itemId) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(itemId)) {
      newSelection.delete(itemId);
    } else {
      newSelection.add(itemId);
    }
    setSelectedItems(newSelection);
  };

  const handleSelectAll = () => {
    const pendingItems = filteredItems.filter(item => !item.isApproved);
    if (selectedItems.size === pendingItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(pendingItems.map(item => item.id)));
    }
  };

  // Calculate summary
  const summary = {
    total: filteredItems.length,
    approved: filteredItems.filter(item => item.is_approved).length,
    pending: filteredItems.filter(item => !item.is_approved).length,
    totalValue: filteredItems.reduce((sum, item) => {
      const subtotal = parseFloat(item.subtotal) || 0;
      return sum + subtotal;
    }, 0),
    approvedValue: filteredItems.filter(item => item.is_approved).reduce((sum, item) => {
      const subtotal = parseFloat(item.subtotal) || 0;
      return sum + subtotal;
    }, 0),
    pendingValue: filteredItems.filter(item => !item.is_approved).reduce((sum, item) => {
      const subtotal = parseFloat(item.subtotal) || 0;
      return sum + subtotal;
    }, 0)
  };

  // Format currency - Full format for PSAK/accounting standards
  const formatCurrency = (amount) => {
    // Handle edge cases
    if (!amount || isNaN(amount) || amount === Infinity || amount === -Infinity) {
      return 'Rp 0';
    }
    
    try {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Memuat data RAB...</span>
      </div>
    );
  }

  // Debug logging
  console.log('=== ProjectRABManagement Render ===');
  console.log('showAddForm:', showAddForm);
  console.log('projectId:', projectId);
  console.log('rabItems length:', rabItems.length);

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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">RAB Management</h2>
          <p className="text-gray-600">Rencana Anggaran Biaya - {project?.name}</p>
        </div>
        
        <button
          onClick={() => {
            console.log('=== TOMBOL TAMBAH ITEM RAB DIKLIK ===');
            console.log('Current showAddForm state:', showAddForm);
            console.log('Attempting to set showAddForm to true...');
            setShowAddForm(true);
            console.log('setShowAddForm(true) called - should trigger re-render');
            
            // Force re-render check with setTimeout
            setTimeout(() => {
              console.log('After timeout - showAddForm should be:', true);
            }, 100);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Item RAB</span>
        </button>
      </div>

      {/* Summary Stats - Symmetric Table Layout */}
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <div className="grid grid-cols-2 gap-6">
          {/* Count Statistics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <Package className="h-4 w-4 mr-2 text-gray-600" />
              Item Statistics
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Total Items</span>
                </div>
                <span className="text-sm font-semibold text-blue-600">{summary.total}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Approved</span>
                </div>
                <span className="text-sm font-semibold text-green-600">{summary.approved}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="text-sm font-semibold text-yellow-600">{summary.pending}</span>
              </div>
            </div>
          </div>
          
          {/* Value Statistics */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-gray-600" />
              Value Statistics
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Total Value</span>
                </div>
                <span 
                  className="text-sm font-semibold text-purple-600" 
                  title={formatCurrency(summary.totalValue)}
                >
                  {formatCurrency(summary.totalValue)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Approved Value</span>
                </div>
                <span 
                  className="text-sm font-semibold text-green-600" 
                  title={formatCurrency(summary.approvedValue)}
                >
                  {formatCurrency(summary.approvedValue)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending Value</span>
                </div>
                <span 
                  className="text-sm font-semibold text-yellow-600" 
                  title={formatCurrency(summary.pendingValue)}
                >
                  {formatCurrency(summary.pendingValue)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Form - Inline Integration - Moved to Top */}
      {console.log('Checking showAddForm for form render:', showAddForm)}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          {console.log('Form is being rendered!')}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                {editingItem ? 'Edit Item RAB' : 'Tambah Item RAB Baru'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">1</div>
                  Informasi Dasar
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="h-4 w-4 inline mr-1" />
                      Nama Item
                    </label>
                    <input
                      type="text"
                      value={formData.item_name}
                      onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Misal: Galian Tanah Manual"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="h-4 w-4 inline mr-1" />
                      Kategori
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih Kategori</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BookOpen className="h-4 w-4 inline mr-1" />
                    Deskripsi (Opsional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows="3"
                    placeholder="Deskripsi detail pekerjaan..."
                  />
                </div>
              </div>

              {/* Quantity and Pricing */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">2</div>
                  Kuantitas & Harga
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calculator className="h-4 w-4 inline mr-1" />
                      Satuan
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="m³, m², kg, pcs, dll"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Hash className="h-4 w-4 inline mr-1" />
                      Kuantitas
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.quantity}
                      onChange={(e) => {
                        const quantity = parseFloat(e.target.value) || 0;
                        const unitPrice = formData.unit_price || 0;
                        setFormData({
                          ...formData, 
                          quantity,
                          total_price: quantity * unitPrice
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Harga Satuan (Rp)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.unit_price}
                      onChange={(e) => {
                        const unitPrice = parseFloat(e.target.value) || 0;
                        const quantity = formData.quantity || 0;
                        setFormData({
                          ...formData, 
                          unit_price: unitPrice,
                          total_price: quantity * unitPrice
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      min="0"
                      required
                    />
                  </div>
                </div>
                
                {/* Real-time Calculation Preview */}
                {(formData.quantity > 0 && formData.unit_price > 0) && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h5 className="text-sm font-medium text-blue-900 mb-2 flex items-center">
                      <Calculator className="h-4 w-4 mr-1" />
                      Preview Perhitungan
                    </h5>
                    <div className="text-sm text-blue-800">
                      <p>{formData.quantity} {formData.unit} × {formatCurrency(formData.unit_price)} = <span className="font-semibold">{formatCurrency(formData.total_price)}</span></p>
                    </div>
                  </div>
                )}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Menyimpan...' : (editingItem ? 'Update Item' : 'Tambah Item')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Cari item RAB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Kategori</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-2">
            {selectedItems.size > 0 && (
              <button
                onClick={() => handleApprove(Array.from(selectedItems))}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-1"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Approve ({selectedItems.size})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RAB Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Daftar Item RAB</h3>
          {filteredItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.size === filteredItems.filter(item => !item.isApproved).length && filteredItems.filter(item => !item.isApproved).length > 0}
                onChange={handleSelectAll}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">Pilih Semua Pending</span>
            </div>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Item RAB</h3>
            <p className="text-gray-600 mb-4">Mulai dengan menambahkan item RAB pertama</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Tambah Item RAB
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Select
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategori
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Harga Satuan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subtotal
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
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {!item.isApproved && (
                        <input
                          type="checkbox"
                          checked={selectedItems.has(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div>
                        <div className="font-medium">{item.item_name}</div>
                        {item.description && (
                          <div className="text-gray-500 text-xs">{item.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(item.subtotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.isApproved ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      
                      <button
                        onClick={() => {
                          setCurrentNotesItem(item);
                          setShowNotesModal(true);
                        }}
                        className="text-purple-600 hover:text-purple-900"
                        title="Add Notes"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      
                      {!item.isApproved && (
                        <>
                          <button
                            onClick={() => handleApprove(item.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Approve"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                          
                          <button
                            onClick={() => {
                              // eslint-disable-next-line no-restricted-globals
                              const reason = prompt('Alasan penolakan (opsional):');
                              if (reason !== null) {
                                handleReject(item.id, reason);
                              }
                            }}
                            className="text-red-600 hover:text-red-900"
                            title="Reject"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Form - Inline Integration */}
      {console.log('Checking showAddForm for form render:', showAddForm)}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 mb-6">
          {console.log('Form is being rendered!')}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                {editingItem ? 'Edit Item RAB' : 'Tambah Item RAB Baru'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">1</div>
                  Informasi Dasar
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori Pekerjaan *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.category ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      required
                    >
                      <option value="">-- Pilih Kategori Pekerjaan --</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {formErrors.category}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Satuan *
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => setFormData({...formData, unit: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.unit ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="Contoh: M3, M2, Kg, Unit, Ls"
                      required
                    />
                    {formErrors.unit && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {formErrors.unit}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Item Pekerjaan *
                  </label>
                  <input
                    type="text"
                    value={formData.item_name}
                    onChange={(e) => setFormData({...formData, item_name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      formErrors.item_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    placeholder="Contoh: Pekerjaan Galian Tanah Pondasi"
                    required
                  />
                  {formErrors.item_name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {formErrors.item_name}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi Detail (Opsional)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="3"
                    placeholder="Deskripsi detail pekerjaan, spesifikasi, atau keterangan tambahan..."
                  />
                </div>
              </div>

              {/* Quantity & Pricing */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">2</div>
                  Volume & Harga
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Volume/Quantity *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.quantity ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0.00"
                      required
                    />
                    {formErrors.quantity && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {formErrors.quantity}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Harga Satuan (IDR) *
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={formData.unit_price}
                      onChange={(e) => setFormData({...formData, unit_price: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                        formErrors.unit_price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      }`}
                      placeholder="0"
                      required
                    />
                    {formErrors.unit_price && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        {formErrors.unit_price}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subtotal Preview */}
                {formData.quantity && formData.unit_price && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-900">Preview Kalkulasi</p>
                        <p className="text-xs text-blue-600 mt-1">
                          {parseFloat(formData.quantity).toLocaleString('id-ID')} {formData.unit} × {formatCurrency(parseFloat(formData.unit_price))}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-900">
                          {formatCurrency(parseFloat(formData.quantity || 0) * parseFloat(formData.unit_price || 0))}
                        </p>
                        <p className="text-xs text-blue-600">Subtotal</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-medium mr-2">3</div>
                  Catatan & Keterangan
                </h4>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Tambahan (Opsional)
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    rows="3"
                    placeholder="Catatan khusus, referensi, atau informasi tambahan lainnya..."
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <X className="h-4 w-4 inline mr-2" />
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  <span>{isSubmitting ? 'Menyimpan...' : (editingItem ? 'Update Item' : 'Simpan Item')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes Modal - Simple Overlay */}
      {showNotesModal && currentNotesItem && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-purple-600" />
                  Tambah Catatan
                </h3>
                <button
                  onClick={() => {
                    setShowNotesModal(false);
                    setCurrentNotesItem(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900">Item: {currentNotesItem.item_name}</p>
                <p className="text-xs text-gray-500">{currentNotesItem.category}</p>
                
                {currentNotesItem.notes && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-1">Catatan sebelumnya:</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{currentNotesItem.notes}</p>
                  </div>
                )}
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const notes = e.target.notes.value.trim();
                if (notes) {
                  handleAddNotes(currentNotesItem.id, notes);
                }
              }}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Catatan Baru
                  </label>
                  <textarea
                    name="notes"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    rows="4"
                    placeholder="Tulis catatan atau komentar..."
                    required
                  />
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowNotesModal(false);
                      setCurrentNotesItem(null);
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Catatan
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectRABManagement;
