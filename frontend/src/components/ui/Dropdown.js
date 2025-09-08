import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { ChevronDown, Search, X, Check } from 'lucide-react';

/**
 * Dropdown and Menu Components - Apple HIG Compliant
 * 
 * Comprehensive dropdown system with search, multi-select, and custom options
 * Following Apple Human Interface Guidelines for clear interaction patterns
 */

// Base Dropdown Component
export const Dropdown = ({
  trigger,
  children,
  isOpen,
  onToggle,
  placement = 'bottom-start',
  offset = 8,
  closeOnClick = true,
  closeOnOutsideClick = true,
  className = '',
  menuClassName = '',
  ...props
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState(placement);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  
  const isControlled = isOpen !== undefined;
  const open = isControlled ? isOpen : internalOpen;
  
  const toggle = () => {
    if (isControlled) {
      onToggle?.(!open);
    } else {
      setInternalOpen(!open);
    }
  };
  
  const close = useCallback(() => {
    if (isControlled) {
      onToggle?.(false);
    } else {
      setInternalOpen(false);
    }
  }, [isControlled, onToggle]);
  
  // Handle outside click
  useEffect(() => {
    if (!closeOnOutsideClick || !open) return;
    
    const handleOutsideClick = (event) => {
      if (
        triggerRef.current?.contains(event.target) ||
        menuRef.current?.contains(event.target)
      ) {
        return;
      }
      close();
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open, closeOnOutsideClick, close]);
  
  // Handle escape key
  useEffect(() => {
    if (!open) return;
    
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, close]);

  // Calculate position for portal rendering
  useEffect(() => {
    if (!open || !triggerRef.current) return;

    const updatePosition = () => {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      let top = triggerRect.bottom + offset;
      let left = triggerRect.left;
      let newPlacement = placement;
      
      // Smart positioning - check if dropdown would overflow viewport
      const menuWidth = 200; // estimated menu width
      const menuHeight = 200; // estimated menu height
      
      // Horizontal overflow check
      if (left + menuWidth > viewportWidth) {
        left = triggerRect.right - menuWidth;
        newPlacement = newPlacement.replace('start', 'end');
      }
      
      // Vertical overflow check
      if (top + menuHeight > viewportHeight) {
        top = triggerRect.top - menuHeight - offset;
        newPlacement = newPlacement.replace('bottom', 'top');
      }
      
      setPosition({ top, left });
      setActualPlacement(newPlacement);
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [open, placement, offset]);
  
  const handleMenuClick = (event) => {
    if (closeOnClick) {
      close();
    }
  };
  
  return (
    <div className={`relative inline-block ${className}`} {...props}>
      {/* Trigger */}
      <div ref={triggerRef} onClick={toggle}>
        {trigger}
      </div>
      
      {/* Menu - Rendered via Portal to bypass overflow containers */}
      {open && ReactDOM.createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${position.top}px`,
            left: `${position.left}px`,
            zIndex: 999999, // Super high z-index to appear above everything
            minWidth: '200px',
            maxHeight: '24rem',
            overflowY: 'auto',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '0.75rem',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transformOrigin: 'top left',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={handleMenuClick}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  );
};

// Dropdown Item
export const DropdownItem = ({
  children,
  onClick,
  disabled = false,
  selected = false,
  icon,
  description,
  shortcut,
  variant = 'default',
  className = '',
  ...props
}) => {
  const variants = {
    default: 'hover:bg-gray-50',
    danger: 'hover:bg-red-50 text-red-700'
  };
  
  const handleClick = (event) => {
    if (disabled) return;
    onClick?.(event);
  };
  
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={`
        w-full px-4 py-3 text-left flex items-center justify-between
        transition-colors duration-200
        ${disabled ? 'opacity-50 cursor-not-allowed' : `cursor-pointer ${variants[variant]}`}
        ${selected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}
        ${className}
      `}
      {...props}
    >
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {/* Icon */}
        {icon && (
          <div className="flex-shrink-0">
            {React.cloneElement(icon, { size: 16 })}
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {children}
          </div>
          {description && (
            <div className="text-sm text-gray-500 truncate">
              {description}
            </div>
          )}
        </div>
      </div>
      
      {/* Shortcut */}
      {shortcut && (
        <div className="flex-shrink-0 text-xs text-gray-400 ml-2">
          {shortcut}
        </div>
      )}
      
      {/* Selected Indicator */}
      {selected && (
        <div className="flex-shrink-0 ml-2">
          <Check size={16} className="text-blue-600" />
        </div>
      )}
    </button>
  );
};

// Dropdown Separator
export const DropdownSeparator = ({ className = '', ...props }) => (
  <div className={`border-t border-gray-200 my-1 ${className}`} {...props} />
);

// Dropdown Header
export const DropdownHeader = ({ children, className = '', ...props }) => (
  <div className={`px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider ${className}`} {...props}>
    {children}
  </div>
);

// Select Dropdown
export const SelectDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Pilih opsi...',
  searchable = false,
  clearable = false,
  disabled = false,
  error = false,
  size = 'md',
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };
  
  const selectedOption = options.find(option => 
    (option.value || option) === value
  );
  
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => {
        const label = option.label || option;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : options;
  
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    
    // Focus search input when opened
    if (!isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleSelect = (option) => {
    const optionValue = option.value || option;
    onChange?.(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };
  
  const handleClear = (event) => {
    event.stopPropagation();
    onChange?.(null);
  };
  
  const trigger = (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between
        bg-white border rounded-lg transition-all duration-200
        ${sizes[size]}
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
        focus:outline-none focus:ring-2 focus:ring-opacity-20
        ${className}
      `}
      {...props}
    >
      <span className={`truncate ${!selectedOption ? 'text-gray-400' : ''}`}>
        {selectedOption?.label || selectedOption || placeholder}
      </span>
      
      <div className="flex items-center space-x-2">
        {clearable && selectedOption && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
        
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </div>
    </button>
  );
  
  return (
    <Dropdown
      trigger={trigger}
      isOpen={isOpen}
      onToggle={setIsOpen}
      closeOnClick={false}
      menuClassName="p-0"
    >
      {/* Search Input */}
      {searchable && (
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}
      
      {/* Options */}
      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            {searchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada opsi tersedia'}
          </div>
        ) : (
          filteredOptions.map((option, index) => {
            const optionValue = option.value || option;
            const optionLabel = option.label || option;
            const isSelected = optionValue === value;
            
            return (
              <DropdownItem
                key={index}
                onClick={() => handleSelect(option)}
                selected={isSelected}
                disabled={option.disabled}
                icon={option.icon}
                description={option.description}
              >
                {optionLabel}
              </DropdownItem>
            );
          })
        )}
      </div>
    </Dropdown>
  );
};

// Multi Select Dropdown
export const MultiSelectDropdown = ({
  options = [],
  value = [],
  onChange,
  placeholder = 'Pilih opsi...',
  searchable = true,
  clearable = true,
  disabled = false,
  error = false,
  size = 'md',
  maxDisplay = 2,
  className = '',
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };
  
  const selectedOptions = options.filter(option => 
    value.includes(option.value || option)
  );
  
  const filteredOptions = searchable && searchQuery
    ? options.filter(option => {
        const label = option.label || option;
        return label.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : options;
  
  const handleToggle = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
    
    if (!isOpen && searchable) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };
  
  const handleSelect = (option) => {
    const optionValue = option.value || option;
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    
    onChange?.(newValue);
  };
  
  const handleClear = (event) => {
    event.stopPropagation();
    onChange?.([]);
  };
  
  const handleRemoveItem = (itemValue, event) => {
    event.stopPropagation();
    const newValue = value.filter(v => v !== itemValue);
    onChange?.(newValue);
  };
  
  const getDisplayText = () => {
    if (selectedOptions.length === 0) return placeholder;
    
    if (selectedOptions.length <= maxDisplay) {
      return selectedOptions.map(option => option.label || option).join(', ');
    }
    
    const displayItems = selectedOptions.slice(0, maxDisplay);
    const remainingCount = selectedOptions.length - maxDisplay;
    const displayText = displayItems.map(option => option.label || option).join(', ');
    
    return `${displayText} +${remainingCount} lainnya`;
  };
  
  const trigger = (
    <button
      type="button"
      onClick={handleToggle}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between
        bg-white border rounded-lg transition-all duration-200
        ${sizes[size]}
        ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}
        ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'hover:border-gray-400'}
        focus:outline-none focus:ring-2 focus:ring-opacity-20
        ${className}
      `}
      {...props}
    >
      <span className={`truncate ${selectedOptions.length === 0 ? 'text-gray-400' : ''}`}>
        {getDisplayText()}
      </span>
      
      <div className="flex items-center space-x-2">
        {clearable && selectedOptions.length > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            <X size={16} className="text-gray-400" />
          </button>
        )}
        
        <ChevronDown 
          size={20} 
          className={`text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`} 
        />
      </div>
    </button>
  );
  
  return (
    <Dropdown
      trigger={trigger}
      isOpen={isOpen}
      onToggle={setIsOpen}
      closeOnClick={false}
      menuClassName="p-0"
    >
      {/* Search Input */}
      {searchable && (
        <div className="p-3 border-b border-gray-200">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      )}
      
      {/* Options */}
      <div className="max-h-60 overflow-y-auto">
        {filteredOptions.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            {searchQuery ? 'Tidak ada hasil ditemukan' : 'Tidak ada opsi tersedia'}
          </div>
        ) : (
          filteredOptions.map((option, index) => {
            const optionValue = option.value || option;
            const optionLabel = option.label || option;
            const isSelected = value.includes(optionValue);
            
            return (
              <DropdownItem
                key={index}
                onClick={() => handleSelect(option)}
                selected={isSelected}
                disabled={option.disabled}
                icon={option.icon}
                description={option.description}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => {}}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span>{optionLabel}</span>
                </div>
              </DropdownItem>
            );
          })
        )}
      </div>
      
      {/* Selected Items */}
      {selectedOptions.length > 0 && (
        <>
          <DropdownSeparator />
          <div className="p-3">
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Dipilih ({selectedOptions.length})
            </div>
            <div className="flex flex-wrap gap-1">
              {selectedOptions.map((option) => {
                const optionValue = option.value || option;
                const optionLabel = option.label || option;
                
                return (
                  <span
                    key={optionValue}
                    className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {optionLabel}
                    <button
                      type="button"
                      onClick={(e) => handleRemoveItem(optionValue, e)}
                      className="ml-1 p-0.5 hover:bg-blue-200 rounded-full transition-colors duration-200"
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </>
      )}
    </Dropdown>
  );
};

// Action Menu
export const ActionMenu = ({ actions = [], className = '', ...props }) => {
  return (
    <div className={`py-1 ${className}`} {...props}>
      {actions.map((action, index) => {
        if (action.type === 'separator') {
          return <DropdownSeparator key={index} />;
        }
        
        if (action.type === 'header') {
          return (
            <DropdownHeader key={index}>
              {action.label}
            </DropdownHeader>
          );
        }
        
        return (
          <DropdownItem
            key={index}
            onClick={action.onClick}
            disabled={action.disabled}
            icon={action.icon}
            description={action.description}
            shortcut={action.shortcut}
            variant={action.variant}
          >
            {action.label}
          </DropdownItem>
        );
      })}
    </div>
  );
};

const DropdownComponents = {
  Dropdown,
  DropdownItem,
  DropdownSeparator,
  DropdownHeader,
  SelectDropdown,
  MultiSelectDropdown,
  ActionMenu
};

export default DropdownComponents;
