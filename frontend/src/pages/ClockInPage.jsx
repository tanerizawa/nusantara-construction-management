import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CameraCapture from '../components/Attendance/CameraCapture';
import LocationPicker from '../components/Attendance/LocationPicker';
import GPSIndicator from '../components/Attendance/GPSIndicator';
import useGeolocation from '../hooks/useGeolocation';
import { compressDataUrl } from '../utils/imageCompression';
import { optimizeImageSettings } from '../utils/performanceOptimization';
import ErrorBoundary from '../components/ErrorBoundary';
import './ClockInPage.css';

/**
 * ClockInPage Component
 * 
 * Multi-step clock in flow:
 * Step 1: Camera - Take selfie photo
 * Step 2: GPS - Get current location
 * Step 3: Verify - Check location on map
 * Step 4: Confirm - Review all data
 * Step 5: Submit - Send to backend
 * Step 6: Success - Show confirmation
 */
const ClockInPage = () => {
  const navigate = useNavigate();
  const { position, error: gpsError, getCurrentPosition, isWithinRadius } = useGeolocation();

  // State
  const [currentStep, setCurrentStep] = useState(1);
  const [photo, setPhoto] = useState(null);
  const [photoBlob, setPhotoBlob] = useState(null);
  const [photoMetadata, setPhotoMetadata] = useState(null);
  const [gpsPosition, setGpsPosition] = useState(null);
  const [projectLocation, setProjectLocation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState('');

  // Get token
  const getToken = () => localStorage.getItem('token');

  // Fetch project location from backend
  useEffect(() => {
    const fetchProjectLocation = async () => {
      try {
        const token = getToken();
        if (!token) {
          throw new Error('Authentication required');
        }

        // Get user's current project location
        // This should be from user's assigned project
        const response = await fetch('/api/attendance/settings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch project location');
        }

        const data = await response.json();
        setProjectLocation(data.data);
      } catch (err) {
        console.error('Error fetching project location:', err);
        setError('Failed to load project location. Please try again.');
      }
    };

    fetchProjectLocation();
  }, []);

  // Step 1: Handle photo capture
  const handlePhotoCapture = async (photoData) => {
    try {
      setError(null);
      
      // Store original photo
      setPhoto(photoData.dataUrl);
      setPhotoMetadata({
        width: photoData.width,
        height: photoData.height,
        timestamp: photoData.timestamp,
        originalSize: photoData.blob.size
      });

      // Optimize and compress photo
      const settings = await optimizeImageSettings({
        maxWidth: 1920,
        quality: 0.85
      });

      const compressed = await compressDataUrl(photoData.dataUrl, {
        ...settings,
        onProgress: (percent) => {
          console.log('Compression progress:', percent, '%');
        }
      });

      // Convert compressed dataUrl to Blob
      const response = await fetch(compressed.compressedDataUrl);
      const blob = await response.blob();
      setPhotoBlob(blob);

      console.log('Photo compressed:', {
        original: (photoData.blob.size / 1024 / 1024).toFixed(2) + ' MB',
        compressed: (blob.size / 1024 / 1024).toFixed(2) + ' MB',
        ratio: compressed.compressionRatio + '%'
      });

      // Move to GPS step
      setCurrentStep(2);
    } catch (err) {
      console.error('Error processing photo:', err);
      setError('Failed to process photo. Please try again.');
    }
  };

  // Step 2: Handle GPS acquisition
  const handleGetGPS = async () => {
    try {
      setError(null);
      await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      });
    } catch (err) {
      console.error('GPS error:', err);
      setError('Failed to get GPS location. Please enable location services and try again.');
    }
  };

  // Auto-progress when GPS acquired
  useEffect(() => {
    if (currentStep === 2 && position && !gpsError) {
      setGpsPosition(position);
      setCurrentStep(3);
    }
  }, [currentStep, position, gpsError]);

  // Step 3: Verify location
  const handleVerifyLocation = () => {
    if (!projectLocation) {
      setError('Project location not available');
      return;
    }

    // Check if within radius
    const result = isWithinRadius(
      projectLocation.latitude,
      projectLocation.longitude,
      projectLocation.radius_meters
    );

    if (!result.isValid) {
      setError(
        `You are too far from the project location! ` +
        `Distance: ${result.distance.toFixed(0)}m ` +
        `(Maximum: ${projectLocation.radius_meters}m)`
      );
      return;
    }

    // Location verified, move to confirmation
    setCurrentStep(4);
  };

  // Step 4: Handle submission
  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('Authentication required');
      }

      // Prepare form data
      const formData = new FormData();
      formData.append('photo', photoBlob, 'attendance.jpg');
      formData.append('latitude', gpsPosition.latitude);
      formData.append('longitude', gpsPosition.longitude);
      formData.append('accuracy', gpsPosition.accuracy);
      if (notes) {
        formData.append('notes', notes);
      }

      // Submit to backend
      const response = await fetch('/api/attendance/clock-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to clock in');
      }

      const data = await response.json();
      console.log('Clock in success:', data);

      // Navigate to success page
      navigate('/attendance/success', {
        state: {
          type: 'clock-in',
          data: data.data,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Clock in error:', err);
      setError(err.message || 'Failed to clock in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    } else {
      navigate('/attendance');
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel clock in?')) {
      navigate('/attendance');
    }
  };

  // Render step indicator
  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
        <div className="step-number">1</div>
        <div className="step-label">Photo</div>
      </div>
      <div className={`step-line ${currentStep > 1 ? 'active' : ''}`}></div>
      <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
        <div className="step-number">2</div>
        <div className="step-label">GPS</div>
      </div>
      <div className={`step-line ${currentStep > 2 ? 'active' : ''}`}></div>
      <div className={`step ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
        <div className="step-number">3</div>
        <div className="step-label">Verify</div>
      </div>
      <div className={`step-line ${currentStep > 3 ? 'active' : ''}`}></div>
      <div className={`step ${currentStep >= 4 ? 'active' : ''}`}>
        <div className="step-number">4</div>
        <div className="step-label">Confirm</div>
      </div>
    </div>
  );

  return (
    <ErrorBoundary message="Failed to load clock in page">
      <div className="clock-in-page">
        {/* Header */}
        <div className="clock-in-header">
          <button className="back-btn" onClick={handleBack}>
            ← Back
          </button>
          <h1>Clock In</h1>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Error Alert */}
        {error && (
          <div className="error-alert">
            <div className="alert-icon">⚠️</div>
            <div className="alert-content">
              <strong>Error</strong>
              <p>{error}</p>
            </div>
            <button className="alert-close" onClick={() => setError(null)}>×</button>
          </div>
        )}

        {/* Step Content */}
        <div className="step-content">
          {/* Step 1: Camera */}
          {currentStep === 1 && (
            <div className="step-camera">
              <div className="step-info">
                <h2>📸 Take Your Photo</h2>
                <p>Please take a clear selfie for attendance verification</p>
              </div>
              <CameraCapture
                onCapture={handlePhotoCapture}
                onClose={handleCancel}
                autoStart={true}
                facingMode="user"
              />
            </div>
          )}

          {/* Step 2: GPS */}
          {currentStep === 2 && (
            <div className="step-gps">
              <div className="step-info">
                <h2>📍 Getting Your Location</h2>
                <p>Please wait while we acquire your GPS location...</p>
              </div>
              <div className="gps-content">
                <GPSIndicator
                  position={position}
                  error={gpsError}
                  size="large"
                  showDetails={true}
                />
                {!position && !gpsError && (
                  <button className="retry-btn" onClick={handleGetGPS}>
                    Get GPS Location
                  </button>
                )}
                {gpsError && (
                  <button className="retry-btn" onClick={handleGetGPS}>
                    Retry GPS
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Verify Location */}
          {currentStep === 3 && (
            <div className="step-verify">
              <div className="step-info">
                <h2>🗺️ Verify Your Location</h2>
                <p>Make sure you're within the project area</p>
              </div>
              <div className="map-container">
                {projectLocation && gpsPosition && (
                  <LocationPicker
                    currentPosition={gpsPosition}
                    projectLocation={projectLocation}
                    showRadius={true}
                    showDistance={true}
                    height={400}
                    mode="view"
                  />
                )}
              </div>
              <button 
                className="verify-btn"
                onClick={handleVerifyLocation}
              >
                Verify Location →
              </button>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {currentStep === 4 && (
            <div className="step-confirm">
              <div className="step-info">
                <h2>✓ Review Your Information</h2>
                <p>Please review before submitting</p>
              </div>
              
              <div className="confirmation-content">
                {/* Photo Preview */}
                <div className="confirm-section">
                  <h3>📸 Your Photo</h3>
                  <img src={photo} alt="Attendance" className="photo-preview" />
                  <p className="photo-meta">
                    Size: {(photoBlob.size / 1024).toFixed(0)} KB
                    {photoMetadata && ` | ${photoMetadata.width}x${photoMetadata.height}`}
                  </p>
                </div>

                {/* Location Info */}
                <div className="confirm-section">
                  <h3>📍 Location</h3>
                  <div className="location-info">
                    <p><strong>Latitude:</strong> {gpsPosition.latitude.toFixed(6)}</p>
                    <p><strong>Longitude:</strong> {gpsPosition.longitude.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> ±{gpsPosition.accuracy}m</p>
                    {projectLocation && (
                      <>
                        <p><strong>Project:</strong> {projectLocation.name}</p>
                        <p className="location-verified">✓ Location Verified</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Time Info */}
                <div className="confirm-section">
                  <h3>🕐 Time</h3>
                  <p className="clock-in-time">
                    {new Date().toLocaleString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                {/* Optional Notes */}
                <div className="confirm-section">
                  <h3>📝 Notes (Optional)</h3>
                  <textarea
                    className="notes-input"
                    placeholder="Add any notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>

                {/* Submit Button */}
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="spinner"></div>
                      Submitting...
                    </>
                  ) : (
                    'Confirm Clock In →'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ClockInPage;
