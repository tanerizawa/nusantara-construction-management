// Main Form Components
export { Form } from './Form';
export { default } from './Form';

// Input Components
export { Input } from './components/Input';
export { PasswordInput } from './components/PasswordInput';
export { Textarea } from './components/Textarea';
export { Select } from './components/Select';
export { Checkbox } from './components/Checkbox';
export { Radio, RadioGroup } from './components/Radio';
export { FileUpload } from './components/FileUpload';

// Composite Components
export { FormField } from './components/FormField';
export { FormGroup } from './components/FormGroup';
export { FormActions } from './components/FormActions';

// Hooks
export {
  useForm,
  useFieldValidation,
  useFileUpload,
  usePasswordStrength,
  useFormPersistence
} from './hooks/useForm';

// Validators
export {
  validators,
  validatePasswordStrength,
  validateFile,
  validateField,
  validateForm,
  commonSchemas
} from './validators/formValidators';

// Utilities
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

// Configuration
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