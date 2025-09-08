import React from 'react';
import ReactDOM from 'react-dom';
import { X, AlertTriangle, Trash2, Archive } from 'lucide-react';

const ConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Konfirmasi',
  cancelText = 'Batal',
  type = 'default',
  projectName 
}) => {
  if (!isOpen) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <Trash2 className="w-8 h-8 text-red-500" />;
      case 'archive':
        return <Archive className="w-8 h-8 text-amber-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-blue-500" />;
    }
  };

  const getButtonClass = () => {
    switch (type) {
      case 'delete':
        return 'bg-red-600 hover:bg-red-700 text-white';
      case 'archive':
        return 'bg-amber-600 hover:bg-amber-700 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };

  const dialogContent = (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999999, // Super high z-index
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        boxSizing: 'border-box'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          position: 'relative',
          zIndex: 1000000
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: '24px 24px 0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
            <div style={{ flexShrink: 0 }}>
              {getIcon()}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                margin: '0 0 8px 0',
                color: '#111827'
              }}>
                {title}
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#6B7280',
                margin: 0 
              }}>
                Konfirmasi tindakan ini
              </p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '8px',
                borderRadius: '8px',
                color: '#9CA3AF'
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <p style={{ 
            fontSize: '14px', 
            color: '#374151', 
            lineHeight: '1.6',
            margin: '0 0 16px 0'
          }}>
            {message}
          </p>
          
          {projectName && (
            <div style={{
              backgroundColor: '#F3F4F6',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: '#6B7280',
                margin: '0 0 4px 0' 
              }}>
                Proyek:
              </p>
              <p style={{ 
                fontSize: '14px', 
                fontWeight: 'bold',
                color: '#111827',
                margin: 0 
              }}>
                {projectName}
              </p>
            </div>
          )}

          {type === 'delete' && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <p style={{ 
                fontSize: '12px', 
                color: '#B91C1C',
                fontWeight: 'bold',
                margin: '0 0 4px 0' 
              }}>
                ⚠️ Peringatan
              </p>
              <p style={{ 
                fontSize: '12px', 
                color: '#DC2626',
                margin: 0 
              }}>
                Data yang dihapus tidak dapat dikembalikan!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ 
          padding: '0 24px 24px 24px',
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              backgroundColor: 'white',
              border: '1px solid #D1D5DB',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#374151'
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              fontWeight: '500',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
            className={getButtonClass()}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );

  // Portal ke document.body dengan inline styles untuk menghindari CSS conflicts
  return ReactDOM.createPortal(dialogContent, document.body);
};

export default ConfirmationDialog;
