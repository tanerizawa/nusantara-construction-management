import React, { useState, forwardRef } from 'react';
import { ChevronDown, AlertCircle, CheckCircle, X, Search } from 'lucide-react';
import { FORM_CONFIG, SELECT_CONFIG } from '../config/formConfig';
import { generateId, combineClasses, getStateClasses } from '../utils/formUtils';

export const Select = forwardRef(({
  label,
  placeholder = SELECT_CONFIG.placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  options = [],
  error,
  success,
  disabled = false,
  required = false,
  helperText,
  multiple = false,
  searchable = false,
  clearable = false,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  name,
  loading = false,
  ...props
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectId = id || generateId('select');
  const sizeClasses = FORM_CONFIG.sizes[size]?.classes || FORM_CONFIG.sizes.md.classes;
  const stateClasses = getStateClasses(error, success, disabled, variant);
  
  const selectClasses = combineClasses(
    FORM_CONFIG.common.width,
    FORM_CONFIG.common.rounded,
    'border',
    FORM_CONFIG.transitions.all,
    sizeClasses,
    stateClasses,
    disabled && FORM_CONFIG.states.disabled,
    FORM_CONFIG.common.focus,
    'cursor-pointer',
    className
  );

  // Filter options based on search term
  const filteredOptions = searchable 
    ? options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option(s)
  const getSelectedOptions = () => {
    if (!value) return [];
    
    if (multiple) {
      return Array.isArray(value) 
        ? options.filter(option => value.includes(option.value))
        : [options.find(option => option.value === value)].filter(Boolean);
    }
    
    return [options.find(option => option.value === value)].filter(Boolean);
  };

  const selectedOptions = getSelectedOptions();

  const handleOptionClick = (option) => {
    if (disabled) return;
    
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : (value ? [value] : []);
      const newValues = currentValues.includes(option.value)
        ? currentValues.filter(v => v !== option.value)
        : [...currentValues, option.value];
      
      if (onChange) onChange(newValues);
    } else {
      if (onChange) onChange(option.value);
      setIsOpen(false);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) onChange(multiple ? [] : '');
  };

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
      setSearchTerm('');
    }
  };

  const renderSelectedValue = () => {
    if (selectedOptions.length === 0) {
      return <span className="text-gray-400">{placeholder}</span>;
    }
    
    if (multiple && selectedOptions.length > 1) {
      return (
        <div className="flex flex-wrap gap-1">
          {selectedOptions.slice(0, 2).map((option, index) => (
            <span 
              key={index}
              className="inline-flex items-center bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {option.label}
            </span>
          ))}
          {selectedOptions.length > 2 && (
            <span className="text-xs text-gray-500">
              +{selectedOptions.length - 2} lainnya
            </span>
          )}
        </div>
      );
    }
    
    return selectedOptions[0]?.label;
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Container */}
      <div className="relative">
        {/* Select Button */}
        <button
          ref={ref}
          type="button"
          id={selectId}
          name={name}
          onClick={handleOpen}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          className={combineClasses(
            selectClasses,
            'flex items-center justify-between',
            'text-left'
          )}
          {...props}
        >
          <span className="flex-1 truncate">
            {renderSelectedValue()}
          </span>
          
          <div className="flex items-center space-x-2">
            {/* Clear Button */}
            {clearable && selectedOptions.length > 0 && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            )}
            
            {/* Dropdown Arrow */}
            <ChevronDown 
              size={FORM_CONFIG.sizes[size]?.iconSize || 20}
              className={combineClasses(
                'text-gray-400 transition-transform duration-200',
                isOpen && 'transform rotate-180'
              )}
            />
          </div>
        </button>
        
        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
            {/* Search Input */}
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder={SELECT_CONFIG.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}
            
            {/* Options List */}
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-3 text-center text-gray-500">
                  {SELECT_CONFIG.loadingMessage}
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-3 text-center text-gray-500">
                  {SELECT_CONFIG.noOptionsMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const isSelected = multiple 
                    ? Array.isArray(value) ? value.includes(option.value) : value === option.value
                    : value === option.value;
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleOptionClick(option)}
                      className={combineClasses(
                        'w-full text-left px-3 py-2 text-sm transition-colors',
                        'hover:bg-gray-100 focus:outline-none focus:bg-gray-100',
                        isSelected && 'bg-blue-50 text-blue-700 font-medium'
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option.label}</span>
                        {isSelected && multiple && (
                          <CheckCircle size={16} className="text-blue-600" />
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
        
        {/* Status Icons */}
        <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
          {error && (
            <AlertCircle 
              size={FORM_CONFIG.sizes[size]?.iconSize || 20} 
              className="text-red-500" 
            />
          )}
          {success && !error && (
            <CheckCircle 
              size={FORM_CONFIG.sizes[size]?.iconSize || 20} 
              className="text-green-500" 
            />
          )}
        </div>
        
        {/* Backdrop to close dropdown */}
        {isOpen && (
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';