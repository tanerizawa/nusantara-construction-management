import React from 'react';
import { X, Save } from 'lucide-react';
import { RAB_CATEGORIES } from '../config/rabCategories';
import { formatCurrency } from '../../../../utils/formatters';
import { calculateItemTotal } from '../utils/rabCalculations';
import { QuantityInput, CurrencyInput } from '../../../../components/ui/NumberInput';

/**
 * RABItemForm Component
 * Form for adding or editing RAB items
 */
const RABItemForm = ({ 
  formData, 
  formErrors, 
  isSubmitting, 
  editingItem,
  onSubmit, 
  onCancel, 
  onChange 
}) => {
  const previewTotal = calculateItemTotal(formData.quantity, formData.unitPrice);

  return (
    <div className="px-4 py-3 bg-[#0A84FF]/10 border-b border-[#0A84FF]/30">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-md font-medium text-blue-900">
          {editingItem ? 'Edit Item RAB' : 'Tambah Item RAB Baru'}
        </h4>
        <button
          onClick={onCancel}
          className="text-[#0A84FF] hover:text-[#0A84FF]"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4">
        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-1">Kategori</label>
          <select
            value={formData.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-[#38383A] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Pilih Kategori</option>
            {RAB_CATEGORIES.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <p className="text-[#FF3B30] text-xs mt-1">{formErrors.category}</p>
          )}
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-1">Deskripsi</label>
          <input
            type="text"
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            className="w-full px-3 py-2 border border-[#38383A] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Deskripsi item"
            required
          />
          {formErrors.description && (
            <p className="text-[#FF3B30] text-xs mt-1">{formErrors.description}</p>
          )}
        </div>

        {/* Satuan */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-1">Satuan</label>
          <input
            type="text"
            value={formData.unit}
            onChange={(e) => onChange('unit', e.target.value)}
            className="w-full px-3 py-2 border border-[#38383A] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="m², kg, unit"
            required
          />
          {formErrors.unit && (
            <p className="text-[#FF3B30] text-xs mt-1">{formErrors.unit}</p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-1">Quantity</label>
          <QuantityInput
            value={formData.quantity}
            onChange={(rawValue) => onChange('quantity', rawValue)}
            className="w-full px-3 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            required
          />
          {formErrors.quantity && (
            <p className="text-[#FF3B30] text-xs mt-1">{formErrors.quantity}</p>
          )}
        </div>

        {/* Harga Satuan */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-1">Harga Satuan</label>
          <CurrencyInput
            value={formData.unitPrice}
            onChange={(rawValue) => onChange('unitPrice', rawValue)}
            className="w-full pr-4 py-2 bg-[#1C1C1E] border border-[#38383A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
            required
          />
          {formErrors.unitPrice && (
            <p className="text-[#FF3B30] text-xs mt-1">{formErrors.unitPrice}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-[#0A84FF] text-white rounded-md hover:bg-[#0A84FF]/90 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
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
        <div className="mt-3 p-3 bg-[#2C2C2E] rounded border">
          <span className="text-sm text-[#8E8E93]">Total: </span>
          <span className="font-medium text-lg text-[#30D158]">
            {formatCurrency(previewTotal)}
          </span>
        </div>
      )}
    </div>
  );
};

export default RABItemForm;
