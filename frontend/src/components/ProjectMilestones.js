import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useMilestones } from './milestones/hooks/useMilestones';
import MilestoneStatsCards from './milestones/components/MilestoneStatsCards';
import MilestoneProgressOverview from './milestones/components/MilestoneProgressOverview';
import MilestoneTimelineItem from './milestones/components/MilestoneTimelineItem';
import MilestoneInlineForm from './milestones/components/MilestoneInlineForm';

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0A84FF] mx-auto"></div>
          <p className="mt-2 text-[#8E8E93]">Loading milestones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold text-white">Project Milestones</h3>
          <p className="text-[#8E8E93]">Kelola tonggak pencapaian proyek</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingMilestone(null); // Close edit form when opening add form
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#0A84FF] text-white rounded-lg hover:bg-[#0A84FF]/90 transition-colors"
        >
          {showAddForm ? (
            <>
              <X size={16} />
              Tutup Form
            </>
          ) : (
            <>
              <Plus size={16} />
              Tambah Milestone
            </>
          )}
        </button>
      </div>

      {/* Statistics Cards */}
      <MilestoneStatsCards stats={stats} />

      {/* Inline Add Form - Shows above Progress Overview */}
      {showAddForm && (
        <MilestoneInlineForm
          projectId={project.id}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            handleFormSuccess();
            setShowAddForm(false);
          }}
        />
      )}

      {/* Inline Edit Form - Shows above Progress Overview */}
      {editingMilestone && (
        <MilestoneInlineForm
          projectId={project.id}
          milestone={editingMilestone}
          onClose={() => setEditingMilestone(null)}
          onSuccess={() => {
            handleFormSuccess();
            setEditingMilestone(null);
          }}
        />
      )}

      {/* Progress Overview */}
      <MilestoneProgressOverview stats={stats} />

      {/* Milestones Timeline */}
      <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] overflow-hidden">
        <div className="p-4 border-b border-[#38383A]">
          <h4 className="font-semibold text-white">Timeline Milestone</h4>
        </div>
        
        <div className="divide-y divide-[#38383A]">
          {milestones.map((milestone, index) => (
            <MilestoneTimelineItem
              key={milestone.id}
              milestone={milestone}
              index={index}
              isLast={index === milestones.length - 1}
              onEdit={() => {
                setEditingMilestone(milestone);
                setShowAddForm(false); // Close add form when opening edit form
              }}
              onDelete={() => deleteMilestone(milestone.id)}
              onProgressUpdate={updateMilestoneProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectMilestones;
