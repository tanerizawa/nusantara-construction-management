import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTeamMembers } from './team/hooks/useTeamMembers';
import { useEmployees } from './team/hooks/useEmployees';
import TeamStatsCards from './team/components/TeamStatsCards';
import TeamSearchBar from './team/components/TeamSearchBar';
import TeamMemberTable from './team/components/TeamMemberTable';
import TeamEmptyState from './team/components/TeamEmptyState';
import TeamMemberInlineForm from './team/components/TeamMemberInlineForm';

const ProjectTeam = ({ project, onUpdate }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  // Custom hooks
  const {
    loading,
    teamStats,
    roles,
    filteredMembers,
    searchTerm,
    setSearchTerm,
    filterRole,
    setFilterRole,
    handleDeleteMember,
    loadTeamMembers
  } = useTeamMembers(project.id);

  const { availableEmployees } = useEmployees();

  // Handle form success
  const handleFormSuccess = async () => {
    await loadTeamMembers();
    onUpdate({ 
      team: {
        updatedAt: new Date().toISOString()
      }
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading team data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="eyebrow-label text-white/60">Resources</p>
          <h3 className="text-xl font-semibold text-white">Project Team</h3>
          <p className="text-sm text-white/60">Kelola anggota tim proyek</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-gradient-to-r from-[#0ea5e9] to-[#7c3aed] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(124,58,237,0.35)] transition hover:brightness-110"
        >
          <Plus size={16} />
          {showAddForm ? 'Tutup Form' : 'Tambah Anggota'}
        </button>
      </div>

      {/* Statistics Cards */}
      <TeamStatsCards teamStats={teamStats} />

      {/* Add Form - Inline (appears when button clicked) */}
      {showAddForm && (
        <TeamMemberInlineForm
          projectId={project.id}
          availableEmployees={availableEmployees}
          roles={roles}
          onClose={() => setShowAddForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Edit Form - Inline (appears when edit clicked) */}
      {editingMember && (
        <TeamMemberInlineForm
          projectId={project.id}
          member={editingMember}
          availableEmployees={availableEmployees}
          roles={roles}
          onClose={() => setEditingMember(null)}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Search and Filter */}
      <TeamSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onFilterChange={setFilterRole}
        roles={roles}
      />

      {/* Team Members Table */}
      <TeamMemberTable
        members={filteredMembers}
        onEdit={(member) => setEditingMember(member)}
        onDelete={handleDeleteMember}
      />

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <TeamEmptyState searchTerm={searchTerm} filterRole={filterRole} />
      )}
    </div>
  );
};

export default ProjectTeam;
