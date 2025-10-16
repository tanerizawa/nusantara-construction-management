import { useState } from 'react';
import { validateRABForm, isFormValid } from '../utils/rabValidation';
import { getWorkflowForItemType, getPaymentMethodForItemType } from '../config/rabCategories';

/**
 * Custom hook for RAB form management
 * Handles form state, validation, and submission logic with item type support
 */
const useRABForm = (onSubmit, editingItem = null) => {
  const [formData, setFormData] = useState({
    category: editingItem?.category || '',
    description: editingItem?.description || '',
    unit: editingItem?.unit || '',
    quantity: editingItem?.quantity || 0,
    unitPrice: editingItem?.unitPrice || 0,
    specifications: editingItem?.specifications || '',
    itemType: editingItem?.itemType || 'material',
    supplier: editingItem?.supplier || '',
    laborCategory: editingItem?.laborCategory || '',
    serviceScope: editingItem?.serviceScope || ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = validateRABForm(formData);
    setFormErrors(errors);
    return isFormValid(errors);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    if (!validateForm()) {
      return { success: false, errors: formErrors };
    }
    
    setIsSubmitting(true);
    
    try {
      const workflow = getWorkflowForItemType(formData.itemType);
      const paymentMethod = getPaymentMethodForItemType(formData.itemType);
      
      const itemData = {
        category: formData.category,
        description: formData.description,
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        totalPrice: parseFloat(formData.quantity) * parseFloat(formData.unitPrice),
        notes: formData.specifications || '',
        itemType: formData.itemType,
        workflow: workflow,
        paymentMethod: paymentMethod,
        // Type-specific fields
        supplier: formData.itemType === 'material' ? formData.supplier : null,
        laborCategory: formData.itemType === 'labor' ? formData.laborCategory : null,
        serviceScope: formData.itemType === 'service' ? formData.serviceScope : null
      };

      const result = await onSubmit(itemData);
      
      if (result.success) {
        resetForm();
      }
      
      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: '',
      description: '',
      unit: '',
      quantity: 0,
      unitPrice: 0,
      specifications: '',
      itemType: 'material',
      supplier: '',
      laborCategory: '',
      serviceScope: ''
    });
    setFormErrors({});
    setIsSubmitting(false);
  };

  const loadEditData = (item) => {
    setFormData({
      category: item.category || '',
      description: item.description || '',
      unit: item.unit || '',
      quantity: item.quantity || 0,
      unitPrice: item.unitPrice || 0,
      specifications: item.specifications || '',
      itemType: item.itemType || 'material',
      supplier: item.supplier || '',
      laborCategory: item.laborCategory || '',
      serviceScope: item.serviceScope || ''
    });
    setFormErrors({});
  };

  return {
    formData,
    formErrors,
    isSubmitting,
    handleChange,
    handleSubmit,
    resetForm,
    loadEditData,
    setFormData
  };
};

export default useRABForm;
