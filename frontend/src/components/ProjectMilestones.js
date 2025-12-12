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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow-label text-white/60">Workflow</p>
          <h3 className="text-xl font-semibold text-white">Project Milestones</h3>
          <p className="text-sm text-white/60">Kelola tonggak pencapaian proyek</p>
        </div>
        <button 
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingMilestone(null);
          }}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] via-[#2563eb] to-[#7c3aed] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(37,99,235,0.35)] transition hover:brightness-110"
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
          <div className="flex h-full items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-16 text-center">
            <div>
              <p className="text-lg font-semibold text-white">Belum Ada Milestone</p>
              <p className="text-sm text-white/60">Tambahkan milestone baru untuk memulai tracking</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMilestones;
