import React, { useState, useEffect } from 'react';
import { RefreshCw, X } from 'lucide-react';

/**
 * PWA Update Notification Component
 * Shows banner when new version is available
 */
const PWAUpdateNotification = () => {
  const [showUpdate, setShowUpdate] = useState(false);
  const [registration, setRegistration] = useState(null);

  useEffect(() => {
    // Listen for SW update event
    const handleUpdate = (event) => {
      setRegistration(event.detail.registration);
      setShowUpdate(true);
    };

    window.addEventListener('swUpdate', handleUpdate);

    return () => {
      window.removeEventListener('swUpdate', handleUpdate);
    };
  }, []);

  const handleUpdate = () => {
    if (!registration || !registration.waiting) {
      return;
    }

    // Tell SW to skip waiting
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });

    // Reload after SW activates
    setShowUpdate(false);
    
    // Give SW time to activate
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 max-w-md bg-white border-2 border-blue-500 rounded-lg shadow-2xl z-50 animate-slide-down">
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <RefreshCw className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Update Available</h3>
              <p className="text-sm text-gray-600">
                A new version of the app is ready
              </p>
            </div>
          </div>
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center justify-end space-x-2">
          <button
            onClick={handleDismiss}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Later
          </button>
          <button
            onClick={handleUpdate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Update Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAUpdateNotification;
