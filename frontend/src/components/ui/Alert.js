import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

/**
 * Alert and Toast Notification System - Apple HIG Compliant
 * 
 * Comprehensive notification system with various alert types and toast notifications
 * Following Apple Human Interface Guidelines for clear communication
 */

// Alert Component
export const Alert = ({
  type = 'info',
  title,
  message,
  children,
  dismissible = false,
  onDismiss,
  icon,
  actions,
  className = '',
  ...props
}) => {
  const types = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
      defaultIcon: <CheckCircle />
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
      defaultIcon: <AlertTriangle />
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
      defaultIcon: <AlertCircle />
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-600',
      defaultIcon: <Info />
    }
  };
  
  const config = types[type];
  const alertIcon = icon || config.defaultIcon;
  
  return (
    <div
      className={`
        relative rounded-lg border p-4
        ${config.bgColor} ${config.borderColor} ${config.textColor}
        ${className}
      `}
      role="alert"
      {...props}
    >
      <div className="flex">
        {/* Icon */}
        <div className="flex-shrink-0">
          {React.cloneElement(alertIcon, { 
            size: 20, 
            className: config.iconColor 
          })}
        </div>
        
        {/* Content */}
        <div className="ml-3 flex-1">
          {title && (
            <h3 className="text-sm font-medium mb-1">
              {title}
            </h3>
          )}
          
          {message && (
            <div className="text-sm">
              {message}
            </div>
          )}
          
          {children && (
            <div className="text-sm">
              {children}
            </div>
          )}
          
          {/* Actions */}
          {actions && (
            <div className="mt-3 flex space-x-2">
              {actions}
            </div>
          )}
        </div>
        
        {/* Dismiss Button */}
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onDismiss}
                className={`
                  inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${config.textColor} hover:${config.bgColor} focus:ring-offset-${config.bgColor.split('-')[1]}-50 focus:ring-${config.iconColor.split('-')[1]}-600
                `}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Context and Provider
const ToastContext = React.createContext();

