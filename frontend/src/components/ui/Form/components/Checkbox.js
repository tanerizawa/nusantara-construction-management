import React, { forwardRef } from 'react';
import { FORM_CONFIG, CHOICE_CONFIG } from '../config/formConfig';
import { generateId, combineClasses } from '../utils/formUtils';

export const Checkbox = forwardRef(({
  label,
  value,
  checked,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error,
  helperText,
  size = 'md',
  color = 'blue',
  className = '',
  id,
  name,
  children,
  ...props
}, ref) => {
  const checkboxId = id || generateId('checkbox');
  
  const sizeClasses = CHOICE_CONFIG.sizes[size] || CHOICE_CONFIG.sizes.md;
  const colorClasses = CHOICE_CONFIG.colors[color] || CHOICE_CONFIG.colors.blue;
  
  const checkboxClasses = combineClasses(
    sizeClasses,
    colorClasses,
    'border-gray-300 rounded focus:ring-2 focus:ring-opacity-20',
    disabled && 'opacity-50 cursor-not-allowed',
    FORM_CONFIG.transitions.all,
    className
  );

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.checked, e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="checkbox"
          id={checkboxId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={checkboxClasses}
          {...props}
        />
        
        {(label || children) && (
          <label 
            htmlFor={checkboxId} 
            className={combineClasses(
              'text-sm font-medium leading-5',
              error ? 'text-red-700' : 'text-gray-700',
              disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            {label || children}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
      </div>
      
      {(helperText || error) && (
        <p className={`text-sm ml-8 ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';