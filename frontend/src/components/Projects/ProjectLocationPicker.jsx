import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Navigation, Crosshair, Maximize2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './ProjectLocationPicker.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * MapClickHandler Component
 * Handles map click events to set marker position
 */
const MapClickHandler = ({ onLocationSelect, disabled }) => {
  useMapEvents({
    click(e) {
      if (!disabled) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ latitude: lat, longitude: lng });
      }
    }
  });
  return null;
};

/**
 * MapController Component
 * Handles map ref and programmatic movement
 */
const MapController = ({ mapRef, coordinates }) => {
  const map = useMap();
  
  useEffect(() => {
    // Store map instance in ref
    mapRef.current = map;
  }, [map, mapRef]);
  
  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude && map) {
      const newPos = [coordinates.latitude, coordinates.longitude];
      console.log('🗺️ MapController: Flying to', newPos);
      
      // Use flyTo for smooth animation
      map.flyTo(newPos, 16, {
        duration: 1.5,
        easeLinearity: 0.25
      });
    }
  }, [coordinates?.latitude, coordinates?.longitude, map]);
  
  return null;
};

/**
 * ProjectLocationPicker Component
 * Interactive map for selecting project coordinates with click-to-mark functionality
 * 
 * @param {Object} props
 * @param {Object} props.coordinates - Current coordinates { latitude, longitude }
 * @param {Function} props.onCoordinatesChange - Callback when coordinates change
 * @param {number} props.radius - Geofence radius in meters
 * @param {Function} props.onRadiusChange - Callback when radius changes
 * @param {boolean} props.disabled - Disable interaction
 * @param {string} props.projectName - Project name for context
 * @param {string} props.address - Street address (optional)
 * @param {string} props.village - Desa/Kelurahan
 * @param {string} props.district - Kecamatan
 * @param {string} props.city - Kabupaten/Kota
 * @param {string} props.province - Provinsi
 */
