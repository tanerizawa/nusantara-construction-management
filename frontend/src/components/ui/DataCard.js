import React from 'react';
import Button from './Button';

const DataCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  description, 
  onClick, 
  className = '',
  isEmpty = false,
  action,
  actionText,
  children,
  ...restProps 
}) => {
  // Define valid DOM props to prevent React warnings
  const validDomProps = {};
  
  // Only include known valid DOM attributes
  const validAttributes = [
    'id', 'style', 'role', 'tabIndex',
    'onMouseEnter', 'onMouseLeave', 'onFocus', 'onBlur'
  ];
  
  Object.keys(restProps).forEach(key => {
    if (validAttributes.includes(key) || 
        key.startsWith('data-') || 
        key.startsWith('aria-')) {
      validDomProps[key] = restProps[key];
    }
  });

  // Handle empty state
  if (isEmpty) {
    return (
      <div 
        className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center py-12 ${className}`} 
        {...validDomProps}
      >
        <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {icon && <icon size={24} className="text-gray-400" />}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 mb-6">{description}</p>
        {action && (
          <Button variant="primary" onClick={action}>
            {actionText}
          </Button>
        )}
      </div>
    );
  }

  // Regular card state
  return (
    <div 
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow ${className}`}
      {...validDomProps}
      onClick={onClick}
    >
      {icon && (
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-50 rounded-lg mr-3">
            <icon size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            {description && <p className="text-sm text-gray-500">{description}</p>}
          </div>
        </div>
      )}
      
      {!icon && title && (
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      )}
      
      {value && (
        <div className="flex items-end justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {trend && (
              <p className={`text-sm font-medium ${
                trend.type === 'up' ? 'text-green-600' : 
                trend.type === 'down' ? 'text-red-600' : 'text-gray-500'
              }`}>
                {trend.value} {trend.label}
              </p>
            )}
          </div>
        </div>
      )}
      
      {description && !icon && (
        <p className="text-gray-500 mt-1">{description}</p>
      )}
      
      {children}
    </div>
  );
};

export default DataCard;
