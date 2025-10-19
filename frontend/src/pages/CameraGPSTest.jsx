import React, { useState } from 'react';
import CameraCapture from '../components/Attendance/CameraCapture';
import LocationPicker from '../components/Attendance/LocationPicker';
import GPSIndicator from '../components/Attendance/GPSIndicator';
import useGeolocation from '../hooks/useGeolocation';
import { compressDataUrl, formatFileSize } from '../utils/imageCompression';
import './CameraGPSTest.css';

/**
 * Test page for Camera and GPS features
 * For development and testing only
 */
const CameraGPSTest = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [photoInfo, setPhotoInfo] = useState(null);
  const [compressedPhoto, setCompressedPhoto] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const {
    position,
    error: gpsError,
    isLoading: gpsLoading,
    accuracy,
    getCurrentPosition,
    startWatching,
    stopWatching,
    isWithinRadius,
    getAccuracyStatus,
    calculateDistance,
    getDistanceToTarget,
  } = useGeolocation();

  // Test project location (Jakarta City Center for testing)
  const testProjectLocation = {
    name: 'Jakarta City Center',
    latitude: -6.2088,
    longitude: 106.8456,
    radius_meters: 100
  };

  const handlePhotoCapture = async (photoData) => {
    console.log('📸 Photo captured:', photoData);
    setCapturedPhoto(photoData.dataUrl);
    setPhotoInfo({
      width: photoData.width,
      height: photoData.height,
      size: Math.round(photoData.blob.size / 1024), // KB
      timestamp: new Date(photoData.timestamp).toLocaleString()
    });
    setShowCamera(false);
    
    // Auto-compress photo
    setIsCompressing(true);
    try {
      const compressed = await compressDataUrl(photoData.dataUrl, {
        maxWidth: 1280,
        maxHeight: 1280,
        quality: 0.85,
        maxSizeMB: 1
      });
      setCompressedPhoto(compressed);
      console.log('✅ Photo compressed:', compressed);
    } catch (error) {
      console.error('❌ Compression error:', error);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleGetGPS = async () => {
    try {
      await getCurrentPosition();
    } catch (err) {
      console.error('GPS Error:', err);
    }
  };

  const handleStartWatching = () => {
    startWatching();
  };

  const handleStopWatching = () => {
    stopWatching();
  };

  const checkProjectDistance = () => {
    if (!position) {
      alert('Get GPS location first!');
      return;
    }

    const result = isWithinRadius(
      testProjectLocation.latitude,
      testProjectLocation.longitude,
      testProjectLocation.radius_meters
    );

    const distance = calculateDistance(
      position.latitude,
      position.longitude,
      testProjectLocation.latitude,
      testProjectLocation.longitude
    );

    alert(
      `Project: ${testProjectLocation.name}\n` +
      `Distance: ${distance.toFixed(1)} meters\n` +
      `Within ${testProjectLocation.radius_meters}m radius: ${result.isValid ? '✅ YES' : '❌ NO'}\n` +
      `Status: ${result.isValid ? 'Valid for clock-in' : 'Too far from project site'}`
    );
  };

  const accuracyStatus = getAccuracyStatus();

  return (
    <div className="camera-gps-test">
      <div className="test-container">
        <h1>📷 Camera & GPS Test Page</h1>
        <p className="subtitle">Development testing for PWA features</p>

        {/* Camera Section */}
        <div className="test-section">
          <h2>📸 Camera Test</h2>
          <div className="test-card">
            <button 
              onClick={() => setShowCamera(true)}
              className="btn-primary"
            >
              Open Camera
            </button>

            {capturedPhoto && (
              <div className="photo-preview">
                <h3>Captured Photo:</h3>
                <img src={capturedPhoto} alt="Captured" />
                {photoInfo && (
                  <div className="photo-info">
                    <p><strong>Resolution:</strong> {photoInfo.width} x {photoInfo.height}px</p>
                    <p><strong>Original Size:</strong> {photoInfo.size} KB</p>
                    <p><strong>Timestamp:</strong> {photoInfo.timestamp}</p>
                  </div>
                )}
                
                {isCompressing && (
                  <div className="compressing-banner">
                    <div className="spinner"></div>
                    <span>Compressing photo...</span>
                  </div>
                )}
                
                {compressedPhoto && !isCompressing && (
                  <div className="compressed-info">
                    <h4>✅ Compressed:</h4>
                    <p><strong>Compressed Size:</strong> {compressedPhoto.sizeMB} MB ({formatFileSize(compressedPhoto.size)})</p>
                    <p><strong>Reduction:</strong> {((1 - compressedPhoto.size / (photoInfo.size * 1024)) * 100).toFixed(1)}%</p>
                    <img src={compressedPhoto.dataUrl} alt="Compressed" style={{ maxWidth: '200px', marginTop: '0.5rem' }} />
                  </div>
                )}
                
                <button 
                  onClick={() => {
                    setCapturedPhoto(null);
                    setPhotoInfo(null);
                  }}
                  className="btn-secondary"
                >
                  Clear Photo
                </button>
              </div>
            )}
          </div>
        </div>

        {/* GPS Section */}
        <div className="test-section">
          <h2>📍 GPS Test</h2>
          <div className="test-card">
            {/* GPS Indicator Component */}
            <GPSIndicator
              position={position}
              accuracy={accuracy}
              isLoading={gpsLoading}
              error={gpsError}
              size="medium"
              showDetails={true}
            />
            
            <div className="gps-controls">
              <button 
                onClick={handleGetGPS}
                disabled={gpsLoading}
                className="btn-primary"
              >
                {gpsLoading ? 'Getting Location...' : 'Get GPS Once'}
              </button>
              <button 
                onClick={handleStartWatching}
                className="btn-primary"
              >
                Start Watching
              </button>
              <button 
                onClick={handleStopWatching}
                className="btn-secondary"
              >
                Stop Watching
              </button>
            </div>

            {gpsError && (
              <div className="error-message">
                ❌ {gpsError.message}
              </div>
            )}

            {position && (
              <div className="gps-info">
                <h3>Current Position:</h3>
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">Latitude:</span>
                    <span className="value">{position.latitude.toFixed(6)}°</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Longitude:</span>
                    <span className="value">{position.longitude.toFixed(6)}°</span>
                  </div>
                  <div className="info-item">
                    <span className="label">Accuracy:</span>
                    <span className="value">
                      {accuracy?.toFixed(1)} meters
                      {accuracyStatus && (
                        <span 
                          className={`accuracy-badge ${accuracyStatus.level}`}
                        >
                          {accuracyStatus.text}
                        </span>
                      )}
                    </span>
                  </div>
                  {position.altitude && (
                    <div className="info-item">
                      <span className="label">Altitude:</span>
                      <span className="value">{position.altitude.toFixed(1)} m</span>
                    </div>
                  )}
                  {position.speed !== null && (
                    <div className="info-item">
                      <span className="label">Speed:</span>
                      <span className="value">
                        {(position.speed * 3.6).toFixed(1)} km/h
                      </span>
                    </div>
                  )}
                  <div className="info-item">
                    <span className="label">Timestamp:</span>
                    <span className="value">
                      {new Date(position.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>

                <div className="distance-test">
                  <h3>Distance Verification:</h3>
                  <div className="project-info">
                    <p><strong>Test Project:</strong> {testProjectLocation.name}</p>
                    <p><strong>Location:</strong> {testProjectLocation.latitude}, {testProjectLocation.longitude}</p>
                    <p><strong>Radius:</strong> {testProjectLocation.radius_meters} meters</p>
                  </div>
                  <button 
                    onClick={checkProjectDistance}
                    className="btn-primary"
                  >
                    Check Distance to Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LocationPicker Section */}
        <div className="test-section">
          <h2>🗺️ Location Map Test</h2>
          <div className="test-card">
            <p>Interactive map showing your location and project area</p>
            
            <LocationPicker
              currentPosition={position}
              projectLocation={testProjectLocation}
              showRadius={true}
              showDistance={true}
              height={400}
              mode="view"
            />
            
            {!position && (
              <p className="hint" style={{ marginTop: '1rem' }}>
                👆 Get GPS location first to see your position on the map
              </p>
            )}
          </div>
        </div>

        {/* Combined Test Section */}
        <div className="test-section">
          <h2>🎯 Combined Test (Camera + GPS)</h2>
          <div className="test-card">
            <p>
              This simulates the real attendance flow:
              <br />
              1. Get GPS location
              <br />
              2. Verify within project radius
              <br />
              3. Take selfie photo
              <br />
              4. Submit to backend
            </p>
            
            <button
              onClick={async () => {
                try {
                  // Step 1: Get GPS
                  await getCurrentPosition();
                  
                  // Step 2: Check distance
                  const result = isWithinRadius(
                    testProjectLocation.latitude,
                    testProjectLocation.longitude,
                    testProjectLocation.radius_meters
                  );

                  if (!result.isValid) {
                    alert(`❌ You are ${result.distance.toFixed(1)}m away from the project site. Please get closer.`);
                    return;
                  }

                  // Step 3: Open camera
                  alert('✅ Location verified! Opening camera...');
                  setShowCamera(true);
                } catch (err) {
                  alert('❌ GPS Error: ' + err.message);
                }
              }}
              className="btn-success"
              disabled={!position}
            >
              Start Attendance Flow
            </button>

            {!position && (
              <p className="hint">👆 Get GPS location first to enable this test</p>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="test-section">
          <h2>📖 Testing Instructions</h2>
          <div className="test-card instructions">
            <h3>Camera Testing:</h3>
            <ul>
              <li>✓ Click "Open Camera" to activate camera</li>
              <li>✓ Allow camera permissions when prompted</li>
              <li>✓ Try switching front/back camera on mobile</li>
              <li>✓ Position face in guide frame</li>
              <li>✓ Click capture button (white ring)</li>
              <li>✓ Review photo, retake if needed</li>
              <li>✓ Confirm to save photo</li>
            </ul>

            <h3>GPS Testing:</h3>
            <ul>
              <li>✓ Click "Get GPS Once" for single position</li>
              <li>✓ Allow location permissions when prompted</li>
              <li>✓ Check accuracy level (excellent/good/fair/poor)</li>
              <li>✓ Try "Start Watching" for continuous updates</li>
              <li>✓ Click "Check Distance" to verify project radius</li>
              <li>✓ Try on different locations (indoor/outdoor)</li>
            </ul>

            <h3>Browser Support:</h3>
            <ul>
              <li>✅ Android Chrome - Full support</li>
              <li>✅ iOS Safari - Full support (with prompts)</li>
              <li>⚠️ Desktop - Camera works, GPS may vary</li>
              <li>❌ Old browsers - Not supported</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Camera Capture Modal */}
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
          facingMode="environment"
          autoStart={true}
        />
      )}
    </div>
  );
};

export default CameraGPSTest;
