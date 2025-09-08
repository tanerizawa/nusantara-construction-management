import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Calculator,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Package,
  Users,
  Truck,
  Building
} from 'lucide-react';
import { projectAPI } from '../services/api';

const BudgetRAB = ({ project, onUpdate }) => {
  const [editingItem, setEditingItem] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // RAB Categories
  const categories = {
    material: { name: 'Material', icon: Package, color: 'blue' },
    labor: { name: 'Tenaga Kerja', icon: Users, color: 'green' },
    equipment: { name: 'Alat & Mesin', icon: Truck, color: 'orange' },
    overhead: { name: 'Overhead', icon: Building, color: 'purple' },
    contingency: { name: 'Kontingensi', icon: AlertTriangle, color: 'red' }
  };

  // Sample RAB data structure
  const [rabItems, setRabItems] = useState([]);

  // Load existing RAB items from database
  const loadRABItems = async () => {
    try {
      const response = await projectAPI.getRAB(project.id);
      if (response.data && response.data.length > 0) {
        // Map backend data to frontend format
        const mappedItems = response.data.map(item => ({
          id: item.id,
          category: item.category.toLowerCase(), // Normalize category to lowercase
          itemName: item.description, // Map description back to itemName
          specification: '', // Backend doesn't store specification separately
          unit: item.unit,
          quantity: parseFloat(item.quantity),
          unitPrice: parseFloat(item.unitPrice),
          totalPrice: parseFloat(item.totalPrice),
          vendor: '', // Backend doesn't store vendor
          notes: item.notes || '',
          status: item.isApproved ? 'approved' : 'pending',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setRabItems(mappedItems);
      }
    } catch (error) {
      console.error('Error loading RAB items:', error);
      // Keep sample data if loading fails
      setRabItems([
        {
          id: 'RAB001',
          category: 'material',
          itemName: 'Besi Beton D16',
          specification: 'Besi beton polos diameter 16mm, SNI 2052:2017',
          unit: 'kg',
          quantity: 5000,
          unitPrice: 15000,
          totalPrice: 75000000,
          vendor: 'PT Steel Indonesia',
          status: 'approved',
          notes: 'Untuk struktur lantai 1-3'
        },
        {
          id: 'RAB002',
          category: 'material',
          itemName: 'Semen Portland',
          specification: 'Semen Portland Type I, 40kg/sak',
          unit: 'sak',
          quantity: 500,
          unitPrice: 85000,
          totalPrice: 42500000,
          vendor: 'PT Semen Gresik',
          status: 'approved',
          notes: 'Grade 350'
        },
        {
          id: 'RAB003',
          category: 'labor',
          itemName: 'Mandor',
          specification: 'Mandor berpengalaman min. 5 tahun',
          unit: 'OH',
          quantity: 120,
          unitPrice: 250000,
          totalPrice: 30000000,
          vendor: '-',
          status: 'approved',
          notes: 'Supervisi pekerjaan struktur'
        },
        {
          id: 'RAB004',
          category: 'equipment',
          itemName: 'Crane Tower',
          specification: 'Crane tower kapasitas 5 ton, tinggi 30m',
          unit: 'bulan',
          quantity: 6,
          unitPrice: 85000000,
          totalPrice: 510000000,
          vendor: 'PT Crane Rental',
          status: 'pending',
          notes: 'Sewa termasuk operator'
        }
      ]);
    }
  };

  // Load existing RAB items when component mounts
  useEffect(() => {
    loadRABItems();
  }, [project.id]);

  // Helper function to calculate totals
  const calculateTotals = (items) => {
    const subtotal = items.reduce((sum, item) => sum + (item.totalPrice || 0), 0);
    const overhead = subtotal * 0.1; // 10%
    const profit = subtotal * 0.1; // 10%
    const ppn = (subtotal + overhead + profit) * 0.11; // 11%
    const total = subtotal + overhead + profit + ppn;
    
    return { subtotal, overhead, profit, ppn, total };
  };

  // Database operations
  const saveRABItem = async (rabData) => {
    try {
      // Map frontend fields to backend fields
      const rabItemData = {
        category: rabData.category,
        description: `${rabData.itemName}${rabData.specification ? ' - ' + rabData.specification : ''}`, // Combine itemName and specification
        unit: rabData.unit,
        quantity: parseFloat(rabData.quantity) || 0,
        unitPrice: parseFloat(rabData.unitPrice) || 0,
        notes: rabData.notes || '',
        createdBy: 'current_user' // Should get from auth context
      };

      let updatedItems;

      if (editingItem) {
        // Update existing item
        await projectAPI.updateRABItem(project.id, editingItem.id, rabItemData);
        
        const updatedItem = { 
          ...rabData, 
          id: editingItem.id, 
          totalPrice: rabItemData.quantity * rabItemData.unitPrice,
          updatedAt: new Date().toISOString() 
        };
        setRabItems(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ));
        
        updatedItems = rabItems.map(item => 
          item.id === editingItem.id ? updatedItem : item
        );
        
        setEditingItem(null);
        
        // Show success message
        alert('Item RAB berhasil diperbarui!');
      } else {
        // Create new item
        const response = await projectAPI.createRABItem(project.id, rabItemData);
        
        const newItem = { 
          ...rabData, // Keep original form data for display
          id: response.data.id || `RAB${Date.now()}`,
          totalPrice: rabItemData.quantity * rabItemData.unitPrice,
          createdAt: new Date().toISOString()
        };
        setRabItems(prev => [...prev, newItem]);
        
        updatedItems = [...rabItems, newItem];
        
        // Show success message
        alert('Item RAB berhasil ditambahkan!');
      }
      
      setShowAddForm(false);
      
      // Calculate new totals and update project
      const newTotals = calculateTotals(updatedItems);
      
      // Update project budget with new totals
      onUpdate({ 
        budget: { 
          ...project.budget, 
          rabItems: updatedItems,
          total: newTotals.total,
          subtotal: newTotals.subtotal,
          updatedAt: new Date().toISOString()
        }
      });
      
    } catch (error) {
      console.error('Error saving RAB item:', error);
      alert('Gagal menyimpan item RAB. Silakan coba lagi.');
    }
  };

  const deleteRABItem = async (itemId) => {
    if (!window.confirm('Yakin ingin menghapus item RAB ini?')) return;
    
    try {
      await projectAPI.deleteRABItem(project.id, itemId);
      
      const updatedItems = rabItems.filter(item => item.id !== itemId);
      setRabItems(updatedItems);
      
      // Calculate new totals
      const newTotals = calculateTotals(updatedItems);
      
      // Update project budget
      onUpdate({ 
        budget: { 
          ...project.budget, 
          rabItems: updatedItems,
          total: newTotals.total,
          subtotal: newTotals.subtotal,
          updatedAt: new Date().toISOString()
        }
      });
      
      alert('Item RAB berhasil dihapus!');
      
    } catch (error) {
      console.error('Error deleting RAB item:', error);
      alert('Gagal menghapus item RAB. Silakan coba lagi.');
    }
  };

  const exportRAB = async (format = 'excel') => {
    try {
      const response = await projectAPI.exportRAB(project.id, { format });
      
      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Set correct file extension based on format
      const fileExtension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `RAB_${project.name}_${new Date().toISOString().split('T')[0]}.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting RAB:', error);
      alert('Error exporting RAB. Please try again.');
    }
  };

  const importRAB = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectId', project.id);
      
      const response = await projectAPI.importRAB(formData);
      
      if (response.data && response.data.rabItems) {
        setRabItems(response.data.rabItems);
        onUpdate({ budget: response.data.budget });
        alert('RAB berhasil diimpor!');
      }
      
    } catch (error) {
      console.error('Error importing RAB:', error);
      alert('Error importing RAB. Please try again.');
    }
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.xlsx,.xls,.csv';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        importRAB(file);
      }
    };
    input.click();
  };

  const approveRAB = async () => {
    try {
      await projectAPI.approveRAB(project.id, {
        approvedBy: 'current_user' // Simplified payload - backend only needs approvedBy
      });
      
      // Reload RAB items to get updated approval status
      await loadRABItems();
      
      // Update project status
      onUpdate({ 
        budget: { 
          ...project.budget, 
          status: 'approved',
          approvedAt: new Date().toISOString() 
        }
      });
      
      alert('RAB berhasil disetujui!');
      
    } catch (error) {
      console.error('Error approving RAB:', error);
      alert('Error approving RAB. Please try again.');
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    const filtered = selectedCategory === 'all' 
      ? rabItems 
      : rabItems.filter(item => item.category === selectedCategory);
    
    const subtotal = filtered.reduce((sum, item) => sum + item.totalPrice, 0);
    const overhead = subtotal * 0.1; // 10% overhead
    const profit = subtotal * 0.1; // 10% profit
    const ppn = (subtotal + overhead + profit) * 0.11; // 11% PPN
    const total = subtotal + overhead + profit + ppn;
    
    return {
      subtotal,
      overhead,
      profit,
      ppn,
      total,
      itemCount: filtered.length
    };
  }, [rabItems, selectedCategory]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const AddEditForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState(item || {
      category: 'material',
      itemName: '',
      specification: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      vendor: '',
      notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      const totalPrice = formData.quantity * formData.unitPrice;
      onSave({
        ...formData,
        id: item?.id || `RAB${Date.now()}`,
        totalPrice,
        status: item?.status || 'pending'
      });
    };

    return (
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        style={{
          zIndex: 9999,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div 
          className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto"
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            maxWidth: '672px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
          }}
        >
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">
              {item ? 'Edit Item RAB' : 'Tambah Item RAB'}
            </h3>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kategori</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {Object.entries(categories).map(([key, cat]) => (
                    <option key={key} value={key}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Nama Item</label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Spesifikasi</label>
              <textarea
                value={formData.specification}
                onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={2}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Satuan</label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="m³, kg, OH, dll"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Kuantitas</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Harga Satuan</label>
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: parseInt(e.target.value) || 0 })}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Vendor/Supplier</label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Catatan</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                rows={2}
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-lg font-semibold">
                Total: {formatCurrency((formData.quantity || 0) * (formData.unitPrice || 0))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                {item ? 'Update' : 'Tambah'}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const filteredItems = selectedCategory === 'all' 
    ? rabItems 
    : rabItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Rencana Anggaran Biaya (RAB)</h3>
          <p className="text-sm text-gray-600">Kelola anggaran detail proyek</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => exportRAB('excel')}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            <Download size={14} />
            Export Excel
          </button>
          <button 
            onClick={handleImportClick}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Upload size={14} />
            Import
          </button>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Plus size={14} />
            Tambah Item
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Calculator size={16} />
            <span className="text-sm font-medium">Subtotal</span>
          </div>
          <div className="text-lg font-bold text-blue-700 truncate">
            {formatCurrency(totals.subtotal)}
          </div>
        </div>
        
        <div className="bg-green-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp size={16} />
            <span className="text-sm font-medium">Total RAB</span>
          </div>
          <div className="text-lg font-bold text-green-700 truncate">
            {formatCurrency(totals.total)}
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-600 mb-1">
            <Package size={16} />
            <span className="text-sm font-medium">Total Item</span>
          </div>
          <div className="text-lg font-bold text-yellow-700">
            {totals.itemCount}
          </div>
        </div>

        <div className="bg-purple-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <DollarSign size={16} />
            <span className="text-sm font-medium">Budget Aktual</span>
          </div>
          <div className="text-lg font-bold text-purple-700 truncate">
            {formatCurrency(project?.budget?.total || 0)}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-sm rounded-lg ${
            selectedCategory === 'all' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Semua ({rabItems.length})
        </button>
        {Object.entries(categories).map(([key, category]) => {
          const count = rabItems.filter(item => item.category === key).length;
          const Icon = category?.icon || Package; // Default to Package icon if undefined
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg ${
                selectedCategory === key 
                  ? `bg-${category.color}-600 text-white` 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <Icon size={14} />
              {category.name} ({count})
            </button>
          );
        })}
      </div>

      {/* RAB Table */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">Item</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-900">Spesifikasi</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-900">Satuan</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-900">Qty</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-900">Harga Satuan</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-900">Total</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-900">Status</th>
                <th className="px-3 py-2 text-center text-sm font-medium text-gray-900">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map((item) => {
                const category = categories[item.category] || { name: 'Unknown', icon: Package, color: 'gray' };
                const Icon = category?.icon || Package; // Default to Package icon if undefined
                
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={`text-${category.color}-600`} />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                          <div className="text-xs text-gray-500">{category.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="text-xs text-gray-900">{item.specification}</div>
                      {item.notes && (
                        <div className="text-xs text-gray-500 mt-1">{item.notes}</div>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-xs">{item.unit}</td>
                    <td className="px-3 py-2 text-right text-xs font-mono">{item.quantity.toLocaleString('id-ID')}</td>
                    <td className="px-3 py-2 text-right text-xs font-mono">{formatCurrency(item.unitPrice)}</td>
                    <td className="px-3 py-2 text-right text-xs font-mono font-medium">{formatCurrency(item.totalPrice)}</td>
                    <td className="px-3 py-2 text-center">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === 'approved' 
                          ? 'bg-green-100 text-green-800' 
                          : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'approved' ? 'Disetujui' : 
                         item.status === 'pending' ? 'Pending' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-center">
                      <div className="flex justify-center gap-1">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => deleteRABItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Summary Footer */}
        <div className="bg-gray-50 p-4 border-t">
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <button 
                onClick={approveRAB}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle size={16} />
                Approve RAB
              </button>
              <button 
                onClick={() => exportRAB('pdf')}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Download size={16} />
                Export PDF
              </button>
            </div>
            
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(totals.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Overhead (10%):</span>
                <span className="font-mono">{formatCurrency(totals.overhead)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Profit (10%):</span>
                <span className="font-mono">{formatCurrency(totals.profit)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>PPN (11%):</span>
                <span className="font-mono">{formatCurrency(totals.ppn)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-bold text-base">
                <span>Total RAB:</span>
                <span className="font-mono">{formatCurrency(totals.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Forms */}
      {showAddForm && (
        <AddEditForm
          onSave={saveRABItem}
          onCancel={() => setShowAddForm(false)}
        />
      )}
      
      {editingItem && (
        <AddEditForm
          item={editingItem}
          onSave={saveRABItem}
          onCancel={() => setEditingItem(null)}
        />
      )}
    </div>
  );
};

export default BudgetRAB;
