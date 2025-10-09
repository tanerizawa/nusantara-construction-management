import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMilestones } from './milestones/hooks/useMilestones';
import MilestoneStatsCards from './milestones/components/MilestoneStatsCards';
import MilestoneProgressOverview from './milestones/components/MilestoneProgressOverview';
import MilestoneTimelineItem from './milestones/components/MilestoneTimelineItem';
import MilestoneFormModal from './milestones/components/MilestoneFormModal';

const ProjectMilestones = ({ project, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);

  // Custom hook for milestones management
  const {
    milestones,
    loading,
    stats,
    updateMilestoneProgress,
    deleteMilestone,
    loadMilestones
  } = useMilestones(project.id);

  // Handle form success
  const handleFormSuccess = async () => {
    await loadMilestones();
    onUpdate({ 
      timeline: {
        ...project.timeline,
        updatedAt: new Date().toISOString()
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading milestones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Project Milestones</h3>
          <p className="text-gray-600">Kelola tonggak pencapaian proyek</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Tambah Milestone
        </button>
      </div>

      {/* Statistics Cards */}
      <MilestoneStatsCards stats={stats} />

      {/* Progress Overview */}
      <MilestoneProgressOverview stats={stats} />

      {/* Milestones Timeline */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b">
          <h4 className="font-semibold">Timeline Milestone</h4>
        </div>
        
        <div className="divide-y divide-gray-200">
          {milestones.map((milestone, index) => (
            <MilestoneTimelineItem
              key={milestone.id}
              milestone={milestone}
              index={index}
              isLast={index === milestones.length - 1}
              onEdit={() => setEditingMilestone(milestone)}
              onDelete={() => deleteMilestone(milestone.id)}
              onProgressUpdate={updateMilestoneProgress}
            />
          ))}
        </div>
      </div>

      {/* Forms */}
      {showAddForm && (
        <MilestoneFormModal
          projectId={project.id}
          onClose={() => setShowAddForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
      
      {editingMilestone && (
        <MilestoneFormModal
          projectId={project.id}
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ProjectMilestones;
