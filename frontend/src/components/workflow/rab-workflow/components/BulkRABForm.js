import React, { useState, useRef } from 'react';
import { Plus, Trash2, Save, FileText, X, Info, Upload, Download, AlertTriangle } from 'lucide-react';
import { RAB_CATEGORIES, RAB_ITEM_TYPES, getItemTypeConfig } from '../config/rabCategories';
import { formatCurrency } from '../../../../utils/formatters';
import { validateRABForm, isFormValid } from '../utils/rabValidation';

/**
 * BulkRABForm Component
 * Enhanced form for adding multiple RAB items with Excel import/export functionality
 */
const BulkRABForm = ({ 
  onSubmit, 
  onSaveDraft,
  onCancel,
  draftItems = []
}) => {
  const [items, setItems] = useState(draftItems.length > 0 ? draftItems : [createEmptyItem()]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [errors, setErrors] = useState({});
  const [importError, setImportError] = useState('');
  const fileInputRef = useRef(null);

  function createEmptyItem() {
    return {
      id: Date.now() + Math.random(),
      category: '',
      description: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      specifications: '',
      itemType: 'material',
      supplier: '',
      laborCategory: '',
      serviceScope: ''
    };
  }

  const downloadTemplate = () => {
    const templateData = [
      {
        'Tipe Item': 'material',
        'Kategori': 'Struktur',
        'Deskripsi': 'Semen Portland PC 40kg',
        'Unit': 'sak',
        'Quantity': 100,
        'Harga Unit': 65000,
        'Spesifikasi': 'Semen grade A'
      },
      {
        'Tipe Item': 'service',
        'Kategori': 'Finishing',
        'Deskripsi': 'Jasa Cat Tembok',
        'Unit': 'm²',
        'Quantity': 250,
        'Harga Unit': 25000,
        'Spesifikasi': 'Cat akrilik 2 lapis'
      }
    ];

    const csvContent = convertToCSV(templateData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'template-rab-import.csv';
    link.click();
  };

  const convertToCSV = (data) => {
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).join(',')).join('\n');
    return headers + '\n' + rows;
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError('');
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const parsedItems = parseCSV(text);
        
        if (parsedItems.length === 0) {
          setImportError('File CSV kosong atau format tidak valid');
          return;
        }

        setItems(parsedItems);
        setErrors({});
      } catch (error) {
        setImportError('Error parsing file: ' + error.message);
      }
    };
    
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  const parseCSV = (text) => {
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const requiredHeaders = ['Tipe Item', 'Kategori', 'Deskripsi', 'Unit', 'Quantity', 'Harga Unit'];
    const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
    
    if (missingHeaders.length > 0) {
      throw new Error(`Header yang diperlukan: ${missingHeaders.join(', ')}`);
    }

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const values = line.split(',').map(v => v.trim());
      const item = {
        id: Date.now() + Math.random() + i,
        itemType: values[headers.indexOf('Tipe Item')] || 'material',
        category: values[headers.indexOf('Kategori')] || '',
        description: values[headers.indexOf('Deskripsi')] || '',
        unit: values[headers.indexOf('Unit')] || '',
        quantity: parseFloat(values[headers.indexOf('Quantity')]) || 0,
        unitPrice: parseFloat(values[headers.indexOf('Harga Unit')]) || 0,
        specifications: values[headers.indexOf('Spesifikasi')] || '',
        supplier: '',
        laborCategory: '',
        serviceScope: ''
      };
      
      items.push(item);
    }
    
    return items;
  };

  const addNewRow = () => {
    setItems([...items, createEmptyItem()]);
  };

  const removeRow = (itemId) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== itemId));
      // Remove errors for this item
      const newErrors = { ...errors };
      delete newErrors[itemId];
      setErrors(newErrors);
    }
  };

  const updateItem = (itemId, field, value) => {
    setItems(items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ));
    
    // Clear error for this field
    if (errors[itemId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [itemId]: {
          ...prev[itemId],
          [field]: undefined
        }
      }));
    }
  };

  const validateAllItems = () => {
    const newErrors = {};
    let hasErrors = false;

    items.forEach(item => {
      const itemErrors = validateRABForm(item);
      if (!isFormValid(itemErrors)) {
        newErrors[item.id] = itemErrors;
        hasErrors = true;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAllItems()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📤 BulkRABForm: Submitting items:', items);
      const result = await onSubmit(items);
      console.log('📤 BulkRABForm: Submit result:', result);
      
      if (result.success) {
        setItems([createEmptyItem()]);
        setErrors({});
        console.log('✅ BulkRABForm: Submit successful, form cleared');
      } else {
        console.error('❌ BulkRABForm: Submit failed:', result.error);
      }
    } catch (error) {
      console.error('❌ BulkRABForm: Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    
    try {
      await onSaveDraft(items);
    } catch (error) {
      console.error('Save draft error:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const getTotalAmount = () => {
    return items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  };

  const getWorkflowInfo = (itemType) => {
    const config = getItemTypeConfig(itemType);
    if (itemType === 'material') {
      return { label: 'Material → Purchase Order', color: 'text-blue-300', bg: 'bg-blue-500/20' };
    } else if (itemType === 'service') {
      return { label: 'Jasa → Perintah Kerja', color: 'text-green-300', bg: 'bg-green-500/20' };
    }
    return { label: config?.label || 'Unknown', color: 'text-gray-300', bg: 'bg-gray-500/20' };
  };

  return (
    <div className="bg-[#2C2C2E] rounded-xl border border-[#38383A] overflow-hidden">
      {/* Header */}
      <div className="bg-[#1C1C1E] px-6 py-4 border-b border-[#38383A]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">Kelola RAB Project</h3>
            <p className="text-sm text-[#8E8E93] mt-1">
              Input, edit, dan kelola item RAB secara efisien
            </p>
          </div>
          <button
            onClick={onCancel}
            className="p-2 text-[#8E8E93] hover:text-white hover:bg-[#38383A] rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-[#1C1C1E] px-6 py-3 border-b border-[#38383A]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Import/Export Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadTemplate}
              className="flex items-center px-3 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors text-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Template
            </button>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileImport}
              className="hidden"
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-2 bg-[#FF9F0A] text-white rounded-lg hover:bg-[#FF9F0A]/90 transition-colors text-sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Excel/CSV
            </button>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center space-x-4 text-sm">
            <div className="bg-[#2C2C2E] px-3 py-1 rounded">
              <span className="text-[#8E8E93]">Total:</span>
              <span className="text-white ml-1 font-semibold">{items.length}</span>
            </div>
            <div className="bg-[#2C2C2E] px-3 py-1 rounded">
              <span className="text-[#8E8E93]">Estimasi:</span>
              <span className="text-[#0A84FF] ml-1 font-semibold">{formatCurrency(getTotalAmount())}</span>
            </div>
          </div>
        </div>

        {/* Import Error */}
        {importError && (
          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start">
            <AlertTriangle className="h-4 w-4 text-red-400 mr-2 mt-0.5" />
            <div className="text-sm text-red-400">{importError}</div>
          </div>
        )}
      </div>

      {/* Table Container */}
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="overflow-x-auto bg-[#1C1C1E] rounded-lg border border-[#38383A]">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#38383A]">
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-28">
                    Tipe
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-36">
                    Kategori
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider">
                    Deskripsi
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-20">
                    Unit
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-24">
                    Qty
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-32">
                    Harga Unit
                  </th>
                  <th className="text-left py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-32">
                    Subtotal
                  </th>
                  <th className="text-center py-3 px-3 text-xs font-semibold text-[#98989D] uppercase tracking-wider w-16">
                    
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#38383A]">
                {items.map((item, index) => {
                  const itemErrors = errors[item.id] || {};
                  const workflowInfo = getWorkflowInfo(item.itemType);
                  
                  return (
                    <tr key={item.id} className="hover:bg-[#2C2C2E] transition-colors">
                      {/* Item Type */}
                      <td className="py-2 px-3">
                        <select
                          value={item.itemType}
                          onChange={(e) => updateItem(item.id, 'itemType', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="material">Material</option>
                          <option value="service">Jasa</option>
                          <option value="labor">Tenaga</option>
                          <option value="equipment">Alat</option>
                          <option value="overhead">Overhead</option>
                        </select>
                        {itemErrors.itemType && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.itemType}</p>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-2 px-3">
                        <select
                          value={item.category}
                          onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="">Pilih Kategori</option>
                          {RAB_CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                        </select>
                        {itemErrors.category && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.category}</p>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Deskripsi item..."
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.description && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.description}</p>
                        )}
                      </td>

                      {/* Unit */}
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                          placeholder="Unit"
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.unit && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.unit}</p>
                        )}
                      </td>

                      {/* Quantity */}
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.quantity && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.quantity}</p>
                        )}
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          min="0"
                          step="0.01"
                          className="w-full px-2 py-1.5 text-xs bg-[#2C2C2E] border border-[#38383A] rounded text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        {itemErrors.unitPrice && (
                          <p className="text-[#FF3B30] text-xs mt-1">{itemErrors.unitPrice}</p>
                        )}
                      </td>

                      {/* Subtotal */}
                      <td className="py-2 px-3 text-right">
                        <span className="text-sm font-semibold text-white">
                          {formatCurrency(item.quantity * item.unitPrice)}
                        </span>
                      </td>

                      {/* Remove button */}
                      <td className="py-2 px-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeRow(item.id)}
                          disabled={items.length === 1}
                          className="p-1.5 text-[#FF3B30] hover:text-[#FF3B30]/80 hover:bg-[#FF3B30]/10 rounded disabled:text-[#8E8E93] disabled:cursor-not-allowed transition-colors"
                          title="Hapus baris"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Add Row Button */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={addNewRow}
              className="flex items-center px-4 py-2 bg-[#38383A] border border-[#48484A] rounded-lg text-white hover:bg-[#48484A] transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Baris
            </button>
          </div>

          {/* Summary Bar */}
          <div className="mt-6 bg-[#1C1C1E] rounded-lg p-4 border border-[#38383A]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* Summary Stats */}
              <div className="flex items-center space-x-6">
                <div>
                  <span className="text-sm text-[#8E8E93]">Total Items:</span>
                  <span className="text-lg font-bold text-white ml-2">{items.length}</span>
                </div>
                <div>
                  <span className="text-sm text-[#8E8E93]">Material:</span>
                  <span className="text-sm font-semibold text-blue-300 ml-2">
                    {items.filter(i => i.itemType === 'material').length}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-[#8E8E93]">Jasa:</span>
                  <span className="text-sm font-semibold text-green-300 ml-2">
                    {items.filter(i => i.itemType === 'service').length}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-[#8E8E93]">Total Estimasi:</span>
                  <span className="text-xl font-bold text-[#0A84FF] ml-2">
                    {formatCurrency(getTotalAmount())}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  disabled={isSavingDraft}
                  className="flex items-center px-4 py-2 bg-[#FF9F0A] text-white rounded-lg hover:bg-[#FF9F0A]/90 disabled:opacity-50 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isSavingDraft ? 'Menyimpan...' : 'Simpan Draft'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="flex items-center px-6 py-2 bg-[#30D158] text-white rounded-lg hover:bg-[#30D158]/90 disabled:opacity-50 transition-colors font-semibold"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? 'Menyimpan...' : `Simpan ${items.length} Item`}
                </button>
              </div>
            </div>

            {/* Workflow Info */}
            <div className="mt-4 text-xs text-[#8E8E93] bg-[#2C2C2E] p-3 rounded border border-[#38383A]">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                  Material → Purchase Order
                </span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Jasa → Perintah Kerja
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BulkRABForm;