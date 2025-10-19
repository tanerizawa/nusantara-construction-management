import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * Custom Hook for Camera Access
 * Provides camera stream, photo capture, and device management
 * 
 * @returns {Object} Camera utilities and state
 */
const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' or 'environment'
  const [isLoading, setIsLoading] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  /**
   * Get available camera devices
   */
  const getDevices = useCallback(async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      // Auto-select back camera on mobile if available
      const backCamera = videoDevices.find(device => 
        device.label.toLowerCase().includes('back') || 
        device.label.toLowerCase().includes('rear')
      );
      
      if (backCamera) {
        setCurrentDeviceId(backCamera.deviceId);
        setFacingMode('environment');
      } else if (videoDevices.length > 0) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
      
      return videoDevices;
    } catch (err) {
      console.error('Error enumerating devices:', err);
      setError('Failed to get camera devices');
      return [];
    }
  }, []);

  /**
   * Start camera stream
   */
  const startCamera = useCallback(async (constraints = {}) => {
    setIsLoading(true);
    setError(null);

    try {
      // Stop existing stream if any
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Default constraints
      const defaultConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920, max: 1920 },
          height: { ideal: 1080, max: 1080 },
          aspectRatio: { ideal: 16/9 }
        },
        audio: false
      };

      // Use specific device if selected
      if (currentDeviceId) {
        defaultConstraints.video.deviceId = { exact: currentDeviceId };
        delete defaultConstraints.video.facingMode;
      }

      // Merge with custom constraints
      const finalConstraints = {
        ...defaultConstraints,
        ...constraints
      };

      // Get media stream
      const mediaStream = await navigator.mediaDevices.getUserMedia(finalConstraints);
      
      setStream(mediaStream);
      setIsActive(true);
      setIsLoading(false);

      // Attach to video element if ref exists
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }

      return mediaStream;
    } catch (err) {
      console.error('Error starting camera:', err);
      setIsLoading(false);
      
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError') {
        setError('Camera is already in use by another application.');
      } else {
        setError('Failed to access camera: ' + err.message);
      }
      
      return null;
    }
  }, [stream, currentDeviceId, facingMode]);

  /**
   * Stop camera stream
   */
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
      });
      setStream(null);
      setIsActive(false);
      
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }
  }, [stream]);

  /**
   * Capture photo from video stream
   */
  const capturePhoto = useCallback((options = {}) => {
    if (!videoRef.current || !stream) {
      setError('Camera not active');
      return null;
    }

    const {
      width = videoRef.current.videoWidth,
      height = videoRef.current.videoHeight,
      quality = 0.92,
      format = 'image/jpeg'
    } = options;

    try {
      // Create canvas if not exists
      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas');
      }

      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, width, height);

      // Convert to blob
      return new Promise((resolve) => {
        canvas.toBlob(
          (blob) => {
            const dataUrl = canvas.toDataURL(format, quality);
            setCapturedPhoto(dataUrl);
            resolve({
              blob,
              dataUrl,
              width,
              height,
              timestamp: Date.now()
            });
          },
          format,
          quality
        );
      });
    } catch (err) {
      console.error('Error capturing photo:', err);
      setError('Failed to capture photo');
      return null;
    }
  }, [stream]);

  /**
   * Switch camera (front/back on mobile)
   */
  const switchCamera = useCallback(async () => {
    const newFacingMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(newFacingMode);
    
    // Restart camera with new facing mode
    if (isActive) {
      await stopCamera();
      await startCamera({ video: { facingMode: newFacingMode } });
    }
  }, [facingMode, isActive, startCamera, stopCamera]);

  /**
   * Change to specific camera device
   */
  const changeDevice = useCallback(async (deviceId) => {
    setCurrentDeviceId(deviceId);
    
    // Restart camera with new device
    if (isActive) {
      await stopCamera();
      await startCamera();
    }
  }, [isActive, startCamera, stopCamera]);

  /**
   * Clear captured photo
   */
  const clearPhoto = useCallback(() => {
    setCapturedPhoto(null);
  }, []);

  /**
   * Check camera support
   */
  const isCameraSupported = useCallback(() => {
    return !!(
      navigator.mediaDevices && 
      navigator.mediaDevices.getUserMedia
    );
  }, []);

  /**
   * Request camera permission
   */
  const requestPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch (err) {
      // Safari doesn't support permissions query, try direct access
      try {
        const testStream = await navigator.mediaDevices.getUserMedia({ video: true });
        testStream.getTracks().forEach(track => track.stop());
        return 'granted';
      } catch (permErr) {
        return 'denied';
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Get devices on mount
  useEffect(() => {
    if (isCameraSupported()) {
      getDevices();
    }
  }, [getDevices, isCameraSupported]);

  return {
    // State
    stream,
    isActive,
    isLoading,
    error,
    devices,
    currentDeviceId,
    facingMode,
    capturedPhoto,
    
    // Refs
    videoRef,
    canvasRef,
    
    // Methods
    startCamera,
    stopCamera,
    capturePhoto,
    switchCamera,
    changeDevice,
    clearPhoto,
    getDevices,
    isCameraSupported,
    requestPermission,
  };
};

export default useCamera;
