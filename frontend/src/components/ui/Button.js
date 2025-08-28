import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Enhanced Button Component - Apple HIG Compliant
 * 
 * @component
 * @example
 * // Primary button with icon
 * <Button variant="primary" size="md" icon={<SaveIcon />}>
 *   Simpan Data
 * </Button>
 * 
 * // Loading state
 * <Button variant="primary" loading>
 *   Memproses...
 * </Button>
 */

const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  loading = false,
  disabled = false,
  icon,
  children,
  className = '',
  ...props 
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'border',
    'cursor-pointer',
    'transition-all',
    'duration-150',
    'ease-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'disabled:transform-none',
    'disabled:shadow-none'
  ].join(' ');

  const variants = {
    primary: [
      'bg-primary-600',
      'hover:bg-primary-700',
      'active:bg-primary-800',
      'text-white',
      'border-transparent',
      'hover:shadow-md',
      'hover:-translate-y-0.5',
      'active:translate-y-0',
      'focus:ring-primary-500'
    ].join(' '),
    
    secondary: [
      'bg-white',
      'hover:bg-gray-50',
      'active:bg-gray-100',
      'text-gray-700',
      'border-gray-300',
      'hover:border-gray-400',
      'hover:shadow-sm',
      'hover:-translate-y-0.5',
      'active:translate-y-0',
      'focus:ring-primary-500'
    ].join(' '),
    
    danger: [
      'bg-error',
      'hover:brightness-95',
      'text-white',
      'border-transparent',
      'hover:shadow-md',
      'hover:-translate-y-0.5',
      'active:translate-y-0',
      'focus:ring-red-500'
    ].join(' '),
    
    ghost: [
      'bg-transparent',
      'hover:bg-gray-100',
      'active:bg-gray-200',
      'text-gray-700',
      'border-transparent',
      'focus:ring-primary-500'
    ].join(' ')
  };

  const sizes = {
    xs: [
      'px-2',
      'py-1',
      'text-xs',
      'rounded-md',
      'gap-1',
      'min-h-[28px]'
    ].join(' '),
    
    sm: [
      'px-3',
      'py-1.5',
      'text-sm',
      'rounded-md',
      'gap-1.5',
      'min-h-[32px]'
    ].join(' '),
    
    md: [
      'px-4',
      'py-2',
      'text-sm',
      'rounded-lg',
      'gap-2',
      'min-h-[40px]'
    ].join(' '),
    
    lg: [
      'px-6',
      'py-3',
      'text-base',
      'rounded-lg',
      'gap-2',
      'min-h-[44px]'
    ].join(' '),
    
    xl: [
      'px-8',
      'py-4',
      'text-lg',
      'rounded-xl',
      'gap-3',
      'min-h-[48px]'
    ].join(' ')
  };

  const classes = [
    baseClasses,
    variants[variant],
    sizes[size],
    className
  ].join(' ');

  const iconSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20
  };

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 
            size={iconSize[size]} 
            className="animate-spin" 
          />
          {children && <span>Memproses...</span>}
        </>
      ) : (
        <>
          {icon && (
            <span className="flex-shrink-0">
              {React.isValidElement(icon) 
                ? React.cloneElement(icon, { size: iconSize[size] })
                : icon
              }
            </span>
          )}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
};

// Button variants for convenience
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;

export default Button;