const ProjectLocationPicker = ({ 
  coordinates, 
  onCoordinatesChange,
  radius = 100,
  onRadiusChange,
  disabled = false,
  projectName = '',
  address = '',
  village = '',
  district = '',
  city = '',
  province = ''
}) => {
  // Default center: Jakarta, Indonesia
  const defaultCenter = [-6.2088, 106.8456];
  
  const [center, setCenter] = useState([
    coordinates?.latitude || defaultCenter[0],
    coordinates?.longitude || defaultCenter[1]
  ]);
  
  const [marker, setMarker] = useState(
    coordinates?.latitude && coordinates?.longitude
      ? [coordinates.latitude, coordinates.longitude]
      : null
  );
  
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [searchingAddress, setSearchingAddress] = useState(false);
  const [zoom, setZoom] = useState(16);
  const mapRef = useRef();

  // Update marker when coordinates prop changes (state only, MapController handles map movement)
  useEffect(() => {
    if (coordinates?.latitude && coordinates?.longitude) {
      const newPos = [coordinates.latitude, coordinates.longitude];
      setMarker(newPos);
      setCenter(newPos);
    }
  }, [coordinates?.latitude, coordinates?.longitude]);

  // Handle location selection from map click
  const handleLocationSelect = (coords) => {
    const newPos = [coords.latitude, coords.longitude];
    setMarker(newPos);
    onCoordinatesChange(coords);
  };

  // Get current GPS location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation tidak didukung oleh browser Anda');
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        
        setCenter(newPos);
        setMarker(newPos);
        onCoordinatesChange({ latitude, longitude });
        setLoadingLocation(false);
        
        // Pan map to new location
        if (mapRef.current) {
          mapRef.current.setView(newPos, 16);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert(`Gagal mendapatkan lokasi: ${error.message}`);
        setLoadingLocation(false);
      },
      { 
        enableHighAccuracy: true, 
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  // Search location by address using Nominatim (OpenStreetMap Geocoding)
  const handleSearchByAddress = async () => {
    // Build search query from address fields (most specific to general)
    const searchParts = [];
    if (address) searchParts.push(address);           // Jalan, nomor (optional)
    if (village) searchParts.push(village);           // Desa/Kelurahan
    if (district) searchParts.push(district);         // Kecamatan
    if (city) searchParts.push(city);                 // Kabupaten/Kota
    if (province) searchParts.push(province);         // Provinsi
    searchParts.push('Indonesia');                    // Country
    
    const searchQuery = searchParts.join(', ');
    
    // Must have at least village or city
    if (!village && !city) {
      alert('Mohon isi minimal Desa/Kelurahan atau Kabupaten/Kota terlebih dahulu');
      return;
    }

    setSearchingAddress(true);
    
    try {
      console.log('🔍 Searching location:', searchQuery);
      
      // Use Nominatim API (OpenStreetMap Geocoding - FREE)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(searchQuery)}` +
        `&format=json` +
        `&limit=1` +
        `&addressdetails=1`,
        {
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'NusantaraConstructionApp/1.0'
          }
        }
      );

      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);
        const newPos = [latitude, longitude];
        
        console.log('✅ Location found:', {
          display_name: result.display_name,
          lat: latitude,
          lon: longitude
        });
        
        // Update state - let useEffect handle map movement
        setCenter(newPos);
        setMarker(newPos);
        setZoom(16);
        onCoordinatesChange({ latitude, longitude });
        setSearchingAddress(false);
        
      } else {
        alert('Lokasi tidak ditemukan. Coba perbaiki alamat atau pilih lokasi manual di peta.');
        setSearchingAddress(false);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      alert('Gagal mencari lokasi. Silakan pilih manual di peta.');
      setSearchingAddress(false);
    }
  };

  // Auto-search when address fields change (with debounce)
  useEffect(() => {
    // Only auto-search if we don't have coordinates yet and address fields are filled
    if (!marker && (address || village || district || city || province)) {
      const timer = setTimeout(() => {
        handleSearchByAddress();
      }, 500); // Debounce 500ms

      return () => clearTimeout(timer);
    }
  }, [address, village, district, city, province]);

  // Reset/clear location
  const handleClearLocation = () => {
    setMarker(null);
    onCoordinatesChange({ latitude: null, longitude: null });
  };

  return (
    <div className="project-location-picker">
      {/* Header */}
      <div className="location-picker-header">
        <div className="header-title">
          <MapPin size={20} className="header-icon" />
          <div>
            <h3>Pilih Lokasi Proyek</h3>
            <p className="header-subtitle">
              Klik pada peta untuk menandai lokasi proyek
              {projectName && <span> - {projectName}</span>}
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="location-controls">
        {/* Search by Address Button */}
        {(address || village || district || city || province) && (
          <button
            type="button"
            onClick={handleSearchByAddress}
            disabled={disabled || searchingAddress}
            className="control-button primary"
            title="Cari lokasi berdasarkan alamat yang diisi"
          >
            <MapPin size={16} />
            {searchingAddress ? 'Mencari lokasi...' : 'Cari Lokasi dari Alamat'}
          </button>
        )}

        {/* Current Location Button */}
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={disabled || loadingLocation}
          className="control-button primary"
          title="Gunakan lokasi saat ini"
        >
          <Navigation size={16} />
          {loadingLocation ? 'Mendapatkan lokasi...' : 'Lokasi Saat Ini'}
        </button>

        {/* Clear Button */}
        {marker && (
          <button
            type="button"
            onClick={handleClearLocation}
            disabled={disabled}
            className="control-button secondary"
            title="Hapus penanda"
          >
            <Crosshair size={16} />
            Hapus Penanda
          </button>
        )}

        {/* Radius Input */}
        <div className="radius-control">
          <label>Radius Geofence:</label>
          <input
            type="number"
            value={radius}
            onChange={(e) => onRadiusChange(parseInt(e.target.value) || 100)}
            min="10"
            max="5000"
            step="10"
            disabled={disabled}
            className="radius-input"
          />
          <span className="radius-unit">meter</span>
        </div>
      </div>

      {/* Coordinates Display */}
      {marker && (
        <div className="coordinates-display">
          <div className="coordinate-item">
            <span className="coordinate-label">Latitude:</span>
            <span className="coordinate-value">{marker[0].toFixed(8)}</span>
          </div>
          <div className="coordinate-item">
            <span className="coordinate-label">Longitude:</span>
            <span className="coordinate-value">{marker[1].toFixed(8)}</span>
          </div>
          <div className="coordinate-item">
            <span className="coordinate-label">Radius:</span>
            <span className="coordinate-value">{radius}m</span>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="map-wrapper">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
          scrollWheelZoom={true}
        >
          {/* Map Controller - handles ref and programmatic movement */}
          <MapController mapRef={mapRef} coordinates={coordinates} />
          
          {/* OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />
          
          {/* Click Handler */}
          <MapClickHandler 
            onLocationSelect={handleLocationSelect} 
            disabled={disabled}
          />

          {/* Marker and Circle */}
          {marker && (
            <>
              {/* Location Marker */}
              <Marker position={marker}>
                {/* Popup could be added here if needed */}
              </Marker>
              
              {/* Geofence Circle */}
              <Circle
                center={marker}
                radius={radius}
                pathOptions={{
                  color: '#0A84FF',
                  fillColor: '#0A84FF',
                  fillOpacity: 0.1,
                  weight: 2,
                  dashArray: '5, 5'
                }}
              />
            </>
          )}
        </MapContainer>

        {/* Floating Help Text */}
        {!marker && (
          <div className="map-overlay-hint">
            <Crosshair size={48} className="hint-icon" />
            <p className="hint-text">
              Klik pada peta untuk menandai lokasi proyek
            </p>
            <p className="hint-subtext">
              atau gunakan tombol "Lokasi Saat Ini"
            </p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="location-info-box">
        <div className="info-item">
          <span className="info-icon">�</span>
          <span className="info-text">
            {(address || city || province) 
              ? 'Klik "Cari Lokasi dari Alamat" untuk auto-detect berdasarkan alamat yang diisi'
              : 'Isi alamat/kota/provinsi di atas untuk auto-detect lokasi'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon">�📍</span>
          <span className="info-text">
            Atau klik pada peta untuk menandai lokasi manual
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon">🎯</span>
          <span className="info-text">
            Radius digunakan untuk validasi attendance (geofencing)
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon">⚠️</span>
          <span className="info-text">
            Pastikan lokasi akurat untuk menghindari masalah absensi
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectLocationPicker;
