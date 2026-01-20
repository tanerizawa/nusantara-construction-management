# 🚀 PWA Day 2 - Quick Reference Guide

**Status:** ✅ Complete | **Access:** http://localhost:3000/test/camera-gps

---

## 📦 What Was Built

### 1️⃣ useCamera Hook
**File:** `frontend/src/hooks/useCamera.js` (307 lines)

```jsx
const {
  videoRef,        // Attach to <video> element
  isActive,        // Camera is streaming
  capturePhoto,    // Take photo → returns { blob, dataUrl }
  switchCamera,    // Toggle front/back
  startCamera,     // Start streaming
  stopCamera       // Cleanup
} = useCamera();
```

**Quick Start:**
```jsx
import useCamera from './hooks/useCamera';

function MyCamera() {
  const { videoRef, startCamera, capturePhoto } = useCamera();
  
  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);
  
  return <video ref={videoRef} autoPlay />;
}
```

---

### 2️⃣ useGeolocation Hook
**File:** `frontend/src/hooks/useGeolocation.js` (320 lines)

```jsx
const {
  position,           // { latitude, longitude, accuracy }
  getCurrentPosition, // Get GPS once
  isWithinRadius,     // Check if within project area
  calculateDistance   // Haversine formula
} = useGeolocation();
```

**Quick Start:**
```jsx
import useGeolocation from './hooks/useGeolocation';

function MyGPS() {
  const { position, getCurrentPosition, isWithinRadius } = useGeolocation();
  
  const check = async () => {
    await getCurrentPosition();
    
    const result = isWithinRadius(-6.2088, 106.8456, 100); // lat, lon, radius
    console.log(`Valid: ${result.isValid}, Distance: ${result.distance}m`);
  };
  
  return <button onClick={check}>Check Location</button>;
}
```

---

### 3️⃣ CameraCapture Component
**File:** `frontend/src/components/Attendance/CameraCapture.jsx` (245 lines)

```jsx
<CameraCapture
  onCapture={(photoData) => {
    // photoData = { blob, dataUrl, width, height, timestamp }
    console.log('Photo size:', photoData.blob.size);
  }}
  onClose={() => setShowCamera(false)}
  facingMode="environment" // or "user" for front camera
  autoStart={true}
/>
```

**Quick Start:**
```jsx
import CameraCapture from './components/Attendance/CameraCapture';

function ClockIn() {
  const [show, setShow] = useState(false);
  
  const handleCapture = (photo) => {
    // Upload to backend
    const formData = new FormData();
    formData.append('photo', photo.blob, 'attendance.jpg');
    axios.post('/api/attendance/clock-in', formData);
  };
  
  return (
    <>
      <button onClick={() => setShow(true)}>Take Photo</button>
      {show && (
        <CameraCapture
          onCapture={handleCapture}
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}
```

---

## 🧪 Testing

### Test Page Access
```
URL: http://localhost:3000/test/camera-gps
```

### What You Can Test
1. ✅ **Camera Test** - Open camera, capture photo, see info
2. ✅ **GPS Test** - Get location, check accuracy
3. ✅ **Distance Test** - Calculate distance to Jakarta City Center
4. ✅ **Combined Flow** - Simulate full attendance flow

### Manual Testing Checklist
```
Camera:
- [ ] Open camera works
- [ ] Permission granted
- [ ] Switch front/back camera
- [ ] Capture photo
- [ ] Photo quality good
- [ ] Retake works
- [ ] Confirm works

GPS:
- [ ] Get GPS once works
- [ ] Permission granted
- [ ] Accuracy < 20m (good)
- [ ] Distance calculation accurate
- [ ] Within radius check works
- [ ] Start/stop watching works
```

---

## 🔗 Backend Integration

### Clock-In with Photo & GPS
```javascript
import useCamera from '../hooks/useCamera';
import useGeolocation from '../hooks/useGeolocation';
import CameraCapture from '../components/Attendance/CameraCapture';

const ClockInPage = () => {
  const [showCamera, setShowCamera] = useState(false);
  const { position, getCurrentPosition, isWithinRadius } = useGeolocation();
  
  const handleClockIn = async () => {
    // Step 1: Get GPS
    await getCurrentPosition();
    
    // Step 2: Verify location
    const result = isWithinRadius(
      projectLocation.latitude,
      projectLocation.longitude,
      projectLocation.radius_meters
    );
    
    if (!result.isValid) {
      alert(`Too far: ${result.distance}m away`);
      return;
    }
    
    // Step 3: Open camera
    setShowCamera(true);
  };
  
  const handlePhotoCapture = async (photoData) => {
    // Step 4: Upload to backend
    const formData = new FormData();
    formData.append('photo', photoData.blob, 'attendance.jpg');
    formData.append('latitude', position.latitude);
    formData.append('longitude', position.longitude);
    formData.append('project_id', selectedProject);
    
    const response = await axios.post('/api/attendance/clock-in', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    alert('Clock-in successful!');
    setShowCamera(false);
  };
  
  return (
    <>
      <button onClick={handleClockIn}>Clock In</button>
      
      {showCamera && (
        <CameraCapture
          onCapture={handlePhotoCapture}
          onClose={() => setShowCamera(false)}
          facingMode="environment"
        />
      )}
    </>
  );
};
```

