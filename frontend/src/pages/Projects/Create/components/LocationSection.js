import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Map } from 'lucide-react';
import ProjectLocationPicker from '../../../../components/Projects/ProjectLocationPicker';

/**
 * Location Section
 * Address, city, province, and GPS coordinates
 */
const LocationSection = ({ formData, handleInputChange }) => {
  const [showMapPicker, setShowMapPicker] = useState(false);

  const handleCoordinatesChange = (coords) => {
    const currentCoordinates = formData.coordinates || { radius: 100 };
    const updatedCoordinates = { ...currentCoordinates, ...coords };
    handleInputChange('coordinates', updatedCoordinates);
  };

  const handleRadiusChange = (radius) => {
    const currentCoordinates = formData.coordinates || { latitude: null, longitude: null };
    handleInputChange('coordinates', { ...currentCoordinates, radius });
  };

  return (
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#0A84FF] rounded-full"></span>
        Lokasi Proyek
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Alamat Lengkap (Opsional)
          </label>
          <input
            type="text"
            value={formData.location?.address || ''}
            onChange={(e) => handleInputChange('location.address', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama jalan, nomor, patokan (opsional)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Desa / Kelurahan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.village || ''}
            onChange={(e) => handleInputChange('location.village', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama desa atau kelurahan"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kecamatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.district || ''}
            onChange={(e) => handleInputChange('location.district', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama kecamatan"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kabupaten / Kota <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama kabupaten atau kota"
            required
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Provinsi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.province || ''}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white"
            placeholder="Nama provinsi"
            required
          />
        </div>
      </div>

      {/* GPS Coordinates Section */}
      <div className="mt-6 pt-6 border-t border-[#38383A]">
        <button
          type="button"
          onClick={() => setShowMapPicker(!showMapPicker)}
          className="flex items-center gap-2 text-[#0A84FF] hover:text-[#0077ED] 
                   transition-colors duration-200 font-medium mb-4"
        >
          <Map size={20} />
          <span>{showMapPicker ? 'Sembunyikan Peta' : 'Pilih Koordinat GPS'}</span>
          {showMapPicker ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* Coordinate Summary */}
        {formData.coordinates?.latitude && formData.coordinates?.longitude && (
          <div className="mb-4 p-4 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
            <div className="text-sm text-[#98989D] mb-2">Koordinat Terpilih:</div>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-[#98989D]">Latitude: </span>
                <span className="text-white font-mono">{formData.coordinates.latitude.toFixed(8)}</span>
              </div>
              <div>
                <span className="text-[#98989D]">Longitude: </span>
                <span className="text-white font-mono">{formData.coordinates.longitude.toFixed(8)}</span>
              </div>
              <div>
                <span className="text-[#98989D]">Radius: </span>
                <span className="text-white">{formData.coordinates.radius || 100}m</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Picker */}
        {showMapPicker && (
          <div className="mt-4">
            <ProjectLocationPicker
              coordinates={{
                latitude: formData.coordinates?.latitude || null,
                longitude: formData.coordinates?.longitude || null
              }}
              onCoordinatesChange={handleCoordinatesChange}
              radius={formData.coordinates?.radius || 100}
              onRadiusChange={handleRadiusChange}
              projectName={formData.name || 'Proyek Baru'}
              address={formData.location?.address || ''}
              village={formData.location?.village || ''}
              district={formData.location?.district || ''}
              city={formData.location?.city || ''}
              province={formData.location?.province || ''}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;
