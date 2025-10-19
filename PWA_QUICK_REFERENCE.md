# 🚀 PWA Quick Reference Guide

**Version:** 1.0.0  
**Last Updated:** October 21, 2024  
**For:** Developers integrating Week 1 features

---

## 📖 TABLE OF CONTENTS

1. [Quick Start](#quick-start)
2. [Camera Integration](#camera-integration)
3. [GPS Integration](#gps-integration)
4. [Location Picker](#location-picker)
5. [Photo Compression](#photo-compression)
6. [Error Handling](#error-handling)
7. [Performance Optimization](#performance-optimization)
8. [Common Patterns](#common-patterns)
9. [Troubleshooting](#troubleshooting)

---

## 🏃 QUICK START

### Installation
```bash
# Already installed in Week 1
npm install leaflet react-leaflet@4.2.1 browser-image-compression
```

### Import Everything You Need
```javascript
// Hooks
import useCamera from './hooks/useCamera';
import useGeolocation from './hooks/useGeolocation';

// Components
import CameraCapture from './components/Attendance/CameraCapture';
import LocationPicker from './components/Attendance/LocationPicker';
import GPSIndicator from './components/Attendance/GPSIndicator';
import ErrorBoundary from './components/ErrorBoundary';

// Utilities
import { compressDataUrl } from './utils/imageCompression';
import { hasFeature, getBrowserInfo } from './utils/browserDetection';
import { optimizeImageSettings, optimizeGPSSettings } from './utils/performanceOptimization';
```

---

## 📸 CAMERA INTEGRATION

### Basic Camera Usage
```javascript
import useCamera from './hooks/useCamera';
import CameraCapture from './components/Attendance/CameraCapture';

function MyComponent() {
  const [showCamera, setShowCamera] = useState(false);
  const [photo, setPhoto] = useState(null);

  const handleCapture = (photoData) => {
    setPhoto(photoData);
    setShowCamera(false);
    // photoData structure:
    // {
    //   blob: Blob,
    //   dataUrl: "data:image/jpeg;base64,...",
    //   width: 1920,
    //   height: 1080,
    //   timestamp: 1697892345678
    // }
  };

  return (
    <div>
      <button onClick={() => setShowCamera(true)}>
        Take Photo
      </button>
      
      {showCamera && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShowCamera(false)}
          autoStart={true}
          facingMode="environment"
        />
      )}
      
      {photo && (
        <img src={photo.dataUrl} alt="Captured" />
      )}
    </div>
  );
}
```

### Advanced Camera with Hook
```javascript
function AdvancedCamera() {
  const {
    stream,
    isActive,
    error,
    devices,
    capturedPhoto,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    clearPhoto
  } = useCamera();

  const handleStart = async () => {
    try {
      await startCamera({ video: { width: 1920, height: 1080 } });
    } catch (err) {
      console.error('Camera failed:', err);
    }
  };

  const handleCapture = async () => {
    try {
      const photo = await capturePhoto({ quality: 0.95 });
      console.log('Photo captured:', photo);
    } catch (err) {
      console.error('Capture failed:', err);
    }
  };

  return (
    <div>
      <video ref={videoRef} autoPlay playsInline />
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {!isActive && (
        <button onClick={handleStart}>Start Camera</button>
      )}
      
      {isActive && (
        <>
          <button onClick={handleCapture}>Capture</button>
          <button onClick={switchCamera}>Switch</button>
          <button onClick={stopCamera}>Stop</button>
        </>
      )}
      
      {error && <p>Error: {error}</p>}
      
      {capturedPhoto && (
        <img src={capturedPhoto} alt="Captured" />
      )}
    </div>
  );
}
```

### Camera Props Reference
```javascript
<CameraCapture
  onCapture={(photoData) => {}}  // Required: callback when photo captured
  onClose={() => {}}              // Required: callback when camera closed
  autoStart={true}                // Optional: auto-start camera on mount (default: false)
  facingMode="environment"        // Optional: "user" or "environment" (default: "environment")
  showDeviceSelector={true}       // Optional: show device dropdown (default: true)
  compressionQuality={0.85}       // Optional: JPEG quality 0-1 (default: 0.85)
  maxWidth={1920}                 // Optional: max photo width (default: 1920)
  maxHeight={1080}                // Optional: max photo height (default: 1080)
/>
```

---

## 📍 GPS INTEGRATION

### Basic GPS Usage
```javascript
import useGeolocation from './hooks/useGeolocation';
import GPSIndicator from './components/Attendance/GPSIndicator';

function MyComponent() {
  const {
    position,
    isLoading,
    error,
    getCurrentPosition,
    calculateDistance,
    isWithinRadius
  } = useGeolocation();

  const handleGetLocation = async () => {
    try {
      await getCurrentPosition({ enableHighAccuracy: true });
    } catch (err) {
      console.error('GPS failed:', err);
    }
  };

  const checkDistance = () => {
    const projectLat = -6.2088;
    const projectLon = 106.8456;
    const radius = 100; // meters
    
    const result = isWithinRadius(projectLat, projectLon, radius);
    console.log('Within radius:', result.isValid);
    console.log('Distance:', result.distance, 'meters');
  };

  return (
    <div>
      <GPSIndicator
        position={position}
        error={error}
        size="large"
        showDetails={true}
      />
      
      <button onClick={handleGetLocation} disabled={isLoading}>
        {isLoading ? 'Getting Location...' : 'Get GPS'}
      </button>
      
      {position && (
        <div>
          <p>Lat: {position.latitude}</p>
          <p>Lon: {position.longitude}</p>
          <p>Accuracy: ±{position.accuracy}m</p>
          <button onClick={checkDistance}>Check Distance</button>
        </div>
      )}
      
      {error && <p>Error: {error}</p>}
    </div>
  );
}
```

### GPS with Watch Position
```javascript
function GPSTracking() {
  const { position, watchPosition, clearWatch } = useGeolocation();
  const [watchId, setWatchId] = useState(null);

  const startTracking = () => {
    const id = watchPosition(
      (pos) => {
        console.log('Position update:', pos);
      },
      (err) => {
        console.error('GPS error:', err);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    setWatchId(id);
  };

  const stopTracking = () => {
    if (watchId) {
      clearWatch(watchId);
      setWatchId(null);
    }
  };

  return (
    <div>
      {!watchId ? (
        <button onClick={startTracking}>Start Tracking</button>
      ) : (
        <button onClick={stopTracking}>Stop Tracking</button>
      )}
      
      {position && (
        <p>Current: {position.latitude}, {position.longitude}</p>
      )}
    </div>
  );
}
```

### GPS Indicator Props
```javascript
<GPSIndicator
  position={position}           // Required: {latitude, longitude, accuracy}
  error={error}                 // Optional: error string
  size="medium"                 // Optional: "small", "medium", "large" (default: "medium")
  showDetails={true}            // Optional: show coordinates (default: false)
  className=""                  // Optional: additional CSS class
/>
```

---

## 🗺️ LOCATION PICKER

### Basic Map Usage
```javascript
import LocationPicker from './components/Attendance/LocationPicker';

function MyComponent() {
  const currentPosition = {
    latitude: -6.2088,
    longitude: 106.8456,
    accuracy: 25
  };

  const projectLocation = {
    name: 'Construction Site A',
    latitude: -6.2090,
    longitude: 106.8460,
    radius_meters: 100,
    address: 'Jl. Sudirman No. 1, Jakarta'
  };

  const handlePositionChange = (newPosition) => {
    console.log('Position changed:', newPosition);
  };

  return (
    <LocationPicker
      currentPosition={currentPosition}
      projectLocation={projectLocation}
      onPositionChange={handlePositionChange}
      showRadius={true}
      showDistance={true}
      height={400}
      mode="view"
    />
  );
}
```

### Editable Map
```javascript
function EditableMap() {
  const [selectedPosition, setSelectedPosition] = useState(null);

  return (
    <LocationPicker
      currentPosition={null}
      projectLocation={null}
      onPositionChange={(pos) => {
        setSelectedPosition(pos);
        console.log('Selected:', pos.latitude, pos.longitude);
      }}
      mode="edit"
      height={500}
      showRadius={false}
      showDistance={false}
    />
  );
}
```

### LocationPicker Props
```javascript
<LocationPicker
  currentPosition={position}      // Optional: {latitude, longitude, accuracy}
  projectLocation={project}       // Optional: {name, latitude, longitude, radius_meters, address}
  onPositionChange={(pos) => {}}  // Optional: callback when user clicks map (edit mode)
  showRadius={true}               // Optional: show radius circle (default: true)
  showDistance={true}             // Optional: show distance banner (default: true)
  height={400}                    // Optional: map height in px (default: 400)
  mode="view"                     // Optional: "view" or "edit" (default: "view")
  className=""                    // Optional: additional CSS class
/>
```

---

## 🖼️ PHOTO COMPRESSION

### Basic Compression
```javascript
import { compressDataUrl } from './utils/imageCompression';

async function compressPhoto(dataUrl) {
  try {
    const result = await compressDataUrl(dataUrl, {
      maxWidth: 1920,
      maxHeight: 1080,
      quality: 0.85,
      onProgress: (percent) => {
        console.log('Compression:', percent, '%');
      }
    });
    
    console.log('Original:', result.originalSize, 'bytes');
    console.log('Compressed:', result.compressedSize, 'bytes');
    console.log('Ratio:', result.compressionRatio, '%');
    
    return result.compressedDataUrl;
  } catch (err) {
    console.error('Compression failed:', err);
  }
}
```

### Optimized Compression (Battery/Network Aware)
```javascript
import { optimizeImageSettings } from './utils/performanceOptimization';
import { compressDataUrl } from './utils/imageCompression';

async function smartCompress(dataUrl) {
  // Get optimal settings based on battery & network
  const options = await optimizeImageSettings({
    maxWidth: 1920,
    quality: 0.85
  });
  
  console.log('Using settings:', options);
  // Example output:
  // - Normal: {maxWidth: 1920, quality: 0.85}
  // - Low battery: {maxWidth: 1280, quality: 0.7}
  // - Slow network: {maxWidth: 1280, quality: 0.65}
  
  return await compressDataUrl(dataUrl, options);
}
```

---

## 🛡️ ERROR HANDLING

### Wrap Components with ErrorBoundary
```javascript
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary 
      message="Failed to load camera component"
      onError={(error, errorInfo) => {
        console.error('Error caught:', error);
        // Optional: Send to backend logging
      }}
    >
      <CameraCapture />
    </ErrorBoundary>
  );
}
```

### Manual Fallback Handling
```javascript
import { hasFeature } from './utils/browserDetection';

function SmartComponent() {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (!hasFeature('camera')) {
      setUseFallback(true);
    }
  }, []);

  if (useFallback) {
    return (
      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        onChange={handleFileSelect}
      />
    );
  }

  return <CameraCapture />;
}
```

### Feature Detection
```javascript
import { 
  hasFeature, 
  checkFeatures, 
  isSupported,
  getBrowserInfo,
  getConnectionInfo,
  isSlowConnection,
  getBatteryInfo,
  isLowBattery
} from './utils/browserDetection';

// Check single feature
if (hasFeature('camera')) {
  console.log('Camera API available');
}

// Check multiple features
const features = checkFeatures(['camera', 'geolocation', 'serviceWorker']);
console.log('Camera:', features.camera);
console.log('GPS:', features.geolocation);

// Check required features
const support = isSupported(['camera', 'geolocation']);
if (!support.supported) {
  console.log('Missing features:', support.missing);
}

// Get browser info
const browser = getBrowserInfo();
console.log('Browser:', browser.name, browser.version);
console.log('OS:', browser.os);
console.log('Device:', browser.device);

// Check network
const connection = getConnectionInfo();
console.log('Type:', connection.effectiveType); // 4g, 3g, 2g, slow-2g
console.log('Downlink:', connection.downlink, 'Mbps');

if (isSlowConnection()) {
  console.log('Slow connection detected, reducing quality');
}

// Check battery
const battery = await getBatteryInfo();
if (battery) {
  console.log('Battery:', battery.level * 100, '%');
  console.log('Charging:', battery.charging);
}

if (await isLowBattery()) {
  console.log('Low battery, enabling power saving mode');
}
```

---

## ⚡ PERFORMANCE OPTIMIZATION

### Lazy Load Pages
```javascript
import React, { Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Projects = lazy(() => import('./pages/Projects'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </Suspense>
  );
}
```

### Optimize GPS Settings
```javascript
import { optimizeGPSSettings } from './utils/performanceOptimization';

async function getOptimizedPosition() {
  const options = await optimizeGPSSettings({
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 0
  });
  
  console.log('GPS settings:', options);
  // Example output:
  // - Normal: {enableHighAccuracy: true, timeout: 10000}
  // - Low battery: {enableHighAccuracy: false, timeout: 15000}
  
  return navigator.geolocation.getCurrentPosition(
    (pos) => console.log(pos),
    (err) => console.error(err),
    options
  );
}
```

### Battery-Aware GPS Tracking
```javascript
import { BatteryAwareGPSTracker } from './utils/performanceOptimization';

function AttendanceTracking() {
  const [tracker] = useState(() => new BatteryAwareGPSTracker());

  useEffect(() => {
    tracker.start(
      (position) => {
        console.log('Position update:', position);
        // Update interval adjusts automatically based on battery:
        // - Normal: 5 seconds
        // - Low battery: 10 seconds
        // - Charging: 3 seconds
      },
      (error) => {
        console.error('GPS error:', error);
      }
    );

    return () => tracker.stop();
  }, []);

  return <div>Tracking active...</div>;
}
```

### Debounce & Throttle
```javascript
import { debounce, throttle } from './utils/performanceOptimization';

// Debounce: Wait for user to stop typing
const handleSearch = debounce((query) => {
  console.log('Searching:', query);
  // API call here
}, 500); // Wait 500ms after last keystroke

// Throttle: Limit scroll event frequency
const handleScroll = throttle(() => {
  console.log('Scroll position:', window.scrollY);
}, 200); // Max once every 200ms

function SearchComponent() {
  return (
    <input 
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

---

## 🎨 COMMON PATTERNS

### Complete Attendance Clock-In Flow
```javascript
function ClockInFlow() {
  const [step, setStep] = useState(1); // 1=camera, 2=gps, 3=verify, 4=submit
  const [photo, setPhoto] = useState(null);
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);

  const { getCurrentPosition, isWithinRadius } = useGeolocation();

  const projectLocation = {
    latitude: -6.2088,
    longitude: 106.8456,
    radius_meters: 100
  };

  // Step 1: Camera
  const handlePhotoCapture = async (photoData) => {
    // Compress photo
    const compressed = await compressDataUrl(photoData.dataUrl);
    setPhoto(compressed.compressedDataUrl);
    setStep(2);
  };

  // Step 2: GPS
  const handleGetGPS = async () => {
    setLoading(true);
    try {
      const pos = await getCurrentPosition({ enableHighAccuracy: true });
      setPosition(pos);
      setStep(3);
    } catch (err) {
      alert('GPS failed: ' + err);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify Distance
  useEffect(() => {
    if (step === 3 && position) {
      const result = isWithinRadius(
        projectLocation.latitude,
        projectLocation.longitude,
        projectLocation.radius_meters
      );
      
      if (!result.isValid) {
        alert(`Too far! Distance: ${result.distance}m`);
        return;
      }
      
      setStep(4);
    }
  }, [step, position]);

  // Step 4: Submit
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // Convert dataUrl to Blob
      const blob = await fetch(photo).then(r => r.blob());
      formData.append('photo', blob, 'attendance.jpg');
      formData.append('latitude', position.latitude);
      formData.append('longitude', position.longitude);
      formData.append('accuracy', position.accuracy);

      const response = await fetch('/api/attendance/clock-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        alert('Clock in successful!');
        // Reset or redirect
      } else {
        throw new Error('Clock in failed');
      }
    } catch (err) {
      alert('Submit failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ErrorBoundary message="Clock-in flow error">
      {step === 1 && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => {}}
          autoStart={true}
        />
      )}

      {step === 2 && (
        <div>
          <img src={photo} alt="Preview" style={{ width: 200 }} />
          <button onClick={handleGetGPS} disabled={loading}>
            {loading ? 'Getting GPS...' : 'Get Location'}
          </button>
        </div>
      )}

      {step === 3 && (
        <div>
          <LocationPicker
            currentPosition={position}
            projectLocation={projectLocation}
            showRadius={true}
            showDistance={true}
          />
          <p>Verifying location...</p>
        </div>
      )}

      {step === 4 && (
        <div>
          <img src={photo} alt="Preview" style={{ width: 200 }} />
          <GPSIndicator position={position} showDetails={true} />
          <LocationPicker
            currentPosition={position}
            projectLocation={projectLocation}
            showRadius={true}
            showDistance={true}
          />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Clock In'}
          </button>
        </div>
      )}
    </ErrorBoundary>
  );
}
```

### Form with Photo & GPS
```javascript
function DocumentationForm() {
  const [photo, setPhoto] = useState(null);
  const [position, setPosition] = useState(null);
  const [description, setDescription] = useState('');
  const { getCurrentPosition } = useGeolocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!photo || !position) {
      alert('Photo and GPS required');
      return;
    }

    const formData = new FormData();
    const blob = await fetch(photo).then(r => r.blob());
    formData.append('photo', blob, 'doc.jpg');
    formData.append('latitude', position.latitude);
    formData.append('longitude', position.longitude);
    formData.append('description', description);

    // Submit...
  };

  return (
    <form onSubmit={handleSubmit}>
      <CameraCapture
        onCapture={(data) => setPhoto(data.dataUrl)}
        onClose={() => {}}
      />

      <button type="button" onClick={() => getCurrentPosition()}>
        Get GPS
      </button>

      <GPSIndicator position={position} />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />

      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🔧 TROUBLESHOOTING

### Camera Not Starting
```javascript
// Check feature support
if (!hasFeature('camera')) {
  console.error('Camera API not supported');
  // Show file input fallback
}

// Check permissions
const permission = await navigator.permissions.query({ name: 'camera' });
if (permission.state === 'denied') {
  console.error('Camera permission denied');
  // Show instructions to enable
}

// Check HTTPS
if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
  console.error('Camera requires HTTPS');
}
```

### GPS Slow or Inaccurate
```javascript
// Use high accuracy mode
const position = await getCurrentPosition({
  enableHighAccuracy: true,  // Use GPS instead of network
  timeout: 20000,             // Wait up to 20 seconds
  maximumAge: 0               // Don't use cached position
});

// Check outdoors
console.log('Accuracy:', position.accuracy, 'meters');
// Indoor: 50-100m
// Outdoor: 5-20m

// Wait longer
// Initial GPS fix can take 15-30 seconds
```

### Map Not Loading
```javascript
// Check internet connection
if (!navigator.onLine) {
  console.error('No internet connection');
}

// Check Leaflet CSS imported
// In App.js or index.js:
import 'leaflet/dist/leaflet.css';

// Check component mounted
useEffect(() => {
  console.log('LocationPicker mounted');
}, []);
```

### High Bundle Size
```javascript
// Check current bundle
npm run build
// Check build/static/js/*.js file sizes

// Implement lazy loading
const LocationPicker = lazy(() => import('./components/Attendance/LocationPicker'));

// Use Suspense
<Suspense fallback={<div>Loading map...</div>}>
  <LocationPicker />
</Suspense>
```

### Battery Drain
```javascript
// Use battery-aware GPS
const tracker = new BatteryAwareGPSTracker();
tracker.start(onSuccess, onError);
// Automatically reduces polling on low battery

// Stop GPS when not needed
useEffect(() => {
  // Start GPS
  return () => {
    // Stop GPS on unmount
    tracker.stop();
  };
}, []);
```

---

## 📚 CHEAT SHEET

### Essential Imports
```javascript
// Hooks
import useCamera from './hooks/useCamera';
import useGeolocation from './hooks/useGeolocation';

// Components
import CameraCapture from './components/Attendance/CameraCapture';
import LocationPicker from './components/Attendance/LocationPicker';
import GPSIndicator from './components/Attendance/GPSIndicator';
import ErrorBoundary from './components/ErrorBoundary';

// Utils
import { compressDataUrl } from './utils/imageCompression';
import { hasFeature, getBrowserInfo, isSlowConnection } from './utils/browserDetection';
import { optimizeImageSettings, optimizeGPSSettings, BatteryAwareGPSTracker } from './utils/performanceOptimization';
```

### Quick Snippets

**Take Photo:**
```javascript
<CameraCapture onCapture={(data) => setPhoto(data.dataUrl)} onClose={() => {}} autoStart />
```

**Get GPS:**
```javascript
const { position, getCurrentPosition } = useGeolocation();
await getCurrentPosition({ enableHighAccuracy: true });
```

**Show Map:**
```javascript
<LocationPicker currentPosition={position} projectLocation={project} showRadius showDistance />
```

**Compress Photo:**
```javascript
const result = await compressDataUrl(dataUrl, { quality: 0.85 });
```

**Wrap with ErrorBoundary:**
```javascript
<ErrorBoundary><YourComponent /></ErrorBoundary>
```

**Check Feature:**
```javascript
if (hasFeature('camera')) { /* use camera */ }
```

**Optimize Performance:**
```javascript
const options = await optimizeImageSettings();
const gpsOptions = await optimizeGPSSettings();
```

---

## 🎓 LEARNING RESOURCES

- **React Documentation:** https://react.dev
- **Leaflet.js:** https://leafletjs.com
- **Camera API:** https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
- **Geolocation API:** https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API
- **Service Worker:** https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API
- **PWA Guide:** https://web.dev/progressive-web-apps/

---

**Need More Help?**  
📚 Check `PWA_WEEK1_COMPLETE.md` for comprehensive documentation  
✅ Use `PWA_WEEK1_TESTING_CHECKLIST.md` for testing  
📊 Track progress in `PWA_PROGRESS_TRACKER.md`

**Happy Coding!** 🚀
