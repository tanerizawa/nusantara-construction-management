import React from 'react';
import { MapPin } from 'lucide-react';

/**
 * LocationSection component for the project's location information
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.saving - Whether the form is currently saving
 * @returns {JSX.Element} LocationSection component
 */
const LocationSection = ({ formData, handleInputChange, saving }) => {
  return (
    <div 
      style={{
        backgroundColor: '#1C1C1E',
        border: '1px solid #38383A'
      }}
      className="rounded-xl p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-[#FF9F0A]/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-[#FF9F0A]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-white">
            Lokasi Proyek
          </h2>
          <p className="text-sm text-[#8E8E93]">
            Alamat lokasi proyek
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Alamat
          </label>
          <textarea
            value={formData.location.address}
            onChange={(e) => handleInputChange('location.address', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366] resize-none"
            rows={3}
            placeholder="Alamat lengkap lokasi proyek"
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kota
          </label>
          <input
            type="text"
            value={formData.location.city}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Kota"
            disabled={saving}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Provinsi
          </label>
          <input
            type="text"
            value={formData.location.province}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Provinsi"
            disabled={saving}
          />
        </div>
      </div>
    </div>
  );
};

export default LocationSection;