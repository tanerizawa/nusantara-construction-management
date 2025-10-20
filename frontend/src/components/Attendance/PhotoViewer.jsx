import React, { useEffect } from 'react';
import './PhotoViewer.css';

/**
 * PhotoViewer Component
 * 
 * Modal for viewing attendance photos
 * Features:
 * - Full-screen image view
 * - Click outside to close
 * - ESC key to close
 * - Pinch-to-zoom support (touch devices)
 */
const PhotoViewer = ({ photoUrl, onClose }) => {
  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="photo-viewer-modal" onClick={handleBackdropClick}>
      <div className="modal-backdrop" />
      
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h3>Attendance Photo</h3>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Photo */}
        <div className="modal-body">
          <img 
            src={photoUrl} 
            alt="Attendance" 
            className="attendance-photo"
            loading="lazy"
          />
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <p className="photo-hint">
            Click outside or press ESC to close
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotoViewer;