export const ToastProvider = ({ children, position = 'top-right', maxToasts = 5 }) => {
  const [toasts, setToasts] = useState([]);
  
  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { 
      id, 
      ...toast,
      createdAt: Date.now()
    };
    
    setToasts(prevToasts => {
      const newToasts = [newToast, ...prevToasts];
      return newToasts.slice(0, maxToasts);
    });
    
    // Auto dismiss
    if (toast.autoClose !== false) {
      const duration = toast.duration || 5000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    
    return id;
  };
  
  const removeToast = (id) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
  };
  
  const removeAllToasts = () => {
    setToasts([]);
  };
  
  const positions = {
    'top-left': 'top-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-4 right-4'
  };
  
  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      
      {/* Toast Container */}
      <div className={`fixed z-50 ${positions[position]} pointer-events-none`}>
        <div className="flex flex-col space-y-2">
          {toasts.map(toast => (
            <Toast
              key={toast.id}
              {...toast}
              onDismiss={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

// Toast Hook
export const useToast = () => {
  const context = React.useContext(ToastContext);
  
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  
  const { addToast, removeToast, removeAllToasts } = context;
  
  const toast = {
    success: (message, options = {}) => 
      addToast({ type: 'success', message, ...options }),
    
    error: (message, options = {}) => 
      addToast({ type: 'error', message, ...options }),
    
    warning: (message, options = {}) => 
      addToast({ type: 'warning', message, ...options }),
    
    info: (message, options = {}) => 
      addToast({ type: 'info', message, ...options }),
    
    custom: (options) => 
      addToast(options),
    
    dismiss: removeToast,
    dismissAll: removeAllToasts
  };
  
  return toast;
};

// Toast Component
export const Toast = ({
  type = 'info',
  title,
  message,
  children,
  dismissible = true,
  onDismiss,
  icon,
  actions,
  progress = false,
  duration = 5000,
  className = '',
  ...props
}) => {
  const [visible, setVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(100);
  
  const types = {
    success: {
      bgColor: 'bg-white',
      borderColor: 'border-green-200',
      textColor: 'text-gray-900',
      iconColor: 'text-green-600',
      progressColor: 'bg-green-500',
      defaultIcon: <CheckCircle />
    },
    warning: {
      bgColor: 'bg-white',
      borderColor: 'border-yellow-200',
      textColor: 'text-gray-900',
      iconColor: 'text-yellow-600',
      progressColor: 'bg-yellow-500',
      defaultIcon: <AlertTriangle />
    },
    error: {
      bgColor: 'bg-white',
      borderColor: 'border-red-200',
      textColor: 'text-gray-900',
      iconColor: 'text-red-600',
      progressColor: 'bg-red-500',
      defaultIcon: <AlertCircle />
    },
    info: {
      bgColor: 'bg-white',
      borderColor: 'border-blue-200',
      textColor: 'text-gray-900',
      iconColor: 'text-blue-600',
      progressColor: 'bg-blue-500',
      defaultIcon: <Info />
    }
  };
  
  const config = types[type];
  const toastIcon = icon || config.defaultIcon;
  
  // Animation and progress effect
  useEffect(() => {
    setVisible(true);
    
    if (progress && duration > 0) {
      const interval = setInterval(() => {
        setProgressWidth(prev => {
          const newWidth = prev - (100 / (duration / 100));
          return newWidth <= 0 ? 0 : newWidth;
        });
      }, 100);
      
      return () => clearInterval(interval);
    }
  }, [progress, duration]);
  
  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 150);
  };
  
  return (
    <div
      className={`
        pointer-events-auto relative w-full max-w-sm
        transform transition-all duration-300 ease-out
        ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      {...props}
    >
      <div
        className={`
          rounded-lg border shadow-lg p-4
          ${config.bgColor} ${config.borderColor} ${config.textColor}
          ${className}
        `}
      >
        <div className="flex">
          {/* Icon */}
          <div className="flex-shrink-0">
            {React.cloneElement(toastIcon, { 
              size: 20, 
              className: config.iconColor 
            })}
          </div>
          
          {/* Content */}
          <div className="ml-3 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            
            {message && (
              <p className={`text-sm ${title ? 'mt-1 text-gray-600' : ''}`}>
                {message}
              </p>
            )}
            
            {children && (
              <div className="text-sm">
                {children}
              </div>
            )}
            
            {/* Actions */}
            {actions && (
              <div className="mt-3 flex space-x-2">
                {actions}
              </div>
            )}
          </div>
          
          {/* Dismiss Button */}
          {dismissible && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                onClick={handleDismiss}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {progress && (
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-all duration-100 ease-linear ${config.progressColor}`}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Notification Banner
export const NotificationBanner = ({
  type = 'info',
  title,
  message,
  children,
  dismissible = true,
  onDismiss,
  icon,
  actions,
  sticky = false,
  className = '',
  ...props
}) => {
  const [visible, setVisible] = useState(true);
  
  const types = {
    success: {
      bgColor: 'bg-green-600',
      textColor: 'text-white',
      iconColor: 'text-green-100',
      defaultIcon: <CheckCircle />
    },
    warning: {
      bgColor: 'bg-yellow-600',
      textColor: 'text-white',
      iconColor: 'text-yellow-100',
      defaultIcon: <AlertTriangle />
    },
    error: {
      bgColor: 'bg-red-600',
      textColor: 'text-white',
      iconColor: 'text-red-100',
      defaultIcon: <AlertCircle />
    },
    info: {
      bgColor: 'bg-blue-600',
      textColor: 'text-white',
      iconColor: 'text-blue-100',
      defaultIcon: <Info />
    }
  };
  
  const config = types[type];
  const bannerIcon = icon || config.defaultIcon;
  
  const handleDismiss = () => {
    setVisible(false);
    setTimeout(() => {
      onDismiss?.();
    }, 300);
  };
  
  if (!visible) return null;
  
  return (
    <div
      className={`
        ${config.bgColor} ${config.textColor}
        transform transition-all duration-300 ease-out
        ${sticky ? 'sticky top-0 z-40' : ''}
        ${className}
      `}
      {...props}
    >
      <div className="max-w-7xl mx-auto py-3 px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between flex-wrap">
          <div className="w-0 flex-1 flex items-center">
            {/* Icon */}
            <span className="flex p-2 rounded-lg">
              {React.cloneElement(bannerIcon, { 
                size: 20, 
                className: config.iconColor 
              })}
            </span>
            
            {/* Content */}
            <div className="ml-3">
              {title && (
                <p className="font-medium">
                  {title}
                </p>
              )}
              
              {message && (
                <p className={`${title ? 'text-sm opacity-90' : ''}`}>
                  {message}
                </p>
              )}
              
              {children}
            </div>
          </div>
          
          {/* Actions */}
          {actions && (
            <div className="order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto">
              {actions}
            </div>
          )}
          
          {/* Dismiss Button */}
          {dismissible && (
            <div className="order-2 flex-shrink-0 sm:order-3 sm:ml-3">
              <button
                type="button"
                onClick={handleDismiss}
                className="flex p-2 rounded-md hover:bg-black hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X size={16} className={config.iconColor} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Contextual Notifications for YK Project
export const ProjectAlert = ({ status, project, ...props }) => {
  const alerts = {
    'overdue': {
      type: 'error',
      title: 'Proyek Terlambat',
      message: `Proyek "${project?.name}" melewati deadline yang ditentukan.`
    },
    'near-deadline': {
      type: 'warning',
      title: 'Mendekati Deadline',
      message: `Proyek "${project?.name}" akan mencapai deadline dalam 3 hari.`
    },
    'completed': {
      type: 'success',
      title: 'Proyek Selesai',
      message: `Proyek "${project?.name}" telah diselesaikan dengan sukses.`
    }
  };
  
  const config = alerts[status];
  return config ? <Alert {...config} {...props} /> : null;
};

export const InventoryAlert = ({ type, item, quantity, ...props }) => {
  const alerts = {
    'low-stock': {
      type: 'warning',
      title: 'Stok Menipis',
      message: `Stok ${item?.name} tersisa ${quantity} unit. Segera lakukan pemesanan ulang.`
    },
    'out-of-stock': {
      type: 'error',
      title: 'Stok Habis',
      message: `${item?.name} sudah habis. Pemesanan tidak dapat diproses.`
    },
    'received': {
      type: 'success',
      title: 'Barang Diterima',
      message: `${quantity} unit ${item?.name} telah diterima dan ditambahkan ke inventory.`
    }
  };
  
  const config = alerts[type];
  return config ? <Alert {...config} {...props} /> : null;
};

export const PaymentAlert = ({ status, amount, invoice, ...props }) => {
  const alerts = {
    'overdue': {
      type: 'error',
      title: 'Pembayaran Terlambat',
      message: `Invoice ${invoice} dengan nilai ${amount} sudah melewati jatuh tempo.`
    },
    'received': {
      type: 'success',
      title: 'Pembayaran Diterima',
      message: `Pembayaran sebesar ${amount} untuk invoice ${invoice} telah diterima.`
    },
    'pending': {
      type: 'warning',
      title: 'Menunggu Pembayaran',
      message: `Invoice ${invoice} dengan nilai ${amount} menunggu pembayaran.`
    }
  };
  
  const config = alerts[status];
  return config ? <Alert {...config} {...props} /> : null;
};

// Add static methods for Alert
Alert.success = (message, options = {}) => {
  // In a real implementation, this would trigger a toast notification
  console.log('Success:', message);
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`✓ ${message}`);
  }
};

Alert.error = (message, options = {}) => {
  // In a real implementation, this would trigger a toast notification
  console.error('Error:', message);
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`✗ ${message}`);
  }
};

Alert.warning = (message, options = {}) => {
  console.warn('Warning:', message);
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`⚠ ${message}`);
  }
};

Alert.info = (message, options = {}) => {
  console.info('Info:', message);
  if (typeof window !== 'undefined' && window.alert) {
    window.alert(`ℹ ${message}`);
  }
};

const AlertComponents = {
  Alert,
  Toast,
  ToastProvider,
  useToast,
  NotificationBanner,
  ProjectAlert,
  InventoryAlert,
  PaymentAlert
};

export default AlertComponents;
