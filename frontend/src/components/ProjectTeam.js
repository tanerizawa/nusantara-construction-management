import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTeamMembers } from './team/hooks/useTeamMembers';
import { useEmployees } from './team/hooks/useEmployees';
import TeamStatsCards from './team/components/TeamStatsCards';
import TeamSearchBar from './team/components/TeamSearchBar';
import TeamMemberCard from './team/components/TeamMemberCard';
import TeamEmptyState from './team/components/TeamEmptyState';
import TeamMemberFormModal from './team/components/TeamMemberFormModal';

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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Project Team</h3>
          <p className="text-gray-600">Kelola anggota tim proyek</p>
        </div>
        <button 
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={16} />
          Tambah Anggota
        </button>
      </div>

      {/* Statistics Cards */}
      <TeamStatsCards teamStats={teamStats} />

      {/* Search and Filter */}
      <TeamSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterRole={filterRole}
        onFilterChange={setFilterRole}
        roles={roles}
      />

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredMembers.map((member) => (
          <TeamMemberCard
            key={member.id}
            member={member}
            onEdit={() => setEditingMember(member)}
            onDelete={() => handleDeleteMember(member.id)}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <TeamEmptyState searchTerm={searchTerm} filterRole={filterRole} />
      )}

      {/* Forms */}
      {showAddForm && (
        <TeamMemberFormModal
          projectId={project.id}
          availableEmployees={availableEmployees}
          roles={roles}
          onClose={() => setShowAddForm(false)}
          onSuccess={handleFormSuccess}
        />
      )}
      
      {editingMember && (
        <TeamMemberFormModal
          projectId={project.id}
          member={editingMember}
          availableEmployees={availableEmployees}
          roles={roles}
          onClose={() => setEditingMember(null)}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ProjectTeam;
