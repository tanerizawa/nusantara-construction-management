import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle, X } from 'lucide-react';

/**
 * Form Input Components - Apple HIG Compliant
 * 
 * Comprehensive form components with enhanced UX
 * Following Apple Human Interface Guidelines for clarity and accessibility
 */

// Base Input Component
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
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };
  
  const variantClasses = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    minimal: 'border-0 border-b-2 border-gray-300 focus:border-blue-500 rounded-none bg-transparent',
    filled: 'border-transparent bg-gray-100 focus:bg-white focus:border-blue-500 focus:ring-blue-500'
  };
  
  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return variantClasses[variant];
  };
  
  const handleFocus = (e) => {
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    onBlur?.(e);
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={`block text-sm font-medium ${
            error ? 'text-red-700' : 'text-gray-700'
          }`}
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
        
        {/* Input */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={`
            w-full rounded-lg border transition-all duration-200
            ${sizeClasses[size]}
            ${getStateClasses()}
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            placeholder:text-gray-400
          `}
          {...props}
        />
        
        {/* Right Icon / Status Icon */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {error && <AlertCircle size={20} className="text-red-500" />}
          {success && !error && <CheckCircle size={20} className="text-green-500" />}
          {rightIcon && !error && !success && (
            <span className="text-gray-400">{rightIcon}</span>
          )}
        </div>
      </div>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={`text-sm ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Password Input Component
export const PasswordInput = forwardRef(({
  label = 'Password',
  placeholder = 'Masukkan password',
  showStrength = false,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(0);
  
  const calculateStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  };
  
  const handlePasswordChange = (e) => {
    const password = e.target.value;
    if (showStrength) {
      setStrength(calculateStrength(password));
    }
    props.onChange?.(e);
  };
  
  const getStrengthColor = () => {
    if (strength <= 2) return 'bg-red-500';
    if (strength <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  const getStrengthText = () => {
    if (strength <= 2) return 'Lemah';
    if (strength <= 3) return 'Sedang';
    return 'Kuat';
  };
  
  return (
    <div>
      <Input
        ref={ref}
        label={label}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        onChange={handlePasswordChange}
        rightIcon={
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        }
        {...props}
      />
      
      {/* Password Strength */}
      {showStrength && props.value && (
        <div className="mt-2">
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor()}`}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
            <span className={`text-sm font-medium ${
              strength <= 2 ? 'text-red-600' : 
              strength <= 3 ? 'text-yellow-600' : 
              'text-green-600'
            }`}>
              {getStrengthText()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

// Textarea Component
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
  rows = 4,
  resize = 'vertical',
  maxLength,
  showCharCount = false,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const [charCount, setCharCount] = useState(value?.length || 0);
  
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  
  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    onChange?.(e);
  };
  
  const handleFocus = (e) => {
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    onBlur?.(e);
  };
  
  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };
  
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={textareaId}
          className={`block text-sm font-medium ${
            error ? 'text-red-700' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Textarea Container */}
      <div className="relative">
        <textarea
          ref={ref}
          id={textareaId}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={`
            w-full px-4 py-3 rounded-lg border transition-all duration-200
            ${getStateClasses()}
            ${resizeClasses[resize]}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            placeholder:text-gray-400
          `}
          {...props}
        />
        
        {/* Status Icon */}
        {(error || success) && (
          <div className="absolute top-3 right-3">
            {error && <AlertCircle size={20} className="text-red-500" />}
            {success && !error && <CheckCircle size={20} className="text-green-500" />}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="flex justify-between items-center">
        <div>
          {(helperText || error) && (
            <p className={`text-sm ${
              error ? 'text-red-600' : 'text-gray-500'
            }`}>
              {error || helperText}
            </p>
          )}
        </div>
        
        {/* Character Count */}
        {showCharCount && maxLength && (
          <p className={`text-sm ${
            charCount > maxLength * 0.9 ? 'text-yellow-600' : 'text-gray-500'
          }`}>
            {charCount}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
});

Textarea.displayName = 'Textarea';

// Select Component
export const Select = forwardRef(({
  label,
  options = [],
  value,
  onChange,
  onBlur,
  onFocus,
  error,
  success,
  disabled = false,
  required = false,
  helperText,
  placeholder = 'Pilih opsi...',
  size = 'md',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };
  
  const getStateClasses = () => {
    if (error) return 'border-red-500 focus:border-red-500 focus:ring-red-500';
    if (success) return 'border-green-500 focus:border-green-500 focus:ring-green-500';
    return 'border-gray-300 focus:border-blue-500 focus:ring-blue-500';
  };
  
  const handleFocus = (e) => {
    onFocus?.(e);
  };
  
  const handleBlur = (e) => {
    onBlur?.(e);
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={selectId}
          className={`block text-sm font-medium ${
            error ? 'text-red-700' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={`
            w-full rounded-lg border transition-all duration-200 appearance-none bg-white
            ${sizeClasses[size]}
            ${getStateClasses()}
            ${disabled ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            pr-10
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option 
              key={index} 
              value={option.value || option}
              disabled={option.disabled}
            >
              {option.label || option}
            </option>
          ))}
        </select>
        
        {/* Dropdown Arrow */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {/* Status Icon */}
        {(error || success) && (
          <div className="absolute top-1/2 transform -translate-y-1/2 right-10">
            {error && <AlertCircle size={20} className="text-red-500" />}
            {success && !error && <CheckCircle size={20} className="text-green-500" />}
          </div>
        )}
      </div>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={`text-sm ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// Checkbox Component
export const Checkbox = forwardRef(({
  label,
  checked,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  size = 'md',
  className = '',
  id,
  name,
  value,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start">
        <div className="flex items-center h-6">
          <input
            ref={ref}
            id={checkboxId}
            name={name}
            type="checkbox"
            value={value}
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            required={required}
            className={`
              ${sizeClasses[size]} text-blue-600 border-gray-300 rounded
              focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20
              transition-all duration-200
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              ${error ? 'border-red-500' : ''}
            `}
            {...props}
          />
        </div>
        
        {label && (
          <div className="ml-3">
            <label 
              htmlFor={checkboxId}
              className={`text-sm font-medium ${
                disabled ? 'text-gray-400' : error ? 'text-red-700' : 'text-gray-700'
              } ${!disabled ? 'cursor-pointer' : ''}`}
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </label>
          </div>
        )}
      </div>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={`text-sm ml-8 ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// Radio Group Component
export const RadioGroup = ({
  label,
  options = [],
  value,
  onChange,
  disabled = false,
  required = false,
  error,
  helperText,
  orientation = 'vertical',
  size = 'md',
  className = '',
  name
}) => {
  const groupName = name || `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };
  
  const orientationClasses = {
    vertical: 'flex-col space-y-3',
    horizontal: 'flex-row space-x-6'
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium ${
          error ? 'text-red-700' : 'text-gray-700'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Radio Options */}
      <div className={`flex ${orientationClasses[orientation]}`}>
        {options.map((option, index) => {
          const optionId = `${groupName}-${index}`;
          const optionValue = option.value || option;
          const optionLabel = option.label || option;
          const isDisabled = disabled || option.disabled;
          
          return (
            <div key={index} className="flex items-start">
              <div className="flex items-center h-6">
                <input
                  id={optionId}
                  name={groupName}
                  type="radio"
                  value={optionValue}
                  checked={value === optionValue}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={isDisabled}
                  className={`
                    ${sizeClasses[size]} text-blue-600 border-gray-300
                    focus:ring-blue-500 focus:ring-2 focus:ring-opacity-20
                    transition-all duration-200
                    ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    ${error ? 'border-red-500' : ''}
                  `}
                />
              </div>
              
              <div className="ml-3">
                <label 
                  htmlFor={optionId}
                  className={`text-sm font-medium ${
                    isDisabled ? 'text-gray-400' : error ? 'text-red-700' : 'text-gray-700'
                  } ${!isDisabled ? 'cursor-pointer' : ''}`}
                >
                  {optionLabel}
                </label>
                
                {option.description && (
                  <p className="text-xs text-gray-500 mt-1">
                    {option.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={`text-sm ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// Switch Component
export const Switch = forwardRef(({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const switchId = id || `switch-${Math.random().toString(36).substr(2, 9)}`;
  
  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4'
    },
    md: {
      track: 'w-10 h-5',
      thumb: 'w-4 h-4',
      translate: 'translate-x-5'
    },
    lg: {
      track: 'w-12 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-6'
    }
  };
  
  const currentSize = sizeClasses[size];
  
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="flex-1">
        {label && (
          <label 
            htmlFor={switchId}
            className={`block text-sm font-medium ${
              disabled ? 'text-gray-400' : 'text-gray-700'
            } ${!disabled ? 'cursor-pointer' : ''}`}
          >
            {label}
          </label>
        )}
        
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </div>
      
      <div className="ml-4">
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={checked}
          id={switchId}
          name={name}
          onClick={() => !disabled && onChange?.(!checked)}
          disabled={disabled}
          className={`
            relative inline-flex items-center ${currentSize.track} rounded-full
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20
            ${checked ? 'bg-blue-600' : 'bg-gray-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          {...props}
        >
          <span 
            className={`
              ${currentSize.thumb} inline-block rounded-full bg-white shadow-md
              transition-transform duration-200 ease-in-out
              ${checked ? currentSize.translate : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  );
});

Switch.displayName = 'Switch';

// File Upload Component
export const FileUpload = ({
  label,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024, // 10MB
  onFileSelect,
  onFileRemove,
  files = [],
  error,
  helperText,
  disabled = false,
  required = false,
  className = '',
  placeholder = 'Klik untuk upload atau drag & drop file di sini'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const handleFileSelect = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles = fileArray.filter(file => {
      if (maxSize && file.size > maxSize) {
        alert(`File ${file.name} terlalu besar. Maksimal ${Math.round(maxSize / 1024 / 1024)}MB`);
        return false;
      }
      return true;
    });
    
    onFileSelect?.(multiple ? validFiles : validFiles[0]);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (!disabled) {
      const droppedFiles = e.dataTransfer.files;
      handleFileSelect(droppedFiles);
    }
  };
  
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium ${
          error ? 'text-red-700' : 'text-gray-700'
        }`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-all duration-200
          ${isDragOver ? 'border-blue-500 bg-blue-50' : 
            error ? 'border-red-300' : 'border-gray-300'}
          ${disabled ? 'bg-gray-50 cursor-not-allowed opacity-50' : 'hover:border-blue-400 hover:bg-gray-50'}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={disabled}
          className="hidden"
        />
        
        <div className="space-y-2">
          <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">
              {placeholder}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {accept && `Format: ${accept}`}
              {maxSize && ` • Maksimal ${Math.round(maxSize / 1024 / 1024)}MB`}
            </p>
          </div>
        </div>
      </div>
      
      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              
              <button
                type="button"
                onClick={() => onFileRemove?.(index)}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Helper Text / Error Message */}
      {(helperText || error) && (
        <p className={`text-sm ${
          error ? 'text-red-600' : 'text-gray-500'
        }`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
};

// Default export
const FormComponents = {
  Input,
  PasswordInput,
  Textarea,
  Select,
  Checkbox,
  RadioGroup,
  Switch,
  FileUpload
};

export default FormComponents;
