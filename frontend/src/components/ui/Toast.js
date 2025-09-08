import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CheckCircle, AlertTriangle, X, Info } from 'lucide-react';

const Toast = ({ 
  message, 
  type = 'success',
  duration = 4000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />;
      case 'error':
        return <AlertTriangle style={{ width: '20px', height: '20px', color: '#EF4444' }} />;
      case 'warning':
        return <AlertTriangle style={{ width: '20px', height: '20px', color: '#F59E0B' }} />;
      case 'info':
        return <Info style={{ width: '20px', height: '20px', color: '#3B82F6' }} />;
      default:
        return <CheckCircle style={{ width: '20px', height: '20px', color: '#10B981' }} />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return '#F0FDF4';
      case 'error':
        return '#FEF2F2';
      case 'warning':
        return '#FFFBEB';
      case 'info':
        return '#EFF6FF';
      default:
        return '#F0FDF4';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#BBF7D0';
      case 'error':
        return '#FECACA';
      case 'warning':
        return '#FDE68A';
      case 'info':
        return '#DBEAFE';
      default:
        return '#BBF7D0';
    }
  };

  const toastContent = (
    <div 
      style={{
        minWidth: '320px',
        maxWidth: '400px',
        padding: '16px',
        backgroundColor: getBackgroundColor(),
        border: `1px solid ${getBorderColor()}`,
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        transform: isVisible ? 'translateX(0) scale(1)' : 'translateX(100%) scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.3s ease-out',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>
          {getIcon()}
        </div>
        <div style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#1F2937', lineHeight: '1.4' }}>
          {message}
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            color: '#9CA3AF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X style={{ width: '16px', height: '16px' }} />
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(toastContent, document.body);
};

// Toast Container Component
const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success', duration = 4000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    window.showToast = addToast;
    return () => {
      delete window.showToast;
    };
  }, []);

  const containerContent = (
    <div 
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 999998,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast) => (
        <div key={toast.id} style={{ pointerEvents: 'auto' }}>
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        </div>
      ))}
    </div>
  );

  return ReactDOM.createPortal(containerContent, document.body);
};

export { Toast, ToastContainer };
export default Toast;
