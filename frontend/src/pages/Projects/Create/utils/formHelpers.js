/**
 * Form Helpers
 * Utility functions for form handling
 */

/**
 * Handle nested and flat form field changes
 * @param {string} field - Field name (supports dot notation like 'client.company')
 * @param {any} value - New field value
 * @param {Function} setFormData - State setter function
 * @param {Object} errors - Current errors object
 * @param {Function} setErrors - Errors setter function
 */
export const handleNestedFieldChange = (field, value, setFormData, errors, setErrors) => {
  // Update form data
  if (field.includes('.')) {
    const [parent, child] = field.split('.');
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [child]: value
      }
    }));
  } else {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }
  
  // Clear error when user starts typing
  if (errors[field]) {
    setErrors(prev => ({
      ...prev,
      [field]: null
    }));
  }
};

/**
 * Get initial form data structure
 * @returns {Object} Initial form data
 */
export const getInitialFormData = () => ({
  name: '',
  description: '',
  client: {
    company: '',
    contact: '',
    email: '',
    phone: ''
  },
  location: {
    city: '',
    province: '',
    address: ''
  },
  timeline: {
    startDate: '',
    endDate: ''
  },
  budget: {
    contractValue: 0
  },
  status: 'planning',
  priority: 'medium',
  subsidiary: {
    id: '',
    name: '',
    code: ''
  },
  team: {
    projectManager: ''
  }
});

/**
 * Transform form data to API format
 * @param {Object} formData - Form data from state
 * @returns {Object} API-formatted project data
 */
export const transformToAPIFormat = (formData) => ({
  name: formData.name,
  description: formData.description,
  clientName: formData.client.company,
  clientContact: {
    contact: formData.client.contact || '',
    phone: formData.client.phone || '',
    email: formData.client.email || ''
  },
  location: {
    address: formData.location?.address || '',
    city: formData.location?.city || '',
    province: formData.location?.province || ''
  },
  budget: formData.budget.contractValue,
  status: 'planning',
  priority: formData.priority || 'medium',
  progress: 0,
  startDate: formData.timeline.startDate,
  endDate: formData.timeline.endDate,
  subsidiary: {
    id: formData.subsidiary.id,
    code: formData.subsidiary.code || '',
    name: formData.subsidiary.name || ''
  }
});
