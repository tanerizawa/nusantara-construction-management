import React, { useState } from 'react';
import './ManualLocationInput.css';

/**
 * ManualLocationInput Component
 * Fallback for manual location entry when GPS is not available
 * 
 * @param {Object} props
 * @param {Function} props.onSubmit - Callback with { latitude, longitude, accuracy }
 * @param {Function} props.onCancel - Cancel callback
 * @param {string} props.projectName - Project name for context
 */
const ManualLocationInput = ({ onSubmit, onCancel, projectName }) => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [errors, setErrors] = useState({});

  const validateCoordinates = () => {
    const newErrors = {};
    
    // Validate latitude (-90 to 90)
    const lat = parseFloat(latitude);
    if (isNaN(lat)) {
      newErrors.latitude = 'Please enter a valid number';
    } else if (lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }
    
    // Validate longitude (-180 to 180)
    const lon = parseFloat(longitude);
    if (isNaN(lon)) {
      newErrors.longitude = 'Please enter a valid number';
    } else if (lon < -180 || lon > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateCoordinates()) {
      return;
    }
    
    const position = {
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      accuracy: 1000, // Manual entry has low accuracy
      manual: true
    };
    
    if (onSubmit) {
      onSubmit(position);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          alert(`GPS Error: ${error.message}`);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  // Example coordinates for Indonesia (Jakarta)
  const handleUseExample = () => {
    setLatitude('-6.2088');
    setLongitude('106.8456');
  };

  return (
    <div className="manual-location-overlay">
      <div className="manual-location-content">
        <div className="manual-location-header">
          <div className="location-icon">📍</div>
          <h2>GPS Not Available</h2>
          <p>Please enter your location manually</p>
          {projectName && (
            <div className="project-context">
              <small>For project: {projectName}</small>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="manual-location-form">
          <div className="form-group">
            <label htmlFor="latitude">Latitude</label>
            <input
              type="text"
              id="latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-6.2088"
              className={errors.latitude ? 'error' : ''}
            />
            {errors.latitude && (
              <span className="error-message">{errors.latitude}</span>
            )}
            <small className="hint">Range: -90 to 90</small>
          </div>

          <div className="form-group">
            <label htmlFor="longitude">Longitude</label>
            <input
              type="text"
              id="longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="106.8456"
              className={errors.longitude ? 'error' : ''}
            />
            {errors.longitude && (
              <span className="error-message">{errors.longitude}</span>
            )}
            <small className="hint">Range: -180 to 180</small>
          </div>

          <div className="helper-buttons">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              className="btn-helper"
            >
              📍 Try GPS Again
            </button>
            
            <button
              type="button"
              onClick={handleUseExample}
              className="btn-helper"
            >
              💡 Use Example
            </button>
          </div>

          <div className="info-box">
            <strong>How to find coordinates:</strong>
            <ol>
              <li>Open Google Maps on your phone</li>
              <li>Long press on your location</li>
              <li>Copy the coordinates shown</li>
              <li>Paste them here</li>
            </ol>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">
              ✓ Use This Location
            </button>
            
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="warning-box">
          ⚠️ <strong>Note:</strong> Manual location entry has lower accuracy and may not be accepted for attendance verification at some project sites.
        </div>
      </div>
    </div>
  );
};

export default ManualLocationInput;
