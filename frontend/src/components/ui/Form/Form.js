// Modular Form.js - Main orchestrating component
// Original 924-line monolithic file has been modularized into 20+ focused files
// For detailed implementation, see: /src/components/ui/Form/

import React from 'react';

// Import all form components
export { Input } from './components/Input';
export { PasswordInput } from './components/PasswordInput';
export { Textarea } from './components/Textarea';
export { Select } from './components/Select';
export { Checkbox } from './components/Checkbox';
export { Radio } from './components/Radio';
export { FileUpload } from './components/FileUpload';
export { FormField } from './components/FormField';
export { FormGroup } from './components/FormGroup';
export { FormActions } from './components/FormActions';

// Import hooks
export {
  useForm,
  useFieldValidation,
  useFileUpload,
  usePasswordStrength,
  useFormPersistence
} from './hooks/useForm';

// Import validators
export {
  validators,
  validatePasswordStrength,
  validateFile,
  validateField,
  validateForm,
  commonSchemas
} from './validators/formValidators';

// Import utilities
export {
  generateId,
  combineClasses,
  getStateClasses,
  formatFileSize,
  isImageFile,
  isFileTypeAccepted,
  validateFile as validateFileUtil,
  debounce,
  throttle,
  autoResizeTextarea,
  formatInputValue,
  parseInputValue,
  prepareFormData,
  deepClone,
  getNestedValue,
  setNestedValue,
  isEmpty
} from './utils/formUtils';

// Import configuration
export {
  FORM_CONFIG,
  INPUT_TYPES,
  TEXTAREA_CONFIG,
  SELECT_CONFIG,
  CHOICE_CONFIG,
  FILE_CONFIG,
  PASSWORD_STRENGTH,
  VALIDATION_MESSAGES
} from './config/formConfig';

// Main Form component wrapper
export const Form = ({
  children,
  onSubmit,
  noValidate = true,
  className = '',
  ...props
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate={noValidate}
      className={`space-y-6 ${className}`}
      {...props}
    >
      {children}
    </form>
  );
};

// Default export for backward compatibility
export default {
  Form,
  Input,
  PasswordInput,
  Textarea,
  Select,
  useForm,
  validators
};