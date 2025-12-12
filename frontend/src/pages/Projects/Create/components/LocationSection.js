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
    <section className="rounded-3xl border border-white/5 bg-[#080b13]/85 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="eyebrow-label text-white/60">Step 3</p>
          <h2 className="text-xl font-semibold text-white">Lokasi Proyek</h2>
          <p className="text-sm text-white/50">Lengkapi alamat administratif dan titik GPS untuk kebutuhan audit lapangan.</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-3">
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Alamat Lengkap (Opsional)
          </label>
          <input
            type="text"
            value={formData.location?.address || ''}
            onChange={(e) => handleInputChange('location.address', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="Nama jalan, nomor, patokan (opsional)"
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Desa / Kelurahan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.village || ''}
            onChange={(e) => handleInputChange('location.village', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="Nama desa atau kelurahan"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Kecamatan <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.district || ''}
            onChange={(e) => handleInputChange('location.district', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="Nama kecamatan"
            required
          />
        </div>

        <div>
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Kabupaten / Kota <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.city || ''}
            onChange={(e) => handleInputChange('location.city', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
            placeholder="Nama kabupaten atau kota"
            required
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs uppercase tracking-[0.3em] text-white/60 mb-2">
            Provinsi <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.location?.province || ''}
            onChange={(e) => handleInputChange('location.province', e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/40 focus:border-[#0ea5e9] focus:ring-0"
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
          className="mb-4 inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
        >
          <Map size={20} />
          <span>{showMapPicker ? 'Sembunyikan Peta' : 'Pilih Koordinat GPS'}</span>
          {showMapPicker ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {/* Coordinate Summary */}
        {formData.coordinates?.latitude && formData.coordinates?.longitude && (
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="mb-2 text-sm text-white/60">Koordinat Terpilih:</div>
            <div className="flex flex-wrap gap-4 text-sm text-white">
              <div>
                <span className="text-white/60">Latitude: </span>
                <span className="font-mono">{formData.coordinates.latitude.toFixed(8)}</span>
              </div>
              <div>
                <span className="text-white/60">Longitude: </span>
                <span className="font-mono">{formData.coordinates.longitude.toFixed(8)}</span>
              </div>
              <div>
                <span className="text-white/60">Radius: </span>
                <span>{formData.coordinates.radius || 100}m</span>
              </div>
            </div>
          </div>
        )}

        {/* Map Picker */}
        {showMapPicker && (
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3">
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
    </section>
  );
};

export default LocationSection;
