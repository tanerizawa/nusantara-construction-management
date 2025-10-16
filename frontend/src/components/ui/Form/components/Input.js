import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FORM_CONFIG, INPUT_TYPES } from '../config/formConfig';
import { generateId, combineClasses, getStateClasses } from '../utils/formUtils';

export const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  helperText,
  leftIcon,
  rightIcon,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  name,
  autoComplete,
  maxLength,
  ...props
}, ref) => {
  const inputId = id || generateId('input');
  const inputConfig = INPUT_TYPES[type] || INPUT_TYPES.text;
  
  const sizeClasses = FORM_CONFIG.sizes[size]?.classes || FORM_CONFIG.sizes.md.classes;
  const stateClasses = getStateClasses(error, success, disabled, variant);
  
  const inputClasses = combineClasses(
    FORM_CONFIG.common.width,
    FORM_CONFIG.common.rounded,
    'border',
    FORM_CONFIG.transitions.all,
    sizeClasses,
    stateClasses,
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    disabled && FORM_CONFIG.states.disabled,
    FORM_CONFIG.common.focus,
    FORM_CONFIG.common.placeholder,
    className
  );

  const handleChange = (e) => {
    if (onChange) {
      onChange(type === 'number' ? parseFloat(e.target.value) || '' : e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        {/* Input Field */}
        <input
          ref={ref}
          type={inputConfig.type}
          id={inputId}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete || inputConfig.autoComplete}
          maxLength={maxLength}
          pattern={inputConfig.pattern}
          minLength={inputConfig.minLength}
          inputMode={inputConfig.inputMode}
          spellCheck={inputConfig.spellCheck}
          className={inputClasses}
          {...props}
        />
        
        {/* Right Icon / Status Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
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
          {rightIcon && !error && !success && (
            <span className="text-gray-400">{rightIcon}</span>
          )}
        </div>
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

Input.displayName = 'Input';