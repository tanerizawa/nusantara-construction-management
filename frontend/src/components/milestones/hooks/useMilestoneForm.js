import { useState, useEffect } from 'react';
import { projectAPI } from '../../../services/api';

export const useMilestoneForm = (projectId, milestone, onSuccess) => {
  const [formData, setFormData] = useState(milestone || {
    name: '',
    description: '',
    targetDate: '',
    budget: 0,
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
        dependencies: milestone.dependencies || []
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
      // Map frontend fields to backend fields
      const milestoneItemData = {
        title: formData.name || formData.title,
        description: formData.description,
        targetDate: formData.targetDate,
        assignedTo: formData.assignedTeam?.[0] || null,
        priority: formData.priority || 'medium',
        notes: formData.notes || '',
        createdBy: 'current_user'
      };

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
