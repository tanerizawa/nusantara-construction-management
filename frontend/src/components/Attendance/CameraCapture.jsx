import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import useCamera from '../../hooks/useCamera';
import { hasFeature } from '../../utils/browserDetection';
import './CameraCapture.css';

/**
 * CameraCapture Component
 * Provides camera interface with preview, capture, and photo management
 * Includes fallback to file input for browsers without camera support
 * 
 * @param {Object} props
 * @param {Function} props.onCapture - Callback when photo is captured (receives photo data)
 * @param {Function} props.onClose - Callback to close camera
 * @param {boolean} props.autoStart - Auto start camera on mount
 * @param {string} props.facingMode - Initial facing mode ('user' or 'environment')
 */
const CameraCapture = ({ 
  onCapture, 
  onClose, 
  autoStart = true,
  facingMode: initialFacingMode = 'environment'
}) => {
  // Create videoRef in component, pass to hook
  const videoRef = useRef(null);

  const {
    stream,
    isActive,
    isLoading,
    error,
    devices,
    facingMode,
    capturedPhoto,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    clearPhoto,
    isCameraSupported,
  } = useCamera(videoRef); // Pass videoRef to hook

  const [showDeviceList, setShowDeviceList] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('checking');
  const [useFallback, setUseFallback] = useState(false);

  // Check camera support on mount
  useEffect(() => {
    if (!hasFeature('camera')) {
      setUseFallback(true);
      setPermissionStatus('unsupported');
    }
  }, []);

  // File input fallback handler
  const handleFileInput = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Read file as data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      
      // Create blob from data URL
      fetch(dataUrl)
        .then(res => res.blob())
        .then(blob => {
          const photoData = {
            blob,
            dataUrl,
            width: 1920,
            height: 1080,
            timestamp: Date.now()
          };
          
          if (onCapture) {
            onCapture(photoData);
          }
        });
    };
    reader.readAsDataURL(file);
  };

  // If camera not supported, show file input fallback
  if (useFallback || !isCameraSupported()) {
    return (
      <div className="camera-fallback">
        <div className="camera-fallback-content">
          <div className="fallback-icon">📷</div>
          <h2>Camera Not Available</h2>
          <p>Your browser doesn't support camera access or camera permission was denied.</p>
          <p>Please select a photo from your device:</p>
          
          <label className="file-input-label">
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
            <span className="btn-file-input">
              📁 Choose Photo
            </span>
          </label>
          
          {onClose && (
            <button onClick={onClose} className="btn-close-fallback">
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  // Auto start camera with DOM-ready refs
  useLayoutEffect(() => {
    if (autoStart && isCameraSupported() && videoRef.current) {
      handleStartCamera();
    }

    return () => {
      stopCamera();
    };
  }, [autoStart]); // eslint-disable-line react-hooks/exhaustive-deps

  // Attach stream to video element when available (robust fallback)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !stream) return;

    if (video.srcObject !== stream) {
      try {
        video.srcObject = stream;
      } catch (e) {
        // Fallback for older browsers
        video.src = window.URL.createObjectURL(stream);
      }
    }

    const play = async () => {
      try {
        await video.play();
      } catch (err) {
        // Some browsers require a user gesture; ignore here
        // The capture button interaction will trigger play if needed
      }
    };

    if (video.readyState >= 2) {
      // HAVE_CURRENT_DATA
      play();
    } else {
      video.onloadedmetadata = () => play();
    }

    return () => {
      if (video) {
        video.onloadedmetadata = null;
        try { video.pause(); } catch (_) {}
        // Do not stop tracks here; stopCamera handles that
        if (video.srcObject) {
          video.srcObject = null;
        }
      }
    };
  }, [stream]);

  const handleStartCamera = async () => {
    setPermissionStatus('requesting');
    try {
      await startCamera({ video: { facingMode: initialFacingMode } });
      setPermissionStatus('granted');
    } catch (err) {
      setPermissionStatus('denied');
    }
  };

  const handleCapture = async () => {
    const photo = await capturePhoto({
      quality: 0.92,
      format: 'image/jpeg'
    });

    if (photo && onCapture) {
      onCapture(photo);
    }
  };

  const handleRetake = () => {
    clearPhoto();
  };

  const handleConfirm = () => {
    if (capturedPhoto && onCapture) {
      onCapture({
        dataUrl: capturedPhoto,
        timestamp: Date.now()
      });
    }
  };

  const handleClose = () => {
    stopCamera();
    if (onClose) {
      onClose();
    }
  };

  // Not supported
  if (!isCameraSupported()) {
    return (
      <div className="camera-capture">
        <div className="camera-error">
          <div className="error-icon">📷</div>
          <h3>Camera Not Supported</h3>
          <p>Your browser doesn't support camera access.</p>
          <button onClick={handleClose} className="btn-close">
            Close
          </button>
        </div>
      </div>
    );
  }

  // Permission denied
  if (permissionStatus === 'denied' || error?.includes('permission')) {
    return (
      <div className="camera-capture">
        <div className="camera-error">
          <div className="error-icon">🚫</div>
          <h3>Camera Permission Required</h3>
          <p>Please allow camera access to take attendance photos.</p>
          <div className="error-actions">
            <button onClick={handleStartCamera} className="btn-retry">
              Try Again
            </button>
            <button onClick={handleClose} className="btn-close">
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Loading
  if (isLoading || permissionStatus === 'requesting') {
    return (
      <div className="camera-capture">
        <div className="camera-loading">
          <div className="spinner"></div>
          <p>Starting camera...</p>
        </div>
      </div>
    );
  }

  // Captured photo preview
  if (capturedPhoto) {
    return (
      <div className="camera-capture">
        <div className="camera-preview">
          <img src={capturedPhoto} alt="Captured" className="captured-image" />
          
          <div className="preview-overlay">
            <div className="preview-actions">
              <button onClick={handleRetake} className="btn-retake">
                <span className="icon">🔄</span>
                Retake
              </button>
              <button onClick={handleConfirm} className="btn-confirm">
                <span className="icon">✓</span>
                Use Photo
              </button>
            </div>
          </div>

          <button onClick={handleClose} className="btn-close-top">
            ✕
          </button>
        </div>
      </div>
    );
  }

  // Camera active
  return (
    <div className="camera-capture">
      <div className="camera-container">
        {/* Video preview */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />

        {/* Camera overlay */}
        <div className="camera-overlay">
          {/* Top bar */}
          <div className="camera-top-bar">
            <button onClick={handleClose} className="btn-close-camera">
              ✕
            </button>
            
            {devices.length > 1 && (
              <button 
                onClick={() => setShowDeviceList(!showDeviceList)} 
                className="btn-device-list"
              >
                📷 {devices.length}
              </button>
            )}
          </div>

          {/* Guide frame */}
          <div className="camera-guide">
            <div className="guide-frame">
              <div className="corner top-left"></div>
              <div className="corner top-right"></div>
              <div className="corner bottom-left"></div>
              <div className="corner bottom-right"></div>
            </div>
            <p className="guide-text">Position your face in the frame</p>
          </div>

          {/* Bottom controls */}
          <div className="camera-controls">
            {devices.length > 1 && (
              <button onClick={switchCamera} className="btn-switch">
                <span className="icon">🔄</span>
                <span className="label">
                  {facingMode === 'user' ? 'Front' : 'Back'}
                </span>
              </button>
            )}

            <button onClick={handleCapture} className="btn-capture">
              <span className="capture-ring">
                <span className="capture-inner"></span>
              </span>
            </button>

            <div className="spacer"></div>
          </div>
        </div>

        {/* Device list dropdown */}
        {showDeviceList && devices.length > 1 && (
          <div className="device-list">
            <div className="device-list-header">
              <h4>Select Camera</h4>
              <button onClick={() => setShowDeviceList(false)}>✕</button>
            </div>
            <ul>
              {devices.map((device) => (
                <li key={device.deviceId}>
                  <button
                    onClick={async () => {
                      await stopCamera();
                      await startCamera({ 
                        video: { deviceId: { exact: device.deviceId } } 
                      });
                      setShowDeviceList(false);
                    }}
                  >
                    {device.label || `Camera ${device.deviceId.slice(0, 8)}`}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Error message */}
        {error && !error.includes('permission') && (
          <div className="camera-error-banner">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
