import React, { useState, useEffect } from 'react';
import { Map, ChevronDown, ChevronUp } from 'lucide-react';
import ProjectLocationPicker from '../../../components/Projects/ProjectLocationPicker';
import axios from 'axios';
import { API_URL } from '../../../utils/config';

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
        const token = localStorage.getItem('token');
        
        // Fixed: Use path parameter instead of query string (backend expects :projectId)
        const response = await axios.get(`${API_URL}/attendance/locations/${projectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.data.success && response.data.data && response.data.data.length > 0) {
          const location = response.data.data[0]; // Get first active location
          setExistingLocation(location);
          
          // Update form data with existing coordinates
          handleInputChange('coordinates', {
            latitude: parseFloat(location.latitude),
            longitude: parseFloat(location.longitude),
            radius: parseInt(location.radius_meters) || 100
          });
          
          console.log('✅ Existing project location loaded:', {
            lat: location.latitude,
            lng: location.longitude,
            radius: location.radius_meters
          });
        }
      } catch (error) {
        // Don't show error to user - it's OK if no location exists yet
        console.warn('⚠️ No existing project location found (or error fetching):', error.message);
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
    <div className="bg-[#2C2C2E] border border-[#38383A] rounded-lg p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-1 h-5 bg-[#FF9F0A] rounded-full"></span>
        Lokasi Proyek
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Alamat (Optional) */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Alamat Lengkap (Opsional)
          </label>
          <input
            type="text"
            value={formData.location.address || ''}
            onChange={(e) => handleInputChange('location.address', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Nama jalan, nomor, patokan (opsional)"
            disabled={saving}
          />
        </div>
        
        {/* Desa/Kelurahan */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Desa / Kelurahan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.village || ''}
            onChange={(e) => handleInputChange('location.village', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
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
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Nama kecamatan"
            disabled={saving}
            required
          />
        </div>
        
        {/* Kabupaten/Kota */}
        <div>
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Kabupaten / Kota <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
            placeholder="Nama kabupaten atau kota"
            disabled={saving}
            required
          />
        </div>
        
        {/* Provinsi */}
        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-[#98989D] mb-2">
            Provinsi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location.province || ''}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            className="w-full px-4 py-2.5 border border-[#38383A] rounded-lg 
                     focus:ring-2 focus:ring-[#0A84FF] focus:border-transparent
                     bg-[#1C1C1E] text-white placeholder-[#636366]"
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
          <div className="mb-4 p-4 bg-[#1C1C1E] border border-[#38383A] rounded-lg">
            <div className="text-sm text-[#98989D] mb-2">
              {existingLocation ? 'Koordinat Saat Ini:' : 'Koordinat Terpilih:'}
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