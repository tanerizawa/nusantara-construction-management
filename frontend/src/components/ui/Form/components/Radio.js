import React, { forwardRef } from 'react';
import { FORM_CONFIG, CHOICE_CONFIG } from '../config/formConfig';
import { generateId, combineClasses } from '../utils/formUtils';

export const Radio = forwardRef(({
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
  const radioId = id || generateId('radio');
  
  const sizeClasses = CHOICE_CONFIG.sizes[size] || CHOICE_CONFIG.sizes.md;
  const colorClasses = CHOICE_CONFIG.colors[color] || CHOICE_CONFIG.colors.blue;
  
  const radioClasses = combineClasses(
    sizeClasses,
    colorClasses,
    'border-gray-300 focus:ring-2 focus:ring-opacity-20',
    disabled && 'opacity-50 cursor-not-allowed',
    FORM_CONFIG.transitions.all,
    className
  );

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e.target.checked);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-start space-x-3">
        <input
          ref={ref}
          type="radio"
          id={radioId}
          name={name}
          value={value}
          checked={checked}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          className={radioClasses}
          {...props}
        />
        
        {(label || children) && (
          <label 
            htmlFor={radioId} 
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

Radio.displayName = 'Radio';

// Radio Group Component
export const RadioGroup = ({
  label,
  options = [],
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  name,
  className = '',
  ...props
}) => {
  const groupId = generateId('radio-group');

  return (
    <div className={combineClasses('space-y-3', className)}>
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="space-y-2">
        {options.map((option, index) => (
          <Radio
            key={option.value || index}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(optionValue) => onChange && onChange(optionValue)}
            disabled={disabled || option.disabled}
            label={option.label}
            error={error}
            {...props}
          />
        ))}
      </div>
      
      {(helperText || error) && (
        <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};