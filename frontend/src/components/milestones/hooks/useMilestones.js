import { useState, useEffect, useMemo } from 'react';
import { projectAPI } from '../../../services/api';
import { calculateMilestoneStats } from '../utils/milestoneCalculations';

export const useMilestones = (projectId) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load milestones from database
  const loadMilestones = async () => {
    try {
      const response = await projectAPI.getMilestones(projectId);
      if (response.data && response.data.length > 0) {
        // Map backend data to frontend format
        const mappedMilestones = response.data.map(item => ({
          id: item.id,
          name: item.title || '',
          description: item.description || '',
          targetDate: item.targetDate ? item.targetDate.split('T')[0] : '',
          actualDate: item.completedDate ? item.completedDate.split('T')[0] : null,
          status: item.status || 'pending',
          progress: parseInt(item.progress) || 0,
          budget: parseFloat(item.budget) || 0,
          actualCost: parseFloat(item.actualCost) || 0,
          deliverables: item.deliverables ? (typeof item.deliverables === 'string' ? JSON.parse(item.deliverables) : item.deliverables) : [''],
          assignedTeam: item.assignedTo ? [item.assignedTo] : [],
          dependencies: item.dependencies ? (typeof item.dependencies === 'string' ? JSON.parse(item.dependencies) : item.dependencies) : [],
          notes: item.notes || '',
          priority: item.priority || 'medium',
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setMilestones(mappedMilestones);
      } else {
        setMilestones([]);
      }
    } catch (error) {
      console.error('Error loading milestones:', error);
      setMilestones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMilestones();
  }, [projectId]);

  // Calculate statistics
  const stats = useMemo(() => 
    calculateMilestoneStats(milestones), 
    [milestones]
  );

  // Update milestone progress
  const updateMilestoneProgress = async (milestoneId, progress) => {
    try {
      const milestone = milestones.find(m => m.id === milestoneId);
      if (!milestone) {
        console.error('Milestone not found:', milestoneId);
        alert('Milestone tidak ditemukan. Silakan refresh halaman.');
        return;
      }

      const updatedData = { 
        title: milestone.name || milestone.title,
        description: milestone.description,
        targetDate: milestone.targetDate,
        progress,
        status: progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'pending',
        assignedTo: milestone.assignedTeam?.[0] || null,
        priority: milestone.priority || 'medium',
        notes: milestone.notes || ''
      };

      await projectAPI.updateMilestone(projectId, milestoneId, updatedData);
      
      setMilestones(prev => prev.map(m => 
        m.id === milestoneId ? { ...milestone, ...updatedData } : m
      ));
    } catch (error) {
      console.error('Error updating milestone progress:', error);
      alert('Error updating milestone progress. Please try again.');
    }
  };

  // Delete milestone
  const deleteMilestone = async (milestoneId) => {
    if (!window.confirm('Yakin ingin menghapus milestone ini?')) return;
    
    try {
      await projectAPI.deleteMilestone(projectId, milestoneId);
      setMilestones(prev => prev.filter(milestone => milestone.id !== milestoneId));
      alert('Milestone berhasil dihapus!');
      return true;
    } catch (error) {
      console.error('Error deleting milestone:', error);
      alert('Gagal menghapus milestone. Silakan coba lagi.');
      return false;
    }
  };

  return {
    milestones,
    loading,
    stats,
    updateMilestoneProgress,
    deleteMilestone,
    loadMilestones
  };
};
