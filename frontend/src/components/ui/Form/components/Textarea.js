import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { FORM_CONFIG, TEXTAREA_CONFIG } from '../config/formConfig';
import { generateId, combineClasses, getStateClasses, autoResizeTextarea } from '../utils/formUtils';

export const Textarea = forwardRef(({
  label,
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
  rows = TEXTAREA_CONFIG.defaultRows,
  resize = 'vertical',
  maxLength,
  showCharCount = false,
  autoResize = false,
  size = 'md',
  variant = 'default',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [charCount, setCharCount] = useState(value?.length || 0);
  const textareaRef = useRef(null);
  const combinedRef = ref || textareaRef;
  
  const textareaId = id || generateId('textarea');
  const sizeClasses = FORM_CONFIG.sizes[size]?.classes || FORM_CONFIG.sizes.md.classes;
  const stateClasses = getStateClasses(error, success, disabled, variant);
  const resizeClasses = TEXTAREA_CONFIG.resize[resize] || TEXTAREA_CONFIG.resize.vertical;
  
  const textareaClasses = combineClasses(
    FORM_CONFIG.common.width,
    FORM_CONFIG.common.rounded,
    'border',
    FORM_CONFIG.transitions.all,
    sizeClasses,
    stateClasses,
    resizeClasses,
    disabled && FORM_CONFIG.states.disabled,
    FORM_CONFIG.common.focus,
    FORM_CONFIG.common.placeholder,
    className
  );

  const handleChange = (e) => {
    const newValue = e.target.value;
    
    if (maxLength && newValue.length > maxLength) {
      return; // Prevent exceeding max length
    }
    
    setCharCount(newValue.length);
    
    if (autoResize && combinedRef.current) {
      autoResizeTextarea(combinedRef.current, TEXTAREA_CONFIG.maxRows);
    }
    
    if (onChange) {
      onChange(newValue);
    }
  };

  // Auto-resize on mount and value change
  useEffect(() => {
    if (autoResize && combinedRef.current && value) {
      autoResizeTextarea(combinedRef.current, TEXTAREA_CONFIG.maxRows);
    }
  }, [autoResize, value, combinedRef]);

  // Update char count when value changes externally
  useEffect(() => {
    setCharCount(value?.length || 0);
  }, [value]);

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-semibold text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={combinedRef}
          id={textareaId}
          name={name}
          placeholder={placeholder}
          value={value || ''}
          onChange={handleChange}
          onBlur={onBlur}
          onFocus={onFocus}
          disabled={disabled}
          required={required}
          rows={autoResize ? 1 : rows}
          maxLength={maxLength}
          className={textareaClasses}
          {...props}
        />
        
        {/* Status Icon */}
        {(error || success) && (
          <div className="absolute top-3 right-3">
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
        )}
      </div>
      
      {/* Footer with char count and helper text */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          {(helperText || error) && (
            <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
              {error || helperText}
            </p>
          )}
        </div>
        
        {/* Character Count */}
        {showCharCount && (maxLength || charCount > 0) && (
          <div className={`text-xs ${
            maxLength && charCount > maxLength * 0.9 
              ? charCount >= maxLength 
                ? 'text-red-600' 
                : 'text-yellow-600'
              : 'text-gray-500'
          }`}>
            {charCount}{maxLength && ` / ${maxLength}`}
          </div>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';