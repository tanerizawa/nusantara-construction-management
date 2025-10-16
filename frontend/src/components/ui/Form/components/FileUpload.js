import React, { useState, useRef, forwardRef } from 'react';
import { Upload, X, FileText, Image, File } from 'lucide-react';
import { FORM_CONFIG, FILE_CONFIG } from '../config/formConfig';
import { generateId, combineClasses, formatFileSize, isImageFile } from '../utils/formUtils';
import { useFileUpload } from '../hooks/useForm';

export const FileUpload = forwardRef(({
  label,
  accept = FILE_CONFIG.acceptedTypes.any,
  multiple = false,
  maxSize = FILE_CONFIG.maxSize,
  maxFiles = multiple ? 10 : 1,
  disabled = false,
  required = false,
  error,
  helperText,
  value = [],
  onChange,
  onBlur,
  onFocus,
  showPreview = true,
  dragAndDrop = true,
  className = '',
  id,
  name,
  ...props
}, ref) => {
  const fileInputRef = useRef(null);
  const combinedRef = ref || fileInputRef;
  const uploadId = id || generateId('file-upload');
  
  const [dragActive, setDragActive] = useState(false);
  
  const {
    files,
    errors: uploadErrors,
    addFiles,
    removeFile
  } = useFileUpload({
    maxFiles,
    maxSize,
    acceptedTypes: accept
  });

  // Update parent component when files change
  React.useEffect(() => {
    if (onChange) {
      onChange(multiple ? files : files[0] || null);
    }
  }, [files, multiple, onChange]);

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    addFiles(selectedFiles);
    
    // Reset input value to allow re-selecting the same file
    if (combinedRef.current) {
      combinedRef.current.value = '';
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setDragActive(true);
    }
  };

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      addFiles(droppedFiles);
    }
  };

  const openFileDialog = () => {
    if (combinedRef.current && !disabled) {
      combinedRef.current.click();
    }
  };

  const getFileIcon = (file) => {
    if (isImageFile(file)) {
      return <Image size={20} className="text-blue-500" />;
    }
    if (file.type.includes('pdf')) {
      return <FileText size={20} className="text-red-500" />;
    }
    return <File size={20} className="text-gray-500" />;
  };

  const dropzoneClasses = combineClasses(
    'border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-200',
    dragActive 
      ? 'border-blue-500 bg-blue-50' 
      : error 
        ? 'border-red-300 bg-red-50' 
        : 'border-gray-300 hover:border-gray-400',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  );

  return (
    <div className="space-y-3">
      {/* Label */}
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Hidden File Input */}
      <input
        ref={combinedRef}
        type="file"
        id={uploadId}
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        className="hidden"
        {...props}
      />

      {/* Dropzone */}
      {dragAndDrop ? (
        <div
          className={dropzoneClasses}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload size={32} className="mx-auto mb-3 text-gray-400" />
          <p className="text-gray-600 mb-2">
            {dragActive 
              ? FILE_CONFIG.messages.dragActive
              : FILE_CONFIG.messages.dragInactive
            }
          </p>
          <p className="text-xs text-gray-500">
            Maksimal {formatFileSize(maxSize)} per file
            {maxFiles > 1 && `, ${maxFiles} files`}
          </p>
        </div>
      ) : (
        <button
          type="button"
          onClick={openFileDialog}
          disabled={disabled}
          className={combineClasses(
            'w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg',
            'text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Upload size={20} className="mr-2" />
          Pilih File
        </button>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <FilePreview
              key={index}
              file={file}
              onRemove={() => removeFile(index)}
              showPreview={showPreview}
              disabled={disabled}
            />
          ))}
        </div>
      )}

      {/* Errors */}
      {(uploadErrors.length > 0 || error) && (
        <div className="space-y-1">
          {uploadErrors.map((err, index) => (
            <p key={index} className="text-sm text-red-600">{err}</p>
          ))}
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>
      )}

      {/* Helper Text */}
      {helperText && !error && uploadErrors.length === 0 && (
        <p className="text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
});

FileUpload.displayName = 'FileUpload';

// File Preview Component
const FilePreview = ({ file, onRemove, showPreview, disabled }) => {
  const [preview, setPreview] = useState(null);

  React.useEffect(() => {
    if (showPreview && isImageFile(file)) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [file, showPreview]);

  return (
    <div className="flex items-center p-3 bg-gray-50 rounded-lg border">
      {/* File Icon/Preview */}
      <div className="flex-shrink-0 mr-3">
        {preview ? (
          <img 
            src={preview} 
            alt={file.name}
            className="w-10 h-10 object-cover rounded"
          />
        ) : (
          <div className="w-10 h-10 flex items-center justify-center bg-white rounded border">
            {isImageFile(file) ? (
              <Image size={20} className="text-blue-500" />
            ) : file.type.includes('pdf') ? (
              <FileText size={20} className="text-red-500" />
            ) : (
              <File size={20} className="text-gray-500" />
            )}
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {file.name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(file.size)}
        </p>
      </div>

      {/* Remove Button */}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-3 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};