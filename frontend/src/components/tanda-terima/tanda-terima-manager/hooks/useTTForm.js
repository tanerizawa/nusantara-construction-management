import { useState } from 'react';

/**
 * Custom hook for Tanda Terima form management
 */
const useTTForm = (availablePOs, onSuccess) => {
  const [formData, setFormData] = useState({
    purchaseOrderId: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliveryLocation: '',
    receiverName: '',
    receiverPosition: '',
    receiverPhone: '',
    supplierDeliveryPerson: '',
    supplierDeliveryPhone: '',
    vehicleNumber: '',
    deliveryMethod: 'truck',
    receiptType: 'full_delivery',
    items: [],
    qualityNotes: '',
    conditionNotes: '',
    deliveryNotes: '',
    photos: [],
    documents: []
  });

  const [creating, setCreating] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Auto-populate items when PO is selected
    if (field === 'purchaseOrderId' && value) {
      const selectedPO = availablePOs.find(po => po.id === value);
      if (selectedPO && selectedPO.items) {
        const items = selectedPO.items.map(item => ({
          itemName: item.itemName || item.name,
          orderedQuantity: item.quantity || 0,
          deliveredQuantity: 0,
          unitPrice: item.unitPrice || 0,
          unit: item.unit || 'pcs',
          condition: 'good',
          notes: ''
        }));
        setFormData(prev => ({
          ...prev,
          items
        }));
      }
    }
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleSubmit = async (e, projectId) => {
    e.preventDefault();
    try {
      setCreating(true);

      const payload = {
        ...formData,
        deliveryDate: formData.deliveryDate || new Date().toISOString()
      };

      const response = await fetch(`/api/projects/${projectId}/delivery-receipts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        resetForm();
        if (onSuccess) onSuccess();
        return { success: true };
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create delivery receipt'}`);
        return { success: false };
      }
    } catch (error) {
      console.error('Error creating delivery receipt:', error);
      alert('Error creating delivery receipt');
      return { success: false };
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      purchaseOrderId: '',
      deliveryDate: new Date().toISOString().split('T')[0],
      deliveryLocation: '',
      receiverName: '',
      receiverPosition: '',
      receiverPhone: '',
      supplierDeliveryPerson: '',
      supplierDeliveryPhone: '',
      vehicleNumber: '',
      deliveryMethod: 'truck',
      receiptType: 'full_delivery',
      items: [],
      qualityNotes: '',
      conditionNotes: '',
      deliveryNotes: '',
      photos: [],
      documents: []
    });
  };

  return {
    formData,
    creating,
    handleInputChange,
    handleItemChange,
    handleSubmit,
    resetForm
  };
};

export default useTTForm;
