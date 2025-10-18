import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300); // Wait for fade out animation
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-400" />,
    error: <XCircle className="h-5 w-5 text-red-400" />,
    warning: <AlertCircle className="h-5 w-5 text-orange-400" />,
    info: <Info className="h-5 w-5 text-blue-400" />
  };

  const colors = {
    success: 'bg-green-500/10 border-green-500/20',
    error: 'bg-red-500/10 border-red-500/20',
    warning: 'bg-orange-500/10 border-orange-500/20',
    info: 'bg-blue-500/10 border-blue-500/20'
  };

  return (
    <div
      className={`fixed top-4 right-4 z-[100] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
      }`}
    >
      <div className={`flex items-center gap-3 p-4 rounded-lg border ${colors[type]} backdrop-blur-sm min-w-[300px] max-w-md shadow-xl`}>
        {icons[type]}
        <span className="flex-1 text-sm text-white">{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose && onClose(), 300);
          }}
          className="p-1 hover:bg-white/10 rounded transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Manager Component
export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  // Expose addToast globally
  useEffect(() => {
    window.showToast = (message, type = 'success', duration = 3000) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, message, type, duration }]);
    };

    return () => {
      delete window.showToast;
    };
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};

export default Toast;
