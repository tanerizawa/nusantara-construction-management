import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'blue',
  onClick 
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600', 
    red: 'bg-red-50 text-red-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    gray: 'bg-gray-50 text-gray-600'
  };

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  return (
    <div 
      className={`card relative overflow-hidden ${onClick ? 'cursor-pointer hover:shadow-md' : ''} transition-shadow`}
      onClick={onClick}
    >
      {/* Background Pattern */}
      <div className="absolute right-0 top-0 opacity-10 transform translate-x-4 -translate-y-2">
        {Icon && <Icon size={96} />}
      </div>
      
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color] || colorClasses.blue}`}>
          {Icon && <Icon size={24} />}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center mt-1 text-xs ${trendClasses[trend.direction] || trendClasses.neutral}`}>
              {trend.direction === 'up' && <TrendingUp size={12} className="mr-1" />}
              {trend.direction === 'down' && <TrendingDown size={12} className="mr-1" />}
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KPICard;
