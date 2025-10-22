import React, { useState, useEffect } from 'react';
import { MapPin, Map, ChevronDown, ChevronUp } from 'lucide-react';
import ProjectLocationPicker from '../../../components/Projects/ProjectLocationPicker';
import api from '../../../utils/api';

/**
 * LocationSection component for the project's location information
 * Includes address fields and GPS coordinate picker
 * 
 * @param {object} props - Component props
 * @param {object} props.formData - Form data object
 * @param {function} props.handleInputChange - Function to handle input changes
 * @param {boolean} props.saving - Whether the form is currently saving
 * @param {string} props.projectId - Current project ID for fetching existing location
 * @returns {JSX.Element} LocationSection component
 */
const LocationSection = ({ formData, handleInputChange, saving, projectId }) => {
  const [showMapPicker, setShowMapPicker] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [existingLocation, setExistingLocation] = useState(null);

  // Fetch existing project location on mount
  useEffect(() => {
    const fetchProjectLocation = async () => {
      if (!projectId) return;
      
      try {
        setLoadingLocation(true);
        const response = await api.get(`/attendance/locations?projectId=${projectId}`);
        
        if (response.data.success && response.data.data.length > 0) {
          const location = response.data.data[0]; // Get first active location
          setExistingLocation(location);
          
          // Update form data with existing coordinates
          handleInputChange('coordinates', {
            latitude: location.latitude,
            longitude: location.longitude,
            radius: location.radius_meters || 100
          });
        }
      } catch (error) {
        console.error('Error fetching project location:', error);
      } finally {
        setLoadingLocation(false);
      }
    };

    fetchProjectLocation();
  }, [projectId]);

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
        {/* Alamat (Optional) */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Alamat <span className="text-xs text-[#636366]">(opsional)</span>
          </label>
          <input
            type="text"
            value={formData.location.address || ''}
            onChange={(e) => handleInputChange('location.address', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Nama jalan, nomor, patokan (opsional)"
            disabled={saving}
          />
        </div>
        
        {/* Desa/Kelurahan */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Desa/Kelurahan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.village || ''}
            onChange={(e) => handleInputChange('location.village', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Nama desa atau kelurahan"
            disabled={saving}
            required
          />
        </div>
        
        {/* Kecamatan */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kecamatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.district || ''}
            onChange={(e) => handleInputChange('location.district', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Nama kecamatan"
            disabled={saving}
            required
          />
        </div>
        
        {/* Kabupaten/Kota */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kabupaten/Kota <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Nama kabupaten atau kota"
            disabled={saving}
            required
          />
        </div>
        
        {/* Provinsi */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Provinsi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.province || ''}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            style={{
              backgroundColor: '#2C2C2E',
              border: '1px solid #38383A',
              color: 'white'
            }}
            className="w-full px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-[#0A84FF] focus:border-[#0A84FF] outline-none transition-all placeholder-[#636366]"
            placeholder="Nama provinsi"
            disabled={saving}
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
          disabled={saving || loadingLocation}
        >
          <Map size={20} />
          <span>
            {existingLocation 
              ? (showMapPicker ? 'Sembunyikan Peta' : 'Perbarui Koordinat GPS')
              : (showMapPicker ? 'Sembunyikan Peta' : 'Tambah Koordinat GPS')}
          </span>
          {showMapPicker ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {loadingLocation && (
          <div className="text-sm text-[#98989D] mb-4">
            Memuat lokasi proyek...
          </div>
        )}

        {/* Coordinate Summary */}
        {(formData.coordinates?.latitude && formData.coordinates?.longitude) && (
          <div className="mb-4 p-4 bg-[#2C2C2E] border border-[#38383A] rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-[#98989D]">
                {existingLocation ? 'Koordinat Saat Ini:' : 'Koordinat Terpilih:'}
              </div>
              {existingLocation && (
                <div className="text-xs px-2 py-1 bg-[#34C759]/10 text-[#34C759] rounded">
                  Aktif
                </div>
              )}
            </div>
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
              projectName={formData.name || 'Proyek'}
              address={formData.location?.address || ''}
              village={formData.location?.village || ''}
              district={formData.location?.district || ''}
              city={formData.location?.city || ''}
              province={formData.location?.province || ''}
              disabled={saving}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSection;