/**
 * useTaxRecords Hook
 * Custom hook for managing tax records CRUD operations
 */

import { useState } from 'react';
import { taxAPI } from '../../../services/api';
import { validateTaxForm } from '../utils/validators';

export const useTaxRecords = () => {
  const [taxRecords, setTaxRecords] = useState([]);
  const [loadingTaxRecords, setLoadingTaxRecords] = useState(false);
  
  const [showTaxForm, setShowTaxForm] = useState(false);
  const [taxForm, setTaxForm] = useState({
    type: 'pajak_penghasilan',
    amount: '',
    period: new Date().toISOString().slice(0, 7),
    description: '',
    dueDate: '',
    paymentDate: '',
    status: 'unpaid'
  });
  const [isSubmittingTax, setIsSubmittingTax] = useState(false);
  const [taxFormErrors, setTaxFormErrors] = useState({});
  const [selectedTax, setSelectedTax] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  /**
   * Fetch tax records
   */
  const fetchTaxRecords = async () => {
    try {
      setLoadingTaxRecords(true);
      const response = await taxAPI.getAll();
      
      if (response.success) {
        setTaxRecords(response.data);
      } else {
        console.error('Failed to fetch tax records:', response.error);
      }
    } catch (error) {
      console.error('Error fetching tax records:', error);
    } finally {
      setLoadingTaxRecords(false);
    }
  };

  /**
   * Handle tax form change
   */
  const handleTaxFormChange = (field, value) => {
    setTaxForm(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (taxFormErrors[field]) {
      setTaxFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  /**
   * Reset tax form
   */
  const resetTaxForm = () => {
    setTaxForm({
      type: 'pajak_penghasilan',
      amount: '',
      period: new Date().toISOString().slice(0, 7),
      description: '',
      dueDate: '',
      paymentDate: '',
      status: 'unpaid'
    });
    setTaxFormErrors({});
  };

  /**
   * Submit tax record
   */
  const handleSubmitTax = async (e) => {
    e.preventDefault();
    
    const validation = validateTaxForm(taxForm);
    if (!validation.isValid) {
      setTaxFormErrors(validation.errors);
      return;
    }
    
    try {
      setIsSubmittingTax(true);
      
      const submitData = {
        ...taxForm,
        amount: parseFloat(taxForm.amount)
      };
      
      const response = await taxAPI.create(submitData);
      
      if (response.success) {
        resetTaxForm();
        setShowTaxForm(false);
        fetchTaxRecords();
        return { success: true, message: 'Tax record created successfully!' };
      } else {
        throw new Error(response.error || 'Failed to create tax record');
      }
    } catch (error) {
      console.error('Error creating tax record:', error);
      return { 
        success: false, 
        message: 'Error creating tax record: ' + error.message 
      };
    } finally {
      setIsSubmittingTax(false);
    }
  };

  /**
   * Handle delete tax
   */
  const handleDeleteTax = (tax) => {
    setSelectedTax(tax);
    setShowDeleteModal(true);
  };

  /**
   * Confirm delete tax
   */
  const confirmDeleteTax = async () => {
    if (!selectedTax) return;
    
    try {
      console.log('Deleting tax record:', selectedTax.id);
      const response = await taxAPI.delete(selectedTax.id);
      
      if (response.success) {
        alert('Tax record deleted successfully!');
        setShowDeleteModal(false);
        setSelectedTax(null);
        fetchTaxRecords();
      } else {
        alert('Failed to delete tax record: ' + response.error);
      }
    } catch (error) {
      console.error('Error deleting tax record:', error);
      alert('Error deleting tax record: ' + error.message);
    }
  };

  /**
   * Cancel delete
   */
  const cancelDeleteTax = () => {
    setShowDeleteModal(false);
    setSelectedTax(null);
  };

  return {
    taxRecords,
    loadingTaxRecords,
    showTaxForm,
    setShowTaxForm,
    taxForm,
    isSubmittingTax,
    taxFormErrors,
    fetchTaxRecords,
    handleTaxFormChange,
    resetTaxForm,
    handleSubmitTax,
    selectedTax,
    setSelectedTax,
    showDeleteModal,
    setShowDeleteModal,
    handleDeleteTax,
    confirmDeleteTax,
    cancelDeleteTax
  };
};
