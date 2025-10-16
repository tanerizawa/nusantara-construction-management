import React from 'react';

const Badge = ({ 
  children,
  variant = 'default',
  size = 'md',
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-blue-100 text-blue-800',
    secondary: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-cyan-100 text-cyan-800',
    outline: 'border border-gray-200 text-gray-800 bg-transparent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;

  return (
    <span 
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export { Badge };
export default Badge;