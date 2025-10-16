import { useState, useCallback, useRef, useEffect } from 'react';
import { validateForm, validateField } from '../validators/formValidators';
import { debounce, deepClone, getNestedValue, setNestedValue } from '../utils/formUtils';

// Hook for form state management
export const useForm = (initialValues = {}, validationSchema = {}, options = {}) => {
  const {
    validateOnChange = false,
    validateOnBlur = true,
    validateOnSubmit = true,
    debounceMs = 300
  } = options;

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouchedState] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const debouncedValidation = useRef(
    debounce((fieldName, value) => {
      if (validationSchema[fieldName]) {
        const error = validateField(value, validationSchema[fieldName]);
        setErrors(prev => ({
          ...prev,
          [fieldName]: error
        }));
      }
    }, debounceMs)
  ).current;

  // Set field value
  const setValue = useCallback((fieldName, value) => {
    setValues(prev => {
      const newValues = deepClone(prev);
      setNestedValue(newValues, fieldName, value);
      return newValues;
    });

    // Validate on change if enabled
    if (validateOnChange && validationSchema[fieldName]) {
      debouncedValidation(fieldName, value);
    }
  }, [validateOnChange, validationSchema, debouncedValidation]);

  // Set field error
  const setError = useCallback((fieldName, error) => {
    setErrors(prev => ({
      ...prev,
      [fieldName]: error
    }));
  }, []);

  // Set field touched
  const setTouched = useCallback((fieldName, isTouched = true) => {
    setTouchedState(prev => ({
      ...prev,
      [fieldName]: isTouched
    }));

    // Validate on blur if enabled
    if (validateOnBlur && isTouched && validationSchema[fieldName]) {
      const value = getNestedValue(values, fieldName);
      const error = validateField(value, validationSchema[fieldName]);
      setError(fieldName, error);
    }
  }, [validateOnBlur, validationSchema, values, setError]);

  // Get field props (for easy integration with input components)
  const getFieldProps = useCallback((fieldName) => ({
    name: fieldName,
    value: getNestedValue(values, fieldName) || '',
    onChange: (value) => setValue(fieldName, value),
    onBlur: () => setTouched(fieldName, true),
    error: errors[fieldName],
    touched: touched[fieldName]
  }), [values, errors, touched, setValue, setTouched]);

  // Validate entire form
  const validate = useCallback(async () => {
    setIsValidating(true);
    
    try {
      const result = validateForm(values, validationSchema);
      setErrors(result.errors);
      return result;
    } finally {
      setIsValidating(false);
    }
  }, [values, validationSchema]);

  // Reset form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouchedState({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  // Submit form
  const handleSubmit = useCallback(async (onSubmit) => {
    setSubmitCount(prev => prev + 1);
    
    if (validateOnSubmit) {
      const validation = await validate();
      if (!validation.isValid) {
        return { success: false, errors: validation.errors };
      }
    }

    setIsSubmitting(true);
    
    try {
      const result = await onSubmit(values);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsSubmitting(false);
    }
  }, [values, validate, validateOnSubmit]);

  // Check if form is valid
  const isValid = Object.values(errors).every(error => !error);

  // Check if form is dirty (has changes)
  const isDirty = JSON.stringify(values) !== JSON.stringify(initialValues);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    isValid,
    isDirty,
    submitCount,
    setValue,
    setError,
    setTouched,
    getFieldProps,
    validate,
    reset,
    handleSubmit
  };
};

// Hook for field validation
export const useFieldValidation = (value, rules = [], options = {}) => {
  const { validateOnMount = false, debounceMs = 300 } = options;
  
  const [error, setError] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const debouncedValidation = useRef(
    debounce(async (val) => {
      setIsValidating(true);
      try {
        const validationError = await validateField(val, rules);
        setError(validationError);
      } finally {
        setIsValidating(false);
      }
    }, debounceMs)
  ).current;

  useEffect(() => {
    if (validateOnMount || value) {
      debouncedValidation(value);
    }
  }, [value, debouncedValidation, validateOnMount]);

  return { error, isValidating };
};

// Hook for file upload
export const useFileUpload = (options = {}) => {
  const {
    maxFiles = 1,
    maxSize = 10 * 1024 * 1024, // 10MB
    acceptedTypes = '*/*',
    onUpload
  } = options;

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [errors, setErrors] = useState([]);

  const addFiles = useCallback((newFiles) => {
    const fileArray = Array.from(newFiles);
    
    // Validate files
    const validFiles = [];
    const fileErrors = [];

    fileArray.forEach((file, index) => {
      if (files.length + validFiles.length >= maxFiles) {
        fileErrors.push(`Maksimal ${maxFiles} file`);
        return;
      }

      if (file.size > maxSize) {
        fileErrors.push(`${file.name} terlalu besar`);
        return;
      }

      // Add more validation as needed
      validFiles.push(file);
    });

    setFiles(prev => [...prev, ...validFiles]);
    setErrors(fileErrors);
  }, [files, maxFiles, maxSize]);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadFiles = useCallback(async () => {
    if (!onUpload || files.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      const results = await Promise.all(
        files.map(async (file, index) => {
          const result = await onUpload(file, (progress) => {
            setUploadProgress(prev => ({
              ...prev,
              [index]: progress
            }));
          });
          return result;
        })
      );
      
      return results;
    } finally {
      setUploading(false);
    }
  }, [files, onUpload]);

  const reset = useCallback(() => {
    setFiles([]);
    setErrors([]);
    setUploadProgress({});
    setUploading(false);
  }, []);

  return {
    files,
    uploading,
    uploadProgress,
    errors,
    addFiles,
    removeFile,
    uploadFiles,
    reset
  };
};

// Hook for password strength
export const usePasswordStrength = (password) => {
  const [strength, setStrength] = useState({ strength: 0, errors: [], passed: [] });

  useEffect(() => {
    import('../validators/formValidators').then(({ validatePasswordStrength }) => {
      setStrength(validatePasswordStrength(password));
    });
  }, [password]);

  return strength;
};

// Hook for form persistence (localStorage)
export const useFormPersistence = (formKey, initialValues = {}) => {
  const [values, setValues] = useState(() => {
    try {
      const saved = localStorage.getItem(`form_${formKey}`);
      return saved ? JSON.parse(saved) : initialValues;
    } catch {
      return initialValues;
    }
  });

  const saveValues = useCallback((newValues) => {
    setValues(newValues);
    try {
      localStorage.setItem(`form_${formKey}`, JSON.stringify(newValues));
    } catch (error) {
      console.warn('Failed to save form to localStorage:', error);
    }
  }, [formKey]);

  const clearSaved = useCallback(() => {
    setValues(initialValues);
    try {
      localStorage.removeItem(`form_${formKey}`);
    } catch (error) {
      console.warn('Failed to clear form from localStorage:', error);
    }
  }, [formKey, initialValues]);

  return { values, saveValues, clearSaved };
};