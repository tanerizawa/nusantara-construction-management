import React from 'react';

/**
 * Supplier Information Form Component
 */
const SupplierInfoForm = ({ supplierInfo, onChange, disabled = false }) => {
  const handleChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Informasi Supplier</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Supplier *
          </label>
          <input
            type="text"
            value={supplierInfo.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kontak
          </label>
          <input
            type="text"
            value={supplierInfo.contact}
            onChange={(e) => handleChange('contact', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={disabled}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat
          </label>
          <textarea
            value={supplierInfo.address}
            onChange={(e) => handleChange('address', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={disabled}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tanggal Pengiriman
          </label>
          <input
            type="date"
            value={supplierInfo.deliveryDate}
            onChange={(e) => handleChange('deliveryDate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
};

export default SupplierInfoForm;