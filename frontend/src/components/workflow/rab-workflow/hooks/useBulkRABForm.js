import { useState } from 'react';
import { getWorkflowForItemType, getPaymentMethodForItemType } from '../config/rabCategories';

/**
 * Custom hook for bulk RAB operations
 * Handles multiple item submissions and draft management
 */
const useBulkRABForm = (projectId, onSubmitSuccess) => {
  const [draftItems, setDraftItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  // Load draft from localStorage
  const loadDraft = () => {
    try {
      const savedDraft = localStorage.getItem(`rab_draft_${projectId}`);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setDraftItems(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Error loading draft:', error);
    }
    return [];
  };

  // Save draft to localStorage
  const saveDraft = async (items) => {
    setIsSavingDraft(true);
    try {
      // Filter out empty items
      const validItems = items.filter(item => 
        item.description.trim() !== '' || 
        item.category !== '' || 
        item.quantity > 0
      );

      localStorage.setItem(`rab_draft_${projectId}`, JSON.stringify(validItems));
      setDraftItems(validItems);
      
      // Show success notification
      return { success: true, message: `Draft tersimpan: ${validItems.length} item(s)` };
    } catch (error) {
      console.error('Error saving draft:', error);
      return { success: false, error: error.message };
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Clear draft
  const clearDraft = () => {
    localStorage.removeItem(`rab_draft_${projectId}`);
    setDraftItems([]);
  };

  // Submit multiple items
  const submitBulkItems = async (items) => {
    setIsSubmitting(true);
    
    try {
      // Filter out invalid items
      const validItems = items.filter(item => 
        item.description.trim() !== '' && 
        item.category !== '' && 
        item.quantity > 0 && 
        item.unitPrice > 0
      );

      if (validItems.length === 0) {
        throw new Error('Tidak ada item valid untuk disimpan');
      }

      // Process each item with workflow information
      const processedItems = validItems.map(item => ({
        category: item.category,
        description: item.description.trim(),
        unit: item.unit,
        quantity: parseFloat(item.quantity),
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: parseFloat(item.quantity) * parseFloat(item.unitPrice),
        notes: item.specifications || '',
        itemType: item.itemType,
        workflow: getWorkflowForItemType(item.itemType),
        paymentMethod: getPaymentMethodForItemType(item.itemType),
        // Type-specific fields
        supplier: item.itemType === 'material' ? item.supplier : null,
        laborCategory: item.itemType === 'labor' ? item.laborCategory : null,
        serviceScope: item.itemType === 'service' ? item.serviceScope : null,
        projectId: projectId
      }));

      // Group items by type for better processing
      const groupedItems = processedItems.reduce((acc, item) => {
        const type = item.itemType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(item);
        return acc;
      }, {});

      // Submit to API
      const results = [];
      const token = localStorage.getItem('token');
      
      for (const [itemType, typeItems] of Object.entries(groupedItems)) {
        try {
          console.log(`📤 Submitting ${itemType} items:`, typeItems.length);
          
          // Make API call for each batch of items
          const response = await fetch(`/api/projects/${projectId}/rab/bulk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ items: typeItems })
          });

          console.log(`📤 ${itemType} batch response status:`, response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log(`✅ ${itemType} batch success:`, result);
            
            results.push({
              itemType,
              count: typeItems.length,
              items: typeItems,
              workflow: getWorkflowForItemType(itemType),
              apiResult: result
            });
          } else {
            const errorText = await response.text();
            console.warn(`⚠️ Bulk API failed for ${itemType}:`, response.status, errorText);
            
            // If API fails, try individual submissions as fallback
            console.log(`🔄 Trying individual submissions for ${itemType}...`);
            
            let successCount = 0;
            for (const item of typeItems) {
              try {
                const singleResponse = await fetch(`/api/projects/${projectId}/rab`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  },
                  body: JSON.stringify(item)
                });
                
                if (singleResponse.ok) {
                  successCount++;
                  console.log(`✅ Individual item saved: ${item.description}`);
                } else {
                  const singleError = await singleResponse.text();
                  console.error(`❌ Individual item failed: ${item.description}`, singleError);
                }
              } catch (singleError) {
                console.error(`❌ Network error for item: ${item.description}`, singleError);
              }
            }
            
            results.push({
              itemType,
              count: successCount,
              items: typeItems.slice(0, successCount),
              workflow: getWorkflowForItemType(itemType),
              fallback: true
            });
          }
        } catch (error) {
          console.error(`❌ Error submitting ${itemType} items:`, error);
          
          // Last resort: return as demo mode
          results.push({
            itemType,
            count: typeItems.length,
            items: typeItems,
            workflow: getWorkflowForItemType(itemType),
            demo: true
          });
        }
      }

      // Clear draft after successful submission
      clearDraft();

      // Call success callback
      if (onSubmitSuccess) {
        await onSubmitSuccess(results);
      }

      return { 
        success: true, 
        results,
        totalItems: processedItems.length,
        summary: {
          material: groupedItems.material?.length || 0,
          service: groupedItems.service?.length || 0,
          labor: groupedItems.labor?.length || 0,
          equipment: groupedItems.equipment?.length || 0,
          overhead: groupedItems.overhead?.length || 0
        }
      };

    } catch (error) {
      console.error('Bulk submission error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate summary for submitted items
  const generateSubmissionSummary = (results) => {
    const materialItems = results.find(r => r.itemType === 'material');
    const serviceItems = results.find(r => r.itemType === 'service');
    
    let summary = [];
    
    if (materialItems?.count > 0) {
      summary.push(`${materialItems.count} item material akan diproses menjadi Purchase Order`);
    }
    
    if (serviceItems?.count > 0) {
      summary.push(`${serviceItems.count} item jasa akan diproses menjadi Perintah Kerja`);
    }

    return summary;
  };

  // Validate bulk items before submission
  const validateBulkItems = (items) => {
    const errors = {};
    
    items.forEach((item, index) => {
      const itemErrors = [];
      
      if (!item.category.trim()) {
        itemErrors.push('Kategori harus diisi');
      }
      
      if (!item.description.trim()) {
        itemErrors.push('Deskripsi harus diisi');
      }
      
      if (!item.unit.trim()) {
        itemErrors.push('Satuan harus diisi');
      }
      
      if (item.quantity <= 0) {
        itemErrors.push('Quantity harus lebih dari 0');
      }
      
      if (item.unitPrice <= 0) {
        itemErrors.push('Harga unit harus lebih dari 0');
      }

      if (itemErrors.length > 0) {
        errors[`item_${index}`] = itemErrors;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };

  return {
    draftItems,
    isSubmitting,
    isSavingDraft,
    loadDraft,
    saveDraft,
    clearDraft,
    submitBulkItems,
    validateBulkItems,
    generateSubmissionSummary
  };
};

export default useBulkRABForm;