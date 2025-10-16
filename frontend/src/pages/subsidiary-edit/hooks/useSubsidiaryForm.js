import { useState } from 'react';
import { getInitialFormData } from '../config/formConfig';
import { updateNestedField, getNestedValue, addArrayItem, removeArrayItem, updateArrayItem } from '../utils/formHelpers';

export const useSubsidiaryForm = (initialData = null) => {
  const [formData, setFormData] = useState(initialData || getInitialFormData());

  const updateField = (path, value) => {
    setFormData(prev => updateNestedField(prev, path, value));
  };

  const getFieldValue = (path) => {
    return getNestedValue(formData, path);
  };

  const addItemToArray = (path, item) => {
    setFormData(prev => addArrayItem(prev, path, item));
  };

  const removeItemFromArray = (path, index) => {
    setFormData(prev => removeArrayItem(prev, path, index));
  };

  const updateItemInArray = (path, index, updates) => {
    setFormData(prev => updateArrayItem(prev, path, index, updates));
  };

  const resetForm = () => {
    setFormData(getInitialFormData());
  };

  const loadFormData = (data) => {
    setFormData(data);
  };

  return {
    formData,
    updateField,
    getFieldValue,
    addItemToArray,
    removeItemFromArray,
    updateItemInArray,
    resetForm,
    loadFormData
  };
};