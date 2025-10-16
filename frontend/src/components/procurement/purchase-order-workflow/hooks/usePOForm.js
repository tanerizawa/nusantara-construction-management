import { useState } from 'react';
import { createPurchaseOrder } from '../services/poAPI';
import { validatePOForm, generatePOData } from '../utils/poUtils';
import { DEFAULT_SUPPLIER_INFO } from '../config/poConfig';

/**
 * Custom hook for managing purchase order creation form
 */
export const usePOForm = (project, rabItems, onSuccess, onError) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [supplierInfo, setSupplierInfo] = useState(DEFAULT_SUPPLIER_INFO);
  const [loading, setLoading] = useState(false);

  const handleItemToggle = (rabItem) => {
    const isSelected = selectedItems.find(item => item.id === rabItem.id);
    
    if (isSelected) {
      setSelectedItems(selectedItems.filter(item => item.id !== rabItem.id));
    } else {
      setSelectedItems([...selectedItems, { 
        ...rabItem, 
        orderQuantity: 1,
        unitPrice: rabItem.unitPrice || 0
      }]);
    }
  };

  const handleQuantityChange = (itemId, quantity) => {
    setSelectedItems(selectedItems.map(item => 
      item.id === itemId ? { ...item, orderQuantity: quantity } : item
    ));
  };

  const handleSupplierInfoChange = (field, value) => {
    setSupplierInfo(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setSelectedItems([]);
    setSupplierInfo(DEFAULT_SUPPLIER_INFO);
  };

  const submitPO = async () => {
    try {
      setLoading(true);

      // Validate form
      const validation = validatePOForm(supplierInfo, selectedItems);
      if (!validation.isValid) {
        alert('Error:\n' + validation.errors.join('\n'));
        return { success: false };
      }

      // Generate PO data
      const poData = generatePOData(project, supplierInfo, selectedItems);

      // Submit to API
      const result = await createPurchaseOrder(poData);

      if (result.success) {
        resetForm();
        if (onSuccess) {
          onSuccess(result.data);
        }
        alert('Purchase Order berhasil dibuat');
        return { success: true };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Error creating purchase order:', error);
      if (onError) {
        onError(error.message);
      }
      alert('Gagal membuat Purchase Order: ' + error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  return {
    // State
    selectedItems,
    supplierInfo,
    loading,
    
    // Actions
    handleItemToggle,
    handleQuantityChange,
    handleSupplierInfoChange,
    submitPO,
    resetForm
  };
};