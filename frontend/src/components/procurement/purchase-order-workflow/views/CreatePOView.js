import React from 'react';
import { formatCurrency, calculateTotalAmount } from '../utils/poUtils';
import SupplierInfoForm from '../components/SupplierInfoForm';
import RABItemSelector from '../components/RABItemSelector';
import POSummarySection from '../components/POSummarySection';

/**
 * Create Purchase Order View Component
 */
const CreatePOView = ({ 
  project, 
  rabItems, 
  selectedItems,
  supplierInfo,
  loading,
  onItemToggle,
  onQuantityChange,
  onSupplierInfoChange,
  onSubmit, 
  onBack, 
  onCancel 
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const totalAmount = calculateTotalAmount(selectedItems);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Buat Purchase Order</h2>
          <p className="text-gray-600">Proyek: {project.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            onClick={onCancel}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Batal
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Supplier Information */}
        <SupplierInfoForm
          supplierInfo={supplierInfo}
          onChange={onSupplierInfoChange}
          disabled={loading}
        />

        {/* RAB Items Selection */}
        <RABItemSelector
          rabItems={rabItems}
          selectedItems={selectedItems}
          onItemToggle={onItemToggle}
          onQuantityChange={onQuantityChange}
          disabled={loading}
        />

        {/* Summary */}
        {selectedItems.length > 0 && (
          <POSummarySection
            selectedItems={selectedItems}
            totalAmount={totalAmount}
          />
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            disabled={loading}
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={selectedItems.length === 0 || loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Memproses...' : 'Buat Purchase Order'}
          </button>
        </div>
      </form>
    </>
  );
};

export default CreatePOView;