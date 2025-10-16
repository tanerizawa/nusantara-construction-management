import React from 'react';

/**
 * Location Section
 * Address, city, province
 */
const LocationSection = ({ formData, handleInputChange }) => {
  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#0A84FF] rounded-full"></span>
        Lokasi Proyek
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Alamat Proyek
          </label>
          <input
            type="text"
            value={formData.location?.address || ''}
            onChange={(e) => handleInputChange('location.address', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Alamat lengkap lokasi proyek"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kota
          </label>
          <input
            type="text"
            value={formData.location?.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama kota"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Provinsi
          </label>
          <input
            type="text"
            value={formData.location?.province || ''}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama provinsi"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
