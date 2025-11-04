import { useState, useEffect } from 'react';
import { projectAPI } from '../../../services/api';

export const useMilestoneForm = (projectId, milestone, onSuccess) => {
  const [formData, setFormData] = useState(milestone || {
    name: '',
    description: '',
    targetDate: '',
    budget: 0,
    priority: 'medium',
    status: 'pending',
    progress: 0,
    deliverables: [''],
    assignedTeam: [],
    dependencies: [],
    notes: ''
  });

  // Ensure deliverables is always an array
  useEffect(() => {
    if (milestone) {
      setFormData({
        ...milestone,
        deliverables: milestone.deliverables || [''],
        assignedTeam: milestone.assignedTeam || [],
        dependencies: milestone.dependencies || [],
        priority: milestone.priority || 'medium',
        budget: milestone.budget || 0
      });
    }
  }, [milestone]);

  const updateDeliverable = (index, value) => {
    const currentDeliverables = formData.deliverables || [''];
    const newDeliverables = [...currentDeliverables];
    newDeliverables[index] = value;
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const addDeliverable = () => {
    const currentDeliverables = formData.deliverables || [];
    setFormData({ 
      ...formData, 
      deliverables: [...currentDeliverables, ''] 
    });
  };

  const removeDeliverable = (index) => {
    const currentDeliverables = formData.deliverables || [];
    const newDeliverables = currentDeliverables.filter((_, i) => i !== index);
    setFormData({ ...formData, deliverables: newDeliverables });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Map frontend fields to backend fields (match Joi schema)
      const milestoneItemData = {
        title: formData.name || formData.title,
        description: formData.description || '',
        targetDate: formData.targetDate,
        budget: formData.budget || 0,
        priority: formData.priority || 'medium',
        status: formData.status || 'pending',
        progress: formData.progress || 0
      };

      // If RAB is linked, use RAB total value as budget (override manual input)
      if (formData.rabLink?.enabled && formData.rabLink?.totalValue) {
        milestoneItemData.budget = formData.rabLink.totalValue;
        console.log('[useMilestoneForm] Using RAB total value as budget:', formData.rabLink.totalValue);
      }

      // Only add optional fields if they have values
      if (formData.assignedTeam?.[0]) {
        milestoneItemData.assignedTo = formData.assignedTeam[0];
      }
      
      if (formData.notes) {
        milestoneItemData.notes = formData.notes;
      }

      // Add deliverables if exists (filter out empty strings)
      if (formData.deliverables && formData.deliverables.length > 0) {
        const validDeliverables = formData.deliverables.filter(d => d && d.trim() !== '');
        if (validDeliverables.length > 0) {
          milestoneItemData.deliverables = validDeliverables;
        }
      }

      // Add dependencies if exists (filter out empty strings)
      if (formData.dependencies && formData.dependencies.length > 0) {
        const validDependencies = formData.dependencies.filter(d => d && d.trim() !== '');
        if (validDependencies.length > 0) {
          milestoneItemData.dependencies = validDependencies;
        }
      }

      // Add RAB link if exists (new field to replace category_link)
      if (formData.rabLink) {
        // Ensure categoryName is present for backend mapping. Some older UI
        // flows only provide totalValue/totalItems (complete RAB summary)
        // while backend expects a specific category name when querying
        // per-category RAB items. Use available fallbacks safely.
        const rab = { ...formData.rabLink };
        if (!rab.categoryName && !rab.category_name) {
          // Prefer explicit `categories[0].category` when available
          const fallbackCategory = rab.categories && rab.categories.length > 0
            ? rab.categories[0].category
            : undefined;
          if (fallbackCategory) {
            rab.categoryName = fallbackCategory;
          }
        }

        milestoneItemData.rab_link = rab;
      }

      console.log('[useMilestoneForm] Submitting milestone data:', milestoneItemData);

      if (milestone) {
        // Update existing milestone
        await projectAPI.updateMilestone(projectId, milestone.id, milestoneItemData);
        alert('Milestone berhasil diperbarui!');
      } else {
        // Create new milestone
        await projectAPI.createMilestone(projectId, milestoneItemData);
        alert('Milestone berhasil ditambahkan!');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Gagal menyimpan milestone. Silakan coba lagi.');
    }
  };

  return {
    formData,
    setFormData,
    updateDeliverable,
    addDeliverable,
    removeDeliverable,
    handleSubmit
  };
};