---

## 📱 Mobile Usage

### iOS Safari
- ✅ Camera works with permission prompt
- ✅ GPS works with permission prompt
- ⚠️ Back camera as `facingMode: "environment"`
- ⚠️ Must use HTTPS in production

### Android Chrome
- ✅ Camera works perfectly
- ✅ GPS works with high accuracy
- ✅ Front/back camera switching
- ✅ Works on HTTP localhost

### Required Permissions
```javascript
// Check permissions
const cameraPermission = await navigator.permissions.query({ name: 'camera' });
const locationPermission = await navigator.permissions.query({ name: 'geolocation' });

console.log(cameraPermission.state);    // 'granted', 'denied', 'prompt'
console.log(locationPermission.state);  // 'granted', 'denied', 'prompt'
```

---

## 🔧 Configuration Options

### Camera Options
```javascript
// High resolution
await startCamera({
  video: {
    width: { ideal: 1920 },
    height: { ideal: 1080 },
    facingMode: 'environment'
  }
});

// Capture with quality
const photo = await capturePhoto({
  quality: 0.92,  // 92% JPEG quality
  format: 'image/jpeg',
  width: 1920,
  height: 1080
});
```

### GPS Options
```javascript
// High accuracy GPS
const position = await getCurrentPosition({
  enableHighAccuracy: true,  // Use GPS (not WiFi/Cell)
  timeout: 10000,            // 10 seconds max
  maximumAge: 0              // Don't use cached position
});

// Continuous tracking
const watchId = startWatching({
  enableHighAccuracy: true
});

// Stop tracking
stopWatching();
```

---

## 📊 Performance Tips

### Camera Optimization
```javascript
// Start camera when needed, stop when done
useEffect(() => {
  if (needCamera) {
    startCamera();
  }
  return () => stopCamera(); // Always cleanup
}, [needCamera]);

// Compress photo before upload
const photo = await capturePhoto({ quality: 0.8 }); // Lower quality = smaller file
```

### GPS Optimization
```javascript
// Use getCurrentPosition() for one-time check (better battery)
await getCurrentPosition();

// Use watchPosition() only when continuous tracking needed
startWatching(); // Remember to stopWatching() when done!
```

---

## 🐛 Common Issues

### Camera Not Working
```javascript
// Check browser support
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
  alert('Camera not supported');
}

// Check permissions
const { startCamera } = useCamera();
try {
  await startCamera();
} catch (err) {
  if (err.name === 'NotAllowedError') {
    alert('Please allow camera access');
  }
}
```

### GPS Not Accurate
```javascript
// Check accuracy level
const { accuracy, getAccuracyStatus } = useGeolocation();
const status = getAccuracyStatus();

console.log(`Accuracy: ${accuracy}m - ${status.text}`);
// excellent: < 10m
// good: < 20m
// fair: < 50m
// poor: > 50m

// Wait for better accuracy
while (accuracy > 20) {
  await new Promise(r => setTimeout(r, 1000));
}
```

---

## 📁 File Locations

```
frontend/src/
├── hooks/
│   ├── useCamera.js           ← Camera hook
│   └── useGeolocation.js      ← GPS hook
├── components/
│   └── Attendance/
│       ├── CameraCapture.jsx  ← Camera UI
│       └── CameraCapture.css  ← Camera styles
└── pages/
    ├── CameraGPSTest.jsx      ← Test page
    └── CameraGPSTest.css      ← Test styles
```

---

## 📝 Code Statistics

| Component | Lines | Methods | State Variables |
|-----------|-------|---------|-----------------|
| useCamera | 307 | 10 | 8 |
| useGeolocation | 320 | 10 | 7 |
| CameraCapture | 245 | 5 | 3 |
| CameraGPSTest | 313 | 8 | 4 |
| **TOTAL** | **1,185** | **33** | **22** |

**CSS:** 1,484 lines  
**Grand Total:** 2,669 lines

---

## ✅ Next Steps: Day 3

1. Create LocationPicker component with map
2. Implement photo compression (5MB → 1MB)
3. GPS accuracy indicator UI
4. Distance calculation display
5. Integration testing with backend

---

## 🎯 Quick Commands

```bash
# Start containers
docker-compose up -d

# Restart frontend
docker-compose restart frontend

# View logs
docker-compose logs -f frontend

# Stop all
docker-compose down

# Access test page
open http://localhost:3000/test/camera-gps

# Access backend API
curl http://localhost:5000/api/attendance/locations/1
```

---

**Day 2 Complete!** ✅  
**All hooks and components ready for attendance integration** 🚀
