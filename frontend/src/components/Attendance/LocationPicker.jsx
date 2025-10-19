import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

/**
 * Component to recenter map when position changes
 */
const RecenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo([position.latitude, position.longitude], 16, {
        duration: 1
      });
    }
  }, [position, map]);

  return null;
};

/**
 * LocationPicker Component
 * Interactive map for selecting/viewing project locations
 * 
 * @param {Object} props
 * @param {Object} props.currentPosition - Current GPS position { latitude, longitude }
 * @param {Object} props.projectLocation - Project location { latitude, longitude, radius_meters, name }
 * @param {Function} props.onLocationSelect - Callback when location is selected
 * @param {boolean} props.interactive - Allow location selection
 * @param {string} props.mode - 'view' or 'select'
 * @param {boolean} props.showRadius - Show radius circle
 * @param {boolean} props.showDistance - Show distance to project
 * @param {number} props.height - Map height in pixels
 */
const LocationPicker = ({
  currentPosition = null,
  projectLocation = null,
  onLocationSelect = null,
  interactive = false,
  mode = 'view',
  showRadius = true,
  showDistance = true,
  height = 400
}) => {
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [distance, setDistance] = useState(null);
  const mapRef = useRef(null);

  // Default center (Jakarta)
  const defaultCenter = { latitude: -6.2088, longitude: 106.8456 };
  
  // Determine map center
  const getMapCenter = () => {
    if (currentPosition) return currentPosition;
    if (projectLocation) return projectLocation;
    return defaultCenter;
  };

  const center = getMapCenter();

  // Calculate distance using Haversine formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  // Calculate distance when positions change
  useEffect(() => {
    if (currentPosition && projectLocation) {
      const dist = calculateDistance(
        currentPosition.latitude,
        currentPosition.longitude,
        projectLocation.latitude,
        projectLocation.longitude
      );
      setDistance(dist);
    }
  }, [currentPosition, projectLocation]);

  // Handle map click for location selection
  const handleMapClick = (e) => {
    if (!interactive && mode !== 'select') return;

    const newPosition = {
      latitude: e.latlng.lat,
      longitude: e.latlng.lng
    };

    setSelectedPosition(newPosition);

    if (onLocationSelect) {
      onLocationSelect(newPosition);
    }
  };

  // Custom icon for current position
  const currentPositionIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <circle cx="12" cy="12" r="10" fill="#3b82f6" stroke="white" stroke-width="2"/>
        <circle cx="12" cy="12" r="4" fill="white"/>
      </svg>
    `),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16]
  });

  // Custom icon for project location
  const projectLocationIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
              fill="#ef4444" stroke="white" stroke-width="1"/>
      </svg>
    `),
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40]
  });

  // Format distance for display
  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters.toFixed(1)} m`;
    } else {
      return `${(meters / 1000).toFixed(2)} km`;
    }
  };

  // Check if within radius
  const isWithinRadius = () => {
    if (!distance || !projectLocation?.radius_meters) return null;
    return distance <= projectLocation.radius_meters;
  };

  const withinRadius = isWithinRadius();

  return (
    <div className="location-picker-container">
      {/* Distance info banner */}
      {showDistance && distance !== null && projectLocation && (
        <div className={`distance-banner ${withinRadius ? 'within' : 'outside'}`}>
          <div className="distance-info">
            <span className="distance-icon">
              {withinRadius ? '✅' : '❌'}
            </span>
            <div className="distance-text">
              <span className="distance-label">Distance to project:</span>
              <span className="distance-value">{formatDistance(distance)}</span>
            </div>
            {projectLocation.radius_meters && (
              <span className="radius-info">
                (Allowed radius: {projectLocation.radius_meters}m)
              </span>
            )}
          </div>
          {withinRadius !== null && (
            <div className="status-badge">
              {withinRadius ? 'Within Range' : 'Out of Range'}
            </div>
          )}
        </div>
      )}

      {/* Map container */}
      <div className="map-wrapper" style={{ height: `${height}px` }}>
        <MapContainer
          center={[center.latitude, center.longitude]}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
          onClick={handleMapClick}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <RecenterMap position={currentPosition || projectLocation} />

          {/* Current position marker */}
          {currentPosition && (
            <Marker
              position={[currentPosition.latitude, currentPosition.longitude]}
              icon={currentPositionIcon}
            >
              <Popup>
                <div className="popup-content">
                  <h4>📍 Your Location</h4>
                  <p>Lat: {currentPosition.latitude.toFixed(6)}</p>
                  <p>Lon: {currentPosition.longitude.toFixed(6)}</p>
                  {currentPosition.accuracy && (
                    <p className="accuracy">
                      Accuracy: ±{currentPosition.accuracy.toFixed(1)}m
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )}

          {/* Project location marker */}
          {projectLocation && (
            <>
              <Marker
                position={[projectLocation.latitude, projectLocation.longitude]}
                icon={projectLocationIcon}
              >
                <Popup>
                  <div className="popup-content">
                    <h4>🏗️ {projectLocation.name || 'Project Location'}</h4>
                    <p>Lat: {projectLocation.latitude.toFixed(6)}</p>
                    <p>Lon: {projectLocation.longitude.toFixed(6)}</p>
                    {projectLocation.radius_meters && (
                      <p className="radius">
                        Radius: {projectLocation.radius_meters}m
                      </p>
                    )}
                    {projectLocation.address && (
                      <p className="address">{projectLocation.address}</p>
                    )}
                  </div>
                </Popup>
              </Marker>

              {/* Radius circle */}
              {showRadius && projectLocation.radius_meters && (
                <Circle
                  center={[projectLocation.latitude, projectLocation.longitude]}
                  radius={projectLocation.radius_meters}
                  pathOptions={{
                    color: withinRadius ? '#10b981' : '#ef4444',
                    fillColor: withinRadius ? '#10b981' : '#ef4444',
                    fillOpacity: 0.1,
                    weight: 2
                  }}
                />
              )}
            </>
          )}

          {/* Selected position marker (for select mode) */}
          {selectedPosition && mode === 'select' && (
            <Marker
              position={[selectedPosition.latitude, selectedPosition.longitude]}
            >
              <Popup>
                <div className="popup-content">
                  <h4>📍 Selected Location</h4>
                  <p>Lat: {selectedPosition.latitude.toFixed(6)}</p>
                  <p>Lon: {selectedPosition.longitude.toFixed(6)}</p>
                </div>
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* Instructions */}
      {interactive && mode === 'select' && (
        <div className="map-instructions">
          <span className="instruction-icon">💡</span>
          <span>Click on the map to select a location</span>
        </div>
      )}

      {/* Legend */}
      <div className="map-legend">
        {currentPosition && (
          <div className="legend-item">
            <span className="legend-marker current"></span>
            <span>Your Location</span>
          </div>
        )}
        {projectLocation && (
          <div className="legend-item">
            <span className="legend-marker project"></span>
            <span>Project Location</span>
          </div>
        )}
        {showRadius && projectLocation?.radius_meters && (
          <div className="legend-item">
            <span className="legend-marker radius"></span>
            <span>Allowed Radius ({projectLocation.radius_meters}m)</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPicker;
