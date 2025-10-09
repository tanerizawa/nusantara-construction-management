import { useState, useEffect, useMemo } from 'react';
import { projectAPI } from '../../../services/api';
import { calculateTeamStats, filterTeamMembers, countRoles } from '../utils/teamCalculations';
import { TEAM_ROLES } from '../config/rolesConfig';

export const useTeamMembers = (projectId) => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  // Load existing team members from database
  const loadTeamMembers = async () => {
    try {
      const response = await projectAPI.getTeamMembers(projectId);
      if (response.data && response.data.length > 0) {
        // Map backend data to frontend format
        const mappedMembers = response.data.map(member => ({
          id: member.id,
          employeeId: member.employeeId,
          name: member.name,
          role: member.role,
          email: member.email || '',
          phone: member.phone || '',
          joinDate: member.joinDate ? member.joinDate.split('T')[0] : '',
          allocation: parseFloat(member.allocation) || 100,
          hourlyRate: parseFloat(member.hourlyRate) || 0,
          totalHours: parseFloat(member.totalHours) || 0,
          totalCost: parseFloat(member.totalCost) || 0,
          status: member.status || 'active',
          skills: member.skills ? (typeof member.skills === 'string' ? JSON.parse(member.skills) : member.skills) : [],
          certifications: member.certifications ? (typeof member.certifications === 'string' ? JSON.parse(member.certifications) : member.certifications) : [],
          performance: parseFloat(member.performance) || 0,
          responsibilities: member.responsibilities ? (typeof member.responsibilities === 'string' ? JSON.parse(member.responsibilities) : member.responsibilities) : [],
          notes: member.notes || '',
          createdAt: member.createdAt,
          updatedAt: member.updatedAt
        }));
        setTeamMembers(mappedMembers);
      } else {
        setTeamMembers([]);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
      setTeamMembers([]);
    } finally {
      setLoading(false);
    }
  };

  // Load team members when component mounts
  useEffect(() => {
    loadTeamMembers();
  }, [projectId]);

  // Calculate team statistics
  const teamStats = useMemo(() => 
    calculateTeamStats(teamMembers), 
    [teamMembers]
  );

  // Count roles
  const roles = useMemo(() => 
    countRoles(teamMembers, TEAM_ROLES), 
    [teamMembers]
  );

  // Filter team members
  const filteredMembers = useMemo(() => 
    filterTeamMembers(teamMembers, searchTerm, filterRole),
    [teamMembers, searchTerm, filterRole]
  );

  // Delete team member
  const handleDeleteMember = async (memberId) => {
    if (!window.confirm('Yakin ingin menghapus anggota tim ini?')) return;
    
    try {
      await projectAPI.removeTeamMember(projectId, memberId);
      await loadTeamMembers();
      alert('Anggota tim berhasil dihapus!');
      return true;
    } catch (error) {
      console.error('Error removing team member:', error);
      alert('Gagal menghapus anggota tim. Silakan coba lagi.');
      return false;
    }
  };

  return {
    teamMembers,
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
  };
};
