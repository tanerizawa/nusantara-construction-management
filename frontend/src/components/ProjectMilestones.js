import React, { useState } from 'react';
import { Plus, X, Lightbulb } from 'lucide-react';
import { useMilestones } from './milestones/hooks/useMilestones';
import MilestoneStatsCards from './milestones/components/MilestoneStatsCards';
import MilestoneProgressOverview from './milestones/components/MilestoneProgressOverview';
import MilestoneTimelineItem from './milestones/components/MilestoneTimelineItem';
import MilestoneInlineForm from './milestones/components/MilestoneInlineForm';
import MilestoneSuggestionModal from './milestones/MilestoneSuggestionModal';
import api from '../services/api';

const ProjectMilestones = ({ project, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  // Handle creating milestones from suggestions
  const handleCreateFromSuggestions = async (selectedSuggestions) => {
    try {
      // Create milestones from suggestions
      const promises = selectedSuggestions.map(suggestion => 
        api.post(`/projects/${project.id}/milestones`, {
          title: suggestion.suggestedTitle,
          description: `Auto-generated milestone from RAB category: ${suggestion.category.name}`,
          start_date: suggestion.suggestedStartDate,
          end_date: suggestion.suggestedEndDate,
          status: 'planning',
          progress: 0,
          category_link: {
            enabled: true,
            category_id: suggestion.category.id || null,
            category_name: suggestion.category.name,
            auto_generated: true
          },
          auto_generated: true
        })
      );

      await Promise.all(promises);
      await handleFormSuccess();
    } catch (error) {
      console.error('Error creating milestones from suggestions:', error);
    }
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
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowSuggestions(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#FF9F0A]/20 text-[#FF9F0A] border border-[#FF9F0A]/30 rounded-lg hover:bg-[#FF9F0A]/30 transition-colors"
          >
            <Lightbulb size={16} />
            Auto Suggest
          </button>
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

      {/* Milestone Suggestion Modal */}
      {showSuggestions && (
        <MilestoneSuggestionModal
          projectId={project.id}
          onClose={() => setShowSuggestions(false)}
          onCreateMilestones={handleCreateFromSuggestions}
        />
      )}
    </div>
  );
};

export default ProjectMilestones;
