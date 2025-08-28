import React from 'react';

/**
 * Enhanced Card Component - Apple HIG Compliant
 * 
 * @component
 * @example
 * // Basic card
 * <Card>
 *   <h3>Card Title</h3>
 *   <p>Card content goes here</p>
 * </Card>
 * 
 * // Hoverable card with custom padding
 * <Card hover padding="lg" onClick={() => navigate('/detail')}>
 *   <h3>Clickable Card</h3>
 * </Card>
 */

const Card = ({ 
  children, 
  className = '',
  hover = false,
  padding = 'md',
  elevation = 'sm',
  as: Component = 'div',
  ...props 
}) => {
  const baseClasses = [
    'bg-white',
    'border',
    'border-gray-200/70',
    'transition-all',
    'duration-200',
    'ease-out'
  ].join(' ');

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6', 
    lg: 'p-8',
    xl: 'p-10'
  };

  const elevationClasses = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  };

  const roundedClasses = {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl'
  };

  const hoverClasses = hover ? [
    'hover:shadow-md',
    'hover:border-gray-300',
    'hover:-translate-y-0.5',
    'cursor-pointer'
  ].join(' ') : '';

  const classes = [
    baseClasses,
    paddingClasses[padding],
    elevationClasses[elevation],
    roundedClasses['lg'], // Default to lg rounded
    hoverClasses,
    className
  ].join(' ');

  return (
    <Component
      className={classes}
      {...props}
    >
      {children}
    </Component>
  );
};

// Card variants for specific use cases
export const KPICard = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  loading = false,
  ...props 
}) => {
  if (loading) {
    return (
      <Card {...props}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover {...props}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-600 truncate">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 mt-1">
            {value}
          </p>
          {change && (
            <p className={`text-sm mt-1 ${
              trend === 'up' 
                ? 'text-success' 
                : trend === 'down' 
                ? 'text-error' 
                : 'text-gray-500'
            }`}>
              {change}
            </p>
          )}
        </div>
        {Icon && (
          <div className="ml-4 flex-shrink-0">
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const DataCard = ({ 
  title, 
  subtitle, 
  status, 
  actions, 
  children,
  onClick,
  ...props 
}) => {
  const statusColors = {
    active: 'text-success bg-green-50 border-green-200',
    inactive: 'text-error bg-red-50 border-red-200',
    pending: 'text-warning bg-yellow-50 border-yellow-200',
    completed: 'text-info bg-blue-50 border-blue-200',
    default: 'text-gray-600 bg-gray-50 border-gray-200'
  };

  return (
    <Card 
      hover={!!onClick} 
      onClick={onClick}
      {...props}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">
              {subtitle}
            </p>
          )}
        </div>
        {status && (
          <span className={`
            inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
            ${statusColors[status] || statusColors.default}
          `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        )}
      </div>

      {/* Content */}
      {children && (
        <div className="mb-4">
          {children}
        </div>
      )}

      {/* Actions */}
      {actions && (
        <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
          {actions}
        </div>
      )}
    </Card>
  );
};

export const StatsCard = ({ 
  label, 
  value, 
  unit, 
  comparison,
  trend,
  ...props 
}) => {
  return (
    <Card {...props}>
      <div className="text-center">
        <div className="text-3xl font-bold text-gray-900">
          {value}
          {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
        </div>
        <div className="text-sm font-medium text-gray-600 mt-1">
          {label}
        </div>
        {comparison && (
          <div className={`text-xs mt-2 ${
            trend === 'up' 
              ? 'text-success' 
              : trend === 'down' 
              ? 'text-error' 
              : 'text-gray-500'
          }`}>
            {comparison}
          </div>
        )}
      </div>
    </Card>
  );
};

export default Card;
