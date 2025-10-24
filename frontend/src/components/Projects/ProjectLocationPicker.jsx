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

  // ============================================================================
  // ENHANCED GEOCODING WITH FUZZY SEARCH & MULTI-LEVEL FALLBACK
  // ============================================================================
  
  /**
   * Normalize address text for better matching
   * - Lowercase, trim spaces, standardize abbreviations
   */
  const normalizeAddress = (text) => {
    if (!text) return '';
    
    let normalized = text.toLowerCase().trim();
    
    // Standardize common abbreviations
    const replacements = {
      'jl.': 'jalan',
      'jln.': 'jalan',
      'kel.': 'kelurahan',
      'kec.': 'kecamatan',
      'kab.': 'kabupaten',
      'prov.': 'provinsi',
      'no.': 'nomor',
      'rt.': 'rt',
      'rw.': 'rw',
      'ds.': 'desa',
      // Common typos for Indonesian cities
      'kerawang': 'karawang',
      'jakrta': 'jakarta',
      'bandng': 'bandung',
      'surabya': 'surabaya',
      'yogjakarta': 'yogyakarta',
      'yogya': 'yogyakarta',
    };
    
    Object.entries(replacements).forEach(([from, to]) => {
      const regex = new RegExp(`\\b${from}\\b`, 'gi');
      normalized = normalized.replace(regex, to);
    });
    
    // Remove extra spaces
    normalized = normalized.replace(/\s+/g, ' ').trim();
    
    return normalized;
  };

  /**
   * Calculate similarity score between two strings (0-1)
   * Uses Levenshtein distance for fuzzy matching
   */
  const calculateSimilarity = (str1, str2) => {
    const s1 = normalizeAddress(str1);
    const s2 = normalizeAddress(str2);
    
    if (s1 === s2) return 1.0;
    if (!s1 || !s2) return 0.0;
    
    // Levenshtein distance
    const matrix = [];
    for (let i = 0; i <= s2.length; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= s1.length; j++) {
      matrix[0][j] = j;
    }
    for (let i = 1; i <= s2.length; i++) {
      for (let j = 1; j <= s1.length; j++) {
        if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    const distance = matrix[s2.length][s1.length];
    const maxLength = Math.max(s1.length, s2.length);
    return 1 - (distance / maxLength);
  };

  /**
   * Score and rank geocoding results based on relevance
   */
  const scoreResult = (result, inputCity, inputProvince) => {
    let score = 0;
    const resultAddress = result.address || {};
    
    // Exact match for city/province gets highest score
    if (inputCity && resultAddress.city && 
        normalizeAddress(resultAddress.city) === normalizeAddress(inputCity)) {
      score += 50;
    } else if (inputCity && resultAddress.county &&
               normalizeAddress(resultAddress.county) === normalizeAddress(inputCity)) {
      score += 40;
    } else if (inputCity) {
      // Fuzzy match
      const citySimilarity = calculateSimilarity(resultAddress.city || resultAddress.county || '', inputCity);
      score += citySimilarity * 30;
    }
    
    if (inputProvince && resultAddress.state &&
        normalizeAddress(resultAddress.state) === normalizeAddress(inputProvince)) {
      score += 30;
    } else if (inputProvince) {
      const provinceSimilarity = calculateSimilarity(resultAddress.state || '', inputProvince);
      score += provinceSimilarity * 20;
    }
    
    // Bonus for complete address
    if (resultAddress.road) score += 10;
    if (resultAddress.village || resultAddress.suburb) score += 5;
    if (result.importance) score += result.importance * 10;
    
    return score;
  };

  /**
   * Enhanced geocoding with aggressive multi-level fallback strategy
   * Designed to handle incomplete address data in Indonesia
   */
  const searchWithFallback = async (queries) => {
    for (let i = 0; i < queries.length; i++) {
      const query = queries[i];
      console.log(`🔍 Level ${i + 1} search:`, query);
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}` +
          `&format=json` +
          `&limit=10` + // Increased to 10 for better ranking
          `&addressdetails=1` +
          `&countrycodes=id`, // Restrict to Indonesia
          {
            headers: {
              'Accept': 'application/json',
              'Accept-Language': 'id,en;q=0.9',
              'User-Agent': 'NusantaraConstructionApp/1.0 (Contact: admin@nusantaragroup.co)'
            }
          }
        );

        // Check for rate limiting or server errors
        if (response.status === 503) {
          console.warn(`⚠️ Nominatim rate limited (503), waiting longer...`);
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3s
          continue; // Skip to next query
        }

        if (response.status === 429) {
          console.warn(`⚠️ Too many requests (429), waiting...`);
          await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s
          continue;
        }

        if (!response.ok) {
          console.warn(`⚠️ HTTP ${response.status}: ${response.statusText}`);
          continue; // Try next query level
        }

        // Safely parse JSON
        let data;
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error(`❌ Invalid JSON response (possibly HTML error page):`, jsonError.message);
          console.log(`Response status: ${response.status}, Content-Type: ${response.headers.get('content-type')}`);
          continue; // Try next query level
        }
        
        if (data && data.length > 0) {
          // Score and rank results
          const scoredResults = data.map(result => ({
            ...result,
            score: scoreResult(result, city, province)
          }));
          
          // Sort by score (highest first)
          scoredResults.sort((a, b) => b.score - a.score);
          
          console.log('📊 Scored results:', scoredResults.map(r => ({
            name: r.display_name.substring(0, 60) + '...',
            score: r.score.toFixed(2),
            type: r.type,
            importance: r.importance
          })));
          
          // LOWERED THRESHOLD - Accept results with score > 10 (was 20)
          // This is more forgiving for areas not well-mapped
          if (scoredResults[0].score > 10) {
            return {
              success: true,
              result: scoredResults[0],
              level: i + 1,
              totalResults: data.length,
              allResults: scoredResults.slice(0, 3) // Top 3 for debugging
            };
          } else {
            console.log(`⚠️ Best score (${scoredResults[0].score.toFixed(2)}) below threshold (10), trying next level...`);
          }
        } else {
          console.log(`⚠️ No results found at level ${i + 1}`);
        }
        
        // Add delay between requests to respect rate limiting
        if (i < queries.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1200)); // 1.2s to be safe
        }
      } catch (error) {
        console.error(`Level ${i + 1} search error:`, error);
        continue;
      }
    }
    
    return { success: false };
  };

  /**
   * Main search function with enhanced fuzzy matching
   * AGGRESSIVE FALLBACK STRATEGY for Indonesia addresses
   */
  const handleSearchByAddress = async () => {
    // Must have at least city or village
    if (!city && !village && !district) {
      alert('Mohon isi minimal Kecamatan, Desa/Kelurahan, atau Kabupaten/Kota terlebih dahulu');
      return;
    }

    setSearchingAddress(true);
    
    try {
      // Normalize all inputs
      const normAddress = normalizeAddress(address);
      const normVillage = normalizeAddress(village);
      const normDistrict = normalizeAddress(district);
      const normCity = normalizeAddress(city);
      const normProvince = normalizeAddress(province);
      
      // Build AGGRESSIVE fallback queries with many variations
      const queries = [];
      
      // LEVEL 1: Full address (most specific)
      if (normAddress || normVillage) {
        const parts = [];
        if (normAddress) parts.push(normAddress);
        if (normVillage) parts.push(normVillage);
        if (normDistrict) parts.push(normDistrict);
        if (normCity) parts.push(normCity);
        if (normProvince) parts.push(normProvince);
        parts.push('indonesia');
        queries.push(parts.join(', '));
      }
      
      // LEVEL 2: Without street name (village + district + city + province)
      if (normVillage && (normDistrict || normCity)) {
        const parts = [];
        if (normVillage) parts.push(normVillage);
        if (normDistrict) parts.push(normDistrict);
        if (normCity) parts.push(normCity);
        if (normProvince) parts.push(normProvince);
        parts.push('indonesia');
        queries.push(parts.join(', '));
      }
      
      // LEVEL 3: Without street AND village (district + city + province)
      // Useful when village name is not in database
      if (normDistrict && normCity) {
        const parts = [];
        if (normDistrict) parts.push(normDistrict);
        if (normCity) parts.push(normCity);
        if (normProvince) parts.push(normProvince);
        parts.push('indonesia');
        queries.push(parts.join(', '));
      }
      
      // LEVEL 4: City + Province only
      if (normCity) {
        const parts = [];
        if (normCity) parts.push(normCity);
        if (normProvince) parts.push(normProvince);
        parts.push('indonesia');
        queries.push(parts.join(', '));
      }
      
      // LEVEL 5: City with common variations
      // Try different city name formats
      if (normCity) {
        // Remove common prefixes
        const cityVariations = [
          normCity.replace(/^kabupaten\s+/i, '').replace(/^kota\s+/i, ''),
          normCity.replace(/^kab\.\s+/i, '').replace(/^kab\s+/i, ''),
        ];
        
        for (const cityVar of cityVariations) {
          if (cityVar !== normCity && cityVar.length > 3) {
            queries.push(`${cityVar}, ${normProvince || ''}, indonesia`.replace(', ,', ','));
          }
        }
      }
      
      // LEVEL 6: District only (if village search failed)
      if (normDistrict && normProvince) {
        queries.push(`${normDistrict}, ${normProvince}, indonesia`);
      }
      
      // LEVEL 7: Province only (last resort)
      if (normProvince) {
        queries.push(`${normProvince}, indonesia`);
      }
      
      // Remove duplicates
      const uniqueQueries = [...new Set(queries)];
      
      console.log(`🔍 Starting search with ${uniqueQueries.length} fallback queries:`, uniqueQueries);
      
      // Execute search with fallback
      const searchResult = await searchWithFallback(uniqueQueries);
      
      if (searchResult.success) {
        const result = searchResult.result;
        const latitude = parseFloat(result.lat);
        const longitude = parseFloat(result.lon);
        const newPos = [latitude, longitude];
        
        // Determine confidence level based on score
        let confidenceLevel = 'low';
        let confidenceMessage = '';
        let zoomLevel = 12;
        
        if (result.score > 50) {
          confidenceLevel = 'high';
          confidenceMessage = '✅ Lokasi ditemukan dengan akurat';
          zoomLevel = 16;
        } else if (result.score > 25) {
          confidenceLevel = 'medium';
          confidenceMessage = '⚠️ Lokasi ditemukan (perkiraan area)';
          zoomLevel = 14;
        } else {
          confidenceLevel = 'low';
          confidenceMessage = '⚠️ Lokasi ditemukan (perkiraan luas)';
          zoomLevel = 12;
        }
        
        console.log('✅ Location found:', {
          level: searchResult.level,
          display_name: result.display_name,
          lat: latitude,
          lon: longitude,
          score: result.score.toFixed(2),
          confidence: confidenceLevel,
          type: result.type,
          importance: result.importance
        });
        
        // Update state
        setCenter(newPos);
        setMarker(newPos);
        setZoom(zoomLevel);
        onCoordinatesChange({ latitude, longitude });
        setSearchingAddress(false);
        
        // Show detailed feedback to user
        const locationInfo = result.display_name.length > 100 
          ? result.display_name.substring(0, 97) + '...'
          : result.display_name;
        
        const detailMessage = 
          `${confidenceMessage}\n\n` +
          `📍 ${locationInfo}\n\n` +
          `Tingkat Pencarian: Level ${searchResult.level} dari ${uniqueQueries.length}\n` +
          `Skor Kecocokan: ${result.score.toFixed(0)}/100\n\n` +
          `${confidenceLevel === 'high' 
            ? '✓ Silakan klik peta untuk fine-tuning posisi yang lebih tepat.' 
            : confidenceLevel === 'medium'
            ? '⚠ Mohon cek visual di peta dan sesuaikan posisi jika perlu.'
            : '⚠ Ini perkiraan area luas. Harap zoom in dan pilih lokasi tepat di peta.'}`;
        
        // Use setTimeout to allow map to update first
        setTimeout(() => {
          alert(detailMessage);
        }, 500);
        
      } else {
        setSearchingAddress(false);
        
        // More helpful error message with suggestions
        const addressSummary = [normVillage, normDistrict, normCity, normProvince]
          .filter(Boolean)
          .join(', ');
        
        alert(
          `❌ Lokasi tidak ditemukan setelah ${uniqueQueries.length} percobaan pencarian.\n\n` +
          `Alamat yang dicari:\n"${addressSummary}"\n\n` +
          `Kemungkinan penyebab:\n` +
          `• Nama desa/kelurahan tidak ada dalam database peta OpenStreetMap\n` +
          `• Ejaan nama lokasi berbeda dengan database\n` +
          `• Area terlalu baru (belum di-mapping)\n\n` +
          `Solusi:\n` +
          `1. Coba ubah "Kabupaten Karawang" menjadi "Karawang" saja\n` +
          `2. Periksa ejaan kecamatan dan desa\n` +
          `3. Gunakan nama yang lebih umum/dikenal\n` +
          `4. Atau pilih lokasi manual di peta (scroll & zoom, lalu klik)\n\n` +
          `Catatan: Database peta mungkin tidak lengkap untuk semua desa di Indonesia.\n` +
          `Pencarian manual di peta tetap sangat akurat!`
        );
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setSearchingAddress(false);
      
      // Check if it's a rate limiting issue
      const isRateLimitError = error.message.includes('503') || 
                               error.message.includes('429') ||
                               error.message.includes('rate limit') ||
                               error.message.includes('too many');
      
      if (isRateLimitError) {
        alert(
          `⚠️ Server peta sedang sibuk (terlalu banyak permintaan).\n\n` +
          `Silakan:\n` +
          `1. Tunggu 30 detik, lalu coba lagi\n` +
          `2. Atau pilih lokasi manual dengan klik di peta\n\n` +
          `Tips: Pencarian manual di peta tetap sangat akurat!`
        );
      } else {
        alert(
          `❌ Gagal mencari lokasi karena error teknis.\n\n` +
          `Error: ${error.message}\n\n` +
          `Silakan:\n` +
          `• Coba lagi dalam beberapa saat\n` +
          `• Atau pilih lokasi manual di peta (klik pada peta)`
        );
      }
    }
  };

  // REMOVED: Auto-search was causing unwanted coordinate changes
  // User must explicitly click "Cari Lokasi dari Alamat" button to trigger search
  
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
          <span className="info-icon">ℹ️</span>
          <span className="info-text">
            {(address || city || province) 
              ? 'Klik "Cari Lokasi dari Alamat" untuk auto-detect berdasarkan alamat yang diisi'
              : 'Isi alamat/kota/provinsi di atas untuk auto-detect lokasi'}
          </span>
        </div>
        <div className="info-item">
          <span className="info-icon">📍</span>
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
