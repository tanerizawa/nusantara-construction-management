import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { Dropdown, DropdownItem } from '../../Dropdown';
import { ACTION_CONFIGS } from '../config/columnConfig';

export const TableActions = ({
  actions = [],
  item,
  onAction,
  loading = false,
  className = ''
}) => {
  if (!actions || actions.length === 0) {
    return null;
  }

  // If only one action, show as button
  if (actions.length === 1) {
    const action = actions[0];
    const config = ACTION_CONFIGS[action.key] || action;
    
    return (
      <button
        onClick={() => onAction?.(action.key, item)}
        disabled={loading}
        className={`text-sm hover:underline transition-colors ${
          config.variant === 'danger' ? 'text-red-600 hover:text-red-900' :
          config.variant === 'warning' ? 'text-yellow-600 hover:text-yellow-900' :
          config.variant === 'success' ? 'text-green-600 hover:text-green-900' :
          'text-blue-600 hover:text-blue-900'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      >
        {config.label}
      </button>
    );
  }

  // Multiple actions - show as dropdown
  return (
    <Dropdown
      trigger={
        <button
          className={`p-1 rounded-full hover:bg-gray-100 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          } ${className}`}
          disabled={loading}
        >
          <MoreHorizontal size={16} className="text-gray-500" />
        </button>
      }
      align="right"
    >
      {actions.map((action, index) => {
        const config = ACTION_CONFIGS[action.key] || action;
        
        return (
          <DropdownItem
            key={index}
            onClick={() => onAction?.(action.key, item)}
            variant={config.variant}
            icon={config.icon}
            disabled={loading}
          >
            {config.label}
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
};

export const BulkActions = ({
  actions = [],
  selectedItems = [],
  onAction,
  loading = false,
  className = ''
}) => {
  if (!actions || actions.length === 0 || selectedItems.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-600">
        {selectedItems.length} item dipilih:
      </span>
      
      {actions.map((action, index) => {
        const config = ACTION_CONFIGS[action.key] || action;
        
        return (
          <button
            key={index}
            onClick={() => onAction?.(action.key, selectedItems)}
            disabled={loading}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              config.variant === 'danger' 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' :
              config.variant === 'warning' 
                ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' :
              config.variant === 'success' 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' :
                'bg-blue-100 text-blue-700 hover:bg-blue-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {config.label}
          </button>
        );
      })}
    </div>
  );
};