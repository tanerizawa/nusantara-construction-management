import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import { useMilestones } from './milestones/hooks/useMilestones';
import MilestoneStatsCards from './milestones/components/MilestoneStatsCards';
import MilestoneProgressOverview from './milestones/components/MilestoneProgressOverview';
import MilestoneDetailPanel from './milestones/components/MilestoneDetailPanel';
import MilestoneInlineForm from './milestones/components/MilestoneInlineForm';

const ProjectMilestones = ({ project, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [selectedMilestone, setSelectedMilestone] = useState(null);

  // Custom hook for milestones management
  const {
    milestones,
    loading,
    stats,
    updateMilestoneProgress,
    deleteMilestone,
    approveMilestone,
    loadMilestones
  } = useMilestones(project.id);

  // Auto-select first milestone when milestones load
  useEffect(() => {
    if (milestones.length > 0 && !selectedMilestone) {
      setSelectedMilestone(milestones[0]);
    }
  }, [milestones, selectedMilestone]);

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
            setEditingMilestone(null);
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

      {/* Inline Add Form */}
      {showAddForm && (
        <MilestoneInlineForm
          projectId={project.id}
          project={project}
          onClose={() => setShowAddForm(false)}
          onSuccess={() => {
            handleFormSuccess();
            setShowAddForm(false);
          }}
        />
      )}

      {/* Inline Edit Form */}
      {editingMilestone && (
        <MilestoneInlineForm
          projectId={project.id}
          project={project}
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

      {/* FULL WIDTH DETAIL PANEL ONLY */}
      <div className="w-full">
        {selectedMilestone ? (
          <MilestoneDetailPanel
            milestone={selectedMilestone}
            milestones={milestones}
            onMilestoneChange={setSelectedMilestone}
            projectId={project.id}
            onEdit={() => {
              setEditingMilestone(selectedMilestone);
              setShowAddForm(false);
            }}
            onDelete={async () => {
              if (window.confirm(`Are you sure you want to delete "${selectedMilestone.title || selectedMilestone.name}"?`)) {
                const currentIndex = milestones.findIndex(m => m.id === selectedMilestone.id);
                const nextMilestone = milestones[currentIndex + 1] || milestones[currentIndex - 1] || null;
                
                const success = await deleteMilestone(selectedMilestone.id);
                
                if (success) {
                  // Select next milestone after deletion
                  setSelectedMilestone(nextMilestone);
                  
                  // Reload milestones to ensure UI is in sync
                  await loadMilestones();
                }
              }
            }}
            onApprove={() => approveMilestone(selectedMilestone.id)}
            onProgressUpdate={updateMilestoneProgress}
          />
        ) : (
          <div className="bg-[#2C2C2E] rounded-lg border border-[#38383A] p-16 text-center h-full flex items-center justify-center">
            <div>
              <p className="text-[#8E8E93] text-lg mb-2">No Milestone Available</p>
              <p className="text-[#636366] text-sm">Add a new milestone to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMilestones;
