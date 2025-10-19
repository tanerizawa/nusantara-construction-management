import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Custom Hook for Geolocation
 * Provides GPS tracking, distance calculation, and location management
 * 
 * @returns {Object} Geolocation utilities and state
 */
const useGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWatching, setIsWatching] = useState(false);
  const [accuracy, setAccuracy] = useState(null);
  const [heading, setHeading] = useState(null);
  const [speed, setSpeed] = useState(null);
  
  const watchIdRef = useRef(null);

  // Default options for high accuracy
  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds
    maximumAge: 0, // Don't use cached position
    ...options
  };

  /**
   * Haversine formula to calculate distance between two coordinates
   * Same formula as backend ProjectLocation.isWithinRadius()
   * 
   * @param {number} lat1 - Latitude of point 1
   * @param {number} lon1 - Longitude of point 1
   * @param {number} lat2 - Latitude of point 2
   * @param {number} lon2 - Longitude of point 2
   * @returns {number} Distance in meters
   */
  const calculateDistance = useCallback((lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in meters
    return Math.round(distance * 10) / 10; // Round to 1 decimal place
  }, []);

  /**
   * Check if current position is within radius of target location
   * 
   * @param {number} targetLat - Target latitude
   * @param {number} targetLon - Target longitude
   * @param {number} radiusMeters - Allowed radius in meters
   * @returns {Object} { isValid, distance }
   */
  const isWithinRadius = useCallback((targetLat, targetLon, radiusMeters = 100) => {
    if (!position) {
      return { isValid: false, distance: null, error: 'No position available' };
    }

    const distance = calculateDistance(
      position.latitude,
      position.longitude,
      targetLat,
      targetLon
    );

    return {
      isValid: distance <= radiusMeters,
      distance,
      radius: radiusMeters,
      error: null
    };
  }, [position, calculateDistance]);

  /**
   * Handle position update
   */
  const handlePositionUpdate = useCallback((pos) => {
    const locationData = {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      accuracy: pos.coords.accuracy,
      altitude: pos.coords.altitude,
      altitudeAccuracy: pos.coords.altitudeAccuracy,
      heading: pos.coords.heading,
      speed: pos.coords.speed,
      timestamp: pos.timestamp
    };

    setPosition(locationData);
    setAccuracy(pos.coords.accuracy);
    setHeading(pos.coords.heading);
    setSpeed(pos.coords.speed);
    setError(null);
    setIsLoading(false);
  }, []);

  /**
   * Handle geolocation error
   */
  const handleError = useCallback((err) => {
    setIsLoading(false);
    
    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError({
          code: 'PERMISSION_DENIED',
          message: 'Location permission denied. Please enable location access.'
        });
        break;
      case err.POSITION_UNAVAILABLE:
        setError({
          code: 'POSITION_UNAVAILABLE',
          message: 'Location information unavailable. Please check your GPS.'
        });
        break;
      case err.TIMEOUT:
        setError({
          code: 'TIMEOUT',
          message: 'Location request timeout. Please try again.'
        });
        break;
      default:
        setError({
          code: 'UNKNOWN',
          message: 'Failed to get location: ' + err.message
        });
    }
  }, []);

  /**
   * Get current position once
   */
  const getCurrentPosition = useCallback((customOptions = {}) => {
    if (!navigator.geolocation) {
      setError({
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by this browser.'
      });
      return Promise.reject(new Error('Geolocation not supported'));
    }

    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handlePositionUpdate(pos);
          resolve(pos.coords);
        },
        (err) => {
          handleError(err);
          reject(err);
        },
        { ...defaultOptions, ...customOptions }
      );
    });
  }, [defaultOptions, handlePositionUpdate, handleError]);

  /**
   * Start watching position (continuous updates)
   */
  const startWatching = useCallback((customOptions = {}) => {
    if (!navigator.geolocation) {
      setError({
        code: 'NOT_SUPPORTED',
        message: 'Geolocation is not supported by this browser.'
      });
      return;
    }

    // Stop existing watch if any
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    setIsLoading(true);
    setError(null);
    setIsWatching(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      handlePositionUpdate,
      handleError,
      { ...defaultOptions, ...customOptions }
    );

    return watchIdRef.current;
  }, [defaultOptions, handlePositionUpdate, handleError]);

  /**
   * Stop watching position
   */
  const stopWatching = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsWatching(false);
    }
  }, []);

  /**
   * Clear current position
   */
  const clearPosition = useCallback(() => {
    setPosition(null);
    setAccuracy(null);
    setHeading(null);
    setSpeed(null);
    setError(null);
  }, []);

  /**
   * Check geolocation support
   */
  const isGeolocationSupported = useCallback(() => {
    return !!navigator.geolocation;
  }, []);

  /**
   * Request location permission
   */
  const requestPermission = useCallback(async () => {
    try {
      const result = await navigator.permissions.query({ name: 'geolocation' });
      return result.state; // 'granted', 'denied', 'prompt'
    } catch (err) {
      // Safari doesn't support permissions query, try direct access
      try {
        await getCurrentPosition();
        return 'granted';
      } catch (permErr) {
        return 'denied';
      }
    }
  }, [getCurrentPosition]);

  /**
   * Get accuracy status
   */
  const getAccuracyStatus = useCallback(() => {
    if (!accuracy) return null;

    if (accuracy <= 10) return { level: 'excellent', color: 'green', text: 'Excellent' };
    if (accuracy <= 20) return { level: 'good', color: 'blue', text: 'Good' };
    if (accuracy <= 50) return { level: 'fair', color: 'yellow', text: 'Fair' };
    return { level: 'poor', color: 'red', text: 'Poor' };
  }, [accuracy]);

  /**
   * Format coordinates for display
   */
  const formatCoordinates = useCallback((lat, lon, precision = 6) => {
    if (lat === null || lon === null) return null;
    
    return {
      latitude: lat.toFixed(precision),
      longitude: lon.toFixed(precision),
      dms: {
        latitude: convertToDMS(lat, false),
        longitude: convertToDMS(lon, true)
      }
    };
  }, []);

  /**
   * Convert decimal degrees to DMS (Degrees, Minutes, Seconds)
   */
  const convertToDMS = (decimal, isLongitude) => {
    const absolute = Math.abs(decimal);
    const degrees = Math.floor(absolute);
    const minutesDecimal = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesDecimal);
    const seconds = ((minutesDecimal - minutes) * 60).toFixed(2);
    
    let direction;
    if (isLongitude) {
      direction = decimal >= 0 ? 'E' : 'W';
    } else {
      direction = decimal >= 0 ? 'N' : 'S';
    }
    
    return `${degrees}°${minutes}'${seconds}"${direction}`;
  };

  /**
   * Get distance to target and format result
   */
  const getDistanceToTarget = useCallback((targetLat, targetLon) => {
    if (!position) return null;

    const distance = calculateDistance(
      position.latitude,
      position.longitude,
      targetLat,
      targetLon
    );

    // Format distance
    if (distance < 1000) {
      return `${distance.toFixed(1)} m`;
    } else {
      return `${(distance / 1000).toFixed(2)} km`;
    }
  }, [position, calculateDistance]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return {
    // State
    position,
    error,
    isLoading,
    isWatching,
    accuracy,
    heading,
    speed,
    
    // Methods
    getCurrentPosition,
    startWatching,
    stopWatching,
    clearPosition,
    calculateDistance,
    isWithinRadius,
    isGeolocationSupported,
    requestPermission,
    getAccuracyStatus,
    formatCoordinates,
    getDistanceToTarget,
  };
};

export default useGeolocation;
