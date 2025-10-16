/**
 * Cell renderer utilities for different data types
 */

import React from 'react';
import { formatCurrency, formatDate, formatLocation, formatPercentage } from './tableUtils';
import { BADGE_CONFIGS } from '../config/columnConfig';

/**
 * Render badge component
 */
export const renderBadge = (value, type = 'status') => {
  const config = BADGE_CONFIGS[type]?.[value] || {
    color: 'bg-gray-100 text-gray-800',
    text: value || '-'
  };
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
      {config.text}
    </span>
  );
};

/**
 * Render progress bar
 */
export const renderProgress = (percentage, status) => {
  const value = Math.min(Math.max(percentage || 0, 0), 100);
  
  const getProgressColor = (status, percentage) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'on-hold') return 'bg-gray-500';
    if (status === 'cancelled') return 'bg-red-500';
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 50) return 'bg-blue-500';
    if (percentage >= 20) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{value}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(status, value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

/**
 * Render user avatar and info
 */
export const renderUser = (userData) => {
  const { fullName, email, username, role, avatar } = userData;
  
  const getInitials = (name) => {
    return name
      ? name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()
      : '?';
  };
  
  const getRoleIcon = (role) => {
    if (role === 'admin') {
      return <shield size={16} className="text-red-600" />;
    }
    return <user size={16} className="text-blue-600" />;
  };
  
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
        {avatar ? (
          <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <span className="text-sm font-medium text-blue-600">
            {getInitials(fullName || username)}
          </span>
        )}
      </div>
      <div className="ml-3">
        <div className="font-medium text-gray-900">
          {fullName || username || '-'}
        </div>
        <div className="text-sm text-gray-500">{email || '-'}</div>
        {username && (
          <div className="text-xs text-gray-400">@{username}</div>
        )}
      </div>
    </div>
  );
};

/**
 * Render project info
 */
export const renderProject = (projectData) => {
  const { name, client, location, status } = projectData;
  
  return (
    <div>
      <div className="font-medium text-gray-900">{name || '-'}</div>
      <div className="text-sm text-gray-500">{client || '-'}</div>
      <div className="text-xs text-gray-400">{formatLocation(location)}</div>
      {status && (
        <div className="mt-1">
          {renderBadge(status, 'status')}
        </div>
      )}
    </div>
  );
};

/**
 * Render inventory item
 */
export const renderInventoryItem = (itemData) => {
  const { name, code, category, image } = itemData;
  
  return (
    <div className="flex items-center">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xs font-medium text-gray-500">
            {code ? code.substring(0, 2).toUpperCase() : '??'}
          </span>
        )}
      </div>
      <div className="ml-3">
        <div className="font-medium text-gray-900">{name || '-'}</div>
        <div className="text-sm text-gray-500">{code || '-'}</div>
        <div className="text-xs text-gray-400">{category || '-'}</div>
      </div>
    </div>
  );
};

/**
 * Render stock info with status
 */
export const renderStock = (stockData) => {
  const { current, minimum, unit } = stockData;
  
  const getStockStatus = (current, minimum) => {
    if (current === 0) return 'out-of-stock';
    if (current <= minimum) return 'low-stock';
    return 'available';
  };
  
  const status = getStockStatus(current, minimum);
  
  return (
    <div className="text-center">
      <div className="font-medium text-gray-900">
        {current} {unit || 'pcs'}
      </div>
      <div className="text-xs text-gray-500">
        Min: {minimum} {unit || 'pcs'}
      </div>
      <div className="mt-1">
        {renderBadge(status, 'inventoryStatus')}
      </div>
    </div>
  );
};

/**
 * Render financial amount with type
 */
export const renderFinancialAmount = (amountData) => {
  const { amount, type } = amountData;
  
  const colorClass = type === 'debit' 
    ? 'text-red-600' 
    : type === 'credit' 
    ? 'text-green-600' 
    : 'text-gray-900';
  
  const prefix = type === 'debit' ? '-' : type === 'credit' ? '+' : '';
  
  return (
    <div className={`font-medium ${colorClass}`}>
      {prefix}{formatCurrency(amount)}
    </div>
  );
};

/**
 * Render transaction info
 */
export const renderTransaction = (transactionData) => {
  const { reference, description, date } = transactionData;
  
  return (
    <div>
      <div className="font-medium text-gray-900">{reference || '-'}</div>
      <div className="text-sm text-gray-500">{description || '-'}</div>
      <div className="text-xs text-gray-400">{formatDate(date)}</div>
    </div>
  );
};

/**
 * Render account info
 */
export const renderAccount = (accountData) => {
  const { code, name } = accountData;
  
  return (
    <div>
      <div className="font-medium text-gray-900">{name || '-'}</div>
      <div className="text-sm text-gray-500">{code || '-'}</div>
    </div>
  );
};

/**
 * Render timeline info
 */
export const renderTimeline = (timelineData) => {
  const { startDate, endDate } = timelineData;
  
  const formatDateRange = (start, end) => {
    const startFormatted = formatDate(start, { dateStyle: 'short' });
    const endFormatted = formatDate(end, { dateStyle: 'short' });
    
    if (startFormatted === '-' && endFormatted === '-') return '-';
    if (startFormatted === '-') return `Sampai ${endFormatted}`;
    if (endFormatted === '-') return `Dari ${startFormatted}`;
    
    return `${startFormatted} - ${endFormatted}`;
  };
  
  return (
    <div className="text-sm text-gray-600">
      {formatDateRange(startDate, endDate)}
    </div>
  );
};

/**
 * Main cell renderer - routes to appropriate renderer based on data type
 */
export const renderCell = (cellData, dataType) => {
  if (!cellData || !cellData.type) {
    return <span className="text-gray-500">-</span>;
  }
  
  const { type, data } = cellData;
  
  switch (type) {
    case 'badge':
      return renderBadge(data.value, data.badgeType);
    
    case 'progress':
      return renderProgress(data.percentage, data.status);
    
    case 'user':
      return renderUser(data);
    
    case 'project':
      return renderProject(data);
    
    case 'inventory_item':
      return renderInventoryItem(data);
    
    case 'stock':
      return renderStock(data);
    
    case 'financial_amount':
      return renderFinancialAmount(data);
    
    case 'transaction':
      return renderTransaction(data);
    
    case 'account':
      return renderAccount(data);
    
    case 'timeline':
      return renderTimeline(data);
    
    case 'currency':
      return <span className="font-medium">{formatCurrency(data)}</span>;
    
    case 'percentage':
      return <span className="font-medium">{formatPercentage(data)}</span>;
    
    case 'date':
      return <span>{formatDate(data)}</span>;
    
    case 'location':
      return <span>{formatLocation(data)}</span>;
    
    case 'user_role':
      return renderBadge(data, 'userRole');
    
    case 'user_status':
      return renderBadge(data ? 'active' : 'inactive', 'status');
    
    case 'inventory_status':
      return renderBadge(data, 'inventoryStatus');
    
    case 'financial_status':
      return renderBadge(data, 'financialStatus');
    
    case 'text':
    default:
      return <span>{data || '-'}</span>;
  }
};