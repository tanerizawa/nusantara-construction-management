import React from 'react';

const Button = ({ 
  children,
  variant = 'default',
  size = 'md',
  icon,
  iconPosition = 'left',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  ...props 
}) => {
  const variants = {
    default: 'bg-blue-600 hover:bg-blue-700 text-white',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800',
    outline: 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-300',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-800',
    link: 'bg-transparent text-blue-600 hover:underline p-0',
    success: 'bg-green-600 hover:bg-green-700 text-white',
    destructive: 'bg-red-600 hover:bg-red-700 text-white',
    warning: 'bg-amber-500 hover:bg-amber-600 text-white',
    info: 'bg-sky-500 hover:bg-sky-600 text-white',
  };

  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-5 py-2.5 text-lg',
    xl: 'px-6 py-3 text-xl',
  };

  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2';
  const variantClasses = variants[variant] || variants.default;
  const sizeClasses = sizes[size] || sizes.md;
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${disabledClasses} ${className}`;

  const handleClick = (e) => {
    if (disabled || loading) return;
    onClick && onClick(e);
  };

  return (
    <button 
      type={type}
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {icon && iconPosition === 'left' && !loading && <span className="mr-2">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && !loading && <span className="ml-2">{icon}</span>}
    </button>
  );
};

// Named exports
export { Button };

// Specialized Buttons
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="destructive" {...props} />;

// Default export
export default Button;