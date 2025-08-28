import React, { useRef, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';

/**
 * Modal and Dialog Components - Apple HIG Compliant
 * 
 * Comprehensive modal system with various dialog types
 * Following Apple Human Interface Guidelines for clear hierarchy and interaction
 */

// Base Modal Component
export const Modal = ({
  isOpen = false,
  onClose,
  children,
  size = 'md',
  centered = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  backdrop = 'blur',
  className = '',
  ...props
}) => {
  const modalRef = useRef(null);
  
  const sizes = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-none mx-4'
  };
  
  const backdrops = {
    blur: 'backdrop-blur-sm bg-black/50',
    dark: 'bg-black/60',
    light: 'bg-white/80'
  };
  
  // Handle escape key
  useEffect(() => {
    if (!closeOnEscape || !isOpen) return;
    
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose?.();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [closeOnEscape, isOpen, onClose]);
  
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  // Handle backdrop click
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose?.();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div
      className={`fixed inset-0 z-50 ${backdrops[backdrop]} transition-all duration-300`}
      onClick={handleBackdropClick}
      {...props}
    >
      <div className={`
        flex min-h-full items-center justify-center p-4
        ${centered ? 'items-center' : 'items-start pt-16'}
      `}>
        <div
          ref={modalRef}
          className={`
            relative w-full ${sizes[size]} transform transition-all duration-300
            bg-white rounded-2xl shadow-2xl
            ${className}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
            >
              <X size={20} className="text-gray-600" />
            </button>
          )}
          
          {children}
        </div>
      </div>
    </div>
  );
};

// Modal Header
export const ModalHeader = ({ 
  title, 
  subtitle, 
  icon,
  className = '',
  ...props 
}) => {
  return (
    <div className={`px-6 py-5 border-b border-gray-200 ${className}`} {...props}>
      <div className="flex items-center space-x-3">
        {icon && (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            {React.cloneElement(icon, { size: 20, className: 'text-blue-600' })}
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Modal Body
export const ModalBody = ({ 
  children, 
  className = '',
  padding = true,
  ...props 
}) => {
  return (
    <div 
      className={`
        ${padding ? 'px-6 py-5' : ''}
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

// Modal Footer
export const ModalFooter = ({ 
  children, 
  className = '',
  justify = 'end',
  ...props 
}) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };
  
  return (
    <div 
      className={`
        px-6 py-4 border-t border-gray-200 bg-gray-50
        flex items-center space-x-3 ${justifyClasses[justify]}
        rounded-b-2xl
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
};

// Confirm Dialog
export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  message = 'Apakah Anda yakin ingin melanjutkan?',
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  variant = 'warning',
  icon,
  loading = false,
  ...props
}) => {
  const variants = {
    success: { 
      icon: <Check />, 
      confirmClass: 'bg-green-600 hover:bg-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    warning: { 
      icon: <AlertCircle />, 
      confirmClass: 'bg-yellow-600 hover:bg-yellow-700',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    danger: { 
      icon: <AlertCircle />, 
      confirmClass: 'bg-red-600 hover:bg-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    info: { 
      icon: <AlertCircle />, 
      confirmClass: 'bg-blue-600 hover:bg-blue-700',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  };
  
  const config = variants[variant];
  const dialogIcon = icon || config.icon;
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" {...props}>
      <ModalBody className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {React.cloneElement(dialogIcon, { size: 24, className: config.iconColor })}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {/* Actions */}
        <div className="flex space-x-3 justify-center">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors duration-200 disabled:opacity-50 ${config.confirmClass}`}
          >
            {loading ? 'Memproses...' : confirmText}
          </button>
        </div>
      </ModalBody>
    </Modal>
  );
};

// Alert Dialog
export const AlertDialog = ({
  isOpen,
  onClose,
  title = 'Perhatian',
  message,
  type = 'info',
  actionText = 'OK',
  ...props
}) => {
  const types = {
    success: { 
      icon: <Check />, 
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    warning: { 
      icon: <AlertCircle />, 
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    error: { 
      icon: <AlertCircle />, 
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    info: { 
      icon: <AlertCircle />, 
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    }
  };
  
  const config = types[type];
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" {...props}>
      <ModalBody className="text-center">
        {/* Icon */}
        <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
          {React.cloneElement(config.icon, { size: 24, className: config.iconColor })}
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">
          {message}
        </p>
        
        {/* Action */}
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          {actionText}
        </button>
      </ModalBody>
    </Modal>
  );
};

// Form Modal
export const FormModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  subtitle,
  icon,
  children,
  submitText = 'Simpan',
  cancelText = 'Batal',
  loading = false,
  submitDisabled = false,
  size = 'lg',
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(e);
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size={size} {...props}>
      <form onSubmit={handleSubmit}>
        <ModalHeader title={title} subtitle={subtitle} icon={icon} />
        
        <ModalBody>
          {children}
        </ModalBody>
        
        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50"
          >
            {cancelText}
          </button>
          
          <button
            type="submit"
            disabled={loading || submitDisabled}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : submitText}
          </button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

// Drawer Component (Side Modal)
export const Drawer = ({
  isOpen = false,
  onClose,
  children,
  position = 'right',
  size = 'md',
  overlay = true,
  className = '',
  ...props
}) => {
  const positions = {
    left: {
      container: 'justify-start',
      panel: 'transform transition-transform duration-300',
      open: 'translate-x-0',
      closed: '-translate-x-full'
    },
    right: {
      container: 'justify-end',
      panel: 'transform transition-transform duration-300',
      open: 'translate-x-0',
      closed: 'translate-x-full'
    },
    top: {
      container: 'items-start',
      panel: 'transform transition-transform duration-300 w-full',
      open: 'translate-y-0',
      closed: '-translate-y-full'
    },
    bottom: {
      container: 'items-end',
      panel: 'transform transition-transform duration-300 w-full',
      open: 'translate-y-0',
      closed: 'translate-y-full'
    }
  };
  
  const sizes = {
    sm: position === 'left' || position === 'right' ? 'w-80' : 'h-80',
    md: position === 'left' || position === 'right' ? 'w-96' : 'h-96',
    lg: position === 'left' || position === 'right' ? 'w-[32rem]' : 'h-[32rem]',
    xl: position === 'left' || position === 'right' ? 'w-[40rem]' : 'h-[40rem]',
    full: position === 'left' || position === 'right' ? 'w-full' : 'h-full'
  };
  
  const positionConfig = positions[position];
  
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50" {...props}>
      {/* Overlay */}
      {overlay && (
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Drawer Container */}
      <div className={`relative h-full flex ${positionConfig.container}`}>
        {/* Drawer Panel */}
        <div className={`
          ${positionConfig.panel}
          ${sizes[size]}
          ${isOpen ? positionConfig.open : positionConfig.closed}
          bg-white shadow-2xl
          ${position === 'left' || position === 'right' ? 'h-full' : ''}
          ${className}
        `}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Drawer Header
export const DrawerHeader = ({ 
  title, 
  subtitle, 
  onClose,
  className = '',
  ...props 
}) => {
  return (
    <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${className}`} {...props}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm text-gray-500 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        >
          <X size={20} className="text-gray-600" />
        </button>
      )}
    </div>
  );
};

// Drawer Body
export const DrawerBody = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`flex-1 overflow-y-auto px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
};

// Drawer Footer
export const DrawerFooter = ({ 
  children, 
  className = '',
  ...props 
}) => {
  return (
    <div className={`px-6 py-4 border-t border-gray-200 bg-gray-50 ${className}`} {...props}>
      {children}
    </div>
  );
};

const ModalComponents = {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ConfirmDialog,
  AlertDialog,
  FormModal,
  Drawer,
  DrawerHeader,
  DrawerBody,
  DrawerFooter
};

export default ModalComponents;
